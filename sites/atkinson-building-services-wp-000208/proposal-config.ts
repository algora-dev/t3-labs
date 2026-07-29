import { websitePackageTerms } from "@/lib/website-package-terms";
import type { ProposalConfig } from "../types";

const asset = (name: string) => `/assets/atkinson-building-services-wp-000208/${name}`;

export const atkinsonBuildingServicesProposal = {
  slug: "atkinson-building-services-wp-000208",
  prospectId: "WP-000208",
  companyName: "Atkinson Building Services",
  contactFirstName: "Dale",
  location: "Glasgow and central Scotland",
  existingWebsiteUrl: "http://weareabs.co.uk/",
  hasExistingWebsite: true,
  seo: {
    title: "Atkinson Building Services - Private Website Concept | T3 Labs",
    description: "A private website concept prepared for Atkinson Building Services by T3 Labs.",
  },
  hero: {
    overline: "A private website concept for",
    headline: "Hi Dale, we had a look at how Atkinson Building Services currently appears online.",
    supportingCopy:
      "We built a private website concept to show you what we think would work better. In the quick video, I’ll walk you through what we’ve made, why we’ve made it this way, and how it could help people quickly see what you do, trust the business and get in touch.",
    privacyNote: "This is a private concept and is not publicly listed.",
  },
  video: {
    provider: "self-hosted",
    url: asset("video-for-proposal.mp4"),
    posterImage: {
      src: asset("video-thumbnail-attached.png"),
      alt: "Thumbnail for the Atkinson Building Services website concept walkthrough",
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
      src: asset("concept-desktop.png"),
      alt: "Desktop homepage view of the Atkinson Building Services concept",
    },
    mobileHero: {
      src: asset("concept-mobile.png"),
      alt: "Mobile homepage view of the Atkinson Building Services concept",
    },
    supporting: [
      {
        src: asset("concept-quote-form.png"),
        alt: "Detailed Atkinson Building Services quote request form concept",
      },
      {
        src: asset("concept-projects.png"),
        alt: "Atkinson Building Services completed work and services concept sections",
      },
    ],
  },
  comparison: {
    currentSiteImage: {
      src: asset("current-site.png"),
      alt: "Current Atkinson Building Services website homepage captured for this private comparison",
    },
    proposedImage: {
      src: asset("concept-desktop.png"),
      alt: "Proposed Atkinson Building Services website concept on desktop",
    },
    proposedSupportingImages: [
      {
        src: asset("concept-why-reviews.png"),
        alt: "Proposed Atkinson Building Services why choose us and Trustpilot review sections",
        presentation: "natural",
      },
    ],
    currentPoints: [
      "The current presentation feels dated compared with the quality of the work and the established business behind it.",
      "The current website link does not always load reliably, which can interrupt a prospective customer's journey.",
      "Workmanship, customer feedback and the breadth of services could be brought forward more clearly.",
    ],
    proposedPoints: [
      "A cleaner, more professional presentation built around Atkinson's existing identity.",
      "Genuine project photography and customer feedback made easier to find.",
      "A straightforward quote form covering the job, location, timing and project details.",
    ],
  },
  findings: [
    {
      title: "The online presentation can better reflect the workmanship",
      description:
        "Atkinson's current site feels dated beside the standard of the completed kitchens, bathrooms, roofing and building work shown in its project material.",
    },
    {
      title: "The customer journey should be more dependable",
      description:
        "A website link that does not always load can lose attention before a customer reaches the services, reviews or contact details.",
    },
    {
      title: "Reviews and completed work can build trust sooner",
      description:
        "Bringing genuine project photography and customer feedback into the main journey gives visitors stronger reasons to make contact.",
    },
  ],
  strengths: [
    {
      title: "An established local business",
      description: "More than 25 years in the sector gives customers a clear reason to feel confident in the team.",
    },
    {
      title: "A strong range of completed work",
      description: "The project material shows solid work across kitchens, bathrooms, roofing and wider building projects.",
    },
    {
      title: "Good customer feedback and recognisable branding",
      description: "Positive reviews, genuine project photos and clearly branded vehicles already give Atkinson useful trust signals.",
    },
  ],
  improvements: [
    { title: "Looks more professional", description: "A stronger first impression that better reflects the standard of Atkinson's work." },
    { title: "Makes the services clear", description: "Customers can quickly understand the building work Atkinson provides." },
    { title: "Shows reviews and completed jobs", description: "Real work and customer feedback are easy to find before someone gets in touch." },
    { title: "Works properly on mobile", description: "The website stays clear and easy to use when customers browse on their phone." },
    { title: "Makes it easy to request a quote", description: "A simple form collects the useful job details from the start." },
    { title: "Helps local customers find the business", description: "Services, Glasgow and the areas covered are clearly explained." },
  ],
  package: {
    priceLabel: websitePackageTerms.packagePrice,
    revisionRounds: websitePackageTerms.revisionRounds,
    includedHostingMonths: websitePackageTerms.includedHostingMonths,
    monthlyHostingPrice: websitePackageTerms.monthlyHostingPrice,
    handoverMinutes: websitePackageTerms.handoverMinutes,
    deliveryWorkingDaysMin: websitePackageTerms.estimatedDeliveryWorkingDaysMin,
    deliveryWorkingDaysMax: websitePackageTerms.estimatedDeliveryWorkingDaysMax,
    ownershipSummary:
      "After full payment, Atkinson retains its supplied material and receives the agreed rights to the customer-specific website output, subject to T3 Labs' reusable components and third-party licences.",
    domainProcessSummary:
      "Atkinson should continue to own and control its domain. T3 Labs can connect or configure it with permission once the required access and launch plan are agreed.",
    intro:
      "The website in the walkthrough has already been built as a working concept for Atkinson Building Services. For £399, we’ll make the agreed changes, connect your domain and enquiry form, and get the website ready to go live.",
    includedItems: [
      "The one-page Atkinson Building Services website shown",
      "Desktop, tablet and mobile optimisation",
      "Services, Glasgow location and central Scotland coverage",
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
      answer: `Managed website hosting and technical support are included for the first ${websitePackageTerms.includedHostingMonths} months from launch. After that, Atkinson can continue with T3 Labs for ${websitePackageTerms.monthlyHostingPrice} per month. There is no long-term commitment, and the monthly service starts only after you agree to continue.`,
    },
    {
      question: "How many revision rounds are included?",
      answer: `${websitePackageTerms.revisionRounds} consolidated revision round is included. This means one complete list of reasonable changes submitted together.`,
    },
    {
      question: "Can additional pages be added later?",
      answer: `Yes. The ${websitePackageTerms.packagePrice} package covers the one-page website shown in the walkthrough. Additional pages can be scoped and quoted separately.`,
    },
    {
      question: "Can logo or brand-colour changes be included?",
      answer: "Reasonable refinements to the existing logo treatment and brand colours can be discussed within the agreed revision round. A larger identity project would be scoped separately.",
    },
    {
      question: "Does this guarantee Google rankings?",
      answer: "No. We’ll set up the main on-page SEO basics properly, but no one can honestly promise a certain Google position, amount of traffic or number of enquiries.",
    },
    {
      question: "Can the existing domain be used?",
      answer: "Yes. Atkinson should continue to own and control the existing domain. T3 Labs can connect or configure it once access and the launch plan have been agreed.",
    },
    {
      question: "Who owns the finished website?",
      answer: "Atkinson retains ownership of the material it supplies. After full payment, it receives the agreed rights to the customer-specific website output, while T3 Labs retains its reusable templates, components and development systems. A deployable copy can be requested under the final terms.",
    },
    {
      question: "What happens after I click the launch button?",
      answer: "Clicking records interest only. No payment is taken and no binding order is created. T3 Labs will confirm the scope, terms and payment schedule before work begins.",
    },
  ],
  actions: {
    calendlyUrl: "https://calendly.com/cece-t3labs/20min",
    launchEmailUrl:
      "mailto:insights@t3labs.co.uk?subject=Atkinson%20Building%20Services%20website%20launch&body=Hi%20T3%20Labs%2C%0A%0AI%27d%20like%20to%20discuss%20launching%20the%20Atkinson%20Building%20Services%20website%20concept.%0A",
  },
  pageCopy: {
    conceptHeading: "Take a closer look at the Atkinson website concept",
    comparisonHeading: "What you have now vs the new concept",
    comparisonIntro:
      "A fair comparison between the existing public website and the private concept created to present Atkinson's workmanship, services and customer proof more clearly.",
    supportingViewsHeading: "Completed work and a clearer quote form",
    supportingViewsNote: "Private concept views, not a public website.",
    findingsHeading: "Three opportunities we noticed",
    improvementsHeading: "What the new website improves",
    packageLabel: "Website launch package",
    packageHeading: "Get this website live for",
    packageIntro:
      "The website in the walkthrough has already been built as a working concept for Atkinson Building Services. For £399, we’ll make the agreed changes, connect your domain and enquiry form, and get the website ready to go live.",
    launchButtonLabel: "I’m interested in getting this live",
    finalEyebrow: "Your next step",
    finalHeading: "Want to get this website live for Atkinson Building Services?",
    finalBody:
      "The main build is already done. From here, we’ll make the agreed changes, connect everything up and get it ready to launch for £399.",
  },
  status: "draft",
} satisfies ProposalConfig;
