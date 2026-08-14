import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/intake/openai";
import { VALIDATION } from "@/lib/intake/types";

/**
 * POST /api/intake/transcribe
 * Receives an audio file and returns a transcript.
 */

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data with an audio file." },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided." },
        { status: 400 },
      );
    }

    // Validate file size
    if (audioFile.size > VALIDATION.MAX_AUDIO_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Audio file is too large. Maximum 25MB." },
        { status: 400 },
      );
    }

    // Validate MIME type
    const allowedTypes = [
      "audio/webm",
      "audio/webm;codecs=opus",
      "audio/ogg",
      "audio/mp3",
      "audio/mp4",
      "audio/wav",
      "audio/mpeg",
    ];

    if (!allowedTypes.some((t) => audioFile.type.startsWith(t.split(";")[0]))) {
      return NextResponse.json(
        { error: "Unsupported audio format. Please use a standard browser recording." },
        { status: 400 },
      );
    }

    const audioBlob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type });
    const transcript = await transcribeAudio(audioBlob);

    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json(
        { error: "We couldn't transcribe that recording. Try again, or type your message instead." },
        { status: 422 },
      );
    }

    return NextResponse.json({ transcript });
  } catch (err) {
    console.error("Intake transcribe error:", err);
    return NextResponse.json(
      { error: "We couldn't transcribe that recording. Try again, or type your message instead." },
      { status: 500 },
    );
  }
}
