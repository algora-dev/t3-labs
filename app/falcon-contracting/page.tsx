import { ContractorSite, createContractorSiteMetadata } from "@/components/templates/contractor-site";
import { falconContracting } from "@/sites/falcon-contracting-wp-000205/site-config";

export const metadata = createContractorSiteMetadata(falconContracting);

export default function FalconContractingWebsitePage() {
  return <ContractorSite site={falconContracting} />;
}
