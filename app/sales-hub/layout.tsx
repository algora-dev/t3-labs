import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Sales Hub | T3 Labs" },
  description:
    "Every customer-facing page T3 Labs reps need, with guidance on what each page is for and when to send it.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function SalesHubLayout({ children }: { children: ReactNode }) {
  return children;
}
