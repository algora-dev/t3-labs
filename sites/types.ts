export type SiteImage = { src: string; alt: string };

export type ProspectSiteConfig = {
  slug: string;
  companyName: string;
  seo: { title: string; description: string };
  brand: { logo: SiteImage; wordmark: SiteImage; colors: { ink: string; paper: string; accent: string } };
  contact: { location: string; telephone: string; telephoneHref: string; email: string; linkedinUrl: string; checkatradeUrl: string };
  navigation: ReadonlyArray<{ label: string; href: string }>;
  mobileNavigation: ReadonlyArray<{ label: string; href: string }>;
  hero: { eyebrow: string; title: string; description: string; image: SiteImage };
  about: { eyebrow: string; title: string; paragraphs: string[] };
  servicesIntro: { eyebrow: string; title: string; description: string };
  services: Array<{ title: string; summary: string; image: SiteImage }>;
  projectsIntro: { eyebrow: string; title: string; description: string };
  projects: Array<SiteImage & { label: string }>;
  whyChoose: { eyebrow: string; title: string; description: string; items: string[] };
  testimonials: { eyebrow: string; title: string; description: string; items: Array<{ summary: string; source: string }> };
  process: { eyebrow: string; title: string; steps: string[] };
  coverage: { eyebrow: string; title: string; description: string; areas: string[] };
  contactSection: { eyebrow: string; title: string; description: string; formStatus: string };
  callsToAction: { quote: string; call: string; email: string };
  footer: { location: string; socialLabel: string };
  requiresConfirmation: string[];
};
