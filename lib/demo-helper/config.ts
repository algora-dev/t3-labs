/** Guided selling copy and events only. All prices come from the existing engines. */
export const APEX_HOME = '/demo/roofing-site';
export const ESTIMATE_HOME = `${APEX_HOME}/estimate`;
export const QUICK_HOME = `${APEX_HOME}/quick-estimate`;
export const DETAIL_HOME = '/supplier-pricing-tool/apex-roofing';
export const PLAN_HOME = `${DETAIL_HOME}?entry=plan`;
export const ADMIN_HOME = `${DETAIL_HOME}/admin?demo=helper`;
export const HELPER_QUESTION = 'Do you handle insurance work, and where can I read more about it?';
export const HELPER_PRICE_PROMPT = 'I’m replacing a concrete tile roof in Leeds. It has 120 m² of actual sloping roof area, a 25° pitch and a simple gable shape. Use Apex’s concrete tile system and include 12 metres of dry-fix ridge, plus the configured strip and disposal allowances. There are no hips or valleys. Please estimate this specified scope using your catalogue, then help me request a proper quote.';
export const CORE_TASKS = ['answers', 'assistant-price', 'quick-price'] as const;
export const HELPER_TASKS = [...CORE_TASKS, 'admin'] as const;
export type HelperTaskId = typeof HELPER_TASKS[number];
export const HELPER_SIGNALS = ['knowledge-answer', 'knowledge-link', 'assistant-estimate', 'assistant-enquiry-open', 'assistant-enquiry-ready', 'quick-result', 'quick-enquiry-open', 'quick-enquiry-ready', 'admin-trade-view'] as const;
export type HelperSignal = typeof HELPER_SIGNALS[number];
export type HelperCommand = 'question' | 'price-prompt' | 'assistant-open' | 'assistant-enquiry' | 'quick-enquiry' | 'admin-trade' | 'assistant-close';
export interface HelperTask {
  id: HelperTaskId; number: string; label: string; title: string; question: string;
  instruction: string; actionLabel: string; outcome: string; benefit: string; reflection: string;
  requirements: readonly HelperSignal[]; optional?: boolean;
}
export const TASKS: Record<HelperTaskId, HelperTask> = {
  answers: {
    id: 'answers', number: '1', label: 'An instant answer', title: 'Ask instead of searching.',
    question: 'How would a new visitor find this answer on your website today?',
    instruction: 'Ask the assistant about insurance work, then try the page link it offers.',
    actionLabel: 'Try this question',
    outcome: 'An answer, and somewhere useful to go.',
    benefit: 'The customer found information and a relevant page without calling your team or hunting through menus.',
    reflection: 'Which questions does your team answer again and again?',
    requirements: ['knowledge-answer', 'knowledge-link'],
  },
  'assistant-price': {
    id: 'assistant-price', number: '2', label: 'A price through conversation', title: 'From a question to an enquiry.',
    question: 'When a visitor asks “how much?”, can your website help, or do they have to call?',
    instruction: 'Try a ready-written roof request. Review the estimate, then follow it through to an enquiry preview.',
    actionLabel: 'Try this roof request',
    outcome: 'The conversation became a qualified enquiry.',
    benefit: 'The roof details and estimate travel with the enquiry. Your team starts with context instead of another “how much?” email.',
    reflection: 'If visitors cannot get a starting price, where might they look next?',
    requirements: ['assistant-estimate', 'assistant-enquiry-open', 'assistant-enquiry-ready'],
  },
  'quick-price': {
    id: 'quick-price', number: '3', label: 'A price without chatting', title: 'No measurements? No problem.',
    question: 'What about homeowners who do not know their measurements, or do not want to chat?',
    instruction: 'Open the free tools and choose “I don’t have measurements”. Pick a roof, get a range, then preview a quote enquiry.',
    actionLabel: 'Open the free roof tools',
    outcome: 'A starting price, without a phone call.',
    benefit: 'A homeowner got a useful ballpark and an easy next step. A visitor you paid to attract has a reason to stay and enquire.',
    reflection: 'Could your website do more of this preparation for your team?',
    requirements: ['quick-result', 'quick-enquiry-open', 'quick-enquiry-ready'],
  },
  admin: {
    id: 'admin', number: '+', label: 'Business controls', title: 'Your products. Your rules.', optional: true,
    question: 'Would regular contractors return to your website to quote with their own trade prices?',
    instruction: 'Open the demo admin, then look at Trade pricing. See how a customer is assigned a pricing tier.',
    actionLabel: 'Open the demo admin',
    outcome: 'A tool for your customers, with controls for you.',
    benefit: 'Products, trade customers and pricing tiers can be managed by the business. A useful quoting tool gives contractors a reason to return for the next job.',
    reflection: 'Who on your team would benefit from these controls?',
    requirements: ['admin-trade-view'],
  },
};
export function isHelperTask(value: unknown): value is HelperTaskId { return HELPER_TASKS.some(t => t === value); }
export function isHelperSignal(value: unknown): value is HelperSignal { return HELPER_SIGNALS.some(t => t === value); }
export function nextCoreTask(id: HelperTaskId): HelperTaskId | null {
  return id === 'answers' ? 'assistant-price' : id === 'assistant-price' ? 'quick-price' : null;
}
/** Same compact explanation in the helper and the tool chooser. */
export const ADVANCED_TOOLS = [
  { title: 'Already have measurements?', name: 'Detailed Estimator', text: 'Choose products and turn your dimensions into an itemised estimate. Useful for your team or a contractor pricing a job.', href: DETAIL_HOME },
  { title: 'Have a plan or satellite image?', name: 'Plan & Image Measure', text: 'Set a known scale, trace the roof and carry the measurements straight into the same estimator. No retyping.', href: PLAN_HOME },
] as const;
export const ADVANCED_PRICING_NOTE = 'Simple to operate, with detail for roofing professionals. Use the quote output to prepare a customer quote. A business can configure public ballpark rates, detailed product prices and private trade rates to suit its workflow. Measurements and scope still need checking.';
