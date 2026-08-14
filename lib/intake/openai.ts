/**
 * T3 Labs AI Intake — OpenAI Integration
 * Uses the Responses API with Structured Outputs (recommended for GPT-5.6 reasoning models).
 */

import { INTAKE_SYSTEM_PROMPT } from "./prompts";
import type { AnalysisResponse, FinalBrief, IntakeMessage } from "./types";

// ── Model config (env-configurable per spec Section 36) ─────────────

const INTAKE_MODEL = process.env.OPENAI_INTAKE_MODEL || "gpt-5.6-luna";
const TRANSCRIPTION_MODEL = process.env.OPENAI_TRANSCRIPTION_MODEL || "gpt-4o-mini-transcribe";

type OpenAIResponseContent = {
  type?: string;
  text?: string;
  refusal?: string;
};

type OpenAIResponseOutput = {
  type?: string;
  content?: OpenAIResponseContent[];
};

type OpenAIResponsePayload = {
  id?: string;
  status?: string;
  output_text?: string;
  output?: OpenAIResponseOutput[];
  incomplete_details?: { reason?: string } | null;
  error?: { message?: string } | null;
};

const SERVICE_AREAS = new Set([
  "CUSTOM_SOFTWARE",
  "AI_INTEGRATIONS",
  "BUSINESS_GROWTH",
]);

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

// ── Build conversation context as Responses API input ──────────────

type ResponseInputItem = {
  role: "system" | "user" | "assistant" | "developer";
  content: string;
};

function buildConversationContext(
  messages: IntakeMessage[],
  turnNumber: number,
): ResponseInputItem[] {
  const input: ResponseInputItem[] = [
    { role: "system", content: INTAKE_SYSTEM_PROMPT },
  ];

  // Add conversation context
  for (const msg of messages) {
    input.push({
      role: msg.role === "visitor" ? "user" : "assistant",
      content: msg.content,
    });
  }

  // Add turn guidance as developer message
  let guidance: string;
  if (turnNumber === 1) {
    guidance =
      "This is the visitor's first input. Analyse their problem, reflect your understanding, and ask ONE follow-up question that materially improves the inquiry. If the problem and desired outcome are already clear, set status to READY_FOR_BRIEF.";
  } else if (turnNumber === 2) {
    guidance =
      "This is the visitor's second input. If you now understand both the problem and the desired outcome, set status to READY_FOR_BRIEF. Only ask a third question if a genuinely critical ambiguity remains.";
  } else {
    guidance =
      "This is the visitor's final input (maximum 3 turns). You must now set status to READY_FOR_BRIEF. Do not ask another question.";
  }

  input.push({ role: "developer", content: guidance });

  return input;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractResponseText(data: OpenAIResponsePayload): string {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const textParts: string[] = [];
  const refusals: string[] = [];

  for (const item of data.output ?? []) {
    if (item.type !== "message" || !Array.isArray(item.content)) continue;

    for (const content of item.content) {
      if (content.type === "output_text" && typeof content.text === "string") {
        textParts.push(content.text);
      } else if (content.type === "refusal" && typeof content.refusal === "string") {
        refusals.push(content.refusal);
      }
    }
  }

  const combinedText = textParts.join("").trim();
  if (combinedText) return combinedText;

  if (refusals.length > 0) {
    throw new Error("The AI could not process this request. Please rephrase it and try again.");
  }

  if (data.status === "incomplete") {
    const reason = data.incomplete_details?.reason || "unknown reason";
    throw new Error(`The AI response was incomplete (${reason}). Please try again.`);
  }

  throw new Error(
    `The AI returned no usable text (response ${data.id || "unknown"}, status ${data.status || "unknown"}).`,
  );
}

function parseStructuredResponse<T>(
  data: OpenAIResponsePayload,
  validate: (value: unknown) => value is T,
  label: string,
): T {
  const content = extractResponseText(data);
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error(`The AI returned invalid ${label} JSON. Please try again.`);
  }

  if (!validate(parsed)) {
    throw new Error(`The AI returned an incomplete ${label}. Please try again.`);
  }

  return parsed;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isServiceAreaArray(value: unknown): value is AnalysisResponse["relevant_areas"] {
  return isStringArray(value) && value.every((area) => SERVICE_AREAS.has(area));
}

function isAnalysisResponse(value: unknown): value is AnalysisResponse {
  if (!isRecord(value)) return false;

  return (
    ["NEEDS_FOLLOW_UP", "READY_FOR_BRIEF", "OUT_OF_SCOPE"].includes(String(value.status)) &&
    typeof value.understanding === "string" &&
    typeof value.problem_summary === "string" &&
    typeof value.desired_outcome === "string" &&
    (typeof value.follow_up_question === "string" || value.follow_up_question === null) &&
    isServiceAreaArray(value.relevant_areas) &&
    isStringArray(value.important_context)
  );
}

function isFinalBrief(value: unknown): value is FinalBrief {
  if (!isRecord(value)) return false;

  return (
    typeof value.can_likely_help === "boolean" &&
    typeof value.headline === "string" &&
    typeof value.problem === "string" &&
    typeof value.desired_outcome === "string" &&
    typeof value.likely_solution === "string" &&
    isServiceAreaArray(value.relevant_areas) &&
    isStringArray(value.important_context) &&
    typeof value.internal_handoff_summary === "string"
  );
}

async function createStructuredResponse<T>(input: ResponseInputItem[], options: {
  schemaName: string;
  schema: typeof analysisSchema | typeof briefSchema;
  maxOutputTokens: number;
  validate: (value: unknown) => value is T;
  label: string;
}): Promise<T> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("AI intake is temporarily unavailable. Please try again later.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: INTAKE_MODEL,
      input,
      reasoning: { effort: "low" },
      max_output_tokens: options.maxOutputTokens,
      text: {
        format: {
          type: "json_schema",
          name: options.schemaName,
          schema: options.schema,
          strict: true,
        },
      },
    }),
  });

  const requestId = response.headers.get("x-request-id") || "unknown";

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenAI intake request failed", {
      status: response.status,
      requestId,
      body: errorText.slice(0, 1000),
    });
    throw new Error("The AI service could not process that request. Please try again.");
  }

  let data: OpenAIResponsePayload;
  try {
    data = (await response.json()) as OpenAIResponsePayload;
  } catch {
    throw new Error("The AI service returned an unreadable response. Please try again.");
  }

  if (data.error?.message) {
    console.error("OpenAI intake response error", {
      requestId,
      responseId: data.id,
      message: data.error.message,
    });
    throw new Error("The AI service could not process that request. Please try again.");
  }

  return parseStructuredResponse(data, options.validate, options.label);
}

