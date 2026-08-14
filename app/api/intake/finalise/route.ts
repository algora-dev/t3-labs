import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "../session/route";
import { generateBrief } from "@/lib/intake/openai";

/**
 * POST /api/intake/finalise
 * Generates the final project brief from the conversation.
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: "session_id is required." },
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

    // Build a synthetic analysis from the session if we don't have one
    const lastAnalysis = session.messages
      .filter((m) => m.role === "assistant")
      .pop();

    let analysisData;
    try {
      analysisData = lastAnalysis ? JSON.parse(lastAnalysis.content) : {
        problem_summary: session.problem_summary || "",
        desired_outcome: session.desired_outcome || "",
        relevant_areas: session.relevant_areas || [],
        important_context: session.important_context || [],
      };
    } catch {
      analysisData = {
        problem_summary: session.problem_summary || "",
        desired_outcome: session.desired_outcome || "",
        relevant_areas: session.relevant_areas || [],
        important_context: session.important_context || [],
      };
    }

    // Generate the final brief
    const brief = await generateBrief(session.messages, analysisData);

    // Update session
    updateSession(session_id, {
      status: "brief_ready",
      likely_solution: brief.likely_solution,
      current_stage: "brief",
    });

    return NextResponse.json({
      ...brief,
      session_id,
      intake_id: session_id,
    });
  } catch (err) {
    console.error("Intake finalise error:", err);
    return NextResponse.json(
      { error: "Something went wrong while creating your brief. Please try again." },
      { status: 500 },
    );
  }
}
