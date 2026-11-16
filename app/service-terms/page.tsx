import { MarkdownLegalPage } from "@/components/templates/markdown-legal-page";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Client Service Terms and Conditions | T3 Labs",
  alternates: { canonical: "https://www.t3labs.tech/service-terms" },
};

export default function ServiceTermsPage() {
  return <MarkdownLegalPage fileName="service-terms.md" />;
}
