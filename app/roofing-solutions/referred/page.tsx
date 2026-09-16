"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

/*
 * T3 Labs roofing landing page v3 — refinement pass (2026-09-16).
 * Font scale: 12 / 14 / 20 / 30 / 48 (5 sizes max).
 * Global rule: space over density. If copy only fits tiny, simplify the copy.
 */

type Business = "manufacturer" | "supplier" | "supply-install";
type Audience = "visitor" | "contractor" | "team";
type Method = "known" | "plan" | "assistant";

type Clip = {
  src: string;
  poster?: string;
};

const CONFIG = {
  // Main Apex Roofing demo site (starts at the beginning of the experience).
  apexDemoUrl: "/demo/roofing-site",
  shaunContactUrl: "https://calendly.com/cece-t3labs/20min",
  clips: {
    known: { src: "", poster: "" },
    plan: { src: "", poster: "" },
    assistant: { src: "", poster: "" },
  } as Record<Method, Clip>,
};

type AudienceStory = {
  label: string;
  quote: string;
  body: string;
  input: string;
  output: string;
  next: string;
  question: string;
};

type BusinessProfile = {
  label: string;
  opportunityQuestion: string;
  opportunityItems: string[];
  reflection: string;
  controlLine: string;
  audience: Record<Audience, AudienceStory>;
};

const PROFILES: Record<Business, BusinessProfile> = {
  manufacturer: {
    label: "Manufacturer",
    opportunityQuestion: "What if more of your customers could get the answers they need from your website before your team had to get involved?",
    opportunityItems: [
      "Answer common product and technical questions",
      "Know which roofing system suits the job",
      "Know which products and accessories work together",
      "Handle measurement and specification",
      "Build a preliminary product list",
      "Send a better-prepared technical or sales enquiry",
    ],
    reflection: "How much of this knowledge currently depends on someone from your team explaining it manually?",
    controlLine: "Your approved systems, compatibility rules, technical knowledge and chosen sales handoff.",
    audience: {
      visitor: {
        label: "A new website visitor",
        quote: "What might a new roof cost for my property?",
        body: "They can enter known measurements, measure from a plan, use a guided tool or ask the Smart Assistant, and get a useful first result before making a better-prepared enquiry.",
        input: "Project + roof details",
        output: "Suitable system + product guidance",
        next: "Stockist, technical or sales enquiry",
        question: "What if buyers understood your system before they called?",
      },
      contractor: {
        label: "A roofer or trade customer",
        quote: "Which products and accessories make up this system?",
        body: "Make approved combinations, quantities and technical details easier to work with, so specifying your products takes less effort.",
        input: "Chosen system + job details",
        output: "Product schedule + accessories",
        next: "Trade enquiry or chosen sales channel",
        question: "Would simpler specification make your products easier to choose again?",
      },
      team: {
        label: "Your own team",
        quote: "Build the product schedule for this project.",
        body: "The same configured knowledge can support internal workflows, with the permissions and review steps your business wants.",
        input: "Project details + approved system",
        output: "Consistent product schedule",
        next: "Technical review or commercial quote",
        question: "How often is your team rebuilding the same product information?",
      },
    },
  },
  supplier: {
    label: "Supplier",
    opportunityQuestion: "What if more of your customers could get the answers they need from your website before your team had to get involved?",
    opportunityItems: [
      "Get basic or indicative pricing",
      "Work out how much material they need",
      "Know which products suit the job",
      "Know which products and accessories work together",
      "Build a multi-product estimate or preliminary quote",
      "Send a more complete enquiry or order request",
    ],
    reflection: "How many of these currently turn into a phone call, email or manual quote?",
    controlLine: "Your catalogue, coverage rules, public pricing, private trade rates and chosen handoff rules.",
    audience: {
      visitor: {
        label: "A new website visitor",
        quote: "What might a new roof cost for my property?",
        body: "They can enter known measurements, measure from a plan, use a guided tool or ask the Smart Assistant, and get a useful first result before making a better-prepared enquiry.",
        input: "Roof size + product preference",
        output: "Quantities + indicative pricing",
        next: "Prepared enquiry for your team",
        question: "What if a new buyer could get this far before your phone rang?",
      },
      contractor: {
        label: "A roofing customer / contractor",
        quote: "Price this job using the products I normally buy.",
        body: "The contractor does more of the work themselves: enter or measure the job, use preferred products and approved trade pricing, build quantities, create a preliminary quote or material list, then send the completed job through.",
        input: "Job measurements + account",
        output: "Materials + approved pricing",
        next: "Customer quote, enquiry or order",
        question: "Would being easier to quote with help you keep the next order?",
      },
      team: {
        label: "Your own team",
        quote: "Build the supply quote and apply this customer's rates.",
        body: "T3 Labs can create an internal staff version of the same tools with different permissions, pricing, margins and approvals, all connected to the same products and job information.",
        input: "Prepared job + customer record",
        output: "Staff pricing + quote",
        next: "Review, approve and send",
        question: "Where is your team doing the same calculation more than once?",
      },
    },
  },
  "supply-install": {
    label: "Supply + install",
    opportunityQuestion: "What if more of your potential customers could get a useful starting answer from your website before your team had to get involved?",
    opportunityItems: [
      "Get an early idea of what their roofing project may cost",
      "Know which roofing system may suit the job",
      "Enter measurements or measure from a plan",
      "Build a preliminary supply-and-install estimate",
      "Ask common project questions",
      "Send a better-qualified project enquiry",
    ],
    reflection: "What would it mean for your business if a potential customer could get this far before your team needed to step in?",
    controlLine: "Your products, labour assumptions, exclusions, qualification rules and when a person or site visit is required.",
    audience: {
      visitor: {
        label: "A new website visitor",
        quote: "What might a new roof cost for my property?",
        body: "They can enter known measurements, measure from a plan, use a guided tool or ask the Smart Assistant, and get a useful first result before making a better-qualified enquiry.",
        input: "Roof + project details",
        output: "Preliminary estimate",
        next: "Qualified enquiry or site review",
        question: "Could a clearer starting answer make the first conversation more useful?",
      },
      contractor: {
        label: "A builder or project partner",
        quote: "Price this job using the products I normally buy.",
        body: "The partner does more of the work themselves: provide plans or measurements, use preferred systems, build quantities, and send a better-prepared roofing brief through for review.",
        input: "Plans + project requirements",
        output: "Prepared roofing brief",
        next: "Estimator review",
        question: "What if repeat partners sent the right details the first time?",
      },
      team: {
        label: "Your own team",
        quote: "Build this quote using our materials, labour and pricing rules.",
        body: "An internal staff version of the same tools can carry your own rates, labour, margins, overrides and approvals, connected to the same products and job information.",
        input: "Measured job + customer details",
        output: "Materials + labour + quote",
        next: "Review, approve and send",
        question: "How much preparation could happen before your estimator starts?",
      },
    },
  },
};

