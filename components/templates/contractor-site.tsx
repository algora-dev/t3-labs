import type { Metadata } from "next";
import { Contact, Feedback, Footer, Header, Hero, Intro, MobileActions, ProcessAndAreas, Projects, Services, WhyChoose } from "@/app/components";
import type { ProspectSiteConfig } from "@/sites/types";

export function createContractorSiteMetadata(site: ProspectSiteConfig): Metadata {
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

export function ContractorSite({ site }: { site: ProspectSiteConfig }) {
  return (
    <>
      <Header site={site} />
      <main>
        <Hero site={site} />
        <Intro site={site} />
        <Services site={site} />
        <Projects site={site} />
        <WhyChoose site={site} />
        <Feedback site={site} />
        <ProcessAndAreas site={site} />
        <Contact site={site} />
      </main>
      <Footer site={site} />
      <MobileActions site={site} />
    </>
  );
}
