import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./old-apex.css";

export const metadata: Metadata = {
  title: { absolute: "Apex Roofing | Roofing Supplies & Services" },
  description:
    "Demonstration version of a traditional roofing website used for T3 Labs video recording.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function OldApexLayout({ children }: { children: ReactNode }) {
  return <div id="old-apex-root">{children}</div>;
}
