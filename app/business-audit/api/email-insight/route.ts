import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/business-audit/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, insight, marketingConsent } = await req.json();

    if (!email || !insight) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Save lead to Supabase
    const { error: dbError } = await supabase
      .from("insight_email_leads")
      .insert({
        email: email.trim().toLowerCase(),
        insight_title: insight.title ?? null,
        insight_text: insight.text ?? null,
        insight_next_move: insight.nextMove ?? null,
        marketing_consent: marketingConsent ?? false,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      // Don't block on DB error — still attempt email if possible
    }

    // Send email via Resend
    // insights@t3labs.co.uk — active once domain is verified in Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

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
            <p style="margin:0 0 8px;font-size:13px;color:#888;letter-spacing:0.04em;text-transform:uppercase;">Business Audit - T3 Labs</p>
            <h1 style="margin:0 0 24px;font-size:28px;line-height:1.15;letter-spacing:-0.03em;color:#111111;">Your free business insight</h1>

            <div style="background:#f8f8f5;border:1px solid #eaeae4;border-radius:16px;padding:22px;margin-bottom:16px;">
              <h2 style="margin:0 0 10px;font-size:19px;line-height:1.3;color:#111111;">${insight.title ?? "Your insight"}</h2>
              <p style="margin:0;font-size:15px;line-height:1.85;color:#333333;">${insight.text ?? ""}</p>
            </div>

            ${insight.nextMove ? `
            <div style="background:#111111;border-radius:16px;padding:22px;margin-bottom:24px;">
              <p style="margin:0 0 8px;font-size:12px;color:#aaaaaa;text-transform:uppercase;letter-spacing:0.06em;">Your next move this week</p>
              <p style="margin:0;font-size:15px;line-height:1.8;color:#e8e8e0;">${insight.nextMove}</p>
            </div>` : ""}

            <div style="background:#f0f0ec;border-radius:16px;padding:22px;">
              <p style="margin:0 0 12px;font-size:15px;font-weight:600;color:#111111;">Want the full picture?</p>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.75;color:#555555;">Unlock your full audit report for just £9 and get a complete diagnosis of your business, an action plan, and a free 15-minute review call.</p>
              <a href="https://t3labs.tech/business-audit" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:12px;font-size:14px;font-weight:500;">Unlock full audit - £9</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 36px 32px;border-top:1px solid #f0f0ec;">
            <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
              This email was sent because you requested your free insight from the Business Audit tool at <a href="https://t3labs.tech/business-audit" style="color:#888;text-decoration:underline;">t3labs.tech/business-audit</a>.<br>
              T3 Labs - <a href="https://t3labs.tech" style="color:#888;text-decoration:underline;">t3labs.tech</a>
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
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Business Audit <insights@t3labs.co.uk>",
          to: [email.trim()],
          subject: "Your free business insight from T3 Labs",
          html: emailHtml,
        }),
      });

      if (!resendRes.ok) {
        const resendErr = await resendRes.json();
        console.error("Resend error:", resendErr);
        // Return error so frontend knows email didn't send
        return NextResponse.json({ error: "Email failed to send" }, { status: 500 });
      }
    } else {
      // Resend not configured yet — log and return success so we don't block UX
      // Email will be sent manually when Resend key is added
      console.warn("RESEND_API_KEY not set — lead saved to Supabase, email not sent");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("email-insight error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
