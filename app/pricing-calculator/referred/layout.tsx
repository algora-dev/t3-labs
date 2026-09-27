import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Ballpark Pricing | T3 Labs" },
  description:
    "A shared ballpark view of T3 Labs tool, assistant, admin and website pricing. Continue with the person who shared this page.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function PricingCalculatorReferredLayout({ children }: { children: ReactNode }) {
  return children;
}
