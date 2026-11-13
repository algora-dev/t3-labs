import { NextRequest, NextResponse } from "next/server";
import { REVIEW_TOPICS } from "@/components/t3-rebuild/review-topics";

/**
 * POST /api/free-business-review
 * Deliver a real enquiry directly to insights@t3labs.tech using the site's
 * existing Resend service. Do not report success until Resend confirms receipt.
 */
export const runtime = "nodejs";

const RECIPIENT = process.env.REVIEW_NOTIFY_EMAIL || "insights@t3labs.tech";
const FROM = process.env.REVIEW_FROM_EMAIL || "T3 Labs <insights@t3labs.co.uk>";
const ALLOWED_TOPICS = new Set<string>(REVIEW_TOPICS.map(({ value }) => value));
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMIT_WINDOW_MS = 15 * 60 * 1000;
const LIMIT_PER_WINDOW = 5;
const MAX_BODY_BYTES = 8_000;

// Simple best-effort limiter for local / single-instance operation.
// On Vercel, configure distributed WAF/rate limiting as documented in HANDOFF.md.
const attempts = new Map<string, { count: number; reset: number }>();

function text(value: unknown, length: number) {
  return typeof value === "string" ? value.trim().slice(0, length) : "";
}
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char] || char));
}
function response(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin");
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    if (origin && host) {
      let url: URL;
      try { url = new URL(origin); } catch { return response("Invalid request.", 403); }
      const extra = (process.env.REVIEW_ALLOWED_ORIGINS || "").split(",").map(x => x.trim()).filter(Boolean);
      if (url.host !== host && !extra.includes(url.origin)) return response("Invalid request origin.", 403);
    }

    const size = Number(request.headers.get("content-length") || "0");
    if (size > MAX_BODY_BYTES) return response("The message is too long.", 413);
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return response("The message is too long.", 413);
    let data: Record<string, unknown>;
    try { data = JSON.parse(raw); } catch { return response("Invalid form data.", 400); }
    if (!data || Array.isArray(data) || typeof data !== "object") return response("Invalid form data.", 400);

    // Intentionally do not create a false lead or notify the user if a bot fills this field.
    if (text(data.websiteConfirmation, 500)) return NextResponse.json({ success: true });

    const email = text(data.email, 201).toLowerCase();
    const name = text(data.name, 121);
    const website = text(data.website, 301);
    const details = text(data.details, 1201);
    const packageInterest = text(data.packageInterest, 161);
    const submissionId = text(data.submissionId, 80);
    const requested = Array.isArray(data.topics) ? data.topics : [];
    if (requested.length > 7 || requested.some(t => typeof t !== "string" || !ALLOWED_TOPICS.has(t))) {
      return response("Please select a valid topic.", 400);
    }
    const topics = [...new Set(requested as string[])];
    if (!EMAIL_REGEX.test(email) || email.length > 200) return response("Please enter a valid email.", 400);
    if (name.length > 120 || website.length > 300 || details.length > 1200 || packageInterest.length > 160) return response("Please shorten your message.", 400);
    if (!topics.length && !details) return response("Select a topic or describe what you need.", 400);
    if (submissionId && !/^[a-zA-Z0-9-]{8,80}$/.test(submissionId)) return response("Invalid request.", 400);

    const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || "unknown";
    const now = Date.now();
    const attempt = attempts.get(ip);
    if (!attempt || attempt.reset <= now) attempts.set(ip, { count: 1, reset: now + LIMIT_WINDOW_MS });
    else {
      if (attempt.count >= LIMIT_PER_WINDOW) return response("Too many requests. Please try again later.", 429);
      attempt.count += 1;
    }
    // Opportunistic pruning of expired keys prevents unlimited map growth over time.
    if (attempts.size > 2000) for (const [key, value] of attempts) if (value.reset < now) attempts.delete(key);

    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.error("[free-review] RESEND_API_KEY is not configured");
      return response("Enquiries are temporarily unavailable. Please book a call instead.", 503);
    }
    const lines = [
      "T3Labs free business review",
      "",
      `Reply to: ${email}`,
      `Name or business: ${name || "Not provided"}`,
      `Website: ${website || "Not provided"}`,
      `Topics: ${topics.join(", ") || "See notes"}`,
      `Package or tool: ${packageInterest || "Not specified"}`,
      `Details: ${details || "Not provided"}`,
      `Submission ID: ${submissionId || "Not supplied"}`,
    ];
    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), 12_000);
    let resend: Response;
    try {
      resend = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
          ...(submissionId ? { "Idempotency-Key": `review-${submissionId}` } : {}),
        },
        body: JSON.stringify({
          from: FROM, to: [RECIPIENT], reply_to: email,
          subject: `Free business review: ${topics[0] || "Custom enquiry"}`,
          text: lines.join("\n"),
          html: `<div style="font-family:Arial,sans-serif;line-height:1.6">${lines.map(line => `<p>${escapeHtml(line)}</p>`).join("")}</div>`,
        }),
        signal: abort.signal,
      });
    } finally { clearTimeout(timeout); }
    if (!resend.ok) {
      console.error("[free-review] Resend did not accept the email", resend.status);
      return response("We couldn't send your enquiry. Please try again or book a call.", 502);
    }
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[free-review] Submission failed", error instanceof Error ? error.name : "unknown");
    return response("We couldn't send your enquiry. Please try again or book a call.", 500);
  }
}
