/** Presentation and task copy only. Pricing and roof rules live in their existing engines. */
export const DEMO_HOME = '/demo/roofing-site/walkthrough';
export const DEMO_SUMMARY = `${DEMO_HOME}/summary`;
export const APEX_HOME = '/demo/roofing-site';
export const SUPPLIER_HOME = '/supplier-pricing-tool/apex-roofing';
export const ASSISTANT_QUESTION = 'Do you handle insurance work?';
export type TaskId = 'assistant' | 'quick' | 'detailed' | 'plan' | 'trade';
export type DemoAction = 'assistant-prompt' | 'quick-example' | 'detailed-example' | 'plan-example' | 'trade-example' | 'assistant-close';
export type DemoSignal = 'assistant-answer' | 'quick-result' | 'detailed-output' | 'plan-transfer' | 'trade-preview';
export interface DemoTask {
  id: TaskId;
  number: string;
  name: string;
  audience: string;
  title: string;
  description: string;
  before: string;
  instruction: string;
  action: DemoAction;
  actionLabel: string;
  route: string;
  signal: DemoSignal;
  outcome: string;
  benefit: string;
  extra: string;
  optional?: boolean;
}
export const DEMO_TASKS: readonly DemoTask[] = [
  {
    id: 'assistant', number: '01', name: 'Smart Assistant', audience: 'The customer with a question',
    title: 'An answer, without a phone call.',
    description: 'Ask a real question about the business, without searching page after page.',
    before: 'A new customer wants to know whether you handle insurance work. How would they find that answer on your website today?',
    instruction: 'Put the example question in the assistant, then press Send. You can follow up with: “Where can I read more about that?”',
    action: 'assistant-prompt', actionLabel: 'Put question in the assistant', route: APEX_HOME,
    signal: 'assistant-answer',
    outcome: 'You received an answer from the live assistant.',
    benefit: 'A routine question can be answered without pulling someone away from their work. The customer can keep exploring instead of waiting for a reply.',
    extra: 'Try asking a follow-up in your own words. This is a conversation, not a fixed menu.',
  },
  {
    id: 'quick', number: '02', name: 'Quick Roof Estimate', audience: 'The homeowner without measurements',
    title: 'A starting price, without the homework.',
    description: 'Choose a familiar roof shape and a few simple details to get a ballpark range.',
    before: 'Someone wants a rough re-roof price, but has no measurements. Do they get a useful starting point, or have to contact your team?',
    instruction: 'Load the example: small gable roof, typical pitch, one storey, replacing tiles. Step through the choices and view the range.',
    action: 'quick-example', actionLabel: 'Load example roof', route: `${APEX_HOME}/quick-estimate`,
    signal: 'quick-result',
    outcome: 'You reached a ballpark estimate without entering roof measurements.',
    benefit: 'A useful first answer gives the visitor a reason to stay. Your team can spend more time on enquiries that already have a scope and a starting budget.',
    extra: 'Try a more complex roof or a different covering. The range changes with the roof and the configured products, not a made-up chat response.',
  },
  {
    id: 'detailed', number: '03', name: 'Detailed Estimator', audience: 'The customer with measurements',
    title: 'Turn measurements into a useful estimate.',
    description: 'Use example measurements and see the materials, waste and installation costs.',
    before: 'A contractor has measurements. How much work does your team do before they can compare products and get a price?',
    instruction: 'Load the 120 m² example. Open “Roof Areas” to inspect the selected products. Choose Next, skip optional custom items, then view the itemised output.',
    action: 'detailed-example', actionLabel: 'Load example measurements', route: SUPPLIER_HOME,
    signal: 'detailed-output',
    outcome: 'Your measurements became an itemised estimate using the Apex catalogue.',
    benefit: 'Customers can do more of the pricing themselves. Product quantities and costs are together, rather than scattered across individual shop pages.',
    extra: 'Go back and try natural slate instead of concrete tiles. Review which products and quantities make up the price.',
  },
  {
    id: 'plan', number: '04', name: 'Plan to Price', audience: 'The customer with a drawing',
    title: 'Measure once. Keep the measurements.',
    description: 'Trace a simple training plan and carry the result straight into the estimator.',
    before: 'When a customer sends a drawing, who measures it and enters the quantities? How many times is the same information copied?',
    instruction: 'Open the sample plan and select its four corners in order. The scale and pitch are set for this exercise. Send the measurements to the estimator.',
    action: 'plan-example', actionLabel: 'Open the sample plan', route: SUPPLIER_HOME,
    signal: 'plan-transfer',
    outcome: 'The sample measurements have moved into the estimator without retyping.',
    benefit: 'Your website can help customers prepare their own takeoffs. A drawing can become the start of a product estimate, not another unstructured attachment for your team.',
    extra: 'The training plan is intentionally simple. Uploading your own plan opens the existing full measuring workspace, with calibration and component tools.',
  },
  {
    id: 'trade', number: '+', name: 'Trade & Repeat Business', audience: 'Optional: suppliers and trade customers',
    title: 'A reason to come back for the next job.',
    description: 'See a sample trade account use the same quantities with its configured product prices.',
    before: 'Could a regular roofer use your website to price their next job with the products and trade rates they buy from you?',
    instruction: 'Use the example trade account. Compare the public and trade material subtotals on the same job. No email address or password is needed.',
    action: 'trade-example', actionLabel: 'Use demo trade account', route: SUPPLIER_HOME,
    signal: 'trade-preview', optional: true,
    outcome: 'You compared public and example trade prices for the same quantities.',
    benefit: 'A useful quoting workflow can give contractors a reason to return to your site, and to build their next job around the products you supply.',
    extra: 'Trade terms are configurable per business and account. The login and rates shown here are demonstrations, not a real account or offer.',
  },
];
export const TASK_IDS = DEMO_TASKS.map(task => task.id);
export function isTaskId(value: unknown): value is TaskId { return TASK_IDS.some(id => id === value); }
export function getTask(id: TaskId): DemoTask { return DEMO_TASKS.find(task => task.id === id)!; }
export function nextTask(id: TaskId): TaskId | null { return DEMO_TASKS[TASK_IDS.indexOf(id) + 1]?.id ?? null; }
