import type { Metadata } from "next";
import pages from "@/components/t3-phase3/problem-pages.json";

export const ROOFING_SERVICE_SLUGS = [
  "roofing-website-design", "roofing-seo", "roofing-website-estimators",
  "roofing-quoting-software", "roofing-ai-website-assistants", "roofing-business-automation",
] as const;
export type RoofingServiceSlug = (typeof ROOFING_SERVICE_SLUGS)[number];
export const SERVICE_KEY_TO_SLUG: Record<string, RoofingServiceSlug> = {
  website: "roofing-website-design", seo: "roofing-seo", estimator: "roofing-website-estimators",
  quoting: "roofing-quoting-software", assistant: "roofing-ai-website-assistants",
  automation: "roofing-business-automation",
};
export const CANONICAL_ORIGIN = "https://www.t3labs.tech";

/** Metadata lives in the same reviewed JSON record used for the visible service copy. */
export function roofingServiceMetadata(slug: RoofingServiceSlug): Metadata {
  const service = pages[slug];
  const url = `${CANONICAL_ORIGIN}/${slug}`;
  return {
    title: { absolute: service.metaTitle },
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: service.metaTitle, description: service.metaDescription,
      type: "website", url,
      images: [{ url: "/og-roofing.png", width: 1200, height: 630, alt: "T3 Labs – better roofing leads, faster quotes, less admin" }],
    },
  };
}
