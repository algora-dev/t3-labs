/** Shared, crawlable routes for the roofing solutions hub and navigation. */
export const ROOFING_SOLUTIONS = [
  {
    slug: "roofing-website-design",
    title: "Roofing Website Design",
    description: "A clearer website that builds trust, answers questions and turns visits into roofing enquiries.",
    outcome: "Get more from your website",
  },
  {
    slug: "roofing-seo",
    title: "Roofing SEO & Better Leads",
    description: "Get found by the right local customers and make it easier for them to choose your business.",
    outcome: "Be easier to find",
  },
  {
    slug: "roofing-website-estimators",
    title: "Website Estimators",
    description: "Give homeowners useful price guidance and capture better project details before the first call.",
    outcome: "Turn interest into enquiries",
  },
  {
    slug: "roofing-quoting-software",
    title: "Roofing Quoting Tools",
    description: "Measure, price and prepare roofing quotes with fewer manual steps and more consistency.",
    outcome: "Quote with less admin",
  },
  {
    slug: "roofing-ai-website-assistants",
    title: "AI Website Assistants",
    description: "Answer routine visitor questions and direct qualified enquiries to your team, even after hours.",
    outcome: "Help visitors sooner",
  },
  {
    slug: "roofing-business-automation",
    title: "Business Automation",
    description: "Connect the steps you repeat every day and cut down on duplicated data and follow-ups.",
    outcome: "Give your team time back",
  },
  {
    slug: "custom-roofing-software",
    title: "Custom Roofing Software",
    description: "Replace a tangle of half-used apps with a focused tool, connected workflow or complete platform built for your business.",
    outcome: "Build exactly what you need",
  },
] as const;


/** Visitor-centred pathways. The seven canonical service URLs remain unchanged. */
export const ROOFING_OUTCOMES = [
  {
    id: "better-leads",
    step: "01",
    label: "GET FOUND",
    title: "Get found by better-fit customers.",
    description: "Be visible for the roofing jobs and areas you actually serve, then make the next step obvious.",
    check: "Can a customer tell what roofing work you do, where you work and why they should trust you?",
    slugs: ["roofing-website-design", "roofing-seo"],
  },
  {
    id: "better-enquiries",
    step: "02",
    label: "CONVERT VISITORS",
    title: "Turn more visits into useful enquiries.",
    description: "Answer common questions, give sensible price guidance and gather the details you need to respond well.",
    check: "Can a visitor get useful answers and tell you about their job without starting from scratch?",
    slugs: ["roofing-website-estimators", "roofing-ai-website-assistants"],
  },
  {
    id: "faster-quotes",
    step: "03",
    label: "QUOTE & FOLLOW UP",
    title: "Measure, price and quote with less friction.",
    description: "Carry information through from measurement to pricing and professional quotations without retyping it.",
    check: "Where does your team repeat work between enquiry, measurement, price and quote?",
    slugs: ["roofing-quoting-software"],
  },
  {
    id: "less-admin",
    step: "04",
    label: "SAVE ADMIN TIME",
    title: "Keep the work moving after the enquiry.",
    description: "Connect repetitive steps, reduce missed follow-ups and build only the tools your team actually needs.",
    check: "Which follow-ups, updates or transfers still depend on someone remembering them?",
    slugs: ["roofing-business-automation", "custom-roofing-software"],
  },
] as const;
