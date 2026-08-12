import type { ProposalConfig } from "../types";

/**
 * ACT ROOFING LTD - Short Proposal (first live prospect)
 * Built from the short proposal template. Hero + final CTA only.
 */

const asset = (name: string) => `/proposal-assets/act-roofing-ltd/${name}`;

export const actRoofingProposal = {
  slug: "act-roofing-ltd",
  layout: "short" as const,
  prospectId: "ACT-ROOFING",
  companyName: "Act Roofing Ltd",
  contactFirstName: "Craig",
  location: "United Kingdom",
  existingWebsiteUrl: "https://act-roofing-ltd.vercel.app/",
  hasExistingWebsite: true,
  seo: {
    title: "Act Roofing Ltd - Private Website Concept | T3 Labs",
    description: "A private website concept prepared for Act Roofing Ltd by T3 Labs.",
  },
  hero: {
    overline: "A private concept created for",
    headline: "Hi Craig - we created a private website concept for Act Roofing Ltd.",
    supportingCopy:
      "We put together a short concept for how Act Roofing could look online - clear, professional and easy for customers to get in touch. Here is what we made.",
    privacyNote: "This concept is private and is not publicly listed.",
  },
  video: {
    provider: "self-hosted",
    url: undefined,
    posterImage: {
      src: asset("concept-home-desktop.jpg"),
      alt: "Act Roofing Ltd website concept",
    },
  },
  outcomes: ["A cleaner online first impression", "Clearer services and contact path", "A simpler way for customers to get in touch"],
  conceptImages: {
    desktopHero: { src: asset("concept-home-desktop.jpg"), alt: "Act Roofing Ltd website concept" },
    mobileHero: { src: asset("concept-home-desktop.jpg"), alt: "Act Roofing Ltd website concept" },
    supporting: [],
  },
  comparison: undefined,
  findings: [],
  strengths: [],
  improvements: [],
  package: {
    priceLabel: "£399",
    revisionRounds: 1,
    includedHostingMonths: 3,
    monthlyHostingPrice: "£10",
    handoverMinutes: 20,
    deliveryWorkingDaysMin: 7,
    deliveryWorkingDaysMax: 10,
    intro:
      "The concept shown has already been built as a working one-page website for Act Roofing Ltd. If you choose to proceed, we will apply the agreed revisions, connect your domain and enquiry form, complete the final checks and prepare the website for launch.",
    includedItems: [
      "The one-page website shown",
      "Desktop, tablet and mobile optimisation",
      "Services, service areas and contact details",
      "Project gallery and trust content",
      "Detailed quote-request form",
      "Foundational on-page SEO",
      "Domain connection and launch",
    ],
    paymentSummary: "No payment is taken by clicking. We will confirm the final scope and terms with you first.",
  },
  faq: [],
  actions: {
    calendlyUrl: "https://calendly.com/cece-t3labs/20min",
    launchEmailUrl:
      "mailto:cece@t3labs.co.uk?subject=Website%20launch%20request%20-%20Act%20Roofing%20Ltd&body=Hi%20Cece%2C%0A%0AI%27d%20like%20to%20discuss%20launching%20the%20website%20concept%20for%20Act%20Roofing%20Ltd.%0A",
  },
  pageCopy: {
    launchButtonLabel: "I'm interested in getting this live",
    conceptHeading: "",
    comparisonHeading: "",
    comparisonIntro: "",
    supportingViewsHeading: "",
    supportingViewsNote: "",
    findingsHeading: "",
    improvementsHeading: "",
    packageLabel: "",
    packageHeading: "",
    packageIntro:
      "The concept shown has already been built as a working one-page website for Act Roofing Ltd. If you choose to proceed, we will apply the agreed revisions, connect your domain and enquiry form, complete the final checks and prepare the website for launch.",
    finalEyebrow: "Your next step",
    finalHeading: "Ready to use this concept for Act Roofing Ltd?",
    finalBody:
      "We will apply the agreed revisions, connect the domain and enquiry form, complete the final checks and prepare the website for launch.",
  },
  status: "active",
} satisfies ProposalConfig;
