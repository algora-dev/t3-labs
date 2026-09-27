import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Ballpark Pricing Calculator | Custom Tools, Smart Assistants & Websites | T3 Labs" },
  description:
    "Pick the tools you want, choose the complexity of each, and get an honest ballpark price range in under two minutes. Pricing calculators, Smart Assistants, admin dashboards and websites.",
  alternates: { canonical: "https://www.t3labs.tech/pricing-calculator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Ballpark Pricing Calculator | T3 Labs",
    description:
      "Build your own ballpark: pick the tools, choose the complexity, watch the price range update. No contact details needed.",
    siteName: "T3 Labs",
    type: "website",
  },
};

export default function PricingCalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}
