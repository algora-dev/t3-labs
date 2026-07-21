import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PremiumSiteFrame } from "@/components/premium-contractor/premium-sections";
import { threeARoofingPremiumSite } from "@/config/3a-roofing-premium-site";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.t3labs.tech"),
  robots: { index: false, follow: false },
};

export default function ThreeARoofingLayout({ children }: { children: ReactNode }) {
  return <PremiumSiteFrame site={threeARoofingPremiumSite}>{children}</PremiumSiteFrame>;
}
