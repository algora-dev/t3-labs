"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode } from "react";

/*
 * Roofing conversion pass, based on the supplied referred page shell.
 * The supplied header is preserved. All new body styles are scoped to .rp-content.
 * No new runtime dependencies. Do not remove the existing noindex route layout.
 */

type Theme = "dark" | "light";
type Business = "manufacturer" | "supplier" | "supply-install";
type Audience = "visitor" | "trade" | "team";
type Method = "known" | "plan" | "assistant";
type Currency = "GBP" | "USD";
type ContactMode = "representative" | "direct";
type Tokens = {
  bg: string; surface: string; surfaceAlt: string; border: string;
  text: string; muted: string; accent: string; accentText: string;
  accentInk: string; accentSoft: string;
};
type MediaShot = { src: string; alt: string };
type MediaSet = { shots: MediaShot[] };

const dark: Tokens = {
  bg: "#0a0b10", surface: "#101219", surfaceAlt: "#161927", border: "#262a3a",
  text: "#e8eaf2", muted: "#9aa1b5", accent: "#d7ff00", accentText: "#0a0b10",
  accentInk: "#d7ff00", accentSoft: "rgba(215,255,0,.08)",
};
const light: Tokens = {
  bg: "#fbfcff", surface: "#fff", surfaceAlt: "#f3f5fa", border: "#e7e9ef",
  text: "#0a0b10", muted: "#5a6172", accent: "#d7ff00", accentText: "#0a0b10",
  accentInk: "#809000", accentSoft: "rgba(215,255,0,.18)",
};

// IMPLEMENTATION: confirm these settings before publishing. No URLs are inferred.
const CONFIG = {
  // Keep the supplied referral page safe. Set to "direct" only on a direct T3 page.
  contactMode: "representative" as ContactMode,
  // Existing T3 booking URL from the supplied direct page. Confirm it reaches Shaun.
  shaunBookingUrl: "https://calendly.com/cece-t3labs/20min",
  // Optional, approved representative contact URL. Never read this from user query input.
  representativeContactUrl: "",
  // Must be the MAIN Apex demo website. The supplied deep tool link was not reused.
  apexDemoHomeUrl: "https://t3labs.tech/demo/roofing-site",
  currencyEndpoint: "/api/roofing-region",
  currencyPreferenceKey: "t3-roofing-price-currency",
  // Real screenshots from the Apex Roofing demo, ordered as a short flick-through story per card.
  media: {
    plan: {
      shots: [
        { src: "/assets/roofing-solutions/plan-1-takeoff-canvas.jpg", alt: "Digital takeoff canvas with a roof plan and ridges, hips, valleys and eaves measured as coloured lines" },
        { src: "/assets/roofing-solutions/plan-2-measurement-choice.jpg", alt: "Choice between entering actual measurements or measuring from a plan with pitch-adjusted lengths" },
        { src: "/assets/roofing-solutions/result-quote-output.jpg", alt: "Result screen with materials and labour totals and next actions, including continuing in QuoteCore+" },
      ],
    },
    known: {
      shots: [
        { src: "/assets/roofing-solutions/known-1-roof-area-entry.jpg", alt: "Guided roof area entry with width by length, product selection and waste allowance" },
        { src: "/assets/roofing-solutions/known-2-pricing-choice.jpg", alt: "Choice between material only and material and install pricing, with the job type selected" },
        { src: "/assets/roofing-solutions/result-quote-output.jpg", alt: "Result screen with materials and labour totals and next actions, including continuing in QuoteCore+" },
      ],
    },
    assistant: {
      shots: [
        { src: "/assets/roofing-solutions/assistant-1-start-options.jpg", alt: "Smart Assistant start screen offering an estimate, a roofing question, finding something or preparing an enquiry" },
        { src: "/assets/roofing-solutions/assistant-2-enquiry-questions.jpg", alt: "Smart Assistant gathering job details conversationally, asking about roof pitch and roof shape" },
        { src: "/assets/roofing-solutions/assistant-3-product-question.jpg", alt: "Smart Assistant answering a product question about underlay for a tiled roof" },
        { src: "/assets/roofing-solutions/assistant-4-saving-code.jpg", alt: "Saving code offer shown to the customer before completing the enquiry" },
      ],
    },
  } satisfies Record<Method, MediaSet>,
// Optional page explainer. Retired: replaced by the YouTube embed in the opening section.
};

// These are the two agreed regional entry prices, not an exchange-rate conversion.
const PRICES: Record<Currency, { amount: string; name: string }> = {
  GBP: { amount: "£749", name: "GBP" },
  USD: { amount: "US$999", name: "USD" },
};

const BUSINESS_CHOICES: { id: Business; label: string }[] = [
  { id: "manufacturer", label: "Manufacturer" },
  { id: "supplier", label: "Supplier" },
  { id: "supply-install", label: "Supply + install" },
];

type Story = {
  label: string;
  benefit: string;
  question: string;
  body: string;
  result: string;
  businessBenefit: string;
};
type Profile = {
  label: string;
  question: string;
  examples: string[];
  reflection: string;
  stories: Record<Audience, Story>;
};

const BASE_STORIES: Record<Audience, Story> = {
  visitor: {
    label: "New visitors", benefit: "An answer before calling",
    question: "What do I need, and roughly what might it cost?",
    body: "A visitor can enter measurements, measure a plan or ask the Smart Assistant. They get product guidance or a preliminary estimate before deciding whether to enquire.",
    result: "A useful first answer",
    businessBenefit: "A clearer starting point if they contact your team.",
  },
  trade: {
    label: "Roofing customers", benefit: "Prepare their own jobs",
    question: "Let me price this job using the products I normally buy.",
    body: "A roofing customer can work out quantities, use approved products and account pricing, then prepare a material list or quote themselves.",
    result: "A prepared job or material list",
    businessBenefit: "Less work to place the next order with you.",
  },
  team: {
    label: "Your team", benefit: "Staff features and controls",
    question: "Use our pricing and rules to prepare this quote.",
    body: "A staff version can add different rates, margins, permissions and quote features while using the same underlying product and job information.",
    result: "A quote ready for staff review",
    businessBenefit: "Less repeated entry and calculation.",
  },
};

const GENERAL: Profile = {
  label: "Roofing businesses",
  question: "What if customers could get product answers, quantities and useful pricing before your team had to get involved?",
  examples: [
    "Get answers to common roofing questions",
    "Know which products suit their job",
    "Know which products and accessories work together",
    "Work out quantities from measurements or a plan",
    "Build a multi-product estimate or preliminary quote",
    "Send your team a better-prepared enquiry",
  ],
  reflection: "Which of these is taking up your team's time today?",
  stories: BASE_STORIES,
};

