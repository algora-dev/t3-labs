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
        background: #fbfcff; color: #0a0b10;
      }
      .legal-shell { min-height: 100vh; background: radial-gradient(circle at 76% 6%, rgba(17, 19, 24, 0.05), transparent 24rem), radial-gradient(circle at 14% 36%, rgba(180, 185, 194, 0.08), transparent 20rem), #fbfcff; }
      .legal-container { max-width: 820px; margin: 0 auto; padding: 32px 20px; }
      .legal-back { margin-bottom: 24px; }
      .legal-back a { color: #606575; text-decoration: none; font-size: 14px; }
      .legal-back a:hover { color: #0a0b10; text-decoration: underline; }
      .legal-card {
        background: #ffffff; border: 1px solid #e7e9ef;
        border-radius: 18px; padding: 40px; box-shadow: 0 10px 32px rgba(24, 31, 51, 0.05);
      }
      .legal-title {
        font-size: 42px; line-height: 1.08; letter-spacing: -0.04em; margin: 0 0 8px;
      }
      .legal-date { font-size: 14px; color: #606575; margin: 0 0 32px; }
      .legal-body h2 {
        font-size: 22px; line-height: 1.3; letter-spacing: -0.02em;
        margin: 32px 0 12px;
      }
      .legal-body h3 {
        font-size: 18px; line-height: 1.4; margin: 24px 0 8px;
      }
      .legal-body p {
        font-size: 15px; line-height: 1.9; color: #3e4352; margin: 0 0 16px;
      }
      .legal-body ul, .legal-body ol {
        margin: 0 0 16px; padding-left: 22px;
      }
      .legal-body li {
        font-size: 15px; line-height: 1.9; color: #3e4352; margin-bottom: 6px;
      }
      .legal-body a { color: #0a0b10; text-decoration: underline; }
      .legal-body a:hover { color: #606575; }
      .legal-body strong { font-weight: 600; }
      .legal-body table {
        width: 100%; border-collapse: collapse; margin: 16px 0 24px;
        font-size: 14px;
      }
      .legal-body th {
        background: #f6f8fc; text-align: left;
        padding: 10px 14px; border: 1px solid #e7e9ef; font-weight: 600;
      }
      .legal-body td {
        padding: 10px 14px; border: 1px solid #e7e9ef; color: #3e4352; vertical-align: top;
      }
      @media (max-width: 640px) {
        .legal-container { padding: 16px; }
        .legal-card { padding: 24px; border-radius: 14px; }
        .legal-title { font-size: 32px; }
      }
    `}</style>
  );
}