// ── Analyse visitor input ───────────────────────────────────────────

export async function analyseInput(
  messages: IntakeMessage[],
  turnNumber: number,
): Promise<AnalysisResponse> {
  const input = buildConversationContext(messages, turnNumber);

  const parsed = await createStructuredResponse(input, {
    schemaName: "intake_analysis",
    schema: analysisSchema,
    maxOutputTokens: 2000,
    validate: isAnalysisResponse,
    label: "intake analysis",
  });

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
  const input: ResponseInputItem[] = [
    { role: "developer", content: INTAKE_SYSTEM_PROMPT },
  ];

  // Add conversation
  for (const msg of messages) {
    input.push({
      role: msg.role === "visitor" ? "user" : "assistant",
      content: msg.content,
    });
  }

  // Add analysis context
  input.push({
    role: "assistant",
    content: JSON.stringify({
      problem_summary: analysis.problem_summary,
      desired_outcome: analysis.desired_outcome,
      relevant_areas: analysis.relevant_areas,
      important_context: analysis.important_context,
    }),
  });

  input.push({
    role: "developer",
    content:
      "Based on the conversation above, generate the final project brief. Keep the problem, desired outcome, and likely solution concise. The headline should be 'This sounds like something T3 Labs can help with.' if the project is within scope. The internal_handoff_summary can be more detailed for the T3 Labs team.",
  });

  const parsed = await createStructuredResponse(input, {
    schemaName: "intake_brief",
    schema: briefSchema,
    maxOutputTokens: 2500,
    validate: isFinalBrief,
    label: "project brief",
  });

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
