import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.CONTACT_EMAIL || "insights@t3labs.co.uk";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let fields: Record<string, string> = {};
    if (contentType.includes("application/json")) {
      fields = (await req.json()) as Record<string, string>;
    } else {
      const form = await req.formData();
      for (const [k, v] of form.entries()) fields[k] = String(v);
    }

    const { name, email, contactPreference, message, ballparkSummary, currency, website } = fields;

    // Honeypot: hidden field, humans never fill it. Pretend success for bots.
    if (website && website.trim()) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !ballparkSummary) {
      return NextResponse.json({ error: "Name, email and ballpark are required." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (contactPreference !== "email" && contactPreference !== "call") {
      return NextResponse.json({ error: "Invalid contact preference." }, { status: 400 });
    }

    const clean = (v: string | undefined, max: number) => (v ? String(v).trim().slice(0, max) : "");

    if (RESEND_API_KEY) {
      const pref = contactPreference === "call" ? "Would like a call" : "Prefers email";
      const cur = clean(currency, 3) || "-";
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "T3 Labs <noreply@t3labs.co.uk>",
          to: [NOTIFY_EMAIL],
          reply_to: clean(email, 200),
          subject: `Ballpark enquiry (${cur}): ${clean(name, 100)}`,
          text: [
            `Name: ${clean(name, 200)}`,
            `Email: ${clean(email, 200)}`,
            `Reply preference: ${pref}`,
            "",
            "Message:",
            clean(message, 5000) || "-",
            "",
            "Ballpark configuration:",
            clean(ballparkSummary, 10000),
          ].join("\n"),
        }),
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
