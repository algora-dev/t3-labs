import type { FinalBrief, IntakeMessage, ServiceArea } from "./types";

const MAX_CONVERSATION_MESSAGES = 7;
const MAX_MESSAGE_LENGTH = 8_000;
const SERVICE_AREAS = new Set<ServiceArea>([
  "CUSTOM_SOFTWARE",
  "AI_INTEGRATIONS",
  "BUSINESS_GROWTH",
]);

export function parseIntakeMessages(value: unknown): IntakeMessage[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_CONVERSATION_MESSAGES) {
    return null;
  }

  const messages: IntakeMessage[] = [];

  for (const message of value) {
    if (typeof message !== "object" || message === null || Array.isArray(message)) {
      return null;
    }

    const candidate = message as Record<string, unknown>;
    if (
      (candidate.role !== "visitor" && candidate.role !== "assistant") ||
      typeof candidate.content !== "string" ||
      !candidate.content.trim() ||
      candidate.content.length > MAX_MESSAGE_LENGTH ||
      typeof candidate.timestamp !== "string"
    ) {
      return null;
    }

    if (
      candidate.input_type !== undefined &&
      candidate.input_type !== "text" &&
      candidate.input_type !== "voice"
    ) {
      return null;
    }

    messages.push({
      role: candidate.role,
      content: candidate.content.trim(),
      timestamp: candidate.timestamp,
      ...(candidate.input_type ? { input_type: candidate.input_type } : {}),
    });
  }

  return messages;
}

export function parseFinalBrief(value: unknown): FinalBrief | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const brief = value as Record<string, unknown>;
  if (
    typeof brief.can_likely_help !== "boolean" ||
    typeof brief.headline !== "string" ||
    typeof brief.problem !== "string" ||
    typeof brief.desired_outcome !== "string" ||
    typeof brief.likely_solution !== "string" ||
    !Array.isArray(brief.relevant_areas) ||
    !brief.relevant_areas.every(
      (area): area is ServiceArea => typeof area === "string" && SERVICE_AREAS.has(area as ServiceArea),
    ) ||
    !Array.isArray(brief.important_context) ||
    !brief.important_context.every((item) => typeof item === "string") ||
    typeof brief.internal_handoff_summary !== "string"
  ) {
    return null;
  }

  return brief as unknown as FinalBrief;
}