const PROFILES: Record<Business, Profile> = {
  manufacturer: {
    label: "Roofing manufacturers",
    question: "What if customers could understand your roofing systems and know what works together before calling your team?",
    examples: [
      "Get answers to product and technical questions",
      "Know which roofing system suits an application",
      "Know which products and accessories work together",
      "Understand coverage, packaging and quantities",
      "Prepare a multi-product material list",
      "Send a better-prepared technical or sales enquiry",
    ],
    reflection: "How much of this knowledge depends on one or two people explaining it again?",
    stories: {
      visitor: {
        label: "New visitors", benefit: "Understand your systems",
        question: "Which roofing system suits this project?",
        body: "A visitor can ask a product question or work through a guided tool using your approved information before contacting sales or technical support.",
        result: "Product guidance and a clearer requirement",
        businessBenefit: "Less basic explanation at the start of an enquiry.",
      },
      trade: {
        label: "Roofers & specifiers", benefit: "Build their own product list",
        question: "Which products and accessories do I need for this system?",
        body: "They can enter or measure the job, select an approved system and prepare quantities and a product list themselves.",
        result: "A prepared system and material list",
        businessBenefit: "Make your products easier to specify and choose again.",
      },
      team: {
        label: "Your team", benefit: "Staff features and controls",
        question: "Build the product schedule using our approved systems.",
        body: "An internal version can add staff permissions, product options and review steps while sharing the same catalogue and calculations.",
        result: "A product schedule ready for review",
        businessBenefit: "Less time rebuilding the same product information.",
      },
    },
  },
  supplier: {
    label: "Roofing suppliers",
    question: "What if customers could get product answers, quantities and useful pricing before your team had to get involved?",
    examples: [
      "Get basic or indicative pricing",
      "Work out how much material they need",
      "Know which products suit the job",
      "Know which products and accessories work together",
      "Build a multi-product estimate or preliminary quote",
      "Send a more complete enquiry or order request",
    ],
    reflection: "How many of these currently become a phone call, email or manual quote?",
    stories: BASE_STORIES,
  },
  "supply-install": {
    label: "Supply + install businesses",
    question: "What if customers could get roofing answers and an initial project estimate before your team had to get involved?",
    examples: [
      "Get answers to common roofing questions",
      "Know which products may suit their project",
      "Enter measurements or measure a plan",
      "Get a preliminary supply-and-install estimate",
      "Know what information a formal quote needs",
      "Send a better-prepared project enquiry",
    ],
    reflection: "What would it mean if the first conversation started with a better-prepared customer?",
    stories: {
      visitor: {
        label: "New visitors", benefit: "A clearer idea of the job",
        question: "What might a new roof cost for my property?",
        body: "They can enter measurements, measure a plan or ask the Smart Assistant. It gathers the basics for a preliminary estimate, with site-specific decisions left to your team.",
        result: "An initial estimate and project details",
        businessBenefit: "A more useful first conversation or site visit.",
      },
      trade: {
        label: "Roofing customers", benefit: "Prepare their own estimates",
        question: "Let me prepare this roof estimate using our usual specification.",
        body: "Repeat customers can measure the job, select your products and use permitted rates to prepare an estimate themselves before sending it for confirmation.",
        result: "A prepared estimate, not just an uploaded plan",
        businessBenefit: "Your estimator starts further along, with less chasing.",
      },
      team: {
        label: "Your team", benefit: "Staff features and controls",
        question: "Prepare this quote with our materials, labour and margins.",
        body: "A staff version can add labour, margins, pricing overrides and approvals while sharing the same products, calculations and job details.",
        result: "A supply-and-install quote for review",
        businessBenefit: "Less duplicate work, with judgement kept in the team.",
      },
    },
  },
};

const AUDIENCES: Audience[] = ["visitor", "trade", "team"];
const METHODS: { id: Method; title: string; body: string }[] = [
  { id: "plan", title: "Measure a plan", body: "Carry measured quantities into an estimate or enquiry." },
  { id: "known", title: "Enter measurements", body: "Turn known dimensions into quantities and preliminary pricing." },
  { id: "assistant", title: "Ask the Smart Assistant", body: "Get product answers or preliminary pricing, with human handoff when needed." },
];

function scrollToId(id: string) {
  if (typeof window === "undefined") return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="rp-disclosure">
      <summary><span>{title}</span><span className="rp-plus" aria-hidden="true">+</span></summary>
      <div className="rp-disclosure-body">{children}</div>
    </details>
  );
}

function AudienceExamples({ profile }: { profile: Profile }) {
  const [active, setActive] = useState<Audience>("visitor");
  const index = AUDIENCES.indexOf(active);
  function activate(next: number, focus = false) {
    const id = AUDIENCES[(next + AUDIENCES.length) % AUDIENCES.length];
    setActive(id);
    if (focus) document.getElementById(`rp-tab-${id}`)?.focus();
  }
  function onKey(event: KeyboardEvent<HTMLButtonElement>, tabIndex: number) {
    if (event.key === "ArrowRight") { event.preventDefault(); activate(tabIndex + 1, true); }
    if (event.key === "ArrowLeft") { event.preventDefault(); activate(tabIndex - 1, true); }
    if (event.key === "Home") { event.preventDefault(); activate(0, true); }
    if (event.key === "End") { event.preventDefault(); activate(AUDIENCES.length - 1, true); }
  }
  return (
    <div className="rp-audience">
      <div className="rp-tabs" role="tablist" aria-label="Who benefits from the tools">
        {AUDIENCES.map((id, i) => (
          <button type="button" key={id} id={`rp-tab-${id}`} role="tab"
            aria-selected={active === id} aria-controls={`rp-panel-${id}`}
            tabIndex={active === id ? 0 : -1} onClick={() => setActive(id)} onKeyDown={e => onKey(e, i)}>
            <strong>{profile.stories[id].label}</strong><span>{profile.stories[id].benefit}</span>
          </button>
        ))}
      </div>
      {AUDIENCES.map(id => {
        const story = profile.stories[id];
        return (
          <div key={id} id={`rp-panel-${id}`} role="tabpanel" aria-labelledby={`rp-tab-${id}`}
            hidden={id !== active} tabIndex={0} className="rp-audience-panel">
            <div>
              <blockquote>“{story.question}”</blockquote>
              <p>{story.body}</p>
            </div>
            <div className="rp-result">
              <p className="rp-meta">Useful result</p><strong>{story.result}</strong>
              <p className="rp-result-benefit">{story.businessBenefit}</p>
            </div>
          </div>
        );
      })}
      <div className="rp-carousel-controls">
        <button className="rp-text-button" type="button" onClick={() => activate(index - 1)} aria-label="Previous user example">← Previous</button>
        <span role="status" aria-live="polite">{index + 1} of {AUDIENCES.length}</span>
        <button className="rp-text-button" type="button" onClick={() => activate(index + 1)} aria-label="Next user example">Next →</button>
      </div>
    </div>
  );
}

// Illustrations are deliberately not labelled as screenshots or live product results.
function Illustration({ method }: { method: Method }) {
  return (
    <div className={`rp-illustration rp-illustration-${method}`} aria-hidden="true">
      {method === "known" && <>
        <div className="rp-illustration-top">Known roof area <strong>180 m²</strong></div>
        <div className="rp-illustration-row"><span>Your products</span><b>Selected</b></div>
        <div className="rp-illustration-row"><span>Quantities</span><b>Prepared</b></div>
        <div className="rp-illustration-answer">Preliminary result → Enquiry</div>
      </>}
      {method === "plan" && <>
        <div className="rp-illustration-top">Plan measurement <strong>Known scale</strong></div>
        <svg viewBox="0 0 340 140" focusable="false">
          <path d="M45 105 L82 34 L173 18 L291 62 L261 120 L139 126 Z" />
          <path d="M82 34 L139 126 M173 18 L261 120 M45 105 L291 62" />
          <circle cx="82" cy="34" r="5" /><circle cx="261" cy="120" r="5" />
        </svg>
        <div className="rp-illustration-answer">Measured areas → Quantities</div>
      </>}
      {method === "assistant" && <>
        <div className="rp-illustration-top">Smart Assistant</div>
        <div className="rp-bubble rp-bubble-user">Which accessories go with this product?</div>
        <div className="rp-bubble">Which product and roofing system are you using?</div>
        <div className="rp-illustration-answer">Approved guidance → Next step</div>
      </>}
    </div>
  );
}

