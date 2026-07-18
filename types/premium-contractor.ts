export type PremiumImage = {
  src: string;
  alt: string;
};

export type PremiumService = {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  image?: PremiumImage;
  projectTypes: string[];
  inclusions: string[];
  benefits: string[];
  projectExample?: string;
};

export type PremiumContractorConfig = {
  basePath: string;
  company: {
    name: string;
    shortName: string;
    legalName: string;
    tagline: string;
    description: string;
    logo: PremiumImage;
    logoLight: PremiumImage;
  };
  branding: {
    primaryColour: string;
    accentColour: string;
    accentLightColour: string;
    heroAccentColour: string;
    backgroundColour: string;
    textColour: string;
    mutedColour: string;
  };
  contact: {
    phone: string;
    phoneHref: string;
    email: string;
    address: string;
    openingHours: string;
    whatsapp?: string;
  };
  navigation: {
    showServices: boolean;
    showQuote: boolean;
    showProjects: boolean;
    showProcess: boolean;
  };
  hero: {
    eyebrow: string;
    heading: string;
    supportingText: string;
    image: PremiumImage;
    primaryCta: string;
    secondaryCta: string;
    credibilityNote: string;
  };
  introduction: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    image: PremiumImage;
  };
  trustItems: Array<{ title: string; supportingText: string }>;
  services: PremiumService[];
  projects: Array<{
    title: string;
    location?: string;
    category?: string;
    description?: string;
    image: PremiumImage;
    featured?: boolean;
  }>;
  reasons: Array<{ title: string; description: string }>;
  process: Array<{ step: string; title: string; description: string }>;
  reviews: Array<{
    quote: string;
    customerName?: string;
    customerLocation?: string;
    projectType?: string;
  }>;
  serviceAreas: string[];
  socialLinks: Array<{ label: string; url: string }>;
  residentialCommercial: {
    residential: { title: string; description: string; points: string[] };
    commercial: { title: string; description: string; points: string[] };
  };
  faqs: Array<{ question: string; answer: string }>;
  quoteFaqs: Array<{ question: string; answer: string }>;
  quote: {
    eyebrow: string;
    heading: string;
    introduction: string;
    nextStep: string;
    photoNote: string;
    preferredTimeframes: string[];
    preferredContactMethods: string[];
    propertyTypes: string[];
    consentLabel: string;
    demonstrationNote: string;
  };
  callout: {
    eyebrow: string;
    heading: string;
    description: string;
    note: string;
  };
  presentation: {
    servicesPreview: { eyebrow: string; heading: string; description: string };
    projects: { eyebrow: string; heading: string; description: string };
    reasons: { eyebrow: string; heading: string; description: string };
    process: { eyebrow: string; heading: string };
    reviews: { eyebrow: string; heading: string; description: string };
    serviceAreas: { eyebrow: string; heading: string; description: string };
    servicesHero: { eyebrow: string; heading: string; description: string };
    capability: { eyebrow: string; heading: string };
    servicesProcess: { eyebrow: string; heading: string; description: string };
    relatedProjects: { eyebrow: string; heading: string };
    footerNote: string;
    footerLegalItems: string[];
  };
  visibility: {
    trustStrip: boolean;
    projects: boolean;
    reviews: boolean;
    serviceAreas: boolean;
    commercialResidentialSplit: boolean;
    whatsapp: boolean;
  };
  seo: {
    homeTitle: string;
    homeDescription: string;
    servicesTitle: string;
    servicesDescription: string;
    quoteTitle: string;
    quoteDescription: string;
  };
};
