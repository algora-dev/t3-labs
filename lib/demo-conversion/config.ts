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
  body: 'Apex Roofing is fictional. Imagine a customer landing on your website at 9pm. In three short examples, see how they can get answers, see a price and prepare a useful enquiry without waiting for your team.',
  freedom: 'Use our examples, or ask your own questions about Apex.',
  question: 'What can a customer actually get done on your website at 9pm?',
  action: 'Start the demo',
  secondary: 'Explore on my own',
  reassurance: 'No sign-up. Use example details.',
} as const;

export const TOUR_REMINDER_COPY = {
  eyebrow: 'WANT THE HIGHLIGHTS?',
  title: 'Finding your way around?',
  body: 'Hopefully you’ve started to see what these tools could do for a business like yours. Want the highlights? The guided tour takes about 3 minutes.',
  action: 'Take the guided tour',
  secondary: 'Keep exploring',
} as const;

export const CLOSING_COPY = {
  eyebrow: 'IMAGINE THIS ON YOUR WEBSITE',
  title: 'What could this give back to your business?',
  question: 'If this helped you win a few more customers, or simply handled 5 routine enquiries a week for you, what would that be worth over a year?',
  callNote: 'Let’s look at what would help your business. No obligation.',
} as const;

// Four minutes is long enough to explore without being interrupted. Self-guided
// visitors see a tour reminder first, never the sales close just because time passed.
export const EXPLORE_DELAY_MS = 4 * 60 * 1000;
export const EARNED_INTERACTIONS_REQUIRED = 2;
