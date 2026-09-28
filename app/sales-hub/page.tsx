import { CopyLink } from "./copy-link";

type CustomerCard = {
  name: string;
  path: string;
  badge: string;
  tagline: string;
  sendWhen: string;
  inside: string[];
};

const CUSTOMER_CARDS: CustomerCard[] = [
  {
    name: "Ballpark Pricing Calculator",
    path: "/pricing-calculator/referred",
    badge: "Start here",
    tagline:
      "Interactive pricing tool. The prospect picks the tools they want and a live cost ballpark updates instantly — no contact details needed.",
    sendWhen: "They ask roughly what something like this costs.",
    inside: [
      "Pick tools and capability levels, total updates live",
      "USD / GBP toggle, indicative ranges",
      "Every CTA points them back to you, the rep",
    ],
  },
  {
    name: "Our Solution",
    path: "/our-solution/referred",
    badge: "The pitch",
    tagline:
      "The full story: buyers now expect instant answers, and this is what T3 Labs builds to give them.",
    sendWhen: "They want to understand the approach before talking numbers.",
    inside: [
      "Why a brochure site and an inquiry form no longer close",
      "The shift to instant pricing, quantities and product guidance",
      "What a T3 Labs solution delivers for a business",
    ],
  },
  {
    name: "Roofing Solutions",
    path: "/roofing-solutions/referred",
    badge: "Construction example",
    tagline:
      "A worked construction example: how a customer gets answers, quantities and pricing before they ever call.",
    sendWhen: "The prospect is a roofing or construction business.",
    inside: [
      "Choose business type for relevant examples",
      "Three methods: enter measurements, measure a plan, Smart Assistant",
      "Product guidance and preliminary pricing flows",
    ],
  },
  {
    name: "Roofing Business Tools",
    path: "/roofing-business-tools/referred",
    badge: "Tools deep-dive",
    tagline:
      "Measurement, digital takeoff, Smart Assistant, trade access and business controls — one useful tool or a full system.",
    sendWhen: "They want the full picture of the tools, not one feature.",
    inside: [
      "Start with one tool, combine into a system",
      "Tool-by-tool breakdown of what each unlocks",
      "Configured around how their business works",
    ],
  },
];

const RESOURCES_CARD: CustomerCard = {
  name: "Sales Resources",
  path: "/sales-resources",
  badge: "For you",
  tagline:
    "Your playbook: find the lead, find the angle, start the conversation.",
  sendWhen: "You are preparing for a call or working out how to open.",
  inside: [
    "What a high-intent lead looks like",
    "Openers that lead with what you noticed",
    "Pushback handling and commission guidance",
  ],
};

const CHEATS: { scenario: string; answer: string; path: string }[] = [
  {
    scenario: "\"How much would something like this cost?\"",
    answer: "Ballpark Pricing Calculator",
    path: "/pricing-calculator/referred",
  },
  {
    scenario: "\"What is it you actually build?\"",
    answer: "Our Solution",
    path: "/our-solution/referred",
  },
  {
    scenario: "They are a roofing / construction business",
    answer: "Roofing Solutions",
    path: "/roofing-solutions/referred",
  },
  {
    scenario: "\"Show me the tools in detail\"",
    answer: "Roofing Business Tools",
    path: "/roofing-business-tools/referred",
  },
];

