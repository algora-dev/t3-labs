import { NextRequest, NextResponse } from "next/server";
import { analyseInput } from "@/lib/intake/openai";
import type { IntakeMessage } from "@/lib/intake/types";
import { VALIDATION } from "@/lib/intake/types";
import { parseIntakeMessages } from "@/lib/intake/validation";

/**
 * POST /api/intake/analyse
 * Analyses visitor input and returns structured interpretation.
 * Stateless — receives full conversation context from the client.
 */

// Vercel function timeout — GPT-5.6 reasoning models can take 20-30s
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages: rawMessages, turn_number } = body;
    const messages = parseIntakeMessages(rawMessages);

    // Validate
    if (!messages) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 },
      );
    }

    // Get the last visitor message
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== "visitor") {
      return NextResponse.json(
        { error: "Last message must be from the visitor." },
        { status: 400 },
      );
    }

    const text = String(lastMessage.content).trim();
    if (text.length < VALIDATION.MIN_TEXT_LENGTH) {
      return NextResponse.json(
        { error: "A little more detail will help us understand what you need." },
        { status: 400 },
      );
    }

    if (text.length > VALIDATION.MAX_TEXT_LENGTH) {
      return NextResponse.json(
        { error: "Message is too long. Please shorten it." },
        { status: 400 },
      );
    }

    const turn = Number(turn_number) || 1;
    if (turn > VALIDATION.MAX_TURNS) {
      return NextResponse.json(
        { error: "Maximum number of questions reached." },
        { status: 400 },
      );
    }

    // Call OpenAI with full conversation context
    const analysis = await analyseInput(messages as IntakeMessage[], turn);

    // Determine next stage
    let stage: string;
    if (analysis.status === "READY_FOR_BRIEF") {
      stage = "brief";
    } else if (analysis.status === "OUT_OF_SCOPE") {
      stage = "brief";
    } else {
      // NEEDS_FOLLOW_UP
      stage = turn >= VALIDATION.MAX_TURNS - 1 ? "final_question" : "follow_up";
    }

    return NextResponse.json({
      ...analysis,
      stage,
    });
  } catch (err) {
    console.error("Intake analyse error:", err);
    const message = err instanceof Error ? err.message : "Something went wrong while processing that. Your message is still here - please try again.";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