function MethodCarousel({ method, expanded = false, title, onImageClick }: { method: Method; expanded?: boolean; title: string; onImageClick?: () => void }) {
  const shots = CONFIG.media[method].shots;
  const count = shots.length;
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  function go(next: number) { if (count) setIndex(((next % count) + count) % count); }
  function onTouchStart(event: React.TouchEvent) {
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  function onTouchEnd(event: React.TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const dx = event.changedTouches[0].clientX - start.x;
    const dy = event.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); }
  }
  const shot = shots[index];
  return (
    <div className="rp-carousel" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onKeyDown={onKeyDown}
      tabIndex={0} role="group" aria-roledescription="carousel" aria-label={`${title} example (${index + 1} of ${count})`}>
      <div className="rp-carousel-track">
        {!shot || failed ? <Illustration method={method} /> : onImageClick ? (
          <button type="button" className="rp-media-open" onClick={onImageClick} aria-haspopup="dialog"
            aria-label={`Enlarge ${title.toLowerCase()} example`}>
            <img key={`${shot.src}-${index}`} src={shot.src} alt={shot.alt}
              loading={expanded ? "eager" : "lazy"} decoding="async"
              onError={() => setFailed(true)} className="rp-screenshot" />
          </button>
        ) : (
          <img key={`${shot.src}-${index}`} src={shot.src} alt={shot.alt}
            loading={expanded ? "eager" : "lazy"} decoding="async"
            onError={() => setFailed(true)} className="rp-screenshot" />
        )}
      </div>
      {count > 1 && <div className="rp-carousel-nav">
        <button type="button" className="rp-carousel-arrow" onClick={() => go(index - 1)} aria-label="Previous example">←</button>
        <div className="rp-carousel-dots" role="group" aria-label="Choose example">
          {shots.map((s, i) => (
            <button key={`${s.src}-${i}`} type="button" className={i === index ? "rp-dot rp-dot-active" : "rp-dot"}
              aria-label={`Example ${i + 1} of ${count}`} aria-current={i === index} onClick={() => go(i)} />
          ))}
        </div>
        <button type="button" className="rp-carousel-arrow" onClick={() => go(index + 1)} aria-label="Next example">→</button>
        <span className="rp-sr-only" role="status" aria-live="polite">{index + 1} of {count}</span>
      </div>}
    </div>
  );
}

function MediaDialog({ method, onClose }: { method: Method; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = METHODS.find(item => item.id === method)!.title;
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      element.close();
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog ref={dialog} className="rp-dialog" aria-labelledby="rp-dialog-title"
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const r = event.currentTarget.getBoundingClientRect();
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) onClose();
      }}>
      <div className="rp-dialog-top"><h2 id="rp-dialog-title">{title}</h2>
        <button type="button" onClick={onClose} className="rp-outline" autoFocus aria-label="Close enlarged example">Close ×</button>
      </div>
      <div className="rp-dialog-media">
        <MethodCarousel method={method} expanded title={title} />
      </div>
      <p className="rp-media-note">Example workflow from the Apex Roofing demo. Products, pricing and setup can be tailored to your business.</p>
    </dialog>
  );
}

