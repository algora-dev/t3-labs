import { websitePackageTerms } from "@/lib/website-package-terms";
import type { ProposalConfig } from "../types";

const asset = (name: string) => `/proposal-assets/falcon-contracting-wp-000205/${name}`;

export const falconContractingProposal = {
  slug: "falcon-contracting-wp-000205",
  prospectId: "WP-000205",
  companyName: "Falcon Contracting",
  contactFirstName: "Daniel",
  location: "Essex",
  hasExistingWebsite: true,
  seo: {
    title: "Falcon Contracting - Private Website Concept | T3 Labs",
    description: "A private website concept prepared for Falcon Contracting by T3 Labs.",
  },
  hero: {
    overline: "A private concept created for",
    headline: "Hi Daniel - we created a private website concept for Falcon Contracting.",
    supportingCopy:
      "This recorded walkthrough shows a working website concept designed to help Falcon Contracting look more professional online, attract the right local visitors, build trust with reviews and completed work, and generate better-quality quote requests.",
    privacyNote: "This concept is private and is not publicly listed.",
  },
  video: {
    provider: "self-hosted",
    posterImage: {
      src: asset("concept-desktop-home.png"),
      alt: "Falcon Contracting website concept shown on desktop",
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
      src: asset("concept-desktop-home.png"),
      alt: "Desktop view of the Falcon Contracting website concept",
    },
    mobileHero: {
      src: asset("concept-mobile-home.png"),
      alt: "Mobile view of the Falcon Contracting website concept",
    },
  },
  comparison: {
    currentSiteImage: {
      src: asset("current-site-unreachable.png"),
      alt: "Current Falcon Contracting website URL showing a browser site cannot be reached message",
    },
    proposedImage: {
      src: asset("concept-desktop-home.png"),
      alt: "Proposed Falcon Contracting website concept",
    },
    currentPoints: [
      "At the time of capture, the website could not be reached by prospective customers.",
      "Falcon's online presence does not fully showcase the quality and range of work the business delivers.",
      "A clearer website journey could help customers explore services, view completed projects and request a quote with confidence.",
    ],
    proposedPoints: [
      "A calm, professional presentation designed around Falcon's work.",
      "Mobile-first project proof and service information.",
      "A structured quote journey for useful project details and images.",
    ],
  },
  findings: [
    {
      title: "Presentation does not reflect the business",
      description:
        "The current site does not fully reflect the quality, experience and range of work Falcon Contracting can show customers today.",
    },
    {
      title: "Project proof could work harder",
      description:
        "Completed projects and customer reviews can be brought forward so visitors see evidence of the workmanship before making contact.",
    },
    {
      title: "The quote journey could collect better information",
      description:
        "A more detailed quotation form can collect the service, location, timeframe and project images before the first conversation.",
    },
  ],
  improvements: [
    { title: "Professional presentation", description: "A modern, credible first impression that reflects the work." },
    { title: "Local-search foundations", description: "Clear service and location wording, headings and page structure." },
    { title: "Reviews and completed work", description: "Customer proof is easier to see before someone gets in touch." },
    { title: "Better mobile experience", description: "A focused journey built for visitors using their phone." },
    { title: "Clear quotation journey", description: "A simple route from interest to a useful project enquiry." },
    { title: "Better enquiry quality", description: "More context before the first conversation, with no guarantees or inflated claims." },
  ],
  package: {
    priceLabel: websitePackageTerms.packagePrice,
    vatLabel: websitePackageTerms.vatStatus,
    revisionRounds: websitePackageTerms.revisionRounds,
    includedHostingMonths: websitePackageTerms.includedHostingMonths,
    monthlyHostingPrice: websitePackageTerms.monthlyHostingPrice,
    handoverMinutes: websitePackageTerms.handoverMinutes,
    deliveryWorkingDaysMin: websitePackageTerms.estimatedDeliveryWorkingDaysMin,
    deliveryWorkingDaysMax: websitePackageTerms.estimatedDeliveryWorkingDaysMax,
    intro:
      "The concept shown in your walkthrough has already been built as a working one-page website for Falcon Contracting. If you choose to proceed, we will apply the agreed revisions, connect your domain and enquiry form, complete the final checks and prepare the website for launch.",
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
