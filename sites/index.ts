import { falconContractingProposal } from "./falcon-contracting-wp-000205/proposal-config";
import { aspireMembranesProposal } from "./aspire-membranes-wp-000206/proposal-config";
import { atkinsonBuildingServicesProposal } from "./atkinson-building-services-wp-000208/proposal-config";
import { proposalTemplate } from "./proposal-template-wp-000000/proposal-config";
import type { ProposalConfig } from "./types";

export const sites = {
  [falconContractingProposal.slug]: falconContractingProposal,
  [aspireMembranesProposal.slug]: aspireMembranesProposal,
  [atkinsonBuildingServicesProposal.slug]: atkinsonBuildingServicesProposal,
  [proposalTemplate.slug]: proposalTemplate,
} satisfies Record<string, ProposalConfig>;

export type SiteSlug = keyof typeof sites;
export const siteSlugs = Object.keys(sites) as SiteSlug[];

export function getSite(slug: string): ProposalConfig | undefined {
  return sites[slug as SiteSlug];
}
