import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Montserrat } from "next/font/google";
import { RooflineSmartAssistantLauncher } from "@/components/assistant/RooflineSmartAssistantLauncher";
import "./roofline.css";

/**
 * Roofline Canterbury demonstration site. No demo helper, no demo strip: this
 * build is for a recorded walkthrough handed to the real business, so the site
 * renders clean. The Smart Assistant is the showcase.
 */

// Variable keeps the --font-manrope name so every reused Apex-scoped stylesheet
// (roofline.css, tools.css, quick-estimate.css) inherits Montserrat for free.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "Roofline Canterbury | Christchurch Roofing Experts & Manufacturers" },
  description:
    "Canterbury owned and operated roofing manufacturer and roofing installation contractor. Get an instant roof estimate online in around 60 seconds.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function RooflineDemoLayout({ children }: { children: ReactNode }) {
  return (
    <div id="roofline-demo-root" className={montserrat.variable}>
      {children}
      <RooflineSmartAssistantLauncher />
    </div>
  );
}
