import { websitePackageTerms } from "@/lib/website-package-terms";
import type { ProposalConfig } from "../proposal-types";

const asset = (name: string) => `/proposal-assets/proposal-blenheim-roofing-wp-000209/${name}`;

export const blenheimRoofingProposal = {
  slug: "blenheim-roofing-wp-000209",
  prospectId: "WP-000209",
  companyName: "Blenheim Roofing Services Ltd",
  contactFirstName: "David",
  location: "Surrey",
  existingWebsiteUrl: "https://blenheimroofing.co.uk/contact-us/",
  hasExistingWebsite: true,
  seo: {
    title: "Blenheim Roofing Services Ltd | Private Website Concept | T3 Labs",
    description:
      "A private website proposal for Blenheim Roofing Services Ltd, showing a clearer mobile-friendly concept, practical work examples and a more focused quote journey.",
  },
  hero: {
    overline: "A private concept created for",
    headline: "Hi David, we created a private website concept for Blenheim Roofing Services Ltd.",
    supportingCopy:
      "This private walkthrough shows a working website concept designed to make the company easier to understand on mobile, bring completed work and trust material forward, and support better quote enquiries.",
    privacyNote: "This concept is private and is not publicly listed.",
  },
  video: {
    provider: "self-hosted",
    url: asset("walkthrough-video.mp4"),
    posterImage: {
      src: asset("walkthrough-thumbnail.png"),
      alt: "Walkthrough thumbnail for the private Blenheim Roofing proposal video",
    },
  },
  outcomes: [
    "Clearer presentation on phones",
    "More visible work examples and trust signals",
    "A more direct quote-request route",
    "A calmer first impression for visitors",
  ],
  conceptImages: {
    desktopHero: {
      src: asset("concept-home-desktop.png"),
      alt: "Desktop concept homepage for Blenheim Roofing Services Ltd",
    },
    mobileHero: {
      src: asset("concept-home-mobile.png"),
      alt: "Mobile concept homepage for Blenheim Roofing Services Ltd",
    },
    supporting: [
      {
        src: asset("concept-feature-section.png"),
        alt: "Feature and trust section concept for Blenheim Roofing Services Ltd",
      },
      {
        src: asset("concept-quote-form.png"),
        alt: "Quote form concept for Blenheim Roofing Services Ltd",
      },
    ],
  },
  comparison: {
    currentSiteImage: {
      src: asset("current-site-desktop.png"),
      alt: "Current Blenheim Roofing website homepage captured for the private comparison",
    },
    proposedImage: {
      src: asset("concept-home-desktop.png"),
      alt: "Proposed Blenheim Roofing website concept homepage",
    },
    proposedSupportingImages: [
      {
        src: asset("concept-home-tablet.png"),
        alt: "Tablet view of the proposed Blenheim Roofing website concept",
        presentation: "natural",
      },
    ],
    currentLabel: "Current website",
    currentBadge: "As captured",
    proposedLabel: "New website concept",
    proposedBadge: "Private concept",
    currentPoints: [
      "The current site looks more dated and makes the first impression harder work on smaller screens.",
      "The mobile presentation is not as easy to scan as it should be.",
      "The social proof and project detail can be brought closer to the top.",
    ],
    proposedPoints: [
      "A cleaner layout that is easier to use on desktop and mobile.",
      "Completed work, reviews and service information are easier to find.",
      "A clearer quote path that encourages better enquiries.",
    ],
  },
  findings: [
    {
      title: "The current presentation feels dated",
      description:
        "The existing website gives the business a less modern first impression than the work itself deserves.",
    },
    {
      title: "Mobile usability can be improved",
      description:
        "The site is harder to scan on smaller screens, so the key information takes more effort to find.",
    },
    {
      title: "Social proof is not front and centre",
      description:
        "Reviews, work examples and trust material are available, but they are not brought forward enough for a first visit.",
    },
  ],
  strengths: [
    {
      title: "25 years in the industry",
      description: "A simple, verified strength that gives the proposal a solid foundation.",
    },
    {
      title: "Recognised roofing credentials",
      description: "NFRC Gold Health & Safety Award, ISO 9001, CHAS, Constructionline and Avetta are all worth surfacing clearly.",
    },
    {
      title: "Practical industrial roofing services",
      description:
        "The business already has a clear service offer across asbestos removal, cladding, single ply, felt, liquid waterproofing and rooflight replacement.",
    },
  ],
  improvements: [
    {
      title: "Stronger first impression",
      description: "A cleaner homepage gives the business a more current look straight away.",
    },
    {
      title: "Better mobile reading",
      description: "The concept is set up to be easier to scan on phones and tablets.",
    },
    {
      title: "Work examples and reviews up front",
      description: "The important trust material is easier to notice before someone gets in touch.",
    },
    {
      title: "Clearer quote request flow",
      description: "The enquiry form is set out to gather more useful project details earlier.",
    },
    {
      title: "Clearer service wording",
      description: "The service list makes the roofing offer easier to understand at a glance.",
    },
    {
      title: "A more focused local pitch",
      description: "The page keeps the Surrey and occupied-site message simple and direct.",
    },
  ],
  package: {
    priceLabel: websitePackageTerms.packagePrice,
    intro:
      "The website concept you can see here has already been built for Blenheim Roofing Services Ltd. If you decide to go ahead, we’ll make the agreed changes, connect the domain and enquiry form, complete the final checks and prepare it for launch.",
    includedItems: [
      "The one-page website concept shown in the proposal",
      "Desktop, tablet and mobile optimisation",
      "Services, service areas and contact details",
      "Project gallery and trust content",
      "Detailed quote-request form",
      "Foundational on-page SEO",
      "Domain connection and launch",
    ],
    paymentSummary: "No payment is taken by clicking. We will confirm the final scope and terms with you first.",
    revisionRounds: websitePackageTerms.revisionRounds,
    includedHostingMonths: websitePackageTerms.includedHostingMonths,
    monthlyHostingPrice: websitePackageTerms.monthlyHostingPrice,
    handoverMinutes: websitePackageTerms.handoverMinutes,
    deliveryWorkingDaysMin: websitePackageTerms.estimatedDeliveryWorkingDaysMin,
    deliveryWorkingDaysMax: websitePackageTerms.estimatedDeliveryWorkingDaysMax,
    ownershipSummary: "You own the agreed website content and live domain setup after launch.",
    domainProcessSummary: "We’ll connect the domain once the launch details are confirmed.",
  },
  faq: [
    {
      question: "What happens after I click the launch button?",
      answer:
        "Clicking records interest only. No payment is taken and no binding order is created. We’ll talk through the details first and agree the next steps together.",
    },
    {
      question: "How many revision rounds are included?",
      answer: `${websitePackageTerms.revisionRounds} revision round is included in the package.`,
    },
    {
      question: "What if I want extra pages later?",
      answer:
        `The ${websitePackageTerms.packagePrice} package covers the one-page website concept shown here. Additional pages can be scoped separately if you need them later.`,
    },
    {
      question: "Does this guarantee search rankings?",
      answer:
        "No. The proposal includes practical on-page SEO foundations, but rankings and enquiry volumes are not guaranteed.",
    },
    {
      question: "What happens after launch?",
      answer:
        `Managed hosting and technical support are included for the first ${websitePackageTerms.includedHostingMonths} months after launch. After that, we’ll confirm the ongoing arrangement with you before anything continues.`,
    },
  ],
  actions: {
    calendlyUrl: "https://calendly.com/insights-t3labs/20-minute-meeting",
  },
  pageCopy: {
    conceptHeading: "See the concept in detail",
    comparisonHeading: "What you have now vs the new concept",
    comparisonIntro:
      "A fair side-by-side view of the current public website and the private concept created for Blenheim Roofing Services Ltd.",
    supportingViewsHeading: "Designed for useful project enquiries",
    supportingViewsNote: "Private concept views, not a public website.",
    findingsHeading: "Three opportunities we noticed",
    improvementsHeading: "What this concept improves",
    packageLabel: "Website launch package",
    packageHeading: "Launch this website for",
    packageIntro:
      "The website concept you can see here has already been built for Blenheim Roofing Services Ltd. If you decide to go ahead, we’ll make the agreed changes, connect the domain and enquiry form, complete the final checks and prepare it for launch.",
    launchButtonLabel: "I’m interested in getting this live",
    finalEyebrow: "Your next step",
    finalHeading: "Ready to use this concept for Blenheim Roofing Services Ltd?",
    finalBody:
      "We’ll apply the agreed revisions, connect the domain and enquiry form, complete the final checks and prepare the website for launch.",
  },
  status: "draft",
} satisfies ProposalConfig;
