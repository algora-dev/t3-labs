import { NextRequest, NextResponse } from "next/server";
import type { IntakeMessage } from "@/lib/intake/types";

/**
 * POST /api/intake/submit
 * Submits the intake brief with contact details.
 * Sends email to T3 Labs team and a copy to the visitor.
 * Stateless — receives conversation messages + contact details from client.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.CONTACT_EMAIL || "insights@t3labs.co.uk";
const BOOKING_URL = "https://calendly.com/cece-t3labs/20min";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, contact, original_input_type } = body;

    // Validate
    if (!contact) {
      return NextResponse.json(
        { error: "Contact details are required." },
        { status: 400 },
      );
    }

    if (!contact.name || !contact.email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 },
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const cleanName = String(contact.name).trim().slice(0, 200);
    const cleanEmail = String(contact.email).trim().toLowerCase().slice(0, 200);
    const cleanCompany = contact.company ? String(contact.company).trim().slice(0, 200) : null;
    const cleanPhone = contact.phone ? String(contact.phone).trim().slice(0, 50) : null;

    // Extract analysis from the last assistant message
    const typedMessages = (messages || []) as IntakeMessage[];
    const lastAssistant = [...typedMessages]
      .reverse()
      .find((m) => m.role === "assistant");

    let analysisData: Record<string, unknown> = {};
    if (lastAssistant) {
      try {
        analysisData = JSON.parse(lastAssistant.content);
      } catch {
        // Use empty defaults
      }
    }

    const problem = (analysisData.problem_summary as string) || "Not specified";
    const outcome = (analysisData.desired_outcome as string) || "Not specified";
    const areas = Array.isArray(analysisData.relevant_areas)
      ? (analysisData.relevant_areas as string[]).join(", ")
      : "";
    const context = Array.isArray(analysisData.important_context)
      ? (analysisData.important_context as string[]).join("; ")
      : "";

    // Build original transcript from visitor messages
    const transcript = typedMessages
      .filter((m) => m.role === "visitor")
      .map((m, i: number) => `Input ${i + 1}: ${m.content}`)
      .join("\n\n");

    // Send emails via Resend
    if (RESEND_API_KEY) {
      // 1. Email to T3 Labs team
      const teamHtml = buildTeamEmail({
        name: cleanName,
        email: cleanEmail,
        company: cleanCompany,
        phone: cleanPhone,
        problem,
        outcome,
        areas,
        context,
        transcript,
        inputType: original_input_type || "text",
      });

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "T3 Labs <insights@t3labs.co.uk>",
          to: [NOTIFY_EMAIL],
          reply_to: cleanEmail,
          subject: `New intake inquiry from ${cleanName} - t3labs.tech`,
          html: teamHtml,
        }),
      }).catch((err) => console.error("Resend team email error:", err));

      // 2. Copy email to visitor
      const visitorHtml = buildVisitorEmail({
        name: cleanName,
        problem,
        outcome,
        areas,
        bookingUrl: BOOKING_URL,
      });

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "T3 Labs <insights@t3labs.co.uk>",
          to: [cleanEmail],
          reply_to: NOTIFY_EMAIL,
          subject: "Your T3 Labs project brief",
          html: visitorHtml,
        }),
      }).catch((err) => console.error("Resend visitor email error:", err));
    } else {
      console.warn("RESEND_API_KEY not set - email notification skipped");
    }

    return NextResponse.json({
      success: true,
    });
  } catch (err) {
    console.error("Intake submit error:", err);
    return NextResponse.json(
      { error: "We couldn't send the brief yet. Your details haven't been lost. Please try again." },
      { status: 500 },
    );
  }
}

// ── Email builders ──────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildTeamEmail(data: {
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  problem: string;
  outcome: string;
  areas: string;
  context: string;
  transcript: string;
  inputType: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f2;font-family:Inter,ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f2;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#ffffff;border-radius:24px;border:1px solid #e6e6e1;overflow:hidden;">
        <tr>
          <td style="padding:36px 36px 24px;">
            <p style="margin:0 0 8px;font-size:13px;color:#888;letter-spacing:0.04em;text-transform:uppercase;">AI Intake Inquiry - t3labs.tech</p>
            <h1 style="margin:0 0 24px;font-size:28px;line-height:1.15;color:#111;">New intake inquiry from ${escapeHtml(data.name)}</h1>

            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.8;color:#333;">
              <tr><td style="padding:4px 0;vertical-align:top;width:120px;color:#888;">Name</td><td style="padding:4px 0;">${escapeHtml(data.name)}</td></tr>
              <tr><td style="padding:4px 0;vertical-align:top;width:120px;color:#888;">Email</td><td style="padding:4px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color:#111;text-decoration:underline;">${escapeHtml(data.email)}</a></td></tr>
              ${data.company ? `<tr><td style="padding:4px 0;vertical-align:top;width:120px;color:#888;">Company</td><td style="padding:4px 0;">${escapeHtml(data.company)}</td></tr>` : ""}
              ${data.phone ? `<tr><td style="padding:4px 0;vertical-align:top;width:120px;color:#888;">Phone</td><td style="padding:4px 0;">${escapeHtml(data.phone)}</td></tr>` : ""}
              <tr><td style="padding:4px 0;vertical-align:top;width:120px;color:#888;">Input type</td><td style="padding:4px 0;">${escapeHtml(data.inputType)}</td></tr>
            </table>

            <div style="background:#f8f8f5;border:1px solid #eaeae4;border-radius:16px;padding:22px;margin-top:20px;">
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Problem</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.85;color:#333;white-space:pre-wrap;">${escapeHtml(data.problem)}</p>
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Desired outcome</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.85;color:#333;white-space:pre-wrap;">${escapeHtml(data.outcome)}</p>
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Relevant areas</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.85;color:#333;">${escapeHtml(data.areas)}</p>
              ${data.context ? `<p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Context</p><p style="margin:0;font-size:15px;line-height:1.85;color:#333;">${escapeHtml(data.context)}</p>` : ""}
            </div>

            <div style="background:#f8f8f5;border:1px solid #eaeae4;border-radius:16px;padding:22px;margin-top:16px;">
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Original transcript</p>
              <p style="margin:0;font-size:14px;line-height:1.85;color:#555;white-space:pre-wrap;">${escapeHtml(data.transcript)}</p>
            </div>

            <div style="margin-top:24px;">
              <a href="mailto:${escapeHtml(data.email)}?subject=Re: Your T3 Labs inquiry" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 22px;border-radius:12px;font-size:14px;font-weight:500;">Reply to inquiry &rarr;</a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 36px 32px;border-top:1px solid #f0f0ec;">
            <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
              This inquiry was submitted via the AI intake modal at <a href="https://t3labs.tech" style="color:#888;text-decoration:underline;">t3labs.tech</a>.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildVisitorEmail(data: {
  name: string;
  problem: string;
  outcome: string;
  areas: string;
  bookingUrl: string;
}) {
  const firstName = data.name.split(" ")[0];
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f2;font-family:Inter,ui-sans-serif,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f2;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;background:#ffffff;border-radius:24px;border:1px solid #e6e6e1;overflow:hidden;">
        <tr>
          <td style="padding:36px 36px 24px;">
            <p style="margin:0 0 8px;font-size:13px;color:#888;letter-spacing:0.04em;text-transform:uppercase;">T3 Labs</p>
            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.15;color:#111;">Thanks, ${escapeHtml(firstName)} - your brief is with us.</h1>
            <p style="margin:0 0 24px;font-size:16px;line-height:1.7;color:#333;">We've received your project brief and will be in touch within 24 hours. Here's a summary of what you sent:</p>

            <div style="background:#f8f8f5;border:1px solid #eaeae4;border-radius:16px;padding:22px;margin-bottom:16px;">
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">The problem</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.85;color:#333;white-space:pre-wrap;">${escapeHtml(data.problem)}</p>
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">What you want to achieve</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.85;color:#333;white-space:pre-wrap;">${escapeHtml(data.outcome)}</p>
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Relevant areas</p>
              <p style="margin:0;font-size:15px;line-height:1.85;color:#333;">${escapeHtml(data.areas)}</p>
            </div>

            <div style="background:#111;border-radius:16px;padding:22px;margin-top:24px;">
              <p style="margin:0 0 8px;font-size:12px;color:#aaa;text-transform:uppercase;letter-spacing:0.06em;">What happens next?</p>
              <p style="margin:0 0 12px;font-size:15px;line-height:1.8;color:#e8e8e0;">We'll review your brief and come back to you within 24 hours with our thoughts on what might be possible.</p>
              <p style="margin:0;font-size:15px;line-height:1.8;color:#e8e8e0;">Want to speak sooner? <a href="${escapeHtml(data.bookingUrl)}" style="color:#d7ff00;text-decoration:underline;">Book a call &rarr;</a></p>
            </div>

            <p style="margin:24px 0 0;font-size:14px;color:#555;line-height:1.7;">Didn't send this? You can safely ignore this email - no action is needed.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 36px 32px;border-top:1px solid #f0f0ec;">
            <p style="margin:0;font-size:12px;color:#aaa;line-height:1.6;">
              T3 Labs - <a href="https://t3labs.tech" style="color:#888;text-decoration:underline;">t3labs.tech</a> | T3 Play Limited, Christchurch, New Zealand
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
