import type { Metadata } from "next";
import type { ReactNode } from "react";
import { premiumContractorSite } from "@/config/premium-contractor-site";
import { PremiumSiteFrame } from "@/components/premium-contractor/premium-sections";

export const metadata: Metadata = { metadataBase: new URL("https://www.t3labs.tech") };

export default function PremiumContractorLayout({ children }: { children: ReactNode }) {
  return <PremiumSiteFrame site={premiumContractorSite}>{children}</PremiumSiteFrame>;
}
