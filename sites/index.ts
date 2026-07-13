import { falconContracting } from "./falcon-contracting-wp-000205/site-config";
import { t3LabsWebsiteTemplate } from "./t3labs-website-template-1993/site-config";
import type { ProspectSiteConfig } from "./types";

export const sites = {
  [falconContracting.slug]: falconContracting,
  [t3LabsWebsiteTemplate.slug]: t3LabsWebsiteTemplate,
} satisfies Record<string, ProspectSiteConfig>;
export type SiteSlug = keyof typeof sites;
export const siteSlugs = Object.keys(sites) as SiteSlug[];
export function getSite(slug: string): ProspectSiteConfig | undefined { return sites[slug as SiteSlug]; }
