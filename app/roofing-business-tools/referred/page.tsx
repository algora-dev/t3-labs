"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const bookingUrl = "https://calendly.com/insights-t3labs/20-minute-meeting";
const apexDemoUrl = "/demo/roofing-site";

const ASSET = "/assets/roofing-business-tools";

const IMAGES = {
  measurement: [
    {
      src: `${ASSET}/measure-2.jpg`,
      title: "Enter measurements and apply products",
      note: "Start with measurements already known, then attach the products, waste and pricing rules that belong to that roof component.",
    },
    {
      src: `${ASSET}/measure-3.jpg`,
      title: "Create a useful pricing output",
      note: "Turn the measured job into a clear material and pricing result, with the next action configured around the business.",
    },
  ],
  takeoff: [
    {
      src: `${ASSET}/takeoff-1.jpg`,
      title: "Upload and calibrate the plan",
      note: "The user starts from a plan or suitable image and calibrates it using a known distance.",
    },
    {
      src: `${ASSET}/takeoff-2.jpg`,
      title: "Measure the roof digitally",
      note: "Areas and lineal components such as hips, valleys, barges and spouting can be measured directly on the plan.",
    },
    {
      src: `${ASSET}/takeoff-3.jpg`,
      title: "Continue straight into pricing",
      note: "The measured output can move directly into the pricing workflow instead of being re-entered somewhere else.",
    },
  ],
  assistant: [
    {
      src: `${ASSET}/assistant-1.jpg`,
      title: "Answer a real product question",
      note: "Start with the kind of question a customer would normally ask the team by phone or email.",
    },
    {
      src: `${ASSET}/assistant-2.jpg`,
      title: "Recognise buying intent",
      note: "The assistant can move from product guidance into a pricing conversation and offer the right path forward.",
    },
    {
      src: `${ASSET}/assistant-3.jpg`,
      title: "Ask the questions needed to price properly",
      note: "A guided flow can collect roof size, measurement type, project details and other inputs needed for a useful estimate.",
    },
    {
      src: `${ASSET}/assistant-4.jpg`,
      title: "Return a useful estimate",
      note: "The Smart Assistant can use the same approved pricing logic to create a clear indicative result inside the conversation.",
    },
    {
      src: `${ASSET}/assistant-5.jpg`,
      title: "Let the customer review the job",
      note: "Before handoff, the user can review what the system understood and correct details if needed.",
    },
    {
      src: `${ASSET}/assistant-6.jpg`,
      title: "Turn the conversation into a qualified enquiry",
      note: "Project details and estimate context can be carried into the enquiry so the team starts with useful information.",
    },
  ],
  homeowner: [
    {
      src: `${ASSET}/assistant-4.jpg`,
      title: "Example customer-facing result",
      note: "A homeowner can get useful price direction and a clear next step without waiting for somebody to manually answer the first question.",
    },
  ],
  trade: [
    {
      src: `${ASSET}/trade-1.jpg`,
      title: "Trade user starts with the job",
      note: "Approved trade users can work through the same system with their own pricing access and job choices.",
    },
    {
      src: `${ASSET}/trade-2.jpg`,
      title: "Trade pricing appears in the output",
      note: "The same measured job can return trade-specific pricing, savings and next actions for the logged-in contractor.",
    },
  ],
  team: [
    {
      src: `${ASSET}/team.png`,
      title: "Example custom team workspace",
      note: "A fully custom internal workspace could combine takeoff, job details, quoting, orders, invoices, actions and staff workflows in one place.",
    },
  ],
  admin: [
    {
      src: `${ASSET}/admin-1.jpg`,
      title: "Products and pricing",
      note: "Manage the products, categories, measurement types and prices that power the customer-facing tools.",
    },
    {
      src: `${ASSET}/admin-2.jpg`,
      title: "Trade users and pricing tiers",
      note: "Create trade tiers, invite customers and control the pricing level attached to each account.",
    },
    {
      src: `${ASSET}/admin-3.jpg`,
      title: "Tracking and follow-up opportunities",
      note: "See quote activity, conversion signals, trade usage and valuable jobs that may be worth following up.",
    },
  ],
} as const;

type PageVariant = "direct" | "referred";
type ModuleKey = "measurement" | "takeoff" | "assistant";
type AudienceKey = "homeowner" | "trade" | "team";
type Slide = { src: string; title: string; note: string };
type LightboxImage = { src: string; title: string } | null;

const MODULE_ORDER: ModuleKey[] = ["measurement", "takeoff", "assistant"];

const modules: Record<
  ModuleKey,
  {
    number: string;
    eyebrow: string;
    title: string;
    short: string;
    description: string;
    bullets: string[];
    steps: string[];
    slides: readonly Slide[];
    flagship?: boolean;
  }
> = {
  measurement: {
    number: "01",
    eyebrow: "Core pricing tool",
    title: "Measurement-to-price",
    short: "Turn roof measurements into products, quantities and pricing.",
    description:
      "If the measurements are already known, this is the quickest route to a useful result. The workflow is configured around the business's own products, calculations, pricing and required output.",
    bullets: [
      "Use known roof areas, lengths and other required measurements",
      "Apply products, accessories, waste and pricing rules automatically",
      "Return an estimate, material list, quote-ready output or next action",
    ],
    steps: ["Enter measurements", "Apply products + rules", "Create the result"],
    slides: IMAGES.measurement,
  },
  takeoff: {
    number: "02",
    eyebrow: "Measurement add-on",
    title: "Digital takeoff",
    short: "Measure the plan first, then continue straight into pricing.",
    description:
      "When the user does not have measurements yet, they can upload a plan or image, measure the roof digitally and carry those measurements into the same pricing workflow without starting again.",
    bullets: [
      "Upload a plan or suitable image and calibrate it",
      "Measure roof areas and the lineal components the business cares about",
      "Pass the finished takeoff directly into the pricing workflow",
    ],
    steps: ["Upload + calibrate", "Measure", "Continue into pricing"],
    slides: IMAGES.takeoff,
  },
  assistant: {
    number: "03",
    eyebrow: "Flagship capability",
    title: "Smart Assistant",
    short: "Let customers ask naturally, then guide them toward an answer, estimate or enquiry.",
    description:
      "The Smart Assistant is not just a website chat box. It can use approved business knowledge, products and pricing rules, ask for missing information, create pricing outputs and hand a better-qualified opportunity to the team.",
    bullets: [
      "Answer approved product, compatibility, pricing and business questions",
      "Ask the follow-up questions needed to create a meaningful result",
      "Move the user from question to estimate, structured tool or human handoff",
    ],
    steps: ["Ask", "Clarify + calculate", "Answer + convert"],
    slides: IMAGES.assistant,
    flagship: true,
  },
};

