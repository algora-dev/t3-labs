"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type StoryTokens = {
  bg: string; surface: string; surfaceAlt: string; border: string;
  text: string; muted: string; accent: string; accentText: string;
  accentInk: string; accentSoft: string;
};

const STEP_META = [
  { key: "old", label: "The old way", eyebrow: "01 / THE OLD WAY", headline: "The customer did all the work." },
  { key: "shift", label: "Buyers changing", eyebrow: "02 / THE WAY BUYERS ARE CHANGING", headline: "Now they expect the answer first." },
  { key: "build", label: "What we build", eyebrow: "03 / THAT IS WHAT WE BUILD", headline: "Your website should help them get the answer." },
];

const OLD_ACTIONS = [
  "Land on your website.",
  "Find the right page.",
  "Dig through products.",
  "Open the PDF.",
  "Understand the terminology.",
  "Compare the options.",
  "Work out the price.",
  "Calculate the quantity.",
];

const AI_QUESTIONS = [
  "What product do I need?",
  "What should it cost?",
  "How much do I need?",
  "Will it work for my job?",
];

export default function BuyerJourneyStory({ t, ctaAnchor = "#problem" }: { t: StoryTokens; ctaAnchor?: string }) {
  const [step, setStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const touchX = useRef<number | null>(null);

  const go = useCallback((dir: 1 | -1) => {
    setStep((s) => Math.min(STEP_META.length - 1, Math.max(0, s + dir)));
  }, []);

  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  }, [go]);

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    el.style.setProperty("--story-motion", mq.matches ? "none" : "rise .45s ease both");
    const fn = (e: MediaQueryListEvent) => el.style.setProperty("--story-motion", e.matches ? "none" : "rise .45s ease both");
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="buyer-story-heading"
      id="buyer-story"
      style={{ background: t.bg }}
      className="relative overflow-hidden py-16 sm:py-20"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(600px 300px at 70% 20%, ${t.accentSoft}, transparent 70%)` }} />
      <style>{`
        @keyframes rise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        #buyer-story .story-panel { animation: var(--story-motion, rise .45s ease both); }
        #buyer-story .story-tab[aria-selected="true"] { background: ${t.accent}; color: ${t.accentText}; border-color: ${t.accent}; }
        #buyer-story a:focus-visible, #buyer-story button:focus-visible { outline: 2px solid ${t.accent}; outline-offset: 2px; }
        @media (max-width: 880px) { #buyer-story .story-grid { grid-template-columns: 1fr; } }
      `}</style>

      <div className="relative mx-auto max-w-6xl px-5">
        <p className="text-xs font-semibold uppercase tracking-[.16em]" style={{ color: t.accentInk }}>The buyer journey</p>
        <h2 id="buyer-story-heading" className="mt-3 max-w-3xl text-3xl font-bold tracking-tight">Where most websites lose the buyer.</h2>

        {/* Progress rail */}
        <div role="tablist" aria-label="Buyer journey story steps" className="mt-8 flex flex-wrap items-center gap-2">
          {STEP_META.map((s, i) => (
            <button
              key={s.key}
              role="tab"
              aria-selected={step === i}
              aria-controls="story-panel"
              onClick={() => setStep(i)}
              className="story-tab rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors"
              style={{ borderColor: t.border, color: step === i ? t.accentText : t.muted, background: step === i ? t.accent : "transparent" }}
              type="button"
            >
              {`0${i + 1}`} · {s.label}
            </button>
          ))}
          <span className="ml-auto text-xs font-semibold" style={{ color: t.muted }}>{`0${step + 1} / 0${STEP_META.length}`}</span>
        </div>

        {/* Panel */}
        <div
          id="story-panel"
          role="tabpanel"
          tabIndex={0}
          onKeyDown={onKey}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="story-panel mt-6 rounded-2xl border p-6 sm:p-10"
          style={{ background: t.surface, borderColor: t.border }}
        >
          <div className="story-grid grid items-start gap-10 lg:grid-cols-2">
            {/* Copy column */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.14em]" style={{ color: t.accentInk }}>{STEP_META[step].eyebrow}</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight">{STEP_META[step].headline}</h3>

              {step === 0 && (
                <div className="mt-5">
                  <ul className="flex flex-wrap gap-2">
                    {OLD_ACTIONS.map((a) => (
                      <li key={a} className="rounded-full border px-3 py-1.5 text-sm" style={{ borderColor: t.border, color: t.muted, background: t.surfaceAlt }}>{a}</li>
                    ))}
                  </ul>
                  <p className="mt-6 text-xl font-bold leading-7">Most business websites are passive databases disguised as brochures.</p>
                  <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>They contain the answer. They just make the customer find it.</p>
                </div>
              )}

              {step === 1 && (
                <div className="mt-5">
                  <p className="text-sm leading-6" style={{ color: t.muted }}>More buyers are using ChatGPT, Gemini and AI-powered search to do the research for them.</p>
                  <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>Instead of opening ten websites and piecing together the answer themselves, they can ask one question.</p>
                  <ul className="mt-5 space-y-2">
                    {AI_QUESTIONS.map((q) => (
                      <li key={q} className="rounded-xl border px-4 py-2.5 text-sm font-medium" style={{ borderColor: t.border, background: t.surfaceAlt }}>{q}</li>
                    ))}
                  </ul>
                  <p className="mt-5 text-sm leading-6" style={{ color: t.muted }}>AI is doing more of the searching, comparing and explaining before the website visit even happens.</p>
                  <p className="mt-5 text-sm font-semibold leading-6">You cannot guarantee which business it recommends. But you can control what happens when the buyer reaches you.</p>
                </div>
              )}

              {step === 2 && (
                <div className="mt-5">
                  <p className="text-sm leading-6" style={{ color: t.muted }}>Instead of another product catalogue and contact form, give the buyer a useful next step.</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border p-4" style={{ borderColor: t.border, background: t.surfaceAlt }}>
                      <p className="text-xs font-semibold uppercase tracking-[.12em]" style={{ color: t.muted }}>I know roughly what I need</p>
                      <p className="mt-2 text-xl font-bold">Use the tool</p>
                      <ul className="mt-3 space-y-1 text-sm leading-6" style={{ color: t.muted }}>
                        <li>Calculate a price</li><li>Work out quantities</li><li>Compare products</li><li>Build a quote</li>
                      </ul>
                    </div>
                    <div className="rounded-xl border p-4" style={{ borderColor: t.border, background: t.surfaceAlt }}>
                      <p className="text-xs font-semibold uppercase tracking-[.12em]" style={{ color: t.muted }}>I need help figuring it out</p>
                      <p className="mt-2 text-xl font-bold">Ask the assistant</p>
                      <ul className="mt-3 space-y-1 text-sm leading-6" style={{ color: t.muted }}>
                        <li>Explain what they need</li><li>Ask questions naturally</li><li>Get product guidance</li><li>Work toward an enquiry or sale</li>
                      </ul>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-semibold">Better-informed customer <span aria-hidden style={{ color: t.accentInk }}>→</span> stronger enquiry, quote or order</p>
                  <p className="mt-5 text-sm leading-6">Give the customer a useful answer faster, while doing more of the work before your team gets involved.</p>
                  <p className="mt-5 text-sm font-bold">ChatGPT is the assistant for the entire internet. <span style={{ color: t.accentInk }}>We build the assistant for your business.</span></p>
                </div>
              )}

              {/* Controls */}
              <div className="mt-7 flex items-center gap-3">
                <button type="button" onClick={() => go(-1)} disabled={step === 0} className="rounded-full border px-5 py-2 text-sm font-semibold disabled:opacity-40" style={{ borderColor: t.border, color: t.text }}>Back</button>
                <button type="button" onClick={() => go(1)} disabled={step === STEP_META.length - 1} className="rounded-full px-5 py-2 text-sm font-semibold" style={{ background: t.accent, color: t.accentText }}>Next</button>
              </div>
            </div>

            {/* Visual column */}
            <div aria-hidden="true" className="order-first lg:order-none">
              {step === 0 && (
                <div className="rounded-2xl border p-4" style={{ borderColor: t.border, background: t.surfaceAlt }}>
                  <div className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: t.surface, border: `1px solid ${t.border}` }}>
                    <span className="text-sm font-bold">ACME ROOFING SUPPLIES</span>
                    <span className="text-xs" style={{ color: t.muted }}>Home · Products · Downloads · Contact</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {["Product A", "Product B", "Product C", "Product D", "Product E", "Product F"].map((p) => (
                      <div key={p} className="rounded-lg p-3" style={{ background: t.surface, border: `1px solid ${t.border}` }}>
                        <div className="h-2 w-3/4 rounded" style={{ background: t.border }} />
                        <div className="mt-2 h-2 w-1/2 rounded" style={{ background: t.border }} />
                        <p className="mt-2 text-xs" style={{ color: t.muted }}>{p}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["Technical spec (PDF)", "Price list 2026", "Contact us"].map((c) => (
                      <span key={c} className="rounded-full border px-3 py-1.5 text-xs" style={{ borderColor: t.border, color: t.muted }}>{c}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["Find the right product", "Open the PDF", "Compare options", "Calculate quantity"].map((l) => (
                      <span key={l} className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: t.accent, color: t.accentText }}>{l}</span>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="rounded-2xl border p-4" style={{ borderColor: t.border, background: t.surfaceAlt }}>
                  <div className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.border}` }}>
                    <p className="text-xs font-semibold uppercase tracking-[.12em]" style={{ color: t.muted }}>Buyer question</p>
                    <p className="mt-2 text-sm font-medium">I need roofing for a 120m² extension. What should I use and roughly what will it cost?</p>
                  </div>
                  <div className="mt-3 rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.border}` }}>
                    <p className="text-xs font-semibold uppercase tracking-[.12em]" style={{ color: t.muted }}>AI-style answer</p>
                    <div className="mt-2 space-y-2 text-sm" style={{ color: t.muted }}>
                      <p>Recommended system: standing-seam metal roof, 30° pitch</p>
                      <p>Approximate quantity: 132 m² including 10% waste</p>
                      <p>Next step: confirm profile and finish with a supplier</p>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-sm font-bold">10 tabs <span aria-hidden style={{ color: t.accentInk }}>→</span> 1 useful answer</p>
                </div>
              )}

              {step === 2 && (
                <div className="rounded-2xl border p-4" style={{ borderColor: t.border, background: t.surfaceAlt }}>
                  <div className="grid gap-3">
                    <div className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.border}` }}>
                      <p className="text-xs font-semibold uppercase tracking-[.12em]" style={{ color: t.muted }}>Path 1</p>
                      <p className="mt-1 text-sm font-bold">Use the tool</p>
                      <div className="mt-2 h-2 w-2/3 rounded" style={{ background: t.border }} />
                      <div className="mt-2 h-2 w-1/2 rounded" style={{ background: t.border }} />
                      <div className="mt-2 h-2 w-3/4 rounded" style={{ background: t.border }} />
                    </div>
                    <div className="rounded-xl p-3" style={{ background: t.surface, border: `1px solid ${t.border}` }}>
                      <p className="text-xs font-semibold uppercase tracking-[.12em]" style={{ color: t.muted }}>Path 2</p>
                      <p className="mt-1 text-sm font-bold">Ask the assistant</p>
                      <div className="mt-2 space-y-1.5">
                        <div className="h-2 w-1/2 rounded" style={{ background: t.border }} />
                        <div className="ml-auto h-2 w-2/5 rounded" style={{ background: t.accentSoft, border: `1px solid ${t.accent}` }} />
                        <div className="h-2 w-3/5 rounded" style={{ background: t.border }} />
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-center text-sm font-bold">Better-informed customer</p>
                  <p className="mt-1 text-center text-xs" style={{ color: t.muted }}>→ stronger enquiry, quote or order</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search / AI close */}
        <div className="mt-10 max-w-3xl">
          <p className="text-sm leading-6" style={{ color: t.muted }}>The same tools can also create clearer, more useful product, pricing, quantity and technical information.</p>
          <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>You cannot control whether AI chooses you. <strong style={{ color: t.text }}>But you can give it something worth finding.</strong></p>
          <p className="mt-5 text-5xl font-bold leading-tight tracking-tight">The goal is to become <span style={{ color: t.accentInk }}>the answer AI gives</span>, not a link it lists.</p>
          <a href={ctaAnchor} className="mt-6 inline-flex items-center gap-2 rounded-full border px-6 py-2.5 text-sm font-semibold transition-colors" style={{ borderColor: t.border, color: t.text }}>
            So where is your website making the customer do the work? <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