const AUDIENCES: Audience[] = ["visitor", "contractor", "team"];

const AUDIENCE_LABELS: Record<Audience, string> = {
  visitor: "1 of 3 — New visitor",
  contractor: "2 of 3 — Roofing customer",
  team: "3 of 3 — Your team",
};

const METHODS: {
  id: Method;
  eyebrow: string;
  title: string;
  text: string;
}[] = [
  {
    id: "known",
    eyebrow: "01",
    title: "Enter what they already know",
    text: "Start with a known roof area or dimensions, then apply your approved products, quantities and rules.",
  },
  {
    id: "plan",
    eyebrow: "02",
    title: "Measure from a plan",
    text: "Use a guided takeoff to turn a plan into useful measurements, then carry those into the job or estimate.",
  },
  {
    id: "assistant",
    eyebrow: "03",
    title: "Just ask the Smart Assistant",
    text: "Let the customer explain what they need. The assistant asks for missing details, answers approved questions and moves them toward pricing or a human handoff.",
  },
];

function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="roof-disclosure">
      <summary>
        <span>{title}</span>
        <span aria-hidden="true">+</span>
      </summary>
      <div className="roof-disclosure-body">{children}</div>
    </details>
  );
}

function Arrow({ left = false }: { left?: boolean }) {
  return <span aria-hidden="true">{left ? "←" : "→"}</span>;
}

function FlowVisual({ story }: { story: AudienceStory }) {
  return (
    <div className="roof-flow" aria-label="Example workflow">
      <div>
        <small>Starts with</small>
        <strong>{story.input}</strong>
      </div>
      <span aria-hidden="true">→</span>
      <div>
        <small>System helps produce</small>
        <strong>{story.output}</strong>
      </div>
      <span aria-hidden="true">→</span>
      <div>
        <small>Next step</small>
        <strong>{story.next}</strong>
      </div>
    </div>
  );
}

function MethodIllustration({ method }: { method: Method }) {
  if (method === "known") {
    return (
      <div className="roof-visual roof-known" aria-hidden="true">
        <div className="roof-ui-label">Roof area</div>
        <div className="roof-ui-input">180 m²</div>
        <div className="roof-ui-row"><span>Product system</span><strong>Selected</strong></div>
        <div className="roof-ui-row"><span>Quantities</span><strong>Calculated</strong></div>
        <div className="roof-ui-result">Indicative result</div>
      </div>
    );
  }

  if (method === "plan") {
    return (
      <div className="roof-visual roof-plan" aria-hidden="true">
        <svg viewBox="0 0 360 180">
          <path d="M50 132 L91 47 L185 25 L307 75 L264 149 L142 153 Z" />
          <path d="M91 47 L142 153" />
          <path d="M185 25 L264 149" />
          <path d="M307 75 L50 132" />
          <circle cx="91" cy="47" r="5" />
          <circle cx="264" cy="149" r="5" />
        </svg>
        <div className="roof-plan-tag">Known scale</div>
        <div className="roof-plan-tag roof-plan-tag-two">Measured roof areas</div>
      </div>
    );
  }

  return (
    <div className="roof-visual roof-chat" aria-hidden="true">
      <div className="roof-chat-bubble roof-chat-user">I need materials for a 180 m² metal roof. Can you help?</div>
      <div className="roof-chat-bubble">Yes. Is 180 m² the measured roof area, and which system are you considering?</div>
      <div className="roof-chat-action">Uses configured products + rules</div>
    </div>
  );
}

function MethodMedia({ method }: { method: Method }) {
  const clip = CONFIG.clips[method];
  if (!clip.src) return <MethodIllustration method={method} />;

  return (
    <video
      className="roof-method-video"
      src={clip.src}
      poster={clip.poster || undefined}
      muted
      loop
      playsInline
      controls
      preload="metadata"
      aria-label={`${method} roofing workflow example`}
    />
  );
}

