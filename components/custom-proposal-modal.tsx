"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

const BOOKING_URL = "https://calendly.com/insights-t3labs/20-minute-meeting";
const STORAGE_KEY = "t3-cus…t-v1";

const IMPROVEMENT_OPTIONS = [
  { id: "more-inquiries", label: "Get more leads / inquiries" },
  { id: "more-customers", label: "Turn more inquiries into paying customers" },
  { id: "better-answers", label: "Help website visitors get useful answers without needing to call or inquire" },
  { id: "less-repetitive", label: "Reduce time spent dealing with repetitive calls and inquiries" },
  { id: "more-automation", label: "Automate more of the work your team does before a job starts" },
  { id: "faster-quoting", label: "Measure, estimate and quote jobs faster" },
] as const;

const MARKETING_OPTIONS = [
  "Google / SEO",
  "Google Ads",
  "Facebook / Instagram Ads",
  "Social media",
  "Referrals / word of mouth",
  "Door knocking / sales reps",
  "Lead generation websites or services",
  "We don't actively market right now",
  "Something else",
] as const;

const TEAM_OPTIONS = ["Just me", "2-5 people", "6-10 people", "11-25 people", "25+ people"] as const;
const QUOTE_OPTIONS = [
  "Mostly manually",
  "Spreadsheets / templates",
  "Estimating or quoting software",
  "A mix of different tools",
  "Someone else on the team handles it",
  "Something else",
] as const;
const URGENCY_OPTIONS = ["As soon as possible", "Within the next month", "It depends on the price"] as const;

type Draft = {
  improvements: string[];
  marketing: string[];
  teamSize: string;
  quoteProcess: string;
  urgency: string;
  website: string;
  email: string;
  notes: string;
};

