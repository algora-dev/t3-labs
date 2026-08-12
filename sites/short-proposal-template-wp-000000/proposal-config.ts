import type { ProposalConfig } from "../types";

/**
 * SHORT PROPOSAL TEMPLATE (WP-000000)
 *
 * A brand-new, shortened variant of the T3 Labs private proposal template.
 * Keeps only the hero + final CTA. Purpose-built as a separate, additive
 * template so existing live proposals are never affected.
 */

const asset = (name: string) => `/proposal-assets/short-proposal-template-wp-000000/${name}`;

export const shortProposalTemplate = {
  slug: "short-proposal-template-wp-000000",
  layout: "short" as const,
  prospectId: "WP-000000",
  companyName: "[COMPANY NAME]",
  contactFirstName: "[CONTACT FIRST NAME]",
  location: "[LOCATION]",
  existingWebsiteUrl: "[CURRENT WEBSITE URL]",
  hasExistingWebsite: true,
  seo: {
    title: "[COMPANY NAME] - Private Website Concept | T3 Labs",
    description: "A private website concept prepared for [COMPANY NAME] by T3 Labs.",
  },
  hero: {
    overline: "A private concept created for",
    headline: "Hi [CONTACT FIRST NAME] - we created a private website concept for [COMPANY NAME].",
    supportingCopy:
      "We put together a short concept for how [COMPANY NAME] could look online - clear, professional and easy for customers to get in touch. Here is what we made.",
    privacyNote: "This concept is private and is not publicly listed.",
  },
  video: {
    provider: "self-hosted",
    url: asset("walkthrough-video.mp4"),
    posterImage: {
      src: asset("walkthrough-thumbnail.png"),
      alt: "Website concept walkthrough poster",
    },
  },
  outcomes: ["A cleaner online first impression", "Clearer services and contact path", "A simpler way for customers to get in touch"],
  // No middle sections in the short template - these fields exist only because
  // ProposalConfig types require them. The short renderer never displays them.
  conceptImages: {
    desktopHero: { src: asset("concept-home-desktop.png"), alt: "Desktop concept" },
    mobileHero: { src: asset("concept-home-mobile.png"), alt: "Mobile concept" },
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
      "The concept shown in your walkthrough has already been built as a working one-page website for [COMPANY NAME]. If you choose to proceed, we will apply the agreed revisions, connect your domain and enquiry form, complete the final checks and prepare the website for launch.",
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
      "mailto:cece@t3labs.co.uk?subject=Website%20launch%20request%20-%20%5BCOMPANY%20NAME%5D&body=Hi%20Cece%2C%0A%0AI%27d%20like%20to%20discuss%20launching%20the%20website%20concept%20for%20%5BCOMPANY%20NAME%5D.%0A",
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
      "The concept shown in your walkthrough has already been built as a working one-page website for [COMPANY NAME]. If you choose to proceed, we will apply the agreed revisions, connect your domain and enquiry form, complete the final checks and prepare the website for launch.",
    finalEyebrow: "Your next step",
    finalHeading: "Ready to use this concept for [COMPANY NAME]?",
    finalBody:
      "We will apply the agreed revisions, connect the domain and enquiry form, complete the final checks and prepare the website for launch.",
  },
  status: "draft",
} satisfies ProposalConfig;
