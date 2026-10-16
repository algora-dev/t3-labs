/** Guided selling copy and events only. All prices come from the existing engines. */
export const APEX_HOME = '/demo/roofing-site';
export const ESTIMATE_HOME = `${APEX_HOME}/estimate`;
export const QUICK_HOME = `${APEX_HOME}/quick-estimate`;
export const DETAIL_HOME = '/supplier-pricing-tool/apex-roofing';
export const PLAN_HOME = `${DETAIL_HOME}?entry=plan`;
export const ADMIN_HOME = `${DETAIL_HOME}/admin?demo=helper`;
export function isAdminPath(path: string | null | undefined): boolean {
  const pathname = path?.split(/[?#]/)[0]?.replace(/\/+$/, '');
  const base = `${DETAIL_HOME}/admin`;
  return pathname === base || !!pathname?.startsWith(`${base}/`);
}
export const HELPER_QUESTION = 'Do you handle insurance work, and where can I read more about it?';
export const HELPER_PRICE_PROMPT = 'I’m replacing a concrete tile roof in Leeds. It has 120 m² of actual sloping roof area, a 25° pitch and a simple gable shape. Use Apex’s concrete tile system and include 12 metres of dry-fix ridge, plus the configured strip and disposal allowances. There are no hips or valleys. Please estimate this specified scope using your catalogue, then show me the next options.';
export const CORE_TASKS = ['answers', 'assistant-price', 'quick-price'] as const;
export const HELPER_TASKS = [...CORE_TASKS, 'admin'] as const;
export type HelperTaskId = typeof HELPER_TASKS[number];
export const HELPER_SIGNALS = ['knowledge-answer', 'knowledge-link', 'assistant-estimate', 'assistant-enquiry-open', 'assistant-enquiry-ready', 'quick-result', 'quick-enquiry-open', 'quick-enquiry-ready', 'admin-open', 'admin-trade-view'] as const;
export type HelperSignal = typeof HELPER_SIGNALS[number];
export type HelperCommand = 'question' | 'price-prompt' | 'assistant-open' | 'assistant-enquiry' | 'quick-enquiry' | 'admin-trade' | 'assistant-close' | 'quick-example' | 'quick-full' | 'quick-instant';
export interface HelperTask {
  id: HelperTaskId; number: string; label: string; title: string; question: string;
  instruction: string; actionLabel: string; outcome: string; benefit: string; reflection: string;
  requirements: readonly HelperSignal[]; optional?: boolean; note?: string;
}
export const TASKS: Record<HelperTaskId, HelperTask> = {
  answers: {
    id: 'answers', number: '1', label: 'An instant answer', title: 'An answer, without a phone call.',
    question: 'Could your website answer this at 9pm?',
    instruction: 'We’ll add an example. Send it, edit it, or ask your own question about Apex.',
    actionLabel: 'Open assistant + add example',
    outcome: 'An answer. A useful next step.',
    benefit: 'The customer got the answer and the right next step, without waiting for your team.',
    reflection: 'How many questions like this does your team answer every week?',
    requirements: ['knowledge-answer'],
  },
  'assistant-price': {
    id: 'assistant-price', number: '2', label: 'A price through conversation', title: 'From a question to a useful price.',
    question: 'Can customers get a useful price before contacting you?',
    instruction: 'We’ll add a sample roof request using Apex’s demo pricing. Send it, edit it, or ask for your own example.',
    actionLabel: 'Open assistant + add example',
    note: 'Your products. Your rules. Use exact prices, starting prices or ranges. Even a range gives customers, search and AI useful pricing context.',
    outcome: 'A useful price, instantly.',
    benefit: 'The customer has a starting price and has already explained what they need, before anyone picks up the phone.',
    reflection: 'If you paid to get them here, what happens when they leave to find the answer elsewhere?',
    requirements: ['assistant-estimate'],
  },
  'quick-price': {
    id: 'quick-price', number: '3', label: 'A price without chatting', title: 'No measurements? No problem.',
    question: 'What about customers who don’t want to chat or know their measurements?',
    instruction: 'Choose the full customer flow, or use an instant pre-filled example to see the result.',
    actionLabel: 'Choose how to try it',
    note: 'Your products. Your rules. Use exact prices, starting prices or ranges. Even a range gives customers, search and AI useful pricing context.',
    outcome: 'A starting price, without a phone call.',
    benefit: 'A few simple choices give the customer a useful range and give your team better context if they enquire.',
    reflection: 'What if this handled just 5 routine price enquiries a week for you?',
    requirements: ['quick-result'],
  },
  admin: {
    id: 'admin', number: '+', label: 'Business dashboard', title: 'Your products. Your rules.', optional: true,
    question: 'What if local contractors used your website to price their own jobs?',
    instruction: 'Open the business dashboard. See products, pricing, customers, activity and quoting controls in one place.',
    actionLabel: 'Explore the business dashboard',
    outcome: 'Customer-facing tools, with business controls behind them.',
    benefit: 'Trade pricing, quoting tools and usage can live in one place. The same system can support repeat contractors and your own team.',
    reflection: 'Could this become a tool contractors return to for the next job?',
    requirements: ['admin-open'],
  },
};
export function isHelperTask(value: unknown): value is HelperTaskId { return HELPER_TASKS.some(t => t === value); }
export function isHelperSignal(value: unknown): value is HelperSignal { return HELPER_SIGNALS.some(t => t === value); }
export function nextCoreTask(id: HelperTaskId): HelperTaskId | null {
  return id === 'answers' ? 'assistant-price' : id === 'assistant-price' ? 'quick-price' : null;
}
/** Same compact explanation in the helper and the tool chooser. */
export const ADVANCED_TOOLS = [
  { title: 'Already have measurements?', name: 'Detailed Estimator', text: 'Build an itemised estimate from known dimensions.', href: DETAIL_HOME },
  { title: 'Have a plan or satellite image?', name: 'Plan & Image Measure', text: 'Set the scale, measure on screen and price the result.', href: PLAN_HOME },
] as const;
export const ADVANCED_PRICING_NOTE = 'Use exact prices, starting prices or ranges. Public pricing gives customers, search and AI something useful to work with; private trade pricing can stay gated.';
