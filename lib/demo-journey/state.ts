import { getTask, isTaskId, nextTask, TASK_IDS } from './config';
import type { DemoSignal, TaskId } from './config';
export type TaskStatus = 'untried' | 'completed' | 'skipped';
export interface JourneyState {
  version: 1;
  active: boolean;
  collapsed: boolean;
  current: TaskId;
  attempted: TaskId | null;
  error: boolean;
  status: Record<TaskId, TaskStatus>;
}
export function initialJourney(): JourneyState {
  return { version: 1, active: false, collapsed: false, current: 'assistant', attempted: null, error: false,
    status: { assistant: 'untried', quick: 'untried', detailed: 'untried', plan: 'untried', trade: 'untried' } };
}
/** A tour is browser-local, never an entitlement or a source of pricing data. */
export function readJourney(raw: string | null): JourneyState {
  if (!raw || raw.length > 4000) return initialJourney();
  try {
    const v = JSON.parse(raw);
    if (!v || v.version !== 1 || typeof v.active !== 'boolean' || typeof v.collapsed !== 'boolean' || !isTaskId(v.current)
      || (v.attempted !== null && !isTaskId(v.attempted)) || typeof v.error !== 'boolean'
      || !v.status || Array.isArray(v.status) || !TASK_IDS.every(id => ['untried', 'completed', 'skipped'].includes(v.status[id]))) return initialJourney();
    // Rebuild the shape. Extra properties from old or edited drafts never leak into state.
    return { version: 1, active: v.active, collapsed: v.collapsed, current: v.current, attempted: v.attempted,
      error: v.error, status: Object.fromEntries(TASK_IDS.map(id => [id, v.status[id]])) as JourneyState['status'] };
  } catch { return initialJourney(); }
}
export type JourneyAction =
  | { type: 'start'; task?: TaskId } | { type: 'select'; task: TaskId }
  | { type: 'attempt' } | { type: 'cancel' } | { type: 'signal'; signal: DemoSignal }
  | { type: 'failure'; task: TaskId } | { type: 'collapse'; value: boolean }
  | { type: 'pause' } | { type: 'resume' } | { type: 'restart' }
  | { type: 'skip' } | { type: 'next' };
export function reduceJourney(state: JourneyState, action: JourneyAction): JourneyState {
  switch (action.type) {
    case 'start': case 'select': return { ...state, active: true, collapsed: false, current: action.task ?? 'assistant', attempted: null, error: false };
    case 'cancel': return { ...state, attempted: null, error: false };
    case 'attempt': return state.active ? { ...state, attempted: state.current, error: false } : state;
    case 'signal': {
      if (!state.active || state.attempted !== state.current || getTask(state.current).signal !== action.signal || state.status[state.current] === 'completed') return state;
      return { ...state, error: false, status: { ...state.status, [state.current]: 'completed' } };
    }
    case 'failure': return state.active && state.current === action.task && state.attempted === action.task
      ? { ...state, error: true } : state;
    case 'collapse': return { ...state, collapsed: action.value };
    case 'pause': return { ...state, active: false, error: false };
    case 'resume': return { ...state, active: true, collapsed: false };
    case 'restart': return { ...initialJourney(), active: true };
    case 'skip': case 'next': {
      const current = nextTask(state.current);
      const status = action.type === 'skip' && state.status[state.current] !== 'completed'
        ? { ...state.status, [state.current]: 'skipped' as const } : state.status;
      return { ...state, status, current: current ?? state.current, active: current !== null,
        collapsed: false, attempted: null, error: false };
    }
  }
}
