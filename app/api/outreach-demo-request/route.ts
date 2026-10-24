import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.CONTACT_EMAIL || "insights@t3labs.co.uk";

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawWebsite = clean(body?.website, 500);
    const website = normalizeWebsite(rawWebsite);
    const alternateEmail = clean(body?.alternateEmail, 200).toLowerCase();
    const delivery = body?.delivery === "alternate" ? "alternate" : "original-outreach";
    const slug = clean(body?.slug, 160);
    const businessName = clean(body?.businessName, 200);

    if (!website) {
      return NextResponse.json({ error: "Please enter a valid website address." }, { status: 400 });
    }

    if (delivery === "alternate") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!alternateEmail || !emailRegex.test(alternateEmail)) {
        return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
      }
    }

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set - outreach demo request email not sent");
      return NextResponse.json({ error: "Demo requests are temporarily unavailable. Please try again shortly." }, { status: 503 });
    }

    const deliveryText = delivery === "alternate"
      ? `Send demo to alternate email: ${alternateEmail}`
      : "Send demo to the original outreach email. Match using the website/domain and outreach record.";

    const subjectLabel = businessName || new URL(website).hostname;
    const html = `
<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#f5f6f8;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;color:#11131a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 18px;background:#f5f6f8;">
    <tr><td align="center">
      <table width="100%" style="max-width:620px;background:#ffffff;border:1px solid #dde2e8;border-radius:20px;overflow:hidden;">
        <tr><td style="padding:30px;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#697180;">Outreach demo request</p>
          <h1 style="margin:0 0 22px;font-size:28px;line-height:1.12;letter-spacing:-.03em;">Build a free demo for ${escapeHtml(subjectLabel)}</h1>
          <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.7;">
            <tr><td style="padding:5px 0;width:130px;color:#7b8492;vertical-align:top;">Website</td><td style="padding:5px 0;"><a href="${escapeHtml(website)}" style="color:#11131a;">${escapeHtml(website)}</a></td></tr>
            <tr><td style="padding:5px 0;width:130px;color:#7b8492;vertical-align:top;">Landing page</td><td style="padding:5px 0;">/hello/${escapeHtml(slug || "unknown")}</td></tr>
            ${businessName ? `<tr><td style="padding:5px 0;width:130px;color:#7b8492;vertical-align:top;">Business</td><td style="padding:5px 0;">${escapeHtml(businessName)}</td></tr>` : ""}
            <tr><td style="padding:5px 0;width:130px;color:#7b8492;vertical-align:top;">Delivery</td><td style="padding:5px 0;">${escapeHtml(deliveryText)}</td></tr>
          </table>
          <div style="margin-top:22px;border-radius:14px;background:#111722;color:#fff;padding:18px 20px;">
            <p style="margin:0;font-size:14px;line-height:1.65;">Target turnaround promised on page: 1 to 3 days. Build a basic working demo using the most relevant T3 Labs solutions and return a private link.</p>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "T3 Labs <insights@t3labs.co.uk>",
        to: [NOTIFY_EMAIL],
        reply_to: delivery === "alternate" ? alternateEmail : NOTIFY_EMAIL,
        subject: `Free outreach demo requested - ${subjectLabel}`,
        html,
      }),
    });

    if (!response.ok) {
      console.error("Outreach demo request Resend error:", await response.text());
      return NextResponse.json({ error: "We could not send the request. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Outreach demo request error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
