import type { CSSProperties } from "react";
import { Contact, Feedback, Footer, Header, Hero, Intro, MobileActions, ProcessAndAreas, Projects, Services, TrustStrip, WhyChoose } from "@/app/components";
import type { ProspectSiteConfig } from "@/sites/types";

export function ProspectSite({ site }: { site: ProspectSiteConfig }) {
  const theme = {
    "--site-ink": site.brand.colors.ink,
    "--site-paper": site.brand.colors.paper,
    "--site-accent": site.brand.colors.accent,
  } as CSSProperties;

  return <div style={theme}><Header site={site} /><main><Hero site={site} /><TrustStrip site={site} /><Intro site={site} /><Services site={site} /><Projects site={site} /><WhyChoose site={site} /><Feedback site={site} /><ProcessAndAreas site={site} /><Contact site={site} /></main><Footer site={site} /><MobileActions site={site} /></div>;
}
