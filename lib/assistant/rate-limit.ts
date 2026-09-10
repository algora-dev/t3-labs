import { getAssistantConfig } from './data';

/**
 * Per-IP rate limiting (spec 15.5) - complements the per-session limits in
 * session.ts. In-memory Map keyed by client IP, swept opportunistically.
 * Falls back to the per-session limits if ipRateLimit is not configured.
 */

const WINDOW_MS = 60 * 60_000; // 1 hour rolling window

const ipHits = new Map<string, number[]>();

export type IpGuardResult = { ok: true } | { ok: false; error: string };

function limits() {
  const config = getAssistantConfig();
  return (
    config.ipRateLimit ?? {
      maxMessagesPerMinute: config.rateLimit.maxMessagesPerMinute * 3,
      maxMessagesPerHour: config.rateLimit.maxMessagesPerHour * 3,
    }
  );
}

export function checkIpRateLimit(ip: string): IpGuardResult {
  const { maxMessagesPerMinute, maxMessagesPerHour } = limits();
  const now = Date.now();

  // Opportunistic sweep to bound memory
  if (ipHits.size > 5000) {
    for (const [key, hits] of ipHits) {
      if (!hits.some((t) => now - t < WINDOW_MS)) ipHits.delete(key);
    }
  }

  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  const lastMinute = hits.filter((t) => now - t < 60_000).length;
  if (lastMinute >= maxMessagesPerMinute) {
    return {
      ok: false,
      error: "You're sending messages a bit quickly - please wait a moment and try again.",
    };
  }
  if (hits.length >= maxMessagesPerHour) {
    return {
      ok: false,
      error: 'This demo is receiving a lot of traffic right now. Please try again a little later.',
    };
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return { ok: true };
}

/** Best-effort client IP from proxy headers (Vercel forwards x-forwarded-for). */
export function clientIpFromHeaders(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for');
  if (fwd) {
    const first = fwd.split(',')[0].trim();
    if (first) return first;
  }
  return headers.get('x-real-ip')?.trim() || 'unknown';
}
