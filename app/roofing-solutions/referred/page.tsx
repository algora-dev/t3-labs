"use client";

import { useState } from "react";
import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from "react";

/*
 * T3 Labs roofing landing page.
 * Standalone client component. No additional runtime dependencies or Tailwind required.
 * Default mode protects the rep's contact path. This is not CRM attribution protection.
 * All illustration panels below are examples, not a live estimator or live assistant.
 */
type ContactMode = "referral" | "direct";
type Business = "manufacturer" | "supplier" | "supply-install";
type Audience = "visitor" | "contractor" | "team";
type Route = "sizes" | "plan" | "assistant";
type Priority = "answers" | "enquiries" | "trade";
type Theme = "dark" | "light";
type Clip = { src: string; poster?: string; captions?: string };

const CONFIG = {
  contactMode: "referral" as ContactMode,
  stickyTopOffset: 76, // Pixels occupied by any existing fixed host-site header.
  logoSrc: "", // Public path, e.g. /t3-labs-logo.svg. Plain T3 Labs wordmark until supplied.
  bookingUrl: "https://calendly.com/cece-t3labs/20min",
  enquiryUrl: "/our-solution#start", // Used ONLY in direct mode. Reuses the existing enquiry route.
  representative: { name: "", email: "", bookingUrl: "" }, // Trusted deployment config, not query-string input.
  price: "$999",
  currencyLabel: "", // Confirm USD/NZD/etc. before launch. Do not infer currency from location.
  priceNote: "Your proposal confirms the scope, currency, taxes and any ongoing costs before you commit.",
  liveRoofingDemo: "/supplier-pricing-tool/apex-roofing",
  referralSafeRoofingDemo: "", // Enable only after reviewing the demo's own links and contact paths.
  liveAssistantDemo: "", // Leave blank until the real Apex Roofing assistant is ready.
  referralSafeAssistantDemo: "",
  clips: {
    sizes: { src: "", poster: "", captions: "" },
    plan: { src: "", poster: "", captions: "" },
    assistant: { src: "", poster: "", captions: "" },
  } as Record<Route, Clip>,
  explainer: { src: "", poster: "", captions: "" } as Clip,
};

const SOURCES = {
  speed: "https://www.invoca.com/uk/reports/home-services-buyer-experience-report-2026",
  google: "https://developers.google.com/search/docs/appearance/ai-features",
  openai: "https://help.openai.com/en/articles/12627856-publishers-and-developers-faq",
};

const THEMES = {
  dark: {
    bg: "#0a0b10", surface: "#101219", raised: "#171b26", border: "#303646",
    ink: "#f0f2f7", muted: "#acb3c4", accent: "#d7ff00", accentInk: "#d7ff00",
    accentSoft: "rgba(215,255,0,.07)", header: "rgba(10,11,16,.96)",
  },
  light: {
    bg: "#fbfcff", surface: "#ffffff", raised: "#f0f2f7", border: "#d2d7e0",
    ink: "#11151f", muted: "#50596b", accent: "#d7ff00", accentInk: "#536200",
    accentSoft: "rgba(139,164,0,.06)", header: "rgba(251,252,255,.96)",
  },
};

type UserStory = {
  title: string; quote: string; body: string; result: string; question: string;
  input: string; output: string; next: string;
};
type Profile = {
  label: string; short: string; rule: string; intro: string;
  users: Record<Audience, UserStory>;
};
const PROFILES: Record<Business, Profile> = {
  manufacturer: {
    label: "Manufacturer", short: "roofing manufacturer",
    intro: "Help buyers understand your systems, help contractors specify your products, and give your team better-prepared enquiries.",
    rule: "Approved systems, product compatibility and the right route to a stockist or your team.",
    users: {
      visitor: {
        title: "Help them understand your roofing system.",
        quote: "What would I need for a roof this size, and where can I get it?",
        body: "They can enter an area, measure a plan or ask the assistant. Give them approved product guidance, quantities and published estimates where appropriate.",
        result: "A clearer specification enquiry, not another basic product question.",
        question: "What if buyers understood your system before they called?",
        input: "Roof area + project requirements", output: "System options + quantities", next: "Stockist referral or technical enquiry",
      },
      contractor: {
        title: "Make your products easier to specify.",
        quote: "Which products and accessories make up this system?",
        body: "Help roofing contractors work with approved combinations, coverage rules and specification details. Route pricing and orders through your chosen sales channel.",
        result: "Less effort to include your products in the next job.",
        question: "Would simpler specification make your system easier to choose?",
        input: "Chosen system + project area", output: "Product schedule + accessories", next: "Trade enquiry or stockist handoff",
      },
      team: {
        title: "Put your product knowledge to work internally.",
        quote: "Prepare the product schedule for this project.",
        body: "Your team can use the same product knowledge and calculation rules, with internal permissions, approved pricing and a workflow fitted to your business.",
        result: "More consistent answers without rebuilding the same schedule.",
        question: "How often is your team preparing the same kind of information?",
        input: "Project details + approved system", output: "Reviewed product schedule", next: "Technical review or commercial quote",
      },
    },
  },
  supplier: {
    label: "Supply only", short: "roofing supplier",
    intro: "Help buyers get useful prices, help roofers quote with your products, and give your team better-prepared enquiries.",
    rule: "Your catalogue, coverage rules, public estimates and private trade rates.",
    users: {
      visitor: {
        title: "Give them a useful starting price.",
        quote: "I have a 180 m² roof. What materials do I need?",
        body: "They can enter measurements, measure a plan or ask the assistant. Your configured products and rules turn the details into quantities and indicative pricing.",
        result: "A prepared enquiry while the buyer is still interested.",
        question: "What if buyers could get this far before your phone rings?",
        input: "Roof area + product preference", output: "Quantities + indicative price", next: "Prepared enquiry for your team",
      },
      contractor: {
        title: "Make it easier to quote with your products.",
        quote: "Price this job using my usual products and trade rates.",
        body: "Give trade customers an approved login, their pricing, product quantities and waste settings. They can prepare their quote and send you the material requirements.",
        result: "A simpler path from winning the job to ordering from you.",
        question: "Would being easier to quote with help you keep their next order?",
        input: "Job measurements + trade account", output: "Materials + approved trade price", next: "Customer quote or materials enquiry",
      },
      team: {
        title: "Quote from the same information, with more control.",
        quote: "Build the supply quote and apply this customer's rates.",
        body: "Adapt the same system for staff quoting, customer discounts, margin controls and saved jobs. Your team reviews exceptions rather than re-entering everything.",
        result: "Less duplicated work and a more consistent quoting process.",
        question: "Where is your team doing the same calculation more than once?",
        input: "Prepared job + customer record", output: "Staff pricing + quote document", next: "Review, approve and send",
      },
    },
  },
  "supply-install": {
    label: "Supply + install", short: "supply-and-install roofing business",
    intro: "Help homeowners understand likely costs, help project partners prepare jobs, and give your team a stronger starting point for quoting.",
    rule: "Roofing products, labour assumptions, exclusions and when a site check is needed.",
    users: {
      visitor: {
        title: "Help homeowners prepare before the first call.",
        quote: "What might a new roof cost for my house?",
        body: "They can enter known dimensions, measure a plan or ask the assistant. Collect the job details and give an indicative estimate using your approved assumptions.",
        result: "A better-prepared lead, with site checks still in your control.",
        question: "Could a clearer starting estimate make the first conversation more useful?",
        input: "Roof details + project requirements", output: "Preliminary supply + labour estimate", next: "Team review or a qualified site visit",
      },
      contractor: {
        title: "Help builders and project partners send a clearer job.",
        quote: "Can you price the roof on this build?",
        body: "Let project partners supply plans, measurements and their preferred roofing system. Gather the details your team needs before a formal supply-and-install quote.",
        result: "Fewer calls just to establish the basics of the project.",
        question: "What if repeat partners sent the right details the first time?",
        input: "Plans + project specifications", output: "Materials + installation brief", next: "Prepared project for your estimator",
      },
      team: {
        title: "Make supply-and-install quoting more consistent.",
        quote: "Build this quote with our materials, labour and margins.",
        body: "Configure staff workflows around your own rates, assumptions and approvals. Keep access, site conditions and any unresolved requirements for human review.",
        result: "A repeatable quote process without losing professional judgement.",
        question: "How much quote preparation could happen before your estimator starts?",
        input: "Job details + measured quantities", output: "Materials + labour + approved margin", next: "Check assumptions, approve and send",
      },
    },
  },
};
const AUDIENCES: { id: Audience; title: string; detail: string }[] = [
  { id: "visitor", title: "New visitor", detail: "A useful first answer" },
  { id: "contractor", title: "Roofing customer", detail: "An easier repeat job" },
  { id: "team", title: "Your own team", detail: "Less duplicated work" },
];
const ROUTES: { id: Route; title: string; detail: string }[] = [
  { id: "sizes", title: "Enter measurements", detail: "They already know the size" },
  { id: "plan", title: "Measure a plan", detail: "A guided visual takeoff" },
  { id: "assistant", title: "Ask the assistant", detail: "A conversation, not a form" },
];
const PRIORITIES: Record<Priority, { label: string; question: string; next: string }> = {
  answers: {
    label: "Fewer repeat questions", question: "How often do one or two experienced people answer the same basic questions?",
    next: "handle repeat product and pricing questions without tying up the team",
  },
  enquiries: {
    label: "Better-prepared quotes", question: "What could your team do with less time spent chasing measurements and missing details?",
    next: "collect better project details and reduce quote preparation",
  },
  trade: {
    label: "Easier repeat business", question: "Would making your products easier to price and specify help win the next job?",
    next: "make it easier for trade customers to quote and keep using our products",
  },
};

