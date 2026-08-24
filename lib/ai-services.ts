/**
 * T3 Labs AI services cluster — page content registry (brief §6, 22 Aug 2026).
 * One entry per commercial page; rendered by the shared ServicePage component.
 * Keep each page's intent distinct (brief §7 cannibalisation rules).
 */

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServiceSection {
  id: string;
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface ServicePageData {
  slug: string;
  eyebrow: string;
  title: string; // page title tag suffix handled by metadata
  h1: string;
  intro: string[];
  metaDescription: string;
  intent: string; // internal comment, shown nowhere
  sections: ServiceSection[];
  ctaHeadline: string;
  ctaBody: string;
  ctaButtonText: string;
  problemCategory: string;
  related: { href: string; label: string }[];
  relatedHeading: string;
  faqs: ServiceFaq[];
}

export const AI_SERVICES: ServicePageData[] = [
  {
    slug: "ai-consultancy",
    eyebrow: "AI Consultancy · Assessment · Strategy",
    title: "AI Consultancy for UK Businesses",
    h1: "Practical AI Consultancy for Businesses",
    intro: [
      "Know your business should be making better use of AI but not sure where it actually fits?",
      "We look at how your business works, identify worthwhile opportunities and help you decide what should be automated, what should stay human, and what is actually worth implementing.",
    ],
    metaDescription:
      "Practical AI consultancy for UK small and mid-sized businesses. We identify where AI genuinely fits, what should stay human, and what's worth implementing. No technical brief needed.",
    intent: "What should we do with AI?",
    sections: [
      {
        id: "what-is-ai-consultancy",
        heading: "What is AI consultancy?",
        body: "AI consultancy is a service that helps a business work out where artificial intelligence can genuinely improve how it operates — and, just as importantly, where it can't. A good AI consultant looks at your actual workflows, costs and bottlenecks first, and only then considers whether AI, ordinary automation, existing software or something custom is the right answer. The output is a clear, prioritised view of what to do next, not a technology shopping list.",
      },
      {
        id: "who-its-for",
        heading: "Who it's for",
        body: "Owners, operators and small-to-mid-sized businesses that don't have internal AI expertise. You don't need a technical brief, a budget figure, or any prior knowledge of what AI can do. That's our job.",
      },
      {
        id: "what-we-look-for",
        heading: "What we look for",
        body: "When we assess a business, the worthwhile opportunities usually share a pattern: the same work, repeated many times, with predictable rules. Typical examples include:",
        bullets: [
          "Repetitive admin and repeated data entry",
          "Expensive manual processes that scale with volume",
          "Slow customer response times",
          "Document processing and information extraction",
          "Quoting, estimating and pricing work",
          "Internal knowledge locked in people's heads or inboxes",
          "Reporting that someone assembles by hand every week",
          "Lead handling and enquiry routing",
          "Workflow bottlenecks where work waits for one person",
          "Tasks where staff repeatedly make the same judgment call",
        ],
      },
      {
        id: "human-and-ai-design",
        heading: "Human + AI design",
        body: "We design systems around people as well as technology. AI does the repetitive, time-consuming heavy lifting; a human reviews, approves or intervenes only where judgment genuinely matters. AI reads a hundred documents and a person checks the five uncertain ones. That's the difference between a system that saves time and a system that creates new problems.",
      },
      {
        id: "service-models",
        heading: "Two ways to work with us",
        body: "Done for you: T3 Labs assesses, implements and supports the system. Enable your team: T3 Labs assesses, configures, trains and hands over. Either way, you get a straight answer on what's worth doing — including when the right answer is an existing tool you can buy outright. If an existing tool already solves the problem well, we'll tell you.",
      },
      {
        id: "after-consultancy",
        heading: "What happens after consultancy",
        body: "Consultancy should end with something being built, automated, integrated or taught — not a report that sits in a drawer. We can take the assessment straight into implementation, automation, custom development, integration, training, or a recommendation of existing software. You don't need to pick which one; the assessment tells us.",
      },
    ],
    ctaHeadline: "Not sure what you need yet?",
    ctaBody: "Tell us where you're stuck — type it or leave a voice note. No technical brief needed. A human at T3 Labs will review it and come back with a plain-English view of what makes sense.",
    ctaButtonText: "Tell us where you're stuck",
    problemCategory: "ai-consultancy",
    related: [
      { href: "/ai-implementation", label: "AI Implementation" },
      { href: "/ai-automation", label: "AI Automation" },
      { href: "/ai-training", label: "AI Training" },
    ],
    relatedHeading: "Once you know what fits",
    faqs: [
      {
        q: "What does an AI consultant actually do?",
        a: "An AI consultant looks at how your business actually works, identifies where AI — or often ordinary automation — would genuinely save time or money, and tells you what's worth implementing and what isn't. The output is a prioritised plan, not a technology shopping list.",
      },
      {
        q: "How do I know where AI would help my business?",
        a: "You don't need to — that's the assessment's job, not yours. The pattern we look for is the same work repeated many times with predictable rules: admin, documents, enquiries, data entry, reporting, quoting. If that exists in your business, there's usually something worth assessing.",
      },
      {
        q: "Do I need to know what AI tools I want before contacting you?",
        a: "No. You don't need a technical brief, tool shortlist or budget figure. Describe the problem in plain English — or leave a voice note — and we'll work out which technology, if any, fits.",
      },
      {
        q: "Can you also implement what you recommend?",
        a: "Yes. Consultancy at T3 Labs leads naturally into implementation, automation, integration, custom development or training — whichever the assessment points to. You don't need to pick; the assessment tells us.",
      },
    ],
  },
  {
    slug: "ai-implementation",
    eyebrow: "AI Implementation · Integration · Deployment",
    title: "AI Implementation Services UK",
    h1: "AI Implementation That Actually Works in Your Business",
    intro: [
      "You already know what you want AI to do. We make it work in the real business.",
      "Connecting AI to existing systems is where most AI projects stall. We handle the whole path from idea to working system — and we handle the boring parts nobody warns you about.",
    ],
    metaDescription:
      "AI implementation services for UK businesses. We turn AI recommendations into working systems — integrations, APIs, data, workflow design, testing, deployment and handover. Tell us what you're trying to build.",
    intent: "We know roughly what we need. Who can make it work?",
    sections: [
      {
        id: "what-implementation-involves",
        heading: "What implementation actually involves",
        body: "A working AI feature is rarely just a prompt. It's a system: data flowing in, AI processing it, results landing somewhere useful, and a person able to check it. We cover the full build, including:",
        bullets: [
          "Connecting AI to your existing systems and tools",
          "APIs and integrations",
          "Data preparation and data flow",
          "Workflow design around the AI step",
          "Interfaces your team actually uses",
          "Permissions and access control",
          "Human approval and exception handling",
          "Testing against real cases, not demos",
          "Deployment and monitoring",
          "Handover and support",
        ],
      },
      {
        id: "does-ai-reduce-cost",
        heading: "Wondering whether AI should reduce the cost of your build?",
        body: "We build with AI-assisted development ourselves, so it's a fair question. Read our guide to how AI changes software development economics — where it genuinely removes manual work, where experienced humans still matter, and what it should mean for a software quote. See: does AI make software development cheaper?",
      },
      {
        id: "from-ai-suggestion-to-working-system",
        heading: "From AI suggestion to working system",
        body: "Maybe ChatGPT, Claude or Gemini already told you the solution needs an API, a database, an automation, an agent or a custom application — and that's as far as you got. You don't need to know how to build those pieces yourself. Show us what you're trying to achieve and we'll work out the implementation. We're not affiliated with any AI provider; we just speak both languages — the AI's and your business's.",
      },
      {
        id: "human-checkpoints",
        heading: "Built-in human checkpoints",
        body: "Every system we implement decides up front where a person must remain in the loop — approvals, spot checks, exception handling. Not because we don't trust AI, but because most business processes have a few steps where getting it wrong is expensive. The system does the heavy lifting; your team stays in control where it matters.",
      },
      {
        id: "what-weve-built",
        heading: "What we've built",
        body: "T3 Labs implements AI in production, not just in theory. Our own AI intake — the one this page invites you to use — analyses typed and spoken business problems end-to-end, with follow-up questions, structured briefs and human review behind it. We also build QuoteCore+, which uses AI to read roof plans and identify measurements for review. We apply the same practical approach to your systems.",
      },
    ],
    ctaHeadline: "Know what you want built?",
    ctaBody: "Tell us what you're trying to build — including what AI already suggested. Type it or leave a voice note. We'll come back with a plain-English view of how to make it real.",
    ctaButtonText: "Tell us what you're trying to build",
    problemCategory: "ai-implementation",
    related: [
      { href: "/ai-consultancy", label: "AI Consultancy" },
      { href: "/ai-automation", label: "AI Automation" },
      { href: "/ai-training", label: "AI Training" },
    ],
    relatedHeading: "Related",
    faqs: [
      {
        q: "Can you build something ChatGPT or another AI suggested?",
        a: "Yes — that's a common starting point. An AI recommendation tells you what's technically possible, not how to build it inside your business. Bring us the recommendation and the outcome you want; we'll work out the implementation, including the parts the AI didn't mention.",
      },
      {
        q: "Can you connect AI to our existing software?",
        a: "Usually, yes. Integrations — CRMs, accounting systems, inboxes, job-management tools — are a core part of implementation work. If a system doesn't expose the access we need, we'll tell you honestly before any build starts.",
      },
      {
        q: "Do we need an internal developer?",
        a: "No. We handle the build, deployment and handover. If your team wants to take ownership later, we can structure the handover and documentation so that's realistic — but it's not required.",
      },
      {
        q: "How do you decide where human approval is still needed?",
        a: "We design checkpoints where the cost of being wrong is high: commercial figures, sensitive communications, legal obligations, genuinely ambiguous cases. Everything high-volume and predictable runs automatically. The result is AI doing the heavy lifting with people in control where it matters.",
      },
    ],
  },
  {
    slug: "ai-automation",
    eyebrow: "AI Automation · Workflows · Processes",
    title: "AI Automation for UK Businesses",
    h1: "AI Automation for Repetitive Business Work",
    intro: [
      "The goal isn't automation for its own sake. It's removing the work your team shouldn't be doing, while keeping people where their judgment matters.",
      "A good automated system should not create more work for your team. We design workflows where AI processes routine work automatically and only asks a person to step in when there's a genuine exception, decision or approval.",
    ],
    metaDescription:
      "AI automation for UK businesses. We automate repetitive workflows — enquiries, documents, data entry, reporting, follow-ups — with human review kept where it matters. Tell us what's taking too much time.",
    intent: "We want this repetitive process to run automatically.",
    sections: [
      {
        id: "typical-problems",
        heading: "Work we automate",
        body: "If your team does the same sequence of steps more than a few times a week, it's a candidate. Typical examples:",
        bullets: [
          "Copying data between systems",
          "Processing and routing incoming enquiries",
          "Extracting information from documents and emails",
          "Generating drafts — quotes, replies, reports",
          "Chasing information and following people up",
          "Creating records in a CRM or job system",
          "Routing jobs to the right person or team",
          "Summarising long email threads or documents",
          "Updating CRM records from conversations",
          "Preparing recurring reports",
          "Generating internal alerts when something needs attention",
          "Answering repetitive customer questions",
        ],
      },
      {
        id: "how-we-design-automation",
        heading: "How we design automation",
        body: "We start from the work, not the technology. First we map what actually happens in your business today — including the informal steps people don't mention. Then we decide, step by step, what should run automatically, what needs AI, what's better as ordinary non-AI automation, and where a person stays in the loop. Only then do we build.",
      },
      {
        id: "exceptions-not-removal",
        heading: "Exceptions, not elimination",
        body: "Fully hands-off sounds appealing until the first weird case. Our automated workflows surface exceptions clearly: the system flags the unusual enquiry, the missing field, the number that doesn't look right — and a person handles those. AI processes the routine work; your team spends its time on the cases that genuinely need them.",
      },
      {
        id: "evidence",
        heading: "Automation we run ourselves",
        body: "We don't just recommend automation — we operate it. T3 Labs' own enquiry funnel captures attribution, categorises problems and routes them automatically, with humans reviewing the output before anything reaches a client. The same pattern — AI does the repetitive work, people keep the judgment — is what we build for you.",
      },
    ],
    ctaHeadline: "Something eating your team's week?",
    ctaBody: "Tell us what's taking too much time — type it or leave a voice note. We'll tell you honestly whether AI, ordinary automation, or a mix is the right fit.",
    ctaButtonText: "Tell us what's taking too much time",
    problemCategory: "ai-automation",
    related: [
      { href: "/ai-consultancy", label: "AI Consultancy" },
      { href: "/ai-implementation", label: "AI Implementation" },
      { href: "/ai-training", label: "AI Training" },
    ],
    relatedHeading: "Related",
    faqs: [
      {
        q: "What business processes are good candidates for AI automation?",
        a: "The best candidates are high-volume, repetitive and rule-shaped: processing enquiries, extracting data from documents, updating records, generating drafts, chasing information, preparing recurring reports. If your team does the same sequence of steps weekly, it's a candidate.",
      },
      {
        q: "Does automation mean removing people entirely?",
        a: "No — and trying to usually backfires. We automate the routine work and keep people for exceptions, approvals and judgment calls. The goal isn't to remove humans; it's to stop humans wasting time on work the system can already do for them.",
      },
      {
        q: "Can you automate work between software we already use?",
        a: "Yes — connecting your existing systems is often the highest-value automation there is, and sometimes it doesn't even need AI. We'll tell you honestly when a simple integration beats a clever one.",
      },
      {
        q: "What happens when AI is uncertain or something unusual happens?",
        a: "The workflow surfaces it. Uncertain cases, missing fields and unusual patterns get flagged to a person instead of guessed at. That's deliberate design, not a limitation: exceptions go to humans; routine work runs itself.",
      },
    ],
  },
  {
    slug: "ai-training",
    eyebrow: "AI Training · Workshops · Handover",
    title: "Practical AI Training for Businesses",
    h1: "Practical AI Training for Your Team",
    intro: [
      "Training around the work your people actually do — not theoretical AI education.",
      "If your team needs to become capable with AI themselves, rather than outsourcing everything, we train them on your real workflows, your real documents and your real judgment calls.",
    ],
    metaDescription:
      "Practical AI training for UK business teams. We train around the work your people actually do — prompts, checking output, safe use of company data and repeatable workflows.",
    intent: "We want our people to use AI effectively.",
    sections: [
      {
        id: "what-training-covers",
        heading: "What we cover",
        body: "Every session is built around your team's actual work, but the core skills are consistent:",
        bullets: [
          "Identifying which tasks are worth using AI for",
          "Writing better instructions and prompts",
          "Working safely with company and customer information",
          "Checking AI output — knowing when to trust it and when not to",
          "Creating repeatable workflows your team reuses",
          "Using approved tools consistently",
          "Recognising when human review is required",
          "Building simple internal operating procedures around AI use",
        ],
      },
      {
        id: "training-around-your-systems",
        heading: "Training around systems we implement",
        body: "The best time to train your team is when a new system lands. We provide handover training as part of implementation work, so the people who'll actually run the workflow learn it on the real thing — not a generic demo.",
      },
      {
        id: "who-training-suits",
        heading: "Who this suits",
        body: "Businesses that want to build internal capability: a small team that should be getting more out of AI day to day, or a whole company that needs a consistent, safe approach rather than everyone improvising separately.",
      },
    ],
    ctaHeadline: "Want your team using AI properly?",
    ctaBody: "Tell us what your team needs help with — type it or leave a voice note. We'll suggest the training shape that fits how you actually work.",
    ctaButtonText: "Tell us what your team needs help with",
    problemCategory: "ai-training",
    related: [
      { href: "/ai-consultancy", label: "AI Consultancy" },
      { href: "/ai-implementation", label: "AI Implementation" },
      { href: "/ai-automation", label: "AI Automation" },
    ],
    relatedHeading: "Related",
    faqs: [
      {
        q: "Can you train our team using our actual business workflows?",
        a: "Yes — that's the only kind of training we do. Sessions are built around your real work: your documents, your processes, your judgment calls. Generic 'what is AI' courses aren't on the menu.",
      },
      {
        q: "Is this generic ChatGPT training?",
        a: "No. We cover prompts and tool use, but the core is the work around them: which tasks are worth using AI for, how to check output, how to handle company data safely, and when human review is required.",
      },
      {
        q: "Can training be included with a system you implement?",
        a: "Yes — it's the best time to train. Handover training happens on the live system your team will actually run, not a generic demo.",
      },
      {
        q: "How do you teach staff when AI output needs checking?",
        a: "Practically: real examples from your own workflows, showing what confident output looks like, what uncertain output looks like, and the specific checks that matter in your business. People learn judgment from cases, not slides.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServicePageData | undefined {
  return AI_SERVICES.find((s) => s.slug === slug);
}

export const AI_SERVICE_SLUGS = AI_SERVICES.map((s) => s.slug);