const EMPTY_DRAFT: Draft = {
  improvements: [],
  marketing: [],
  teamSize: "",
  quoteProcess: "",
  urgency: "",
  website: "",
  email: "",
  notes: "",
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" fill="none">
      <path d="m4 10.5 3.4 3.4L16 5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" fill="none">
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none">
      <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChoiceButton({ selected, children, onClick }: { selected: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`group flex min-h-[50px] w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left text-[13px] font-semibold leading-[1.3] transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7ff00] ${
        selected
          ? "border-[#d7ff00] bg-[#1f2b40] text-white shadow-none"
          : "border-[#2a3347] bg-[#171f2f] text-[#e5e8ef] hover:border-[#3d4a63] hover:bg-[#1b2436]"
      }`}
    >
      <span>{children}</span>
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-[5px] border transition ${
          selected ? "border-[#d7ff00] bg-[#d7ff00] text-[#0a0b10]" : "border-[#3d4a63] bg-[#171f2f] text-transparent"
        }`}
      >
        <CheckIcon />
      </span>
    </button>
  );
}

function RadioChoice({ selected, children, onClick }: { selected: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-h-[50px] w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left text-[13px] font-semibold transition duration-150 ${
        selected ? "border-[#d7ff00] bg-[#1f2b40] text-white" : "border-[#2a3347] bg-[#171f2f] text-[#e5e8ef] hover:border-[#3d4a63]"
      }`}
    >
      <span>{children}</span>
      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected ? "border-[#d7ff00] bg-[#d7ff00]" : "border-[#3d4a63] bg-[#171f2f]"}`}>
        {selected ? <span className="h-2.5 w-2.5 rounded-full bg-[#101722]" /> : null}
      </span>
    </button>
  );
}

export function CustomProposalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const needsQuoteQuestion = draft.improvements.includes("faster-quoting");
  const totalSteps = needsQuoteQuestion ? 6 : 5;
  const quoteStep = needsQuoteQuestion ? 4 : -1;
  const urgencyStep = needsQuoteQuestion ? 5 : 4;
  const contactStep = needsQuoteQuestion ? 6 : 5;

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const saved = window.sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setDraft({ ...EMPTY_DRAFT, ...JSON.parse(saved) });
      } catch {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || submitted) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [draft, open, submitted]);

  useEffect(() => {
    if (!needsQuoteQuestion && draft.quoteProcess) {
      setDraft((current) => ({ ...current, quoteProcess: "" }));
    }
  }, [needsQuoteQuestion, draft.quoteProcess]);

  const progress = submitted ? 100 : (step / totalSteps) * 100;

  const canContinue = useMemo(() => {
    if (step === 1) return draft.improvements.length > 0;
    if (step === 2) return draft.marketing.length > 0;
    if (step === 3) return Boolean(draft.teamSize);
    if (step === quoteStep) return Boolean(draft.quoteProcess);
    if (step === urgencyStep) return Boolean(draft.urgency);
    return true;
  }, [draft, quoteStep, step, urgencyStep]);

  if (!open) return null;

  function toggleImprovement(id: string) {
    setDraft((current) => {
      const exists = current.improvements.includes(id);
      return { ...current, improvements: exists ? current.improvements.filter((item) => item !== id) : [...current.improvements, id] };
    });
  }

  function selectAllImprovements() {
    const allIds = IMPROVEMENT_OPTIONS.map((item) => item.id);
    setDraft((current) => ({ ...current, improvements: current.improvements.length === allIds.length ? [] : allIds }));
  }

  function toggleMarketing(label: string) {
    setDraft((current) => {
      const exists = current.marketing.includes(label);
      return { ...current, marketing: exists ? current.marketing.filter((item) => item !== label) : [...current.marketing, label] };
    });
  }

  async function submit() {
    setError("");
    if (!draft.website.trim() || !draft.email.trim()) {
      setError("Please add your website and email address.");
      return;
    }
    setSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const response = await fetch("/api/custom-proposal-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          improvementLabels: draft.improvements.map((id) => IMPROVEMENT_OPTIONS.find((option) => option.id === id)?.label).filter(Boolean),
          pageUrl: window.location.href,
          referrer: document.referrer,
          utmSource: params.get("utm_source") || "",
          utmCampaign: params.get("utm_campaign") || "",
          utmContent: params.get("utm_content") || "",
          company: honeypot,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.error || "We could not send your request. Please try again.");
      window.sessionStorage.removeItem(STORAGE_KEY);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0a0b10]/55 p-0 backdrop-blur-[3px] sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="proposal-modal-title"
        className="relative flex max-h-[96svh] w-full max-w-[700px] flex-col overflow-hidden rounded-t-[20px] border border-[#2a3347] bg-[#101722] shadow-[0_30px_100px_rgba(10,11,16,.5)] sm:max-h-[88svh] sm:rounded-[20px]"
      >
        <header className="shrink-0 border-b border-[#2a3347] bg-[#101722]/95 px-5 pb-3.5 pt-[18px] backdrop-blur sm:px-6 sm:pt-5">
          <div className="flex items-start justify-between gap-5">
            <div>
              <p className="m-0 text-[11px] font-bold uppercase tracking-[0.17em] text-[#d7ff00]">Custom proposal and price</p>
              <h2 id="proposal-modal-title" className="mb-0 mt-1.5 text-[1.12rem] font-semibold leading-[1.16] tracking-[-0.025em] text-white sm:text-[1.3rem]">
                {submitted ? "Thanks, Shaun's got it." : "Tell Shaun a little about your business."}
              </h2>
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#2a3347] bg-[#171f2f] text-white transition hover:bg-[#1b2436]">
              <CloseIcon />
            </button>
          </div>
          {!submitted ? (
            <div className="mt-3.5">
              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a93a6]">
                <span>About 60 seconds</span>
                <span>Step {step} of {totalSteps}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#2a3347]">
                <div className="h-full rounded-full bg-[#d7ff00] transition-[width] duration-250" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : null}
        </header>

        <style>{`
          .t3-proposal-scroll {
            scrollbar-width: thin;
            scrollbar-color: #3d4a63 transparent;
          }
          .t3-proposal-scroll::-webkit-scrollbar { width: 7px; }
          .t3-proposal-scroll::-webkit-scrollbar-track { background: transparent; }
          .t3-proposal-scroll::-webkit-scrollbar-thumb {
            background: #3d4a63;
            border-radius: 999px;
            border: 2px solid transparent;
            background-clip: padding-box;
          }
          .t3-proposal-scroll::-webkit-scrollbar-thumb:hover {
            background: #57637e;
            background-clip: padding-box;
          }
          .t3-proposal-scroll::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
        `}</style>
        <div className="t3-proposal-scroll min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-[22px]">
          {submitted ? (
            <div className="mx-auto max-w-[620px] py-4 sm:py-7">
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#d7ff00] text-[#0a0b10]"><CheckIcon /></span>
              <h3 className="mb-2.5 mt-4 text-[clamp(1.45rem,3.5vw,1.95rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-white">Your request has been received.</h3>
              <p className="m-0 text-sm leading-6 text-[#a7aeba]">
                Shaun will personally review your website, your answers and how your business currently operates. He'll come back with a tailored recommendation and price, including what he'd improve, what he'd suggest putting in place and why.
              </p>
              <div className="mt-4 rounded-xl border border-[#3a4520] bg-[#161d0e] p-3.5 text-[13px] leading-5 text-[#cfe08a]">
                The $1,000 setup you've seen advertised may be exactly what makes sense for you. If something different would suit your business better, Shaun will explain what he'd recommend and why before you decide anything.
              </div>
              <div className="mt-3 rounded-xl border border-[#2a3347] bg-[#171f2f] p-3.5 text-[13px] leading-5 text-[#e5e8ef]">
                <strong className="font-bold text-white">+ his #1 tip</strong> for winning more jobs from 20 years in roofing.
              </div>
              <p className="mt-4 text-[13px] font-semibold text-white">You'll hear back within 48 hours. No call required.</p>
              <div className="mt-5 border-t border-[#2a3347] pt-5">
                <p className="mb-3 text-sm text-[#a7aeba]">Prefer to talk it through?</p>
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#d7ff00] px-4 py-2.5 text-[13px] font-semibold text-[#0a0b10] no-underline shadow-[0_12px_24px_rgba(10,11,16,.3)] transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(10,11,16,.4)] active:translate-y-0">
                  Book a 20-minute call with Shaun <ArrowIcon />
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); void submit(); }}>
              {step === 1 ? (
                <div>
                  <p className="m-0 text-[11px] font-bold uppercase tracking-[0.15em] text-[#8a93a6]">What matters most</p>
                  <h3 className="mb-1.5 mt-1.5 text-[1.38rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[1.48rem]">What would you most like to improve?</h3>
                  <p className="mb-4 text-[13px] text-[#a7aeba]">Select anything that applies.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {IMPROVEMENT_OPTIONS.map((option) => (
                      <ChoiceButton key={option.id} selected={draft.improvements.includes(option.id)} onClick={() => toggleImprovement(option.id)}>{option.label}</ChoiceButton>
                    ))}
                    <div className="sm:col-span-2">
                      <ChoiceButton selected={draft.improvements.length === IMPROVEMENT_OPTIONS.length} onClick={selectAllImprovements}>All of the above</ChoiceButton>
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div>
                  <p className="m-0 text-[11px] font-bold uppercase tracking-[0.15em] text-[#8a93a6]">Current marketing</p>
                  <h3 className="mb-1.5 mt-1.5 text-[1.38rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[1.48rem]">How do you currently get most of your leads / inquiries?</h3>
                  <p className="mb-4 text-[13px] text-[#a7aeba]">Select anything that applies.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {MARKETING_OPTIONS.map((option) => <ChoiceButton key={option} selected={draft.marketing.includes(option)} onClick={() => toggleMarketing(option)}>{option}</ChoiceButton>)}
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div>
                  <p className="m-0 text-[11px] font-bold uppercase tracking-[0.15em] text-[#8a93a6]">Your operation</p>
                  <h3 className="mb-1.5 mt-1.5 text-[1.38rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[1.48rem]">Roughly how big is your team?</h3>
                  <p className="mb-4 text-[13px] text-[#a7aeba]">Choose one.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {TEAM_OPTIONS.map((option) => <RadioChoice key={option} selected={draft.teamSize === option} onClick={() => setDraft((current) => ({ ...current, teamSize: option }))}>{option}</RadioChoice>)}
                  </div>
                </div>
              ) : null}

              {needsQuoteQuestion && step === quoteStep ? (
                <div>
                  <p className="m-0 text-[11px] font-bold uppercase tracking-[0.15em] text-[#8a93a6]">Your current process</p>
                  <h3 className="mb-1.5 mt-1.5 text-[1.38rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[1.48rem]">How do you currently measure / quote jobs?</h3>
                  <p className="mb-4 text-[13px] text-[#a7aeba]">Choose the closest answer.</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {QUOTE_OPTIONS.map((option) => <RadioChoice key={option} selected={draft.quoteProcess === option} onClick={() => setDraft((current) => ({ ...current, quoteProcess: option }))}>{option}</RadioChoice>)}
                  </div>
                </div>
              ) : null}

              {step === urgencyStep ? (
                <div>
                  <p className="m-0 text-[11px] font-bold uppercase tracking-[0.15em] text-[#8a93a6]">Timing</p>
                  <h3 className="mb-1.5 mt-1.5 text-[1.38rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[1.48rem]">How soon would you like to improve things?</h3>
                  <p className="mb-4 text-[13px] text-[#a7aeba]">Choose one.</p>
                  <div className="grid gap-2">
                    {URGENCY_OPTIONS.map((option) => <RadioChoice key={option} selected={draft.urgency === option} onClick={() => setDraft((current) => ({ ...current, urgency: option }))}>{option}</RadioChoice>)}
                  </div>
                </div>
              ) : null}

              {step === contactStep ? (
                <div>
                  <p className="m-0 text-[11px] font-bold uppercase tracking-[0.15em] text-[#8a93a6]">Last step</p>
                  <h3 className="mb-1.5 mt-1.5 text-[1.38rem] font-semibold leading-[1.1] tracking-[-0.035em] text-white sm:text-[1.48rem]">Where should Shaun send your proposal?</h3>
                  <p className="mb-4 text-[13px] leading-5 text-[#a7aeba]">Shaun will personally review your website and answers, then send you a tailored recommendation and price, <strong className="font-bold text-white">+ his #1 tip</strong> for winning more jobs from 20 years in roofing.</p>
                  <div className="grid gap-4">
                    <label className="grid gap-1.5 text-sm font-semibold text-[#e5e8ef]">
                      Website
                      <input value={draft.website} onChange={(e) => setDraft((current) => ({ ...current, website: e.target.value }))} required inputMode="url" placeholder="yourwebsite.com" className="h-11 rounded-lg border border-[#2a3347] bg-[#171f2f] px-3.5 text-sm font-normal text-white placeholder:text-[12px] placeholder:font-normal placeholder:text-[#5f6a80] placeholder:opacity-100 focus:border-[#d7ff00] focus:outline-none" />
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-[#e5e8ef]">
                      Email
                      <input value={draft.email} onChange={(e) => setDraft((current) => ({ ...current, email: e.target.value }))} required type="email" placeholder="you@company.com" className="h-11 rounded-lg border border-[#2a3347] bg-[#171f2f] px-3.5 text-sm font-normal text-white placeholder:text-[12px] placeholder:font-normal placeholder:text-[#5f6a80] placeholder:opacity-100 focus:border-[#d7ff00] focus:outline-none" />
                    </label>
                    <label className="grid gap-1.5 text-sm font-semibold text-[#e5e8ef]">
                      Anything else you'd like Shaun to know? <span className="font-normal text-[#727d92]">Optional</span>
                      <textarea value={draft.notes} onChange={(e) => setDraft((current) => ({ ...current, notes: e.target.value }))} maxLength={1500} rows={4} placeholder="Anything useful about your business, current process or what you'd like to change." className="resize-none rounded-lg border border-[#2a3347] bg-[#171f2f] px-3.5 py-2.5 text-sm font-normal leading-5 text-white placeholder:text-[12px] placeholder:font-normal placeholder:text-[#5f6a80] placeholder:opacity-100 focus:border-[#d7ff00] focus:outline-none" />
                    </label>
                    <input name="company" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                  </div>
                  <div className="mt-4 rounded-lg border border-[#3a4520] bg-[#161d0e] px-3.5 py-3 text-[13px] leading-5 text-[#cfe08a]">
                    The advertised $1,000 setup may be exactly what suits your business. If something different makes more sense, Shaun will explain what and why in the proposal.
                  </div>
                  {error ? <p role="alert" className="mt-4 text-sm font-semibold text-[#f97066]">{error}</p> : null}
                </div>
              ) : null}
            </form>
          )}
        </div>

        {!submitted ? (
          <footer className="shrink-0 border-t border-[#2a3347] bg-[#101722] px-5 py-3.5 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={() => step === 1 ? onClose() : setStep((current) => current - 1)} className="min-h-10 rounded-lg px-3 text-[13px] font-semibold text-[#a7aeba] transition duration-150 hover:-translate-y-0.5 hover:bg-[#1b2436] hover:text-white active:translate-y-0">
                {step === 1 ? "Cancel" : "Back"}
              </button>
              {step < contactStep ? (
                <button type="button" disabled={!canContinue} onClick={() => canContinue && setStep((current) => current + 1)} className="group inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#d7ff00] px-[18px] py-2.5 text-[13px] font-bold text-[#0a0b10] shadow-[0_10px_22px_rgba(10,11,16,.3)] transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(10,11,16,.4)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40">
                  Continue <ArrowIcon />
                </button>
              ) : (
                <button type="button" data-visit-cta="submit" disabled={submitting} onClick={() => void submit()} className="group inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#d7ff00] px-[18px] py-2.5 text-[13px] font-bold text-[#0a0b10] shadow-[0_10px_22px_rgba(10,11,16,.3)] transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(10,11,16,.4)] active:translate-y-0 disabled:opacity-60">
                  {submitting ? "Sending..." : "Get my custom proposal"} {!submitting ? <ArrowIcon /> : null}
                </button>
              )}
            </div>
          </footer>
        ) : null}
      </section>
    </div>
  );
}

export function CustomProposalTrigger({ className = "", children = "Get a custom proposal and price" }: { className?: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>{children}</button>
      <CustomProposalModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