function Arrow({ back = false, small = false }: { back?: boolean; small?: boolean }) {
  return <span className={small ? "r-arrow r-arrow-small" : "r-arrow"} aria-hidden="true">{back ? "←" : "→"}</span>;
}
function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const header = document.getElementById("r-header");
  const offset = CONFIG.stickyTopOffset + (header?.getBoundingClientRect().height ?? 96) + 16;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: reduceMotion ? "auto" : "smooth" });
}
function anchorClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  event.preventDefault();
  scrollToSection(id);
}
function tabKeys<T extends string>(event: KeyboardEvent<HTMLButtonElement>, ids: readonly T[], current: T, prefix: string, select: (id: T) => void) {
  const i = ids.indexOf(current);
  const next = event.key === "ArrowRight" ? ids[(i + 1) % ids.length]
    : event.key === "ArrowLeft" ? ids[(i - 1 + ids.length) % ids.length]
    : event.key === "Home" ? ids[0] : event.key === "End" ? ids[ids.length - 1] : null;
  if (!next) return;
  event.preventDefault();
  select(next);
  document.getElementById(`${prefix}-${next}`)?.focus();
}
function Disclosure({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return <details className={`r-details ${className}`}><summary><span>{title}</span><span className="r-plus" aria-hidden="true">+</span></summary><div className="r-details-body">{children}</div></details>;
}
function StepHead({ number, eyebrow, title, detail }: { number: string; eyebrow: string; title: string; detail?: string }) {
  return <div className="r-step-head"><p className="r-eyebrow"><span className="r-step-number">{number}</span>{eyebrow}</p><h2>{title}</h2>{detail && <p className="r-subtitle">{detail}</p>}</div>;
}
function PreviewClip({ clip, label }: { clip: Clip; label: string }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const safePlay = (video: HTMLVideoElement) => { void video.play().catch(() => setPlaying(false)); };
  if (error) return <div className="r-media-error"><strong>The clip is unavailable.</strong><p>The illustrated workflow remains available below.</p></div>;
  return <div className="r-media" onMouseEnter={(e) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const video = e.currentTarget.querySelector("video"); if (video) safePlay(video);
  }} onMouseLeave={(e) => { e.currentTarget.querySelector("video")?.pause(); }}>
    <video src={clip.src} poster={clip.poster || undefined} muted loop playsInline preload="none" controls
      aria-label={label} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setError(true)}>
      {clip.captions && <track kind="captions" src={clip.captions} srcLang="en" label="English" default />}
    </video>
    <div className="r-media-toolbar"><span>{label}</span><button type="button" className="r-link-button" aria-pressed={playing}
      onClick={(e) => { const v = e.currentTarget.closest(".r-media")?.querySelector("video"); if (!v) return; if (v.paused) safePlay(v); else v.pause(); }}>
      {playing ? "Pause clip" : "Play clip"}
    </button></div>
  </div>;
}

const PREVIEW_STEPS: Record<Route, { title: string; text: string }[]> = {
  sizes: [
    { title: "Start with what they know.", text: "Collect a measured roof area or known dimensions. Keep footprint and roof surface area distinct." },
    { title: "Apply your products and rules.", text: "Use configured coverage, packaging and waste rules. Ask for any missing project details." },
    { title: "Send a prepared enquiry.", text: "Return quantities and indicative pricing, with the assumptions your team needs to check." },
  ],
  plan: [
    { title: "Set a known scale first.", text: "Use a plan or suitable licensed imagery. The customer confirms a known dimension before measuring." },
    { title: "Measure the relevant roof areas.", text: "Guide the user through the takeoff. Account for pitch only where the input and configured method require it." },
    { title: "Use the measurement in the job.", text: "Carry the measurements, product choices and plan into a preliminary estimate and staff handoff." },
  ],
  assistant: [
    { title: "Let them explain the job.", text: "The assistant can answer approved questions or gather the information needed for preliminary pricing." },
    { title: "Ask, rather than assume.", text: "Confirm missing details. Product compatibility and pricing come from configured data and calculation rules." },
    { title: "Give an answer and a next step.", text: "Offer the estimate or collect a human enquiry with context. Missing information and exceptions go to the team." },
  ],
};

function RoofPlan({ stage }: { stage: number }) {
  return <svg viewBox="0 0 420 200" className="r-roof-plan" role="img" aria-label={stage === 0 ? "Illustrated roof plan with a known dimension for scale" : "Illustrated roof planes being measured. No real area is calculated."}>
    <defs><pattern id="r-roof-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth=".45" /></pattern></defs>
    <rect width="420" height="200" fill="url(#r-roof-grid)" opacity=".2" />
    <path d="M 78 46 H 294 L 344 93 V 158 H 78 Z" fill="currentColor" fillOpacity=".035" stroke="currentColor" strokeWidth="1.6" />
    <path d="M 78 46 L 145 102 H 263 L 294 46 M145 102 L78 158 M263 102 L344 158 M263 102 L344 93" fill="none" stroke="currentColor" strokeWidth="1" opacity=".65" />
    {stage > 0 && <path d="M 78 46 L145 102 H263 L294 46 Z" className="r-roof-fill" />}
    <path d="M 78 173 V185 M 294 173 V185 M78 179 H294" fill="none" stroke="currentColor" strokeWidth="1" />
    <rect x="142" y="170" width="90" height="19" className="r-svg-label-bg" />
    <text x="187" y="183" textAnchor="middle" fill="currentColor" fontSize="10.5">Known dimension</text>
    {(stage > 0 ? [[78,46],[145,102],[263,102],[294,46]] : [[78,179],[294,179]]).map(([x,y], i) => <circle key={i} cx={x} cy={y} r="4" className="r-roof-point" />)}
    <rect x="274" y="15" width="128" height="25" rx="5" className="r-svg-label-bg" stroke="currentColor" strokeOpacity=".2" />
    <text x="338" y="31" fill="currentColor" textAnchor="middle" fontSize="10.5">{stage === 0 ? "01  Calibrate scale" : "02  Trace roof planes"}</text>
  </svg>;
}

function EnquiryIllustration({ business }: { business: Business }) {
  const install = business === "supply-install";
  const manufacturer = business === "manufacturer";
  return <div className="r-enquiry-illustration">
    <div className="r-document-top"><span className="r-status-dot" /><strong>Prepared for your team</strong><span>Example</span></div>
    <dl className="r-document-rows">
      <div><dt>Measurements</dt><dd>Included, with source</dd></div>
      <div><dt>{manufacturer ? "System" : "Products"}</dt><dd>Selected range + quantities</dd></div>
      <div><dt>{install ? "Labour" : "Pricing"}</dt><dd>{install ? "Configured assumptions" : "Approved pricing rules"}</dd></div>
      <div><dt>Checks</dt><dd>{install ? "Site conditions to confirm" : "Exceptions flagged for review"}</dd></div>
    </dl>
    <div className="r-document-bottom">{manufacturer ? "Specification enquiry or sales-channel handoff" : "Preliminary estimate, subject to team confirmation"}</div>
  </div>;
}

