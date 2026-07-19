import { websitePackageTerms } from "@/lib/website-package-terms";
import type { ProposalConfig } from "../types";

const asset = (name: string) => `/proposal-assets/3a-roofing-wp-000207/${name}`;

export const threeARoofingProposal = {
  slug: "3a-roofing-wp-000207",
  prospectId: "WP-000207",
  companyName: "3A Roofing Ltd",
  contactFirstName: "Anton",
  location: "Ipswich, Suffolk",
  existingWebsiteUrl: "https://www.3aroofing.co.uk/",
  hasExistingWebsite: true,
  seo: {
    title: "3A Roofing Ltd - Private Website Concept | T3 Labs",
    description: "A private website concept prepared for 3A Roofing Ltd by T3 Labs.",
  },
  hero: {
    overline: "A private website concept for",
    headline: "Hi Anton - we built a private website concept for 3A Roofing Ltd.",
    supportingCopy:
      "We had a look at how 3A Roofing currently appears online and built a private concept around the parts of the business that feel strongest: heritage roofing, conservation knowledge, real project proof and a clearer way for Suffolk customers to request a quote.",
    privacyNote: "This is a private concept and is not publicly listed.",
  },
  video: {
    provider: "self-hosted",
    posterImage: {
      src: asset("concept-home-desktop-black.png"),
      alt: "Desktop view of the private 3A Roofing website concept",
    },
  },
  outcomes: [
    "Easier for local customers to find",
    "Reviews and completed jobs shown clearly",
    "Clearer quote enquiries",
    "Less back-and-forth",
  ],
  conceptImages: {
    desktopHero: {
      src: asset("concept-home-desktop-black.png"),
      alt: "Desktop homepage view of the 3A Roofing website concept",
    },
    mobileHero: {
      src: asset("concept-home-mobile-black.png"),
      alt: "Mobile homepage view of the 3A Roofing website concept",
    },
    supporting: [
      {
        src: asset("concept-services-desktop-black.png"),
        alt: "3A Roofing concept page showing specialist roofing services",
      },
      {
        src: asset("concept-feature-section-black.png"),
        alt: "3A Roofing concept page showing project work and heritage roof details",
      },
    ],
  },
  comparison: {
    currentSiteImage: {
      src: asset("current-site-desktop.png"),
      alt: "Current 3A Roofing website homepage captured for this private comparison",
    },
    proposedImage: {
      src: asset("concept-feature-section-black.png"),
      alt: "Proposed 3A Roofing website concept showing selected project work",
    },
    currentLabel: "Current website",
    currentBadge: "As reviewed",
    proposedLabel: "New website concept",
    proposedBadge: "Private concept",
    currentPoints: [
      "The existing website has useful information, but the overall look feels dated against the quality of the work.",
      "Important details such as heritage roofing, conservation knowledge and accreditations can be easier to find.",
      "The pages are text heavy, so visitors have to work harder to see the services, proof and next step.",
    ],
    proposedPoints: [
      "The concept gives heritage roofing and Historic Conservation a stronger first impression.",
      "Services, completed work, testimonials and trust points are easier to scan.",
      "The quote form asks for the useful job details and photos before the first conversation.",
    ],
  },
  findings: [
    {
      title: "The first impression can better match the work",
      description:
        "3A Roofing has strong heritage credentials and serious project proof, but the current website feels dated. The concept gives that experience a more careful, confident presentation.",
    },
    {
      title: "Key strengths should be easier to see",
      description:
        "Historic Conservation knowledge, Heritage Craft Roofer status, NFRC membership, Which? Trusted Trader and the reclaimed materials stockyard are all useful trust points. They should be visible without a visitor digging through several pages.",
    },
    {
      title: "Quote enquiries can start with better information",
      description:
        "A clearer enquiry form can ask about the building, roof type, location, timeframe and photos, helping 3A Roofing understand the job before the first call.",
    },
  ],
  strengths: [
    {
      title: "A strong heritage specialism",
      description:
        "The business has verified experience in heritage tiling, slating and leadwork, supported by Historic Conservation knowledge.",
    },
    {
      title: "Established local roofing company",
      description:
        "3A Roofing has been established since 2003 and is based in Copdock, near Ipswich, serving Suffolk.",
    },
    {
      title: "Useful trust material already exists",
      description:
        "Accreditations, real testimonials, professional-client work and a reclaimed materials stockyard give the website strong content to build around.",
    },
  ],
  improvements: [
    { title: "Looks more professional", description: "A cleaner presentation that better reflects the quality and care behind the roofing work." },
    { title: "Makes the services clear", description: "Heritage roofing, slating, tiling, leadwork, reroofing and professional-client work are easier to understand." },
    { title: "Shows reviews and completed jobs", description: "Testimonials, accreditations and project imagery are brought into the main customer journey." },
    { title: "Works properly on mobile", description: "The important information is easier to read, scan and act on from a phone." },
    { title: "Makes it easy to request a quote", description: "Customers can explain the roof, property and timing, and include useful photos." },
    { title: "Helps local customers find the business", description: "The page structure gives clearer service and Suffolk location signals." },
  ],
  brandDirection: {
    enabled: false,
    heading: "A light refresh that keeps 3A recognisable",
    copy:
      "The concept keeps the existing 3A Roofing identity, including the dark base, white logo and blue accent. The refresh is mainly about spacing, hierarchy, photography and making the strongest trust points easier to see.",
    images: [
      {
        src: "/assets/3a-roofing-wp-000207/3a-roofing-logo-white.png",
        alt: "3A Roofing white logo used in the website concept",
      },
    ],
  },
  package: {
    priceLabel: websitePackageTerms.packagePrice,
    revisionRounds: websitePackageTerms.revisionRounds,
    includedHostingMonths: websitePackageTerms.includedHostingMonths,
    monthlyHostingPrice: websitePackageTerms.monthlyHostingPrice,
    handoverMinutes: websitePackageTerms.handoverMinutes,
    deliveryWorkingDaysMin: websitePackageTerms.estimatedDeliveryWorkingDaysMin,
    deliveryWorkingDaysMax: websitePackageTerms.estimatedDeliveryWorkingDaysMax,
    intro:
      "The website in the walkthrough has already been built as a working concept for 3A Roofing Ltd. For \u00a3399, we'll make the agreed changes, connect your domain and enquiry form, and get the website ready to go live.",
    includedItems: [
      "The 3A Roofing website concept shown in the walkthrough",
      "Desktop, tablet and mobile optimisation",
      "Services, Suffolk coverage and contact details",
      "Project imagery, reviews and trust content",
      "Detailed quote-request form with image uploads",
      "Foundational on-page SEO",
      "Domain connection and launch",
    ],
    paymentSummary: "No payment is taken by clicking. We will confirm the final scope and terms with you first.",
  },
  faq: [
    {
      question: "What happens after the included hosting period?",
      answer: `Managed website hosting and technical support are included for the first ${websitePackageTerms.includedHostingMonths} months from launch. After that, you can continue hosting with T3 Labs for ${websitePackageTerms.monthlyHostingPrice} per month. There is no long-term commitment, and we will contact you before the included period ends.`,
    },
    {
      question: "How many revision rounds are included?",
      answer: `${websitePackageTerms.revisionRounds} consolidated revision round is included. That means one clear list of reasonable changes submitted together.`,
    },
    {
      question: "Can additional pages be added later?",
      answer: `Yes. The ${websitePackageTerms.packagePrice} package covers the website shown in the walkthrough. Extra pages can be scoped and quoted separately if needed.`,
    },
    {
      question: "Can logo or brand-colour changes be included?",
      answer:
        "Small visual refinements can be discussed as part of the agreed changes. A larger brand identity project would be quoted separately.",
    },
    {
      question: "Does this guarantee Google rankings?",
      answer:
        "We'll set up the main on-page SEO basics properly, but no one can honestly promise a certain Google position, amount of traffic or number of enquiries.",
    },
    {
      question: "Can the existing domain be used?",
      answer:
        "Yes. The existing domain can normally be connected once access and the launch plan have been agreed.",
    },
    {
      question: "Who owns the finished website?",
      answer:
        "Ownership and code-transfer terms will be set out clearly in the final package terms before you proceed.",
    },
    {
      question: "What happens after I click the launch button?",
      answer:
        "It records your interest only. No payment is taken. We will confirm the scope, final terms and next steps with you first.",
    },
  ],
  actions: {
    calendlyUrl: "https://calendly.com/insights-t3labs/20-minute-meeting",
  },
  pageCopy: {
    conceptHeading: "The website concept we built for 3A Roofing",
    comparisonHeading: "What you have now vs the new concept",
    comparisonIntro:
      "The current website already contains strong proof, but the new concept makes that proof easier to see, easier to trust and easier to act on.",
    supportingViewsHeading: "Concept views for the homepage, quote form and trust sections",
    supportingViewsNote: "These are screenshots of the private working concept, not a public website.",
    findingsHeading: "Three opportunities we noticed",
    improvementsHeading: "What the new website improves",
    packageLabel: "Straightforward website launch package",
    packageHeading: "Get this website live for",
    packageIntro:
      "The website in the walkthrough has already been built as a working concept for 3A Roofing Ltd. For \u00a3399, we'll make the agreed changes, connect your domain and enquiry form, and get the website ready to go live.",
    launchButtonLabel: "I'm interested in getting this live",
    finalEyebrow: "Next step",
    finalHeading: "Want to get this website live for 3A Roofing Ltd?",
    finalBody:
      "The main build is already done. From here, we'll make the agreed changes, connect everything up and get it ready to launch for \u00a3399.",
  },
  status: "draft",
} satisfies ProposalConfig;
