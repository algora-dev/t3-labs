import { NextRequest, NextResponse } from 'next/server';

// Apex Roofing Demo - website contact form + quote request form endpoint.
// Sends the enquiry to the T3 Play inbox (insights@t3labs.co.uk) via Resend.
// Falls back to demo mode (no send) if RESEND_API_KEY is absent.

export const runtime = 'nodejs';

const NOTIFY_EMAIL = process.env.DEMO_ENQUIRY_EMAIL || 'insights@t3labs.co.uk';

interface SiteEnquiryRequest {
  formType?: string; // 'contact' | 'quote'
  fields?: Record<string, string | string[]>;
  attachmentNames?: string[];
}

function escapeHtml(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderValue(v: string | string[]): string {
  return Array.isArray(v) ? v.filter(Boolean).join(', ') : v;
}

function buildEmailHtml(data: SiteEnquiryRequest): string {
  const isQuote = data.formType === 'quote';
  const rows = Object.entries(data.fields ?? {})
    .filter(([, v]) => renderValue(v) !== '')
    .map(
      ([k, v]) =>
        `<tr><td style="padding:3px 0;font-size:13px;color:#64748b;width:180px;vertical-align:top;">${escapeHtml(k)}</td><td style="padding:3px 0;font-size:14px;color:#0f172a;font-weight:500;white-space:pre-wrap;">${escapeHtml(renderValue(v))}</td></tr>`
    )
    .join('');
  const attachments = (data.attachmentNames ?? []).length
    ? `<p style="margin:16px 0 0;font-size:13px;color:#475569;">Attachments (not uploaded in demo): ${escapeHtml(data.attachmentNames!.join(', '))}</p>`
    : '';
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:#0f172a;padding:24px 32px;">
          <h1 style="margin:0;font-size:18px;font-weight:600;color:#ffffff;">Apex Roofing Demo - ${isQuote ? 'Quote Request' : 'Contact Form'}</h1>
          <p style="margin:4px 0 0;font-size:13px;color:#94a3b8;">t3labs.tech/demo/roofing-site</p>
        </td></tr>
        <tr><td style="padding:24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
          ${attachments}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function POST(req: NextRequest) {
  try {
    const data: SiteEnquiryRequest = await req.json();

    const fields = data.fields ?? {};
    const name = String(fields['Name'] ?? fields['name'] ?? '').trim();
    const email = String(fields['Email'] ?? fields['Email address'] ?? '').trim();
    if (!name) {
      return NextResponse.json({ ok: false, error: 'Please provide your name.' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Please provide a valid email address.' }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn('[site-enquiry] RESEND_API_KEY not set - demo mode, nothing sent');
      return NextResponse.json({ ok: true, demo: true });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Apex Roofing Demo <insights@t3labs.co.uk>',
        to: [NOTIFY_EMAIL],
        reply_to: email,
        subject: `Apex Roofing Demo - ${data.formType === 'quote' ? 'Quote Request' : 'Contact Form'} from ${name}`,
        html: buildEmailHtml(data),
        text: JSON.stringify(data, null, 2),
      }),
    });

    if (!res.ok) {
      console.error('[site-enquiry] Resend error:', res.status, await res.text());
      return NextResponse.json({ ok: false, error: 'Failed to send' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[site-enquiry] Unexpected error:', err);
    return NextResponse.json({ ok: false, error: 'An unexpected error occurred' }, { status: 500 });
  }
}