function WorkflowPreview({ business }: { business: Business }) {
  const [route, setRoute] = useState<Route>("sizes");
  const [step, setStep] = useState(0);
  const [showIllustration, setShowIllustration] = useState(false);
  const info = PREVIEW_STEPS[route][step];
  const clip = CONFIG.clips[route];
  const select = (next: Route) => { setRoute(next); setStep(0); setShowIllustration(false); };
  const liveTool = CONFIG.contactMode === "referral" ? CONFIG.referralSafeRoofingDemo : CONFIG.liveRoofingDemo;
  const liveAssistant = CONFIG.contactMode === "referral" ? CONFIG.referralSafeAssistantDemo : CONFIG.liveAssistantDemo;
  const liveUrl = route === "assistant" ? liveAssistant : liveTool;
  return <div className="r-workflow">
    <div className="r-route-tabs" role="tablist" aria-label="Three ways to start a roofing enquiry">
      {ROUTES.map((item, i) => <button key={item.id} type="button" role="tab" id={`r-route-${item.id}`} aria-controls={`r-route-panel-${item.id}`}
        aria-selected={route === item.id} tabIndex={route === item.id ? 0 : -1}
        onClick={() => select(item.id)} onKeyDown={(e) => tabKeys(e, ROUTES.map(r => r.id), item.id, "r-route", select)}>
        <span className="r-tab-number">0{i + 1}</span><span><strong>{item.title}</strong><small>{item.detail}</small></span><span className="r-tab-check" aria-hidden="true">{route === item.id ? "↓" : "→"}</span>
      </button>)}
    </div>
    {ROUTES.map(item => <div key={item.id} id={`r-route-panel-${item.id}`} role="tabpanel" aria-labelledby={`r-route-${item.id}`} hidden={route !== item.id} className="r-route-panel">
      {route === item.id && <>
        <div className="r-demo-screen">
          <div className="r-demo-bar"><span className="r-demo-dots" aria-hidden="true">● ● ●</span><span>{clip.src && !showIllustration ? "Workflow recording" : "Illustrated workflow"}</span><small>{clip.src && !showIllustration ? "Example configuration" : "Not a live quote"}</small></div>
          {clip.src && !showIllustration ? <PreviewClip key={route} clip={clip} label={item.title} /> : <div className="r-scene">
            {step === 2 ? <EnquiryIllustration business={business} /> : route === "plan" ? <RoofPlan stage={step} /> : route === "assistant" ? <div className="r-chat-example">
              <div className="r-chat-bubble r-buyer"><small>Customer</small>I need roofing materials for 180 m². Can you help price it?</div>
              <div className="r-chat-bubble"><small>Online sales assistant · AI</small>{step === 0 ? "I can help with an initial estimate. Is that measured roof area or the building footprint?" : "Which product range are you considering? I'll use the configured products and pricing, and flag anything the team needs to confirm."}</div>
              {step === 1 && <div className="r-chat-note">Required details first. Approved rules for the calculation.</div>}
            </div> : <div className="r-measure-example">
              <div className="r-field-illustration"><small>{step === 0 ? "Measured roof area" : "Roofing system"}</small><strong>{step === 0 ? <>180 <span>m²</span></> : "Your chosen range"}</strong><em>{step === 0 ? "Customer-supplied measurement" : "Your products, not a generic catalogue"}</em></div>
              <div className="r-mini-fields"><span>{step === 0 ? "Area type confirmed" : "Coverage rules"}</span><span>{step === 0 ? "Product choice next" : "Pack sizes + waste"}</span></div>
            </div>}
          </div>}
        </div>
        <div className="r-demo-caption">
          <p className="r-eyebrow">{clip.src && !showIllustration ? "See the flow" : `Step ${step + 1} of 3`}</p>
          <h3>{clip.src && !showIllustration ? item.title : info.title}</h3>
          <p>{clip.src && !showIllustration ? "A short example of the experience we can tailor around your products, rates and customer journey." : info.text}</p>
          <div className="r-preview-controls">
            {clip.src && !showIllustration ? <button type="button" className="r-button r-button-secondary" onClick={() => setShowIllustration(true)}>Step through the example <Arrow small /></button> : <>
              <button type="button" className="r-icon-button" aria-label="Previous preview step" onClick={() => setStep((step + 2) % 3)}><Arrow back small /></button>
              <button type="button" className="r-button r-button-secondary" onClick={() => setStep((step + 1) % 3)}>{step === 2 ? "Replay example" : "Next step"}<Arrow small /></button>
            </>}
          </div>
          {liveUrl && <a className="r-inline-link" href={liveUrl} target="_blank" rel="noopener noreferrer">Try the live {route === "assistant" ? "assistant" : "roofing tool"} <span aria-hidden="true">↗</span></a>}
        </div>
      </>}
    </div>)}
    <p className="r-small r-example-note">Choose a starting point, then step through it. Illustrations show the workflow, not a live quote. Your version uses your products, pricing and review rules.</p>
  </div>;
}

