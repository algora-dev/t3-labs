import type { Metadata } from "next";
import type { ReactNode } from "react";

// Optional route layout for the rep-shared version.
// noindex is not authentication or referral attribution protection.
// For a separate public acquisition page, set indexing/canonical metadata deliberately.
export const metadata: Metadata = {
  title: { absolute: "Roofing Pricing, Quoting & Sales Tools | T3 Labs" },
  description: "Roofing tools built around your products, pricing and workflow. Help customers get answers and give your team better-prepared enquiries.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "What if your website could do more of the quoting work?",
    description: "For roofing manufacturers, suppliers and supply-and-install businesses. Explore a focused solution built around how you work.",
    siteName: "T3 Labs",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Roofing Pricing, Quoting & Sales Tools | T3 Labs",
    description: "Your products. Your pricing. A clearer path from question to quote.",
  },
};

export default function RoofingLayout({ children }: { children: ReactNode }) {
  return children;
}
