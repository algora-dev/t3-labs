import { NextRequest, NextResponse } from "next/server";
import { put, list, get } from "@vercel/blob";

/**
 * POST /api/intake/events — store a funnel event (intake_open, intake_start,
 *   intake_step, intake_submit, calendly_view) as a small JSON blob.
 * GET /api/intake/events — list recent events (Bearer INTAKE_ANALYTICS_TOKEN).
 *
 * Storage: Vercel Blob (platform-native, no third-party deps). Records contain
 * no PII — event name, timestamp, random session id, and whitelisted props.
 *
 * Note: requires BLOB_READ_WRITE_TOKEN (Vercel project → Storage → Blob).
 * Store is PRIVATE - blobs are written without public access and read back
 * with the token-authenticated get() API, never via public URLs.
 */

export const maxDuration = 60;

const EVENT_NAMES = new Set([
  "intake_open",
  "intake_start",
  "intake_step",
  "intake_submit",
  "calendly_view",
]);

const MAX_EVENTS_PER_GET = 500;

// Best-effort per-instance rate limit (serverless instances are separate,
// so this caps bursts per instance rather than globally — acceptable here).
const rateHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const maxPerMinute = 30;
  const recent = (rateHits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= maxPerMinute) {
    rateHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateHits.set(ip, recent);
  return false;
}

function sanitizeProps(input: unknown): Record<string, string> {
  if (typeof input !== "object" || input === null) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!/^[a-z_][a-z0-9_]*$/i.test(key)) continue;
    if (typeof value === "boolean" || typeof value === "number") {
      out[key.slice(0, 40)] = String(value);
    } else if (typeof value === "string") {
      out[key.slice(0, 40)] = value.trim().slice(0, 200);
    }
    if (Object.keys(out).length >= 10) break;
  }
  return out;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, reason: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid_json" }, { status: 400 });
  }

  const { event, props, session_id } = (body ?? {}) as {
    event?: unknown;
    props?: unknown;
    session_id?: unknown;
  };

  if (typeof event !== "string" || !EVENT_NAMES.has(event)) {
    return NextResponse.json({ ok: false, reason: "invalid_event" }, { status: 400 });
  }

  const record = {
    event,
    ts: new Date().toISOString(),
    session_id: typeof session_id === "string" ? session_id.slice(0, 64) : null,
    props: sanitizeProps(props),
  };

  try {
    await put(`intake-events/${record.ts}-${crypto.randomUUID()}.json`, JSON.stringify(record), {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
    });
    return NextResponse.json({ ok: true, stored: true });
  } catch (err) {
    // Blob not configured or temporarily unavailable — never disrupt the visitor
    console.error("Intake event storage failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: true, stored: false, reason: err instanceof Error ? err.message : String(err) }, { status: 202 });
  }
}

export async function GET(req: NextRequest) {
  const token = process.env.INTAKE_ANALYTICS_TOKEN;
  if (!token || req.headers.get("authorization") !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limitParam = Number(req.nextUrl.searchParams.get("limit") ?? "200");
  const limit = Math.min(
    Number.isFinite(limitParam) && limitParam > 0 ? Math.floor(limitParam) : 200,
    MAX_EVENTS_PER_GET,
  );

  try {
    const { blobs } = await list({ prefix: "intake-events/", limit });

    const records = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const res = await get(blob.pathname, { access: "private" });
          if (!res) return null;
          const text = await new Response(res.stream).text();
          return JSON.parse(text) as Record<string, unknown>;
        } catch {
          return null;
        }
      }),
    );

    const events = records
      .filter((e): e is Record<string, unknown> => e !== null)
      .sort((a, b) => String(b.ts ?? "").localeCompare(String(a.ts ?? "")));

    return NextResponse.json({ count: events.length, events });
  } catch (err) {
    console.error("Intake event listing failed:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { error: "Blob storage not configured or unavailable." },
      { status: 501 },
    );
  }
}
