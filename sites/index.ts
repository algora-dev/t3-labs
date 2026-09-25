import { sunflowGrowthProposal } from "./sunflow-solar/growth-config";
import { everestTrayGrowthProposal } from "./everest-tray/growth-config";
import type { AnyProposalConfig, GrowthProposalConfig, ProposalConfig } from "./types";

/**
 * Client micro-demo proposal pages were retired 2026-09-25.
 * Text-led growth proposals remain below.
 */
export const sites: Record<string, ProposalConfig> = {};

export type SiteSlug = keyof typeof sites;
export const siteSlugs = Object.keys(sites) as SiteSlug[];

/** Text-led growth proposals (GrowthProposalConfig / growth-proposal-page.tsx). */
export const growthSites = {
  [sunflowGrowthProposal.slug]: sunflowGrowthProposal,
  [everestTrayGrowthProposal.slug]: everestTrayGrowthProposal,
} satisfies Record<string, GrowthProposalConfig>;

export type GrowthSiteSlug = keyof typeof growthSites;
export const growthSiteSlugs = Object.keys(growthSites) as GrowthSiteSlug[];

export function getGrowthSite(slug: string): GrowthProposalConfig | undefined {
  return growthSites[slug as GrowthSiteSlug];
}

export function getAnySite(slug: string): AnyProposalConfig | undefined {
  return getSite(slug) ?? getGrowthSite(slug);
}

export function getSite(slug: string): ProposalConfig | undefined {
  return sites[slug as SiteSlug];
}
