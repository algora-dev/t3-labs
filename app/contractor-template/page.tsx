import { ContractorSite, createContractorSiteMetadata } from "@/components/templates/contractor-site";
import { contractorTemplate } from "@/sites/contractor-template/site-config";

export const metadata = createContractorSiteMetadata(contractorTemplate);

export default function ContractorTemplatePage() {
  return <ContractorSite site={contractorTemplate} />;
}
