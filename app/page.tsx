import type { Metadata } from "next";
import { Header } from "@/components/t3-rebuild/Header";
import { HomepageContent } from "@/components/t3-rebuild/HomepageContent";
import "./t3-rebuild.css";
import "./t3-growth.css";

export const metadata: Metadata = {
  title: "T3Labs | Websites, Estimating Tools & Automation for Roofing Businesses",
  description: "Better enquiries, faster quotes and more jobs won. Roofing and construction specialists building websites, SEO, smart assistants and quoting systems.",
  alternates: { canonical: "/" },
  openGraph: {
    images: [{ url: "/og-roofing.png", width: 1200, height: 630, alt: "T3 Labs – better roofing leads, faster quotes, less admin" }],
    title: "T3Labs | Better Roofing Enquiries, Faster Quotes & More Jobs Won",
    description: "Get found, quote faster and win more work with practical tech built by people who know your industry.",
    url: "/",
  },
};

export default function Homepage() {
  return (
    <div className="t3-rebuild">
      <Header />
      <HomepageContent />
    </div>
  );
}
