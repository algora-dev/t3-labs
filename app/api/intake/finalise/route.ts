import { NextRequest, NextResponse } from "next/server";
import { generateBrief } from "@/lib/intake/openai";
import type { IntakeMessage, AnalysisResponse } from "@/lib/intake/types";
import { parseIntakeMessages } from "@/lib/intake/validation";

/**
 * POST /api/intake/finalise
 * Generates the final project brief from the conversation.
 * Stateless — receives full conversation context from the client.
 */

// Vercel function timeout — GPT-5.6 reasoning models can take 20-30s
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = parseIntakeMessages(body.messages);

    if (!messages) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 },
      );
    }

    // Extract analysis from the last assistant message
    const lastAssistant = [...messages]
      .reverse()
      .find((m: IntakeMessage) => m.role === "assistant");

    let analysisData: Partial<AnalysisResponse> = {};
    if (lastAssistant) {
      try {
        analysisData = JSON.parse(lastAssistant.content);
      } catch {
        // Use empty defaults
      }
    }

    // Generate the final brief
    const brief = await generateBrief(
      messages as IntakeMessage[],
      analysisData as AnalysisResponse,
    );

    return NextResponse.json(brief);
  } catch (err) {
    console.error("Intake finalise error:", err);
    const message = err instanceof Error ? err.message : "Something went wrong while creating your brief. Please try again.";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
