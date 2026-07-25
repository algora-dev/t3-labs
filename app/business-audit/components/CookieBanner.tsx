"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ConsentValue = "all" | "essential" | null;

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent");
    if (!stored) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "all");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem("cookie_consent", "essential");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-inner">
        <p className="cookie-text">
          We use essential cookies to make this site work. With your permission, we may also use optional cookies to understand how the audit is used, improve the experience, and measure marketing. You can accept all, reject non-essential cookies, or{" "}
          <Link href="/business-audit/cookie-preferences" className="cookie-link">manage your preferences</Link>.
        </p>
        <div className="cookie-actions">
          <button className="cookie-btn primary" onClick={accept}>Accept all</button>
          <button className="cookie-btn secondary" onClick={reject}>Reject non-essential</button>
          <Link href="/business-audit/cookie-preferences" className="cookie-btn manage">Manage preferences</Link>
        </div>
      </div>
      <style jsx>{`
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          border-top: 1px solid #e6e6e1;
          box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
          z-index: 1000;
          padding: 16px 20px;
        }
        .cookie-inner {
          max-width: 1160px;
          margin: 0 auto;
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }
        .cookie-text {
          margin: 0;
          font-size: 13px;
          line-height: 1.6;
          color: #333;
          flex: 1;
          min-width: 260px;
        }
        .cookie-link {
          color: #111;
          text-decoration: underline;
        }
        .cookie-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .cookie-btn {
          height: 38px;
          border-radius: 12px;
          font-size: 13px;
          padding: 0 14px;
          cursor: pointer;
          font-weight: 500;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }
        .cookie-btn.primary {
          background: #111111;
          color: #ffffff;
          border: none;
        }
        .cookie-btn.primary:hover { background: #333; }
        .cookie-btn.secondary {
          background: #ffffff;
          color: #111111;
          border: 1px solid #e3e3dc;
        }
        .cookie-btn.secondary:hover { background: #f5f5f2; }
        .cookie-btn.manage {
          background: #f5f5f2;
          color: #333;
          border: 1px solid #e3e3dc;
        }
        .cookie-btn.manage:hover { background: #ebebeb; }
      `}</style>
    </div>
  );
}
