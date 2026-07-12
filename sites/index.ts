import { falconContracting } from "./falcon-contracting/site-config";
import type { ProspectSiteConfig } from "./types";

export const sites = { [falconContracting.slug]: falconContracting } satisfies Record<string, ProspectSiteConfig>;
export type SiteSlug = keyof typeof sites;
export const siteSlugs = Object.keys(sites) as SiteSlug[];
export function getSite(slug: string): ProspectSiteConfig | undefined { return sites[slug as SiteSlug]; }
