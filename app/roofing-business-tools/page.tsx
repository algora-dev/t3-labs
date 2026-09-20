"use client";

import { useMemo, useState } from "react";

const bookingUrl = "https://calendly.com/insights-t3labs/20-minute-meeting";
const apexDemoUrl = "https://www.t3labs.tech/apex-roofing";

const SCREENSHOTS = {
  measurement: "/assets/roofing-solutions/known-1-roof-area-entry.jpg",
  takeoff: "/assets/roofing-solutions/plan-1-takeoff-canvas.jpg",
  assistant: "/assets/roofing-solutions/assistant-3-product-question.jpg",
  dashboard: "/assets/roofing-solutions/apex-demo-home.jpg",
  output: "/assets/roofing-solutions/result-quote-output.jpg",
} as const;

type ModuleKey = "measurement" | "takeoff" | "assistant";

type AudienceKey = "homeowner" | "trade" | "team";

const modules = {
  measurement: {
    key: "measurement" as const,
    number: "01",
    title: "Measurement-to-price tool",
    eyebrow: "Core tool",
    short: "Start with known measurements and turn them into a useful roofing output.",
    description:
      "A homeowner, contractor or staff member enters the roof measurements they already have, applies your products and gets a useful pricing, material or quote-ready result.",
    bullets: [
      "Works for simple estimates or complex multi-product roofs",
      "Uses your products, pricing rules and approved options",
      "Can output an estimate, enquiry summary or quote-ready result",
    ],
    steps: [
      "Enter roof areas, lengths or basic dimensions already known",
      "Apply the right roofing products, accessories and pricing rules",
      "Return a useful result the customer can act on or the team can review",
    ],
    image: SCREENSHOTS.measurement,
    replaceNote: "Replace with a real screenshot of the measurement-to-price tool in use.",
  },
  takeoff: {
    key: "takeoff" as const,
    number: "02",
    title: "Digital takeoff add-on",
    eyebrow: "Measurement layer",
    short: "Let people measure first, then flow straight into the pricing tool.",
    description:
      "If the user does not already know the measurements, they upload a plan or image, measure the roof digitally, and send those results straight into the same pricing workflow.",
    bullets: [
      "Useful when the user has a plan but not a quantity takeoff",
      "Reduces re-keying because the measured output goes straight into the next tool",
      "Great for contractors, estimators or more serious customer enquiries",
    ],
    steps: [
      "Upload a plan or roof image and set the scale",
      "Measure the roof, ridges, valleys, hips or other required components",
      "Pass those measurements directly into the pricing tool for the next stage",
    ],
    image: SCREENSHOTS.takeoff,
    replaceNote: "Replace with a screenshot of the digital takeoff tool, ideally with a roof measured on screen.",
  },
  assistant: {
    key: "assistant" as const,
    number: "03",
    title: "Smart Assistant",
    eyebrow: "Conversational layer",
    short: "Answer questions, guide the user and create a better enquiry or estimate path.",
    description:
      "A Smart Assistant gives people a fast way to ask product questions, pricing questions or workflow questions. It can answer using approved business knowledge, or guide the user into the right structured tool.",
    bullets: [
      "Can answer useful questions without adding another phone call to the team",
      "Can guide a person into the right next tool or collect a better enquiry",
      "Can be tightly controlled so it only answers what you want it to answer",
    ],
    steps: [
      "The customer asks a product, compatibility or pricing question",
      "The assistant answers from your approved information and pricing rules",
      "If needed, it hands off to your team with the right context already collected",
    ],
    image: SCREENSHOTS.assistant,
    replaceNote: "Replace with a screenshot of the Smart Assistant answering a roofing question or building an estimate.",
  },
};

const audienceContent = {
  homeowner: {
    title: "Homeowners and new website visitors",
    question: "Can I get a rough roof price, product direction or useful answer without waiting for a call back?",
    bullets: [
      "Get a faster answer while interest is high",
      "See a ballpark estimate or useful next step before contacting the team",
      "Turn a basic visitor into a more prepared enquiry",
    ],
  },
  trade: {
    title: "Roofers, repeat trade buyers and quoting contractors",
    question: "Can I measure, price and save roofing jobs using this supplier's system instead of starting from scratch every time?",
    bullets: [
      "Use trade pricing, approved products and saved jobs",
      "Build quotes faster and create a reason to keep buying from you",
      "Give good contractors a genuinely useful tool worth returning to",
    ],
  },
  team: {
    title: "Your internal estimating and sales team",
    question: "Can our own staff use the same system with more power, more control and less re-keying?",
    bullets: [
      "Give staff their own version with internal pricing, controls and outputs",
      "Preserve job context instead of starting again from a weak enquiry",
      "Reduce repetitive work and speed up quote preparation",
    ],
  },
};

