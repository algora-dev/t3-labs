import { NextRequest, NextResponse } from "next/server";
import { BROWSER_EVENT_WHITELIST, insertVisitEvent, queryVisitData } from "@/lib/visit-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Browser-side forensic events for the /custom-proposal lander. Always 204: tracking must never surface errors to visitors. */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      visitId?: unknown;
      event?: unknown;
      clientTs?: unknown;
      stats?: unknown;
      env?: unknown;
      cta?: unknown;
      pct?: unknown;
      isTrusted?: unknown;
      type?: unknown;
      currentTime?: unknown;
    };

    const visitId = typeof body.visitId === "string" ? body.visitId.slice(0, 64) : "";
    const event = typeof body.event === "string" ? body.event : "";
    if (!visitId || !BROWSER_EVENT_WHITELIST.has(event)) {
      return new NextResponse(null, { status: 204 });
    }

    const payload: Record<string, unknown> = { source: "browser" };
    const clientTs = typeof body.clientTs === "string" ? body.clientTs.slice(0, 40) : null;
    if (body.stats && typeof body.stats === "object") payload.stats = body.stats;
    if (body.env && typeof body.env === "object") payload.env = body.env;
    if (typeof body.cta === "string") payload.cta = body.cta.slice(0, 40);
    if (typeof body.pct === "number") payload.pct = body.pct;
    if (typeof body.isTrusted === "boolean") payload.isTrusted = body.isTrusted;
    if (typeof body.type === "string") payload.type = body.type.slice(0, 20);
    if (typeof body.currentTime === "number") payload.currentTime = body.currentTime;

    await insertVisitEvent({ visit_id: visitId, event, client_ts: clientTs, payload });
  } catch {
    /* swallow: never break the visitor experience */
  }
  return new NextResponse(null, { status: 204 });
}

/** Token-protected read: GET /api/visit-events?token=...[&visit_id=...] */
export async function GET(req: NextRequest) {
  const token = process.env.VISIT_STATS_TOKEN;
  const provided = req.nextUrl.searchParams.get("token");
  if (!token || !provided || provided !== token) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  try {
    const visitId = req.nextUrl.searchParams.get("visit_id") || undefined;
    const data = await queryVisitData({ visitId });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "query_failed", detail: String(err) }, { status: 500 });
  }
}
