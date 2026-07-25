"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Footer from "../components/Footer";

type Insight = {
  title: string;
  text: string;
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [insights, setInsights] = useState<Insight[]>([]);
  const [attempts, setAttempts] = useState(0);

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "#";

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const maxAttempts = 20;

    const poll = async () => {
      try {
        const res = await fetch(`/business-audit/api/get-insights?session_id=${sessionId}`);
        const data = await res.json();

        if (data.ready && data.insights) {
          setInsights(data.insights);
          setStatus("ready");
          return;
        }

        setAttempts((prev) => {
          const next = prev + 1;
          if (next >= maxAttempts) setStatus("error");
          return next;
        });
      } catch {
        setAttempts((prev) => prev + 1);
      }
    };

    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    if (attempts >= 20) setStatus("error");
  }, [attempts]);

  if (status === "loading") {
    return (
      <>
        <div className="app-shell">
          <div className="center-wrap">
            <div className="loading-card fade-in" style={{ textAlign: "center" }}>
              <div className="spinner" />
              <h1>Building your audit report</h1>
              <p>Your insights are being generated. This takes about 10 seconds.</p>
            </div>
          </div>
        </div>
        <Footer />
        <Styles />
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <div className="app-shell">
          <div className="center-wrap">
            <div className="intro-card fade-in">
              <h1>Your report is on its way</h1>
              <p>
                Payment confirmed. Your insights may take a moment longer to generate. Check your
                email shortly, or try refreshing this page in 30 seconds.
              </p>
              <div className="button-row" style={{ marginTop: 24 }}>
                <button className="primary-button" onClick={() => window.location.reload()}>
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Styles />
      </>
    );
  }

  return (
    <>
      <div className="app-shell">
        <div className="plan-wrap fade-in">
          <div className="plan-head">
            <div>
              <div className="pill">Full audit unlocked</div>
              <h1>Your business audit report</h1>
              <p>These insights are built directly from your answers.</p>
            </div>
            <a href="/business-audit" className="secondary-button" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
              Run another audit
            </a>
          </div>

          <div className="plan-list">
            {insights.map((insight, i) => (
              <div key={i} className="plan-card">
                <div className="small-label">
                  {i === 0 && "Your likely business bottleneck"}
                  {i === 1 && "Your biggest missed opportunity"}
                  {i === 2 && "What to fix first"}
                  {i === 3 && "What may be wasting your time, money, or energy"}
                  {i === 4 && "Your 30-day action plan"}
                  {i > 4 && `Insight ${i + 1}`}
                </div>
                <h2>{insight.title}</h2>
                {insight.text.split("\n\n").map((para, j) => (
                  <p key={j}>{para}</p>
                ))}
              </div>
            ))}
          </div>

          {/* Calendly CTA */}
          <div className="calendly-cta">
            <div className="calendly-cta-inner">
              <div className="calendly-badge">Included with your audit</div>
              <h2>Your free Audit Review Call is included</h2>
              <p>
                Want us to walk through your result with you?
              </p>
              <p>
                Book your free 15-minute Audit Review Call with the Business Audit team. We will review your audit, ask a few extra questions about your business, and help you understand what to fix first.
              </p>
              <p>
                You will be asked for your name, email, company name, website, and a little more context so we can prepare for the call.
              </p>
              <a
                href={calendlyUrl}
                className="primary-button calendly-btn"
                target={calendlyUrl !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                Book your free audit review call
              </a>
              <p className="calendly-notice">
                Booking is optional. Calendly may collect the details you provide in order to schedule your call.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Styles />
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <>
        <div className="app-shell">
          <div className="center-wrap">
            <div className="loading-card fade-in" style={{ textAlign: "center" }}>
              <div className="spinner" />
              <h1>Loading your report</h1>
              <p>Just a moment...</p>
            </div>
          </div>
        </div>
        <Styles />
      </>
    }>
      <SuccessContent />
    </Suspense>
  );
}

