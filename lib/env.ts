/** Central env access + a flag the app uses to decide between live Supabase
 * data and the bundled seed fallback. This lets the site render fully even
 * before Supabase credentials are configured. */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("YOUR-PROJECT"),
);

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export const SITE_URL =
  (process.env.NODE_ENV === "production" && configuredSiteUrl?.includes("localhost")
    ? undefined
    : configuredSiteUrl) ||
  (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");
