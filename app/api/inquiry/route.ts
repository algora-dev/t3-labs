import { NextResponse } from 'next/server';
import { getOrCreateSession, saveSession } from '@/lib/assistant/session';
import { buildInquiryPayload, validateInquirySubmission, type InquirySubmission } from '@/lib/assistant/inquiry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NOTIFY_EMAIL = process.env.DEMO_ENQUIRY_EMAIL || 'insights@t3labs.co.uk';

function escapeHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildInquiryEmailHtml(payload: ReturnType<typeof buildInquiryPayload>): string {
  const c = payload.contact;
  const p = payload.project as Record<string, unknown>;
  const convo = (payload.conversationContext as { role: string; content: string }[]).slice(-8);
  const rows = (obj: Record<string, unknown>, keys: string[]) =>
    keys.filter((k) => p[k] != null && p[k] !== '')
      .map((k) => `<tr><td style="padding:2px 0;font-size:13px;color:#64748b;">${k}</td><td style="padding:2px 0;font-size:13px;color:#0f172a;font-weight:500;">${escapeHtml(p[k])}</td></tr>`)
      .join('');
  const estimate = payload.estimate as { total?: number; symbol?: string; currency?: string; scope?: string; lineItems?: { description?: string; total?: number; symbol?: string }[] } | null;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:#0f172a;padding:24px 32px;">
          <h1 style="margin:0;font-size:18px;font-weight:600;color:#ffffff;">Smart Assistant Enquiry - ${escapeHtml(payload.business)}</h1>
          <p style="margin:4px 0 0;font-size:13px;color:#94a3b8;">${escapeHtml(payload.summary)}</p>
        </td></tr>
        <tr><td style="padding:24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="font-size:13px;color:#94a3b8;width:80px;vertical-align:top;">From</td><td style="font-size:14px;color:#0f172a;font-weight:500;">${escapeHtml(c.name)}${c.email ? `<br><span style="font-weight:400;color:#475569;font-size:13px;">${escapeHtml(c.email)}</span>` : ''}${c.phone ? `<br><span style="font-weight:400;color:#475569;font-size:13px;">${escapeHtml(c.phone)}</span>` : ''}</td></tr>
          </table>
          ${payload.customerNote ? `<div style="margin-top:16px;background:#f8fafc;border-radius:8px;padding:16px;font-size:13px;color:#475569;white-space:pre-wrap;">${escapeHtml(payload.customerNote)}</div>` : ''}
          <h2 style="margin:20px 0 8px;font-size:15px;font-weight:600;color:#0f172a;">Project Details</h2>
          <table width="100%" cellpadding="0" cellspacing="0">${rows(p, ['projectType', 'roofArea', 'areaType', 'roofShape', 'pitchDegrees', 'material', 'location', 'estimateScope'])}</table>
          ${estimate ? `<h2 style="margin:20px 0 8px;font-size:15px;font-weight:600;color:#0f172a;">Indicative Estimate</h2>
          <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;">${escapeHtml(estimate.symbol)}${estimate.total?.toLocaleString()} ${escapeHtml(estimate.currency)} <span style="font-weight:400;color:#64748b;font-size:12px;">(${escapeHtml(estimate.scope)})</span></p>` : ''}
          ${convo.length ? `<h2 style="margin:20px 0 8px;font-size:15px;font-weight:600;color:#0f172a;">Recent Conversation</h2>
          <div style="font-size:13px;color:#475569;">${convo.map((m) => `<p style="margin:4px 0;"><strong style="color:#0f172a;">${m.role === 'user' ? 'Visitor' : 'Assistant'}:</strong> ${escapeHtml(m.content).slice(0, 400)}</p>`).join('')}</div>` : ''}
        </td></tr>
        <tr><td style="padding:16px 32px 24px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">Smart Assistant demo enquiry. Reply directly to this email to respond to ${escapeHtml(c.name)}.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

async function emailInquiry(payload: ReturnType<typeof buildInquiryPayload>): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('[inquiry] RESEND_API_KEY not set - enquiry stored in session only, nothing sent');
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Apex Smart Assistant <insights@t3labs.co.uk>',
        to: [NOTIFY_EMAIL],
        reply_to: payload.contact.email ?? undefined,
        subject: `Smart Assistant Enquiry - ${payload.contact.name ?? 'Unknown'} (${payload.summary})`,
        html: buildInquiryEmailHtml(payload),
        text: JSON.stringify(payload, null, 2),
      }),
    });
    if (!res.ok) {
      console.error('[inquiry] Resend error:', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('[inquiry] send failed:', err instanceof Error ? err.message : err);
    return false;
  }
}

/** POST /api/inquiry - submit the demo enquiry (spec 13.5).
 * Server assembles the payload from session facts + lead + latest canonical
 * estimate + submitted (possibly edited) form values, stores it in the
 * session, and emails it to the T3 Labs insights inbox via Resend.
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
  const emailed = await emailInquiry(payload);

  const inquiry = {
    id: `inq_${crypto.randomUUID().slice(0, 8)}`,
    createdAt: new Date().toISOString(),
    payload,
    emailed,
  };
  session.inquiries.push(inquiry);
  await saveSession(session);

  return NextResponse.json({
    ok: true,
    inquiryId: inquiry.id,
    message: emailed
      ? 'Thanks - your enquiry has been sent. The team will be in touch shortly.'
      : "Thanks - your enquiry has been prepared successfully. In a live deployment this would now be sent into the business enquiry or CRM workflow.",
  });
}
