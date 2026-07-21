import { premiumMetadata, ServicesPage } from "@/components/premium-contractor/premium-sections";
import { threeARoofingPremiumSite } from "@/config/3a-roofing-premium-site";

const path = `${threeARoofingPremiumSite.basePath}/services`;

export const metadata = premiumMetadata(
  threeARoofingPremiumSite.seo.servicesTitle,
  threeARoofingPremiumSite.seo.servicesDescription,
  path,
  threeARoofingPremiumSite.services[0].image,
);

export default function ThreeARoofingServicesPage() {
  return <ServicesPage site={threeARoofingPremiumSite} />;
}
