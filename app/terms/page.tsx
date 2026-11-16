import { MarkdownLegalPage } from "@/components/templates/markdown-legal-page";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Website Terms of Use | T3 Labs",
  alternates: { canonical: "https://www.t3labs.tech/terms" },
};

export default function TermsPage() {
  return <MarkdownLegalPage fileName="terms.md" />;
}
