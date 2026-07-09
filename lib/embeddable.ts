import "server-only";
import { unstable_cache } from "next/cache";

/**
 * Determine whether a URL can be shown inside an <iframe> by inspecting its
 * response headers (X-Frame-Options / CSP frame-ancestors). This runs on the
 * server so the client never renders an iframe that is guaranteed to be blocked
 * (e.g. sites behind X-Frame-Options: SAMEORIGIN). Result is cached for 1h.
 */
async function probe(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; VeraSysPreviewBot/1.0)" },
    });
    clearTimeout(timeout);

    const xfo = res.headers.get("x-frame-options")?.toLowerCase() ?? "";
    if (xfo.includes("deny") || xfo.includes("sameorigin")) return false;

    const csp = res.headers.get("content-security-policy")?.toLowerCase() ?? "";
    const fa = csp.match(/frame-ancestors([^;]*)/)?.[1] ?? "";
    if (fa) {
      // Blocked unless it explicitly allows any origin.
      if (fa.includes("'none'")) return false;
      if (!fa.includes("*")) return false;
    }
    return res.ok;
  } catch {
    // Network error / timeout / abort → treat as not embeddable, use fallback.
    return false;
  }
}

export const canEmbed = unstable_cache(
  async (url: string | null): Promise<boolean> => {
    if (!url) return false;
    return probe(url);
  },
  ["can-embed"],
  { revalidate: 3600 },
);
