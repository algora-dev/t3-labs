import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://aaavvfttkesdzblttmby.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL = process.env.CONTACT_EMAIL || "insights@t3labs.co.uk";

/** Lightweight enquiry from the /our-solution assessment secondary CTA. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, business, email, website, improve, message } = body;

    if (!name || !business || !email) {
      return NextResponse.json({ error: "Name, business name and email are required." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const cleanName = String(name).trim().slice(0, 200);
    const cleanBusiness = String(business).trim().slice(0, 200);
    const cleanEmail = String(email).trim().toLowerCase().slice(0, 200);
    const cleanWebsite = website ? String(website).trim().slice(0, 500) : null;
    const cleanMessage = message ? String(message).trim().slice(0, 5000) : null;
    const improveList = Array.isArray(improve) ? improve.map((i: unknown) => String(i).slice(0, 100)).slice(0, 20) : [];

    const summary = [
      improveList.length ? `Wants to improve: ${improveList.join(", ")}` : null,
      cleanMessage ? `Notes: ${cleanMessage}` : null,
      cleanWebsite ? `Website: ${cleanWebsite}` : null,
    ].filter(Boolean).join("\n\n");

    if (SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/contact_enquiries`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          company: cleanBusiness,
          subject: cleanWebsite,
          message: summary || "(no additional details)",
          source: "our-solution",
        }),
      });
      if (!supabaseRes.ok) {
        console.error("Supabase insert error (our-solution-enquiry):", await supabaseRes.text());
        // Don't block - still try to send email
      }
    }

    if (RESEND_API_KEY) {
      const html = `
        <h2>New /our-solution enquiry</h2>
        <p><strong>Name:</strong> ${cleanName}</p>
        <p><strong>Business:</strong> ${cleanBusiness}</p>
        <p><strong>Email:</strong> ${cleanEmail}</p>
        ${cleanWebsite ? `<p><strong>Website:</strong> ${cleanWebsite}</p>` : ""}
        ${improveList.length ? `<p><strong>Wants to improve:</strong><br>${improveList.map((i: string) => `- ${i}`).join("<br>")}</p>` : ""}
        ${cleanMessage ? `<p><strong>Notes:</strong><br>${cleanMessage.replace(/\n/g, "<br>")}</p>` : ""}
      `;
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "T3 Labs <noreply@t3labs.co.uk>",
          to: [NOTIFY_EMAIL],
          subject: `Our-solution enquiry - ${cleanBusiness}`,
          html,
        }),
      }).catch((e) => console.error("Resend send failed:", e));
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