function ContactPanel({ business, priority }: { business: Business; priority: Priority | null }) {
  const [open, setOpen] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState("");
  const [copyError, setCopyError] = useState(false);
  const rep = CONFIG.representative;
  const subject = "Exploring a roofing solution for our business";
  const next = priority ? PRIORITIES[priority].next : "improve customer answers and reduce manual quoting work";
  const message = `Hi, thanks for sharing the roofing page. We are a ${PROFILES[business].short}. I'd like to explore whether a focused solution could help us ${next}. Could we arrange a no-obligation conversation about our current process, a useful starting scope and the full cost?`;
  const copied = copiedMessage === message;
  const copy = async () => {
    setCopiedMessage(""); setCopyError(false);
    try { await navigator.clipboard.writeText(message); setCopiedMessage(message); } catch { setCopyError(true); }
  };
  const mailto = rep.email ? `mailto:${rep.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}` : "";
  const repContact = rep.bookingUrl || mailto;
  return <div className="r-contact-panel">
    <p className="r-eyebrow">A practical next step</p>
    <h3>{CONFIG.contactMode === "referral" ? `Explore it with ${rep.name || "your representative"}.` : "Talk through your roofing workflow."}</h3>
    <p>No pushy software pitch. Show how you work today, explore one useful improvement, and get a clear scope before deciding.</p>
    {priority && <p className="r-selected-priority"><span>Start with:</span> {PRIORITIES[priority].label.toLowerCase()}.</p>}
    {CONFIG.contactMode === "referral" ? <>
      {repContact ? <a className="r-button r-button-primary" href={repContact} {...(rep.bookingUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}>Contact {rep.name || "your representative"}<Arrow small /></a>
      : <button type="button" className="r-button r-button-primary" aria-expanded={open} aria-controls="r-reply-draft" onClick={() => setOpen(!open)}>{open ? "Hide the suggested reply" : "Prepare a reply for my representative"}<Arrow small /></button>}
      <p className="r-small">The person who shared this page stays your sales contact. They can bring T3 Labs into a free call when useful.</p>
      {open && <div id="r-reply-draft" className="r-reply-draft"><label htmlFor="r-message">Copy this into your existing conversation.</label><textarea id="r-message" value={message} readOnly rows={4} onFocus={e => e.currentTarget.select()} /><button type="button" className="r-button r-button-secondary" onClick={copy}>{copied ? "Message copied" : "Copy message"}</button><p className="r-small" role="status">{copyError ? "Select the text above and copy it manually. Nothing has been sent." : copied ? "Paste it into your conversation with the person who shared this page. Nothing has been sent automatically." : "No form to fill in. No details sent to T3 Labs from this page."}</p></div>}
    </> : <><a className="r-button r-button-primary" href={CONFIG.bookingUrl} target="_blank" rel="noopener noreferrer">Book a free short call<Arrow small /></a><a className="r-inline-link" href={CONFIG.enquiryUrl}>Send us how you work instead <Arrow small /></a></>}
  </div>;
}

export default function RoofingLandingPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [business, setBusiness] = useState<Business>("supplier");
  const [audience, setAudience] = useState<Audience>("visitor");
  const [priority, setPriority] = useState<Priority | null>(null);
  const [logoFailed, setLogoFailed] = useState(false);
  const [explainerOpen, setExplainerOpen] = useState(false);
  const t = THEMES[theme];
  const profile = PROFILES[business];
  const audienceIndex = AUDIENCES.findIndex(a => a.id === audience);
  const nextAudience = (offset: number) => setAudience(AUDIENCES[(audienceIndex + offset + 3) % 3].id);
  const style = {
    "--r-bg": t.bg, "--r-surface": t.surface, "--r-raised": t.raised, "--r-border": t.border,
    "--r-ink": t.ink, "--r-muted": t.muted, "--r-accent": t.accent, "--r-accent-ink": t.accentInk,
    "--r-soft": t.accentSoft, "--r-header": t.header, "--r-host-offset": `${CONFIG.stickyTopOffset}px`,
  } as CSSProperties;

  return <main className="t3r" style={style} id="t3-roofing" data-theme={theme}>
    <style>{STYLES}</style>
    <a href="#r-fit" className="r-skip">Skip to the roofing page</a>
    <header className="r-header" id="r-header">
      <div className="r-shell r-header-top">
        <div className="r-brand" aria-label="T3 Labs"><span className="r-brand-logo">{CONFIG.logoSrc && !logoFailed ? <img src={CONFIG.logoSrc} onError={() => setLogoFailed(true)} alt="T3 Labs" /> : <strong>T3<span> Labs</span></strong>}</span><span className="r-brand-divider" /><span className="r-header-label">Roofing solutions</span></div>
        <button type="button" className="r-theme-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>{theme === "dark" ? "Light view" : "Dark view"}<span aria-hidden="true">◐</span></button>
      </div>
      <nav className="r-shell r-nav" aria-label="Roofing page sections">
        {[["r-fit","Your business"],["r-people","Your users"],["r-answers","The experience"],["r-value","The benefit"],["r-start","Start small"]].map(([id, label], i) => <a key={id} href={`#${id}`} onClick={e => anchorClick(e,id)}><span>0{i + 1}</span>{label}</a>)}
      </nav>
    </header>

    <div className="r-shell">
      <section id="r-fit" className="r-section r-hero">
        <div className="r-hero-copy">
          <p className="r-eyebrow"><span className="r-step-number">01</span>Built for roofing businesses</p>
          <h1>What if your website could do more of the <span>quoting work?</span></h1>
          <p className="r-hero-intro">{profile.intro}</p>
          <fieldset className="r-business"><legend>Which best describes your business?</legend><div className="r-business-options">{(Object.keys(PROFILES) as Business[]).map(key => <button key={key} type="button" aria-pressed={business === key} onClick={() => setBusiness(key)}>{PROFILES[key].label}<span aria-hidden="true">{business === key ? "✓" : "+"}</span></button>)}</div></fieldset>
          <div className="r-hero-actions"><a className="r-inline-link" href="#r-people" onClick={e => anchorClick(e,"r-people")}>See who it could help<Arrow small /></a>{CONFIG.explainer.src && <button type="button" className="r-link-button" aria-expanded={explainerOpen} aria-controls="r-explainer" onClick={() => setExplainerOpen(!explainerOpen)}>{explainerOpen ? "Hide explainer" : "Watch the short explainer"}</button>}</div>
        </div>
        <aside className="r-config-card" aria-labelledby="r-config-title">
          <div className="r-config-top"><span className="r-eyebrow">Configured around your business</span><span className="r-status-dot" /></div>
          <h2 id="r-config-title">Your knowledge.<br/>{" "}Your rules.</h2>
          <p>First, we learn how you sell and quote. Then we configure the tools and assistant around the information, pricing and limits you approve.</p>
          <div className="r-rule-rows"><div><span>Products</span><strong>Your catalogue and systems</strong></div><div><span>Pricing</span><strong>Your calculations and permissions</strong></div><div><span>Answers</span><strong>Your scope and human handoff</strong></div></div>
          <p className="r-profile-rule" aria-live="polite">{profile.rule}</p>
          <div className="r-build-path"><span>Discuss</span><Arrow small/><span>Configure</span><Arrow small/><span>Test together</span></div>
          <Disclosure title="What stays under your control?">
            <p>Start with a small set of approved answers, or configure a more detailed product and pricing flow. You choose the scope before launch.</p>
            <ul><li>Which products and prices are public, and which require an approved account.</li><li>Which coverage, packaging, labour and compatibility rules calculations use.</li><li>When missing information, exceptions or site conditions require your team.</li></ul>
            <p>We test representative questions and quotes with you. Guardrails reduce risk; they are not a promise of error-free automation. Your team remains available for review.</p>
          </Disclosure>
        </aside>
        {CONFIG.explainer.src && explainerOpen && <div className="r-hero-video" id="r-explainer"><video controls playsInline preload="metadata" poster={CONFIG.explainer.poster || undefined} aria-label="T3 Labs roofing solutions explainer"><source src={CONFIG.explainer.src}/>{CONFIG.explainer.captions && <track kind="captions" src={CONFIG.explainer.captions} srcLang="en" label="English" default/>}</video></div>}
      </section>

      <section id="r-people" className="r-section">
        <StepHead number="02" eyebrow="One system, more than one use" title="Three people who could get more done." detail="Give each person the right view of the same products, knowledge and pricing rules." />
        <div className="r-audience-tabs" role="tablist" aria-label="Who the system can help">
          {AUDIENCES.map(item => <button key={item.id} type="button" id={`r-audience-${item.id}`} role="tab" aria-selected={audience === item.id} aria-controls={`r-audience-panel-${item.id}`} tabIndex={audience === item.id ? 0 : -1} onClick={() => setAudience(item.id)} onKeyDown={e => tabKeys(e,AUDIENCES.map(a=>a.id),item.id,"r-audience",setAudience)}><strong>{business === "supply-install" && item.id === "contractor" ? "Project partners" : item.title}</strong><small>{item.detail}</small><span aria-hidden="true">{audience === item.id ? "↓" : "→"}</span></button>)}
        </div>
        {AUDIENCES.map(item => {
          const story = profile.users[item.id];
          return <div key={item.id} className="r-audience-panel" id={`r-audience-panel-${item.id}`} role="tabpanel" aria-labelledby={`r-audience-${item.id}`} hidden={audience !== item.id}>
            <div className="r-audience-copy"><p className="r-spoken">“{story.quote}”</p><h3>{story.title}</h3><p>{story.body}</p><strong className="r-result-line">{story.result}</strong></div>
            <div className="r-job-card"><p className="r-eyebrow">What reaches the next step</p><ol><li><span>01</span><div><small>Starts with</small><strong>{story.input}</strong></div></li><li><span>02</span><div><small>Works towards</small><strong>{story.output}</strong></div></li><li><span>03</span><div><small>Then goes to</small><strong>{story.next}</strong></div></li></ol></div>
          </div>;
        })}
        <div className="r-audience-footer"><p aria-live="polite">{profile.users[audience].question}</p><div className="r-audience-controls"><button type="button" className="r-icon-button" onClick={() => nextAudience(-1)} aria-label="Previous audience"><Arrow back small/></button><span aria-live="polite">{audienceIndex + 1} of 3</span><button type="button" className="r-icon-button" onClick={() => nextAudience(1)} aria-label="Next audience"><Arrow small/></button></div></div>
      </section>

      <section id="r-answers" className="r-section">
        <StepHead number="03" eyebrow="Let them start their way" title="Enter a size. Measure a plan. Or just ask." detail="Offer one route or combine them. Each can lead to a useful answer and a better-prepared enquiry." />
        <WorkflowPreview business={business}/>
        <Disclosure title="Can we start small, and keep a human involved?">
          <p>Yes. Start with selected products, a focused calculator or a bounded assistant. We can expand the scope into trade accounts, staff quoting, integrations or more detailed pricing.</p>
          <p>The assistant is identified as automated, works with approved information and uses configured pricing logic. It can ask for missing details and hand exceptions to the team. Public estimates stay preliminary unless your approved workflow says otherwise.</p>
          <p>Plan and image measurements need a known scale and suitable input quality. Imagery availability and permissions, pitch, waste and site checks are defined for the specific build.</p>
        </Disclosure>
      </section>

      <section id="r-value" className="r-section">
        <StepHead number="04" eyebrow="What would this change for you?" title="Less waiting for them. Less chasing for you." />
        <div className="r-journey-compare">
          <div className="r-journey r-journey-before"><h3>When the website cannot help enough</h3><div className="r-path"><span>Needs an answer</span><Arrow small/><span>Cannot find it</span><Arrow small/><strong>May look elsewhere</strong></div><div className="r-path"><span>Wants a quote</span><Arrow small/><span>Basic enquiry</span><Arrow small/><strong>Staff chase the details</strong></div></div>
          <div className="r-journey r-journey-after"><h3>When more can happen online</h3><div className="r-path"><span>Needs an answer</span><Arrow small/><span>Gets useful guidance</span><Arrow small/><strong>Can choose the next step</strong></div><div className="r-path"><span>Ready to proceed</span><Arrow small/><span>Sends a prepared job</span><Arrow small/><strong>Staff review and confirm</strong></div></div>
        </div>
        <fieldset className="r-priorities"><legend>Which would be most useful to your business?</legend><div>{(Object.keys(PRIORITIES) as Priority[]).map(key => <button key={key} type="button" aria-pressed={priority === key} onClick={() => setPriority(priority === key ? null : key)}>{PRIORITIES[key].label}<span aria-hidden="true">{priority === key ? "✓" : "+"}</span></button>)}</div><p aria-live="polite">{priority ? PRIORITIES[priority].question : "Choose one, or keep reading. You do not need to improve everything at once."}</p></fieldset>
        <div className="r-discovery"><div><p className="r-eyebrow">There is a fourth audience</p><h3>The systems people ask before they find you.</h3><p>Selected public pricing, product guidance and useful resources can give search and AI assistants more to find. Private trade rates stay private.</p></div><div className="r-evidence">
          <Disclosure title="Why faster answers matter: the research">
            <p>In Invoca's 2026 survey, 79% of US/UK home-services respondents said they would switch to a competitor that responds faster.</p><p className="r-small">134 home-services respondents. Fieldwork: 8 to 22 May 2026. This measures stated response preferences, not roofing quote wins or T3 Labs results.</p><a className="r-inline-link" href={SOURCES.speed} target="_blank" rel="noopener noreferrer">Read the survey<span aria-hidden="true">↗</span></a>
          </Disclosure>
          <Disclosure title="How your information can get found">
            <p>Google says helpful, reliable content and normal search eligibility remain relevant to AI features. OpenAI also explains how public pages can be discovered and cited in ChatGPT Search.</p><p>A calculator or private chat does not automatically make its contents searchable. We can build useful public information around selected products and estimates. Neither access nor special formatting guarantees a citation.</p><div className="r-source-links"><a href={SOURCES.google} target="_blank" rel="noopener noreferrer">Google guidance ↗</a><a href={SOURCES.openai} target="_blank" rel="noopener noreferrer">OpenAI guidance ↗</a></div>
          </Disclosure>
          <Disclosure title="How useful data can build on itself">
            <p>See which products are estimated, which questions repeat and where enquiries need help. Where appropriate, aggregate and de-identify that activity into useful product guides or pricing resources.</p><div className="r-data-flow"><span>Useful tool</span><Arrow small/><span>Better insight</span><Arrow small/><span>Better resources</span><span className="r-loop" role="img" aria-label="The cycle can repeat">↺</span></div><p className="r-small">Estimate activity is not the same as completed sales. Publishing needs appropriate permissions, sufficient data and clear assumptions.</p>
          </Disclosure>
        </div></div>
      </section>

      <section id="r-start" className="r-section r-final">
        <StepHead number="05" eyebrow="Start with one useful improvement" title="It does not have to start with a big platform." />
        <div className="r-start-card"><div className="r-price-side"><p className="r-eyebrow">Focused roofing projects from</p><p className="r-price">{CONFIG.price}<span>{CONFIG.currencyLabel}</span></p><p>A focused starting tool, configured around your products and rules. Larger catalogues, assistants and connected workflows are scoped to suit.</p><p className="r-price-flex">Start small. Tailor the scope. Discuss flexible payment options.</p><div className="r-return-prompt"><strong>What would it need to do to earn its keep?</strong><p>Profit from another order? Less time preparing quotes? Compare that value with the full setup and ongoing cost.</p></div><p className="r-small">{CONFIG.priceNote}</p></div><ContactPanel business={business} priority={priority}/></div>
      </section>
    </div>
    <footer className="r-footer r-shell"><span>T3 Labs</span><p>Roofing knowledge. Useful tools. A clearer next step.</p><a href="#r-fit" onClick={e => anchorClick(e,"r-fit")}>Back to the top ↑</a></footer>
  </main>;
}

