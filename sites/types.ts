export type SiteImage = {
  src: string;
  alt: string;
};

// Kept for the archived/restorable concept source. Public proposal routes use ProposalConfig.
export type ProspectSiteConfig = {
  slug: string;
  companyName: string;
  seo: { title: string; description: string };
  brand: { logo: SiteImage; wordmark: SiteImage; colors: { ink: string; paper: string; accent: string } };
  contact: {
    location: string;
    telephone: string;
    telephoneHref: string;
    email: string;
    linkedinUrl: string;
    checkatradeUrl: string;
    socialLinks?: Array<{ label: string; url: string }>;
  };
  navigation: ReadonlyArray<{ label: string; href: string }>;
  mobileNavigation: ReadonlyArray<{ label: string; href: string }>;
  hero: { eyebrow: string; title: string; description: string; image: SiteImage };
  about: { eyebrow: string; title: string; paragraphs: string[] };
  servicesIntro: { eyebrow: string; title: string; description: string };
  services: Array<{ title: string; summary: string; image: SiteImage }>;
  projectsIntro: { eyebrow: string; title: string; description: string };
  projects: Array<SiteImage & { label: string }>;
  whyChoose: { eyebrow: string; title: string; description: string; image?: SiteImage; items: string[] };
  testimonials: { eyebrow: string; title: string; description: string; items: Array<{ summary: string; source: string }> };
  process: { eyebrow: string; title: string; steps: string[] };
  coverage: { eyebrow: string; title: string; description: string; areas: string[] };
  contactSection: { eyebrow: string; title: string; description: string; formStatus: string; generalFormTitle?: string };
  quoteRequest?: {
    eyebrow?: string;
    title?: string;
    helperText?: string;
    projectTypes: string[];
    preferredTimeframes?: string[];
    preferredContactMethods?: string[];
    beforeQuoteOptions?: string[];
    fileLabel?: string;
    fileButtonText?: string;
    fileEmptyText?: string;
  };
  callsToAction: { quote: string; call: string; email: string };
  footer: { location: string; socialLabel: string };
  requiresConfirmation: string[];
};

export type ProposalConfig = {
  slug: string;
  prospectId: string;
  companyName: string;
  contactFirstName: string;
  location?: string;
  existingWebsiteUrl?: string;
  /** Factual website status. The optional comparison object independently controls comparison visibility. */
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
  brandDirection?: {
    enabled: boolean;
    heading?: string;
    copy?: string;
    images?: SiteImage[];
  };
  package: {
    priceLabel: string;
    /** Required commercial summary. The renderer uses pageCopy.packageIntro for prospect-facing override copy. */
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
    /** Visible package introduction. Keep this consistent with package.intro when both are supplied. */
    packageIntro?: string;
    launchButtonLabel?: string;
    finalEyebrow?: string;
    finalHeading?: string;
    finalBody?: string;
  };
  status: "draft" | "active" | "closed" | "expired";
  expiresAt?: string;
};

const unresolvedMarkers = ["[PLACEHOLDER]", "TODO"];

function proposalMediaErrors(proposal: ProposalConfig) {
  const errors: string[] = [];
  const requiredMedia: Array<readonly [string, string | undefined]> = [
    ["walkthrough thumbnail", proposal.video.posterImage.src],
    ["walkthrough video", proposal.video.url],
    ["desktop concept image", proposal.conceptImages.desktopHero.src],
    ["mobile concept image", proposal.conceptImages.mobileHero.src],
    ["feature concept image", proposal.conceptImages.supporting?.[0]?.src],
    ["quote-form concept image", proposal.conceptImages.supporting?.[1]?.src],
  ];

  if (proposal.comparison) {
    requiredMedia.push(
      ["current-site image", proposal.comparison.currentSiteImage?.src],
      ["proposed desktop image", proposal.comparison.proposedImage.src],
      ["tablet concept image", proposal.comparison.proposedSupportingImages?.[0]?.src],
    );

    if (proposal.comparison.proposedImage.src !== proposal.conceptImages.desktopHero.src) {
      errors.push("the proposed comparison image must reuse the desktop concept image");
    }

    if (proposal.comparison.proposedSupportingImages?.[0]?.presentation !== "natural") {
      errors.push("the tablet concept image must use natural presentation");
    }
  }

  for (const [label, value] of requiredMedia) {
    if (!value) errors.push(`${label} is missing`);
    else if (/placeholder|\[.+\]|todo/i.test(value)) errors.push(`${label} still uses a development placeholder`);
  }

  return errors;
}

export function validateProposalForProduction(proposal: ProposalConfig) {
  if (process.env.VERCEL_ENV !== "production") return;
  if (proposal.status !== "active") return;

  const values = [
    proposal.video.url,
    proposal.video.transcriptUrl,
    proposal.package.vatLabel,
    proposal.package.revisionRounds,
    proposal.package.includedHostingMonths,
    proposal.package.monthlyHostingPrice,
    proposal.package.ownershipSummary,
    proposal.package.domainProcessSummary,
    proposal.actions.launchActionUrl,
    proposal.actions.removalUrl,
  ];
  const hasUnresolvedValue = values.some(
    (value) =>
      value === undefined ||
      value === "" ||
      (typeof value === "string" && unresolvedMarkers.some((marker) => value.includes(marker))),
  );
  const hasDevelopmentPlaceholder = /placeholder|todo|\[[A-Z][A-Z\s_-]+\]/i.test(JSON.stringify(proposal));

  const mediaErrors = proposalMediaErrors(proposal);
  const strengthsAreInvalid =
    (proposal.strengths?.length ?? 0) > 3 ||
    proposal.strengths?.some((strength) => !strength.title.trim() || !strength.description.trim());

  if (hasUnresolvedValue || hasDevelopmentPlaceholder || mediaErrors.length || strengthsAreInvalid) {
    const details = [
      hasUnresolvedValue ? "complete the video, transcript, commercial terms, launch action and removal workflow" : "",
      hasDevelopmentPlaceholder ? "remove all development placeholders" : "",
      ...mediaErrors,
      strengthsAreInvalid ? "strengths must contain one to three complete, verified entries" : "",
    ].filter(Boolean);

    throw new Error(
      `Proposal ${proposal.prospectId} is not ready for production: ${details.join("; ")}.`,
    );
  }
}
