import type { Estimate } from '../pricing/estimate-engine';

/** Structured turn contract (spec section 11). Frontend renders only these payloads. */

export type AssistantCard =
  | { type: 'estimate'; estimate: Estimate }
  | { type: 'handoff'; summary: string };

export type AssistantAction =
  | { type: 'NAVIGATE_INTERNAL'; label: string; url: string; external: boolean }
  | { type: 'OPEN_INQUIRY'; label: string }
  | { type: 'ADD_ESTIMATE_OPTION'; label: string; followUpMessage: string }
  | { type: 'DOWNLOAD_OUTPUT'; label: string; estimateId: string };

export interface AssistantTurn {
  message: string;
  cards?: AssistantCard[];
  actions?: AssistantAction[];
  sessionFactsUpdated?: boolean;
}

/** SSE events emitted by /api/chat. */
export type ChatStreamEvent =
  | { type: 'token'; text: string }
  | { type: 'turn'; turn: AssistantTurn }
  | { type: 'error'; error: string };
