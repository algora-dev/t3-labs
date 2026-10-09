import { readHelper, reduceHelper } from './state';
import type { HelperAction } from './state';
import type { HelperCommand, HelperSignal } from './config';
export const HELPER_KEY = 'apex.demo.helper.v2';
export const HELPER_POSITION_KEY = 'apex.demo.helper.position.v2';
export const HELPER_REVEAL_EVENT = 'apex-demo-helper-reveal';
export const HELPER_COMMAND_EVENT = 'apex-demo-helper-command';
const CHANGE = 'apex-demo-helper-change';
const SURFACE_CHANGE = 'apex-demo-helper-surface';
let memory: string | null = null;
let surface: 'website' | 'assistant' | 'assistant-enquiry' | 'quick-enquiry' = 'website';
export function helperSnapshot(): string | null {
  if (typeof window === 'undefined') return null;
  try { return sessionStorage.getItem(HELPER_KEY) ?? memory; } catch { return memory; }
}
export function subscribeHelper(callback: () => void) {
  window.addEventListener(CHANGE, callback); window.addEventListener('storage', callback);
  return () => { window.removeEventListener(CHANGE, callback); window.removeEventListener('storage', callback); };
}
export function getHelper() { return readHelper(helperSnapshot()); }
export function updateHelper(a: HelperAction) {
  if (typeof window === 'undefined') return;
  const previous = getHelper(); const next = reduceHelper(previous, a); if (next === previous) return;
  memory = JSON.stringify(next);
  try { sessionStorage.setItem(HELPER_KEY, memory); } catch { /* Tab still works without storage. */ }
  window.dispatchEvent(new Event(CHANGE));
}
export function recordHelperSignal(signal: HelperSignal, context?: { runId: number; task?: import('./config').HelperTaskId }) { updateHelper({ type: 'signal', signal, ...context }); }
const PENDING_KEY = 'apex.demo.helper.command.v2';
let pendingMemory: { command: HelperCommand; expires: number } | null = null;
export function sendHelperCommand(command: HelperCommand) {
  pendingMemory = { command, expires: Date.now() + 30000 };
  try { sessionStorage.setItem(PENDING_KEY, JSON.stringify(pendingMemory)); } catch { /* Memory fallback. */ }
  window.dispatchEvent(new CustomEvent(HELPER_COMMAND_EVENT, { detail: command }));
}
export function takeHelperCommand(accepted: readonly HelperCommand[]): HelperCommand | null {
  let value = pendingMemory;
  try { const raw = sessionStorage.getItem(PENDING_KEY); if (raw) value = JSON.parse(raw); } catch { /* Ignore edited storage. */ }
  if (!value || !Number.isFinite(value.expires) || value.expires < Date.now() || !accepted.includes(value.command)) return null;
  pendingMemory = null;
  try { sessionStorage.removeItem(PENDING_KEY); } catch { /* Optional. */ }
  return value.command;
}
export function readHelperCommand(event: Event): HelperCommand | null {
  const command: unknown = (event as CustomEvent).detail;
  return ['question', 'price-prompt', 'assistant-open', 'assistant-enquiry', 'quick-enquiry', 'admin-trade', 'assistant-close'].includes(String(command)) ? command as HelperCommand : null;
}
export function setHelperSurface(value: typeof surface) { surface = value; if (typeof window !== 'undefined') window.dispatchEvent(new Event(SURFACE_CHANGE)); }
export function surfaceSnapshot() { return surface; }
export function subscribeSurface(callback: () => void) { window.addEventListener(SURFACE_CHANGE, callback); return () => window.removeEventListener(SURFACE_CHANGE, callback); }

/** Reveal the existing task and recover its position, without resetting any progress. */
export function revealHelper() {
  if (typeof window === 'undefined') return;
  updateHelper({ type: 'collapse', value: false });
  window.dispatchEvent(new Event(HELPER_REVEAL_EVENT));
}
