import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Montserrat, Roboto } from "next/font/google";
import { DemoSiteStrip } from "@/components/demo-sites/demo-strip";
import "./act.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "ACT Roofing | Roofing Services You Can Rely On" },
  description:
    "New roofs, roof repairs, slate tiling, lead work and roofing maintenance from a local, family-run team.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
};

export default function ActRoofingDemoLayout({ children }: { children: ReactNode }) {
  return (
    <div id="act-demo-root" className={`${montserrat.variable} ${roboto.variable}`}>
      <DemoSiteStrip siteLabel="ACT Roofing" />
      {children}
    </div>
  );
}