function Styles() {
  return (
    <style jsx global>{`
      * { box-sizing: border-box; }
      html, body {
        margin: 0; padding: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #fbfcff; color: #0a0b10;
      }
      body { min-height: 100vh; }
      .app-shell { min-height: 100vh; background: radial-gradient(circle at 76% 6%, rgba(17, 19, 24, 0.05), transparent 24rem), radial-gradient(circle at 14% 36%, rgba(180, 185, 194, 0.08), transparent 20rem), #fbfcff; }
      .center-wrap {
        max-width: 820px; margin: 0 auto; min-height: 100vh;
        display: flex; align-items: center; padding: 32px 20px;
      }
      .intro-card, .loading-card {
        width: 100%; background: #ffffff; border: 1px solid #e7e9ef;
        border-radius: 18px; padding: 36px; box-shadow: 0 10px 32px rgba(24, 31, 51, 0.05);
      }
      .intro-card h1, .loading-card h1 {
        font-size: 46px; line-height: 1.06; letter-spacing: -0.04em; margin: 0;
      }
      .intro-card p, .loading-card p {
        margin: 18px 0 0; font-size: 1.08rem; line-height: 1.9; color: #3e4352;
      }
      .spinner {
        width: 48px; height: 48px; border-radius: 999px;
        border: 4px solid #e7e9ef; border-top-color: #d7ff00;
        animation: spin .9s linear infinite; margin: 0 auto 22px;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
      .fade-in { animation: fadeIn .24s ease; }
      @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .button-row { display: flex; gap: 12px; margin-top: 30px; flex-wrap: wrap; }
      .primary-button, .secondary-button {
        height: 52px; border-radius: 8px; font-size: 15px; padding: 0 22px;
        cursor: pointer; transition: .2s ease; font-weight: 500;
      }
      .primary-button { border: 0; background: linear-gradient(135deg, #050608, #242832); color: #ffffff; box-shadow: 0 14px 30px rgba(10, 11, 16, 0.16); }
      .primary-button:hover { transform: translateY(-2px); }
      .secondary-button { border: 1px solid #e7e9ef; background: #ffffff; color: #0a0b10; }
      .secondary-button:hover { border-color: #e3e8bc; background: #fbfff0; }
      .plan-wrap { max-width: 1020px; margin: 0 auto; padding: 36px 20px; }
      .plan-head {
        display: flex; justify-content: space-between; align-items: flex-end;
        gap: 20px; flex-wrap: wrap;
      }
      .plan-head h1 { margin: 14px 0 0; font-size: 48px; line-height: 1.06; letter-spacing: -0.04em; }
      .plan-head p { margin: 14px 0 0; font-size: 1.08rem; line-height: 1.9; color: #3e4352; max-width: 720px; }
      .pill {
        display: inline-flex; align-items: center; border: 1px solid #e7e9ef;
        background: rgba(255,255,255,0.72); color: #4f5567; border-radius: 999px; padding: 8px 14px; font-size: 0.75rem; font-weight: 500;
      }
      .plan-list { display: grid; gap: 18px; margin-top: 24px; }
      .plan-card {
        background: #ffffff; border: 1px solid #e7e9ef;
        border-radius: 18px; padding: 28px; box-shadow: 0 10px 32px rgba(24, 31, 51, 0.05);
      }
      .small-label { font-size: 0.78rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: #515763; margin-bottom: 10px; }
      .plan-card h2 { margin: 0; font-size: 29px; line-height: 1.18; letter-spacing: -0.03em; }
      .plan-card p { margin: 14px 0 0; font-size: 16px; line-height: 1.9; color: #0a0b10; }

      /* Calendly CTA */
      .calendly-cta {
        margin-top: 32px;
        background: #0a0b10;
        border-radius: 18px;
        padding: 36px;
        color: #ffffff;
      }
      .calendly-cta-inner { max-width: 680px; }
      .calendly-badge {
        display: inline-flex; align-items: center;
        background: rgba(215, 255, 0, 0.15); color: #d7ff00;
        border-radius: 999px; padding: 6px 14px; font-size: 13px;
        margin-bottom: 16px; font-weight: 600;
      }
      .calendly-cta h2 {
        font-size: 32px; line-height: 1.15; letter-spacing: -0.03em;
        margin: 0 0 16px;
      }
      .calendly-cta p {
        font-size: 16px; line-height: 1.8; color: #c9c9c1; margin: 0 0 14px;
      }
      .calendly-btn {
        display: inline-flex; align-items: center; text-decoration: none;
        margin-top: 8px; background: linear-gradient(135deg, #050608, #242832); color: #ffffff;
        height: 52px; border-radius: 8px; font-size: 15px; padding: 0 22px;
        font-weight: 500; transition: 0.2s ease; box-shadow: 0 14px 30px rgba(10, 11, 16, 0.16);
      }
      .calendly-btn:hover { transform: translateY(-2px); }
      .calendly-notice {
        font-size: 12px; color: #606575; margin-top: 12px !important;
      }

      @media (max-width: 640px) {
        .plan-wrap, .center-wrap { padding-left: 16px; padding-right: 16px; }
        .plan-head h1, .intro-card h1, .loading-card h1 { font-size: 34px; }
        .plan-card { padding: 22px; border-radius: 14px; }
        .calendly-cta { padding: 24px; border-radius: 14px; }
        .calendly-cta h2 { font-size: 26px; }
      }
    `}</style>
  );
}
