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

    const { name, email, business, website, message } = fields;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const clean = (v: string | undefined, max: number) =>
      v ? String(v).trim().slice(0, max) : "";

    // Notify team
    if (RESEND_API_KEY) {
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
          subject: `Construction enquiry: ${clean(business, 100) || clean(name, 100)}`,
          text: [
            `Name: ${clean(name, 200)}`,
            `Business: ${clean(business, 200) || "-"}`,
            `Email: ${clean(email, 200)}`,
            `Website: ${clean(website, 500) || "-"}`,
            "",
            clean(message, 5000),
          ].join("\n"),
        }),
      });
    }

    // HTML form post -> redirect back with success flag; JSON -> 200
    const accept = req.headers.get("accept") || "";
    if (!contentType.includes("application/json")) {
      const url = new URL("/our-solution", req.url);
      url.hash = "contact";
      url.searchParams.set("sent", "1");
      return NextResponse.redirect(url, 303);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