function AudienceCarousel({ profile }: { profile: BusinessProfile }) {
  const [audience, setAudience] = useState<Audience>("visitor");
  const index = AUDIENCES.indexOf(audience);
  const story = profile.audience[audience];

  const move = (direction: number) => {
    const next = AUDIENCES[(index + direction + AUDIENCES.length) % AUDIENCES.length];
    setAudience(next);
  };

  return (
    <div className="roof-audience-wrap">
      <div className="roof-audience-selector" role="tablist" aria-label="Who could use the system">
        {AUDIENCES.map((item, i) => (
          <button
            type="button"
            key={item}
            role="tab"
            aria-selected={audience === item}
            onClick={() => setAudience(item)}
          >
            <span>{i + 1} of 3</span>
            <strong>{AUDIENCE_LABELS[item].split(" — ")[1]}</strong>
          </button>
        ))}
      </div>

      <div className="roof-audience-card" role="tabpanel">
        <div className="roof-audience-copy">
          <div className="roof-slide-meta">
            <span>{index + 1} of {AUDIENCES.length}</span>
            <span>{story.label}</span>
          </div>
          <blockquote>“{story.quote}”</blockquote>
          <p>{story.body}</p>
          <p className="roof-question">{story.question}</p>
        </div>
        <FlowVisual story={story} />
      </div>

      <div className="roof-audience-controls">
        <button type="button" onClick={() => move(-1)} aria-label="Previous example"><Arrow left /></button>
        <div className="roof-dots" aria-label={`Example ${index + 1} of ${AUDIENCES.length}`}>
          {AUDIENCES.map((item) => <span key={item} className={audience === item ? "active" : ""} />)}
        </div>
        <button type="button" onClick={() => move(1)} aria-label="Next example"><Arrow /></button>
      </div>
    </div>
  );
}

