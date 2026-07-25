"use client";

import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Link from "next/link";

type Preferences = {
  analytics: boolean;
  performance: boolean;
  marketing: boolean;
};

export default function CookiePreferencesPage() {
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState<Preferences>({
    analytics: false,
    performance: false,
    marketing: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem("cookie_consent_prefs");
    if (stored) {
      try {
        setPrefs(JSON.parse(stored));
      } catch {
        // ignore
      }
    } else {
      const consent = localStorage.getItem("cookie_consent");
      if (consent === "all") {
        setPrefs({ analytics: true, performance: true, marketing: true });
      }
    }
  }, []);

  function savePrefs() {
    localStorage.setItem("cookie_consent_prefs", JSON.stringify(prefs));
    const hasAny = prefs.analytics || prefs.performance || prefs.marketing;
    localStorage.setItem("cookie_consent", hasAny ? "custom" : "essential");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function acceptAll() {
    const all = { analytics: true, performance: true, marketing: true };
    setPrefs(all);
    localStorage.setItem("cookie_consent_prefs", JSON.stringify(all));
    localStorage.setItem("cookie_consent", "all");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function rejectAll() {
    const none = { analytics: false, performance: false, marketing: false };
    setPrefs(none);
    localStorage.setItem("cookie_consent_prefs", JSON.stringify(none));
    localStorage.setItem("cookie_consent", "essential");
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function toggle(key: keyof Preferences) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <>
      <div className="pref-shell">
        <div className="pref-container">
          <div className="pref-back">
            <Link href="/business-audit">← Back to Business Audit</Link>
          </div>
          <div className="pref-card">
            <h1>Cookie Preferences</h1>
            <p>
              Manage your cookie preferences below. Strictly necessary cookies are always active as they are required for the site to work. You can toggle optional cookie categories on or off.
            </p>

            <div className="pref-section">
              <div className="pref-row">
                <div className="pref-info">
                  <h2>Strictly necessary cookies</h2>
                  <p>These cookies are required for the site to function. They cannot be turned off.</p>
                </div>
                <div className="pref-toggle always-on">Always on</div>
              </div>
            </div>

            <div className="pref-section">
              <div className="pref-row">
                <div className="pref-info">
                  <h2>Analytics cookies</h2>
                  <p>Help us understand how the audit tool is used so we can improve it. No personally identifiable information is collected.</p>
                </div>
                <button
                  className={`pref-toggle-btn ${prefs.analytics ? "on" : "off"}`}
                  onClick={() => toggle("analytics")}
                  aria-pressed={prefs.analytics}
                >
                  {prefs.analytics ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div className="pref-section">
              <div className="pref-row">
                <div className="pref-info">
                  <h2>Performance cookies</h2>
                  <p>Used for anonymised session recording to identify usability issues and improve the experience.</p>
                </div>
                <button
                  className={`pref-toggle-btn ${prefs.performance ? "on" : "off"}`}
                  onClick={() => toggle("performance")}
                  aria-pressed={prefs.performance}
                >
                  {prefs.performance ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div className="pref-section">
              <div className="pref-row">
                <div className="pref-info">
                  <h2>Marketing cookies</h2>
                  <p>Used to measure the effectiveness of marketing campaigns. These are not pre-enabled.</p>
                </div>
                <button
                  className={`pref-toggle-btn ${prefs.marketing ? "on" : "off"}`}
                  onClick={() => toggle("marketing")}
                  aria-pressed={prefs.marketing}
                >
                  {prefs.marketing ? "On" : "Off"}
                </button>
              </div>
            </div>

            {saved && (
              <div className="save-notice">Your preferences have been saved.</div>
            )}

            <div className="pref-actions">
              <button className="pref-btn primary" onClick={savePrefs}>Save preferences</button>
              <button className="pref-btn secondary" onClick={rejectAll}>Reject non-essential</button>
              <button className="pref-btn secondary" onClick={acceptAll}>Accept all</button>
            </div>

            <p className="pref-more">
              For more information, see our <Link href="/business-audit/cookies">Cookie Policy</Link>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <style jsx global>{`
        * { box-sizing: border-box; }
        html, body {
          margin: 0; padding: 0;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: #fbfcff; color: #0a0b10;
        }
        .pref-shell { min-height: 100vh; background: radial-gradient(circle at 76% 6%, rgba(17, 19, 24, 0.05), transparent 24rem), radial-gradient(circle at 14% 36%, rgba(180, 185, 194, 0.08), transparent 20rem), #fbfcff; }
        .pref-container { max-width: 820px; margin: 0 auto; padding: 32px 20px; }
        .pref-back { margin-bottom: 24px; }
        .pref-back a { color: #606575; text-decoration: none; font-size: 14px; }
        .pref-back a:hover { color: #0a0b10; text-decoration: underline; }
        .pref-card {
          background: #ffffff; border: 1px solid #e7e9ef;
          border-radius: 18px; padding: 40px; box-shadow: 0 10px 32px rgba(24, 31, 51, 0.05);
        }
        .pref-card h1 {
          font-size: 42px; line-height: 1.08; letter-spacing: -0.04em; margin: 0 0 16px;
        }
        .pref-card > p {
          font-size: 15px; line-height: 1.9; color: #3e4352; margin: 0 0 32px;
        }
        .pref-section {
          border: 1px solid #e7e9ef; border-radius: 18px; padding: 20px; margin-bottom: 16px;
        }
        .pref-row {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 20px;
        }
        .pref-info { flex: 1; }
        .pref-info h2 { font-size: 18px; line-height: 1.3; margin: 0 0 6px; }
        .pref-info p { font-size: 14px; line-height: 1.7; color: #606575; margin: 0; }
        .always-on {
          font-size: 13px; color: #606575; font-weight: 500; white-space: nowrap;
          padding-top: 2px;
        }
        .pref-toggle-btn {
          height: 36px; border-radius: 99px; padding: 0 16px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          transition: 0.15s ease; white-space: nowrap; border: none;
        }
        .pref-toggle-btn.on { background: linear-gradient(135deg, #050608, #242832); color: #ffffff; }
        .pref-toggle-btn.off { background: #e7e9ef; color: #3e4352; }
        .pref-toggle-btn.on:hover { transform: translateY(-2px); }
        .pref-toggle-btn.off:hover { background: #d7dce6; }
        .save-notice {
          background: #fbfff0; border: 1px solid #e3e8bc; color: #0a0b10;
          border-radius: 8px; padding: 12px 16px; font-size: 14px; margin: 16px 0;
        }
        .pref-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 24px; }
        .pref-btn {
          height: 48px; border-radius: 8px; font-size: 15px; padding: 0 20px;
          cursor: pointer; font-weight: 500; transition: 0.15s ease;
        }
        .pref-btn.primary { background: linear-gradient(135deg, #050608, #242832); color: #ffffff; border: none; box-shadow: 0 14px 30px rgba(10, 11, 16, 0.16); }
        .pref-btn.primary:hover { transform: translateY(-2px); }
        .pref-btn.secondary { background: #ffffff; color: #0a0b10; border: 1px solid #e7e9ef; }
        .pref-btn.secondary:hover { background: #fbfff0; border-color: #e3e8bc; }
        .pref-more { font-size: 13px; color: #606575; margin-top: 20px; }
        .pref-more a { color: #0a0b10; }
        @media (max-width: 640px) {
          .pref-container { padding: 16px; }
          .pref-card { padding: 24px; border-radius: 14px; }
          .pref-card h1 { font-size: 32px; }
          .pref-row { flex-direction: column; }
        }
      `}</style>
    </>
  );
}
