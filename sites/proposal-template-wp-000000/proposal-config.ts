import { websitePackageTerms } from "@/lib/website-package-terms";
import type { ProposalConfig } from "../types";

const asset = (name: string) => `/proposal-assets/proposal-template-wp-000000/${name}`;

export const proposalTemplate = {
  slug: "proposal-template-wp-000000",
  prospectId: "WP-000000",
  companyName: "[COMPANY NAME]",
  contactFirstName: "[CONTACT FIRST NAME]",
  location: "[LOCATION]",
  existingWebsiteUrl: "[CURRENT WEBSITE URL]",
  hasExistingWebsite: true,
  seo: {
    title: "[COMPANY NAME] - Private Website Concept | T3 Labs",
    description: "A private website proposal template prepared by T3 Labs.",
  },
  hero: {
    overline: "A private concept created for",
    headline: "Hi [CONTACT FIRST NAME] - we created a private website concept for [COMPANY NAME].",
    supportingCopy:
      "This private walkthrough shows a working website concept designed to improve presentation, trust, mobile usability and quote-request quality for [COMPANY NAME].",
    privacyNote: "This concept is private and is not publicly listed.",
  },
  video: {
    provider: "self-hosted",
    url: asset("walkthrough-video.mp4"),
    posterImage: {
      src: asset("walkthrough-thumbnail.png"),
      alt: "Website concept walkthrough poster placeholder",
    },
  },
  outcomes: ["Stronger local-search foundations", "Project proof and trust signals", "Higher-quality quote requests", "Clearer mobile journey"],
  conceptImages: {
    desktopHero: { src: asset("concept-home-desktop.png"), alt: "Desktop concept placeholder" },
    mobileHero: { src: asset("concept-home-mobile.png"), alt: "Mobile concept placeholder" },
    supporting: [
      { src: asset("concept-feature-section.png"), alt: "Feature section concept placeholder" },
      { src: asset("concept-quote-form.png"), alt: "Quote form concept placeholder" },
    ],
  },
  comparison: {
    currentSiteImage: { src: asset("current-site-desktop.png"), alt: "Current website screenshot placeholder" },
    proposedImage: { src: asset("concept-home-desktop.png"), alt: "Proposed website concept placeholder" },
    proposedSupportingImages: [
      {
        src: asset("concept-home-tablet.png"),
        alt: "Tablet website concept placeholder",
        presentation: "natural",
      },
    ],
    currentPoints: [
      "Replace this with a fair observation about the current website.",
      "Replace this with a customer-proof, mobile or enquiry-flow observation.",
      "Replace this with a practical improvement opportunity.",
    ],
    proposedPoints: [
      "A calmer, clearer presentation tailored to [COMPANY NAME].",
      "Project proof and service information brought forward.",
      "A structured quote journey for more useful enquiries.",
    ],
  },
  findings: [
    { title: "Presentation opportunity", description: "Replace with a specific, fair observation about how the current website could present the business more clearly." },
    { title: "Project proof opportunity", description: "Replace with a note about reviews, completed work, accreditations or trust material that could work harder." },
    { title: "Enquiry quality opportunity", description: "Replace with a note about how the quote journey can collect better project information." },
  ],
  strengths: [
    { title: "Real business substance", description: "Replace with something the prospect is already doing well, such as experience, specialist services or visible trade knowledge." },
    { title: "Useful proof to build from", description: "Replace with a positive note about existing reviews, project photos, accreditations or customer trust signals." },
    { title: "Clear local relevance", description: "Replace with a strength around location, service area, customer base or the type of work they are already known for." },
  ],
  improvements: [
    { title: "Professional presentation", description: "A credible first impression using genuine business material." },
    { title: "Local-search foundations", description: "Clear service and location wording, headings and page structure." },
    { title: "Reviews and completed work", description: "Customer proof is easier to see before someone gets in touch." },
    { title: "Better mobile experience", description: "A focused journey built for visitors using their phone." },
    { title: "Clear quotation journey", description: "A simple route from interest to a useful project enquiry." },
    { title: "Better enquiry quality", description: "More context before the first conversation." },
  ],
  package: {
    priceLabel: websitePackageTerms.packagePrice,
    revisionRounds: websitePackageTerms.revisionRounds,
    includedHostingMonths: websitePackageTerms.includedHostingMonths,
    monthlyHostingPrice: websitePackageTerms.monthlyHostingPrice,
    handoverMinutes: websitePackageTerms.handoverMinutes,
    deliveryWorkingDaysMin: websitePackageTerms.estimatedDeliveryWorkingDaysMin,
    deliveryWorkingDaysMax: websitePackageTerms.estimatedDeliveryWorkingDaysMax,
    // Required commercial summary. The visible package introduction is pageCopy.packageIntro when provided.
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
  faq: [
    {
      question: "What happens after the included hosting period?",
      answer: `Managed website hosting and technical support are included for the first ${websitePackageTerms.includedHostingMonths} months from launch. After that, you can continue hosting with T3 Labs for ${websitePackageTerms.monthlyHostingPrice} per month. There is no long-term commitment, and T3 Labs will contact you before the included period ends. The monthly service begins only after you agree to continue.`,
    },
    {
      question: "What does the hosting and technical support include?",
      answer: `It includes secure website hosting, SSL, routine backups, technical maintenance, security updates and assistance with genuine website faults. It does not include routine content changes, additional pages, new features, ongoing SEO, marketing work, domain renewal or third-party subscriptions. Support requests normally receive an initial response within ${websitePackageTerms.supportResponseWorkingDays} working days.`,
    },
    {
      question: "How many revision rounds are included?",
      answer: `${websitePackageTerms.revisionRounds} consolidated revision round is included. One revision round means one complete list of reasonable changes submitted together.`,
    },
    {
      question: "Can additional pages be added later?",
      answer: `Yes. The ${websitePackageTerms.packagePrice} package covers the one-page website shown in the walkthrough. Additional pages can be scoped and quoted separately.`,
    },
    {
      question: "Does this guarantee Google rankings?",
      answer: "No. The package includes foundational on-page SEO work. Search rankings, traffic, enquiries, sales and revenue are not guaranteed.",
    },
    {
      question: "What happens after I click the launch button?",
      answer: "Clicking records interest only. No payment is taken and no binding order is created. Work begins only after scope, terms and payment schedule are confirmed.",
    },
  ],
  actions: {
    calendlyUrl: "https://calendly.com/insights-t3labs/20-minute-meeting",
  },
  status: "draft",
} satisfies ProposalConfig;