function Card({ card }: { card: CustomerCard }) {
  return (
    <article className="sh-card">
      <span className="sh-badge">{card.badge}</span>
      <h3>{card.name}</h3>
      <p className="sh-tagline">{card.tagline}</p>
      <p className="sh-sendwhen">
        <b>Send it when:</b> {card.sendWhen}
      </p>
      <ul className="sh-inside">
        {card.inside.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
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
            One link. <em>Everything you need to sell.</em>
          </h1>
          <p className="sh-lead">
            Every customer-facing page we have built, what each one is for, and
            when to send it. Copy a link, send it, and pick up the conversation
            when they come back to you.
          </p>
          <div className="sh-referred-note">
            <b>All customer links below are referred versions.</b>
            <span>
              Our calendar and enquiry forms are switched off on them — every
              CTA sends the prospect back to you, so you stay in the middle of
              every deal.
            </span>
          </div>
        </div>
      </section>

      <section className="sh-cheat" aria-label="Not sure which link to send">
        <div className="sh-shell">
          <h2>Not sure which link to send?</h2>
          <ul>
            {CHEATS.map((c) => (
              <li key={c.path}>
                <span>{c.scenario}</span>
                <b>{c.answer}</b>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sh-section" aria-labelledby="sh-customer-title">
        <div className="sh-shell">
          <p className="sh-eyebrow">Send to a customer</p>
          <h2 id="sh-customer-title">The pages you share.</h2>
          <div className="sh-grid">
            {CUSTOMER_CARDS.map((card) => (
              <Card key={card.path} card={card} />
            ))}
          </div>
        </div>
      </section>

      <section className="sh-section" aria-labelledby="sh-foryou-title">
        <div className="sh-shell">
          <p className="sh-eyebrow">For you</p>
          <h2 id="sh-foryou-title">Your own playbook.</h2>
          <div className="sh-grid">
            <Card card={RESOURCES_CARD} />
          </div>
        </div>
      </section>

      <footer className="sh-footer">
        <div className="sh-shell">
          <span>&copy; T3 Labs</span>
          <span>This hub is for reps — please do not post the link publicly.</span>
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
.sh-header{position:sticky;top:0;z-index:20;background:rgba(10,11,16,.84);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.sh-header-inner{display:flex;align-items:center;justify-content:space-between;min-height:64px}
.sh-brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:#fff}
.sh-brand span{display:grid;place-items:center;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:6px}
.sh-brand img{display:block;width:20px;height:20px}
.sh-brand b{font-size:15px;letter-spacing:-.01em}
.sh-header-link{font-size:13px;color:var(--muted);text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:9px 16px;transition:.2s}
.sh-header-link:hover{color:#fff;border-color:rgba(215,255,0,.6)}
.sh-hero{padding:88px 0 48px;background:radial-gradient(60% 60% at 20% 0,rgba(215,255,0,.1),transparent 60%),#0a0b10}
.sh-eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--lime);font-weight:600}
.sh-hero h1{font-size:clamp(38px,5vw,58px);line-height:1.04;letter-spacing:-.04em;font-weight:700;margin-top:14px;max-width:860px}
.sh-hero h1 em{font-style:normal;color:var(--lime)}
.sh-lead{color:var(--muted);font-size:19px;line-height:1.65;max-width:760px;margin-top:18px}
.sh-referred-note{display:grid;gap:6px;margin-top:28px;max-width:760px;padding:16px 18px;border:1px solid rgba(215,255,0,.35);border-left:3px solid var(--lime);border-radius:0 12px 12px 0;background:rgba(215,255,0,.05)}
.sh-referred-note b{font-size:14px}
.sh-referred-note span{font-size:13.5px;color:var(--muted);line-height:1.6}
.sh-cheat{padding:30px 0 6px}
.sh-cheat h2{font-size:14px;font-weight:600;margin-bottom:14px}
.sh-cheat ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.sh-cheat li{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 16px;border:1px solid var(--line);border-radius:12px;background:var(--surface)}
.sh-cheat li span{font-size:13.5px;color:var(--muted)}
.sh-cheat li b{font-size:13.5px;color:var(--lime);white-space:nowrap}
.sh-section{padding:56px 0}
.sh-section h2{font-size:clamp(28px,3.4vw,40px);line-height:1.06;letter-spacing:-.035em;margin-top:12px}
.sh-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:28px}
.sh-card{display:flex;flex-direction:column;gap:12px;padding:24px;border:1px solid var(--line);border-radius:16px;background:var(--surface);transition:.2s}
.sh-card:hover{border-color:rgba(215,255,0,.5);box-shadow:0 0 0 1px rgba(215,255,0,.12),0 0 28px rgba(215,255,0,.07);transform:translateY(-2px)}
.sh-badge{display:inline-block;width:fit-content;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--lime);border:1px solid rgba(215,255,0,.4);border-radius:999px;padding:5px 11px}
.sh-card h3{font-size:20px;letter-spacing:-.02em}
.sh-tagline{font-size:14.5px;color:var(--muted);line-height:1.6}
.sh-sendwhen{font-size:13.5px;line-height:1.55;color:#dfe5ee}
.sh-sendwhen b{color:var(--lime);font-weight:600}
.sh-inside{list-style:none;padding:0;display:grid;gap:8px}
.sh-inside li{position:relative;padding-left:20px;font-size:13.5px;color:var(--muted)}
.sh-inside li::before{content:"";position:absolute;left:0;top:7px;width:8px;height:8px;border-radius:2px;background:var(--lime);opacity:.85}
.sh-card-actions{display:flex;gap:10px;margin-top:auto;padding-top:6px}
.sh-open{display:inline-flex;align-items:center;justify-content:center;padding:11px 20px;border-radius:999px;background:var(--lime);color:#0a0b10;font-weight:600;font-size:13.5px;text-decoration:none;transition:.2s}
.sh-open:hover{box-shadow:0 0 24px rgba(215,255,0,.35)}
.sh-copy{display:inline-flex;align-items:center;justify-content:center;padding:11px 20px;border-radius:999px;background:transparent;color:#fff;border:1px solid var(--line);font-weight:600;font-size:13.5px;cursor:pointer;transition:.2s}
.sh-copy:hover{border-color:rgba(215,255,0,.6)}
.sh-copy.is-copied{border-color:var(--lime);color:var(--lime)}
.sh-footer{border-top:1px solid var(--line);color:#858fa0;font-size:11.5px;margin-top:24px}
.sh-footer .sh-shell{display:flex;justify-content:space-between;gap:20px;padding-block:22px;flex-wrap:wrap}
@media(max-width:880px){.sh-grid{grid-template-columns:1fr}.sh-cheat ul{grid-template-columns:1fr}}
@media(max-width:720px){.sh-shell{padding-inline:18px}.sh-hero{padding:56px 0 36px}.sh-hero h1{font-size:38px}.sh-lead{font-size:16px}.sh-section{padding:44px 0}.sh-card{padding:20px}.sh-cheat li{flex-direction:column;align-items:flex-start;gap:6px}}
@media(prefers-reduced-motion:reduce){.sh-card,.sh-open,.sh-copy,.sh-header-link{transition:none}.sh-card:hover{transform:none}}
`;
