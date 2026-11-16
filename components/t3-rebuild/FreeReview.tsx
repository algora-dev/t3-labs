"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { BOOK_CALL_URL, REVIEW_TOPICS } from "./review-topics";
import { trackMarketingEvent } from "@/lib/marketing-analytics";

type FormState = "idle" | "sending" | "sent";

export function FreeReview({ initialTopics, packageInterest }: {
  initialTopics: string[];
  packageInterest: string;
}) {
  const [topics, setTopics] = useState<string[]>(initialTopics);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<FormState>("idle");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [details, setDetails] = useState("");
  const [honey, setHoney] = useState("");
  const submissionId = useRef<string>("");

  const toggleTopic = (value: string) => {
    setTopics((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
    if (error) setError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    if (topics.length === 0 && !details.trim()) {
      setError("Select a topic or describe what you need below.");
      document.getElementById("r15-focus")?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!submissionId.current) submissionId.current = crypto.randomUUID();
    setStatus("sending");
    setError("");
    try {
      const result = await fetch("/api/free-business-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(), name: name.trim(), website: website.trim(),
          details: details.trim(), topics, packageInterest, websiteConfirmation: honey,
          submissionId: submissionId.current,
        }),
      });
      if (!result.ok) {
        const data = await result.json().catch(() => null);
        throw new Error(data?.error || "We couldn't send that. Please try again.");
      }
      trackMarketingEvent("review_form_submit_success", "free-review");
      setStatus("sent");
      document.getElementById("r15-main-card")?.scrollIntoView({ block: "start", behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send that. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div id="review-page">
      <section className="r15-hero">
        <div className="container">
          <Link className="r15-back" href="/">← Back to homepage</Link>
          <div className="r15-hero-grid">
            <div className="r15-hero-copy">
              <div className="r15-eyebrow"><span className="r15-spark" />FREE BUSINESS REVIEW</div>
              <h1>Tell us where roofing work <span>slows you down.</span></h1>
              <p>Tell us about the enquiries, quoting or admin you want to improve. We will suggest a practical next step, whether that means adjusting what you already use or building something new.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="r15-main">
        <div className="r15-wrap">
          <div className="r15-routes" role="group" aria-label="Choose how to contact T3Labs">
            <a href="#r15-main-card" id="r15-route-written" className="r15-route is-active">
              <span className="r15-route-icon" aria-hidden="true">✉</span>
              <span className="r15-route-text"><strong>Send a quick enquiry</strong><small>A personal reply within 48 hours.</small></span>
              <span className="r17-route-arrow" aria-hidden="true">↓</span>
            </a>
            <a className="r15-route" id="r15-route-call" href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackMarketingEvent("book_call_click", "free-review")}>
              <span className="r15-route-icon" aria-hidden="true">▦</span>
              <span className="r15-route-text"><strong>Book a 20-minute call</strong><small>Speak directly with our team.</small></span>
              <span className="r17-route-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
          <div id="r15-main-card" className="r15-main-card">
            {status === "sent" ? (
              <div className="r15-result" id="r15-result" role="status" aria-live="polite">
                <div className="r15-step-label">ENQUIRY SENT</div>
                <h2>Thanks. We&apos;ve got it.</h2>
                <p>Our team will reply within 48 hours.</p>
                <div className="r17-result-actions">
                  <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackMarketingEvent("book_call_click", "free-review")} className="r15-submit">Book a call too <span aria-hidden="true">↗</span></a>
                  <Link href="/" className="r17-secondary-link">Back to homepage</Link>
                </div>
              </div>
            ) : (
              <div id="r15-entry">
                <div className="r15-form-heading"><h2>What can we help with?</h2></div>
                {initialTopics.length > 0 ? <div className="r15-prefill" id="r15-prefill" role="status">Relevant topics preselected. Change them if you like.</div> : null}
                <form id="r15-form" onSubmit={submit} noValidate={false}>
                  <div id="r15-focus" className="r15-focus-grid" role="group" aria-label="Choose topics">
                    {REVIEW_TOPICS.map((topic) => (
                      <label className="r15-focus" key={topic.value}>
                        <input type="checkbox" value={topic.value} checked={topics.includes(topic.value)} onChange={() => toggleTopic(topic.value)} />
                        <span className="r15-tick" aria-hidden="true">✓</span>
                        <span className="r18-choice-label">{topic.label}{topic.hint ? <small className="r18-choice-hint">{topic.hint}</small> : null}</span>
                      </label>
                    ))}
                  </div>
                  <div className="r15-form-rule" />
                  <div className="r15-fields">
                    <label className="r15-field">
                      <span>Email <b>*</b></span>
                      <input type="email" id="r15-email" required maxLength={200} autoComplete="email" placeholder="you@yourbusiness.com" value={email} onChange={e => setEmail(e.target.value)} />
                    </label>
                    <label className="r15-field">
                      <span>Name or business <small>(optional)</small></span>
                      <input type="text" id="r15-name" maxLength={120} autoComplete="name" placeholder="Your name or company" value={name} onChange={e => setName(e.target.value)} />
                    </label>
                    <label className="r15-field r15-field-full">
                      <span>Website <small>(optional)</small></span>
                      <input type="text" id="r15-site" maxLength={300} placeholder="Your website or business page" value={website} onChange={e => setWebsite(e.target.value)} />
                    </label>
                    <label className="r15-field r15-field-full">
                      <span>Anything else? <small>(optional)</small></span>
                      <textarea id="r15-notes" maxLength={1200} rows={2} placeholder="What would you like to achieve?" value={details} onChange={e => {setDetails(e.target.value); if (error) setError("");}} />
                    </label>
                    {/* Honeypot: deliberately offscreen, not display:none, to catch generic bots. */}
                    <label className="t3-rebuild-honeypot" aria-hidden="true" tabIndex={-1}>
                      Website confirmation
                      <input tabIndex={-1} autoComplete="off" value={honey} onChange={e => setHoney(e.target.value)} />
                    </label>
                  </div>
                  {error ? <p className="r15-error" id="r15-focus-error" role="alert">{error}</p> : null}
                  <div className="r15-form-bottom">
                    <button className="r15-submit" id="r15-submit" type="submit" disabled={status === "sending"}>
                      {status === "sending" ? "Sending..." : "Send my enquiry"} <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                  <p className="t3-review-privacy">Your details are used only to respond to your enquiry. <Link href="/privacy">Privacy</Link>.</p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
