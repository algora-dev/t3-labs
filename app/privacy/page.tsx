import { MarkdownLegalPage } from "@/components/templates/markdown-legal-page";

export const metadata = {
  title: "Privacy Notice | T3 Labs",
  alternates: { canonical: "https://www.t3labs.tech/privacy" },
};

export default function PrivacyPage() {
  return <MarkdownLegalPage fileName="privacy.md" />;
}
