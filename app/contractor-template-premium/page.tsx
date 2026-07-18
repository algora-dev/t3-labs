import { HomePage, premiumMetadata } from "@/components/premium-contractor/premium-sections";
import { premiumContractorSite } from "@/config/premium-contractor-site";

export const metadata = premiumMetadata(premiumContractorSite.seo.homeTitle, premiumContractorSite.seo.homeDescription);

export default function PremiumContractorHomePage() {
  return <HomePage site={premiumContractorSite} />;
}
