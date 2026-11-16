import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Roofing Quoting, Trade Pricing & Lead Generation Tools | T3 Labs" },
  description:
    "A configurable roofing growth system: product-led quoting, plan measurement, Smart Assistant, trade pricing and business controls in one place.",

  robots: { index: false, follow: false },
  openGraph: {
    title: "Roofing Quoting, Trade Pricing & Lead Generation Tools | T3 Labs",
    description: "See how a configurable roofing toolset can turn website visitors and contractors into better-qualified opportunities.",
    siteName: "T3 Labs",
    type: "website",
  },
};

export default function RoofingBusinessToolsLayout({ children }: { children: ReactNode }) {
  return children;
}
