import type { ProposalConfig } from "../types";

const asset = (name: string) => `/proposal-assets/aspire-membranes-wp-000206/${name}`;

export const aspireMembranesProposal = {
  slug: "aspire-membranes-wp-000206",
  prospectId: "WP-000206",
  companyName: "Aspire Membranes Limited",
  contactFirstName: "Bruce",
  location: "Leven, Fife",
  hasExistingWebsite: true,
  seo: {
    title: "Aspire Membranes Limited - Private Website Concept | T3 Labs",
    description: "A private website concept prepared for Aspire Membranes Limited by T3 Labs.",
  },
  hero: {
    overline: "A private concept created for",
    headline: "Hi Bruce - we created a private website concept for Aspire Membranes Limited.",
    supportingCopy:
      "This recorded walkthrough shows a working website concept designed to help Aspire Membranes look more professional online, make its specialist roofing services clearer, build trust through completed work, and generate better-quality quote requests.",
    privacyNote: "This concept is private and is not publicly listed.",
  },
  video: {
    provider: "self-hosted",
    posterImage: {
      src: asset("concept-desktop.png"),
      alt: "Desktop view of the Aspire Membranes website concept",
    },
  },
  outcomes: [
    "Stronger local-search foundations",
    "Reviews and project proof",
    "Higher-quality quote requests",
    "Less back-and-forth",
  ],
  conceptImages: {
    desktopHero: {
      src: asset("concept-desktop.png"),
      alt: "Desktop homepage view of the Aspire Membranes concept",
    },
    mobileHero: {
      src: asset("concept-mobile.png"),
      alt: "Mobile homepage view of the Aspire Membranes concept",
    },
    supporting: [
      {
        src: asset("concept-contact-options.png"),
        alt: "Updated Aspire Membranes contact and project enquiry options section",
      },
      {
        src: asset("concept-feature-section.png"),
        alt: "Aspire Membranes service and completed-work section concept",
      },
    ],
  },
  comparison: {
    currentSiteImage: {
      src: asset("current-site.png"),
      alt: "Current Aspire Membranes website homepage captured for this private comparison",
    },
    proposedImage: {
      src: asset("concept-desktop.png"),
      alt: "Proposed Aspire Membranes website concept on desktop",
    },
    currentPoints: [
      "Specialist services can be made easier for visitors to identify and compare.",
      "Completed roofing work can have a clearer role in building confidence before contact.",
      "A more structured quote journey can collect useful details from the start.",
    ],
    proposedPoints: [
      "A focused presentation for industrial, domestic and specialist roofing work.",
      "Project imagery and proof placed throughout the customer journey.",
      "A detailed quote form for roof type, timing, location and photos or plans.",
    ],
  },
  findings: [
    {
      title: "Services could be easier to scan",
      description:
        "Aspire's range of membrane, flat, pitched and industrial roofing work can be organised around clearer starting points for visitors.",
    },
    {
      title: "Completed work can build confidence sooner",
      description:
        "The approved project photography gives customers useful evidence of the type and quality of roofing work before they enquire.",
    },
    {
      title: "The first enquiry can start with better context",
      description:
        "A structured route for service, postcode, timeframe and project photos or plans can make the first conversation more useful.",
    },
  ],
  improvements: [
    { title: "Professional presentation", description: "A credible first impression for a specialist roofing contractor." },
    { title: "Local-search foundations", description: "Clear service, location and coverage wording in a logical page structure." },
    { title: "Reviews and completed work", description: "Approved project proof made easier to find before someone gets in touch." },
    { title: "Better mobile experience", description: "A direct, readable journey for people viewing the site on their phone." },
    { title: "Clear quotation journey", description: "A useful route from initial interest to a detailed project enquiry." },
    { title: "Better enquiry quality", description: "More project context before the first conversation, without guarantees." },
  ],
  package: {
    priceLabel: "£399",
    intro:
      "The website shown in your walkthrough has already been built as a working concept for Aspire Membranes Limited. If you decide to proceed, we will restore the project, apply the agreed changes, connect your domain and enquiry form, and prepare the website for launch.",
    includedItems: [
      "The one-page website shown",
      "Desktop, tablet and mobile optimisation",
      "Services, service areas and contact details",
      "Project gallery and trust content",
      "Detailed quote-request form",
      "Foundational on-page SEO",
      "Domain connection and launch",
    ],
    paymentSummary: "No payment is taken by clicking. We will confirm the final scope first.",
  },
  faq: [
    {
      question: "What happens after the included hosting period?",
      answer: "The included period and ongoing hosting price will be confirmed clearly before you agree to proceed.",
    },
    {
      question: "How many revision rounds are included?",
      answer: "The agreed number of revision rounds will be written into the final scope before any payment is requested.",
    },
    {
      question: "Can additional pages be added later?",
      answer: "Yes. Additional pages can be scoped separately if Aspire needs them after the initial launch.",
    },
    {
      question: "Can logo or brand-colour changes be included?",
      answer: "Small visual refinements can be discussed during scoping. A larger identity project would be quoted separately.",
    },
    {
      question: "Does this guarantee Google rankings?",
      answer: "No. The package includes foundational on-page SEO improvements. It does not guarantee rankings, traffic or a specific number of enquiries.",
    },
    {
      question: "Can the existing domain be used?",
      answer: "Yes. The existing domain can normally be connected once access and the launch plan have been agreed.",
    },
    {
      question: "Who owns the finished website?",
      answer: "Ownership and code-transfer terms will be set out clearly in the final package terms before you proceed.",
    },
    {
      question: "What happens after I click the launch button?",
      answer: "It records your interest only. No payment is taken. T3 Labs will confirm the scope, final terms and next steps with you first.",
    },
  ],
  actions: {
    calendlyUrl: "https://calendly.com/insights-t3labs/20-minute-meeting",
  },
  status: "draft",
} satisfies ProposalConfig;
