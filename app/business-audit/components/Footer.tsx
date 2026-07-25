"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function handleManageCookies(e: React.MouseEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.removeItem("cookie_consent");
      window.location.reload();
    }
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-links">
          <Link href="/business-audit/terms">Terms &amp; Conditions</Link>
          <span className="footer-sep">|</span>
          <Link href="/business-audit/privacy">Privacy Policy</Link>
          <span className="footer-sep">|</span>
          <Link href="/business-audit/cookies">Cookie Policy</Link>
          <span className="footer-sep">|</span>
          <Link href="/business-audit/contact">Contact</Link>
          <span className="footer-sep">|</span>
          {mounted ? (
            <a href="/business-audit/cookie-preferences" onClick={handleManageCookies} style={{ cursor: "pointer" }}>
              Manage Cookie Preferences
            </a>
          ) : (
            <Link href="/business-audit/cookie-preferences">Manage Cookie Preferences</Link>
          )}
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} T3 Labs. Results are for informational purposes only and do not constitute legal, financial, or professional advice.</p>
      </div>
      <style jsx>{`
        .site-footer {
          background: #f5f5f2;
          border-top: 1px solid #e6e6e1;
          padding: 24px 20px;
          margin-top: 40px;
        }
        .footer-inner {
          max-width: 1160px;
          margin: 0 auto;
        }
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          font-size: 13px;
          margin-bottom: 12px;
        }
        .footer-links a {
          color: #5f5f57;
          text-decoration: none;
        }
        .footer-links a:hover {
          color: #111;
          text-decoration: underline;
        }
        .footer-sep { color: #ccc; }
        .footer-copy {
          font-size: 12px;
          color: #888;
          margin: 0;
          line-height: 1.6;
        }
      `}</style>
    </footer>
  );
}
