import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "../session/route";
import { analyseInput } from "@/lib/intake/openai";
import type { IntakeMessage, AnalysisResponse } from "@/lib/intake/types";
import { VALIDATION } from "@/lib/intake/types";

/**
 * POST /api/intake/analyse
 * Analyses visitor input and returns structured interpretation.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id, message, input_type, turn_number } = body;

    // Validate
    if (!session_id || !message) {
      return NextResponse.json(
        { error: "session_id and message are required." },
        { status: 400 },
      );
    }

    const text = String(message).trim();
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

    if (turn_number > VALIDATION.MAX_TURNS) {
      return NextResponse.json(
        { error: "Maximum number of questions reached." },
        { status: 400 },
      );
    }

    const session = getSession(session_id);
    if (!session) {
      return NextResponse.json(
        { error: "Session not found. Please start again." },
        { status: 404 },
      );
    }

    // Add visitor message to context
    const visitorMessage: IntakeMessage = {
      role: "visitor",
      content: text,
      timestamp: new Date().toISOString(),
      input_type: input_type || "text",
    };

    const messages = [...session.messages, visitorMessage];

    // Update session
    updateSession(session_id, {
      messages,
      turn_count: turn_number,
      original_input_type: session.original_input_type || input_type,
      original_transcript: session.original_transcript || text,
    });

    // Call OpenAI
    const analysis: AnalysisResponse = await analyseInput(messages, turn_number);

    // Add assistant response to context
    const assistantMessage: IntakeMessage = {
      role: "assistant",
      content: JSON.stringify(analysis),
      timestamp: new Date().toISOString(),
    };

    updateSession(session_id, {
      messages: [...messages, assistantMessage],
      problem_summary: analysis.problem_summary,
      desired_outcome: analysis.desired_outcome,
      relevant_areas: analysis.relevant_areas,
      important_context: analysis.important_context,
    });

    // Determine next stage
    let stage: string;
    if (analysis.status === "READY_FOR_BRIEF") {
      stage = "brief";
    } else if (analysis.status === "OUT_OF_SCOPE") {
      stage = "brief"; // Still show a brief, but with can_likely_help = false
    } else {
      // NEEDS_FOLLOW_UP
      stage = turn_number >= VALIDATION.MAX_TURNS - 1 ? "final_question" : "follow_up";
    }

    return NextResponse.json({
      ...analysis,
      session_id,
      stage,
    });
  } catch (err) {
    console.error("Intake analyse error:", err);
    return NextResponse.json(
      { error: "Something went wrong while processing that. Your message is still here - please try again." },
      { status: 500 },
    );
  }
}
