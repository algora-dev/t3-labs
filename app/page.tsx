import type { Metadata } from "next";
import { Header } from "@/components/t3-rebuild/Header";
import { HomepageContent } from "@/components/t3-rebuild/HomepageContent";
import "./t3-rebuild.css";

export const metadata: Metadata = {
  title: "T3Labs | Websites, Estimating Tools & Automation for Roofing Businesses",
  description: "Better enquiries, faster quotes and more jobs won. Roofing and construction specialists building websites, SEO, smart assistants and quoting systems.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "T3Labs | Technology for Roofing & Construction",
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
