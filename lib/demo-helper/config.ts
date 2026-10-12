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
export const HELPER_PRICE_PROMPT = 'I’m replacing a concrete tile roof in Leeds. It has 120 m² of actual sloping roof area, a 25° pitch and a simple gable shape. Use Apex’s concrete tile system and include 12 metres of dry-fix ridge, plus the configured strip and disposal allowances. There are no hips or valleys. Please estimate this specified scope using your catalogue, then help me request a proper quote.';
export const CORE_TASKS = ['answers', 'assistant-price', 'quick-price'] as const;
export const HELPER_TASKS = [...CORE_TASKS, 'admin'] as const;
export type HelperTaskId = typeof HELPER_TASKS[number];
export const HELPER_SIGNALS = ['knowledge-answer', 'knowledge-link', 'assistant-estimate', 'assistant-enquiry-open', 'assistant-enquiry-ready', 'quick-result', 'quick-enquiry-open', 'quick-enquiry-ready', 'admin-trade-view'] as const;
export type HelperSignal = typeof HELPER_SIGNALS[number];
export type HelperCommand = 'question' | 'price-prompt' | 'assistant-open' | 'assistant-enquiry' | 'quick-enquiry' | 'admin-trade' | 'assistant-close' | 'quick-example';
export interface HelperTask {
  id: HelperTaskId; number: string; label: string; title: string; question: string;
  instruction: string; actionLabel: string; outcome: string; benefit: string; reflection: string;
  requirements: readonly HelperSignal[]; optional?: boolean;
}
export const TASKS: Record<HelperTaskId, HelperTask> = {
  answers: {
    id: 'answers', number: '1', label: 'An instant answer', title: 'An answer, without a phone call.',
    question: 'Would a visitor need to call you for this?',
    instruction: 'We’ll open the assistant and add an example. Send it, edit it, or ask your own question about Apex.',
    actionLabel: 'Open assistant + add example',
    outcome: 'An answer. A useful next step.',
    benefit: 'An answer and the right page, without interrupting your team.',
    reflection: 'Which questions does your team answer again and again?',
    requirements: ['knowledge-answer', 'knowledge-link'],
  },
  'assistant-price': {
    id: 'assistant-price', number: '2', label: 'A price through conversation', title: 'From a question to an enquiry.',
    question: 'Can customers get a price before contacting you?',
    instruction: 'We’ll add a sample roof request. Send or edit it, then follow the price through to an enquiry.',
    actionLabel: 'Open assistant + add example',
    outcome: 'More than a price. An enquiry.',
    benefit: 'Your prices. Their roof details. A more useful enquiry for your team.',
    reflection: 'If someone can’t find a price on your website, where might they go instead?',
    requirements: ['assistant-estimate', 'assistant-enquiry-open', 'assistant-enquiry-ready'],
  },
  'quick-price': {
    id: 'quick-price', number: '3', label: 'A price without chatting', title: 'No measurements? No problem.',
    question: 'What about customers who don’t want to chat—or have no measurements?',
    instruction: "We’ll open a pre-filled example so you can skip ahead. Change the covering, calculate the range, or try the full tool.",
    actionLabel: 'Open the Quick Roof Estimate',
    outcome: 'A starting price, without a phone call.',
    benefit: 'A starting price in a few choices, with the details ready for a quote.',
    reflection: 'What would fewer basic price enquiries free your team to do?',
    requirements: ['quick-result', 'quick-enquiry-open', 'quick-enquiry-ready'],
  },
  admin: {
    id: 'admin', number: '+', label: 'Business dashboard', title: 'Your products. Your rules.', optional: true,
    question: 'How would your team manage products, prices and repeat trade customers?',
    instruction: 'Open the business dashboard and look at Trade pricing. See how products, customers and pricing tiers can be managed in one place.',
    actionLabel: 'Open the business dashboard',
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
  { title: 'Already have measurements?', name: 'Detailed Estimator', text: 'Build an itemised estimate from known dimensions.', href: DETAIL_HOME },
  { title: 'Have a plan or satellite image?', name: 'Plan & Image Measure', text: 'Set the scale, measure on screen and price the result.', href: PLAN_HOME },
] as const;
export const ADVANCED_PRICING_NOTE = 'Contractors and your team can prepare customer quotes using your products and public or trade pricing.';
