import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope } from "next/font/google";
import { DemoSiteStrip } from "@/components/demo-sites/demo-strip";
import { SmartAssistantLauncher } from "@/components/assistant/SmartAssistantLauncher";
import "./act.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "Apex Roofing | Roofing Done Properly" },
  description:
    "Roofing supplies and products, new roofs, re-roofs, repairs and everything in between. Get an instant roof estimate online in around 60 seconds.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function ApexRoofingDemoLayout({ children }: { children: ReactNode }) {
  return (
    <div id="act-demo-root" className={manrope.variable}>
      <DemoSiteStrip siteLabel="Apex Roofing" />
      {children}
      <SmartAssistantLauncher />
    </div>
  );
}
