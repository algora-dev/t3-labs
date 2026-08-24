import { NextRequest, NextResponse } from "next/server";

// Demonstration handler for takeoff enquiry file uploads: accepts the upload
// and returns a placeholder URL without storing anything.

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Demonstration mode: acknowledge without storing.
    return NextResponse.json({
      url: `data:application/octet-stream,name=${encodeURIComponent(file.name)}`,
      demo: true,
    });
  } catch (err) {
    console.error("[supplier-enquiry] Unexpected error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