const STYLES = `
.t3r{background:var(--r-bg);color:var(--r-ink);font-family:inherit;font-size:16px;line-height:1.55;min-height:100vh;-webkit-font-smoothing:antialiased}
.t3r *{box-sizing:border-box}.t3r [hidden]{display:none!important}.t3r h1,.t3r h2,.t3r h3,.t3r h4,.t3r p{margin:0}.t3r button,.t3r a,.t3r input,.t3r textarea{font:inherit}.t3r button{cursor:pointer;color:inherit}.t3r button:disabled{cursor:default}.t3r a{color:inherit;text-decoration:none}.t3r button,.t3r a,.t3r summary{-webkit-tap-highlight-color:transparent}.t3r button:focus-visible,.t3r a:focus-visible,.t3r summary:focus-visible,.t3r textarea:focus-visible{outline:3px solid var(--r-accent-ink);outline-offset:4px}.t3r fieldset{margin:0;min-width:0;padding:0;border:0}.t3r legend{padding:0}.t3r h1{font-size:clamp(2.25rem,4.5vw,3.4rem);line-height:1.09;letter-spacing:-.043em;font-weight:750}.t3r h2{font-size:clamp(1.65rem,2.8vw,2.3rem);line-height:1.16;letter-spacing:-.028em;font-weight:720}.t3r h3{font-size:1.2rem;line-height:1.3;letter-spacing:-.016em}.t3r p{color:var(--r-muted)}.t3r strong{font-weight:650}.r-shell{width:min(1120px,calc(100% - 48px));margin-inline:auto}.r-section{padding-block:38px;scroll-margin-top:126px;border-bottom:1px solid var(--r-border)}.r-header{position:sticky;top:var(--r-host-offset,0px);z-index:30;background:var(--r-header);backdrop-filter:blur(16px);border-bottom:1px solid var(--r-border)}.r-header-top{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:57px}.r-brand{display:flex;align-items:center;gap:14px}.r-brand-logo>strong{font-size:22px;letter-spacing:-.9px}.r-brand-logo>strong>span{font-weight:450}.r-brand-logo img{display:block;width:auto;height:28px;max-width:135px;object-fit:contain}.r-brand-divider{height:21px;width:1px;background:var(--r-border)}.r-header-label{font-size:12px;color:var(--r-muted)}.r-theme-toggle{display:flex;align-items:center;gap:9px;font-size:11px!important;background:transparent;border:1px solid var(--r-border);border-radius:99px;padding:7px 12px;min-height:34px}.r-theme-toggle>span{font-size:18px}.r-nav{display:flex;align-items:center;gap:22px;min-height:41px;overflow-x:auto;padding-block:4px 9px;scrollbar-width:thin}.r-nav a{white-space:nowrap;display:flex;gap:7px;align-items:center;font-size:11.5px;font-weight:560;color:var(--r-muted);min-height:28px}.r-nav a>span{font-size:10px;color:var(--r-accent-ink);font-variant-numeric:tabular-nums}.r-nav a:hover{color:var(--r-ink)}.r-skip{position:fixed;top:-100px;left:16px;z-index:100;background:var(--r-accent);color:#111!important;padding:12px;border-radius:6px}.r-skip:focus{top:12px}.r-eyebrow{display:flex;align-items:center;gap:9px;font-size:10.5px;line-height:1.5;font-weight:650;letter-spacing:.105em;text-transform:uppercase;color:var(--r-accent-ink)!important}.r-step-number{font-variant-numeric:tabular-nums;opacity:.8;border-right:1px solid var(--r-border);padding-right:9px}.r-step-head{margin-bottom:21px}.r-step-head h2{margin-top:9px;max-width:830px}.r-subtitle{font-size:14px;line-height:1.6;max-width:690px;margin-top:10px!important}.r-hero{display:grid;grid-template-columns:1.12fr 1fr;gap:46px;align-items:start;padding-top:42px;padding-bottom:36px}.r-hero h1{margin-top:14px;max-width:590px}.r-hero h1>span{color:var(--r-accent-ink)}.r-hero-intro{margin-top:19px!important;font-size:15px;line-height:1.7;max-width:520px;min-height:76px}.r-business{margin-top:23px!important}.r-business legend{font-size:12px;font-weight:600;margin-bottom:9px}.r-business-options{display:flex;flex-wrap:wrap;gap:7px}.r-business-options button{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 12px;min-height:44px;border-radius:9px;border:1px solid var(--r-border);background:var(--r-surface);font-size:12px;font-weight:600}.r-business-options button>span{font-size:13px;color:var(--r-muted)}.r-business-options button[aria-pressed=true]{background:var(--r-accent);color:#10120a;border-color:var(--r-accent)}.r-business-options button[aria-pressed=true]>span{color:#202800}.r-hero-actions{display:flex;gap:22px;flex-wrap:wrap;align-items:center;margin-top:17px}.r-inline-link,.r-link-button{display:inline-flex;align-items:center;gap:9px;background:none;border:0;font-size:12px!important;font-weight:650;color:var(--r-accent-ink)!important;padding:3px 0;min-height:32px;text-align:left}.r-inline-link:hover,.r-link-button:hover{text-decoration:underline;text-underline-offset:4px}.r-arrow{font-family:Arial,sans-serif;line-height:1;font-size:20px}.r-arrow-small{font-size:16px}.r-config-card{border:1px solid var(--r-border);border-top:2px solid var(--r-accent-ink);border-radius:16px;background:var(--r-surface);padding:22px 25px}.r-config-top{display:flex;justify-content:space-between;align-items:center;gap:10px}.r-status-dot{display:inline-block;flex-shrink:0;width:7px;height:7px;border-radius:100%;background:var(--r-accent-ink)}.r-config-card h2{font-size:1.95rem;margin-top:13px}.r-config-card>p{font-size:13px;line-height:1.65;margin-top:12px}.r-rule-rows{margin-top:15px;border-top:1px solid var(--r-border)}.r-rule-rows>div{display:grid;grid-template-columns:65px 1fr;gap:10px;padding:9px 0;border-bottom:1px solid var(--r-border);font-size:11.5px}.r-rule-rows>div>span{color:var(--r-muted)}.r-rule-rows strong{font-weight:550}.r-config-card .r-profile-rule{font-size:11px;min-height:35px;margin-top:9px}.r-build-path{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:7px;font-size:11px;font-weight:600}.r-build-path .r-arrow{color:var(--r-accent-ink)}.r-config-card .r-details{margin-top:13px}.r-config-card .r-details summary{font-size:11.5px;padding:10px 0 0;min-height:32px}.r-hero-video{grid-column:1/-1}.r-hero-video video{width:100%;max-height:500px;display:block;border-radius:14px;background:#000}.r-audience-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.r-audience-tabs button{position:relative;text-align:left;display:flex;flex-direction:column;gap:3px;background:var(--r-surface);border:1px solid var(--r-border);border-radius:11px;padding:14px 37px 14px 17px;min-height:77px}.r-audience-tabs button strong{font-size:13px}.r-audience-tabs button small{font-size:11px;color:var(--r-muted)}.r-audience-tabs button>span{position:absolute;right:15px;top:26px;font-size:17px;color:var(--r-muted)}.r-audience-tabs button[aria-selected=true]{border-color:var(--r-accent-ink);background:var(--r-soft);box-shadow:inset 0 -2px var(--r-accent-ink)}.r-audience-tabs button[aria-selected=true]>span{color:var(--r-accent-ink)}.r-audience-tabs button:hover,.r-route-tabs button:hover,.r-business-options button:hover{border-color:var(--r-accent-ink)}.r-audience-panel{display:grid;grid-template-columns:1.15fr 1fr;gap:32px;background:var(--r-surface);border:1px solid var(--r-border);border-radius:14px;margin-top:11px;padding:23px 26px;min-height:252px}.r-spoken{font-size:13px;font-style:italic;line-height:1.6;color:var(--r-accent-ink)!important;margin-bottom:10px!important}.r-audience-copy h3{font-size:1.3rem;max-width:430px}.r-audience-copy>p:not(.r-spoken){font-size:14px;margin-top:10px;line-height:1.65}.r-result-line{display:block;font-size:12px;margin-top:13px;line-height:1.65}.r-job-card{background:var(--r-raised);border-radius:10px;padding:15px 19px}.r-job-card ol{list-style:none;padding:0;margin:10px 0 0}.r-job-card li{display:flex;gap:13px;align-items:flex-start;padding:8px 0}.r-job-card li+li{border-top:1px solid var(--r-border)}.r-job-card li>span{color:var(--r-accent-ink);font-size:10px;margin-top:3px}.r-job-card small{display:block;color:var(--r-muted);font-size:10px;margin-bottom:1px}.r-job-card strong{display:block;font-size:12px;font-weight:550}.r-audience-footer{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:10px}.r-audience-footer>p{font-size:12px;color:var(--r-ink);font-weight:550}.r-audience-controls{display:flex;align-items:center;gap:10px;flex-shrink:0}.r-audience-controls>span{font-size:10px;font-weight:600;color:var(--r-muted);min-width:34px;text-align:center}.r-icon-button{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid var(--r-border);border-radius:99px;background:var(--r-surface)}.r-icon-button:hover{border-color:var(--r-accent-ink);color:var(--r-accent-ink)}.r-route-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.r-route-tabs button{display:flex;align-items:center;gap:10px;text-align:left;min-height:68px;border:1px solid var(--r-border);border-radius:11px;background:var(--r-surface);padding:12px 14px}.r-route-tabs button strong{display:block;font-size:12px}.r-route-tabs button small{display:block;font-size:10.5px;margin-top:3px;color:var(--r-muted)}.r-tab-number{color:var(--r-muted);font-size:10px}.r-tab-check{margin-left:auto;color:var(--r-muted)}.r-route-tabs button[aria-selected=true]{border-color:var(--r-accent-ink);background:var(--r-soft)}.r-route-tabs button[aria-selected=true] .r-tab-number,.r-route-tabs button[aria-selected=true] .r-tab-check{color:var(--r-accent-ink)}.r-route-panel{display:grid;grid-template-columns:1.35fr 1fr;gap:0;margin-top:11px;border:1px solid var(--r-border);border-radius:15px;overflow:hidden;background:var(--r-surface)}.r-demo-screen{min-width:0;border-right:1px solid var(--r-border);background:var(--r-raised)}.r-demo-bar{height:35px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--r-border);padding:0 15px;font-size:10px;color:var(--r-muted);background:var(--r-surface)}.r-demo-bar>small{font-size:9px;margin-left:auto}.r-demo-dots{font-size:7px;letter-spacing:3px;opacity:.55}.r-scene{display:flex;align-items:center;justify-content:center;min-height:243px;padding:17px 26px;overflow:hidden}.r-measure-example{width:100%;max-width:360px}.r-field-illustration{border:1px solid var(--r-border);border-left:2px solid var(--r-accent-ink);background:var(--r-surface);border-radius:9px;padding:15px 20px}.r-field-illustration small{font-size:11px;color:var(--r-muted);display:block}.r-field-illustration strong{display:block;font-size:27px;letter-spacing:-.6px;margin:8px 0 6px;line-height:1.2;font-weight:600}.r-field-illustration strong>span{font-size:19px;color:var(--r-muted)}.r-field-illustration em{font-size:10.5px;color:var(--r-muted);font-style:normal;display:block}.r-mini-fields{display:flex;gap:7px;margin-top:10px}.r-mini-fields span{background:var(--r-surface);border:1px solid var(--r-border);border-radius:7px;padding:7px 11px;flex:1;font-size:10.5px;color:var(--r-muted)}.r-demo-caption{padding:23px 25px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;min-height:275px}.r-demo-caption h3{margin-top:9px;font-size:1.3rem}.r-demo-caption>p:not(.r-eyebrow){font-size:13.5px;line-height:1.7;margin-top:11px;min-height:64px}.r-preview-controls{display:flex;align-items:center;gap:8px;margin-top:18px}.r-button{display:inline-flex;align-items:center;justify-content:center;gap:10px;text-align:center;min-height:43px;padding:10px 16px;border-radius:9px;border:1px solid var(--r-border);font-size:12px!important;font-weight:650;background:none;line-height:1.45}.r-button-secondary{background:var(--r-surface)}.r-button-primary{background:var(--r-accent);color:#11170a!important;border-color:var(--r-accent)}.r-button:hover{box-shadow:0 2px 10px rgba(0,0,0,.07);border-color:var(--r-accent-ink)}.r-button-primary:hover{filter:brightness(.95)}.r-demo-caption>a{margin-top:10px}.r-small{font-size:10.5px!important;line-height:1.65!important}.r-example-note{margin-top:10px!important}.r-workflow+.r-details{margin-top:14px}.r-enquiry-illustration{width:100%;max-width:420px;border:1px solid var(--r-border);border-radius:10px;background:var(--r-surface);overflow:hidden}.r-document-top{display:flex;gap:8px;padding:12px 14px;border-bottom:1px solid var(--r-border);align-items:center;font-size:11px}.r-document-top>span:last-child{margin-left:auto;color:var(--r-muted);font-size:9px}.r-document-rows{margin:0;padding:4px 14px}.r-document-rows>div{display:flex;justify-content:space-between;align-items:start;gap:12px;padding:7px 0;font-size:10.5px}.r-document-rows>div+div{border-top:1px solid var(--r-border)}.r-document-rows dt{color:var(--r-muted)}.r-document-rows dd{margin:0;text-align:right}.r-document-bottom{padding:8px 14px;color:var(--r-accent-ink);font-size:9.5px;background:var(--r-soft);border-top:1px solid var(--r-border)}.r-roof-plan{width:100%;max-width:460px;height:auto;color:var(--r-muted)}.r-roof-fill{fill:var(--r-accent);fill-opacity:.13;stroke:var(--r-accent-ink);stroke-width:2}.r-roof-point{fill:var(--r-accent-ink)}.r-svg-label-bg{fill:var(--r-surface)}.r-chat-example{width:100%;max-width:435px;font-size:11.5px;line-height:1.55}.r-chat-bubble{border:1px solid var(--r-border);background:var(--r-surface);border-radius:10px 10px 10px 2px;padding:10px 13px;margin-right:27px}.r-chat-bubble+.r-chat-bubble{margin-top:9px}.r-chat-bubble small{display:block;margin-bottom:4px;font-size:9px;color:var(--r-accent-ink);font-weight:650}.r-chat-bubble.r-buyer{margin-right:0;margin-left:35px;border-radius:10px 10px 2px 10px}.r-chat-bubble.r-buyer small{color:var(--r-muted)}.r-chat-note{font-size:9.5px;color:var(--r-muted);margin-top:10px}.r-media video{display:block;width:100%;aspect-ratio:16/9;background:#0a0b10;object-fit:contain}.r-media-toolbar{padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--r-muted);font-size:10px}.r-media-toolbar button{font-size:10px!important}.r-media-error{padding:20px;font-size:12px}.r-media-error p{margin-top:5px}.r-details{border-top:1px solid var(--r-border)}.r-details summary{display:flex;align-items:center;justify-content:space-between;gap:18px;cursor:pointer;list-style:none;font-size:12px;font-weight:600;min-height:46px;padding:11px 0;color:var(--r-ink)}.r-details summary::-webkit-details-marker{display:none}.r-details summary:hover{color:var(--r-accent-ink)}.r-plus{font-size:20px;font-weight:400;color:var(--r-accent-ink);transition:transform .15s ease}.r-details[open]>.r-plus,.r-details[open]>summary .r-plus{transform:rotate(45deg)}.r-details-body{padding:0 0 15px;font-size:12px;color:var(--r-muted);line-height:1.7}.r-details-body p+p{margin-top:10px}.r-details-body ul{padding-left:16px;margin:10px 0}.r-details-body li+li{margin-top:5px}.r-source-links{display:flex;flex-wrap:wrap;gap:15px;margin-top:12px;font-size:11px;color:var(--r-accent-ink);font-weight:650}.r-source-links a:hover{text-decoration:underline}.r-journey-compare{display:grid;grid-template-columns:1fr 1fr;gap:12px}.r-journey{border:1px solid var(--r-border);border-radius:13px;padding:18px 20px;background:var(--r-surface)}.r-journey-after{border-top:2px solid var(--r-accent-ink);background:var(--r-soft)}.r-journey h3{font-size:13px;font-weight:650;margin-bottom:15px}.r-path{display:flex;align-items:center;gap:8px;font-size:10.5px;line-height:1.55}.r-path+.r-path{border-top:1px solid var(--r-border);margin-top:12px;padding-top:12px}.r-path>span:not(.r-arrow){color:var(--r-muted);flex:1}.r-path>strong{flex:1.15;font-weight:600}.r-path .r-arrow{color:var(--r-muted);font-size:13px;flex:none}.r-priorities{margin-top:22px!important}.r-priorities legend{font-size:12px;font-weight:600;margin-bottom:10px}.r-priorities>div{display:flex;flex-wrap:wrap;gap:8px}.r-priorities button{display:flex;align-items:center;gap:14px;justify-content:space-between;background:var(--r-surface);border:1px solid var(--r-border);border-radius:8px;padding:10px 13px;font-size:11.5px;font-weight:550;min-height:42px}.r-priorities button>span{color:var(--r-accent-ink)}.r-priorities button[aria-pressed=true]{background:var(--r-soft);border-color:var(--r-accent-ink)}.r-priorities>p{margin-top:9px;font-size:12px;min-height:21px}.r-discovery{display:grid;grid-template-columns:1fr 1.15fr;gap:35px;border-top:1px solid var(--r-border);padding-top:22px;margin-top:23px}.r-discovery h3{font-size:1.2rem;margin-top:8px;max-width:360px}.r-discovery>div>p:not(.r-eyebrow){font-size:13px;line-height:1.65;margin-top:10px}.r-evidence>.r-details:first-child{border-top:0}.r-evidence summary{font-size:11.5px;min-height:41px}.r-data-flow{display:flex;align-items:center;flex-wrap:wrap;gap:7px;margin:12px 0}.r-data-flow>span:not(.r-arrow):not(.r-loop){padding:5px 8px;border-radius:99px;background:var(--r-raised);border:1px solid var(--r-border);font-size:10px;color:var(--r-ink)}.r-data-flow>span:not(.r-arrow):not(.r-loop):hover{border-color:var(--r-accent-ink);color:var(--r-accent-ink)}.r-loop{font-size:33px;line-height:1;color:var(--r-accent-ink);margin-left:4px}.r-final{border-bottom:0;padding-bottom:37px}.r-start-card{border:1px solid var(--r-border);border-top:2px solid var(--r-accent-ink);border-radius:17px;background:var(--r-surface);display:grid;grid-template-columns:1fr 1.1fr;overflow:hidden}.r-price-side{padding:26px 30px;border-right:1px solid var(--r-border)}.r-price{color:var(--r-ink)!important;font-size:clamp(3.5rem,6vw,4.4rem);letter-spacing:-.055em;line-height:1.1;font-weight:700;margin:9px 0 14px!important}.r-price>span{font-size:12px;letter-spacing:0;color:var(--r-muted);margin-left:8px}.r-price-side>p:not(.r-eyebrow):not(.r-price):not(.r-small){font-size:13px;line-height:1.65}.r-price-flex{margin-top:10px!important;color:var(--r-ink)!important;font-size:11.5px!important;font-weight:600}.r-price-side>.r-small{margin-top:14px;font-size:9.5px!important}.r-return-prompt{border-top:1px solid var(--r-border);padding-top:14px;margin-top:16px}.r-return-prompt strong{font-size:12px}.r-return-prompt p{font-size:11.5px;margin-top:5px;line-height:1.65}.r-contact-panel{padding:28px 30px;align-self:center}.r-contact-panel h3{font-size:1.55rem;letter-spacing:-.025em;line-height:1.2;margin-top:10px;max-width:390px}.r-contact-panel>p:not(.r-eyebrow){font-size:13px;line-height:1.7;margin-top:13px}.r-contact-panel>.r-button{margin-top:20px}.r-contact-panel>.r-inline-link{display:flex;margin-top:11px;font-size:11.5px!important}.r-contact-panel>p.r-selected-priority{background:var(--r-soft);border-left:2px solid var(--r-accent-ink);padding:8px 10px;font-size:11.5px}.r-selected-priority>span{color:var(--r-accent-ink);font-weight:650}.r-contact-panel>.r-small{max-width:370px;font-size:10.5px!important}.r-reply-draft{border-top:1px solid var(--r-border);padding-top:15px;margin-top:18px}.r-reply-draft label{display:block;font-size:11px;font-weight:550}.r-reply-draft textarea{display:block;width:100%;resize:vertical;min-height:144px;padding:11px 13px;border-radius:9px;border:1px solid var(--r-border);background:var(--r-bg);color:var(--r-ink);font-size:12px;line-height:1.7;margin-top:8px}.r-reply-draft>.r-button{margin-top:10px}.r-reply-draft>.r-small{margin-top:9px}.r-footer{display:flex;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid var(--r-border);padding-block:20px 26px;font-size:10.5px;color:var(--r-muted)}.r-footer>span{font-size:14px;font-weight:600;color:var(--r-ink)}.r-footer>a{min-height:32px;display:flex;align-items:center}.r-footer a:hover{color:var(--r-accent-ink)}
@media(min-width:1500px){.r-section{padding-block:44px}.r-hero{padding-top:48px}}
@media(max-width:900px){.r-hero{gap:25px;grid-template-columns:1fr 1fr}.r-config-card{padding:20px}.r-hero h1{font-size:2.7rem}.r-business-options button{font-size:11px;padding-inline:10px}.r-audience-panel{gap:20px;padding:20px}.r-route-tabs button{padding:11px;gap:8px}.r-route-tabs button small{display:none}.r-demo-caption{padding:21px}.r-discovery{gap:24px}.r-price-side,.r-contact-panel{padding:24px}.r-nav{gap:21px}.r-scene{padding:18px}.r-journey{padding:16px}}
@media(max-width:700px){.r-shell{width:calc(100% - 36px)}.r-section{padding-block:28px;scroll-margin-top:120px}.r-header-top{min-height:53px}.r-header-label{font-size:10px}.r-brand{gap:10px}.r-brand-logo>strong{font-size:20px}.r-theme-toggle{min-height:32px;font-size:10px!important;padding:5px 9px}.r-nav{gap:20px;min-height:41px;padding-bottom:8px}.r-nav a{font-size:10.5px;gap:6px}.r-nav a>span{font-size:9px}.r-hero{grid-template-columns:1fr;gap:24px;padding-top:28px}.r-hero h1{font-size:2.65rem;max-width:480px;line-height:1.07}.r-hero-intro{font-size:14px;min-height:0;margin-top:14px!important}.r-business{margin-top:19px!important}.r-business-options{gap:6px;display:grid;grid-template-columns:1fr 1fr 1.15fr}.r-business-options button{padding:11px 9px;font-size:11px;gap:7px}.r-hero-actions{margin-top:12px}.r-config-card{padding:19px 20px}.r-config-card h2 br{display:none}.r-config-card h2{font-size:1.6rem}.r-config-card h2 br:after{content:' '}.r-config-card>p{margin-top:10px;font-size:13px}.r-config-card .r-profile-rule{min-height:0}.r-config-card .r-eyebrow{font-size:9.5px}.r-rule-rows{margin-top:12px}.r-rule-rows>div{padding-block:7px}.r-build-path{justify-content:flex-start;gap:11px;margin-top:11px}.r-config-card .r-details{margin-top:10px}.r-step-head{margin-bottom:17px}.r-step-head h2{font-size:1.8rem;line-height:1.15}.r-subtitle{font-size:12.5px;margin-top:9px!important}.r-audience-tabs{gap:6px}.r-audience-tabs button{min-height:59px;padding:10px 20px 10px 10px}.r-audience-tabs button strong{font-size:11px;line-height:1.35;max-width:86px}.r-audience-tabs button small{display:none}.r-audience-tabs button>span{right:8px;top:19px;font-size:13px}.r-audience-panel{grid-template-columns:1fr;gap:16px;padding:17px 18px;min-height:0}.r-audience-copy h3{font-size:1.2rem}.r-audience-copy>p:not(.r-spoken){font-size:13px;line-height:1.65;margin-top:9px}.r-spoken{font-size:12px}.r-result-line{margin-top:10px;font-size:11.5px}.r-job-card{padding:12px 14px}.r-job-card .r-eyebrow{font-size:9px}.r-job-card ol{margin-top:7px}.r-job-card li{padding-block:6px;gap:10px}.r-job-card strong{font-size:11px}.r-job-card small{font-size:9px}.r-job-card li>span{font-size:9px}.r-audience-footer{align-items:flex-start;gap:13px;margin-top:12px}.r-audience-footer>p{font-size:11px;line-height:1.6;padding-top:3px}.r-audience-controls{gap:5px}.r-audience-controls .r-icon-button{width:40px;height:40px}.r-audience-controls>span{font-size:9px;min-width:28px}.r-route-tabs{gap:6px}.r-route-tabs button{position:relative;display:block;min-height:64px;padding:10px 12px;text-align:left}.r-route-tabs button strong{font-size:11px;line-height:1.35;margin-top:4px}.r-tab-number{font-size:9px}.r-tab-check{position:absolute;right:9px;top:10px;font-size:11px}.r-route-panel{grid-template-columns:1fr}.r-demo-screen{border-right:0;border-bottom:1px solid var(--r-border)}.r-scene{min-height:216px;padding:16px}.r-demo-caption{min-height:0;padding:18px 19px}.r-demo-caption h3{font-size:1.2rem;margin-top:6px}.r-demo-caption>p:not(.r-eyebrow){min-height:0;font-size:13px;margin-top:8px}.r-preview-controls{margin-top:12px}.r-demo-caption .r-eyebrow{font-size:9px}.r-demo-caption .r-button{min-height:38px;font-size:11px!important}.r-demo-caption .r-icon-button{width:38px;height:38px}.r-chat-example{font-size:11px}.r-chat-bubble{margin-right:13px}.r-chat-bubble.r-buyer{margin-left:23px}.r-measure-example{max-width:320px}.r-enquiry-illustration{max-width:390px}.r-example-note{font-size:9.5px!important}.r-details summary{font-size:11.5px;min-height:44px}.r-details-body{font-size:11.5px}.r-journey-compare{grid-template-columns:1fr;gap:10px}.r-journey{padding:15px 17px}.r-journey h3{font-size:12px;margin-bottom:12px}.r-path{font-size:10.5px;gap:7px}.r-path+.r-path{margin-top:10px;padding-top:10px}.r-priorities{margin-top:18px!important}.r-priorities>div{gap:7px}.r-priorities button{font-size:10.5px;min-height:40px;padding:9px 11px;gap:10px;flex:1 1 auto}.r-priorities legend{font-size:11.5px}.r-priorities>p{font-size:11px;min-height:35px}.r-discovery{grid-template-columns:1fr;gap:15px;margin-top:19px;padding-top:19px}.r-discovery>div>p:not(.r-eyebrow){font-size:12px;margin-top:8px}.r-discovery h3{font-size:1.15rem;max-width:330px}.r-evidence>.r-details:first-child{border-top:1px solid var(--r-border)}.r-start-card{grid-template-columns:1fr}.r-price-side{padding:23px;border-right:0;border-bottom:1px solid var(--r-border)}.r-price-side>.r-eyebrow{font-size:10px}.r-price{font-size:3.6rem;margin:7px 0 12px!important}.r-price-side>p:not(.r-eyebrow):not(.r-price):not(.r-small){font-size:13px}.r-price-flex{font-size:11px!important}.r-return-prompt{margin-top:14px;padding-top:12px}.r-return-prompt strong{font-size:11.5px}.r-return-prompt p{font-size:11px}.r-contact-panel{padding:23px}.r-contact-panel h3{font-size:1.5rem}.r-contact-panel>p:not(.r-eyebrow){font-size:13px}.r-contact-panel>.r-button{width:100%;font-size:11.5px!important;min-height:46px;margin-top:16px}.r-footer{flex-wrap:wrap;padding-block:17px 24px;gap:8px;font-size:9.5px}.r-footer>span{font-size:12px}.r-footer>p{order:3;width:100%;font-size:9px}.r-footer>a{margin-left:auto}.r-hero-video video{max-height:280px}}
@media(max-width:360px){.r-shell{width:calc(100% - 28px)}.r-hero h1{font-size:2.32rem}.r-business-options button{font-size:10px;padding-inline:7px}.r-audience-tabs button strong{font-size:10px}.r-route-tabs button{padding-inline:9px}.r-route-tabs button strong{font-size:10px}.r-document-rows>div{font-size:9.5px}.r-document-rows dd{max-width:62%}.r-config-card{padding:17px}.r-rule-rows>div{font-size:10.5px}.r-theme-toggle{font-size:9px!important}}
@media(prefers-reduced-motion:reduce){.t3r *, .t3r *:before, .t3r *:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
@media print{.t3r{background:white!important;color:black!important;--r-bg:white;--r-surface:white;--r-raised:#f3f3f3;--r-ink:black;--r-muted:#444;--r-border:#ccc;--r-accent-ink:#333;--r-soft:#f5f5f5}.r-header{position:static;background:white}.r-theme-toggle,.r-nav,.r-skip,.r-preview-controls,.r-hero-actions{display:none!important}.r-shell{width:100%}.r-section{break-inside:avoid;padding-block:18px}.r-hero h1{font-size:30px}.t3r .r-audience-panel[hidden]{display:grid!important}.r-audience-tabs{display:none}.r-audience-footer{display:none}.r-footer{display:none}.r-demo-screen{print-color-adjust:exact}}
`;
