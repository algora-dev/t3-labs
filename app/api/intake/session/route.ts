import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import type { IntakeMessage, IntakeStage, ServiceArea } from "@/lib/intake/types";

/**
 * POST /api/intake/session
 * Creates a new intake session.
 * Sessions are stored in-memory for V1 (no database needed until Phase 4).
 * In production, this would persist to Supabase.
 */

interface IntakeSessionData {
  id: string;
  created_at: string;
  status: "active" | "brief_ready" | "submitted" | "abandoned";
  source: "hero_modal";
  turn_count: number;
  original_input_type: string | null;
  original_transcript: string;
  messages: IntakeMessage[];
  problem_summary: string | null;
  desired_outcome: string | null;
  likely_solution: string | null;
  relevant_areas: ServiceArea[];
  important_context: string[];
  ready_for_inquiry: boolean;
  contact: { name: string; email: string; company: string | null; phone: string | null } | null;
  current_stage: IntakeStage;
}

declare global {
  var intakeSessions: Map<string, IntakeSessionData> | undefined;
}

const sessions = globalThis.intakeSessions ?? (globalThis.intakeSessions = new Map<string, IntakeSessionData>());

export function getSession(id: string): IntakeSessionData | undefined {
  return sessions.get(id);
}

export function updateSession(id: string, updates: Partial<IntakeSessionData>) {
  const existing = sessions.get(id);
  if (existing) {
    sessions.set(id, { ...existing, ...updates });
  }
}

export function deleteSession(id: string) {
  sessions.delete(id);
}

export async function POST() {
  try {
    const sessionId = `intake_${randomUUID()}`;
    const now = new Date().toISOString();

    const session: IntakeSessionData = {
      id: sessionId,
      created_at: now,
      status: "active",
      source: "hero_modal",
      turn_count: 0,
      original_input_type: null,
      original_transcript: "",
      messages: [],
      problem_summary: null,
      desired_outcome: null,
      likely_solution: null,
      relevant_areas: [],
      important_context: [],
      ready_for_inquiry: false,
      contact: null,
      current_stage: "intro",
    };

    sessions.set(sessionId, session);

    return NextResponse.json({ session_id: sessionId });
  } catch (err) {
    console.error("Intake session creation error:", err);
    return NextResponse.json(
      { error: "Failed to create session." },
      { status: 500 },
    );
  }
}
