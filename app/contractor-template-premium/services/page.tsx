import { premiumMetadata, ServicesPage } from "@/components/premium-contractor/premium-sections";
import { premiumContractorSite } from "@/config/premium-contractor-site";

export const metadata = premiumMetadata(premiumContractorSite.seo.servicesTitle, premiumContractorSite.seo.servicesDescription, "/contractor-template-premium/services");

export default function PremiumContractorServicesPage() {
  return <ServicesPage site={premiumContractorSite} />;
}
