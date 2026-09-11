import { NextResponse } from 'next/server';
import { peekSession } from '@/lib/assistant/session';

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
      recentUserMessages: [],
      inquiryCount: 0,
    });
  }

  const estimateId = session.estimateFlow.latestEstimateId;
  const estimate = estimateId ? session.estimates[estimateId] ?? null : null;
  const recentUserMessages = session.messages
    .filter((m) => m.role === 'user')
    .slice(-5)
    .map((m) => m.content);

  return NextResponse.json({
    facts: session.facts,
    lead: session.lead,
    latestEstimate: estimate,
    recentUserMessages,
    inquiryCount: session.inquiries.length,
  });
}
