import type { Metadata } from "next";
import type { ReactNode } from "react";

const TITLE = "Roofing Customer Tools & Smart Assistant | T3 Labs";
const DESCRIPTION =
  "See how T3 Labs turns a roofing website into a place customers can measure, price and prepare enquiries — using your products and rules.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "https://www.t3labs.tech/roofing-solutions" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "T3 Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RoofingSolutionsLayout({ children }: { children: ReactNode }) {
  return children;
}
