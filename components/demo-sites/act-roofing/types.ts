export type SiteImage = {
  src: string;
  alt: string;
};

export type ActRoofingSiteConfig = {
  companyName: string;
  seo: {
    title: string;
    description: string;
  };
  /** Small unobtrusive demonstration notice shown near reviews and in the footer. */
  demoDisclaimer: string;
  brand: {
    logo: SiteImage;
    wordmark: SiteImage;
    logoMark: SiteImage;
    colors: {
      ink: string;
      paper: string;
      accent: string;
    };
  };
  contact: {
    location: string;
    telephone: string;
    telephoneHref: string;
    email: string;
    socialLinks: Array<{ label: string; url: string }>;
  };
  navigation: ReadonlyArray<{ label: string; href: string }>;
  mobileNavigation: ReadonlyArray<{ label: string; href: string }>;
  featuredReview?: {
    summary: string;
    source: string;
    rating: number;
  };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    image: SiteImage;
    secondaryCta?: {
      label: string;
      href: string;
    };
  };
  trustStrip: ReadonlyArray<{ label: string }>;
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  servicesIntro: {
    eyebrow: string;
    title: string;
    description: string;
  };
  services: Array<{
    title: string;
    summary: string;
    linkLabel?: string;
    image?: SiteImage;
  }>;
  estimateTool: {
    eyebrow: string;
    title: string;
    description: string;
    benefits: string[];
    ctaLabel: string;
    ctaHref: string;
    previewSteps: Array<{ label: string; hint?: string }>;
    previewNote: string;
  };
  projectsIntro: {
    eyebrow: string;
    title: string;
    description: string;
  };
  projects: Array<SiteImage & { label: string }>;
  whyChoose: {
    eyebrow: string;
    title: string;
    description: string;
    items: string[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{
      summary: string;
      source: string;
      rating: number;
    }>;
  };
  process: {
    eyebrow: string;
    title: string;
    steps: Array<{ title: string; description: string }>;
  };
  gallery: {
    title: string;
    items: SiteImage[];
  };
  coverage: {
    eyebrow: string;
    title: string;
    description: string;
    areas: string[];
  };
  finalCta: {
    title: string;
    description: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  contactSection: {
    eyebrow: string;
    title: string;
    description: string;
    formStatus: string;
    generalFormTitle?: string;
  };
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
  callsToAction: {
    estimate: string;
    quote: string;
    call: string;
    email: string;
  };
  footer: {
    location: string;
  };
  quoteModal?: {
    toolTitle: string;
    toolDescription: string;
    formTitle: string;
    formDescription: string;
  };
};
