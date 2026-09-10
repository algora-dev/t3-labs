import type { Metadata } from "next";
import type { ReactNode } from "react";

const BASE_URL = "https://www.t3labs.tech";
const TITLE = "Digital Sales & Pricing Tools for Construction Suppliers | T3 Labs";
const DESCRIPTION =
  "T3 Labs builds pricing, estimating, quoting and online sales tools for construction suppliers — helping customers get answers faster and reducing manual sales work.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${BASE_URL}/our-solution` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/our-solution`,
    siteName: "T3 Labs",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function OurSolutionLayout({ children }: { children: ReactNode }) {
  return children;
}
