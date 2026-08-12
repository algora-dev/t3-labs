import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.PROPOSAL_ALERT_EMAIL || "cece@t3labs.co.uk";

/**
 * Notifies Cece when a prospect closes their private proposal (or asks not to be
 * contacted again). Fired from the proposal-page "Close my private proposal" flow.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, prospectId, choice, proposalUrl } = body;

    if (!companyName && !prospectId) {
      return NextResponse.json(
        { error: "companyName or prospectId is required." },
        { status: 400 }
      );
    }

    const cleanCompany = String(companyName || prospectId || "Unknown").trim().slice(0, 200);
    const cleanProspectId = prospectId ? String(prospectId).trim().slice(0, 50) : null;
    const cleanChoice = choice === "suppress" ? "Please do not contact me again" : choice === "remove" ? "Close and remove this proposal" : "Close";
    const cleanUrl = proposalUrl ? String(proposalUrl).trim().slice(0, 500) : null;

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set - proposal closed email skipped");
      return NextResponse.json({ success: false, reason: "email not configured" });
    }

    const subject = `${cleanCompany} has closed their proposal`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f2;font-family:Inter,ui-sans-serif,system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f2;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#ffffff;border-radius:24px;border:1px solid #e6e6e1;overflow:hidden;">
        <tr>
          <td style="padding:36px 36px 24px;">
            <p style="margin:0 0 8px;font-size:13px;color:#888;letter-spacing:0.04em;text-transform:uppercase;">T3 Labs - proposal lead</p>
            <h1 style="margin:0 0 24px;font-size:28px;line-height:1.15;letter-spacing:-0.03em;color:#111111;">${escapeHtml(cleanCompany)} has closed their proposal</h1>

            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.8;color:#333333;">
              <tr><td style="padding:4px 0;vertical-align:top;width:140px;color:#888;">Company</td><td style="padding:4px 0;">${escapeHtml(cleanCompany)}</td></tr>
              ${cleanProspectId ? `<tr><td style="padding:4px 0;vertical-align:top;width:140px;color:#888;">Prospect ID</td><td style="padding:4px 0;">${escapeHtml(cleanProspectId)}</td></tr>` : ""}
              <tr><td style="padding:4px 0;vertical-align:top;width:140px;color:#888;">Action</td><td style="padding:4px 0;">${escapeHtml(cleanChoice)}</td></tr>
              ${cleanUrl ? `<tr><td style="padding:4px 0;vertical-align:top;width:140px;color:#888;">Proposal</td><td style="padding:4px 0;"><a href="${escapeHtml(cleanUrl)}" style="color:#111;text-decoration:underline;">${escapeHtml(cleanUrl)}</a></td></tr>` : ""}
            </table>

            <div style="background:#f8f8f5;border:1px solid #eaeae4;border-radius:16px;padding:22px;margin-top:20px;">
              <p style="margin:0;font-size:15px;line-height:1.85;color:#333333;">
                ${cleanChoice === "Please do not contact me again"
                  ? "This prospect has explicitly asked not to be contacted again. Remove them from any outreach lists."
                  : "This prospect closed their proposal. Consider whether to follow up, or archive if they are not interested."}
              </p>
            </div>

            <div style="background:#111111;border-radius:16px;padding:22px;margin-top:24px;">
              <p style="margin:0;font-size:15px;line-height:1.8;color:#e8e8e0;">
                Review the proposal in your records and update the prospect's status in the CRM accordingly.
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 36px 32px;border-top:1px solid #f0f0ec;">
            <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
              T3 Labs - <a href="https://t3labs.tech" style="color:#888;text-decoration:underline;">t3labs.tech</a> | T3 Play Limited, Christchurch, New Zealand
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "T3 Labs <insights@t3labs.co.uk>",
        to: [NOTIFY_EMAIL],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Resend proposal-closed error:", err);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Proposal-closed error:", err);
    return NextResponse.json(
      { error: "Something went wrong." },
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