const adminCards = [
  {
    title: "Products and rules",
    text: "Organise products, accessories and approved options. Control what can be selected and how the outputs are built.",
  },
  {
    title: "Pricing layers",
    text: "Manage public, trade and customer-specific price levels without showing the wrong prices to the wrong people.",
  },
  {
    title: "Trade access",
    text: "Approve contractor users, assign pricing tiers and give repeat buyers a practical reason to keep using your system.",
  },
  {
    title: "Quote intelligence",
    text: "Track quote activity, indicative value, quoted products and follow-up opportunities your team can act on.",
  },
  {
    title: "Offers and actions",
    text: "Prompt the right next step at the right time, such as formal quote requests, first-order offers or trade sign-up prompts.",
  },
  {
    title: "Workflow controls",
    text: "Decide what the public can do, what trade users can do, and when the team needs to review or take over.",
  },
] as const;

const deploymentLayers = [
  {
    title: "Public website layer",
    text: "Help customers get a useful answer, basic price direction or better enquiry without making a phone call the only route.",
  },
  {
    title: "Trade layer",
    text: "Give approved roofers trade pricing, saved work and a tool worth returning to when quoting jobs.",
  },
  {
    title: "Team layer",
    text: "Let your own team use a more powerful version for internal quoting, estimating and reviewing structured job details.",
  },
  {
    title: "Admin layer",
    text: "Control products, prices, users, offers, tracking and permissions from one place.",
  },
] as const;

function PlaceholderShot({ src, alt, caption, note }: { src: string; alt: string; caption: string; note: string }) {
  return (
    <figure className="rb-shot-card">
      <img src={src} alt={alt} />
      <figcaption>
        <strong>{caption}</strong>
        <span>{note}</span>
      </figcaption>
    </figure>
  );
}

