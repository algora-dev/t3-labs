export type SiteImage = { src: string; alt: string };

export type ProposalConfig = {
  slug: string;
  prospectId: string;
  companyName: string;
  contactFirstName: string;
  location?: string;
  existingWebsiteUrl?: string;
  hasExistingWebsite: boolean;
  seo: {
    title: string;
    description: string;
  };
  hero: {
    overline: string;
    headline: string;
    supportingCopy: string;
    privacyNote: string;
  };
  video: {
    provider: "loom" | "vimeo" | "youtube" | "self-hosted";
    url?: string;
    posterImage: SiteImage;
    durationLabel?: string;
    transcriptUrl?: string;
  };
  outcomes: string[];
  conceptImages: {
    desktopHero: SiteImage;
    mobileHero: SiteImage;
    supporting?: SiteImage[];
  };
  comparison?: {
    currentSiteImage?: SiteImage;
    proposedImage: SiteImage;
    currentLabel?: string;
    currentBadge?: string;
    proposedLabel?: string;
    proposedBadge?: string;
    proposedSupportingImages?: Array<SiteImage & { presentation?: "portrait" | "natural" }>;
    currentPoints: string[];
    proposedPoints: string[];
  };
  findings: Array<{
    title: string;
    description: string;
  }>;
  strengths?: Array<{
    title: string;
    description: string;
  }>;
  improvements: Array<{
    title: string;
    description: string;
  }>;
  package: {
    priceLabel: string;
    intro: string;
    includedItems: string[];
    vatLabel?: string;
    validityNote?: string;
    revisionRounds?: number;
    includedHostingMonths?: number;
    monthlyHostingPrice?: string;
    annualHostingPrice?: string;
    handoverMinutes?: number;
    deliveryWorkingDaysMin?: number;
    deliveryWorkingDaysMax?: number;
    ownershipSummary?: string;
    domainProcessSummary?: string;
    paymentSummary: string;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  actions: {
    calendlyUrl: string;
    launchActionUrl?: string;
    launchEmailUrl?: string;
    interactivePreviewRequestUrl?: string;
    removalUrl?: string;
  };
  pageCopy?: {
    conceptHeading?: string;
    comparisonHeading?: string;
    comparisonIntro?: string;
    supportingViewsHeading?: string;
    supportingViewsNote?: string;
    findingsHeading?: string;
    improvementsHeading?: string;
    packageLabel?: string;
    packageHeading?: string;
    packageIntro?: string;
    launchButtonLabel?: string;
    finalEyebrow?: string;
    finalHeading?: string;
    finalBody?: string;
  };
  status: "draft" | "active" | "closed" | "expired";
  expiresAt?: string;
};