export default function RoofingLandingPageV3() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const t =
    theme === "dark"
      ? { border: "rgba(255,255,255,.12)", muted: "#acb3c4" }
      : { border: "rgba(17,21,31,.14)", muted: "#50596b" };
  const profile = useMemo(() => (business ? PROFILES[business] : null), [business]);

  return (
    <div className={theme === "light" ? "light" : "dark"}>
      <header style={{background:theme==="dark"?"rgba(10,11,16,.88)":"rgba(251,252,255,.92)",borderColor:t.border}} className="sticky top-0 z-50 border-b backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="https://www.t3labs.tech" className="flex items-center gap-2 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{background:"#0a0b10"}}><img src="/assets/t3-logo-white.png" alt="T3 Labs" className="h-7 w-7" /></span>
            <span className="hidden text-sm sm:inline" style={{color:t.muted}}>Labs</span>
          </a>
          <div className="flex items-center gap-2">
            <button type="button" onClick={()=>setTheme(theme==="dark"?"light":"dark")} style={{borderColor:t.border,color:t.muted}} className="rounded-full border px-3 py-1.5 text-xs font-medium">
              {theme==="dark"?"☀ Light":"☾ Dark"}
            </button>
          </div>
        </div>
      </header>
      <main className="roof-page">
      <style>{STYLES}</style>

      <div className="roof-shell">
        <section className="roof-section roof-opening" id="roof-start">
          <p className="roof-kicker">T3 Labs roofing solutions</p>
          <h1>Which best describes your roofing business?</h1>
          <p className="roof-opening-copy">Choose one. The examples below will adapt to the way you sell.</p>

          <div className="roof-business-grid" role="group" aria-label="Choose your roofing business type">
            {(Object.keys(PROFILES) as Business[]).map((key) => (
              <button
                key={key}
                type="button"
                aria-pressed={business === key}
                onClick={() => setBusiness(key)}
              >
                <span>{PROFILES[key].label}</span>
                <strong>{business === key ? "Selected" : "Choose"}</strong>
              </button>
            ))}
          </div>

          {!profile && (
            <p className="roof-selection-hint">Select your business type to continue.</p>
          )}

          {profile && (
            <div className="roof-intro-reveal" aria-live="polite">
              {/* 1. Tailored question + six examples */}
              <div className="roof-opportunity">
                <p className="roof-kicker">For a {profile.label.toLowerCase()}</p>
                <h2>{profile.opportunityQuestion}</h2>

                <div className="roof-opportunity-list">
                  {profile.opportunityItems.map((item) => (
                    <div key={item}>
                      <span aria-hidden="true">✓</span>
                      <strong>{item}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Reflection — standalone pause */}
              <div className="roof-reflection-box">
                <p>{profile.reflection}</p>
              </div>

              {/* 3. Bridge — own short statement */}
              <div className="roof-build-bridge">
                <p>Even if just one of those would improve your customer journey or save your team time, we can build around that problem.</p>
              </div>

              {/* 4. What we build — new chapter */}
              <div className="roof-chapter">
                <h2 className="roof-chapter-heading">We build the tools that make it possible.</h2>
              </div>

              <div className="roof-solution-pair">
                <article>
                  <span>Interactive Tools</span>
                  <h3>Let customers work through it themselves.</h3>
                  <p>A guided workflow on your website.</p>
                  <div className="roof-mini-flow" aria-label="Interactive tool workflow">
                    <b>Measure</b><i>→</i><b>Select</b><i>→</i><b>Calculate</b><i>→</i><b>Price</b><i>→</i><b>Enquire</b>
                  </div>
                </article>

                <article>
                  <span>Smart Assistant</span>
                  <h3>Let customers simply ask what they need.</h3>
                  <p>Answers grounded in your approved information.</p>
                  <div className="roof-mini-flow" aria-label="Smart Assistant workflow">
                    <b>Ask</b><i>→</i><b>Clarify</b><i>→</i><b>Answer</b><i>→</i><b>Estimate</b><i>→</i><b>Handoff</b>
                  </div>
                </article>
              </div>

              <p className="roof-either-note">Use either approach, or both together.</p>

              {/* 5. Built around your business */}
              <div className="roof-config-block">
                <div className="roof-config-intro">
                  <p className="roof-kicker">Built around your business</p>
                  <h2>Not a generic calculator. Not a generic chatbot.</h2>
                  <p>T3 Labs first learns how the business works, then configures the tools and Smart Assistant around the products, pricing, knowledge, rules and handoff boundaries the business approves.</p>
                </div>

                <div className="roof-config-grid">
                  <div>
                    <span>01</span>
                    <strong>Your products</strong>
                    <p>What you sell and what works together.</p>
                  </div>
                  <div>
                    <span>02</span>
                    <strong>Your pricing + calculations</strong>
                    <p>How quantities, pricing and other rules should work.</p>
                  </div>
                  <div>
                    <span>03</span>
                    <strong>Your approved answers</strong>
                    <p>The information you are happy for customers to receive.</p>
                  </div>
                  <div>
                    <span>04</span>
                    <strong>Your handoff rules</strong>
                    <p>When the system hands the customer to your team.</p>
                  </div>
                </div>

                <p className="roof-control-line">For your business: {profile.controlLine}</p>
              </div>

              <a className="roof-continue" href="#roof-people">See who it could help <Arrow /></a>
            </div>
          )}
        </section>

        {profile && (
          <>
            <section className="roof-section" id="roof-people">
              <div className="roof-section-head">
                <p className="roof-kicker">One system, three people</p>
                <h2>Different users. The same business knowledge underneath.</h2>
                <p>There are three examples. View all of them.</p>
              </div>
              <AudienceCarousel key={business} profile={profile} />
            </section>

            <section className="roof-section" id="roof-methods">
              <div className="roof-section-head roof-section-head-narrow">
                <p className="roof-kicker">Three ways to get an answer</p>
                <h2>Let them start with whatever is easiest.</h2>
                <p>Use one route or combine all three.</p>
              </div>

              <div className="roof-method-grid">
                {METHODS.map((method) => (
                  <article key={method.id} className="roof-method-card">
                    <div className="roof-method-media"><MethodMedia method={method.id} /></div>
                    <div className="roof-method-copy">
                      <span>{method.eyebrow}</span>
                      <h3>{method.title}</h3>
                      <p>{method.text}</p>
                    </div>
                  </article>
                ))}
              </div>

              <p className="roof-method-note">A visitor can use the tool themselves, talk to the Smart Assistant, or move between both. Your team can use the same underlying products and rules with different permissions.</p>
            </section>

            <section className="roof-section" id="roof-value">
              <div className="roof-section-head roof-section-head-narrow">
                <p className="roof-kicker">What changes for the business?</p>
                <h2>Give people more of the answer before your team has to step in.</h2>
              </div>

              <div className="roof-human-question">
                <p>How many of these interactions genuinely need a person from the beginning?</p>
                <div>
                  <span>“How much is this?”</span>
                  <span>“How much do I need?”</span>
                  <span>“Which product should I use?”</span>
                  <span>“Can you quote this?”</span>
                </div>
              </div>

              <div className="roof-benefit-grid">
                <article>
                  <strong>Faster answers</strong>
                  <p>Customers can keep moving while they are interested instead of waiting for a call or email.</p>
                </article>
                <article>
                  <strong>Better enquiries</strong>
                  <p>Your team receives measurements, selections and useful context instead of a vague request.</p>
                </article>
                <article>
                  <strong>Less repetitive work</strong>
                  <p>Basic questions, quantities and early pricing do not always need to become another task for a sales rep.</p>
                </article>
              </div>

              <div className="roof-journeys">
                <div className="roof-journey roof-journey-before">
                  <span>Typical today</span>
                  <strong>Visitor arrives</strong>
                  <b aria-hidden="true">↓</b>
                  <strong>Cannot get enough information</strong>
                  <b aria-hidden="true">↓</b>
                  <strong>Leaves or sends a basic enquiry</strong>
                  <b aria-hidden="true">↓</b>
                  <strong>Your team starts from scratch</strong>
                </div>
                <div className="roof-journey roof-journey-after">
                  <span>With a useful system</span>
                  <strong>Visitor arrives</strong>
                  <b aria-hidden="true">↓</b>
                  <strong>Measures, enters details or asks</strong>
                  <b aria-hidden="true">↓</b>
                  <strong>Gets a useful first result</strong>
                  <b aria-hidden="true">↓</b>
                  <strong>Your team starts with useful context</strong>
                </div>
              </div>

              <Disclosure title="What else can the same system improve?">
                <div className="roof-more-benefits">
                  <p><strong>Contractor loyalty.</strong> Make your products easier for roofing customers to price, specify and use again.</p>
                  <p><strong>Internal quoting.</strong> Reuse the same product and calculation logic for staff workflows where useful.</p>
                  <p><strong>Better data.</strong> See what people ask about, price and select, then improve your process and resources.</p>
                  <p><strong>A more useful website.</strong> Help people solve more of the problem they arrived with.</p>
                </div>
              </Disclosure>

              <div className="roof-discovery-note">
                <div>
                  <p className="roof-kicker">A side benefit</p>
                  <h3>More useful public information can also make the business easier to discover.</h3>
                </div>
                <p>Search and AI systems can only work with information they can access. Selected public product, pricing and technical information can be made accessible around these tools, while private trade rates and internal logic remain private.</p>
              </div>
            </section>

            <section className="roof-section roof-final" id="roof-price">
              <div className="roof-price-card">
                <div className="roof-price-copy">
                  <p className="roof-kicker">The part you are probably waiting for</p>
                  <h2>What if you could gain these kinds of benefits from <span>$999?</span></h2>
                  <p>Start with one focused problem. We scope the rest around what your roofing business actually needs.</p>
                </div>

                <div className="roof-price-number">
                  <small>Focused solutions from</small>
                  <strong>$999</strong>
                </div>

                <div className="roof-final-actions">
                  <a className="roof-primary-button" href={CONFIG.shaunContactUrl} target="_blank" rel="noopener noreferrer">Talk to Shaun <Arrow /></a>
                  <a className="roof-secondary-link" href={CONFIG.apexDemoUrl} target="_blank" rel="noopener noreferrer">Try the Apex Roofing demo ↗</a>
                </div>

                <Disclosure title="Who's Shaun?">
                  <p>Shaun is an ex-roofer with around 20 years of experience across roofing and technology. He now helps build solutions for roofing businesses around how they actually work.</p>
                </Disclosure>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
    </div>
  );
}

const STYLES = String.raw`
.roof-page{
  --roof-bg:#0a0b10;
  --roof-surface:#101219;
  --roof-raised:#171b26;
  --roof-border:#2b3040;
  --roof-ink:#f0f2f7;
  --roof-muted:#a9b0c0;
  --roof-accent:#d7ff00;
  --roof-accent-ink:#d7ff00;
  --roof-soft:rgba(215,255,0,.07);
  background:var(--roof-bg);
  color:var(--roof-ink);
  min-height:100vh;
  font-family:inherit;
}
html[data-theme="light"] .roof-page,.light .roof-page{
  --roof-bg:#fbfcff;
  --roof-surface:#fff;
  --roof-raised:#f2f4f8;
  --roof-border:#d9dde6;
  --roof-ink:#11151f;
  --roof-muted:#586173;
  --roof-accent:#d7ff00;
  --roof-accent-ink:#5d6b00;
  --roof-soft:rgba(139,164,0,.08);
}
.roof-page *{box-sizing:border-box}
.roof-page h1,.roof-page h2,.roof-page h3,.roof-page p,.roof-page blockquote{margin:0}
.roof-page button,.roof-page a,.roof-page summary{font:inherit}
.roof-page button,.roof-page summary{cursor:pointer}
.roof-page a{color:inherit;text-decoration:none}
.roof-page button:focus-visible,.roof-page a:focus-visible,.roof-page summary:focus-visible{outline:3px solid var(--roof-accent-ink);outline-offset:4px}
.roof-shell{width:min(1080px,calc(100% - 40px));margin:0 auto}
.roof-section{padding:110px 0;border-bottom:1px solid var(--roof-border);scroll-margin-top:120px}
.roof-opening{padding-top:90px}
.roof-kicker{font-size:12px;line-height:1.4;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--roof-accent-ink)!important}
.roof-opening h1{max-width:760px;margin-top:14px;font-size:clamp(2.5rem,5vw,3rem);line-height:1.08;letter-spacing:-.045em}
.roof-opening-copy{margin-top:20px!important;max-width:620px;font-size:14px;line-height:1.7;color:var(--roof-muted)}
.roof-business-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:40px;max-width:880px}
.roof-business-grid button{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:84px;padding:22px 24px;border:1px solid var(--roof-border);border-radius:14px;background:var(--roof-surface);color:var(--roof-ink);text-align:left;transition:.16s ease}
.roof-business-grid button:hover{border-color:var(--roof-accent-ink);transform:translateY(-1px)}
.roof-business-grid button[aria-pressed="true"]{background:var(--roof-soft);border-color:var(--roof-accent-ink)}
.roof-business-grid button>span{font-size:14px;font-weight:700}
.roof-business-grid button>strong{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--roof-muted)}
.roof-business-grid button[aria-pressed="true"]>strong{color:var(--roof-accent-ink)}
.roof-selection-hint{margin-top:18px!important;font-size:14px;color:var(--roof-muted)}
.roof-intro-reveal{margin-top:56px;max-width:980px;padding-top:48px;border-top:1px solid var(--roof-border)}
.roof-opportunity{max-width:820px}
.roof-opportunity h2,.roof-config-intro h2,.roof-section-head h2,.roof-price-copy h2{margin-top:12px;font-size:clamp(1.5rem,3vw,1.875rem);line-height:1.18;letter-spacing:-.02em}
.roof-opportunity-list{display:grid;grid-template-columns:1fr;gap:12px;margin-top:32px;max-width:680px}
.roof-opportunity-list>div{display:flex;align-items:flex-start;gap:14px;padding:16px 18px;border:1px solid var(--roof-border);border-radius:12px;background:var(--roof-surface)}
.roof-opportunity-list span{flex:0 0 auto;margin-top:2px;color:var(--roof-accent-ink);font-size:14px;font-weight:800}
.roof-opportunity-list strong{font-size:14px;line-height:1.6}
.roof-reflection-box{margin:64px 0;padding:44px 40px;border:1px solid var(--roof-accent-ink);border-radius:16px;background:var(--roof-soft);text-align:center}
.roof-reflection-box>p{max-width:640px;margin:0 auto!important;font-size:clamp(1.25rem,2.4vw,1.5rem);line-height:1.4;font-weight:700;letter-spacing:-.01em}
.roof-build-bridge{max-width:720px;margin:0 auto;padding:0 8px;text-align:center}
.roof-build-bridge>p{font-size:14px;line-height:1.8;color:var(--roof-muted);font-weight:600}
.roof-chapter{margin-top:72px;text-align:center}
.roof-chapter-heading{font-size:clamp(1.75rem,3.6vw,2.2rem);line-height:1.15;letter-spacing:-.025em;font-weight:800}
.roof-solution-pair{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:40px;align-items:stretch}
.roof-solution-pair article{display:flex;flex-direction:column;padding:32px;border:1px solid var(--roof-border);border-radius:16px;background:var(--roof-surface)}
.roof-solution-pair article>span{display:block;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--roof-accent-ink)}
.roof-solution-pair h3{margin-top:10px;font-size:20px;line-height:1.35}
.roof-solution-pair p{margin-top:10px;font-size:14px;line-height:1.7;color:var(--roof-muted)}
.roof-mini-flow{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:auto;padding-top:20px;border-top:1px solid var(--roof-border)}
.roof-mini-flow b{font-size:12px;line-height:1.4;color:var(--roof-ink)}
.roof-mini-flow i{font-style:normal;font-size:12px;color:var(--roof-accent-ink)}
.roof-either-note{margin-top:24px!important;font-size:14px;font-weight:700;text-align:center;color:var(--roof-muted)}
.roof-config-block{margin-top:80px;padding-top:52px;border-top:1px solid var(--roof-border)}
.roof-config-intro{max-width:780px}
.roof-config-intro>p:last-child{margin-top:16px!important;max-width:720px;font-size:14px;line-height:1.75;color:var(--roof-muted)}
.roof-config-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:32px;max-width:820px}
.roof-config-grid>div{padding:24px;border:1px solid var(--roof-border);border-radius:14px;background:var(--roof-surface)}
.roof-config-grid span{display:block;font-size:12px;font-weight:700;color:var(--roof-accent-ink)}
.roof-config-grid strong{display:block;margin-top:8px;font-size:14px;line-height:1.4;font-weight:700}
.roof-config-grid p{margin-top:8px;font-size:12px;line-height:1.65;color:var(--roof-muted)}
.roof-control-line{margin-top:20px!important;max-width:760px;font-size:12px;line-height:1.7;color:var(--roof-muted)}
.roof-disclosure{margin-top:24px;border-top:1px solid var(--roof-border)}
.roof-disclosure summary{display:flex;align-items:center;justify-content:space-between;gap:18px;min-height:60px;list-style:none;font-size:14px;font-weight:700;color:var(--roof-ink)}
.roof-disclosure summary::-webkit-details-marker{display:none}
.roof-disclosure summary>span:last-child{font-size:20px;font-weight:400;color:var(--roof-accent-ink);transition:.15s ease}
.roof-disclosure[open] summary>span:last-child{transform:rotate(45deg)}
.roof-disclosure-body{padding:0 0 18px;max-width:760px;font-size:14px;line-height:1.75;color:var(--roof-muted)}
.roof-disclosure-body p+p{margin-top:12px}
.roof-continue{display:inline-flex;align-items:center;gap:10px;margin-top:40px;font-size:14px;font-weight:700;color:var(--roof-accent-ink)!important}
.roof-section-head{max-width:790px;margin-bottom:44px}
.roof-section-head-narrow{max-width:690px}
.roof-section-head>p:last-child,.roof-price-copy>p:last-child{margin-top:16px!important;max-width:720px;font-size:14px;line-height:1.75;color:var(--roof-muted)}
.roof-audience-selector{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.roof-audience-selector button{display:flex;align-items:center;gap:12px;min-height:64px;padding:14px 18px;border:1px solid var(--roof-border);border-radius:12px;background:var(--roof-surface);color:var(--roof-ink);text-align:left}
.roof-audience-selector button>span{font-size:12px;font-weight:700;color:var(--roof-muted)}
.roof-audience-selector button>strong{font-size:14px}
.roof-audience-selector button[aria-selected="true"]{border-color:var(--roof-accent-ink);background:var(--roof-soft)}
.roof-audience-selector button[aria-selected="true"]>span{color:var(--roof-accent-ink)}
.roof-audience-card{display:grid;grid-template-columns:1.05fr .95fr;gap:44px;margin-top:16px;padding:40px;border:1px solid var(--roof-border);border-radius:18px;background:var(--roof-surface)}
.roof-slide-meta{display:flex;align-items:center;gap:12px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--roof-muted)}
.roof-slide-meta>span:first-child{color:var(--roof-accent-ink);font-weight:700}
.roof-audience-copy blockquote{margin-top:18px;font-size:clamp(1.35rem,2.5vw,1.6rem);line-height:1.35;letter-spacing:-.02em;font-weight:700}
.roof-audience-copy>p:not(.roof-question){margin-top:18px;font-size:14px;line-height:1.75;color:var(--roof-muted)}
.roof-question{margin-top:22px!important;padding-left:14px;border-left:2px solid var(--roof-accent-ink);font-size:14px;font-weight:700;line-height:1.6;color:var(--roof-ink)!important}
.roof-flow{align-self:center;display:flex;align-items:stretch;gap:10px}
.roof-flow>div{flex:1;min-width:0;padding:18px;border:1px solid var(--roof-border);border-radius:12px;background:var(--roof-raised)}
.roof-flow small{display:block;font-size:12px;line-height:1.4;text-transform:uppercase;letter-spacing:.06em;color:var(--roof-muted)}
.roof-flow strong{display:block;margin-top:8px;font-size:12px;line-height:1.5}
.roof-flow>span{align-self:center;color:var(--roof-accent-ink);font-size:14px}
.roof-audience-controls{display:flex;justify-content:flex-end;align-items:center;gap:16px;margin-top:18px}
.roof-audience-controls button{width:48px;height:48px;border:1px solid var(--roof-border);border-radius:999px;background:var(--roof-surface);color:var(--roof-ink);font-size:16px}
.roof-audience-controls button:hover{border-color:var(--roof-accent-ink)}
.roof-dots{display:flex;gap:8px}
.roof-dots span{width:8px;height:8px;border-radius:999px;background:var(--roof-border)}
.roof-dots span.active{width:24px;background:var(--roof-accent)}
.roof-method-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:stretch}
.roof-method-card{display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--roof-border);border-radius:16px;background:var(--roof-surface)}
.roof-method-media{aspect-ratio:16/10;padding:20px;background:var(--roof-raised);border-bottom:1px solid var(--roof-border);display:flex;align-items:stretch}
.roof-method-copy{padding:26px 26px 30px;flex:1;display:flex;flex-direction:column}
.roof-method-copy>span{font-size:12px;font-weight:700;color:var(--roof-accent-ink)}
.roof-method-copy h3{margin-top:8px;font-size:20px;line-height:1.35}
.roof-method-copy p{margin-top:10px;font-size:14px;line-height:1.7;color:var(--roof-muted)}
.roof-method-note{margin:24px auto 0!important;max-width:760px;text-align:center;font-size:12px;line-height:1.7;color:var(--roof-muted)}
.roof-visual,.roof-method-video{width:100%;flex:1;border-radius:12px;border:1px solid var(--roof-border);background:var(--roof-bg)}
.roof-method-video{display:block;object-fit:cover}
.roof-known{padding:20px;display:flex;flex-direction:column;justify-content:center}
.roof-ui-label{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--roof-muted)}
.roof-ui-input{margin-top:8px;padding:10px 12px;border:1px solid var(--roof-border);border-radius:8px;font-size:20px;font-weight:700}
.roof-ui-row{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--roof-border);font-size:12px;color:var(--roof-muted)}
.roof-ui-row strong{color:var(--roof-ink)}
.roof-ui-result{margin-top:14px;padding:10px;border-radius:8px;background:var(--roof-soft);font-size:12px;font-weight:700;color:var(--roof-accent-ink);text-align:center}
.roof-plan{position:relative;padding:16px;display:flex;align-items:center}
.roof-plan svg{width:100%;height:auto;max-height:100%}
.roof-plan path{fill:none;stroke:var(--roof-ink);stroke-width:2}
.roof-plan circle{fill:var(--roof-accent)}
.roof-plan-tag{position:absolute;left:15px;bottom:16px;padding:6px 10px;border:1px solid var(--roof-border);border-radius:99px;background:var(--roof-surface);font-size:12px;color:var(--roof-muted)}
.roof-plan-tag-two{left:auto;right:15px;color:var(--roof-accent-ink)}
.roof-chat{padding:18px;display:flex;flex-direction:column;justify-content:center;gap:10px}
.roof-chat-bubble{max-width:89%;padding:10px 12px;border-radius:10px 10px 10px 3px;background:var(--roof-surface);border:1px solid var(--roof-border);font-size:12px;line-height:1.55;color:var(--roof-ink)}
.roof-chat-user{align-self:flex-end;border-radius:10px 10px 3px 10px;background:var(--roof-soft)}
.roof-chat-action{align-self:flex-start;font-size:12px;color:var(--roof-accent-ink)}
.roof-human-question{padding:48px 40px;border:1px solid var(--roof-accent-ink);border-radius:18px;background:var(--roof-soft);text-align:center}
.roof-human-question>p{max-width:640px;margin:0 auto!important;font-size:clamp(1.25rem,2.4vw,1.5rem);line-height:1.4;font-weight:700;letter-spacing:-.01em}
.roof-human-question>div{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-top:24px}
.roof-human-question span{padding:8px 14px;border-radius:999px;background:var(--roof-surface);border:1px solid var(--roof-border);font-size:12px;color:var(--roof-muted)}
.roof-benefit-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px;align-items:stretch}
.roof-benefit-grid article{padding:28px;border-top:2px solid var(--roof-accent-ink);border-radius:14px;background:var(--roof-surface);border-left:1px solid var(--roof-border);border-right:1px solid var(--roof-border);border-bottom:1px solid var(--roof-border)}
.roof-benefit-grid strong{font-size:20px}
.roof-benefit-grid p{margin-top:10px;font-size:14px;line-height:1.7;color:var(--roof-muted)}
.roof-journeys{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:48px;align-items:stretch}
.roof-journey{display:flex;flex-direction:column;gap:10px;padding:28px;border:1px solid var(--roof-border);border-radius:16px;background:var(--roof-surface)}
.roof-journey>span{margin-bottom:6px;font-size:12px;text-transform:uppercase;letter-spacing:.08em;font-weight:700;color:var(--roof-muted)}
.roof-journey strong{font-size:14px;line-height:1.5;font-weight:600}
.roof-journey b{font-weight:400;color:var(--roof-muted);line-height:.6}
.roof-journey-after{border-color:var(--roof-accent-ink);background:var(--roof-soft)}
.roof-journey-after>span{color:var(--roof-accent-ink)}
.roof-more-benefits{display:grid;grid-template-columns:1fr 1fr;gap:16px 24px}
.roof-more-benefits p{font-size:14px;line-height:1.7;color:var(--roof-muted)}
.roof-more-benefits strong{color:var(--roof-ink)}
.roof-discovery-note{display:grid;grid-template-columns:.8fr 1.2fr;gap:32px;align-items:start;margin-top:48px;padding:32px;border:1px solid var(--roof-border);border-radius:16px;background:var(--roof-surface)}
.roof-discovery-note h3{margin-top:8px;font-size:20px;line-height:1.35}
.roof-discovery-note>p{font-size:14px;line-height:1.75;color:var(--roof-muted)}
.roof-final{border-bottom:0;padding-bottom:130px}
.roof-price-card{max-width:880px;margin:0 auto;padding:48px;border:1px solid var(--roof-border);border-top:2px solid var(--roof-accent-ink);border-radius:20px;background:var(--roof-surface);text-align:center}
.roof-price-copy{max-width:680px;margin:0 auto}
.roof-price-copy h2 span{color:var(--roof-accent-ink)}
.roof-price-number{margin-top:32px}
.roof-price-number small{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--roof-muted)}
.roof-price-number strong{display:block;margin-top:6px;font-size:clamp(3.7rem,8vw,6rem);line-height:1;letter-spacing:-.06em}
.roof-final-actions{display:flex;justify-content:center;align-items:center;gap:20px;margin-top:36px}
.roof-primary-button{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;padding:0 28px;border-radius:999px;background:var(--roof-accent);color:#0a0b10!important;font-size:14px;font-weight:800}
.roof-primary-button:hover{filter:brightness(1.05);transform:translateY(-1px)}
.roof-secondary-link{font-size:14px;font-weight:700;color:var(--roof-muted)!important}
.roof-secondary-link:hover{color:var(--roof-accent-ink)!important}
.roof-price-card>.roof-disclosure{max-width:620px;margin:28px auto 0;text-align:left}
@media(max-width:860px){
  .roof-section{padding:88px 0}
  .roof-business-grid,.roof-method-grid,.roof-benefit-grid{grid-template-columns:1fr}
  .roof-business-grid{max-width:none}
  .roof-config-grid{grid-template-columns:1fr 1fr}
  .roof-audience-card{grid-template-columns:1fr;gap:28px}
  .roof-flow{max-width:620px}
  .roof-journeys{grid-template-columns:1fr}
  .roof-discovery-note{grid-template-columns:1fr;gap:16px}
}
@media(max-width:620px){
  .roof-shell{width:calc(100% - 30px)}
  .roof-section{padding:68px 0}
  .roof-opening{padding-top:56px}
  .roof-opening h1{font-size:2rem}
  .roof-opening-copy{font-size:14px}
  .roof-business-grid{gap:10px;margin-top:28px}
  .roof-business-grid button{min-height:70px;padding:16px 18px}
  .roof-intro-reveal{margin-top:36px;padding-top:32px}
  .roof-opportunity-list,.roof-solution-pair,.roof-config-grid{grid-template-columns:1fr}
  .roof-reflection-box{margin:48px 0;padding:32px 24px}
  .roof-chapter{margin-top:56px}
  .roof-config-block{margin-top:56px;padding-top:36px}
  .roof-solution-pair article{padding:24px}
  .roof-config-grid>div{padding:20px}
  .roof-section-head{margin-bottom:28px}
  .roof-audience-selector{gap:6px}
  .roof-audience-selector button{min-height:64px;display:block;padding:12px;text-align:center}
  .roof-audience-selector button>span{display:block;margin-bottom:4px}
  .roof-audience-selector button>strong{font-size:12px;line-height:1.25}
  .roof-audience-card{padding:24px}
  .roof-audience-copy blockquote{font-size:1.3rem}
  .roof-flow{display:grid;grid-template-columns:1fr;gap:6px}
  .roof-flow>span{transform:rotate(90deg);justify-self:center}
  .roof-audience-controls{justify-content:space-between}
  .roof-human-question{padding:32px 24px}
  .roof-benefit-grid{gap:14px}
  .roof-benefit-grid article{padding:22px}
  .roof-journey{padding:22px}
  .roof-more-benefits{grid-template-columns:1fr;gap:12px}
  .roof-price-card{padding:32px 20px}
  .roof-final-actions{flex-direction:column;gap:14px}
  .roof-primary-button{width:100%}
}
@media(prefers-reduced-motion:reduce){.roof-page *{scroll-behavior:auto!important;transition:none!important}}
`;
