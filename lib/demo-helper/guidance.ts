import { TASKS, QUICK_HOME, isAdminPath, type HelperCommand } from './config';
import type { HelperState } from './state';
import { activityForRun, isAssistantTask, type AssistantActivity } from './assistant-activity';

export interface TaskGuidance {
  text: string;
  button: string | null;
  command?: HelperCommand;
  waiting?: boolean;
  freeResponse?: boolean;
}
/** Current instruction, based on explicit tool events, not a guessed answer or timer. */
export function taskGuidance(s: HelperState, activity: AssistantActivity | null, surface: string, path: string | null): TaskGuidance {
  const task = TASKS[s.current];
  const open = surface.startsWith('assistant');
  const phase = activityForRun(activity, s)?.phase;
  if (isAssistantTask(s.current)) {
    if (!s.started) return { text: task.instruction, button: task.actionLabel, command: s.current === 'answers' ? 'question' : 'price-prompt' };
    if (s.error || phase === 'error') return { text: 'That request couldn’t finish. Try again in the assistant, or continue when you’re ready.', button: open ? null : 'Open assistant', command: 'assistant-open', freeResponse: true };
    if (phase === 'sending') return { text: 'Getting your answer…', button: open ? null : 'Open assistant', command: 'assistant-open', waiting: true };
    if (phase === 'answered') return { text: s.current === 'answers' ? 'Read the answer. Ask a follow-up, or continue when you’re ready.' : 'Read the price. Refine it or prepare an enquiry if useful; both are optional.', button: open ? null : 'Open assistant', command: 'assistant-open', freeResponse: true };
    if (phase === 'prepared') return { text: 'Your example is ready. Edit it or press Send in the assistant.', button: open ? null : 'Open assistant', command: 'assistant-open' };
    if (phase === 'editing') return { text: 'Your question, your choice. Press Send when you’re ready.', button: open ? null : 'Open assistant', command: 'assistant-open' };
    return { text: 'Ask about Apex’s services, products or prices. Press Send when you’re ready.', button: open ? null : 'Open assistant', command: 'assistant-open' };
  }
  if (s.current === 'quick-price') {
    if (!s.started) return { text: task.instruction, button: null };
    return { text: 'Continue on the current page. Follow the steps to get your result. Either route completes this example.', button: path === QUICK_HOME ? null : 'Return to the Quick Roof Estimate', command: 'quick-full' };
  }
  if (isAdminPath(path)) return { text: 'Explore any section. Products, trade pricing, customers, activity and quoting controls are all part of the same business dashboard.', button: null };
  return { text: task.instruction, button: task.actionLabel, command: 'admin-trade' };
}
