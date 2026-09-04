import type { Metadata } from "next";

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  title: "AI Visibility & Digital Sales Tools for Suppliers | T3 Labs",
  description:
    "T3 Labs builds pricing, estimating and quoting tools that help suppliers get found, give customers faster answers, reduce quoting workload and build stronger AI and search visibility.",
  alternates: { canonical: `${BASE_URL}/our-solution` },
  openGraph: {
    title: "AI Visibility & Digital Sales Tools for Suppliers | T3 Labs",
    description:
      "AI is answering your customers before they visit a website. We build tools that make your business part of the answer — faster pricing, easier buying, less manual work.",
    url: `${BASE_URL}/our-solution`,
    siteName: "T3 Labs",
    type: "website",
  },
};

export default function OurSolutionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
