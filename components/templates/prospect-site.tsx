import { ProposalPage } from "@/components/templates/proposal-page";
import { ShortProposalPage } from "@/components/templates/short-proposal-page";
import type { ProposalConfig } from "@/sites/types";

export function ProspectSite({ site }: { site: ProposalConfig }) {
  if (site.layout === "short") return <ShortProposalPage proposal={site} />;
  return <ProposalPage proposal={site} />;
}