function MediaExamples() {
  const [open, setOpen] = useState<Method | null>(null);
  return (
    <>
      <div className="rp-media-grid">
        {METHODS.map(item => {
          const shots = CONFIG.media[item.id].shots;
          return (
            <article key={item.id} className="rp-media-card">
              <div className="rp-media-frame">
                <MethodCarousel method={item.id} title={item.title} onImageClick={() => setOpen(item.id)} />
              </div>
              <div className="rp-media-copy"><h3>{item.title}</h3><p>{item.body}</p>
                {!shots.length && <span className="rp-meta">Workflow illustration</span>}
              </div>
            </article>
          );
        })}
      </div>
      {open && <MediaDialog key={open} method={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function useCurrency() {
  const [currency, setCurrency] = useState<Currency | null>(null);
  const manuallyChosen = useRef(false);
  useEffect(() => {
    let saved: string | null = null;
    try { saved = window.localStorage.getItem(CONFIG.currencyPreferenceKey); } catch { /* Storage can be blocked. */ }
    if (saved === "GBP" || saved === "USD") { manuallyChosen.current = true; setCurrency(saved); return; }
    const controller = new AbortController();
    let alive = true;
    const timeout = window.setTimeout(() => controller.abort(), 3000);
    async function resolve() {
      let next: Currency = "USD";
      try {
        const response = await fetch(CONFIG.currencyEndpoint, { cache: "no-store", credentials: "same-origin", signal: controller.signal });
        if (!response.ok) throw new Error("Country unavailable");
        const data: unknown = await response.json();
        if (data && typeof data === "object" && "currency" in data && data.currency === "GBP") next = "GBP";
      } catch { /* Clear, manually changeable USD fallback. No third-party IP lookup. */ }
      finally {
        window.clearTimeout(timeout);
        if (alive && !manuallyChosen.current) setCurrency(next);
      }
    }
    void resolve();
    return () => { alive = false; controller.abort(); window.clearTimeout(timeout); };
  }, []);
  function choose(next: Currency) {
    manuallyChosen.current = true;
    setCurrency(next);
    try { window.localStorage.setItem(CONFIG.currencyPreferenceKey, next); } catch { /* Preference still works for this visit. */ }
  }
  return { currency, choose };
}

function PricingClose({ businessLabel, variant }: { businessLabel: string; variant: "referred" | "direct" }) {
  const { currency, choose } = useCurrency();
  return (
    <section className="rp-section rp-close" id="pricing" aria-labelledby="rp-price-title">
      <div className="rp-close-inner" id="next-step">
        <h2 id="rp-price-title">Start with one useful improvement.</h2>
        <div className="rp-price-block">
          <p>Focused roofing solutions from</p>
          <div className="rp-price" aria-live="polite" aria-atomic="true">
            {currency ? PRICES[currency].amount : <span className="rp-price-loading">Loading price…</span>}
          </div>
          {currency && <p className="rp-price-note">Excludes any tax or ongoing costs.</p>}
          <div className="rp-currency" role="group" aria-label="Choose pricing currency">
            <button type="button" aria-pressed={currency === "GBP"} onClick={() => choose("GBP")}>GBP £</button>
            <button type="button" aria-pressed={currency === "USD"} onClick={() => choose("USD")}>USD US$</button>
          </div>
        </div>
        <p className="rp-close-lead">A focused tool, configured around your products and rules.</p>
        <p className="rp-turnaround">Basic setups can be live within days after receiving the relevant information from you.</p>
        <p className="rp-payment"><strong>Flexible payment options available.</strong></p>
        <div className="rp-close-action">
          {variant === "referred" ? <>
            <div className="rp-reflection rp-close-rep"><p>Arrange a meeting with T3 Labs via your current contact person.</p></div>
          </> : <>
            <a className="rp-primary" href={CONFIG.shaunBookingUrl} target="_blank" rel="noopener noreferrer">Book a free call with Shaun <span aria-hidden="true">→</span></a>
            <p>Discuss what would help, what it could cost and how soon it could be ready. No obligation.</p>
          </>}
        </div>
        {variant === "direct" && <Disclosure title="Who's Shaun?">
          <p>Shaun is an ex-roofer with 20 years of experience across roofing and technology. He now builds solutions around how roofing businesses work.</p>
          <p>The conversation is about finding what would help, not selling you features you do not need.</p>
        </Disclosure>}
      </div>
    </section>
  );
}

export function RoofingSolutionsPage({ variant }: { variant: "referred" | "direct" }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [business, setBusiness] = useState<Business | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (event: globalThis.KeyboardEvent) => { if (event.key === "Escape") setVideoOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [videoOpen]);
  const t = theme === "dark" ? dark : light;
  const profile = business ? PROFILES[business] : GENERAL;
  const style = {
    background: t.bg, color: t.text,
    "--accent": t.accent, "--accent-ink": t.accentInk,
    "--rp-bg": t.bg, "--rp-surface": t.surface, "--rp-raised": t.surfaceAlt,
    "--rp-border": t.border, "--rp-text": t.text, "--rp-muted": t.muted,
    "--rp-accent": t.accent, "--rp-accent-ink": theme === "light" ? "#5d6b00" : t.accentInk,
    "--rp-soft": t.accentSoft,
  } as CSSProperties;
  return (
    <main style={style} className="min-h-screen antialiased">
      <style>{HEADER_STYLES}</style>
      <header style={{background:theme==="dark"?"rgba(10,11,16,.88)":"rgba(251,252,255,.92)",borderColor:t.border}} className="sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-2 font-semibold" aria-label="T3 Labs">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{background:"#0a0b10"}}><img src="/assets/t3-logo-white.png" alt="T3 Labs" className="h-7 w-7" /></span>
            <span className="hidden text-sm sm:inline" style={{color:t.muted}}>Labs</span>
          </div>
          <nav className="hidden items-center gap-5 text-sm lg:flex" style={{color:t.muted}}>
            <button onClick={()=>scrollToId("problem")}>The Problem</button>
            <button onClick={()=>scrollToId("solution")}>The Solution</button>
            <button onClick={()=>scrollToId("assistant")}>How It Works</button>
            <button onClick={()=>scrollToId("pricing")}>Pricing</button>
            <button onClick={()=>scrollToId("demos")}>Demos</button>
            <button onClick={()=>scrollToId("assessment")}>Quick Check</button>
          </nav>
          <div className="flex items-center gap-2">
            <button type="button" onClick={()=>setTheme(theme==="dark"?"light":"dark")} style={{borderColor:t.border,color:t.muted}} className="btn-outline rounded-full border px-3 py-1.5 text-xs font-medium">
              {theme==="dark"?"☀ Light":"☾ Dark"}
            </button>
            <button
              type="button"
              onClick={()=>scrollToId("next-step")}
              style={{background:t.accent,color:t.accentText}}
              className="btn-solid hidden rounded-full px-4 py-1.5 text-xs font-semibold sm:inline-flex"
            >
              Next step
            </button>
          </div>
        </div>
      </header>
      <div className="rp-content" data-theme={theme}>
        <style>{STYLES}</style>
        {variant === "referred" && <div className="rp-referral-note">Shared by your T3 Labs representative. They remain your point of contact.</div>}
        <div className="rp-shell">
          <section className="rp-section rp-opening" aria-labelledby="rp-title">
            <p className="rp-eyebrow">T3 Labs roofing solutions</p>
            <h1 id="rp-title">Which best describes your roofing business?</h1>
            <p className="rp-opening-copy">Help customers get roofing answers, quantities and pricing before calling. Choose your business type to see relevant examples.</p>
            <div className="rp-business" role="group" aria-label="Choose your roofing business type">
              {BUSINESS_CHOICES.map(item => <button type="button" key={item.id} aria-pressed={business === item.id}
                onClick={() => setBusiness(item.id)}><span>{item.label}</span><span className="rp-select-status">{business === item.id ? "Selected" : "Choose →"}</span></button>)}
            </div>
            <p className="rp-choice-note">Or keep reading for the general roofing examples.</p>
            <span className="rp-sr-only" role="status">{business ? `Examples updated for ${profile.label.toLowerCase()}.` : "General roofing examples shown."}</span>
            <button type="button" className="rp-explainer-row" onClick={() => setVideoOpen(true)} aria-haspopup="dialog">
              <span className="rp-explainer-copy">
                <strong>Prefer to watch?</strong> The short video explains the problem and our solution.
                <span className="rp-explainer-cta">Watch the video →</span>
              </span>
              <span className="rp-explainer-thumb" aria-hidden="true">
                <img src="https://i.ytimg.com/vi/FIqNbi3bG7A/hqdefault.jpg" alt="" loading="lazy" />
                <span className="rp-explainer-play">▶</span>
              </span>
            </button>
            {videoOpen && (
              <div className="rp-video-modal" role="dialog" aria-modal="true" aria-label="Explainer video" onClick={() => setVideoOpen(false)}>
                <div className="rp-video-modal-box" onClick={event => event.stopPropagation()}>
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/FIqNbi3bG7A?rel=0&autoplay=1"
                    title="The problem and our solution — short explainer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                  <button type="button" className="rp-video-close" onClick={() => setVideoOpen(false)} aria-label="Close video">✕</button>
                </div>
              </div>
            )}
            <div className="rp-opportunity" id="problem">
              <p className="rp-eyebrow">For {profile.label.toLowerCase()}</p>
              <h2>{profile.question}</h2>
              <ul className="rp-examples">{profile.examples.map(item => <li key={item}><span aria-hidden="true">✓</span><span>{item}</span></li>)}</ul>
              <div className="rp-reflection"><p>{profile.reflection}</p></div>
            </div>
            <p className="rp-bridge">Even if just one of these would help, we can build a solution around it.</p>
          </section>

          <section className="rp-section" id="solution" aria-labelledby="rp-solution-title">
            <div className="rp-section-heading"><p className="rp-eyebrow">Two ways to help</p><h2 id="rp-solution-title">We build the tools that make it possible.</h2></div>
            <div className="rp-solutions">
              <article><h3>Interactive tools</h3><p>Customers measure a job, choose your products and get quantities or preliminary pricing.</p></article>
              <article id="assistant"><h3>Smart Assistant</h3><p>Customers ask a question. It uses your approved information to answer, clarify or pass the enquiry to your team.</p></article>
            </div>
            <div className="rp-reflection rp-shared-outcome"><p>Either route is designed to give the customer a faster answer, or push them to your team with a better-prepared enquiry.</p></div>
            <div className="rp-setup">
              <h3>You explain how you work. We handle the setup.</h3>
              <p>We use your existing product information and focused conversations to agree the answers, pricing and handoffs. We handle the build and setup.</p>
              <p className="rp-setup-promise">A focused first version can work alongside your current website and enquiry process.</p>
              <Disclosure title="What would you need from us?">
                <p>For a basic setup, we aim to keep your input to a few focused conversations and a review. We agree what is needed before starting, rather than asking your team to manage a software project.</p>
                <ul>
                  <li><strong>Your products:</strong> the information, uses and compatible accessories you approve.</li>
                  <li><strong>Your pricing:</strong> quantities, coverage, packaging, waste and rates to use.</li>
                  <li><strong>Your answers:</strong> what can be shared publicly and what must stay private.</li>
                  <li><strong>Your handoff:</strong> when to gather more details or involve a person.</li>
                </ul>
                <p>We configure and test around those rules. Missing information or questions outside the agreed scope should lead to clarification or a human handoff, not an invented answer.</p>
              </Disclosure>
            </div>
          </section>

          <section className="rp-section" id="roof-people" aria-labelledby="rp-people-title">
            <div className="rp-section-heading"><p className="rp-eyebrow">One system, three users</p><h2 id="rp-people-title">Useful for customers. Useful for your team.</h2><p>Select an example, or use the arrows.</p></div>
            <AudienceExamples profile={profile} />
          </section>

          <section className="rp-section" id="demos" aria-labelledby="rp-demos-title">
            <div className="rp-section-heading"><p className="rp-eyebrow">See how it works</p><h2 id="rp-demos-title">Three ways to get a useful result.</h2><p>Open any example to see it larger. Each can use your products and rules.</p></div>
            <MediaExamples />
            {CONFIG.apexDemoHomeUrl && <div className="rp-demo-card">
              <a href={CONFIG.apexDemoHomeUrl} target="_blank" rel="noopener noreferrer" className="rp-demo-shot" aria-label="Open the Apex Roofing demo website">
                <img src="/assets/roofing-solutions/apex-demo-home.jpg" alt="Apex Roofing demo website homepage" loading="lazy" />
              </a>
              <a href={CONFIG.apexDemoHomeUrl} target="_blank" rel="noopener noreferrer" className="rp-demo-btn">Explore the Apex Roofing demo website ↗</a>
            </div>}
          </section>

          <section className="rp-section" id="roof-value" aria-labelledby="rp-value-title">
            <div className="rp-section-heading"><p className="rp-eyebrow">The practical difference</p><h2 id="rp-value-title">Less waiting for them. Less chasing for you.</h2></div>
            <div className="rp-benefits">
              <article><h3>Faster answers</h3><p>Help interested buyers take the next step instead of waiting or looking elsewhere.</p></article>
              <article><h3>Better enquiries</h3><p>Receive the roof details, product choices and questions already gathered.</p></article>
              <article><h3>Less repeat work</h3><p>Keep your team focused on advice and quoting that need their experience.</p></article>
            </div>
            <div className="rp-journeys">
              <article className="rp-journey rp-journey-before">
                <h3>When the website stops at “enquire”</h3>
                <ol>
                  <li><strong>A buyer needs an answer.</strong><span>They search your site but still have questions.</span></li>
                  <li><strong>Some leave. Others enquire.</strong><span>Those enquiries now become a task for your team.</span></li>
                  <li><strong>Staff chase the basics.</strong><span>Measurements, product choices and missing details.</span></li>
                  <li><strong>The quote starts later.</strong><span>Time spent, with no sale confirmed.</span></li>
                </ol>
                <p className="rp-journey-summary">Waiting and extra work before quoting.</p>
              </article>
              <article className="rp-journey rp-journey-after">
                <h3>With a tool or Smart Assistant</h3>
                <ol>
                  <li><strong>A buyer asks or enters job details.</strong><span>The tool gathers the relevant details.</span></li>
                  <li><strong>They get a useful first answer.</strong><span>Product guidance, quantities or a preliminary estimate.</span></li>
                  <li><strong>They choose to send an enquiry.</strong><span>The details already collected go with it.</span></li>
                  <li><strong>Your team reviews a prepared job.</strong><span>Less chasing. A clearer next sales conversation.</span></li>
                </ol>
                <p className="rp-journey-summary">A useful answer and a better starting point.</p>
              </article>
            </div>
            <div className="rp-reflection rp-journey-note"><p>Customers can still call or enquire, but can gain their answer without needing to — or enquire with far more useful information for your team.</p></div>
            <div className="rp-discover">
              <h3>Make more of your roofing knowledge easy to find.</h3>
              <p>Publish selected product information, pricing and guidance. Keep private trade rates private.</p>
              <Disclosure title="Search visibility, useful data and the longer-term benefit">
                <p>Useful public information gives search engines and AI services more material to work with. It does not guarantee a mention, ranking or citation.</p>
                <p>Tool use can also reveal what gets asked about, selected and quoted. With appropriate permissions and aggregation, those insights can inform better resources and product decisions. Quote activity is not the same as completed sales.</p>
                <p>Google says established SEO practices remain relevant to its AI search features. OpenAI describes how public websites can be discovered and cited in ChatGPT search.</p>
                <div className="rp-source-links">
                  <a href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noopener noreferrer">Google guidance ↗</a>
                  <a href="https://help.openai.com/en/articles/12627856" target="_blank" rel="noopener noreferrer">OpenAI guidance ↗</a>
                </div>
              </Disclosure>
            </div>
          </section>

          <section className="rp-section rp-roi" id="assessment" aria-labelledby="rp-roi-title">
            <p className="rp-eyebrow">Before you look at the price</p>
            <h2 id="rp-roi-title">What would make this a worthwhile <span className="rp-glow-word">investment?</span></h2>
            <p className="rp-roi-question">How many staff hours would it need to save, or how much extra profit would it need to help generate, for you to say: this was worth it?</p>
          </section>

          <PricingClose businessLabel={business ? BUSINESS_CHOICES.find(item => item.id === business)!.label : ""} variant={variant} />
        </div>
      </div>
      <footer style={{borderColor:t.border}} className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between" style={{color:t.muted}}>
          <p>© T3 Labs</p><p>Roofing tools · Smart Assistant · Better-prepared enquiries</p>
        </div>
      </footer>
    </main>
  );
}

// Header hover treatment retained from the supplied page; body styles do not target it.
const HEADER_STYLES = `
.btn-solid:hover{transform:translateY(-1px);filter:brightness(1.08);box-shadow:0 7px 22px rgba(215,255,0,.18)}
.btn-outline:hover{transform:translateY(-1px);border-color:var(--accent-ink)!important}
`;

const STYLES = String.raw`
.rp-content {
  --rp-meta: .875rem;
  --rp-body: 1.0625rem;
  --rp-card: 1.25rem;
  --rp-heading: clamp(1.75rem,3vw,2.25rem);
  --rp-display: clamp(2.125rem,4.6vw,3.375rem);
  font-family: inherit; font-size: var(--rp-body); line-height: 1.65;
  background:var(--rp-bg); color:var(--rp-text);
}
.rp-content *{box-sizing:border-box}
.rp-content [hidden]{display:none!important}
.rp-content :is(h1,h2,h3,p,blockquote,ul,ol){margin:0}
.rp-content :is(h1,h2,h3){text-wrap:balance;font-weight:700;letter-spacing:-.025em}
.rp-content h1{font-size:var(--rp-display);line-height:1.13;max-width:850px}
.rp-content h2{font-size:var(--rp-heading);line-height:1.23;max-width:850px}
.rp-content h3{font-size:var(--rp-card);line-height:1.4}
.rp-content p{color:var(--rp-muted)}
.rp-content :is(button,a,summary){font:inherit;-webkit-tap-highlight-color:transparent}
.rp-content button{cursor:pointer;color:inherit}
.rp-content a{color:inherit}
.rp-content button,.rp-content a{touch-action:manipulation}
.rp-content :is(button,a,summary,textarea,[tabindex]):focus-visible{outline:3px solid var(--rp-accent-ink);outline-offset:4px}
.rp-content [id]{scroll-margin-top:96px}
.rp-shell{width:min(1120px,calc(100% - 40px));margin:auto}
.rp-section{padding:52px 0;border-bottom:1px solid var(--rp-border)}
.rp-section-heading{max-width:820px;margin-bottom:28px}
.rp-section-heading p:not(.rp-eyebrow){margin-top:14px;max-width:750px}
.rp-eyebrow{font-size:var(--rp-meta);font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--rp-accent-ink)!important;margin-bottom:12px!important}
.rp-meta,.rp-smallprint,.rp-media-note{font-size:var(--rp-meta);line-height:1.6;color:var(--rp-muted)}
.rp-referral-note{padding:12px 20px;font-size:var(--rp-meta);text-align:center;color:var(--rp-muted);border-bottom:1px solid var(--rp-border)}
.rp-opening{padding-top:48px}
.rp-opening-copy{margin-top:20px!important;max-width:760px}
.rp-business{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:28px;max-width:960px}
.rp-business button{min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left;padding:18px 20px;border:1px solid var(--rp-border);border-radius:12px;background:var(--rp-surface);font-weight:700;transition:border-color .16s ease,background .16s ease}
.rp-business button[aria-pressed=true]{background:var(--rp-soft);border-color:var(--rp-accent-ink)}
.rp-select-status{font-size:var(--rp-meta);font-weight:500;color:var(--rp-muted);white-space:nowrap}
.rp-business button[aria-pressed=true] .rp-select-status{color:var(--rp-accent-ink)}
.rp-choice-note{font-size:var(--rp-meta);margin-top:12px!important}
.rp-opportunity{margin-top:32px;padding-top:28px;border-top:1px solid var(--rp-border)}
.rp-examples{display:grid;grid-template-columns:1fr 1fr;gap:18px 28px;list-style:none;padding:0;margin-top:28px!important;max-width:1020px}
.rp-examples li{display:flex;gap:14px;align-items:flex-start;line-height:1.55;padding:4px 0}
.rp-examples li>span:first-child{flex-shrink:0;color:var(--rp-accent-ink);font-weight:700}
.rp-reflection{padding:24px 28px;background:var(--rp-soft);border-left:3px solid var(--rp-accent-ink);border-radius:0 12px 12px 0;margin-top:32px;max-width:960px}
.rp-reflection p{font-size:var(--rp-card);font-weight:600;line-height:1.5;color:var(--rp-text)}
.rp-bridge{margin-top:30px!important;font-size:var(--rp-card);max-width:790px;color:var(--rp-text)!important}
.rp-solutions{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.rp-solutions article{padding:28px;border:1px solid var(--rp-border);border-radius:16px;background:var(--rp-surface)}
.rp-solutions h3{color:var(--rp-accent-ink)}
.rp-solutions p{margin-top:14px;max-width:45ch}
.rp-shared-outcome{margin-top:18px!important}
.rp-setup{margin-top:36px;padding-top:30px;border-top:1px solid var(--rp-border);max-width:900px}
.rp-setup>h3{font-size:var(--rp-heading)}
.rp-setup>p{margin-top:16px;max-width:790px}
.rp-setup-promise{font-weight:600;color:var(--rp-text)!important}
.rp-disclosure{margin-top:22px;border-top:1px solid var(--rp-border)}
.rp-disclosure summary{min-height:56px;padding:14px 0;display:flex;align-items:center;justify-content:space-between;gap:20px;cursor:pointer;font-weight:600;list-style:none;color:var(--rp-text)}
.rp-disclosure summary::-webkit-details-marker{display:none}
.rp-plus{font-size:var(--rp-card);color:var(--rp-accent-ink);transition:transform .15s ease}
.rp-disclosure[open] .rp-plus{transform:rotate(45deg)}
.rp-disclosure-body{padding:4px 0 20px;max-width:820px}
.rp-disclosure-body p+p,.rp-disclosure-body ul+p{margin-top:14px}
.rp-disclosure-body ul{padding-left:22px;margin:16px 0}
.rp-disclosure-body li{margin-top:12px;color:var(--rp-muted)}
.rp-disclosure-body strong{color:var(--rp-text)}
.rp-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.rp-tabs button{min-height:108px;padding:20px;border:1px solid var(--rp-border);border-radius:12px;background:var(--rp-surface);text-align:left;line-height:1.45}
.rp-tabs strong{display:block;font-size:var(--rp-card)}
.rp-tabs span{display:block;margin-top:7px;color:var(--rp-muted)}
.rp-tabs button[aria-selected=true]{background:var(--rp-soft);border-color:var(--rp-accent-ink)}
.rp-tabs button[aria-selected=true] strong{color:var(--rp-accent-ink)}
.rp-audience-panel{display:grid;grid-template-columns:1.35fr 1fr;gap:32px;align-items:start;padding:30px 0 18px}
.rp-audience-panel blockquote{font-size:var(--rp-card);font-weight:600;line-height:1.5}
.rp-audience-panel>div>p{margin-top:16px}
.rp-result{border-left:2px solid var(--rp-border);padding:0 0 0 26px}
.rp-result>.rp-meta{margin-top:0!important}
.rp-result strong{display:block;font-size:var(--rp-card);line-height:1.5;margin-top:10px}
.rp-result-benefit{margin-top:12px!important}
.rp-carousel-controls{display:flex;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid var(--rp-border);padding-top:16px;color:var(--rp-muted)}
.rp-text-button{border:0;background:transparent;padding:8px 0;min-height:44px;font-weight:600!important;color:var(--rp-text)!important}
.rp-media-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:1fr;gap:20px;align-items:stretch}
.rp-media-card{display:flex;flex-direction:column;border:1px solid var(--rp-border);border-radius:16px;overflow:hidden;background:var(--rp-surface)}
.rp-media-open{display:block;width:100%;height:100%;padding:0;border:0;background:transparent;cursor:pointer}
.rp-media-open img{transition:transform .18s ease}
.rp-carousel{width:100%;height:100%;display:flex;flex-direction:column;outline:none}
.rp-carousel:focus-visible{outline:3px solid var(--rp-accent-ink);outline-offset:2px}
.rp-carousel-track{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}
.rp-carousel-nav{display:flex;align-items:center;justify-content:center;gap:12px;padding:6px 8px 0}
.rp-carousel-arrow{min-width:34px;min-height:34px;padding:0 10px;border:1px solid var(--rp-border);border-radius:999px;background:var(--rp-surface);color:var(--rp-text);font-weight:700;line-height:1}
.rp-carousel-dots{display:flex;gap:8px;align-items:center}
.rp-dot{width:9px;height:9px;min-height:0;padding:0;border:0;border-radius:999px;background:var(--rp-border);display:inline-block}
.rp-dot-active{background:var(--rp-accent-ink)}
.rp-media-frame{width:100%;aspect-ratio:4/3;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:14px;border-bottom:1px solid var(--rp-border)}
.rp-screenshot{display:block;width:100%;height:100%;object-fit:contain}
.rp-media-action{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px 20px;min-height:44px;font-size:var(--rp-meta);font-weight:600;color:var(--rp-accent-ink)}
.rp-media-copy{padding:22px;display:flex;flex-direction:column;flex:1}
.rp-media-copy h3{min-height:2.8em}
.rp-media-copy p{margin-top:10px}
.rp-media-copy>.rp-meta{margin-top:auto;padding-top:14px}
.rp-illustration{width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;gap:10px;background:var(--rp-bg);border:1px solid var(--rp-border);border-radius:10px;padding:15px;text-align:left;font-size:var(--rp-meta);line-height:1.4}
.rp-illustration-top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;color:var(--rp-muted)}
.rp-illustration-top strong{color:var(--rp-text);font-size:var(--rp-card)}
.rp-illustration-row{display:flex;justify-content:space-between;gap:8px;padding-top:9px;border-top:1px solid var(--rp-border);color:var(--rp-muted)}
.rp-illustration-row b{color:var(--rp-text)}
.rp-illustration-answer{padding:9px 10px;background:var(--rp-soft);border-radius:6px;color:var(--rp-accent-ink);font-weight:600;text-align:center;margin-top:auto}
.rp-illustration-plan svg{width:100%;height:95px;flex:1;min-height:50px}
.rp-illustration-plan path{fill:none;stroke:var(--rp-text);stroke-width:2}
.rp-illustration-plan circle{fill:var(--rp-accent)}
.rp-bubble{background:var(--rp-surface);border:1px solid var(--rp-border);border-radius:8px;padding:8px 10px;max-width:95%}
.rp-bubble-user{align-self:flex-end;background:var(--rp-soft)}
.rp-dialog{position:fixed;inset:0;width:min(1100px,calc(100% - 24px));max-width:none;max-height:calc(100dvh - 32px);padding:0;border:1px solid var(--rp-border);border-radius:18px;background:var(--rp-surface);color:var(--rp-text);overflow:auto;margin:auto;box-shadow:0 24px 80px rgba(0,0,0,.45)}
.rp-dialog::backdrop{background:rgba(0,0,0,.78)}
.rp-dialog-top{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 24px;border-bottom:1px solid var(--rp-border);background:var(--rp-surface);z-index:2}
.rp-dialog h2{font-size:var(--rp-card)}
.rp-dialog-media{display:flex;align-items:center;justify-content:center;min-height:250px;padding:24px;background:var(--rp-bg)}
.rp-dialog-media :is(img,video){max-height:65dvh;width:100%;height:auto;object-fit:contain;display:block}
.rp-dialog-media .rp-carousel{width:100%}
.rp-dialog-media .rp-carousel-track{align-items:flex-start}
.rp-dialog-media .rp-carousel-arrow{min-width:40px;min-height:40px}
.rp-dialog-media .rp-illustration{width:min(650px,100%);aspect-ratio:4/3;height:auto;padding:30px;gap:20px;font-size:var(--rp-body)}
.rp-dialog-media .rp-illustration-plan svg{min-height:170px}
.rp-media-note{padding:16px 24px}
.rp-demo-link{display:inline-block;margin-top:22px;font-weight:600;color:var(--rp-accent-ink)!important;text-underline-offset:5px}
.rp-benefits{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
.rp-benefits article{border-top:2px solid var(--rp-border);padding:20px 0 0}
.rp-benefits h3{color:var(--rp-text)}
.rp-benefits p{margin-top:12px}
.rp-journeys{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:36px}
.rp-journey{padding:28px;border:1px solid var(--rp-border);border-radius:16px;background:var(--rp-surface)}
.rp-journey-after{border-color:var(--rp-accent-ink);background:var(--rp-soft)}
.rp-journey-after>h3{color:var(--rp-accent-ink)}
.rp-journey>h3{min-height:2.8em}
.rp-journey ol{list-style:none;padding:0;margin-top:24px;display:flex;flex-direction:column;gap:0}
.rp-journey li{position:relative;min-height:114px;padding-bottom:38px}
.rp-journey li:not(:last-child)::after{content:'↓';position:absolute;bottom:8px;left:0;font-size:var(--rp-card);color:var(--rp-muted)}
.rp-journey-after li:not(:last-child)::after{color:var(--rp-accent-ink)}
.rp-journey li:last-child{min-height:0;padding-bottom:0}
.rp-journey strong{display:block;line-height:1.5}
.rp-journey li span{display:block;color:var(--rp-muted);margin-top:6px;line-height:1.55}
.rp-journey-summary{border-top:1px solid var(--rp-border);padding-top:18px;margin-top:20px!important;font-weight:600}
.rp-journey-after .rp-journey-summary{color:var(--rp-text)}
.rp-journey-note{margin-top:20px!important;max-width:800px}
.rp-glow-word{text-shadow:0 0 16px rgba(215,255,0,.55),0 0 5px rgba(215,255,0,.3)}
.rp-roi h2{white-space:nowrap;font-size:clamp(1.35rem,2.8vw,2rem)}
@media (max-width:640px){.rp-roi h2{white-space:normal}}
.rp-discover{margin-top:36px;padding-top:30px;border-top:1px solid var(--rp-border);max-width:900px}
.rp-discover>p{margin-top:12px;max-width:800px}
.rp-source-links{display:flex;flex-wrap:wrap;gap:14px 24px;margin-top:16px}
.rp-source-links a{color:var(--rp-accent-ink);text-underline-offset:5px}
.rp-roi{padding-top:64px;padding-bottom:64px}
.rp-roi h2{max-width:800px}
.rp-roi-question{font-size:var(--rp-card);line-height:1.6;max-width:820px;color:var(--rp-text)!important;margin-top:24px!important}
.rp-roi>p:last-child{margin-top:16px}
.rp-close{border-bottom:0;padding-bottom:88px}
.rp-close-inner{max-width:820px;margin:0 auto;text-align:center;padding:30px;border:1px solid var(--rp-border);border-top:3px solid var(--rp-accent-ink);border-radius:18px;background:var(--rp-surface)}
.rp-close h2{margin:auto;max-width:650px}
.rp-price-block{margin-top:26px}
.rp-price{font-size:var(--rp-display);font-weight:750;line-height:1.15;letter-spacing:-.045em;color:var(--rp-accent-ink);margin-top:10px;min-height:64px;display:flex;justify-content:center;align-items:center;font-variant-numeric:tabular-nums}
.rp-price-note{font-size:var(--rp-meta);margin-top:2px;color:var(--rp-muted)}
.rp-price-loading{font-size:var(--rp-card);letter-spacing:0;color:var(--rp-muted)}
.rp-currency{display:inline-flex;gap:6px;padding:4px;border:1px solid var(--rp-border);border-radius:999px;margin-top:16px}
.rp-currency button{min-height:40px;padding:6px 16px;border:1px solid transparent;border-radius:999px;font-size:var(--rp-meta);background:transparent;color:var(--rp-muted);font-weight:600}
.rp-currency button[aria-pressed=true]{background:var(--rp-soft);border-color:var(--rp-accent-ink);color:var(--rp-accent-ink)}
.rp-close-lead{color:var(--rp-text)!important;margin-top:24px!important}
.rp-turnaround{margin:16px auto 0!important;max-width:600px}
.rp-payment{margin-top:18px!important;color:var(--rp-text)!important}
.rp-smallprint{margin:16px auto 0!important;max-width:590px}
.rp-close-action{margin-top:28px}
.rp-close-action p{margin:14px auto 0;max-width:590px}
.rp-primary,.rp-outline{display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:50px;padding:12px 22px;border-radius:999px;font-size:var(--rp-body);line-height:1.4;font-weight:600;text-decoration:none}
.rp-primary{border:1px solid var(--rp-accent);background:var(--rp-accent);color:#0a0b10!important}
.rp-outline{border:1px solid var(--rp-border);background:transparent;color:var(--rp-text)}
.rp-close .rp-disclosure{text-align:left;margin-top:28px}
.rp-rep-reply{text-align:left;border-top:1px solid var(--rp-border);margin-top:26px;padding-top:24px}
.rp-rep-reply p{margin-top:12px}
.rp-rep-reply label{display:block;margin-top:18px}
.rp-rep-reply textarea{display:block;resize:vertical;width:100%;margin:8px 0 16px;min-height:170px;padding:14px;border:1px solid var(--rp-border);border-radius:10px;color:var(--rp-text);background:var(--rp-bg);font:inherit;line-height:1.6}
.rp-explainer-row{display:flex;align-items:center;justify-content:space-between;gap:20px;width:100%;max-width:880px;margin-top:24px;padding:14px 16px;background:var(--rp-surface);border:1px solid var(--rp-border);border-radius:14px;text-align:left;cursor:pointer;transition:border-color .16s ease,box-shadow .16s ease}
.rp-explainer-row:hover{border-color:var(--rp-accent-ink);box-shadow:0 6px 18px rgba(215,255,0,.12)}
.rp-explainer-copy{flex:1;font-size:.95rem;line-height:1.55;color:var(--rp-text)}
.rp-explainer-cta{display:block;margin-top:6px;font-weight:600;color:var(--rp-accent-ink)}
.rp-explainer-thumb{position:relative;flex:0 0 168px;aspect-ratio:16/9;border-radius:8px;overflow:hidden;background:#000}
.rp-explainer-thumb img{display:block;width:100%;height:100%;object-fit:cover;filter:brightness(1.4) saturate(1.08)}
.rp-explainer-play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;background:rgba(0,0,0,.12)}
.rp-video-modal{position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.6);backdrop-filter:blur(2px)}
.rp-video-modal-box{position:relative;width:min(960px,100%);aspect-ratio:16/9;background:#000;border-radius:14px;overflow:hidden}
.rp-video-modal-box iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.rp-video-close{position:absolute;top:10px;right:10px;z-index:2;width:34px;height:34px;border:0;border-radius:999px;background:rgba(0,0,0,.55);color:#fff;font-size:16px;cursor:pointer}
.rp-demo-card{margin-top:28px;max-width:480px;margin-inline:auto;text-align:center}
.rp-demo-shot{display:block;overflow:hidden;border:1px solid var(--rp-border);border-radius:14px;transition:transform .15s ease,box-shadow .15s ease}
.rp-demo-shot img{display:block;width:100%;height:auto}
.rp-demo-shot:hover{transform:scale(1.02);box-shadow:0 10px 30px rgba(215,255,0,.15)}
.rp-demo-btn{display:inline-flex;align-items:center;gap:8px;margin-top:16px;padding:12px 24px;border-radius:999px;background:var(--rp-accent);color:#0a0b10!important;font-weight:600;text-decoration:none;transition:transform .15s ease,box-shadow .15s ease}
.rp-demo-btn:hover{transform:translateY(-1px);box-shadow:0 7px 22px rgba(215,255,0,.35)}
.rp-sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}
@media(hover:hover){
  .rp-business button:hover,.rp-tabs button:hover,.rp-outline:hover,.rp-carousel-arrow:hover,.rp-dot:hover{border-color:var(--rp-accent-ink)}
  .rp-media-open:hover .rp-screenshot{transform:scale(1.035)}
  .rp-media-trigger:hover .rp-media-action{background:var(--rp-soft)}
  .rp-primary:hover{filter:brightness(1.05)}
  .rp-text-button:hover{color:var(--rp-accent-ink)!important}
}
@media(max-width:1000px){
  .rp-business button{padding:16px;flex-wrap:wrap;gap:6px}
  .rp-media-grid{gap:14px}
  .rp-media-frame{padding:10px;aspect-ratio:1/1}
  .rp-illustration{padding:11px;gap:8px}
  .rp-illustration-top{display:block}
  .rp-illustration-top strong{display:block;margin-top:4px}
  .rp-media-copy{padding:20px}
}
@media(max-width:760px){
  .rp-shell{width:calc(100% - 36px)}
  .rp-section{padding:52px 0}
  .rp-opening{padding-top:42px}
  .rp-opening-copy{margin-top:16px!important}
  .rp-business{gap:8px;margin-top:24px}
  .rp-business button{padding:14px 12px;align-content:flex-start;min-height:94px}
  .rp-select-status{font-size:var(--rp-meta)}
  .rp-opportunity{margin-top:30px;padding-top:28px}
@media (max-width:640px){.rp-explainer-row{flex-direction:row;align-items:center}.rp-explainer-thumb{flex-basis:120px}.rp-video-modal{padding:12px}}
  .rp-examples{grid-template-columns:1fr;gap:16px;margin-top:24px!important}
  .rp-reflection{padding:22px;margin-top:28px}
  .rp-bridge{margin-top:28px!important}
  .rp-solutions{grid-template-columns:1fr;gap:16px}
  .rp-solutions article{padding:24px}
  .rp-setup{margin-top:30px;padding-top:26px}
  .rp-tabs{gap:8px}
  .rp-tabs button{padding:16px 12px;min-height:122px}
  .rp-tabs strong{font-size:var(--rp-body)}
  .rp-tabs span{font-size:var(--rp-meta)}
  .rp-audience-panel{grid-template-columns:1fr;gap:22px;padding:24px 0}
  .rp-result{padding:18px 0 0;border-left:0;border-top:1px solid var(--rp-border)}
  .rp-media-grid{grid-template-columns:1fr;gap:16px;max-width:560px;margin:0 auto}
  .rp-media-card{display:flex;flex-direction:column}
  .rp-media-frame{aspect-ratio:4/3;padding:10px}
  .rp-media-action{padding:10px;justify-content:center;gap:6px}
  .rp-media-frame .rp-illustration{padding:10px;gap:8px}
  .rp-media-frame .rp-illustration-top{display:none}
  .rp-media-frame .rp-illustration-row{display:none}
  .rp-media-frame .rp-bubble{display:none}
  .rp-media-frame .rp-illustration-answer{margin:auto 0;padding:8px 4px}
  .rp-media-frame .rp-illustration-plan svg{height:50px}
  .rp-media-frame .rp-illustration-plan .rp-illustration-answer{display:none}
  .rp-media-copy h3{min-height:0}
  .rp-media-copy{padding:18px 14px}
  .rp-media-copy>.rp-meta{font-size:var(--rp-meta)}
  .rp-dialog-top{padding:16px}
  .rp-dialog-media{padding:16px}
  .rp-dialog-media .rp-illustration{padding:18px;gap:14px}
  .rp-dialog-media .rp-illustration-plan svg{min-height:100px}
  .rp-media-note{padding:14px 16px}
  .rp-benefits{grid-template-columns:1fr;gap:24px}
  .rp-benefits article{padding-top:16px}
  .rp-journeys{grid-template-columns:1fr;gap:22px;margin-top:30px}
  .rp-journey{padding:24px}
  .rp-journey>h3{min-height:0}
  .rp-journey li{min-height:0;padding-bottom:44px}
  .rp-journey li:last-child{padding-bottom:0}
  .rp-roi{padding-top:60px;padding-bottom:60px}
  .rp-close-inner{padding:30px 22px}
  .rp-close .rp-primary{width:100%}
}
@media(max-width:370px){
  .rp-business{grid-template-columns:1fr}
  .rp-business button{flex-wrap:nowrap;min-height:60px}
  .rp-tabs{gap:6px}
  .rp-tabs button{padding:12px 8px}
}
@media(prefers-reduced-motion:reduce){.rp-content *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
`;

export default function ReferredPage() {
  return <RoofingSolutionsPage variant="referred" />;
}
