import { NextResponse } from 'next/server';
import { getOrCreateSession, saveSession } from '@/lib/assistant/session';
import { renderEstimatePdf, renderEstimateRangePdf } from '@/lib/pdf/estimate-pdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Outputs API: generate + download an Indicative Roofing Estimate PDF.
 * Every lookup is validated against the CURRENT session only. Another
 * session's estimate/output id always returns 404. Output references expire
 * with the session because they are stored in the session itself.
 */

function normaliseEstimateIds(body: { estimateId?: unknown; estimateIds?: unknown }): string[] {
  const fromList = Array.isArray(body.estimateIds)
    ? body.estimateIds.filter((id): id is string => typeof id === 'string' && id.length > 0).slice(0, 2)
    : [];
  if (fromList.length) return Array.from(new Set(fromList));
  return typeof body.estimateId === 'string' && body.estimateId ? [body.estimateId] : [];
}

/** POST /api/outputs { estimateId, estimateIds? } -> { outputId } */
export async function POST(req: Request) {
  let body: { estimateId?: unknown; estimateIds?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const estimateIds = normaliseEstimateIds(body);
  if (!estimateIds.length || estimateIds.length > 2) {
    return NextResponse.json({ error: 'A valid estimate reference is required.' }, { status: 400 });
  }

  const session = await getOrCreateSession();
  const estimates = estimateIds.map((id) => session.estimates[id]).filter(Boolean);
  if (estimates.length !== estimateIds.length) {
    return NextResponse.json({ error: 'Estimate not found for this session.' }, { status: 404 });
  }

  const key = [...estimateIds].sort().join('|');
  const existing = session.outputs.find((output) => {
    const ids = output.estimateIds?.length ? output.estimateIds : output.estimateId ? [output.estimateId] : [];
    return [...ids].sort().join('|') === key;
  });
  const outputId = existing?.id ?? `out_${crypto.randomUUID().slice(0, 10)}`;
  if (!existing) {
    session.outputs.push({
      id: outputId,
      estimateId: estimateIds[estimateIds.length - 1],
      estimateIds,
      createdAt: new Date().toISOString(),
    });
    await saveSession(session);
  }

  return NextResponse.json({ ok: true, outputId });
}

/** GET /api/outputs?id=<outputId> -> PDF stream */
export async function GET(req: Request) {
  const outputId = new URL(req.url).searchParams.get('id') ?? '';

  const session = await getOrCreateSession();
  const ref = session.outputs.find((output) => output.id === outputId);
  if (!ref) {
    return NextResponse.json({ error: 'Output not found for this session.' }, { status: 404 });
  }

  const ids = ref.estimateIds?.length ? ref.estimateIds : ref.estimateId ? [ref.estimateId] : [];
  const estimates = ids.map((id) => session.estimates[id]).filter(Boolean);
  if (!ids.length || estimates.length !== ids.length) {
    return NextResponse.json({ error: 'Output not found for this session.' }, { status: 404 });
  }

  const pdf = estimates.length === 2
    ? await renderEstimateRangePdf(estimates[0], estimates[1])
    : await renderEstimatePdf(estimates[0]);
  const filename = estimates.length === 2
    ? 'indicative-estimate-range.pdf'
    : `indicative-estimate-${estimates[0].id}.pdf`;

  return new Response(Buffer.from(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
