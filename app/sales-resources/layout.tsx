import type { Metadata } from "next";
import type { ReactNode } from "react";

// Internal sales playbook — unlisted (noindex, excluded from sitemap/robots).
export const metadata: Metadata = {
  title: { absolute: "Construction Sales Playbook | T3 Labs" },
  description: "Internal sales playbook for T3 Labs construction solutions.",
  robots: { index: false, follow: false },
};

export default function SalesResourcesLayout({ children }: { children: ReactNode }) {
  return children;
}
