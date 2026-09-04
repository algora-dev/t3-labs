import type { Metadata } from "next";
import type { ReactNode } from "react";

const BASE_URL = "https://www.t3labs.tech";

const TITLE = "AI Visibility & Digital Sales Tools for Suppliers | T3 Labs";
const DESCRIPTION =
  "T3 Labs builds pricing, estimating and quoting tools that help suppliers get found, give customers faster answers, reduce quoting workload and build stronger AI and search visibility.";

export const metadata: Metadata = {
  title: { absolute: TITLE }, // absolute: root layout template would append "| T3 Labs" again
  description: DESCRIPTION,
  alternates: { canonical: `${BASE_URL}/our-solution` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/our-solution`,
    siteName: "T3 Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function OurSolutionLayout({ children }: { children: ReactNode }) {
  return children;
}
