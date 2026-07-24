import { blenheimRoofingProposal } from "./blenheim-roofing-wp-000209/proposal-config";
import type { ProposalConfig } from "./proposal-types";

export const proposals = {
  [blenheimRoofingProposal.slug]: blenheimRoofingProposal,
} satisfies Record<string, ProposalConfig>;

export type ProposalSlug = keyof typeof proposals;
export const proposalSlugs = Object.keys(proposals) as ProposalSlug[];

export function getProposal(slug: string): ProposalConfig | undefined {
  return proposals[slug as ProposalSlug];
}
