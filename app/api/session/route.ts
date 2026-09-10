import { NextResponse } from 'next/server';
import { peekSession } from '@/lib/assistant/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/session - lightweight prefill state for the enquiry form (spec 13.2).
 * Returns facts, lead, latest estimate summary and enquiry status.
 * Deliberately excludes message history to keep the payload small, and does
 * NOT create a session if none exists.
 */
export async function GET() {
  const session = await peekSession();
  if (!session) {
    return NextResponse.json({
      facts: {
        projectType: null, roofArea: null, areaType: null, roofShape: null,
        pitchDegrees: null, material: null, location: null, extras: [],
      },
      lead: { name: null, email: null, phone: null },
      latestEstimate: null,
      lastUserMessage: null,
      inquiryCount: 0,
    });
  }

  const estimateId = session.estimateFlow.latestEstimateId;
  const estimate = estimateId ? session.estimates[estimateId] ?? null : null;
  const lastUser = [...session.messages].reverse().find((m) => m.role === 'user');

  return NextResponse.json({
    facts: session.facts,
    lead: session.lead,
    latestEstimate: estimate
      ? { id: estimate.id, total: estimate.total, currency: estimate.currency, symbol: estimate.symbol, status: estimate.status }
      : null,
    lastUserMessage: lastUser?.content ?? null,
    inquiryCount: session.inquiries.length,
  });
}
