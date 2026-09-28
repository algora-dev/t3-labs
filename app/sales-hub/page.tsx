import { CopyLink } from "./copy-link";

type CustomerCard = {
  name: string;
  path: string;
  badge: string;
  tagline: string;
  useWhen: string;
  points: string[];
  note?: string;
};

const CUSTOMER_CARDS: CustomerCard[] = [
  {
    name: "Our Solution",
    path: "/our-solution/referred",
    badge: "Best general introduction",
    tagline:
      "The clearest overview of the problems T3 Labs solves, the customer experience we improve, and the kinds of systems we build.",
    useWhen: "They want to understand what T3 Labs actually does and why it matters.",
    points: [
      "Broad enough for most construction and trade businesses",
      "Useful for you to learn the core T3 Labs pitch before sharing it",
    ],
  },
  {
    name: "Roofing Solutions",
    path: "/roofing-solutions/referred",
    badge: "Industry example",
    tagline:
      "A roofing-focused version of the pitch that makes the customer problems and possible solutions easier to picture.",
    useWhen: "The prospect is in roofing, construction, building products, or would benefit from a concrete worked example.",
    points: [
      "Shows customer pricing, measurement and product-guidance journeys",
      "Roofing is the example, not the limit of what we can build",
    ],
  },
  {
    name: "Roofing Business Tools",
    path: "/roofing-business-tools/referred",
    badge: "Deeper product examples",
    tagline:
      "A closer look at the actual tools, user types and configurations that can sit behind a more capable business system.",
    useWhen: "They are interested and want to understand what the tools can actually become.",
    points: [
      "Measurement-to-price, digital takeoff, Smart Assistant and admin",
      "Shows public, trade and internal-team use cases",
    ],
  },
  {
    name: "Ballpark Pricing Calculator",
    path: "/pricing-calculator/referred",
    badge: "When price comes up",
    tagline:
      "A guided ballpark calculator the prospect can use themselves, or you can work through with them during a conversation.",
    useWhen: "They ask what something like this might cost or price is the next logical part of the conversation.",
    points: [
      "Do not lead with price before they understand the value",
      "The calculator is also a live example of the self-service tools we build",
    ],
    note: "Use it yourself for a quick ballpark, or send it to the prospect if that helps move the conversation forward.",
  },
];

const CHEATS: { scenario: string; answer: string }[] = [
  { scenario: "What do you actually do?", answer: "Our Solution" },
  { scenario: "They need a construction example", answer: "Roofing Solutions" },
  { scenario: "Can I see the tools in more detail?", answer: "Roofing Business Tools" },
  { scenario: "What might something like this cost?", answer: "Pricing Calculator" },
  { scenario: "Can I see something working?", answer: "Live demo" },
  { scenario: "How should I approach this lead?", answer: "Sales Resources" },
];

const SELLING = [
  {
    title: "Interactive tools",
    text: "Measurement, pricing, quoting and customer self-service built around the business.",
  },
  {
    title: "Smart Assistants",
    text: "Answer questions, guide customers, create pricing or estimates and improve the handoff to the team.",
  },
  {
    title: "Custom business systems",
    text: "Trade access, admin, internal quoting, tracking and bespoke workflows when the opportunity is larger.",
  },
];

