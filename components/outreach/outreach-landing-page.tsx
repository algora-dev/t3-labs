"use client";

import { useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { OutreachPageConfig } from "@/lib/outreach/config";

const BOOKING_URL = "https://calendly.com/insights-t3labs/20-minute-meeting";
const APEX_URL = "/demo/roofing-site";
const ROOFHUB_URL = "https://roofhub.co.nz";
const QUOTECORE_URL = "https://quote-core.com";

type QualifierQuestion = {
  id: string;
  question: string;
  help?: string;
  answers: Array<{
    label: string;
    score: number;
  }>;
};

const QUALIFIER_QUESTIONS: QualifierQuestion[] = [
  {
    id: "marketing",
    question: "Are you currently paying to bring people to your business?",
    help: "For example Google Ads, Meta ads, directories, SEO, sponsorships or other paid marketing.",
    answers: [
      { label: "Yes, regularly", score: 2 },
      { label: "Sometimes", score: 1 },
      { label: "Not currently", score: 0 },
    ],
  },
  {
    id: "answers",
    question: "Can website visitors quickly get answers without calling or filling out a form?",
    answers: [
      { label: "Yes, most of the time", score: 0 },
      { label: "For some things", score: 1 },
      { label: "Not really", score: 2 },
    ],
  },
  {
    id: "pricing",
    question: "Can someone get any useful sense of price from your website before contacting you?",
    help: "This does not mean publishing your final prices or fixed quotes.",
    answers: [
      { label: "Yes", score: 0 },
      { label: "A little", score: 1 },
      { label: "No", score: 2 },
    ],
  },
  {
    id: "after-hours",
    question: "Outside normal hours, can your website move a serious customer forward on its own?",
    answers: [
      { label: "Yes, pretty well", score: 0 },
      { label: "To a point", score: 1 },
      { label: "Not beyond basic information", score: 2 },
    ],
  },
  {
    id: "enquiries",
    question: "Do enquiries usually arrive with enough information for your team to act on them quickly?",
    answers: [
      { label: "Usually", score: 0 },
      { label: "It varies", score: 1 },
      { label: "We often need to chase details", score: 2 },
    ],
  },
  {
    id: "content",
    question: "How much useful information have you already built up across your website and business?",
    help: "Product information, FAQs, services, processes, technical guidance, pricing rules or similar knowledge.",
    answers: [
      { label: "A lot", score: 2 },
      { label: "Some", score: 1 },
      { label: "Not much yet", score: 0 },
    ],
  },
];

const OPPORTUNITY_COPY: Record<string, string> = {
  marketing: "You are already investing to bring people in, so getting more value from that traffic matters.",
  answers: "Some visitors may still need your team before they can get the answer they came for.",
  pricing: "There is room to give people useful price confidence without publishing final quotes.",
  "after-hours": "Your website could move more serious prospects forward while your team is unavailable.",
  enquiries: "Better pre-qualification could reduce the back-and-forth before your team can act on an enquiry.",
  content: "You already have useful business knowledge that could be much easier for customers to access.",
};

type Result = {
  eyebrow: string;
  title: string;
  body: string;
};

type DemoModalStage = "choice" | "request" | "success";

function qualifierResult(score: number): Result {
  if (score >= 8) {
    return {
      eyebrow: "There is a clear opportunity here",
      title: "You look like a strong fit for the kinds of tools we build.",
      body: "You already have valuable pieces in place. The opportunity is to amplify what is already working by making more of that traffic, information and customer intent useful before your team has to step in. A focused working demo can often be ready in 1 to 3 days, so you can see the idea on your own website before deciding whether it is worth taking further.",
    };
  }

  if (score >= 4) {
    return {
      eyebrow: "Worth a closer look",
      title: "A few focused changes could make the journey much easier for your customers and your team.",
      body: "You already have some of this covered, which is a good starting point. We would focus only on the gaps that matter, then build around your existing website and quoting process rather than asking you to change everything.",
    };
  }

  return {
    eyebrow: "You have a lot covered already",
    title: "It looks like your current setup is doing a good job in most of these areas.",
    body: "That means the upside from a new tool may be more targeted, not that there is nothing to improve. If you want a second pair of eyes, we can still look for one useful improvement and tell you plainly if we do not think it is worth changing anything.",
  };
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="block h-4 w-4" fill="none">
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7" fill="currentColor">
      <path d="M8.5 6.7a1 1 0 0 1 1.52-.85l8.25 5.3a1 1 0 0 1 0 1.7l-8.25 5.3A1 1 0 0 1 8.5 17.3V6.7Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="block h-4 w-4" fill="none">
      <path d="m4 10.5 3.4 3.4L16 5.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="block h-4 w-4" fill="none">
      <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function OutreachVideo({ page }: { page: OutreachPageConfig }) {
  if (page.video?.src) {
    return (
      <video
        className="block aspect-video w-full bg-[#0a0b10] object-cover"
        controls
        playsInline
        preload="metadata"
        poster={page.video.poster}
      >
        <source src={page.video.src} />
        Your browser does not support embedded video.
      </video>
    );
  }

  return (
    <div className="relative grid aspect-video w-full place-items-center overflow-hidden bg-[#0a0b10] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(215,255,0,0.13),transparent_28%),radial-gradient(circle_at_18%_82%,rgba(255,255,255,0.08),transparent_30%)]" />
      <div className="relative flex flex-col items-center gap-4 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-[#d7ff00] text-[#0a0b10] shadow-[0_0_0_10px_rgba(215,255,0,0.08)]">
          <PlayIcon />
        </span>
        <div>
          <p className="m-0 text-sm font-semibold">Video placeholder</p>
          <p className="mt-1 text-xs text-white/55">The outreach video drops in here</p>
        </div>
      </div>
    </div>
  );
}

function ProofCard({
  eyebrow,
  title,
  body,
  href,
  external = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex min-h-[220px] flex-col rounded-[18px] border border-[var(--t3-light-border)] bg-white p-6 text-[#0a0b10] no-underline shadow-[0_10px_30px_rgba(24,31,51,0.045)] transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(215,255,0,.75)] hover:shadow-[0_18px_45px_rgba(24,31,51,0.09)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0b10]"
    >
      <p className="m-0 text-[11px] font-bold uppercase tracking-[0.16em] text-[#697180]">{eyebrow}</p>
      <h3 className="mb-3 mt-3 text-[1.35rem] font-semibold leading-[1.15] tracking-[-0.02em]">{title}</h3>
      <p className="m-0 text-[0.96rem] leading-[1.65] text-[#5e6674]">{body}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold">
        Take a look
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d7ff00] transition-transform duration-200 group-hover:translate-x-1">
          <ArrowIcon />
        </span>
      </span>
    </a>
  );
}

function FitCheckCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[220px] w-full flex-col rounded-[18px] border border-[#263142] bg-[radial-gradient(circle_at_90%_10%,rgba(215,255,0,.13),transparent_45%),#101722] p-6 text-left text-white shadow-[0_16px_40px_rgba(10,11,16,.12)] transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(215,255,0,.65)] hover:shadow-[0_20px_50px_rgba(10,11,16,.18)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0b10]"
    >
      <p className="m-0 text-[11px] font-bold uppercase tracking-[0.16em] text-[#d7ff00]">30-second fit check</p>
      <h3 className="mb-3 mt-3 text-[1.35rem] font-semibold leading-[1.15] tracking-[-0.02em]">Could we actually help your business?</h3>
      <p className="m-0 text-[0.96rem] leading-[1.65] text-[#b7c0cf]">Answer six quick questions. We will give you a straight answer based on where the biggest opportunities appear to be.</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold">
        Check your fit
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d7ff00] text-[#0a0b10] transition-transform duration-200 group-hover:translate-x-1">
          <ArrowIcon />
        </span>
      </span>
    </button>
  );
}

function FitCheck({ onBook, onDemo }: { onBook: () => void; onDemo: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const complete = step >= QUALIFIER_QUESTIONS.length;
  const total = useMemo(() => Object.values(answers).reduce((sum, value) => sum + value, 0), [answers]);
  const result = qualifierResult(total);
  const progress = complete ? 100 : ((step + 1) / QUALIFIER_QUESTIONS.length) * 100;
  const opportunities = useMemo(
    () => Object.entries(answers)
      .filter(([, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => OPPORTUNITY_COPY[id])
      .filter(Boolean),
    [answers],
  );

  function choose(question: QualifierQuestion, score: number) {
    setAnswers((current) => ({ ...current, [question.id]: score }));
    setStep((current) => current + 1);
  }

  function goBack() {
    setStep((current) => Math.max(0, current - 1));
  }

  function restart() {
    setAnswers({});
    setStep(0);
  }

  return (
    <div className="mt-6 scroll-mt-6 overflow-hidden rounded-[22px] border border-[#303d51] bg-[#101722] text-white shadow-[0_24px_70px_rgba(10,11,16,.16)]">
      <div className="border-b border-[#303d51] px-5 py-4 sm:px-7">
        <div className="flex items-center justify-between gap-4">
          <p className="m-0 text-xs font-bold uppercase tracking-[0.15em] text-[#d7ff00]">T3 Labs fit check</p>
          <p className="m-0 text-xs text-[#aab4c6]">{complete ? "Complete" : `Question ${step + 1} of ${QUALIFIER_QUESTIONS.length}`}</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#2b3648]" aria-hidden="true">
          <div
            className="h-full rounded-full bg-[#d7ff00] transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {!complete ? (
        <div className="min-h-[330px] px-5 py-7 sm:min-h-[300px] sm:px-7 sm:py-9">
          <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-[#aab4c6]">Quick question</p>
          <h3 className="mb-0 mt-3 max-w-[760px] text-[clamp(1.45rem,3vw,2.15rem)] font-semibold leading-[1.12] tracking-[-0.03em]">
            {QUALIFIER_QUESTIONS[step].question}
          </h3>
          <div className="min-h-[54px]">
            {QUALIFIER_QUESTIONS[step].help && (
              <p className="mb-0 mt-3 max-w-[720px] text-sm leading-[1.65] text-[#aab4c6]">{QUALIFIER_QUESTIONS[step].help}</p>
            )}
          </div>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
            {QUALIFIER_QUESTIONS[step].answers.map((answer) => (
              <button
                key={answer.label}
                type="button"
                onClick={() => choose(QUALIFIER_QUESTIONS[step], answer.score)}
                className="min-h-[58px] rounded-xl border border-[#303d51] bg-[#172131] px-4 py-3 text-left text-sm font-semibold text-white transition hover:border-[#d7ff00] hover:bg-[#1d293b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7ff00]"
              >
                {answer.label}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button type="button" onClick={goBack} className="mt-5 text-sm font-semibold text-[#aab4c6] underline decoration-[#4a586d] underline-offset-4 transition hover:text-white">
              Back one question
            </button>
          )}
        </div>
      ) : (
        <div className="px-5 py-7 sm:px-7 sm:py-9">
          <div className="grid max-w-[850px] gap-5">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#d7ff00] text-[#0a0b10]"><CheckIcon /></span>
            <div>
              <p className="m-0 text-xs font-bold uppercase tracking-[0.15em] text-[#d7ff00]">{result.eyebrow}</p>
              <h3 className="mb-0 mt-3 text-[clamp(1.7rem,3.4vw,2.7rem)] font-semibold leading-[1.05] tracking-[-0.035em]">{result.title}</h3>
              <p className="mb-0 mt-4 max-w-[780px] text-[1rem] leading-[1.75] text-[#b7c0cf]">{result.body}</p>
              {opportunities.length > 0 && (
                <div className="mt-5 grid gap-2.5">
                  {opportunities.map((opportunity) => (
                    <div key={opportunity} className="flex gap-3 rounded-xl border border-[#303d51] bg-[#172131] px-4 py-3 text-sm leading-[1.55] text-[#d7dce5]">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#d7ff00] text-[#0a0b10]"><CheckIcon /></span>
                      <span>{opportunity}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <button type="button" onClick={onDemo} className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#d7ff00] px-5 py-3 text-sm font-bold text-[#0a0b10] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(215,255,0,.18)]">
                Build my free demo <ArrowIcon />
              </button>
              <button type="button" onClick={onBook} className="inline-flex min-h-[46px] items-center justify-center px-4 text-sm font-semibold text-white underline decoration-[#4a586d] underline-offset-4 hover:decoration-[#d7ff00]">
                Or talk it through for 20 minutes
              </button>
              <button type="button" onClick={restart} className="min-h-[46px] px-3 text-sm font-semibold text-[#aab4c6] underline decoration-[#4a586d] underline-offset-4 hover:text-white">
                Start again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DemoRequestModal({
  page,
  open,
  onClose,
  onBook,
}: {
  page: OutreachPageConfig;
  open: boolean;
  onClose: () => void;
  onBook: () => void;
}) {
  const [stage, setStage] = useState<DemoModalStage>("choice");
  const [website, setWebsite] = useState(page.website ?? "");
  const [differentEmail, setDifferentEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  function close() {
    setStage("choice");
    setError("");
    setSubmitting(false);
    onClose();
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanWebsite = website.trim();
    const cleanEmail = email.trim();
    if (!cleanWebsite) {
      setError("Please enter the website you want us to use.");
      return;
    }
    if (differentEmail && !cleanEmail) {
      setError("Please enter the email address you want us to send the demo to.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/outreach-demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: page.slug,
          businessName: page.businessName,
          website: cleanWebsite,
          alternateEmail: differentEmail ? cleanEmail : undefined,
          delivery: differentEmail ? "alternate" : "original-outreach",
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "We could not send the request. Please try again.");
      setStage("success");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We could not send the request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0a0b10]/70 px-4 py-6 backdrop-blur-[6px] sm:py-10" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
      <button type="button" className="fixed inset-0 cursor-default" aria-label="Close dialog" onClick={close} />
      <div className="relative mx-auto w-full max-w-[720px] overflow-hidden rounded-[24px] border border-[#d8dde5] bg-[var(--t3-paper)] shadow-[0_30px_100px_rgba(0,0,0,.34)]">
        <div className="flex items-center justify-between border-b border-[#dde2e8] bg-white px-5 py-4 sm:px-7">
          <img src="/assets/t3-labs-black.png" alt="T3 Labs" className="h-auto w-[96px] object-contain" />
          <button type="button" onClick={close} className="grid h-10 w-10 place-items-center rounded-full border border-[#dde2e8] bg-white text-[#0a0b10] transition hover:border-[#aeb7c3] hover:bg-[#f5f6f8]" aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {stage === "choice" && (
          <div className="px-5 py-7 sm:px-8 sm:py-9">
            <p className="m-0 text-[11px] font-bold uppercase tracking-[0.17em] text-[#68707e]">A simple next step</p>
            <h2 id="demo-modal-title" className="mb-0 mt-3 max-w-[610px] text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-[#0a0b10]">
              See what this could look like on your own website.
            </h2>
            <p className="mb-0 mt-4 max-w-[620px] text-[1rem] leading-[1.72] text-[#5e6674]">
              Want to see it working before deciding anything? I'll build a simple version around your site and send you a private link to test. Usually ready in 1 to 3 days, completely free. That's how confident we are in what we build.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setStage("request")}
                className="group flex min-h-[185px] flex-col rounded-[18px] border border-[#263142] bg-[radial-gradient(circle_at_90%_10%,rgba(215,255,0,.17),transparent_44%),#101722] p-5 text-left text-white shadow-[0_16px_40px_rgba(10,11,16,.12)] transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(215,255,0,.82)] hover:shadow-[0_22px_50px_rgba(10,11,16,.2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7ff00] sm:p-6"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d7ff00]">Free, no obligation</span>
                <span className="mt-3 text-[1.35rem] font-semibold leading-[1.12] tracking-[-0.025em]">Get My Free Demo</span>
                <span className="mt-2 text-sm leading-[1.6] text-[#b7c0cf]">Confirm the website you want us to use. We'll handle the rest.</span>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold">Build my demo <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d7ff00] text-[#0a0b10] transition group-hover:translate-x-1"><ArrowIcon /></span></span>
              </button>

              <button
                type="button"
                onClick={onBook}
                className="group flex min-h-[185px] flex-col rounded-[18px] border border-[#d8dde5] bg-white p-5 text-left text-[#0a0b10] shadow-[0_10px_30px_rgba(24,31,51,.05)] transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(215,255,0,.82)] hover:shadow-[0_20px_46px_rgba(24,31,51,.11)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a0b10] sm:p-6"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#697180]">Prefer to talk?</span>
                <span className="mt-3 text-[1.35rem] font-semibold leading-[1.12] tracking-[-0.025em]">Book a free 20-minute call</span>
                <span className="mt-2 text-sm leading-[1.6] text-[#5e6674]">We can look at your website together and talk through what would actually be useful.</span>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold">Choose a time <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d7ff00] transition group-hover:translate-x-1"><ArrowIcon /></span></span>
              </button>
            </div>
          </div>
        )}

        {stage === "request" && (
          <form onSubmit={submitRequest} className="px-5 py-7 sm:px-8 sm:py-9">
            <button type="button" onClick={() => { setStage("choice"); setError(""); }} className="text-sm font-semibold text-[#5e6674] underline decoration-[#c5cad2] underline-offset-4 hover:text-[#0a0b10]">Back</button>
            <p className="mb-0 mt-6 text-[11px] font-bold uppercase tracking-[0.17em] text-[#68707e]">Your free demo</p>
            <h2 id="demo-modal-title" className="mb-0 mt-3 text-[clamp(1.8rem,4vw,2.7rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-[#0a0b10]">Tell us your current website.</h2>
            <p className="mb-0 mt-3 max-w-[610px] text-[0.98rem] leading-[1.68] text-[#5e6674]">Enter your website below and we'll create a separate basic website based on your real one. <strong className="font-semibold text-[#0a0b10]">(We don't edit your real website.)</strong></p>

            <label className="mt-7 block text-sm font-semibold text-[#0a0b10]">
              Website
              <input
                type="text"
                inputMode="url"
                autoComplete="url"
                value={website}
                onChange={(event) => setWebsite(event.target.value)}
                placeholder="https://yourwebsite.com"
                className="mt-2 min-h-[52px] w-full rounded-xl border border-[#cfd5dd] bg-white px-4 py-3 text-base font-normal text-[#0a0b10] outline-none transition placeholder:text-[#9ba3af] focus:border-[#a8bf00] focus:shadow-[0_0_0_4px_rgba(215,255,0,.18)]"
              />
            </label>

            <div className="mt-5 rounded-[16px] border border-[#d8dde5] bg-white p-4 sm:p-5">
              <div className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#d7ff00] text-[#0a0b10]"><CheckIcon /></span>
                <div>
                  <p className="m-0 text-sm font-semibold text-[#0a0b10]">Send the demo to the email address we originally contacted.</p>
                  <p className="mb-0 mt-1 text-sm leading-[1.55] text-[#68707e]">We will match this website to our outreach and send the private link there.</p>
                </div>
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-3 border-t border-[#edf0f3] pt-4 text-sm text-[#4f5866]">
                <input
                  type="checkbox"
                  checked={differentEmail}
                  onChange={(event) => setDifferentEmail(event.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#0a0b10]"
                />
                <span><strong className="font-semibold text-[#0a0b10]">Send it somewhere else instead</strong><br />Use a different email address for the demo link.</span>
              </label>

              {differentEmail && (
                <label className="mt-4 block text-sm font-semibold text-[#0a0b10]">
                  Different email address
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    className="mt-2 min-h-[50px] w-full rounded-xl border border-[#cfd5dd] bg-[#f8f9fa] px-4 py-3 text-base font-normal text-[#0a0b10] outline-none transition placeholder:text-[#9ba3af] focus:border-[#a8bf00] focus:bg-white focus:shadow-[0_0_0_4px_rgba(215,255,0,.18)]"
                  />
                </label>
              )}
            </div>

            {error && <p className="mb-0 mt-4 rounded-xl border border-[#efb8b8] bg-[#fff3f3] px-4 py-3 text-sm font-medium text-[#8b2828]">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0a0b10] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#151922] hover:shadow-[0_12px_30px_rgba(10,11,16,.18)] disabled:cursor-wait disabled:opacity-60"
            >
              {submitting ? "Sending request..." : "Build my free demo"}
              {!submitting && <span className="grid h-7 w-7 place-items-center rounded-full bg-[#d7ff00] text-[#0a0b10]"><ArrowIcon /></span>}
            </button>
            <p className="mb-0 mt-3 text-center text-xs leading-[1.55] text-[#7c8490]">Free. No obligation. Normally ready within 1 to 3 days.</p>
          </form>
        )}

        {stage === "success" && (
          <div className="px-5 py-10 text-center sm:px-8 sm:py-12">
            <span className="mx-auto grid h-13 w-13 place-items-center rounded-full bg-[#d7ff00] text-[#0a0b10]"><CheckIcon /></span>
            <p className="mb-0 mt-6 text-[11px] font-bold uppercase tracking-[0.17em] text-[#68707e]">Demo requested</p>
            <h2 id="demo-modal-title" className="mx-auto mb-0 mt-3 max-w-[560px] text-[clamp(1.8rem,4vw,2.7rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-[#0a0b10]">Perfect. We will build it around your website.</h2>
            <p className="mx-auto mb-0 mt-4 max-w-[560px] text-[1rem] leading-[1.7] text-[#5e6674]">We will create the basic working demo and send the private link when it is ready, normally within 1 to 3 days.</p>
            <button type="button" onClick={close} className="mt-7 min-h-[48px] rounded-xl bg-[#0a0b10] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#151922]">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function OutreachLandingPage({ page }: { page: OutreachPageConfig }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [fitOpen, setFitOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const moreRef = useRef<HTMLElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);

  function bookCall() {
    window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
  }

  function revealMore() {
    setMoreOpen(true);
    window.setTimeout(() => moreRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  function revealFit() {
    setFitOpen(true);
    window.setTimeout(() => fitRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }

  return (
    <main className="min-h-screen bg-[var(--t3-paper)] text-[var(--t3-black)]">
      <div className="mx-auto w-[min(980px,calc(100%-32px))] pb-16 pt-6 sm:w-[min(980px,calc(100%-48px))] sm:pb-20 sm:pt-8">
        <header className="flex items-center justify-between gap-4">
          <a href="/" aria-label="T3 Labs home" className="inline-flex items-center">
            <img src="/assets/t3-labs-black.png" alt="T3 Labs" className="h-auto w-[104px] object-contain sm:w-[116px]" />
          </a>
          {page.businessName && (
            <span className="max-w-[55%] truncate rounded-full border border-[var(--t3-light-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[#5e6674]">
              Made for {page.businessName}
            </span>
          )}
        </header>

        <section className="pb-4 pt-10 text-center sm:pb-6 sm:pt-14">
          <p className="m-0 text-[11px] font-bold uppercase tracking-[0.18em] text-[#68707e]">{page.eyebrow}</p>
          <h1 className="mx-auto mb-0 mt-4 max-w-[870px] text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[#0a0b10]">
            {page.title}
          </h1>
          <p className="mx-auto mb-0 mt-4 max-w-[650px] text-[clamp(1rem,2vw,1.15rem)] leading-[1.65] text-[#5e6674]">{page.intro}</p>
        </section>

        <section aria-label="Video message" className="mt-7 overflow-hidden rounded-[20px] border border-[#cfd5dd] bg-white shadow-[0_24px_70px_rgba(24,31,51,0.12)] sm:mt-9">
          <OutreachVideo page={page} />
        </section>

        <section aria-label="Choose a next step" className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2 sm:gap-4">
          <button
            type="button"
            onClick={() => setDemoOpen(true)}
            className="group flex min-h-[190px] flex-col rounded-[18px] border border-[#253044] bg-[radial-gradient(circle_at_90%_15%,rgba(215,255,0,.17),transparent_42%),#101722] p-5 text-left text-white shadow-[0_14px_34px_rgba(10,11,16,.11)] transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(215,255,0,.82)] hover:shadow-[0_20px_44px_rgba(10,11,16,.17)] sm:min-h-[210px] sm:p-6"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#d7ff00]">Free working demo</span>
            <span className="mt-3 text-[1.45rem] font-semibold leading-[1.12] tracking-[-0.025em]">Build me a quick demo based on my own website</span>
            <span className="mt-2 max-w-[430px] text-sm leading-[1.6] text-[#b7c0cf]">I'll build a basic demo using some of our best solutions, ready in 1 to 3 days for you to try. Completely free, no obligation.</span>
            <span className="mt-auto grid grid-cols-2 gap-3 pt-5 text-sm font-semibold">
              <span className="inline-flex items-center gap-2">
                <span>Get My Free Demo</span>
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d7ff00] text-[#0a0b10] leading-none transition-transform group-hover:translate-x-1"><ArrowIcon /></span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span>Prefer a 20-Minute Call?</span>
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d7ff00] text-[#0a0b10] leading-none transition-transform group-hover:translate-x-1"><ArrowIcon /></span>
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={revealMore}
            aria-expanded={moreOpen}
            aria-controls="outreach-more"
            className="group flex min-h-[190px] flex-col rounded-[18px] border border-[var(--t3-light-border)] bg-white p-5 text-left text-[#0a0b10] shadow-[0_10px_30px_rgba(24,31,51,0.045)] transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(215,255,0,.72)] hover:shadow-[0_18px_44px_rgba(24,31,51,.09)] sm:min-h-[210px] sm:p-6"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#697180]">Want to see more first?</span>
            <span className="mt-3 text-[1.45rem] font-semibold leading-[1.12] tracking-[-0.025em]">Show me what you actually build</span>
            <span className="mt-2 max-w-[410px] text-sm leading-[1.6] text-[#5e6674]">See working examples, a real roofing platform and QuoteCore+, or answer our 30-second questionnaire to see if our solutions could help you.</span>
            <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold">
              Take a look
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d7ff00] text-[#0a0b10] leading-none transition-transform group-hover:translate-x-1"><ArrowIcon /></span>
            </span>
          </button>
        </section>

        {moreOpen && (
          <section ref={moreRef} id="outreach-more" className="scroll-mt-6 pt-14 sm:pt-18" aria-labelledby="outreach-more-title">
            <div className="mb-6 max-w-[760px]">
              <p className="m-0 text-[11px] font-bold uppercase tracking-[0.18em] text-[#68707e]">A little more context</p>
              <h2 id="outreach-more-title" className="mb-0 mt-3 text-[clamp(1.8rem,4vw,3rem)] font-semibold leading-[1.04] tracking-[-0.04em]">A few ways to see what we mean.</h2>
              <p className="mb-0 mt-3 max-w-[680px] text-[1rem] leading-[1.7] text-[#5e6674]">These are examples, not a menu you have to choose from. We also build bespoke tools around the way individual businesses already work.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              <ProofCard
                eyebrow="Working roofing demo"
                title="Apex Roofing"
                body="A working example of customer-facing tools around a roofing website, including guidance, pricing and enquiry journeys."
                href={APEX_URL}
                external
              />
              <ProofCard
                eyebrow="Real working website"
                title="RoofHub"
                body="A live roofing website and platform we built for a real entity. This is production work in use today, not a concept demo or static mock-up."
                href={ROOFHUB_URL}
                external
              />
              <ProofCard
                eyebrow="Back-office software"
                title="QuoteCore+"
                body="Our estimating and quoting platform for construction teams, from measurement and pricing through to quotes, orders and job workflow."
                href={QUOTECORE_URL}
                external
              />
              <FitCheckCard onClick={revealFit} />
            </div>

            <div ref={fitRef} className="scroll-mt-6">{fitOpen && <FitCheck onBook={bookCall} onDemo={() => setDemoOpen(true)} />}</div>

            <div className="mt-8 rounded-[18px] border border-[var(--t3-light-border)] bg-white px-5 py-5 text-center sm:px-7">
              <p className="m-0 text-sm leading-[1.65] text-[#5e6674]">
                Need something completely different? That is fine too. Most of our work starts with a business problem, not a predefined product.
              </p>
            </div>
          </section>
        )}
      </div>

      <DemoRequestModal page={page} open={demoOpen} onClose={() => setDemoOpen(false)} onBook={bookCall} />
    </main>
  );
}
