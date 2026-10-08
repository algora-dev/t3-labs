import { initialJourney, readJourney, reduceJourney } from './state';
import type { JourneyAction } from './state';
import type { DemoAction, DemoSignal, TaskId } from './config';
export const JOURNEY_KEY = 'apex.demo.journey.v1';
export const DEMO_ACTION_EVENT = 'apex-demo-action';
const CHANGE_EVENT = 'apex-demo-progress';
let memory: string | null = null;
export function journeySnapshot(): string | null {
  if (typeof window === 'undefined') return null;
  try { return window.sessionStorage.getItem(JOURNEY_KEY) ?? memory; } catch { return memory; }
}
export function subscribeJourney(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => { window.removeEventListener(CHANGE_EVENT, callback); window.removeEventListener('storage', callback); };
}
export function updateJourney(action: JourneyAction): void {
  if (typeof window === 'undefined') return;
  const state = readJourney(journeySnapshot());
  const next = reduceJourney(state, action);
  if (next === state) return;
  memory = JSON.stringify(next);
  try { window.sessionStorage.setItem(JOURNEY_KEY, memory); } catch { /* Blocked storage: this page still works in memory. */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
export function recordDemoSignal(signal: DemoSignal): void { updateJourney({ type: 'signal', signal }); }
export function recordDemoFailure(task: TaskId): void { updateJourney({ type: 'failure', task }); }
export function requestDemoAction(action: DemoAction): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(DEMO_ACTION_EVENT, { detail: { action } }));
}
export function actionFromEvent(event: Event): DemoAction | null {
  const action: unknown = (event as CustomEvent<{ action?: unknown }>).detail?.action;
  return ['assistant-prompt', 'quick-example', 'detailed-example', 'plan-example', 'trade-example', 'assistant-close'].includes(action as string) ? action as DemoAction : null;
}
export function getJourney() { return typeof window === 'undefined' ? initialJourney() : readJourney(journeySnapshot()); }
