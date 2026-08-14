/**
 * T3 Labs AI Intake Modal — Shared Types
 * Based on the build spec: structured output schemas, state machine, and session model.
 */

// ── Service classification ──────────────────────────────────────────

export type ServiceArea = "CUSTOM_SOFTWARE" | "AI_INTEGRATIONS" | "BUSINESS_GROWTH";

export const SERVICE_LABELS: Record<ServiceArea, string> = {
  CUSTOM_SOFTWARE: "Custom Software Solutions",
  AI_INTEGRATIONS: "AI Integrations",
  BUSINESS_GROWTH: "Business Growth",
};

// ── State machine (application-controlled) ──────────────────────────

export type IntakeStage =
  | "intro"                    // Step 1: initial input (text or voice)
  | "recording"                // Voice recording in progress
  | "transcribing"             // Sending audio to backend
  | "initial_processing"       // AI analysing first input
  | "follow_up"                // Step 2: AI understanding + one question
  | "follow_up_processing"     // AI analysing follow-up answer
  | "final_question"           // Step 3 (optional): one last question
  | "final_processing"         // AI analysing final answer
  | "brief"                    // Final brief displayed
  | "contact"                  // Contact form for email submission
  | "booking"                  // Calendly embed
  | "submitted"                // Completion state
  | "error";                   // Error state

// Valid state transitions (enforced server-side)
export const VALID_TRANSITIONS: Record<IntakeStage, IntakeStage[]> = {
  intro: ["initial_processing", "recording", "error"],
  recording: ["transcribing", "intro", "error"],
  transcribing: ["intro", "initial_processing", "error"],
  initial_processing: ["follow_up", "brief", "error"],
  follow_up: ["follow_up_processing", "brief", "error"],
  follow_up_processing: ["final_question", "brief", "error"],
  final_question: ["final_processing", "brief", "error"],
  final_processing: ["brief", "error"],
  brief: ["contact", "booking", "error"],
  contact: ["submitted", "error"],
  booking: ["submitted", "brief", "error"],
  submitted: [],
  error: ["intro"],
};

// ── AI structured output: analysis turn ─────────────────────────────

export type AnalysisStatus = "NEEDS_FOLLOW_UP" | "READY_FOR_BRIEF" | "OUT_OF_SCOPE";

export interface AnalysisResponse {
  status: AnalysisStatus;
  understanding: string;
  problem_summary: string;
  desired_outcome: string;
  follow_up_question: string | null;
  relevant_areas: ServiceArea[];
  important_context: string[];
}

// ── AI structured output: final brief ───────────────────────────────

export interface FinalBrief {
  can_likely_help: boolean;
  headline: string;
  problem: string;
  desired_outcome: string;
  likely_solution: string;
  relevant_areas: ServiceArea[];
  important_context: string[];
  internal_handoff_summary: string;
}

// ── Session model ───────────────────────────────────────────────────

export interface IntakeSession {
  id: string;
  created_at: string;
  status: "active" | "brief_ready" | "submitted" | "abandoned";
  source: "hero_modal";
  turn_count: number;
  original_input_type: "voice" | "text";
  original_transcript: string;
  messages: IntakeMessage[];
  problem_summary: string | null;
  desired_outcome: string | null;
  likely_solution: string | null;
  relevant_areas: ServiceArea[];
  important_context: string[];
  ready_for_inquiry: boolean;
  contact: ContactDetails | null;
  // Tracking
  current_stage: IntakeStage;
}

export interface IntakeMessage {
  role: "visitor" | "assistant";
  content: string;
  timestamp: string;
  input_type?: "text" | "voice";
}

export interface ContactDetails {
  name: string;
  email: string;
  company?: string;
  phone?: string;
}

// ── API request/response types ──────────────────────────────────────

export interface AnalyseRequest {
  messages: IntakeMessage[];
  turn_number: number;
}

export interface AnalyseResponse extends AnalysisResponse {
  stage: IntakeStage;
}

export interface FinaliseRequest {
  messages: IntakeMessage[];
}

export type FinaliseResponse = FinalBrief;

export interface SubmitRequest {
  messages: IntakeMessage[];
  brief: FinalBrief;
  contact: ContactDetails;
  original_input_type: "voice" | "text";
}

export interface SubmitResponse {
  success: boolean;
}

// ── Visible copy limits (enforced) ──────────────────────────────────

export const COPY_LIMITS = {
  understanding: 60,      // ~60 words
  follow_up_question: 25, // ~25 words
  problem: 45,            // ~45 words
  desired_outcome: 30,    // ~30 words
  likely_solution: 45,    // ~45 words
} as const;

// ── Validation limits ───────────────────────────────────────────────

export const VALIDATION = {
  MIN_TEXT_LENGTH: 20,
  MAX_TEXT_LENGTH: 8000,
  MAX_AUDIO_DURATION_MS: 5 * 60 * 1000, // 5 minutes
  MAX_AUDIO_SIZE_BYTES: 25 * 1024 * 1024, // 25 MB
  MAX_TURNS: 3,
} as const;
