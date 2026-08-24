import { NextRequest, NextResponse } from "next/server";

// Demonstration handler: validates the enquiry payload and returns success
// without sending or storing anything. No email service is connected.

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data?.senderEmail || !data?.senderName) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    // Demonstration mode: validate and acknowledge without sending anything.
    return NextResponse.json({ ok: true, demo: true });
  } catch (err) {
    console.error("[send-enquiry] Unexpected error:", err);
    return NextResponse.json({ ok: false, error: "An unexpected error occurred" }, { status: 500 });
  }
}
