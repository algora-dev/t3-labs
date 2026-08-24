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
  brand: {
    logo: SiteImage;
    wordmark: SiteImage;
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
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    image: SiteImage;
  };
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
    image?: SiteImage;
  }>;
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
    image?: SiteImage;
    items: string[];
  };
  testimonials: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{
      summary: string;
      source: string;
    }>;
  };
  process: {
    eyebrow: string;
    title: string;
    steps: string[];
  };
  coverage: {
    eyebrow: string;
    title: string;
    description: string;
    areas: string[];
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
