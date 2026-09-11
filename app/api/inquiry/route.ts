import { NextResponse } from 'next/server';
import { getOrCreateSession, saveSession } from '@/lib/assistant/session';
import { buildInquiryPayload, validateInquirySubmission, type InquirySubmission } from '@/lib/assistant/inquiry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/inquiry - submit the demo enquiry (spec 13.5).
 * Server assembles the payload from session facts + lead + latest canonical
 * estimate + submitted (possibly edited) form values. Demo submission only:
 * stored inside the session, never sent anywhere.
 */
export async function POST(req: Request) {
  let body: InquirySubmission;
  try {
    body = (await req.json()) as InquirySubmission;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const guard = validateInquirySubmission(body);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: 400 });
  }

  const session = await getOrCreateSession();
  const payload = buildInquiryPayload(session, body);

  const inquiry = {
    id: `inq_${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    payload,
  };
  session.inquiries.push(inquiry);
  await saveSession(session);

  return NextResponse.json({
    ok: true,
    inquiryId: inquiry.id,
    message:
      "Thanks - your enquiry has been prepared successfully. In a live deployment this would now be sent into the business enquiry or CRM workflow.",
  });
}
