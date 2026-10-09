import { HELPER_TASKS, TASKS, isHelperTask, isHelperSignal, nextCoreTask } from './config';
import type { HelperSignal, HelperTaskId } from './config';
export type HelperStatus = 'untried' | 'observed' | 'self-reported' | 'skipped';
export type HelperView = 'welcome' | 'task' | 'benefit' | 'finish';
export interface HelperState {
  version: 2; view: HelperView; collapsed: boolean; current: HelperTaskId;
  started: boolean; runId: number; error: boolean;
  milestones: HelperSignal[]; status: Record<HelperTaskId, HelperStatus>;
}
export function initialHelper(): HelperState {
  return { version: 2, view: 'welcome', collapsed: false, current: 'answers', started: false, runId: 0, error: false, milestones: [], status: { answers: 'untried', 'assistant-price': 'untried', 'quick-price': 'untried', admin: 'untried' } };
}
/** Progress is UI-only and tab-local. No customer, price, prompt or file data belongs here. */
export function readHelper(raw: string | null): HelperState {
  if (!raw || raw.length > 3500) return initialHelper();
  try {
    const v = JSON.parse(raw);
    if (!v || v.version !== 2 || !['welcome', 'task', 'benefit', 'finish'].includes(v.view) || !isHelperTask(v.current)
      || typeof v.collapsed !== 'boolean' || typeof v.started !== 'boolean' || typeof v.error !== 'boolean'
      || !Number.isSafeInteger(v.runId) || v.runId < 0 || !Array.isArray(v.milestones) || v.milestones.length > 9
      || !v.milestones.every(isHelperSignal) || !v.status || !HELPER_TASKS.every(t => ['untried', 'observed', 'self-reported', 'skipped'].includes(v.status[t]))) return initialHelper();
    const requirements = TASKS[v.current as HelperTaskId].requirements;
    // Rebuild, whitelist and deduplicate. Do not resurrect unrelated milestones.
    return { version: 2, view: v.view, collapsed: v.collapsed, current: v.current, started: v.started, runId: v.runId,
      error: v.error, milestones: [...new Set(v.milestones as HelperSignal[])].filter(m => requirements.includes(m)),
      status: Object.fromEntries(HELPER_TASKS.map(t => [t, v.status[t]])) as HelperState['status'] };
  } catch { return initialHelper(); }
}
export type HelperAction =
  | { type: 'start' } | { type: 'select'; task: HelperTaskId } | { type: 'prepare' }
  | { type: 'collapse'; value: boolean } | { type: 'signal'; signal: HelperSignal; runId?: number; task?: HelperTaskId }
  | { type: 'error'; runId?: number } | { type: 'next' } | { type: 'skip' } | { type: 'manual' }
  | { type: 'finish' } | { type: 'restart' };
export function reduceHelper(s: HelperState, a: HelperAction): HelperState {
  const select = (task: HelperTaskId): HelperState => ({ ...s, view: 'task', collapsed: false, current: task, started: false, milestones: [], error: false, runId: s.runId + 1 });
  const next = (state: HelperState): HelperState => {
    const task = nextCoreTask(s.current);
    return task ? { ...select(task), status: state.status } : { ...state, view: 'finish', started: false, collapsed: false, error: false, runId: s.runId + 1 };
  };
  switch (a.type) {
    case 'start': return select('answers');
    case 'select': return select(a.task);
    case 'prepare': return { ...s, view: 'task', started: true, error: false };
    case 'collapse': return s.collapsed === a.value ? s : { ...s, collapsed: a.value };
    case 'signal': {
      if (!s.started || s.view !== 'task' || (a.runId != null && a.runId !== s.runId) || (a.task && a.task !== s.current)) return s;
      const expected = TASKS[s.current].requirements;
      const index = expected.indexOf(a.signal);
      if (index < 0 || s.milestones.includes(a.signal) || !expected.slice(0, index).every(e => s.milestones.includes(e))) return s;
      const milestones = [...s.milestones, a.signal];
      const done = expected.every(e => milestones.includes(e));
      return { ...s, milestones, error: false, ...(done ? { view: 'benefit', started: false, status: { ...s.status, [s.current]: 'observed' } } as const : {}) };
    }
    case 'error': return s.started && s.view === 'task' && (a.runId == null || a.runId === s.runId) ? { ...s, error: true } : s;
    case 'manual': return s.view === 'task' ? { ...s, view: 'benefit', started: false, error: false, status: { ...s.status, [s.current]: 'self-reported' } } : s;
    case 'skip': return next({ ...s, status: { ...s.status, [s.current]: s.status[s.current] === 'observed' ? 'observed' : 'skipped' } });
    case 'next': return s.view === 'benefit' ? next(s) : s;
    case 'finish': return { ...s, view: 'finish', collapsed: false, started: false, error: false, runId: s.runId + 1 };
    case 'restart': return { ...initialHelper(), view: 'task', runId: s.runId + 1 };
  }
}
export interface HelperPosition { x: number; y: number }
export function clampPosition(p: HelperPosition, viewport: { width: number; height: number }, panel: { width: number; height: number }): HelperPosition {
  return { x: Math.max(12, Math.min(Number.isFinite(p.x) ? p.x : 20, Math.max(12, viewport.width - panel.width - 12))), y: Math.max(12, Math.min(Number.isFinite(p.y) ? p.y : 80, Math.max(12, viewport.height - panel.height - 12))) };
}
export function readPosition(raw: string | null): HelperPosition | null {
  if (!raw || raw.length > 150) return null;
  try { const p = JSON.parse(raw); return p && Number.isFinite(p.x) && Number.isFinite(p.y) ? { x: p.x, y: p.y } : null; } catch { return null; }
}
