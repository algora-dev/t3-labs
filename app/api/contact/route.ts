import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://aaavvfttkesdzblttmby.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.CONTACT_EMAIL || "insights@t3labs.co.uk";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, businessType, website, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Insert into Supabase
    if (SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseRes = await fetch(
        `${SUPABASE_URL}/rest/v1/contact_enquiries`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            name: String(name).trim().slice(0, 200),
            email: String(email).trim().toLowerCase().slice(0, 200),
            company: businessType ? String(businessType).trim().slice(0, 200) : null,
            subject: website ? String(website).trim().slice(0, 500) : null,
            message: String(message).trim().slice(0, 5000),
            source: "t3labs.tech",
          }),
        }
      );

      if (!supabaseRes.ok) {
        const errText = await supabaseRes.text();
        console.error("Supabase insert error:", errText);
        // Don't block - still try to send email
      }
    } else {
      console.warn("SUPABASE_SERVICE_ROLE_KEY not set - skipping database insert");
    }

    // Send notification email via Resend
    if (RESEND_API_KEY) {
      const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f2;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f2;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#ffffff;border-radius:24px;border:1px solid #e6e6e1;overflow:hidden;">
        <tr>
          <td style="padding:36px 36px 24px;">
            <p style="margin:0 0 8px;font-size:13px;color:#888;letter-spacing:0.04em;text-transform:uppercase;">New enquiry - t3labs.tech</p>
            <h1 style="margin:0 0 24px;font-size:28px;line-height:1.15;letter-spacing:-0.03em;color:#111111;">New contact form submission</h1>

            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.8;color:#333333;">
              <tr><td style="padding:4px 0;vertical-align:top;width:120px;color:#888;">Name</td><td style="padding:4px 0;">${escapeHtml(String(name).trim())}</td></tr>
              <tr><td style="padding:4px 0;vertical-align:top;width:120px;color:#888;">Email</td><td style="padding:4px 0;"><a href="mailto:${escapeHtml(String(email).trim())}" style="color:#111;text-decoration:underline;">${escapeHtml(String(email).trim())}</a></td></tr>
              ${businessType ? `<tr><td style="padding:4px 0;vertical-align:top;width:120px;color:#888;">Business type</td><td style="padding:4px 0;">${escapeHtml(String(businessType).trim())}</td></tr>` : ""}
              ${website ? `<tr><td style="padding:4px 0;vertical-align:top;width:120px;color:#888;">Website</td><td style="padding:4px 0;"><a href="${escapeHtml(String(website).trim())}" style="color:#111;text-decoration:underline;">${escapeHtml(String(website).trim())}</a></td></tr>` : ""}
            </table>

            <div style="background:#f8f8f5;border:1px solid #eaeae4;border-radius:16px;padding:22px;margin-top:20px;">
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Message</p>
              <p style="margin:0;font-size:15px;line-height:1.85;color:#333333;white-space:pre-wrap;">${escapeHtml(String(message).trim())}</p>
            </div>

            <div style="margin-top:24px;">
              <a href="mailto:${escapeHtml(String(email).trim())}?subject=Re: Your enquiry to T3 Labs" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:12px;font-size:14px;font-weight:500;">Reply to enquiry &rarr;</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 36px 32px;border-top:1px solid #f0f0ec;">
            <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
              This enquiry was submitted via the contact form at <a href="https://t3labs.tech" style="color:#888;text-decoration:underline;">t3labs.tech</a>.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "T3 Labs <insights@t3labs.co.uk>",
          to: [NOTIFY_EMAIL],
          reply_to: String(email).trim(),
          subject: `New enquiry from ${String(name).trim()} - t3labs.tech`,
          html: emailHtml,
        }),
      });

      if (!resendRes.ok) {
        const resendErr = await resendRes.json();
        console.error("Resend error:", resendErr);
        // Still return success - the data is in Supabase
      }
    } else {
      console.warn("RESEND_API_KEY not set - email notification skipped");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email us directly." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

