import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Ballpark Pricing Calculator | Custom Tools, Smart Assistants & Websites | T3 Labs" },
  description:
    "Choose the T3 Labs tools you want, select the closest capability level, and see an indicative one-off setup ballpark instantly. Measurement-to-price tools, Smart Assistants, admin dashboards and websites.",
  alternates: { canonical: "https://www.t3labs.tech/pricing-calculator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Ballpark Pricing Calculator | T3 Labs",
    description:
      "Build your own ballpark: choose the tools, pick the closest capability level, and watch the indicative one-off setup range update instantly. No contact details needed.",
    siteName: "T3 Labs",
    type: "website",
  },
};

export default function PricingCalculatorLayout({ children }: { children: ReactNode }) {
  return children;
}
