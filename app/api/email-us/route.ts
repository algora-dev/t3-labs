import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.CONTACT_EMAIL || "insights@t3labs.co.uk";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, subject, message } = body ?? {};

    if (!email || !message) {
      return NextResponse.json(
        { error: "Email and message are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase().slice(0, 200);
    const cleanSubject = subject ? String(subject).trim().slice(0, 200) : "Website enquiry";
    const cleanMessage = String(message).trim().slice(0, 5000);

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set - email not sent");
      return NextResponse.json({ error: "Email service unavailable." }, { status: 500 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "T3 Labs <insights@t3labs.co.uk>",
        to: [NOTIFY_EMAIL],
        reply_to: cleanEmail,
        subject: `Email us enquiry: ${cleanSubject}`,
        text: `From: ${cleanEmail}\nSubject: ${cleanSubject}\n\n${cleanMessage}`,
        html: `<p><strong>From:</strong> <a href="mailto:${escapeHtml(cleanEmail)}">${escapeHtml(cleanEmail)}</a></p><p><strong>Subject:</strong> ${escapeHtml(cleanSubject)}</p><p style="white-space:pre-wrap;">${escapeHtml(cleanMessage)}</p>`,
      }),
    });

    if (!res.ok) {
      console.error("Resend error:", await res.text());
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Email us error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
