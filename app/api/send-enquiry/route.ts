import { NextRequest, NextResponse } from "next/server";

// ACT Roofing demo — takeoff enquiry endpoint.
// Sends the completed roof takeoff result to the T3 Play inbox (info@t3play.com)
// via Resend. Falls back to demo mode (no send) if RESEND_API_KEY is absent.

export const runtime = "nodejs";
export const maxDuration = 30;

const NOTIFY_EMAIL = process.env.DEMO_ENQUIRY_EMAIL || "info@t3play.com";

interface TakeoffSection {
  label: string;
  unit: string;
  count: number;
  withWaste: number;
  wastePercent: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  entries: { label: string; componentName: string; value: number; quantity: number }[];
}

interface EnquiryRequest {
  supplierName?: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  intent?: string;
  message?: string;
  includeQuantities?: boolean;
  includePricing?: boolean;
  takeoffSummary?: TakeoffSection[];
  currencySymbol?: string;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildEmailHtml(data: EnquiryRequest): string {
  const cur = data.currencySymbol || "\u00A3";
  const rows: string[] = [];
  let grandTotal = 0;

  for (const s of data.takeoffSummary ?? []) {
    if (s.count === 0) continue;
    const entries = (data.includeQuantities ? s.entries : [])
      .map(
        (e) =>
          `<tr><td style="padding:2px 0;font-size:13px;color:#475569;">${escapeHtml(e.label)}${e.componentName && e.componentName !== "No product" ? " - " + escapeHtml(e.componentName) : ""}</td><td style="padding:2px 0;font-size:13px;color:#475569;text-align:right;">${e.value.toFixed(2)} ${escapeHtml(s.unit)}${e.quantity > 1 ? ` (x${e.quantity})` : ""}</td></tr>`
      )
      .join("");
    if (data.includePricing) grandTotal += s.totalCost;
    rows.push(`
      <tr><td colspan="2" style="padding-top:14px;border-top:1px solid #e2e8f0;font-size:15px;font-weight:600;color:#0f172a;">${escapeHtml(s.label)} <span style="font-weight:400;color:#94a3b8;font-size:12px;">(${s.count} ${s.count === 1 ? "entry" : "entries"})</span></td></tr>
      ${entries}
      <tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Subtotal${s.wastePercent > 0 ? ` (+${s.wastePercent}% waste)` : ""}</td><td style="padding:4px 0;font-size:13px;font-weight:600;color:#0f172a;text-align:right;">${s.withWaste.toFixed(2)} ${escapeHtml(s.unit)}</td></tr>
      ${data.includePricing && s.totalCost > 0 ? `<tr><td style="padding:2px 0;font-size:12px;color:#94a3b8;">Material ${cur}${s.materialCost.toFixed(2)}${s.labourCost > 0 ? ` + Labour ${cur}${s.labourCost.toFixed(2)}` : ""}</td><td style="padding:2px 0;font-size:14px;font-weight:600;color:#0f172a;text-align:right;">${cur}${s.totalCost.toFixed(2)}</td></tr>` : ""}
    `);
  }

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:24px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
        <tr><td style="background:#0f172a;padding:24px 32px;">
          <h1 style="margin:0;font-size:18px;font-weight:600;color:#ffffff;">ACT Roofing Demo — Takeoff Enquiry</h1>
          <p style="margin:4px 0 0;font-size:13px;color:#94a3b8;">t3labs.tech/demo/roofing-site</p>
        </td></tr>
        <tr><td style="padding:24px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="font-size:13px;color:#94a3b8;width:80px;vertical-align:top;">From</td><td style="font-size:14px;color:#0f172a;font-weight:500;">${escapeHtml(data.senderName)}<br><span style="font-weight:400;color:#475569;font-size:13px;">${escapeHtml(data.senderEmail)}</span>${data.senderPhone ? `<br><span style="font-weight:400;color:#475569;font-size:13px;">${escapeHtml(data.senderPhone)}</span>` : ""}</td></tr>
          </table>
          ${data.message ? `<div style="margin-top:16px;background:#f8fafc;border-radius:8px;padding:16px;font-size:13px;color:#475569;white-space:pre-wrap;">${escapeHtml(data.message)}</div>` : ""}
        </td></tr>
        <tr><td style="padding:0 32px 24px;">
          <h2 style="margin:0 0 8px;font-size:15px;font-weight:600;color:#0f172a;">Takeoff Details</h2>
          <table width="100%" cellpadding="0" cellspacing="0">${rows.join("")}</table>
        </td></tr>
        ${data.includePricing && grandTotal > 0 ? `
        <tr><td style="padding:0 32px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;border-radius:8px;padding:16px 20px;">
            <tr><td style="font-size:14px;font-weight:600;color:#ffffff;">Grand Total</td><td style="font-size:18px;font-weight:700;color:#ffffff;text-align:right;">${cur}${grandTotal.toFixed(2)}</td></tr>
          </table>
        </td></tr>` : ""}
        <tr><td style="padding:16px 32px 24px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#94a3b8;">Demo website enquiry. Reply directly to this email to respond to ${escapeHtml(data.senderName)}.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function buildEmailText(data: EnquiryRequest): string {
  const cur = data.currencySymbol || "\u00A3";
  let text = `ACT Roofing Demo - Takeoff Enquiry\nFrom: ${data.senderName} <${data.senderEmail}>\n`;
  if (data.senderPhone) text += `Phone: ${data.senderPhone}\n`;
  if (data.message) text += `\nMessage:\n${data.message}\n`;
  text += `\nTakeoff Details:\n`;
  for (const s of data.takeoffSummary ?? []) {
    if (s.count === 0) continue;
    text += `\n${s.label} (${s.count} entries)\n`;
    for (const e of data.includeQuantities ? s.entries : []) {
      text += `  - ${e.label}: ${e.value.toFixed(2)} ${s.unit}${e.quantity > 1 ? ` (x${e.quantity})` : ""}\n`;
    }
    text += `  Subtotal: ${s.withWaste.toFixed(2)} ${s.unit}\n`;
    if (data.includePricing && s.totalCost > 0) text += `  Cost: ${cur}${s.totalCost.toFixed(2)}\n`;
  }
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const data: EnquiryRequest = await req.json();

    if (!data.senderEmail || !data.senderName) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.warn("[send-enquiry] RESEND_API_KEY not set - demo mode, nothing sent");
      return NextResponse.json({ ok: true, demo: true });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ACT Roofing Demo <insights@t3labs.co.uk>",
        to: [NOTIFY_EMAIL],
        reply_to: data.senderEmail,
        subject: `ACT Roofing Demo - Takeoff Enquiry from ${data.senderName}`,
        html: buildEmailHtml(data),
        text: buildEmailText(data),
      }),
    });

    if (!res.ok) {
      console.error("[send-enquiry] Resend error:", res.status, await res.text());
      return NextResponse.json({ ok: false, error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[send-enquiry] Unexpected error:", err);
    return NextResponse.json({ ok: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}
