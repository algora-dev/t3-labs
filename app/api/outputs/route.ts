import { NextResponse } from 'next/server';
import { getOrCreateSession, saveSession } from '@/lib/assistant/session';
import { renderEstimatePdf } from '@/lib/pdf/estimate-pdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Outputs API (spec 14): generate + download the Indicative Roofing Estimate PDF.
 * Every lookup is validated against the CURRENT session only - another
 * session's estimate/output id always 404s (spec 19.5). Outputs expire with
 * the session TTL because the store is the session itself.
 */

/** POST /api/outputs { estimateId } -> { outputId } */
export async function POST(req: Request) {
  let body: { estimateId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const estimateId = typeof body.estimateId === 'string' ? body.estimateId : '';

  const session = await getOrCreateSession();
  const estimate = estimateId ? session.estimates[estimateId] : undefined;
  if (!estimate) {
    return NextResponse.json({ error: 'Estimate not found for this session.' }, { status: 404 });
  }

  // Reuse an existing output ref for the same estimate when present.
  const existing = session.outputs.find((o) => o.estimateId === estimateId);
  const outputId = existing?.id ?? `out_${crypto.randomUUID().slice(0, 10)}`;
  if (!existing) {
    session.outputs.push({ id: outputId, estimateId, createdAt: new Date().toISOString() });
    await saveSession(session);
  }

  return NextResponse.json({ ok: true, outputId });
}

/** GET /api/outputs?id=<outputId> -> PDF stream */
export async function GET(req: Request) {
  const outputId = new URL(req.url).searchParams.get('id') ?? '';

  const session = await getOrCreateSession();
  const ref = session.outputs.find((o) => o.id === outputId);
  if (!ref) {
    return NextResponse.json({ error: 'Output not found for this session.' }, { status: 404 });
  }
  const estimate = session.estimates[ref.estimateId];
  if (!estimate) {
    return NextResponse.json({ error: 'Output not found for this session.' }, { status: 404 });
  }

  const pdf = await renderEstimatePdf(estimate);
  return new Response(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="indicative-estimate-${estimate.id}.pdf"`,
      'Cache-Control': 'no-store',
    },
  });
}
