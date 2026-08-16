import { NextRequest, NextResponse } from "next/server";
import { parseFinalBrief, parseIntakeMessages } from "@/lib/intake/validation";

/**
 * POST /api/intake/submit
 * Submits the intake brief with contact details.
 * Sends email to T3 Labs team and a copy to the visitor.
 * Stateless — receives conversation messages + contact details from client.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.CONTACT_EMAIL || "insights@t3labs.co.uk";
const BOOKING_URL = "https://calendly.com/cece-t3labs/20min";

async function sendEmail(payload: Record<string, unknown>, label: string): Promise<void> {
  if (!RESEND_API_KEY) {
    throw new Error("Email delivery is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Resend ${label} email failed`, {
      status: response.status,
      body: body.slice(0, 1000),
    });
    throw new Error(`Unable to send ${label} email.`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contact, original_input_type } = body;
    const typedMessages = parseIntakeMessages(body.messages);
    const brief = parseFinalBrief(body.brief);

    // Validate
    if (!contact) {
      return NextResponse.json(
        { error: "Contact details are required." },
        { status: 400 },
      );
    }

    if (!typedMessages) {
      return NextResponse.json(
        { error: "A completed intake conversation is required." },
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

    // Optional funnel analytics context (client-side attribution, Phase 1.3)
    const ctx = sanitizeEventContext(body.event_context);
    const attr = sanitizeAttribution(body.attribution);
    const sourceBits: string[] = [];
    if (ctx?.source_page) sourceBits.push(`page: ${ctx.source_page}`);
    if (ctx?.cta_text) sourceBits.push(`cta: ${ctx.cta_text}`);
    if (ctx?.problem_category) sourceBits.push(`category: ${ctx.problem_category}`);
    if (attr?.landing_page) sourceBits.push(`landing: ${attr.landing_page}`);
    const utmBits = [attr?.utm_source, attr?.utm_medium, attr?.utm_campaign].filter(Boolean).join(" / ");
    if (utmBits) sourceBits.push(`utm: ${utmBits}`);
    const sourceLine = sourceBits.length ? sourceBits.join(" · ") : "direct / no attribution";

    // Extract analysis from the last assistant message
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

    const problem = brief?.problem || (analysisData.problem_summary as string) || "Not specified";
    const outcome = brief?.desired_outcome || (analysisData.desired_outcome as string) || "Not specified";
    const likelySolution = brief?.likely_solution || "Not specified";
    const handoffSummary = brief?.internal_handoff_summary || "Not specified";
    const relevantAreas = brief?.relevant_areas || analysisData.relevant_areas;
    const importantContext = brief?.important_context || analysisData.important_context;
    const areas = Array.isArray(relevantAreas) ? (relevantAreas as string[]).join(", ") : "";
    const context = Array.isArray(importantContext) ? (importantContext as string[]).join("; ") : "";

    // Build original transcript from visitor messages
    const transcript = typedMessages
      .filter((m) => m.role === "visitor")
      .map((m, i: number) => `Input ${i + 1}: ${m.content}`)
      .join("\n\n");

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not set - intake delivery unavailable");
      return NextResponse.json(
        { error: "We couldn't send the brief yet. Your details haven't been lost. Please try again." },
        { status: 503 },
      );
    }

    // Send the critical team notification first. Never report success unless it is accepted.
    const teamHtml = buildTeamEmail({
      name: cleanName,
      email: cleanEmail,
      company: cleanCompany,
      phone: cleanPhone,
      problem,
      outcome,
      likelySolution,
      handoffSummary,
      areas,
      context,
      transcript,
      inputType: original_input_type || "text",
      sourceLine,
    });

    await sendEmail({
      from: "T3 Labs <insights@t3labs.co.uk>",
      to: [NOTIFY_EMAIL],
      reply_to: cleanEmail,
      subject: `New intake inquiry from ${cleanName} - t3labs.tech`,
      html: teamHtml,
    }, "team notification");

    // Send a confirmation copy after the team has safely received the inquiry.
    const visitorHtml = buildVisitorEmail({
      name: cleanName,
      problem,
      outcome,
      areas,
      bookingUrl: BOOKING_URL,
    });

    try {
      await sendEmail({
        from: "T3 Labs <insights@t3labs.co.uk>",
        to: [cleanEmail],
        reply_to: NOTIFY_EMAIL,
        subject: "Your T3 Labs project brief",
        html: visitorHtml,
      }, "visitor confirmation");
    } catch (error) {
      console.error("Visitor confirmation email failed after team delivery", error);
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

// ── Analytics context sanitisation ─────────────────────────────────

function sanitizeEventContext(input: unknown): {
  trigger: string | null;
  source_page: string | null;
  cta_text: string | null;
  problem_category: string | null;
} | null {
  if (typeof input !== "object" || input === null) return null;
  const o = input as Record<string, unknown>;
  const str = (v: unknown) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, 200) : null;
  const trigger = str(o.trigger);
  const sourcePage = str(o.source_page);
  if (!trigger && !sourcePage) return null;
  return {
    trigger,
    source_page: sourcePage,
    cta_text: str(o.cta_text),
    problem_category: str(o.problem_category),
  };
}

function sanitizeAttribution(input: unknown): {
  landing_page: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
} | null {
  if (typeof input !== "object" || input === null) return null;
  const o = input as Record<string, unknown>;
  const str = (v: unknown) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, 200) : null;
  return {
    landing_page: str(o.landing_page),
    utm_source: str(o.utm_source),
    utm_medium: str(o.utm_medium),
    utm_campaign: str(o.utm_campaign),
  };
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
  likelySolution: string;
  handoffSummary: string;
  areas: string;
  context: string;
  transcript: string;
  inputType: string;
  sourceLine: string;
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
              <tr><td style="padding:4px 0;vertical-align:top;width:120px;color:#888;">Source</td><td style="padding:4px 0;">${escapeHtml(data.sourceLine)}</td></tr>
            </table>

            <div style="background:#f8f8f5;border:1px solid #eaeae4;border-radius:16px;padding:22px;margin-top:20px;">
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Problem</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.85;color:#333;white-space:pre-wrap;">${escapeHtml(data.problem)}</p>
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Desired outcome</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.85;color:#333;white-space:pre-wrap;">${escapeHtml(data.outcome)}</p>
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Likely solution</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.85;color:#333;white-space:pre-wrap;">${escapeHtml(data.likelySolution)}</p>
              <p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Relevant areas</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.85;color:#333;">${escapeHtml(data.areas)}</p>
              ${data.context ? `<p style="margin:0 0 8px;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Context</p><p style="margin:0;font-size:15px;line-height:1.85;color:#333;">${escapeHtml(data.context)}</p>` : ""}
            </div>

            <div style="background:#111;border-radius:16px;padding:22px;margin-top:16px;">
              <p style="margin:0 0 8px;font-size:12px;color:#aaa;text-transform:uppercase;letter-spacing:0.06em;">Internal handoff</p>
              <p style="margin:0;font-size:14px;line-height:1.85;color:#e8e8e0;white-space:pre-wrap;">${escapeHtml(data.handoffSummary)}</p>
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
