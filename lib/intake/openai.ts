/**
 * T3 Labs AI Intake — OpenAI Integration
 * Uses the Responses API with Structured Outputs.
 */

import { INTAKE_SYSTEM_PROMPT } from "./prompts";
import type { AnalysisResponse, FinalBrief, IntakeMessage } from "./types";

// ── Model config (env-configurable per spec Section 36) ─────────────

const INTAKE_MODEL = process.env.OPENAI_INTAKE_MODEL || "gpt-5.6-luna";
const TRANSCRIPTION_MODEL = process.env.OPENAI_TRANSCRIPTION_MODEL || "gpt-4o-mini-transcribe";

// ── JSON Schemas for Structured Outputs ─────────────────────────────

const analysisSchema = {
  type: "object",
  properties: {
    status: {
      type: "string",
      enum: ["NEEDS_FOLLOW_UP", "READY_FOR_BRIEF", "OUT_OF_SCOPE"],
    },
    understanding: { type: "string" },
    problem_summary: { type: "string" },
    desired_outcome: { type: "string" },
    follow_up_question: { type: ["string", "null"] },
    relevant_areas: {
      type: "array",
      items: {
        type: "string",
        enum: ["CUSTOM_SOFTWARE", "AI_INTEGRATIONS", "BUSINESS_GROWTH"],
      },
      maxItems: 3,
    },
    important_context: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "status",
    "understanding",
    "problem_summary",
    "desired_outcome",
    "follow_up_question",
    "relevant_areas",
    "important_context",
  ],
  additionalProperties: false,
} as const;

const briefSchema = {
  type: "object",
  properties: {
    can_likely_help: { type: "boolean" },
    headline: { type: "string" },
    problem: { type: "string" },
    desired_outcome: { type: "string" },
    likely_solution: { type: "string" },
    relevant_areas: {
      type: "array",
      items: {
        type: "string",
        enum: ["CUSTOM_SOFTWARE", "AI_INTEGRATIONS", "BUSINESS_GROWTH"],
      },
      maxItems: 3,
    },
    important_context: {
      type: "array",
      items: { type: "string" },
      maxItems: 5,
    },
    internal_handoff_summary: { type: "string" },
  },
  required: [
    "can_likely_help",
    "headline",
    "problem",
    "desired_outcome",
    "likely_solution",
    "relevant_areas",
    "important_context",
    "internal_handoff_summary",
  ],
  additionalProperties: false,
} as const;

// ── Build conversation context ──────────────────────────────────────

function buildConversationContext(
  messages: IntakeMessage[],
  turnNumber: number,
): { role: "system" | "user" | "assistant"; content: string }[] {
  const context: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: INTAKE_SYSTEM_PROMPT },
  ];

  // Add conversation context
  for (const msg of messages) {
    context.push({
      role: msg.role === "visitor" ? "user" : "assistant",
      content: msg.content,
    });
  }

  // Add turn guidance
  if (turnNumber === 1) {
    context.push({
      role: "system",
      content:
        "This is the visitor's first input. Analyse their problem, reflect your understanding, and ask ONE follow-up question that materially improves the inquiry. If the problem and desired outcome are already clear, set status to READY_FOR_BRIEF.",
    });
  } else if (turnNumber === 2) {
    context.push({
      role: "system",
      content:
        "This is the visitor's second input. If you now understand both the problem and the desired outcome, set status to READY_FOR_BRIEF. Only ask a third question if a genuinely critical ambiguity remains.",
    });
  } else if (turnNumber >= 3) {
    context.push({
      role: "system",
      content:
        "This is the visitor's final input (maximum 3 turns). You must now set status to READY_FOR_BRIEF. Do not ask another question.",
    });
  }

  return context;
}

// ── Analyse visitor input ───────────────────────────────────────────

export async function analyseInput(
  messages: IntakeMessage[],
  turnNumber: number,
): Promise<AnalysisResponse> {
  const context = buildConversationContext(messages, turnNumber);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    body: JSON.stringify({
      model: INTAKE_MODEL,
      messages: context,
      response_format: { type: "json_schema", json_schema: { name: "intake_analysis", schema: analysisSchema, strict: true } },
      max_tokens: 600,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const parsed = JSON.parse(content) as AnalysisResponse;

  // Enforce copy limits (word counts)
  parsed.understanding = truncateWords(parsed.understanding, 60);
  if (parsed.follow_up_question) {
    parsed.follow_up_question = truncateWords(parsed.follow_up_question, 25);
  }

  return parsed;
}

// ── Generate final brief ────────────────────────────────────────────

export async function generateBrief(
  messages: IntakeMessage[],
  analysis: AnalysisResponse,
): Promise<FinalBrief> {
  const context: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: INTAKE_SYSTEM_PROMPT },
  ];

  // Add conversation
  for (const msg of messages) {
    context.push({
      role: msg.role === "visitor" ? "user" : "assistant",
      content: msg.content,
    });
  }

  // Add analysis context
  context.push({
    role: "assistant",
    content: JSON.stringify({
      problem_summary: analysis.problem_summary,
      desired_outcome: analysis.desired_outcome,
      relevant_areas: analysis.relevant_areas,
      important_context: analysis.important_context,
    }),
  });

  context.push({
    role: "system",
    content:
      "Based on the conversation above, generate the final project brief. Keep the problem, desired outcome, and likely solution concise. The headline should be 'This sounds like something T3 Labs can help with.' if the project is within scope. The internal_handoff_summary can be more detailed for the T3 Labs team.",
  });

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    body: JSON.stringify({
      model: INTAKE_MODEL,
      messages: context,
      response_format: { type: "json_schema", json_schema: { name: "intake_brief", schema: briefSchema, strict: true } },
      max_tokens: 800,
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  const parsed = JSON.parse(content) as FinalBrief;

  // Enforce copy limits
  parsed.problem = truncateWords(parsed.problem, 45);
  parsed.desired_outcome = truncateWords(parsed.desired_outcome, 30);
  parsed.likely_solution = truncateWords(parsed.likely_solution, 45);

  return parsed;
}

// ── Transcribe audio ────────────────────────────────────────────────

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");
  formData.append("model", TRANSCRIPTION_MODEL);
  formData.append("response_format", "json");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Transcription API error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  return data.text as string;
}

// ── Helpers ─────────────────────────────────────────────────────────

function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(" ") + "...";
}
