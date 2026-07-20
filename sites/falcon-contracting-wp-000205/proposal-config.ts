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
      "Falcon has been roofing and building across Essex for 22 years, but the current website does not really show the experience, services or quality of work behind the business. We created this private concept to show how Falcon could be presented more clearly online and make it easier for local customers to get in touch.",
    privacyNote: "This concept is private and is not publicly listed.",
  },
  video: {
    provider: "self-hosted",
    url: asset("falcon-walkthrough.mp4"),
    posterImage: {
      src: asset("walkthrough-thumbnail.png"),
      alt: "Falcon Contracting website walkthrough thumbnail",
    },
  },
  outcomes: [
    "22 years of experience brought forward",
    "Services and completed work made easier to see",
    "A clearer way for customers to request a quote",
    "Built to work properly on mobile",
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
    proposedSupportingImages: [
      {
        src: asset("concept-gallery-sections.png"),
        alt: "Falcon Contracting concept showing recent work, why Falcon and customer feedback sections",
      },
    ],
    currentBadge: "When we checked",
    currentPoints: [
      "At the time we checked, the website could not be reached by prospective customers.",
      "The current online presence does not really show off Falcon's 22 years of experience or the range of work you take on.",
      "Customers should be able to quickly see what you do, look through completed work and get in touch without having to search around.",
    ],
    proposedPoints: [
      "Falcon's experience, services and family-run background are much clearer.",
      "Completed work and customer feedback are easier to find.",
      "Customers have a simple way to explain the job and request a quote.",
    ],
  },
  findings: [
    {
      title: "Falcon's experience should be much clearer",
      description:
        "Being family-run and having 22 years of roofing and construction experience are two of Falcon's strongest trust points. They should be obvious as soon as someone lands on the website, rather than easy to miss.",
    },
    {
      title: "The work should do more of the selling",
      description:
        "Falcon covers everything from roof repairs and replacements to chimney work, external refurbishment and larger construction projects. Showing those services alongside real completed work gives customers a much better reason to get in touch.",
    },
    {
      title: "Getting a quote should be easier",
      description:
        "A simple form can let customers explain what they need, where the job is and upload a few photos before you speak to them. That gives you a better idea of the job from the start.",
    },
  ],
  strengths: [
    {
      title: "Established roofing experience",
      description:
        "Falcon already has a strong story to tell, with 22 years of roofing and construction experience behind the business.",
    },
    {
      title: "Real project proof",
      description:
        "The business has genuine completed work across new roofs, repairs, flat roofing, refurbishment and wider construction projects.",
    },
    {
      title: "Useful customer trust signals",
      description:
        "Customer feedback, family-run positioning and local Essex service coverage give the new website strong material to build from.",
    },
  ],
  improvements: [
    { title: "Stronger first impression", description: "A clearer, more modern website that better reflects the experience behind Falcon Contracting." },
    { title: "Clearer local presence", description: "Makes it obvious that Falcon is a family-run Essex business serving Colchester and the surrounding area." },
    { title: "More proof of the work", description: "Services, completed projects and customer feedback are easier to see before someone gets in touch." },
    { title: "Easier to use on mobile", description: "Customers can quickly browse the work, check services and contact Falcon from their phone." },
    { title: "Simpler quote requests", description: "A straightforward form helps customers explain the job and send photos without a long email chain." },
    { title: "Better information from the start", description: "You receive useful job details before the first call, making it easier to decide what needs to happen next." },
  ],
  package: {
    priceLabel: websitePackageTerms.packagePrice,
    revisionRounds: websitePackageTerms.revisionRounds,
    includedHostingMonths: websitePackageTerms.includedHostingMonths,
    monthlyHostingPrice: websitePackageTerms.monthlyHostingPrice,
    handoverMinutes: websitePackageTerms.handoverMinutes,
    deliveryWorkingDaysMin: websitePackageTerms.estimatedDeliveryWorkingDaysMin,
    deliveryWorkingDaysMax: websitePackageTerms.estimatedDeliveryWorkingDaysMax,
    intro:
      "The concept shown in your walkthrough has already been built as a working one-page website for Falcon Contracting. If you choose to proceed, we will apply the agreed revisions, connect your domain and enquiry form, complete the final checks and prepare the website for launch.",
    includedItems: [
      "The one-page Falcon Contracting website shown in the walkthrough",
      "Desktop, tablet and mobile optimisation",
      "Falcon's services, service areas and contact details",
      "Project gallery, reviews and trust content",
      "Detailed quote-request form with image uploads",
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
  pageCopy: {
    conceptHeading: "Take a look at the website we built for Falcon",
    comparisonHeading: "Falcon's current website compared with the new concept",
    comparisonIntro:
      "The current website does not show Falcon at its best. The new concept gives the business a clearer, more modern online presence while keeping the focus on the work itself.",
    findingsHeading: "Three opportunities we noticed",
    improvementsHeading: "What the new website improves",
    packageLabel: "Finishing and launching the website",
    packageHeading: "Launch Falcon's new website for",
    packageIntro:
      "The website shown in the walkthrough has already been built around Falcon Contracting. If you decide to go ahead, we will make the agreed changes, add the final business details, connect the domain and enquiry form, test everything and prepare it for launch.",
    launchButtonLabel: "I'd like to launch the website",
    finalEyebrow: "Like the direction?",
    finalHeading: "Ready to put the new Falcon website live?",
    finalBody:
      "We will make the agreed changes, connect your domain and enquiry form, complete the final checks and get the website ready to launch.",
  },
  status: "draft",
} satisfies ProposalConfig;
