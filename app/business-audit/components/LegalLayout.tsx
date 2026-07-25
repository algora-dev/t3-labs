import Link from "next/link";
import Footer from "./Footer";

export default function LegalLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="legal-shell">
        <div className="legal-container">
          <div className="legal-back">
            <Link href="/business-audit">← Back to Business Audit</Link>
          </div>
          <div className="legal-card">
            <h1 className="legal-title">{title}</h1>
            <p className="legal-date">Last updated: {lastUpdated}</p>
            <div className="legal-body">{children}</div>
          </div>
        </div>
      </div>
      <Footer />
      <LegalStyles />
    </>
  );
}

function LegalStyles() {
  return (
    <style>{`
      * { box-sizing: border-box; }
      html, body {
        margin: 0; padding: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f5f5f2; color: #111111;
      }
      .legal-shell { min-height: 100vh; background: #f5f5f2; }
      .legal-container { max-width: 820px; margin: 0 auto; padding: 32px 20px; }
      .legal-back { margin-bottom: 24px; }
      .legal-back a { color: #666; text-decoration: none; font-size: 14px; }
      .legal-back a:hover { color: #111; text-decoration: underline; }
      .legal-card {
        background: #ffffff; border: 1px solid #e6e6e1;
        border-radius: 28px; padding: 40px; box-shadow: 0 18px 60px rgba(22,22,18,0.06);
      }
      .legal-title {
        font-size: 42px; line-height: 1.08; letter-spacing: -0.04em; margin: 0 0 8px;
      }
      .legal-date { font-size: 14px; color: #888; margin: 0 0 32px; }
      .legal-body h2 {
        font-size: 22px; line-height: 1.3; letter-spacing: -0.02em;
        margin: 32px 0 12px;
      }
      .legal-body h3 {
        font-size: 18px; line-height: 1.4; margin: 24px 0 8px;
      }
      .legal-body p {
        font-size: 15px; line-height: 1.9; color: #333; margin: 0 0 16px;
      }
      .legal-body ul, .legal-body ol {
        margin: 0 0 16px; padding-left: 22px;
      }
      .legal-body li {
        font-size: 15px; line-height: 1.9; color: #333; margin-bottom: 6px;
      }
      .legal-body a { color: #111; text-decoration: underline; }
      .legal-body a:hover { color: #333; }
      .legal-body strong { font-weight: 600; }
      .legal-body table {
        width: 100%; border-collapse: collapse; margin: 16px 0 24px;
        font-size: 14px;
      }
      .legal-body th {
        background: #f5f5f2; text-align: left;
        padding: 10px 14px; border: 1px solid #e6e6e1; font-weight: 600;
      }
      .legal-body td {
        padding: 10px 14px; border: 1px solid #e6e6e1; color: #333; vertical-align: top;
      }
      @media (max-width: 640px) {
        .legal-container { padding: 16px; }
        .legal-card { padding: 24px; border-radius: 24px; }
        .legal-title { font-size: 32px; }
      }
    `}</style>
  );
}