const audiences: Record<
  AudienceKey,
  {
    tab: string;
    title: string;
    question: string;
    bullets: string[];
    slides: readonly Slide[];
  }
> = {
  homeowner: {
    tab: "Homeowners",
    title: "Homeowners and new website visitors",
    question: "Can I get a useful answer or price direction without waiting for somebody to call me back?",
    bullets: [
      "Get an answer while interest is still high",
      "See useful price direction or a next step before contacting the team",
      "Send a much better-prepared enquiry if they choose to continue",
    ],
    slides: IMAGES.homeowner,
  },
  trade: {
    tab: "Trade users",
    title: "Roofers, repeat trade buyers and quoting contractors",
    question: "Can I measure and price my own jobs using this supplier's products and my approved trade pricing?",
    bullets: [
      "Give approved users their own trade pricing and workflow",
      "Let contractors quote jobs using the products they already buy",
      "Create a practical reason for good customers to keep returning",
    ],
    slides: IMAGES.trade,
  },
  team: {
    tab: "Your team",
    title: "Your own estimating, sales and operations team",
    question: "Could the same underlying technology become a custom internal system for the way our business actually works?",
    bullets: [
      "Combine takeoff, pricing, quoting, orders, invoices and job information",
      "Give staff more controls than the public or trade-facing version",
      "Build a focused internal workspace instead of forcing staff through disconnected systems",
    ],
    slides: IMAGES.team,
  },
};

const customisation = [
  ["Brand", "Colours, typography, styling and interface details."],
  ["Products", "Ten products, hundreds, or a much larger catalogue."],
  ["Pricing", "Public, trade, customer-specific, labour, waste and calculation logic."],
  ["Flow", "Questions, steps, screens, measurements and actions."],
  ["Access", "Public users, trade accounts, staff roles and permissions."],
  ["Outputs", "Estimates, material lists, enquiries, quotes and next actions."],
] as const;

const adminCapabilities = [
  ["Products + rules", "Control the information and products that power the tools."],
  ["Pricing layers", "Keep public, trade and customer-specific pricing separated."],
  ["Trade access", "Approve accounts, tiers and who gets access to each level."],
  ["Quote intelligence", "See quote activity, value, product demand and follow-up signals."],
  ["Actions", "Prompt formal quotes, trade discussions, enquiries or other next steps."],
  ["Workflow control", "Decide what stays self-service and when the team takes over."],
] as const;