export default function RoofingBusinessToolsPage() {
  const [selectedModules, setSelectedModules] = useState<ModuleKey[]>(["measurement", "takeoff", "assistant"]);
  const [activeAudience, setActiveAudience] = useState<AudienceKey>("trade");

  const orderedModules = useMemo(() => {
    const keys: ModuleKey[] = ["measurement", "takeoff", "assistant"];
    return keys.filter((key) => selectedModules.includes(key));
  }, [selectedModules]);

  const toggleModule = (key: ModuleKey) => {
    setSelectedModules((current) => {
      const exists = current.includes(key);
      if (exists) {
        if (current.length === 1) return current;
        return current.filter((item) => item !== key);
      }
      return [...current, key];
    });
  };

  const flowSummary = useMemo(() => {
    const hasMeasurement = selectedModules.includes("measurement");
    const hasTakeoff = selectedModules.includes("takeoff");
    const hasAssistant = selectedModules.includes("assistant");

    const entries: { title: string; text: string }[] = [];

    if (hasTakeoff) {
      entries.push({
        title: "Start with a plan",
        text: "A user uploads a plan or image and measures the roof digitally.",
      });
    }

    if (hasMeasurement) {
      entries.push({
        title: hasTakeoff ? "Move into pricing" : "Start with known measurements",
        text: hasTakeoff
          ? "Those measurements flow straight into the pricing workflow."
          : "The user enters the measurements they already know and applies your products.",
      });
    }

    if (hasAssistant) {
      entries.push({
        title: hasMeasurement || hasTakeoff ? "Answer questions on the way" : "Start with a conversation",
        text: hasMeasurement || hasTakeoff
          ? "The Smart Assistant answers questions, qualifies users and can guide them into the right tool or next step."
          : "The Smart Assistant answers questions, guides the user and can create a structured enquiry or estimate path.",
      });
    }

    entries.push({
      title: "Create the right outcome",
      text: "That outcome might be an estimate, a stronger enquiry, a trade opportunity, a staff-ready job or a quote workflow.",
    });

    return entries;
  }, [selectedModules]);

  return (
    <main className="rb-page">
      <style>{styles}</style>

      <header className="rbt-header sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="/roofing-solutions" className="flex items-center gap-2 font-semibold" aria-label="T3 Labs roofing solutions">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{background:"#0a0b10"}}><img src="/assets/t3-logo-white.png" alt="T3 Labs" className="h-7 w-7" /></span>
            <span className="hidden text-sm sm:inline" style={{color:"#9aa1b5"}}>Labs</span>
          </a>
          <nav className="hidden items-center gap-5 text-sm lg:flex" style={{color:"#9aa1b5"}}>
            <a href="#the-system" className="rbt-nav-link">The System</a>
            <a href="#build-your-system" className="rbt-nav-link">Build Your System</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href={apexDemoUrl} target="_blank" rel="noopener noreferrer" style={{borderColor:"#262a3a",color:"#9aa1b5"}} className="btn-outline rbt-nav-link rounded-full border px-3 py-1.5 text-xs font-medium">
              Apex demo ↗
            </a>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" style={{background:"#d7ff00",color:"#0a0b10"}} className="btn-solid hidden rounded-full px-4 py-1.5 text-xs font-semibold sm:inline-flex">
              Book a call
            </a>
          </div>
        </div>
      </header>

      <section className="rb-hero">
        <div className="rb-grid-glow" aria-hidden="true" />
        <div className="rb-shell rb-hero-grid">
          <div>
            <p className="rb-eyebrow">Roofing business tools</p>
            <h1>
              Build a <em>roofing system</em> that helps customers, supports trade users and gives your team better control.
            </h1>
            <p className="rb-lead">
              Start with one useful tool or combine measurement, digital takeoff, Smart Assistance and business controls into a system that makes your website more useful and your quoting process more efficient.
            </p>
            <div className="rb-hero-actions">
              <a className="rb-primary" href="#the-system">
                See the system <span aria-hidden="true">→</span>
              </a>
              <a className="rb-secondary" href="#build-your-system">Map your ideal setup</a>
            </div>
            <p className="rb-fineprint">
              Basic customer tools, trade pricing layers, staff workflows and admin controls can all be configured around how your roofing business already works.
            </p>
          </div>

          <div className="rb-dashboard" aria-label="Example admin dashboard illustration">
            <div className="rb-dash-top">
              <span className="rb-live">
                <i /> Example dashboard
              </span>
              <span>Illustrative view</span>
            </div>
            <div className="rb-stat-grid">
              <div>
                <strong>125</strong>
                <span>quotes created this month</span>
              </div>
              <div>
                <strong>£284k</strong>
                <span>indicative quote value</span>
              </div>
              <div>
                <strong>31</strong>
                <span>follow-up opportunities</span>
              </div>
            </div>
            <div className="rb-chart">
              <span>What the system can reveal</span>
              <div className="rb-bars">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="rb-product-row">
              <span className="rb-dot" /> Most quoted: Heritage clay tile <b>Open insights →</b>
            </div>
            <div className="rb-dash-offer">
              <span>Opportunity example</span>
              <p>See quoted jobs that did not convert, then offer a better next step.</p>
              <button type="button">Review follow-up list</button>
            </div>
          </div>
        </div>
      </section>

      <section className="rb-proof">
        <div className="rb-shell rb-proof-grid">
          <p>More than a roofing calculator.</p>
          <p>
            This page goes deeper than Roofing Solutions. It shows how the system can be configured, how the tools connect, who they help, and what extra value appears when you add trade, team and admin layers.
          </p>
        </div>
      </section>

      <section className="rb-section rb-shell" id="the-system">
        <div className="rb-section-heading rb-section-heading--narrow">
          <p className="rb-eyebrow">Build your system</p>
          <h2>Choose one core tool or combine them into a much more capable roofing workflow.</h2>
          <p>
            These tools are already built. The job is to configure them around your products, pricing rules, team workflow and the kind of users you want to help.
          </p>
        </div>

        <div className="rb-config-grid">
          {["measurement", "takeoff", "assistant"].map((key) => {
            const module = modules[key as ModuleKey];
            const active = selectedModules.includes(key as ModuleKey);
            return (
              <button
                key={module.key}
                type="button"
                className={`rb-picker ${active ? "is-active" : ""}`}
                onClick={() => toggleModule(module.key)}
                aria-pressed={active}
              >
                <span className="rb-picker-top">
                  <span className="rb-number">{module.number}</span>
                  <span className="rb-card-eyebrow">{module.eyebrow}</span>
                </span>
                <strong>{module.title}</strong>
                <span>{module.short}</span>
              </button>
            );
          })}
        </div>

        <div className="rb-builder">
          <div className="rb-builder-copy">
            <p className="rb-card-eyebrow">Selected configuration</p>
            <h3>
              {orderedModules.length === 1
                ? `You are looking at a ${modules[orderedModules[0]].title.toLowerCase()} setup.`
                : "Here is how your selected tools can work together."}
            </h3>
            <p>
              Start small or build a fuller system. The selected mix below shows one practical way these tools can connect and create a better customer, trade or staff experience.
            </p>
          </div>
          <div className="rb-builder-flow" aria-label="Selected roofing system flow">
            {flowSummary.map((entry, index) => (
              <div className="rb-builder-step" key={entry.title}>
                <article>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{entry.title}</b>
                  <p>{entry.text}</p>
                </article>
                {index < flowSummary.length - 1 ? <i aria-hidden="true">→</i> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rb-section rb-showcase">
        <div className="rb-shell">
          <div className="rb-section-heading rb-showcase-heading">
            <p className="rb-eyebrow">See each tool more clearly</p>
            <h2>Three building blocks. Different jobs. One connected system.</h2>
            <p>
              Use screenshots, demos and examples to show how each tool works in practice. The placeholders below are ready to swap for real product imagery.
            </p>
          </div>

          <div className="rb-module-stack">
            {orderedModules.map((key) => {
              const module = modules[key];
              return (
                <article className="rb-module-show" key={module.key}>
                  <div className="rb-module-copy">
                    <p className="rb-card-eyebrow">{module.eyebrow}</p>
                    <h3>{module.title}</h3>
                    <p className="rb-module-desc">{module.description}</p>
                    <ul className="rb-check-list">
                      {module.bullets.map((bullet) => (
                        <li key={bullet}>
                          <span>✓</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                    <div className="rb-mini-flow">
                      {module.steps.map((step, index) => (
                        <div key={step}>
                          <strong>{index + 1}</strong>
                          <p>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <PlaceholderShot
                      src={module.image}
                      alt={module.title}
                      caption={module.title}
                      note={module.replaceNote}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rb-section rb-shell">
        <div className="rb-section-heading rb-section-heading--narrow">
          <p className="rb-eyebrow">One system, three main user groups</p>
          <h2>The same roofing knowledge can help customers, trade users and your team in different ways.</h2>
          <p>
            The system becomes more useful as you decide who it is for, what they are allowed to do, and how far they should get before your team needs to step in.
          </p>
        </div>

        <div className="rb-audience-switch" role="tablist" aria-label="Audience examples">
          {(Object.keys(audienceContent) as AudienceKey[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`rb-audience-tab ${activeAudience === key ? "is-active" : ""}`}
              onClick={() => setActiveAudience(key)}
              role="tab"
              aria-selected={activeAudience === key}
            >
              {key === "homeowner" ? "Homeowners" : key === "trade" ? "Trade users" : "Your team"}
            </button>
          ))}
        </div>

        <div className="rb-audience-panel">
          <div>
            <p className="rb-card-eyebrow">Example audience</p>
            <h3>{audienceContent[activeAudience].title}</h3>
            <p className="rb-audience-question">{audienceContent[activeAudience].question}</p>
            <ul className="rb-check-list rb-check-list--tight">
              {audienceContent[activeAudience].bullets.map((bullet) => (
                <li key={bullet}>
                  <span>✓</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <div className="rb-audience-shots">
            <PlaceholderShot
              src={SCREENSHOTS.output}
              alt="Example roofing output"
              caption="Useful output example"
              note="Swap for a screenshot that matches the selected audience journey, such as a homeowner estimate, trade quote or staff-ready output."
            />
          </div>
        </div>
      </section>

      <section className="rb-section rb-layered">
        <div className="rb-shell">
          <div className="rb-section-heading rb-section-heading--narrow">
            <p className="rb-eyebrow">How the system can expand</p>
            <h2>Start public. Add trade. Add team. Add control.</h2>
            <p>
              You do not need to launch everything at once. Think of the system in layers. Each layer adds more value, more control or a more specific use case.
            </p>
          </div>

          <div className="rb-layer-grid">
            {deploymentLayers.map((layer, index) => (
              <article key={layer.title} className="rb-layer-card">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{layer.title}</h3>
                <p>{layer.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rb-section rb-shell">
        <div className="rb-section-heading rb-section-heading--narrow">
          <p className="rb-eyebrow">Admin and insight layer</p>
          <h2>If you want more control, add the admin portal and tracking layer.</h2>
          <p>
            The admin portal is where pricing, users, trade access, quote intelligence and follow-up opportunities come together. It helps turn a useful tool into a more useful business system.
          </p>
        </div>

        <div className="rb-admin-grid">
          <div>
            <PlaceholderShot
              src={SCREENSHOTS.dashboard}
              alt="Admin dashboard example"
              caption="Example admin dashboard"
              note="Replace with an actual admin screenshot or a refined mock-up showing tracking, products, trade tiers and quote activity."
            />
          </div>
          <div className="rb-controls">
            {adminCards.map((card) => (
              <article key={card.title}>
                <span className="rb-control-icon" aria-hidden="true">+</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rb-section rb-opportunity">
        <div className="rb-shell rb-opportunity-grid">
          <div>
            <p className="rb-eyebrow">What could this mean for your business?</p>
            <h2>Useful tools do more than answer questions. They can create a much better commercial position.</h2>
            <div className="rb-question-list">
              <article>
                <h3>What if more homeowners could get a useful answer before calling your team?</h3>
                <p>That could mean fewer dead-end visits, better enquiries and more people moving forward while they are still interested.</p>
              </article>
              <article>
                <h3>What if roofers in your area preferred using your quoting workflow because it was the easiest one available?</h3>
                <p>That could create more repeat quoting activity, more trade conversations and more materials purchased through your business.</p>
              </article>
              <article>
                <h3>What if your own team could start with stronger information instead of chasing basics first?</h3>
                <p>That could mean less repetitive work, faster turnaround and more time spent on higher-value jobs.</p>
              </article>
            </div>
          </div>
          <div className="rb-opportunity-card">
            <p className="rb-card-eyebrow">Example conversion moment</p>
            <h3>Turn useful activity into the next right action.</h3>
            <p>
              If someone keeps using the tool, asks for more detail or builds high-value quotes, your system can prompt the right next step, from formal quote requests to trade-access discussions.
            </p>
            <div>
              <button type="button">Discuss trade pricing</button>
              <button type="button">Request a formal quote</button>
            </div>
            <small>This is where a useful tool starts becoming a practical lead and conversion system.</small>
          </div>
        </div>
      </section>

      <section className="rb-close" id="build-your-system">
        <div className="rb-shell rb-close-inner">
          <p className="rb-eyebrow">Build your roofing system</p>
          <h2>Tell us who you want to help first, and we will map the smallest useful starting point.</h2>
          <p>
            You might start with a public estimate tool, a trade quoting layer, a Smart Assistant, or a fuller setup that combines them. The point is to begin with the part that would make the biggest difference.
          </p>
          <div className="rb-hero-actions">
            <a className="rb-primary" href={bookingUrl} target="_blank" rel="noopener noreferrer">
              Book a free roofing workflow call <span aria-hidden="true">→</span>
            </a>
            <a className="rb-secondary" href={apexDemoUrl} target="_blank" rel="noopener noreferrer">
              Try the Apex Roofing demo
            </a>
          </div>
          <p className="rb-close-note">
            Use this page to understand what is possible. Use the Roofing Solutions page to understand why businesses like yours are starting with these tools.
          </p>
        </div>
      </section>

      <footer className="rb-footer">
        <div className="rb-shell">
          <span>© T3 Labs</span>
          <span>Roofing tools · Trade growth · Smarter quoting</span>
        </div>
      </footer>
    </main>
  );
}

const styles = String.raw`
.rb-page{--lime:#d7ff00;--ink:#090b12;--surface:#10141f;--raised:#151b29;--line:#2a3243;--muted:#a5adbd;background:var(--ink);color:#f5f7fc;font-family:Arial,Helvetica,sans-serif;line-height:1.5}
.rb-page *{box-sizing:border-box}
.rb-page :is(h1,h2,h3,p){margin:0}
.rb-shell{max-width:1180px;margin:auto;padding-inline:24px}
.rbt-header{background:rgba(10,11,16,.88);border-color:#262a3a}
.rbt-header a{text-decoration:none}
.rbt-nav-link{transition:color .16s ease}
.rbt-nav-link:hover{color:#fff}
.rb-secondary{color:#fff;text-decoration:none;font-weight:700;font-size:14px}
.rb-page [id]{scroll-margin-top:96px}
.btn-solid:hover{transform:translateY(-1px);filter:brightness(1.08);box-shadow:0 7px 22px rgba(215,255,0,.18)}
.btn-outline:hover{transform:translateY(-1px);border-color:#d7ff00!important;color:#fff!important}
.rb-hero{position:relative;overflow:hidden;padding:74px 0 86px;background:radial-gradient(circle at 75% 35%,rgba(215,255,0,.15),transparent 28%),linear-gradient(135deg,#090b12,#111827)}
.rb-grid-glow{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(to right,#000 35%,transparent 85%)}
.rb-hero-grid{position:relative;display:grid;grid-template-columns:1.05fr .95fr;gap:64px;align-items:center}
.rb-eyebrow,.rb-card-eyebrow{color:var(--lime);font-size:12px;text-transform:uppercase;letter-spacing:.14em;font-weight:800}
.rb-hero h1{font-size:clamp(42px,5vw,70px);line-height:.98;letter-spacing:-.055em;margin-top:18px;max-width:760px}
.rb-hero h1 em{font-style:normal;color:var(--lime)}
.rb-lead{font-size:18px;line-height:1.65;color:var(--muted);max-width:660px;margin-top:26px}
.rb-hero-actions{display:flex;flex-wrap:wrap;gap:20px;align-items:center;margin-top:32px}
.rb-primary{display:inline-flex;gap:9px;align-items:center;border-radius:999px;background:var(--lime);color:var(--ink);padding:15px 22px;text-decoration:none;font-size:14px;font-weight:800;transition:transform .2s,box-shadow .2s}
.rb-primary:hover{transform:translateY(-2px);box-shadow:0 13px 30px rgba(215,255,0,.26)}
.rb-secondary{border-bottom:1px solid rgba(255,255,255,.5);padding-bottom:3px}
.rb-fineprint{font-size:13px;color:#8892a6;margin-top:22px;max-width:640px}
.rb-dashboard{border:1px solid #3b475c;border-radius:18px;background:rgba(17,24,39,.9);box-shadow:0 28px 70px rgba(0,0,0,.38);padding:22px;transform:rotate(2deg)}
.rb-dash-top,.rb-product-row{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#9ba5b8}
.rb-live{color:#fff}.rb-live i{display:inline-block;width:7px;height:7px;background:var(--lime);border-radius:50%;margin-right:6px}
.rb-stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:22px 0}.rb-stat-grid div,.rb-chart,.rb-dash-offer{background:#202938;border:1px solid #334057;border-radius:11px;padding:14px}
.rb-stat-grid strong{display:block;font-size:21px}.rb-stat-grid span{display:block;font-size:10px;color:#9ba5b8;margin-top:4px}.rb-chart{height:116px;color:#aab4c7;font-size:11px}.rb-bars{height:72px;display:flex;gap:8px;align-items:end;padding-top:10px}.rb-bars i{background:linear-gradient(#d7ff00,#7f9b08);width:10%;border-radius:3px 3px 0 0}.rb-bars i:nth-child(1){height:27%}.rb-bars i:nth-child(2){height:45%}.rb-bars i:nth-child(3){height:38%}.rb-bars i:nth-child(4){height:74%}.rb-bars i:nth-child(5){height:57%}.rb-bars i:nth-child(6){height:88%}.rb-bars i:nth-child(7){height:65%}
.rb-product-row{padding:17px 2px}.rb-product-row b{color:var(--lime);font-weight:700}.rb-dot{width:8px;height:8px;background:#77aaff;border-radius:50%;margin-right:7px}.rb-dash-offer{border-color:rgba(215,255,0,.35);background:rgba(215,255,0,.08)}.rb-dash-offer span{font-size:10px;text-transform:uppercase;color:var(--lime);font-weight:700;letter-spacing:.08em}.rb-dash-offer p{font-size:13px;color:#fff;margin:6px 0 12px}.rb-dash-offer button,.rb-opportunity-card button{border:0;border-radius:999px;padding:8px 11px;background:var(--lime);color:var(--ink);font-size:11px;font-weight:800}
.rb-proof{border-block:1px solid var(--line);background:#0d111a}.rb-proof-grid{display:grid;grid-template-columns:1fr 1.7fr;gap:24px;padding-block:22px}.rb-proof p:first-child{color:var(--lime);font-weight:800}.rb-proof p:last-child{color:var(--muted)}
.rb-section{padding-block:96px}.rb-section-heading{max-width:880px}.rb-section-heading--narrow{max-width:780px}.rb-section-heading h2,.rb-showcase h2,.rb-opportunity h2,.rb-close h2{font-size:clamp(30px,4vw,52px);line-height:1.04;letter-spacing:-.045em;margin-top:15px}.rb-section-heading>p:last-child,.rb-close p,.rb-opportunity p{margin-top:18px;color:var(--muted);font-size:17px;line-height:1.7}
.rb-config-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:42px}.rb-picker{appearance:none;border:1px solid var(--line);background:var(--surface);color:#fff;padding:24px;border-radius:16px;text-align:left;display:grid;gap:10px;cursor:pointer;transition:transform .2s,border-color .2s,background .2s}.rb-picker:hover{transform:translateY(-2px);border-color:#46526c}.rb-picker.is-active{border-color:rgba(215,255,0,.45);background:linear-gradient(180deg,rgba(215,255,0,.08),rgba(255,255,255,.01))}.rb-picker-top{display:flex;align-items:center;justify-content:space-between;gap:16px}.rb-picker strong{font-size:21px;letter-spacing:-.02em}.rb-picker span:last-child{color:var(--muted);font-size:14px;line-height:1.6}
.rb-builder{display:grid;grid-template-columns:.9fr 1.1fr;gap:24px;margin-top:22px;padding:28px;border:1px solid var(--line);border-radius:18px;background:#111723}.rb-builder-copy h3{font-size:28px;line-height:1.1;letter-spacing:-.03em;margin-top:12px}.rb-builder-copy p:last-child{margin-top:16px;color:var(--muted);font-size:16px;line-height:1.7}.rb-builder-flow{display:grid;gap:16px}.rb-builder-step{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:center}.rb-builder-step article{padding:18px;border:1px solid #344057;border-radius:14px;background:#171f2c}.rb-builder-step span{display:inline-block;font-size:11px;text-transform:uppercase;letter-spacing:.1em;color:var(--lime);font-weight:800;margin-bottom:10px}.rb-builder-step b{display:block;font-size:18px;margin-bottom:8px}.rb-builder-step p{color:#c7cedc;font-size:14px;line-height:1.6}.rb-builder-step i{font-style:normal;color:var(--lime);font-size:22px}
.rb-showcase{background:#f3f5f9;color:#10131c}.rb-showcase-heading .rb-eyebrow{color:#627700}.rb-showcase-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:72px;align-items:center}.rb-module-stack{display:grid;gap:22px;margin-top:42px}.rb-module-show{display:grid;grid-template-columns:1.05fr .95fr;gap:28px;align-items:start;padding:28px;background:#fff;border:1px solid #d5dae5;border-radius:18px;box-shadow:0 20px 45px rgba(18,27,46,.08)}.rb-module-copy h3{font-size:30px;line-height:1.1;letter-spacing:-.03em;margin-top:12px}.rb-module-desc{margin-top:16px;color:#475063;font-size:16px;line-height:1.75}.rb-check-list{list-style:none;padding:0;margin:22px 0 0;display:grid;gap:10px}.rb-check-list li{display:flex;gap:10px;color:#1b2330;font-size:15px;line-height:1.65}.rb-check-list li span{color:#627700;font-weight:900}.rb-check-list--tight{margin-top:18px}.rb-mini-flow{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:24px}.rb-mini-flow div{padding:16px;border-radius:12px;background:#f3f5f9;border:1px solid #dde3ef}.rb-mini-flow strong{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#10131c;color:#fff;font-size:13px;margin-bottom:10px}.rb-mini-flow p{font-size:13px;line-height:1.6;color:#536075}
.rb-shot-card{display:grid;gap:0;background:#fff;padding:10px;border:1px solid #d5dae5;border-radius:14px;box-shadow:0 24px 55px rgba(18,27,46,.13)}.rb-shot-card img{display:block;width:100%;height:auto;border-radius:8px;background:#d9dde8;min-height:280px;object-fit:cover}.rb-shot-card figcaption{display:grid;gap:6px;padding:12px 6px 4px}.rb-shot-card strong{font-size:14px;color:#1a2230}.rb-shot-card span{font-size:12px;line-height:1.5;color:#606a7b}
.rb-audience-switch{display:flex;flex-wrap:wrap;gap:10px;margin-top:36px}.rb-audience-tab{appearance:none;border:1px solid var(--line);background:var(--surface);color:#fff;padding:12px 16px;border-radius:999px;cursor:pointer;font-size:14px;font-weight:700}.rb-audience-tab.is-active{background:var(--lime);color:var(--ink);border-color:var(--lime)}.rb-audience-panel{display:grid;grid-template-columns:.9fr 1.1fr;gap:28px;align-items:start;margin-top:22px;padding:28px;border:1px solid var(--line);background:var(--surface);border-radius:18px}.rb-audience-panel h3{font-size:30px;line-height:1.1;letter-spacing:-.03em;margin-top:12px}.rb-audience-question{margin-top:16px;color:#dfe5f1;font-size:18px;line-height:1.55}.rb-audience-shots .rb-shot-card{background:#151b29;border-color:#2e3749;box-shadow:none}.rb-audience-shots .rb-shot-card strong{color:#fff}.rb-audience-shots .rb-shot-card span{color:#aab3c5}
.rb-layered{background:#0d111a;border-block:1px solid var(--line)}.rb-layer-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:42px}.rb-layer-card{padding:22px;border-radius:14px;background:var(--surface);border-top:3px solid var(--lime);border-inline:1px solid var(--line);border-bottom:1px solid var(--line)}.rb-layer-card span{display:inline-block;font-size:12px;color:var(--lime);font-weight:800;letter-spacing:.08em;margin-bottom:12px}.rb-layer-card h3{font-size:20px;line-height:1.2;letter-spacing:-.02em}.rb-layer-card p{margin-top:10px;color:var(--muted);font-size:14px;line-height:1.65}
.rb-admin-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:28px;align-items:start;margin-top:40px}.rb-controls{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.rb-controls article{padding:22px;background:var(--surface);border:1px solid var(--line);border-radius:12px}.rb-control-icon{display:grid;place-items:center;width:29px;height:29px;border-radius:50%;background:rgba(215,255,0,.12);color:var(--lime);font-weight:800}.rb-controls h3{font-size:18px;letter-spacing:-.02em;margin-top:14px}.rb-controls p{font-size:14px;color:var(--muted);margin-top:8px;line-height:1.65}
.rb-opportunity{background:linear-gradient(135deg,#1b2432,#10151f);border-block:1px solid var(--line)}.rb-opportunity-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:60px;align-items:start}.rb-question-list{display:grid;gap:16px;margin-top:26px}.rb-question-list article{padding:18px;border-left:3px solid var(--lime);background:rgba(255,255,255,.03)}.rb-question-list h3{font-size:20px;line-height:1.3;letter-spacing:-.02em}.rb-question-list p{margin-top:8px;color:var(--muted);font-size:15px;line-height:1.7}.rb-opportunity-card{background:#fbfcff;color:#121722;border-radius:15px;padding:30px;box-shadow:0 24px 55px rgba(0,0,0,.25)}.rb-opportunity-card .rb-card-eyebrow{color:#647800}.rb-opportunity-card h3{font-size:28px;line-height:1.1;letter-spacing:-.03em;margin:11px 0}.rb-opportunity-card p{color:#596274;margin:0 0 22px;font-size:15px;line-height:1.7}.rb-opportunity-card div{display:flex;flex-wrap:wrap;gap:9px}.rb-opportunity-card button+button{background:#eef1f5;color:#273041}.rb-opportunity-card small{display:block;color:#7a8495;font-size:12px;line-height:1.55;margin-top:22px}
.rb-close{padding-block:110px;background:radial-gradient(circle at 30% 0,rgba(215,255,0,.14),transparent 32%),#080a0f}.rb-close-inner{max-width:860px;text-align:center}.rb-close h2{margin-inline:auto}.rb-close p{max-width:720px;margin-inline:auto}.rb-close .rb-hero-actions{justify-content:center}.rb-close-note{font-size:13px;color:#8d96a9 !important;margin-top:22px}
.rb-footer{border-top:1px solid var(--line);color:#8d96a9;font-size:12px}.rb-footer .rb-shell{display:flex;justify-content:space-between;padding-block:25px}
@media(max-width:980px){.rb-config-grid,.rb-layer-grid{grid-template-columns:1fr 1fr}.rb-builder,.rb-module-show,.rb-audience-panel,.rb-admin-grid,.rb-opportunity-grid{grid-template-columns:1fr}.rb-controls{grid-template-columns:1fr}.rb-mini-flow{grid-template-columns:1fr}.rb-builder-step{grid-template-columns:1fr}.rb-builder-step i{display:none}}
@media(max-width:800px){.rb-shell{padding-inline:20px}.rb-hero{padding-block:46px 58px}.rb-hero-grid,.rb-proof-grid,.rb-config-grid,.rb-module-grid,.rb-layer-grid,.rb-controls{grid-template-columns:1fr}.rb-dashboard{transform:none}.rb-proof-grid{padding-block:18px}.rb-section{padding-block:68px}.rb-footer .rb-shell{flex-direction:column;gap:8px}.rb-hero h1{font-size:42px}.rb-section-heading h2,.rb-showcase h2,.rb-opportunity h2,.rb-close h2{font-size:34px}.rb-stat-grid{grid-template-columns:1fr}.rb-layer-card,.rb-picker,.rb-builder,.rb-module-show,.rb-audience-panel,.rb-opportunity-card{padding:22px}.rb-audience-switch{gap:8px}}
`;
