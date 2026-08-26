import type { Metadata } from "next";
import type { CSSProperties } from "react";
import {
  Contact,
  Coverage,
  EstimateToolSection,
  Feedback,
  FinalCta,
  Footer,
  Gallery,
  Header,
  Hero,
  MobileActions,
  Process,
  Projects,
  Services,
  TrustStrip,
  WhyChoose,
} from "./site-sections";
import type { ActRoofingSiteConfig } from "./types";

export function createActRoofingMetadata(site: ActRoofingSiteConfig): Metadata {
  return {
    title: site.seo.title,
    description: site.seo.description,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
  };
}

export function ActRoofingSite({ site }: { site: ActRoofingSiteConfig }) {
  const brandStyle = {
    "--brand-ink": site.brand.colors.ink,
    "--brand-paper": site.brand.colors.paper,
    "--brand-accent": site.brand.colors.accent,
  } as CSSProperties;

  return (
    <div className="contractor-site" style={brandStyle}>
      <Header site={site} />
      <main>
        <Hero site={site} />
        <TrustStrip site={site} />
        <Services site={site} />
        <EstimateToolSection site={site} />
        <Projects site={site} />
        <WhyChoose site={site} />
        <Feedback site={site} />
        <Process site={site} />
        <Gallery site={site} />
        <Coverage site={site} />
        <FinalCta site={site} />
        <Contact site={site} />
      </main>
      <Footer site={site} />
      <MobileActions site={site} />
    </div>
  );
}
