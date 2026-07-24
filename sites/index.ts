import { blenheimRoofing } from "./blenheim-roofing-wp-000209/site-config";
import { aspireMembranes } from "./aspire-membranes-wp-000206/site-config";
import { falconContracting } from "./falcon-contracting-wp-000205/site-config";
import type { ProspectSiteConfig } from "./types";

export const sites = {
  [blenheimRoofing.slug]: blenheimRoofing,
  [aspireMembranes.slug]: aspireMembranes,
  [falconContracting.slug]: falconContracting,
} satisfies Record<string, ProspectSiteConfig>;
export type SiteSlug = keyof typeof sites;
export const siteSlugs = Object.keys(sites) as SiteSlug[];
export function getSite(slug: string): ProspectSiteConfig | undefined { return sites[slug as SiteSlug]; }