function CustomerPageCard({ card }: { card: CustomerCard }) {
  return (
    <article className="sh-card">
      <span className="sh-badge">{card.badge}</span>
      <h3>{card.name}</h3>
      <p className="sh-tagline">{card.tagline}</p>
      <p className="sh-usewhen">
        <b>Use it when:</b> {card.useWhen}
      </p>
      <ul className="sh-points">
        {card.points.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {card.note ? <p className="sh-card-note">{card.note}</p> : null}
      <div className="sh-card-actions">
        <a
          className="sh-open"
          href={card.path}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open page
        </a>
        <CopyLink path={card.path} name={card.name} />
      </div>
    </article>
  );
}

export default function SalesHubPage() {
  return (
    <main className="sh-page">
      <style>{styles}</style>

      <header className="sh-header">
        <div className="sh-shell sh-header-inner">
          <a href="/sales-hub" className="sh-brand" aria-label="T3 Labs sales hub">
            <span>
              <img src="/assets/t3-logo-white.png" alt="T3 Labs" />
            </span>
            <b>T3 Labs</b>
          </a>
          <a className="sh-header-link" href="/sales-resources">
            Sales resources
          </a>
        </div>
      </header>

      <section className="sh-hero">
        <div className="sh-shell">
          <p className="sh-eyebrow">For T3 Labs reps</p>
          <h1>
            Your starting point for <em>selling T3 Labs.</em>
          </h1>
          <p className="sh-lead">
            Start with the rep resources, then read the customer pages yourself.
            They are designed to explain and pitch the solutions clearly, so the
            better you understand the customer pitch, the easier every call,
            message and conversation becomes.
          </p>
        </div>
      </section>

      <section className="sh-section sh-section--first" aria-labelledby="sh-start-title">
        <div className="sh-shell sh-start-grid">
          <div className="sh-start-card">
            <p className="sh-eyebrow">New here?</p>
            <h2 id="sh-start-title">Start with Sales Resources.</h2>
            <p>
              This is the rep-only playbook for finding the right businesses,
              spotting the strongest sales angle, starting the conversation and
              understanding how the sales process works.
            </p>
            <a className="sh-open" href="/sales-resources">
              Open Sales Resources
            </a>
          </div>

          <div className="sh-learn-note">
            <b>The customer pages are part of your training too.</b>
            <p>
              Read them before you share them. Each one is built to sell the idea
              from a different angle, so you can reuse the same positioning in
              email, LinkedIn and calls.
            </p>
          </div>
        </div>
      </section>

      <section className="sh-section sh-section--compact" aria-labelledby="sh-sell-title">
        <div className="sh-shell">
          <p className="sh-eyebrow">What you are selling</p>
          <h2 id="sh-sell-title">One useful tool or a much bigger system.</h2>
          <div className="sh-sell-grid">
            {SELLING.map((item) => (
              <article key={item.title} className="sh-sell-card">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <p className="sh-roofing-note">
            <b>Roofing is our strongest working example.</b> The same framework can
            be adapted across construction and beyond using each business&apos;s own
            products, pricing, knowledge and processes.
          </p>
        </div>
      </section>

      <section className="sh-section" aria-labelledby="sh-customer-title">
        <div className="sh-shell">
          <p className="sh-eyebrow">Customer-facing pages</p>
          <h2 id="sh-customer-title">Use the right page at the right time.</h2>
          <p className="sh-section-lead">
            These are both customer pitch pages and learning resources for you.
            Start broad, go deeper when useful, and bring in pricing when the
            conversation is ready for it.
          </p>
          <div className="sh-grid">
            {CUSTOMER_CARDS.map((card) => (
              <CustomerPageCard key={card.path} card={card} />
            ))}
          </div>
        </div>
      </section>

      <section className="sh-section sh-section--compact" aria-labelledby="sh-demo-title">
        <div className="sh-shell">
          <p className="sh-eyebrow">Live demo</p>
          <h2 id="sh-demo-title">Use it yourself so you know how to sell it. Then show a customer.</h2>
          <div className="sh-demo">
            <a
              className="sh-demo-shot"
              href="/demo/roofing-site"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open the live Apex Roofing demo site"
            >
              <img
                src="/assets/sales-hub/demo-home.jpg"
                alt="The Apex Roofing demo website: hero with an instant estimate call to action, a Smart Website assistant card and the Ask Apex chat widget"
                width="1200"
                height="1073"
                loading="lazy"
              />
              <span className="sh-demo-overlay" aria-hidden="true">
                <b>Open the demo</b>
                <span>t3labs.tech/demo/roofing-site</span>
              </span>
            </a>
            <div className="sh-demo-copy">
              <p>
                A working, live demo of a fictitious roofing business with our tools on its website:
                instant estimating, digital takeoff, pricing and a Smart Assistant.
              </p>
              <ul className="sh-points">
                <li>
                  <b>Use every tool yourself first.</b>{" "}
                  Work through the flows so you know how they work and why they help. Nothing sells
                  them better than a rep who clearly has.
                </li>
                <li>
                  <b>Then show a customer.</b>{" "}
                  Walk the prospect through it live, or send the link and tell them what to try. The
                  demo lands hardest when you explain it.
                </li>
              </ul>
              <p className="sh-usewhen">
                <b>Best used when:</b> you are learning what we build, or a prospect asks to see
                something actually working.
              </p>
              <div className="sh-card-actions sh-card-actions--start">
                <a className="sh-open" href="/demo/roofing-site" target="_blank" rel="noopener noreferrer">
                  Open the demo
                </a>
                <CopyLink path="/demo/roofing-site" name="Live demo" />
              </div>
              <p className="sh-demo-fine">Fictitious business, sample data. Safe to share with prospects.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sh-cheat" aria-labelledby="sh-cheat-title">
        <div className="sh-shell">
          <p className="sh-eyebrow">Quick reference</p>
          <h2 id="sh-cheat-title">If they say this, use this.</h2>
          <ul>
            {CHEATS.map((item) => (
              <li key={item.scenario}>
                <span>&quot;{item.scenario}&quot;</span>
                <b>{item.answer}</b>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sh-section sh-section--closing" aria-label="Referred link guidance">
        <div className="sh-shell">
          <div className="sh-referred-note">
            <div>
              <p className="sh-eyebrow">Important</p>
              <h2>Always share the referred links from this hub.</h2>
            </div>
            <p>
              These versions remove direct T3 Labs booking and enquiry routes and
              send the prospect back to you instead. That helps protect your lead
              and the commission you earn from it.
            </p>
          </div>

          <div className="sh-feedback">
            <b>Help us improve the sales kit.</b>
            <span>
              These pages will keep improving. If something is unclear, missing or
              unnecessary, tell us what you would change and why.
            </span>
          </div>
        </div>
      </section>

      <footer className="sh-footer">
        <div className="sh-shell">
          <span>&copy; T3 Labs</span>
          <span>This hub is for reps. Please do not post the link publicly.</span>
        </div>
      </footer>
    </main>
  );
}

const styles = String.raw`
.sh-page{--lime:#d7ff00;--ink:#0a0b10;--surface:#101722;--surface2:#172131;--line:#303d51;--muted:#aab4c6;background:var(--ink);color:#fff;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.5;min-height:100vh}
.sh-page *{box-sizing:border-box}
.sh-page :where(h1,h2,h3,p,ul){margin:0}
.sh-page button,.sh-page a{font:inherit}
.sh-page :where(a,button):focus-visible{outline:2px solid var(--lime);outline-offset:3px}
.sh-shell{max-width:1180px;margin:auto;padding-inline:24px}
.sh-header{position:sticky;top:0;z-index:20;background:rgba(10,11,16,.86);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.sh-header-inner{display:flex;align-items:center;justify-content:space-between;min-height:64px}
.sh-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:#fff}
.sh-brand span{display:grid;place-items:center;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:6px}
.sh-brand img{display:block;width:20px;height:20px}
.sh-brand b{font-size:15px;letter-spacing:-.01em}
.sh-header-link{font-size:13px;color:var(--muted);text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:9px 16px;transition:.2s}
.sh-header-link:hover{color:#fff;border-color:rgba(215,255,0,.6);box-shadow:0 0 22px rgba(215,255,0,.08)}
.sh-hero{padding:76px 0 44px;background:radial-gradient(60% 60% at 20% 0,rgba(215,255,0,.1),transparent 60%),var(--ink)}
.sh-eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--lime);font-weight:700}
.sh-hero h1{font-size:clamp(38px,5vw,56px);line-height:1.04;letter-spacing:-.04em;font-weight:700;margin-top:14px;max-width:860px}
.sh-hero h1 em{font-style:normal;color:var(--lime)}
.sh-lead{color:var(--muted);font-size:18px;line-height:1.65;max-width:790px;margin-top:18px}
.sh-section{padding:54px 0}
.sh-section--first{padding-top:26px}
.sh-section--compact{padding-top:42px;padding-bottom:42px}
.sh-section--closing{padding-top:42px}
.sh-section h2,.sh-cheat h2{font-size:clamp(27px,3vw,38px);line-height:1.08;letter-spacing:-.035em;margin-top:10px}
.sh-section-lead{max-width:760px;margin-top:14px;color:var(--muted);font-size:15px;line-height:1.65}
.sh-start-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:16px;align-items:stretch}
.sh-start-card,.sh-learn-note{border:1px solid var(--line);border-radius:16px;background:var(--surface);padding:26px}
.sh-start-card{display:flex;flex-direction:column;align-items:flex-start}
.sh-start-card h2{margin-top:10px}
.sh-start-card>p:not(.sh-eyebrow){color:var(--muted);font-size:15px;line-height:1.65;max-width:720px;margin-top:13px}
.sh-start-card .sh-open{margin-top:20px}
.sh-learn-note{display:flex;flex-direction:column;justify-content:center;background:var(--surface2)}
.sh-learn-note b{font-size:18px;letter-spacing:-.02em}
.sh-learn-note p{color:var(--muted);font-size:14px;line-height:1.65;margin-top:10px}
.sh-sell-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:24px}
.sh-sell-card{padding:20px;border:1px solid var(--line);border-radius:12px;background:var(--surface)}
.sh-sell-card h3{font-size:17px;color:var(--lime)}
.sh-sell-card p{color:var(--muted);font-size:13.5px;line-height:1.6;margin-top:7px}
.sh-roofing-note{max-width:900px;margin-top:18px;padding:14px 16px;border-left:3px solid var(--lime);background:rgba(215,255,0,.045);color:var(--muted);font-size:13.5px;line-height:1.6}
.sh-roofing-note b{color:#fff}
.sh-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:28px}
.sh-card{display:flex;flex-direction:column;gap:11px;padding:24px;border:1px solid var(--line);border-radius:16px;background:var(--surface);transition:.2s}
.sh-card:hover{border-color:rgba(215,255,0,.5);box-shadow:0 0 0 1px rgba(215,255,0,.12),0 0 28px rgba(215,255,0,.07);transform:translateY(-2px)}
.sh-badge{display:inline-block;width:fit-content;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--lime);border:1px solid rgba(215,255,0,.4);border-radius:999px;padding:5px 11px}
.sh-card h3{font-size:20px;letter-spacing:-.02em}
.sh-tagline{font-size:14px;color:var(--muted);line-height:1.6}
.sh-usewhen{font-size:13.5px;line-height:1.55;color:#dfe5ee}
.sh-usewhen b{color:var(--lime);font-weight:600}
.sh-points{list-style:none;padding:0;display:grid;gap:7px}
.sh-points li{position:relative;padding-left:19px;font-size:13px;color:var(--muted);line-height:1.5}
.sh-points li::before{content:"";position:absolute;left:0;top:6px;width:7px;height:7px;border-radius:2px;background:var(--lime);opacity:.85}
.sh-card-note{padding:11px 12px;border-radius:10px;background:var(--surface2);color:#dce3ed;font-size:12.5px;line-height:1.55}
.sh-card-actions{display:flex;gap:10px;margin-top:auto;padding-top:6px}
.sh-open{display:inline-flex;align-items:center;justify-content:center;padding:11px 20px;border-radius:999px;background:var(--lime);color:var(--ink);font-weight:700;font-size:13.5px;text-decoration:none;transition:.2s}
.sh-open:hover{transform:translateY(-1px);box-shadow:0 0 24px rgba(215,255,0,.35)}
.sh-copy{display:inline-flex;align-items:center;justify-content:center;padding:11px 20px;border-radius:999px;background:transparent;color:#fff;border:1px solid var(--line);font-weight:600;font-size:13.5px;cursor:pointer;transition:.2s}
.sh-copy:hover{border-color:rgba(215,255,0,.6);box-shadow:0 0 18px rgba(215,255,0,.08)}
.sh-copy.is-copied{border-color:var(--lime);color:var(--lime)}
.sh-cheat{padding:46px 0}
.sh-cheat ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:22px}
.sh-cheat li{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 16px;border:1px solid var(--line);border-radius:12px;background:var(--surface)}
.sh-cheat li span{font-size:13.5px;color:var(--muted)}
.sh-cheat li b{font-size:13.5px;color:var(--lime);white-space:nowrap}
.sh-referred-note{display:grid;grid-template-columns:.85fr 1.15fr;gap:32px;align-items:center;padding:24px;border:1px solid rgba(215,255,0,.38);border-left:3px solid var(--lime);border-radius:0 16px 16px 0;background:rgba(215,255,0,.05)}
.sh-referred-note h2{font-size:24px;margin-top:8px}
.sh-referred-note>p{color:var(--muted);font-size:14px;line-height:1.65}
.sh-feedback{display:flex;justify-content:space-between;gap:28px;align-items:flex-start;margin-top:16px;padding:16px 18px;border:1px solid var(--line);border-radius:12px;background:var(--surface)}
.sh-feedback b{font-size:13.5px;white-space:nowrap}
.sh-feedback span{color:var(--muted);font-size:13px;line-height:1.55;max-width:760px}
.sh-footer{border-top:1px solid var(--line);color:#858fa0;font-size:11.5px;margin-top:12px}
.sh-footer .sh-shell{display:flex;justify-content:space-between;gap:20px;padding-block:22px;flex-wrap:wrap}
@media(max-width:900px){.sh-start-grid,.sh-referred-note{grid-template-columns:1fr}.sh-sell-grid{grid-template-columns:1fr}.sh-grid{grid-template-columns:1fr}.sh-cheat ul{grid-template-columns:1fr}.sh-feedback{display:grid}}
@media(max-width:720px){.sh-shell{padding-inline:18px}.sh-hero{padding:54px 0 34px}.sh-hero h1{font-size:38px}.sh-lead{font-size:16px}.sh-section{padding:42px 0}.sh-section--first{padding-top:22px}.sh-section--compact{padding-top:34px;padding-bottom:34px}.sh-start-card,.sh-learn-note,.sh-card{padding:20px}.sh-card-actions{flex-direction:column}.sh-open,.sh-copy{width:100%}.sh-cheat li{flex-direction:column;align-items:flex-start;gap:6px}.sh-feedback b{white-space:normal}}
@media(prefers-reduced-motion:reduce){.sh-card,.sh-open,.sh-copy,.sh-header-link{transition:none}.sh-card:hover,.sh-open:hover{transform:none}}
.sh-demo{display:grid;grid-template-columns:1.05fr .95fr;gap:18px;margin-top:26px;align-items:stretch}
.sh-demo-shot{position:relative;display:block;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:var(--surface);text-decoration:none;transition:.2s}
.sh-demo-shot img{display:block;width:100%;height:auto}
.sh-demo-shot:hover{border-color:rgba(215,255,0,.5);box-shadow:0 0 0 1px rgba(215,255,0,.12),0 0 30px rgba(215,255,0,.09);transform:translateY(-2px)}
.sh-demo-overlay{position:absolute;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:2px;padding:44px 10px 16px;background:linear-gradient(180deg,rgba(10,11,16,0),rgba(10,11,16,.92));color:#fff;text-align:center;opacity:0;transition:.2s}
.sh-demo-overlay b{font-size:14px}
.sh-demo-overlay span{font-size:11px;color:var(--muted)}
.sh-demo-shot:hover .sh-demo-overlay,.sh-demo-shot:focus-visible .sh-demo-overlay{opacity:1}
.sh-demo-copy{display:flex;flex-direction:column;gap:12px;justify-content:center;padding:26px;border:1px solid var(--line);border-radius:16px;background:var(--surface)}
.sh-demo-copy>p:first-child{color:var(--muted);font-size:14.5px;line-height:1.6}
.sh-points li b{color:#fff;font-weight:600}
.sh-demo-copy .sh-card-actions{padding-top:2px}
.sh-card-actions--start{justify-content:flex-start}
.sh-demo-fine{font-size:11.5px;color:#858fa0}
@media(max-width:900px){.sh-demo{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.sh-demo-shot{transition:none}.sh-demo-shot:hover{transform:none}}
`;
