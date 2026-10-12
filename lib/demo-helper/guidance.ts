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
  const has = (signal: typeof s.milestones[number]) => s.milestones.includes(signal);
  const open = surface.startsWith('assistant');
  const phase = activityForRun(activity, s)?.phase;
  if (isAssistantTask(s.current)) {
    if (!s.started) return { text: task.instruction, button: task.actionLabel, command: s.current === 'answers' ? 'question' : 'price-prompt' };
    if (s.error || phase === 'error') return { text: 'That request couldn’t finish. Try again in the assistant, or skip this task.', button: open ? null : 'Open assistant', command: 'assistant-open' };
    if (phase === 'sending') return { text: 'Getting your answer…', button: open ? null : 'Open assistant', command: 'assistant-open', waiting: true };
    if (s.current === 'assistant-price' && has('assistant-enquiry-open')) return { text: 'Preview the enquiry with example details. The roof and price are attached; no enquiry is sent.', button: surface.startsWith('assistant-enquiry') ? null : 'Return to enquiry', command: 'assistant-enquiry' };
    if (s.current === 'assistant-price' && has('assistant-estimate')) return { text: 'Review the price, then open its quote enquiry.', button: open ? null : 'Open assistant', command: 'assistant-open' };
    if (s.current === 'answers' && has('knowledge-answer')) return { text: 'Open the page the assistant recommends.', button: open ? null : 'Open assistant', command: 'assistant-open' };
    if (phase === 'answered') return { text: s.current === 'answers' ? 'Read the answer. Ask a follow-up, or continue when you’re ready.' : 'Answer any follow-up questions. You can also ask it to help prepare an enquiry.', button: open ? null : 'Open assistant', command: 'assistant-open', freeResponse: true };
    if (phase === 'prepared') return { text: 'Your example is ready. Edit it or press Send in the assistant.', button: open ? null : 'Open assistant', command: 'assistant-open' };
    if (phase === 'editing') return { text: 'Your question, your choice. Press Send when you’re ready.', button: open ? null : 'Open assistant', command: 'assistant-open' };
    return { text: 'Ask about Apex’s services, products or prices. Press Send when you’re ready.', button: open ? null : 'Open assistant', command: 'assistant-open' };
  }
  if (s.current === 'quick-price') {
    if (!s.started) return { text: task.instruction, button: task.actionLabel, command: 'quick-example' };
    if (has('quick-enquiry-open')) return { text: 'Preview with example details, or add your own notes and files.', button: surface.includes('quick-enquiry') ? null : 'Return to enquiry', command: 'quick-enquiry' };
    if (has('quick-result')) return { text: 'See your range, then select “Request a quote”. Your roof details carry through.', button: path === QUICK_HOME ? null : 'Return to my estimate', command: 'quick-enquiry' };
    return { text: 'Choose the roof details on the page, then see your estimate.', button: path === QUICK_HOME ? null : task.actionLabel, command: 'quick-example' };
  }
  if (isAdminPath(path)) return { text: 'Look at Trade pricing: your team can manage products, prices and customer tiers. Return to Apex when you’re ready.', button: null };
  return { text: task.instruction, button: task.actionLabel, command: 'admin-trade' };
}
