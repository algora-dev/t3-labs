import type { HelperTaskId } from './config';
import type { HelperState } from './state';

/** Transient UI feedback only. Never persist prompt text, conversation data or a busy state. */
export type AssistantPhase = 'prepared' | 'editing' | 'sending' | 'answered' | 'error';
export interface AssistantActivity {
  phase: AssistantPhase;
  runId: number;
  task: HelperTaskId;
  requestId?: string;
}
export function isAssistantTask(task: HelperTaskId): boolean {
  return task === 'answers' || task === 'assistant-price';
}
export function activityForRun(activity: AssistantActivity | null, helper: HelperState): AssistantActivity | null {
  return activity && activity.runId === helper.runId && activity.task === helper.current ? activity : null;
}
export function nextAssistantActivity(
  previous: AssistantActivity | null, incoming: AssistantActivity, helper: HelperState,
): AssistantActivity | null {
  if (!isAssistantTask(helper.current) || incoming.runId !== helper.runId || incoming.task !== helper.current) return previous;
  if (!['prepared', 'editing', 'sending', 'answered', 'error'].includes(incoming.phase)) return previous;
  // A late network response must not replace feedback for a newer request.
  if (incoming.requestId && incoming.phase !== 'sending' && previous?.requestId
    && activityForRun(previous, helper) && incoming.requestId !== previous.requestId) return previous;
  return { phase: incoming.phase, runId: incoming.runId, task: incoming.task,
    ...(incoming.requestId ? { requestId: incoming.requestId } : {}) };
}
