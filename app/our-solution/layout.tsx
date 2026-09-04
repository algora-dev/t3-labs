import type { Metadata } from "next";

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  title: "Become Part of the Answer — AI Visibility & Sales Tools | T3 Labs",
  description:
    "People now expect the answer immediately. We make your business part of the answer — with customer tools that measure, price and quote before your team touches the enquiry. See live demo tools.",
  alternates: { canonical: `${BASE_URL}/our-solution` },
  openGraph: {
    title: "Become Part of the Answer — AI Visibility & Sales Tools | T3 Labs",
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
