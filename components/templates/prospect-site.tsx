import { ProposalPage } from "@/components/templates/proposal-page";
import type { ProposalConfig } from "@/sites/types";

export function ProspectSite({ site }: { site: ProposalConfig }) {
  return <ProposalPage proposal={site} />;
}
