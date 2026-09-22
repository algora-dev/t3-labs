import type { Metadata } from "next";
import type { ReactNode } from "react";

const TITLE = "Roofing Customer Tools & Smart Assistant | T3 Labs";
const DESCRIPTION =
  "A representative-shared view of configurable roofing pricing, estimating, customer and Smart Assistant tools from T3 Labs.";

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
