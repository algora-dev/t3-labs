import { MarkdownLegalPage } from "@/components/templates/markdown-legal-page";

export const metadata = {
  title: "Website Package Terms | T3 Labs",
  robots: { index: false, follow: false },
};

export default function WebsitePackageTermsPage() {
  return <MarkdownLegalPage fileName="website-package-terms.md" />;
}
