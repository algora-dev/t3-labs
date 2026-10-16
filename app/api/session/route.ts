import { NextResponse } from 'next/server';
import { peekSession, resetSession } from '@/lib/assistant/session';
import { draftSummaryLines } from '@/lib/assistant/estimate-draft';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await peekSession();
  if (!session) {
    return NextResponse.json({
      facts: {
        projectType: null,
        roofArea: null,
        areaType: null,
        roofShape: null,
        pitchDegrees: null,
        material: null,
        location: null,
        estimateScope: null,
        components: [],
        extras: [],
      },
      lead: { name: null, email: null, phone: null },
      latestEstimate: null,
      latestEstimates: [],
      draft: null,
      draftSummary: [],
      currentPagePath: null,
      recentUserMessages: [],
      handoff: null,
      inquiryCount: 0,
    });
  }

  const estimateId = session.estimateFlow.latestEstimateId;
  const estimate = estimateId ? session.estimates[estimateId] ?? null : null;
  const recentUserMessages = session.messages
    .filter((m) => m.role === 'user' && !m.content.startsWith('['))
    .slice(-5)
    .map((m) => m.content);

  return NextResponse.json({
    facts: session.facts,
    lead: session.lead,
    latestEstimate: estimate,
    latestEstimates: (session.estimateFlow.latestEstimateIds ?? (estimateId ? [estimateId] : [])).map(id => session.estimates[id]).filter(Boolean),
    draft: session.draft,
    draftSummary: session.draft ? draftSummaryLines(session.draft) : [],
    currentPagePath: session.currentPagePath,
    recentUserMessages,
    handoff: session.handoff,
    inquiryCount: session.inquiries.length,
  });
}

/**
 * DELETE /api/session - Start New Conversation (V4 brief section 14).
 * Clears messages, facts, estimates, outputs, enquiries, draft and page context,
 * and issues a brand-new session id.
 */
export async function DELETE() {
  await resetSession();
  return NextResponse.json({ ok: true });
}
