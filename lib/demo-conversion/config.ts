/** T3 Labs sales copy only. Never used by Apex's roof/pricing engines. */
export const CONVERSION_OFFER = {
  startingPrice: '$999',
  priceLabel: 'What if you could have solutions like this for',
  priceNote: '',
  bookingLabel: 'Book a free 20-minute call',
  // Published booking destination linked from t3labs.tech (checked 11 Oct 2026).
  bookingUrl: 'https://calendly.com/insights-t3labs/20-minute-meeting',
  contactUrl: 'https://www.t3labs.tech/#contact',
} as const;
export const INTRO_COPY = {
  eyebrow: 'A WORKING DEMO FOR BUSINESS OWNERS',
  title: 'What if your website did more of the work?',
  body: 'Apex Roofing is fictional. The solutions work. Try three examples: get answers, see prices and prepare an enquiry, without calling the team.',
  freedom: 'Use our examples, or ask your own questions about Apex at any time.',
  question: 'How would customers get these answers on your website?',
  action: 'Start the demo',
  secondary: 'Explore on my own',
  reassurance: 'No sign-up. Use example details.',
} as const;
export const CLOSING_COPY = {
  eyebrow: 'IMAGINE THIS ON YOUR WEBSITE',
  title: 'What could this give back to your business?',
  question: 'If this saved your team a few hours a week, or helped you win five more customers a year, what would that be worth?',
  callNote: 'Let’s look at what would help your business. No obligation.',
} as const;
// These are guardrails, not a timer that forces a sales interruption.
export const EXIT_MIN_VISIT_MS = 8000;
export const EXIT_AFTER_INTRO_MS = 1800;
