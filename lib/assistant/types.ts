import type { Estimate, PricedDraft } from '../pricing/estimate-engine';

export type AssistantCard =
  | { type: 'estimate'; estimate: Estimate }
  | { type: 'estimate_result'; result: PricedDraft }
  | { type: 'handoff'; summary: string };

export type AssistantAction =
  | { type: 'NAVIGATE_INTERNAL'; label: string; url: string; external: boolean }
  | { type: 'OPEN_INQUIRY'; label: string }
  | { type: 'ADD_ESTIMATE_OPTION'; label: string; followUpMessage: string }
  | { type: 'QUICK_REPLY'; label: string; message: string; description?: string; emphasis?: 'primary' | 'secondary' }
  | { type: 'DOWNLOAD_OUTPUT'; label: string; estimateId: string; estimateIds?: string[] }
  | { type: 'START_GUIDED_ESTIMATE'; label: string }
  | { type: 'ADJUST_ESTIMATE'; label: string };

export interface AssistantTurn {
  message: string;
  cards?: AssistantCard[];
  actions?: AssistantAction[];
  sessionFactsUpdated?: boolean;
}

export type ChatStreamEvent =
  | { type: 'token'; text: string }
  | { type: 'turn'; turn: AssistantTurn }
  | { type: 'error'; error: string };