function Carousel({
  slides,
  onOpen,
  dark = false,
  prominent = false,
}: {
  slides: readonly Slide[];
  onOpen: (image: Exclude<LightboxImage, null>) => void;
  dark?: boolean;
  prominent?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const current = slides[index];
  const previous = () => setIndex((value) => (value - 1 + count) % count);
  const next = () => setIndex((value) => (value + 1) % count);

  useEffect(() => {
    setIndex(0);
  }, [slides]);

  return (
    <figure className={`rb-carousel ${dark ? "rb-carousel--dark" : ""} ${prominent ? "rb-carousel--prominent" : ""}`}>
      <button className="rb-carousel-image" type="button" onClick={() => onOpen({ src: current.src, title: current.title })}>
        <img src={current.src} alt={current.title} />
        <span className="rb-zoom">View larger</span>
      </button>
      <figcaption>
        <div className="rb-carousel-copy">
          <strong>{current.title}</strong>
          <span>{current.note}</span>
        </div>
        {count > 1 ? (
          <div className="rb-carousel-controls" aria-label="Screenshot carousel controls">
            <button type="button" onClick={previous} aria-label="Previous screenshot">←</button>
            <span>{index + 1} / {count}</span>
            <button type="button" onClick={next} aria-label="Next screenshot">→</button>
          </div>
        ) : null}
      </figcaption>
      {count > 1 ? (
        <div className="rb-dots" aria-hidden="true">
          {slides.map((slide, dotIndex) => (
            <button key={slide.src} type="button" className={dotIndex === index ? "is-active" : ""} onClick={() => setIndex(dotIndex)} tabIndex={-1} />
          ))}
        </div>
      ) : null}
    </figure>
  );
}

export function RoofingBusinessToolsPage({ variant = "referred" }: { variant?: PageVariant }) {
  const [selectedModules, setSelectedModules] = useState<ModuleKey[]>(["measurement", "takeoff", "assistant"]);
  const [flowFlash, setFlowFlash] = useState(0);
  const [pickerNudge, setPickerNudge] = useState(false);
  const pickerGridRef = useRef<HTMLDivElement | null>(null);
  const hasInteractedRef = useRef(false);
  const [activeAudience, setActiveAudience] = useState<AudienceKey>("trade");
  const [lightbox, setLightbox] = useState<LightboxImage>(null);
  const [videoActive, setVideoActive] = useState(false);
  const isReferral = variant === "referred";

  const orderedModules = useMemo(() => MODULE_ORDER.filter((key) => selectedModules.includes(key)), [selectedModules]);

  useEffect(() => {
    if (!lightbox) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setLightbox(null);
    window.addEventListener("keydown", close);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", close);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  useEffect(() => {
    const node = pickerGridRef.current;
    if (!node) return;
    let show: ReturnType<typeof setTimeout> | undefined;
    let hide: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (hasInteractedRef.current || entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          if (hasInteractedRef.current) return;
          show = setTimeout(() => {
            if (!hasInteractedRef.current) setPickerNudge(true);
          }, 300);
          hide = setTimeout(() => setPickerNudge(false), 300 + 1500);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (show) clearTimeout(show);
      if (hide) clearTimeout(hide);
    };
  }, []);

  const toggleModule = (key: ModuleKey) => {
    hasInteractedRef.current = true;
    setPickerNudge(false);
    setFlowFlash((seq) => seq + 1);
    setSelectedModules((current) => {
      if (current.includes(key)) {
        return current.filter((item) => item !== key);
      }
      return MODULE_ORDER.filter((item) => [...current, key].includes(item));
    });
  };

  const setAllModules = (next: ModuleKey[]) => {
    hasInteractedRef.current = true;
    setPickerNudge(false);
    setFlowFlash((seq) => seq + 1);
    setSelectedModules(next);
  };

  const flow = useMemo(() => {
    const items: { title: string; text: string }[] = [];
    if (selectedModules.includes("takeoff")) items.push({ title: "Measure the plan", text: "Upload a plan or image and create the takeoff." });
    if (selectedModules.includes("measurement")) items.push({ title: selectedModules.includes("takeoff") ? "Apply products + pricing" : "Start with known measurements", text: "Use the business's products, calculations and pricing rules." });
    if (selectedModules.includes("assistant")) items.push({ title: selectedModules.length > 1 ? "Help throughout the journey" : "Start with a conversation", text: "Answer questions, gather missing details and guide the next step." });
    items.push({ title: "Create the right outcome", text: "Estimate, quote-ready result, enquiry, trade action or internal workflow." });
    return items;
  }, [selectedModules]);

  return (
    <main className="rb-page">
      <style>{styles}</style>

      <header className="rb-header">
        <div className="rb-shell rb-header-inner">
          <a href="/roofing-solutions" className="rb-brand" aria-label="T3 Labs roofing solutions">
            <span><img src="/assets/t3-logo-white.png" alt="T3 Labs" /></span>
            <b>T3 Labs</b>
          </a>
          <nav>
            <a href="#tools">Tools</a>
            <a href="#customise">Customise</a>
            <a href="#users">Users</a>
            <a href="#admin">Admin</a>
          </nav>
          <div className="rb-header-actions">
            <a className="rb-header-demo" href={apexDemoUrl} target="_blank" rel="noopener noreferrer">Try live demo ↗</a>
            {isReferral ? (
              <a className="rb-header-call" href="#next-step">Next step</a>
            ) : (
              <a className="rb-header-call" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book a call</a>
            )}
          </div>
        </div>
      </header>

      <section className="rb-hero">
        <div className="rb-grid-glow" aria-hidden="true" />
        <div className="rb-shell rb-hero-grid">
          <div className="rb-hero-copy">
            <p className="rb-eyebrow">Roofing business tools</p>
            <h1>Build the tools your <em>customers, trade users and team</em> actually need.</h1>
            <p className="rb-lead">
              Start with one useful tool or combine measurement, digital takeoff, Smart Assistant, trade access and business controls into a system configured around the way your roofing business works.
            </p>
            <div className="rb-actions">
              <a className="rb-primary" href={apexDemoUrl} target="_blank" rel="noopener noreferrer">Try the live Apex demo <span>→</span></a>
              <a className="rb-secondary" href="#tools">Explore the tools</a>
            </div>
            <p className="rb-fineprint">The Apex setup is a working example, not a fixed template. The products, pricing, flow, styling, permissions and outputs can all change.</p>
          </div>

          <div className="rb-hero-visual">
            <div className="rb-hero-video">
              {videoActive ? (
                <iframe
                  src="https://www.youtube.com/embed/FIqNbi3bG7A?autoplay=1"
                  title="T3 Labs 90-second overview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button type="button" className="rb-video-facade" onClick={() => setVideoActive(true)} aria-label="Play the roofing business tools demo video">
                  <img src={ASSET + "/admin-3.jpg"} alt="T3 Labs roofing business tools" />
                  <span className="rb-video-facade-overlay" aria-hidden="true" />
                  <span className="rb-video-play" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span>
                  <span className="rb-video-label">Watch the 90-second overview</span>
                </button>
              )}
            </div>
            <div className="rb-hero-stat-row">
              <span><b>Products</b> + pricing</span>
              <span><b>Quotes</b> + activity</span>
              <span><b>Trade</b> + follow-up</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rb-quick-strip">
        <div className="rb-shell">
          <strong>These are examples of what the technology can become.</strong>
          <span>The real value comes from combining the tools with your business knowledge, products, pricing and workflow. Roofing is the worked example, but the same framework can be adapted to other construction businesses.</span>
        </div>
      </section>

      <section className="rb-section rb-shell" id="tools">
        <div className="rb-heading rb-heading--wide">
          <p className="rb-eyebrow">Choose the building blocks</p>
          <h2>Start simple. Combine the parts that solve the right problem.</h2>
          <p>All three are selected to show the full workflow. Select or deselect any tool to see different configurations and the role each one can play in the business.</p>
        </div>

        <div className="rb-picker-status" aria-live="polite">
          <span className="rb-picker-count">{selectedModules.length} of {MODULE_ORDER.length} selected</span>
          <div className="rb-picker-status-actions">
            <button type="button" onClick={() => setAllModules([...MODULE_ORDER])} disabled={selectedModules.length === MODULE_ORDER.length}>Select all</button>
            <button type="button" onClick={() => setAllModules([])} disabled={selectedModules.length === 0}>Clear</button>
          </div>
        </div>

        <div className={`rb-picker-grid${pickerNudge ? " rb-nudge" : ""}`} ref={pickerGridRef}>
          {MODULE_ORDER.map((key) => {
            const item = modules[key];
            const active = selectedModules.includes(key);
            return (
              <button key={key} type="button" className={`rb-picker ${active ? "is-active" : ""}`} onClick={() => toggleModule(key)} aria-pressed={active}>
                <span className="rb-picker-top"><b>{item.number}</b><i>{item.eyebrow}</i><em className="rb-picker-check" aria-hidden="true">✓</em></span>
                <strong>{item.title}</strong>
                <span>{item.short}</span>
                <span className="rb-picker-hint">{active ? "Selected, tap to remove" : "Tap to select"}</span>
              </button>
            );
          })}
        </div>

        <div className={`rb-flow-panel${flowFlash > 0 ? " rb-flow-flash" : ""}`} key={flowFlash}>
          {orderedModules.length === 0 ? (
            <div className="rb-flow-empty">
              <p className="rb-card-label">Nothing selected yet</p>
              <h3>Pick a tool above to build a workflow.</h3>
              <p>Each tool is useful on its own. Select more to see how they connect into one system.</p>
            </div>
          ) : (
          <div>
            <p className="rb-card-label">Selected configuration</p>
            <h3>{orderedModules.length === 1 ? `${modules[orderedModules[0]].title} only` : "One connected workflow"}</h3>
            <p>The exact sequence can change by business. This simply shows one sensible way the selected pieces can work together.</p>
          </div>
          )}
          {orderedModules.length > 0 ? (
          <div className="rb-flow">
            {flow.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><b>{item.title}</b><p>{item.text}</p></div>
              </article>
            ))}
          </div>
          ) : null}
        </div>
      </section>

      <section className="rb-section rb-tools-showcase">
        <div className="rb-shell">
          <div className="rb-heading rb-heading--wide rb-dark-copy">
            <p className="rb-eyebrow">See the tools in action</p>
            <h2>Real examples from the working Apex Roofing demo.</h2>
            <p>Each slide shows a different part of the journey. Click any screenshot to view it larger, or open the live demo and use the tools yourself.</p>
          </div>

          <div className="rb-tool-stack">
            {MODULE_ORDER.map((key) => {
              const item = modules[key];
              return (
                <article className={`rb-tool-card ${item.flagship ? "rb-tool-card--flagship" : ""}`} key={key}>
                  <div className="rb-tool-copy">
                    <div className="rb-tool-meta"><span>{item.eyebrow}</span>{item.flagship ? <b>Flagship</b> : null}</div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <ul>
                      {item.bullets.map((bullet) => <li key={bullet}><span>✓</span>{bullet}</li>)}
                    </ul>
                    <div className="rb-step-row">
                      {item.steps.map((step, index) => <span key={step}><b>{index + 1}</b>{step}</span>)}
                    </div>
                    <a href={apexDemoUrl} target="_blank" rel="noopener noreferrer" className="rb-demo-btn">Try this in the live demo <span>→</span></a>
                  </div>
                  <Carousel slides={item.slides} onOpen={setLightbox} prominent={item.flagship} />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rb-section rb-shell" id="customise">
        <div className="rb-customise-intro">
          <div className="rb-heading">
            <p className="rb-eyebrow">Built around the business</p>
            <h2>The demo is not the product. It is one example of what the framework can do.</h2>
          </div>
          <div className="rb-customise-copy">
            <p>These are not copy-and-paste systems. T3 Labs provides the underlying technology, but the business information is what makes each implementation useful.</p>
            <strong>The technology is the framework. Your products, pricing, knowledge and rules become the brain behind it.</strong>
          </div>
        </div>
        <div className="rb-custom-grid">
          {customisation.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="rb-section rb-user-section" id="users">
        <div className="rb-shell">
          <div className="rb-heading rb-heading--wide">
            <p className="rb-eyebrow">One system, different users</p>
            <h2>The same business logic can power very different experiences.</h2>
            <p>Decide who the system is for, what each user can see and how far they should get before your team needs to step in.</p>
          </div>

          <div className="rb-tabs" role="tablist" aria-label="User examples">
            {(Object.keys(audiences) as AudienceKey[]).map((key) => (
              <button key={key} type="button" role="tab" aria-selected={activeAudience === key} className={activeAudience === key ? "is-active" : ""} onClick={() => setActiveAudience(key)}>
                {audiences[key].tab}
              </button>
            ))}
          </div>

          <div className="rb-user-panel">
            <div className="rb-user-copy">
              <p className="rb-card-label">Example user</p>
              <h3>{audiences[activeAudience].title}</h3>
              <p className="rb-user-question">{audiences[activeAudience].question}</p>
              <ul>
                {audiences[activeAudience].bullets.map((bullet) => <li key={bullet}><span>✓</span>{bullet}</li>)}
              </ul>
              <a href={apexDemoUrl} target="_blank" rel="noopener noreferrer" className="rb-text-link rb-text-link--light">Explore the live demo →</a>
            </div>
            <Carousel slides={audiences[activeAudience].slides} onOpen={setLightbox} dark />
          </div>
        </div>
      </section>

      <section className="rb-section rb-shell" id="admin">
        <div className="rb-admin-grid">
          <div className="rb-admin-copy">
            <div className="rb-heading">
              <p className="rb-eyebrow">Admin + business controls</p>
              <h2>Control what powers the tools, then see what customers are doing with them.</h2>
              <p>The admin layer can be as simple or as capable as the project needs. These screenshots show three examples from the Apex demo.</p>
            </div>
            <div className="rb-capabilities">
              {adminCapabilities.map(([title, text]) => <article key={title}><div><h3>{title}</h3><p>{text}</p></div></article>)}
            </div>
          </div>
          <Carousel slides={IMAGES.admin} onOpen={setLightbox} />
        </div>
      </section>

      <section className="rb-section rb-outcomes">
        <div className="rb-shell rb-outcome-grid">
          <div>
            <p className="rb-eyebrow">What this can become</p>
            <h2>From one useful tool to a much broader roofing business system.</h2>
          </div>
          <div className="rb-outcome-list">
            <article><b>Public website</b><span>Help people get answers, measurements, price direction or a stronger enquiry.</span></article>
            <article><b>Trade portal</b><span>Give approved roofers pricing, saved workflows and a reason to keep quoting with you.</span></article>
            <article><b>Internal workspace</b><span>Build custom staff tools around jobs, takeoffs, quotes, orders, invoices and approvals.</span></article>
            <article><b>Business intelligence</b><span>See what people quote, what products are being used and where follow-up opportunities exist.</span></article>
          </div>
        </div>
      </section>

      <section className="rb-close" id="next-step">
        <div className="rb-shell rb-close-inner">
          <p className="rb-eyebrow">See it working</p>
          <h2>The easiest way to understand the possibilities is to use the demo.</h2>
          <p>Try the measurement tool, digital takeoff, Smart Assistant and trade/admin layers. If it sparks an idea for your own business, start with the smallest useful version and expand from there. If you want the roofing business case first, see <a href={isReferral ? "/roofing-solutions/referred" : "/roofing-solutions"} style={{ color: "inherit", textDecoration: "underline" }}>Roofing Solutions</a>. If roofing is not your industry, the <a href={isReferral ? "/our-solution/referred" : "/our-solution"} style={{ color: "inherit", textDecoration: "underline" }}>construction overview</a> explains the same approach more broadly.</p>
          <div className="rb-actions rb-actions--center">
            <a className="rb-primary" href={apexDemoUrl} target="_blank" rel="noopener noreferrer">Try the Apex Roofing demo <span>→</span></a>
            {isReferral ? (
              <span className="rb-secondary">Continue with the person who shared this page</span>
            ) : (
              <a className="rb-secondary" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book a 20-minute call</a>
            )}
          </div>
        </div>
      </section>

      <footer className="rb-footer"><div className="rb-shell"><span>© T3 Labs</span><span>Roofing tools · Trade growth · Smarter quoting</span></div></footer>

      {lightbox ? (
        <div className="rb-lightbox" role="dialog" aria-modal="true" aria-label={lightbox.title} onClick={() => setLightbox(null)}>
          <button type="button" className="rb-lightbox-close" onClick={() => setLightbox(null)} aria-label="Close image">×</button>
          <div className="rb-lightbox-inner" onClick={(event) => event.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.title} />
            <strong>{lightbox.title}</strong>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default function RoofingBusinessToolsReferredPage() {
  return <RoofingBusinessToolsPage variant="referred" />;
}

const styles = String.raw`
.rb-page{--lime:#d7ff00;--ink:#0a0b10;--surface:#101722;--surface2:#172131;--line:#303d51;--muted:#aab4c6;background:var(--ink);color:#fff;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.5}
.rb-page *{box-sizing:border-box}.rb-page :where(h1,h2,h3,p){margin:0}.rb-page button,.rb-page a{font:inherit}.rb-shell{max-width:1180px;margin:auto;padding-inline:24px}.rb-page [id]{scroll-margin-top:86px}
.rb-header{position:sticky;top:0;z-index:50;background:rgba(9,11,18,.9);backdrop-filter:blur(18px);border-bottom:1px solid #242b3a}.rb-header-inner{min-height:66px;display:flex;align-items:center;justify-content:space-between;gap:22px}.rb-brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none}.rb-brand span{display:grid;place-items:center;width:34px;height:34px;border-radius:9px;background:#0d111b}.rb-brand img{width:24px;height:24px;object-fit:contain}.rb-brand b{font-size:14px}.rb-header nav{display:flex;gap:22px}.rb-header nav a,.rb-header-demo{color:#a8b0bf;text-decoration:none;font-size:14px}.rb-header nav a:hover,.rb-header-demo:hover{color:#fff}.rb-header-actions{display:flex;align-items:center;gap:14px}.rb-header-call{background:var(--lime);color:#080a0f;text-decoration:none;font-size:12px;font-weight:600;padding:9px 14px;border-radius:999px}
.rb-eyebrow,.rb-card-label{font-size:11px;text-transform:uppercase;letter-spacing:.15em;font-weight:700;color:var(--lime)}.rb-hero{position:relative;overflow:hidden;padding:82px 0 28px;background:radial-gradient(circle at 82% 26%,rgba(215,255,0,.14),transparent 26%),linear-gradient(135deg,#0a0b10,#101722)}.rb-grid-glow{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:46px 46px;mask-image:linear-gradient(to right,#000 25%,transparent 92%)}.rb-hero-grid{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:62px;align-items:center}.rb-hero h1{font-size:clamp(42px,5vw,68px);line-height:.99;letter-spacing:-.055em;margin-top:16px}.rb-hero h1 em{font-style:normal;color:var(--lime)}.rb-lead{font-size:18px;line-height:1.67;color:var(--muted);max-width:650px;margin-top:24px}.rb-actions{display:flex;flex-wrap:wrap;gap:18px;align-items:center;margin-top:30px}.rb-primary{display:inline-flex;align-items:center;gap:8px;background:var(--lime);color:#0a0b10;text-decoration:none;padding:14px 20px;border-radius:999px;font-weight:700;font-size:14px;transition:.2s}.rb-primary:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(215,255,0,.2)}.rb-secondary{color:#fff;text-decoration:none;font-size:14px;font-weight:600;border-bottom:1px solid rgba(255,255,255,.45);padding-bottom:3px}.rb-fineprint{font-size:14px;color:#858fa2;margin-top:24px;max-width:640px}.rb-hero-visual{position:relative}.rb-hero-video{border:1px solid #303d51;background:#101722;padding:9px;border-radius:18px;box-shadow:0 30px 70px rgba(0,0,0,.38);width:104%;margin-left:-2%}.rb-hero-video iframe{display:block;width:100%;aspect-ratio:16/9;border:0;border-radius:11px;background:#000}.rb-video-facade{appearance:none;border:0;padding:0;width:100%;display:block;position:relative;cursor:pointer;border-radius:11px;overflow:hidden;background:#000}.rb-video-facade img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;opacity:.5}.rb-video-facade-overlay{position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,rgba(9,11,18,.1),rgba(9,11,18,.88))}.rb-video-play{position:absolute;left:50%;top:45%;transform:translate(-50%,-50%);display:grid;place-items:center;width:78px;height:78px;border-radius:50%;background:var(--lime);color:#080a0f;box-shadow:0 0 40px rgba(215,255,0,.45);transition:.2s}.rb-video-facade:hover .rb-video-play{transform:translate(-50%,-50%) scale(1.08);box-shadow:0 0 60px rgba(215,255,0,.65)}.rb-video-label{position:absolute;left:0;right:0;bottom:18px;text-align:center;color:#fff;font-size:15px;font-weight:600;letter-spacing:.02em}.rb-hero-stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 18px 0}.rb-hero-stat-row span{font-size:12px;color:#929db0;text-align:center}.rb-hero-stat-row b{color:#fff}.rb-quick-strip{border-block:1px solid #303d51;background:#101722}.rb-quick-strip .rb-shell{display:grid;grid-template-columns:.8fr 1.4fr;gap:34px;padding-block:22px}.rb-quick-strip strong{color:var(--lime);font-size:16px}.rb-quick-strip span{color:#aab4c6;font-size:14px}
.rb-section{padding-block:92px}.rb-heading{max-width:760px}.rb-heading--wide{max-width:850px}.rb-heading h2,.rb-outcomes h2,.rb-close h2{font-size:clamp(31px,4vw,50px);line-height:1.04;letter-spacing:-.045em;margin-top:14px}.rb-heading>p:last-child{margin-top:17px;color:var(--muted);font-size:18px;line-height:1.68}.rb-picker-status{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:32px;padding:7px 9px;border:1px solid var(--line);border-radius:999px;background:var(--surface);width:fit-content}.rb-picker-count{display:inline-flex;align-items:center;background:var(--lime);color:#080a0f;font-size:13px;font-weight:700;padding:8px 14px;border-radius:999px;letter-spacing:.01em}.rb-picker-status-actions{display:flex;align-items:center;gap:4px}.rb-picker-status-actions button{appearance:none;border:1px solid transparent;background:transparent;color:#a8b0bf;font-size:13px;font-weight:600;padding:8px 12px;border-radius:999px;cursor:pointer;transition:.2s}.rb-picker-status-actions button:hover:not(:disabled){color:#fff;border-color:rgba(215,255,0,.5);box-shadow:0 0 14px rgba(215,255,0,.18)}.rb-picker-status-actions button:disabled{opacity:.35;cursor:default}.rb-picker-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:14px}.rb-picker{appearance:none;text-align:left;border:1px solid var(--line);background:var(--surface);color:#fff;padding:22px;border-radius:15px;display:grid;gap:10px;cursor:pointer;transition:.2s}.rb-picker:hover{transform:translateY(-2px);border-color:rgba(215,255,0,.55);box-shadow:0 10px 30px rgba(215,255,0,.14)}.rb-picker.is-active{border-color:rgba(215,255,0,.5);background:linear-gradient(180deg,rgba(215,255,0,.08),rgba(255,255,255,.015))}.rb-picker.is-active:hover{box-shadow:0 12px 34px rgba(215,255,0,.2)}.rb-picker-top{display:flex;justify-content:space-between;align-items:center;gap:14px}.rb-picker-top b{color:var(--lime);font-size:12px}.rb-picker-top i{font-style:normal;font-size:11px;text-transform:uppercase;letter-spacing:.11em;color:#8f99ab}.rb-picker-check{flex:none;display:grid;place-items:center;width:30px;height:30px;border-radius:9px;border:2px solid #46536e;color:transparent;font-style:normal;font-size:15px;font-weight:800;transition:.2s}.rb-picker:not(.is-active):hover .rb-picker-check{border-color:rgba(215,255,0,.75);box-shadow:0 0 14px rgba(215,255,0,.22)}.rb-picker.is-active .rb-picker-check{background:var(--lime);border-color:var(--lime);color:#080a0f}.rb-picker>strong{font-size:20px}.rb-picker>span:not(.rb-picker-hint){color:var(--muted);font-size:14px;line-height:1.55}.rb-picker-hint{font-size:13px;font-weight:600;color:#9aa6ba}.rb-picker.is-active .rb-picker-hint{color:var(--lime)}.rb-flow-empty h3{font-size:26px;line-height:1.1;letter-spacing:-.03em;margin-top:11px}.rb-flow-empty p:last-child{color:var(--muted);font-size:16px;line-height:1.65;margin-top:14px}.rb-showcase-empty{margin-top:28px;padding:26px;border:1px dashed #c3cbd8;border-radius:14px;color:#596477;font-size:16px}.rb-flow-panel{display:grid;grid-template-columns:.75fr 1.25fr;gap:28px;margin-top:18px;padding:28px;border-radius:17px;border:1px solid var(--line);background:#101722}.rb-flow-panel h3{font-size:26px;line-height:1.1;letter-spacing:-.03em;margin-top:11px}.rb-flow-panel>div:first-child>p:last-child{color:var(--muted);font-size:16px;line-height:1.65;margin-top:14px}.rb-flow{display:grid;gap:10px}.rb-flow article{display:grid;grid-template-columns:40px 1fr;gap:13px;padding:15px;border-radius:12px;border:1px solid #303d51;background:#172131}.rb-flow article>span{color:var(--lime);font-size:11px;font-weight:700}.rb-flow b{font-size:16px}.rb-flow p{color:#aeb8c9;font-size:14px;margin-top:4px}.rb-flow-flash{animation:rb-flash .75s ease}@keyframes rb-flash{0%{box-shadow:0 0 0 rgba(215,255,0,0);border-color:var(--line)}30%{box-shadow:0 0 36px rgba(215,255,0,.35);border-color:rgba(215,255,0,.7)}100%{box-shadow:0 0 0 rgba(215,255,0,0);border-color:var(--line)}}@keyframes rb-nudge{0%,100%{transform:scale(1)}30%{transform:scale(1.22);box-shadow:0 0 18px rgba(215,255,0,.4);border-color:rgba(215,255,0,.85)}60%{transform:scale(1)}80%{transform:scale(1.1)}}.rb-nudge .rb-picker-check{animation:rb-nudge 1.1s ease .25s both}.rb-nudge .rb-picker:nth-child(2) .rb-picker-check{animation-delay:.5s}.rb-nudge .rb-picker:nth-child(3) .rb-picker-check{animation-delay:.75s}@media(prefers-reduced-motion:reduce){.rb-nudge .rb-picker-check,.rb-flow-flash{animation:none}}
.rb-tools-showcase{background:#f5f6f8;color:#111621}.rb-dark-copy .rb-eyebrow{color:#667a00}.rb-dark-copy>p:last-child{color:#596477}.rb-tool-stack{display:grid;gap:22px;margin-top:40px}.rb-tool-card{display:grid;grid-template-columns:.9fr 1.1fr;gap:30px;padding:28px;border:1px solid #dde2e8;border-radius:18px;background:#fff;box-shadow:0 18px 44px rgba(23,34,55,.08)}.rb-tool-card--flagship{border:2px solid #b6d500;box-shadow:0 24px 58px rgba(45,65,20,.14)}.rb-tool-meta{display:flex;align-items:center;gap:9px}.rb-tool-meta span{font-size:11px;text-transform:uppercase;letter-spacing:.13em;font-weight:700;color:#617500}.rb-tool-meta b{font-size:11px;text-transform:uppercase;letter-spacing:.1em;background:#101722;color:#fff;padding:5px 8px;border-radius:999px}.rb-tool-copy h3{font-size:26px;letter-spacing:-.035em;margin-top:12px}.rb-tool-copy>p{color:#4e596a;font-size:16px;line-height:1.72;margin-top:14px}.rb-tool-copy ul,.rb-user-copy ul{list-style:none;padding:0;margin:20px 0 0;display:grid;gap:9px}.rb-tool-copy li,.rb-user-copy li{display:flex;gap:9px;font-size:14px;line-height:1.55}.rb-tool-copy li span{color:#667a00;font-weight:700}.rb-step-row{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:22px}.rb-step-row span{display:flex;align-items:center;gap:8px;padding:10px;border-radius:10px;background:#f0f2f5;color:#536072;font-size:11px;font-weight:700}.rb-step-row b{display:grid;place-items:center;width:23px;height:23px;border-radius:50%;background:#151c28;color:#fff;font-size:11px}.rb-demo-btn{display:inline-flex;align-items:center;gap:8px;margin-top:22px;background:#0d111b;color:var(--lime);text-decoration:none;padding:12px 18px;border-radius:999px;font-size:14px;font-weight:600;border:1px solid #232d40;transition:.2s}.rb-demo-btn:hover{transform:translateY(-2px);box-shadow:0 0 26px rgba(215,255,0,.35);border-color:rgba(215,255,0,.5)}.rb-text-link{display:inline-block;margin-top:20px;color:#202a3a;text-decoration:none;font-weight:700;font-size:14px}.rb-text-link:hover{text-decoration:underline}
.rb-carousel{min-width:0;border:1px solid #dde2e8;background:#fff;padding:9px;border-radius:15px;box-shadow:0 18px 38px rgba(20,32,53,.1)}.rb-carousel--prominent{box-shadow:0 22px 48px rgba(51,76,21,.16)}.rb-carousel-image{appearance:none;border:0;padding:0;background:#f0f2f5;display:block;width:100%;border-radius:10px;overflow:hidden;position:relative;cursor:zoom-in}.rb-carousel-image img{display:block;width:100%;height:390px;object-fit:contain;object-position:center;background:#f0f2f5;transition:opacity .18s}.rb-carousel--prominent .rb-carousel-image{display:grid;place-items:center}.rb-carousel--prominent .rb-carousel-image img{width:auto;max-width:100%;height:390px;aspect-ratio:auto;object-fit:contain;object-position:center;margin-inline:auto;display:block}.rb-zoom{position:absolute;right:10px;bottom:10px;background:rgba(8,10,15,.82);color:#fff;border-radius:999px;padding:7px 9px;font-size:11px;font-weight:600;opacity:0;transition:.18s}.rb-carousel-image:hover .rb-zoom{opacity:1}.rb-carousel figcaption{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;padding:13px 7px 6px}.rb-carousel-copy{display:grid;gap:5px}.rb-carousel-copy strong{font-size:14px;color:#1a2230}.rb-carousel-copy span{font-size:11px;color:#657082;line-height:1.48;max-width:560px}.rb-carousel-controls{display:flex;align-items:center;gap:8px;flex:none}.rb-carousel-controls button{width:40px;height:40px;border-radius:50%;border:1px solid #232d40;background:#0d111b;color:var(--lime);cursor:pointer;font-size:17px;font-weight:700;display:grid;place-items:center;transition:.2s}.rb-carousel-controls button:hover{transform:translateY(-1px);border-color:rgba(215,255,0,.6);box-shadow:0 0 18px rgba(215,255,0,.4)}.rb-carousel-controls span{font-size:12px;font-weight:600;color:#3d4759;min-width:38px;text-align:center}.rb-dots{display:flex;justify-content:center;gap:6px;padding:4px 0 2px}.rb-dots button{appearance:none;width:6px;height:6px;border:0;border-radius:50%;background:#c4cad3;padding:0;cursor:pointer}.rb-dots button.is-active{background:#1a2230;transform:scale(1.3)}
.rb-customise-intro{display:grid;grid-template-columns:1fr .9fr;gap:80px;align-items:end}.rb-customise-copy{padding:24px;border-left:3px solid var(--lime);background:#101722}.rb-customise-copy p{color:var(--muted);font-size:16px;line-height:1.7}.rb-customise-copy strong{display:block;color:#fff;font-size:18px;line-height:1.45;margin-top:13px}.rb-custom-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:38px}.rb-custom-grid article{padding:20px;border-radius:13px;background:var(--surface);border:1px solid var(--line);transition:.22s}.rb-custom-grid article:hover{transform:translateY(-3px);border-color:rgba(215,255,0,.55);box-shadow:0 10px 30px rgba(215,255,0,.14)}.rb-custom-grid h3{font-size:18px;color:var(--lime)}.rb-custom-grid p{color:var(--muted);font-size:14px;line-height:1.6;margin-top:7px}
.rb-user-section{background:#101722;border-block:1px solid var(--line)}.rb-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-top:32px}.rb-tabs button{appearance:none;border:1px solid var(--line);background:var(--surface);color:#fff;border-radius:999px;padding:10px 14px;cursor:pointer;font-size:14px;font-weight:600}.rb-tabs button.is-active{background:var(--lime);color:#080a0f;border-color:var(--lime)}.rb-user-panel{display:grid;grid-template-columns:.78fr 1.22fr;gap:26px;align-items:start;padding:26px;border:1px solid var(--line);border-radius:17px;background:var(--surface);margin-top:17px}.rb-user-copy h3{font-size:26px;line-height:1.08;letter-spacing:-.03em;margin-top:12px}.rb-user-question{font-size:18px;line-height:1.55;color:#e1e6ef;margin-top:15px}.rb-user-copy li{color:#c7cfdd}.rb-user-copy li span{color:var(--lime);font-weight:700}.rb-text-link--light{color:#fff}.rb-carousel--dark{background:#172131;border-color:#303d51;box-shadow:none}.rb-carousel--dark .rb-carousel-copy strong{color:#fff}.rb-carousel--dark .rb-carousel-copy span{color:#aeb7c7}.rb-carousel--dark .rb-carousel-controls button{background:#0d111b;border-color:#303d51;color:var(--lime)}.rb-carousel--dark .rb-carousel-image{display:grid;place-items:center;background:#101722}.rb-carousel--dark .rb-carousel-image img{width:100%;height:auto;object-fit:cover}.rb-carousel--dark .rb-dots button{background:#556074}.rb-carousel--dark .rb-dots button.is-active{background:var(--lime)}
.rb-admin-grid{display:grid;grid-template-columns:.85fr 1.15fr;gap:34px;align-items:start}.rb-capabilities{display:grid;gap:9px;margin-top:26px}.rb-capabilities article{padding:14px 16px;border:1px solid var(--line);border-radius:11px;background:var(--surface);transition:.2s}.rb-capabilities article:hover{transform:translateY(-2px);border-color:rgba(215,255,0,.55);box-shadow:0 8px 22px rgba(215,255,0,.12)}.rb-capabilities h3{font-size:16px;color:var(--lime)}.rb-capabilities p{color:var(--muted);font-size:14px;line-height:1.5;margin-top:3px}.rb-outcomes{background:linear-gradient(135deg,#172131,#101722);border-block:1px solid var(--line)}.rb-outcome-grid{display:grid;grid-template-columns:.85fr 1.15fr;gap:70px}.rb-outcomes h2{margin-top:14px}.rb-outcome-list{display:grid;grid-template-columns:1fr 1fr;gap:11px}.rb-outcome-list article{padding:18px;border:1px solid #303d51;border-radius:12px;background:rgba(255,255,255,.025);display:grid;gap:7px}.rb-outcome-list b{font-size:16px}.rb-outcome-list span{font-size:14px;color:var(--muted);line-height:1.55}.rb-close{padding:104px 0;background:radial-gradient(circle at 50% 0,rgba(215,255,0,.13),transparent 34%),#080a0f}.rb-close-inner{max-width:850px;text-align:center}.rb-close h2{margin-inline:auto}.rb-close-inner>p:not(.rb-eyebrow){color:var(--muted);font-size:18px;line-height:1.7;max-width:720px;margin:18px auto 0}.rb-actions--center{justify-content:center}.rb-footer{border-top:1px solid var(--line);color:#858fa0;font-size:11px}.rb-footer .rb-shell{display:flex;justify-content:space-between;gap:20px;padding-block:24px}
.rb-lightbox{position:fixed;inset:0;z-index:100;background:rgba(4,6,10,.91);display:grid;place-items:center;padding:32px}.rb-lightbox-inner{max-width:min(1500px,95vw);max-height:90vh;display:grid;gap:12px}.rb-lightbox-inner img{display:block;max-width:100%;max-height:84vh;object-fit:contain;border-radius:12px;background:#fff}.rb-lightbox-inner strong{color:#fff;text-align:center;font-size:14px}.rb-lightbox-close{position:fixed;right:28px;top:22px;width:42px;height:42px;border-radius:50%;border:1px solid #485168;background:#141a26;color:#fff;font-size:26px;cursor:pointer}
@media(max-width:980px){.rb-header nav{display:none}.rb-hero-grid,.rb-flow-panel,.rb-tool-card,.rb-user-panel,.rb-admin-grid,.rb-outcome-grid,.rb-customise-intro{grid-template-columns:1fr}.rb-picker-grid,.rb-custom-grid{grid-template-columns:1fr 1fr}.rb-tool-card{gap:22px}.rb-carousel-image img{height:390px}.rb-outcome-list{grid-template-columns:1fr 1fr}.rb-customise-intro{gap:28px}}
@media(max-width:720px){.rb-shell{padding-inline:18px}.rb-header-inner{min-height:60px}.rb-brand b,.rb-header-demo{display:none}.rb-header-call{font-size:11px}.rb-hero{padding:54px 0 58px}.rb-hero-grid{gap:35px}.rb-hero h1{font-size:40px}.rb-lead{font-size:16px}.rb-quick-strip .rb-shell,.rb-picker-grid,.rb-custom-grid,.rb-outcome-list{grid-template-columns:1fr}.rb-section{padding-block:66px}.rb-heading h2,.rb-outcomes h2,.rb-close h2{font-size:34px}.rb-heading>p:last-child{font-size:16px}.rb-flow-panel,.rb-tool-card,.rb-user-panel{padding:20px}.rb-step-row{grid-template-columns:1fr}.rb-carousel-image img{height:300px}.rb-carousel figcaption{display:grid}.rb-carousel-controls{justify-self:end}.rb-user-panel{gap:18px}.rb-footer .rb-shell{flex-direction:column}.rb-lightbox{padding:16px}.rb-lightbox-close{right:12px;top:12px}}
`;
