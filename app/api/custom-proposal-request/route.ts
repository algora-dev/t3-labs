import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.CONTACT_EMAIL || "insights@t3labs.tech";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "T3 Labs <insights@t3labs.co.uk>";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://aaavvfttkesdzblttmby.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanArray(value: unknown, maxItems = 20, maxLength = 180): string[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, maxItems).map((item) => clean(item, maxLength)).filter(Boolean);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeWebsite(value: string): string | null {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function rows(items: Array<[string, string | string[]]>) {
  return items
    .filter(([, value]) => Array.isArray(value) ? value.length > 0 : Boolean(value))
    .map(([label, value]) => {
      const display = Array.isArray(value) ? value.join(", ") : value;
      return `<tr><td style="padding:7px 0;width:155px;color:#737887;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:7px 0;color:#111318;">${escapeHtml(display)}</td></tr>`;
    })
    .join("");
}

async function sendResendEmail(payload: {
  to: string;
  replyTo: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; reason: string }> {
  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [payload.to],
        reply_to: payload.replyTo,
        subject: payload.subject,
        html: payload.html,
      }),
    });
    if (!resendResponse.ok) {
      const detail = await resendResponse.text();
      console.error("Custom proposal Resend error:", detail);
      let reason = "";
      try {
        const parsed = JSON.parse(detail) as { message?: string };
        if (parsed?.message) reason = parsed.message;
      } catch {
        reason = detail;
      }
      return { ok: false, reason: reason.slice(0, 180) };
    }
    return { ok: true, reason: "" };
  } catch (error) {
    console.error("Custom proposal Resend request failed:", error);
    return { ok: false, reason: "network error" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (clean(body?.company, 200)) return NextResponse.json({ ok: true });

    const improvementLabels = cleanArray(body?.improvementLabels);
    const marketing = cleanArray(body?.marketing);
    const teamSize = clean(body?.teamSize, 80);
    const quoteProcess = clean(body?.quoteProcess, 160);
    const urgency = clean(body?.urgency, 120);
    const rawWebsite = clean(body?.website, 500);
    const website = normalizeWebsite(rawWebsite);
    const email = clean(body?.email, 200).toLowerCase();
    const notes = clean(body?.notes, 1500);
    const pageUrl = clean(body?.pageUrl, 1000);
    const referrer = clean(body?.referrer, 1000);
    const utmSource = clean(body?.utmSource, 200);
    const utmCampaign = clean(body?.utmCampaign, 300);
    const utmContent = clean(body?.utmContent, 300);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!website) return NextResponse.json({ error: "Please enter a valid website address." }, { status: 400 });
    if (!email || !emailRegex.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    if (!improvementLabels.length || !marketing.length || !teamSize || !urgency) {
      return NextResponse.json({ error: "Please complete the quick questions before submitting." }, { status: 400 });
    }

    const hostname = new URL(website).hostname.replace(/^www\./, "");
    const summary = [
      `Website: ${website}`,
      `Email: ${email}`,
      `Improve: ${improvementLabels.join(", ")}`,
      `Current lead sources: ${marketing.join(", ")}`,
      `Team size: ${teamSize}`,
      quoteProcess ? `Current measuring / quoting: ${quoteProcess}` : "",
      `Timing: ${urgency}`,
      notes ? `Notes: ${notes}` : "",
      utmSource ? `UTM source: ${utmSource}` : "",
      utmCampaign ? `UTM campaign: ${utmCampaign}` : "",
      utmContent ? `UTM content: ${utmContent}` : "",
      pageUrl ? `Page: ${pageUrl}` : "",
      referrer ? `Referrer: ${referrer}` : "",
    ].filter(Boolean).join("\n");

    if (SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/contact_enquiries`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: "Custom proposal request",
          email,
          company: hostname,
          subject: website,
          message: summary,
          source: "t3labs.tech/custom-proposal",
        }),
      });
      if (!supabaseRes.ok) console.error("Custom proposal Supabase insert error:", await supabaseRes.text());
    } else {
      console.warn("SUPABASE_SERVICE_ROLE_KEY not set - custom proposal request will only be emailed");
    }

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set - custom proposal request email not sent");
      return NextResponse.json({ error: "Proposal requests are temporarily unavailable. Please try again shortly." }, { status: 503 });
    }

    const customerHtml = `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f5f6f8;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;color:#111318;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 18px;background:#f5f6f8;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border:1px solid #e7e9ef;border-radius:18px;overflow:hidden;">
        <tr><td style="height:7px;background:#d7ff00;"></td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#5f7000;">T3 Labs</p>
          <h1 style="margin:0 0 10px;font-size:28px;line-height:1.12;letter-spacing:-.03em;color:#0a0b10;">We received your inquiry</h1>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#606575;">Thanks for getting in touch. We are reviewing ${escapeHtml(hostname)} now and Shaun will send you a custom recommendation and price within 48 hours. Here is a copy of what you told us, so you have it on record.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.55;border-top:1px solid #e7e9ef;border-bottom:1px solid #e7e9ef;padding:12px 0;">
            ${rows([
              ["Website", website],
              ["Email", email],
              ["Wants to improve", improvementLabels],
              ["Lead / inquiry sources", marketing],
              ["Team size", teamSize],
              ["Measure / quote process", quoteProcess],
              ["Timing", urgency],
            ])}
          </table>
          ${notes ? `<div style="margin-top:22px;border-radius:12px;background:#f6f8fc;border:1px solid #e7e9ef;padding:17px 18px;"><p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#737887;">Additional notes</p><p style="margin:0;font-size:14px;line-height:1.65;color:#20232c;white-space:pre-wrap;">${escapeHtml(notes)}</p></div>` : ""}
          <div style="margin-top:22px;border-radius:12px;background:#f6f8fc;border:1px solid #e7e9ef;padding:17px 18px;">
            <p style="margin:0;font-size:14px;line-height:1.65;color:#20232c;">Need to add anything or correct a detail? Just reply to this email and it will reach us.</p>
          </div>
          <p style="margin:22px 0 0;font-size:12px;line-height:1.7;color:#858b97;">You received this email because you submitted the inquiry form at t3labs.tech/custom-proposal.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const confirmation = await sendResendEmail({
      to: email,
      replyTo: NOTIFY_EMAIL,
      subject: "We received your T3 Labs inquiry",
      html: customerHtml,
    });

    const confirmationStrip = confirmation.ok
      ? `<div style="margin-top:22px;border-radius:12px;background:#f2fbf3;border:1px solid #bfe5c6;padding:15px 18px;"><p style="margin:0;font-size:13px;line-height:1.6;color:#1d5f2a;"><strong>Customer confirmation email:</strong> sent to ${escapeHtml(email)} (copy of their answers with a 48-hour reply promise).</p></div>`
      : `<div style="margin-top:22px;border-radius:12px;background:#fdf2f2;border:1px solid #eec4c4;padding:15px 18px;"><p style="margin:0;font-size:13px;line-height:1.6;color:#7a2424;"><strong>Customer confirmation email:</strong> FAILED to send to ${escapeHtml(email)}. Resend rejected the address${confirmation.reason ? ` (${escapeHtml(confirmation.reason)})` : ""}. It may be invalid, so consider verifying before relying on it.</p></div>`;

    const html = `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f5f6f8;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;color:#111318;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 18px;background:#f5f6f8;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border:1px solid #e7e9ef;border-radius:18px;overflow:hidden;">
        <tr><td style="height:7px;background:#d7ff00;"></td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#5f7000;">Custom proposal request</p>
          <h1 style="margin:0 0 10px;font-size:28px;line-height:1.12;letter-spacing:-.03em;color:#0a0b10;">Review ${escapeHtml(hostname)}</h1>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#606575;">Shaun should review the website and answers, then send a custom recommendation and price within 48 hours.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.55;border-top:1px solid #e7e9ef;border-bottom:1px solid #e7e9ef;padding:12px 0;">
            ${rows([
              ["Website", website],
              ["Reply email", email],
              ["Wants to improve", improvementLabels],
              ["Lead / inquiry sources", marketing],
              ["Team size", teamSize],
              ["Measure / quote process", quoteProcess],
              ["Timing", urgency],
            ])}
          </table>
          ${notes ? `<div style="margin-top:22px;border-radius:12px;background:#f6f8fc;border:1px solid #e7e9ef;padding:17px 18px;"><p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#737887;">Additional notes</p><p style="margin:0;font-size:14px;line-height:1.65;color:#20232c;white-space:pre-wrap;">${escapeHtml(notes)}</p></div>` : ""}
          ${confirmationStrip}
          <div style="margin-top:22px;border-radius:12px;background:#fbfff0;border:1px solid #e3e8bc;padding:17px 18px;">
            <p style="margin:0;font-size:14px;line-height:1.65;color:#404617;"><strong>Price context:</strong> The visitor has been told that the advertised $1,000 setup may be exactly what suits them. If a different scope makes more sense, explain what and why.</p>
          </div>
          ${(utmSource || utmCampaign || utmContent || pageUrl || referrer) ? `<div style="margin-top:22px;font-size:12px;line-height:1.7;color:#858b97;">${utmSource ? `<div>UTM source: ${escapeHtml(utmSource)}</div>` : ""}${utmCampaign ? `<div>UTM campaign: ${escapeHtml(utmCampaign)}</div>` : ""}${utmContent ? `<div>UTM content: ${escapeHtml(utmContent)}</div>` : ""}${pageUrl ? `<div>Page: ${escapeHtml(pageUrl)}</div>` : ""}${referrer ? `<div>Referrer: ${escapeHtml(referrer)}</div>` : ""}</div>` : ""}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const teamSend = await sendResendEmail({
      to: NOTIFY_EMAIL,
      replyTo: email,
      subject: `Custom proposal request - ${hostname}`,
      html,
    });

    if (!teamSend.ok) {
      return NextResponse.json({ error: "We could not send your request. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ ok: true, confirmationSent: confirmation.ok });
  } catch (error) {
    console.error("Custom proposal request error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
