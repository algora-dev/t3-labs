import { MarkdownLegalPage } from "@/components/templates/markdown-legal-page";

export const metadata = {
  title: "Cookie Policy | T3 Labs",
  alternates: { canonical: "https://www.t3labs.tech/cookies" },
};

export default function CookiesPage() {
  return <MarkdownLegalPage fileName="cookies.md" />;
}
