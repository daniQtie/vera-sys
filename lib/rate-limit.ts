import "server-only";

/**
 * Lightweight in-memory sliding-window rate limiter for login attempts.
 * Keyed per-IP. Good enough for a single-instance deploy; swap for Upstash
 * Redis if you scale to multiple serverless regions.
 */

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

export function checkLoginRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const key = `login:${ip}`;
  const bucket = store.get(key);

  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_ATTEMPTS - 1, retryAfterSec: 0 };
  }

  if (bucket.count >= MAX_ATTEMPTS) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return {
    ok: true,
    remaining: MAX_ATTEMPTS - bucket.count,
    retryAfterSec: 0,
  };
}

/** Call after a successful login so the user isn't penalised. */
export function resetLoginRateLimit(ip: string) {
  store.delete(`login:${ip}`);
}
