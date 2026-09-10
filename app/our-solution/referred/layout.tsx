import type { Metadata } from "next";
import type { ReactNode } from "react";

const TITLE = "Construction Sales, Pricing & Customer Tools | T3 Labs";
const DESCRIPTION =
  "See how T3 Labs builds custom pricing, estimating, customer and sales tools for construction businesses.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
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

export default function ReferredSolutionLayout({ children }: { children: ReactNode }) {
  return children;
}
