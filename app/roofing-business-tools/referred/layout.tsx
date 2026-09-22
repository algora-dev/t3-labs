import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "Roofing Business Tools | T3 Labs" },
  description: "A representative-shared view of configurable roofing pricing, takeoff, Smart Assistant, trade and internal business tools from T3 Labs.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RoofingBusinessToolsReferredLayout({ children }: { children: ReactNode }) {
  return children;
}
