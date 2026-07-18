import { HomePage, premiumMetadata } from "@/components/premium-contractor/premium-sections";
import { threeARoofingPremiumSite } from "@/config/3a-roofing-premium-site";

export const metadata = premiumMetadata(
  threeARoofingPremiumSite.seo.homeTitle,
  threeARoofingPremiumSite.seo.homeDescription,
  threeARoofingPremiumSite.basePath,
  threeARoofingPremiumSite.hero.image,
);

export default function ThreeARoofingHomePage() {
  return <HomePage site={threeARoofingPremiumSite} />;
}
