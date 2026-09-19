const bookingUrl = "https://calendly.com/insights-t3labs/20-minute-meeting";

const modules = [
  {
    number: "01",
    title: "Measurement-to-product builder",
    eyebrow: "The core tool",
    text: "A homeowner, contractor or team member enters the measurements they already have, applies your products and gets a useful material, pricing or quote-ready output.",
    bullets: ["One simple measurement or a complex multi-product roof", "Your product rules, prices and approved options", "Estimate, enquiry or quote workflow to suit the user"],
  },
  {
    number: "02",
    title: "Plan measurement add-on",
    eyebrow: "Optional extension",
    text: "For users without measurements, an uploaded plan becomes the starting point. They measure the roof, then pass those lengths and areas straight into the same product builder.",
    bullets: ["Manual or digital plan take-off", "No re-keying after the measurement stage", "The measurement work leads somewhere commercially useful"],
  },
  {
    number: "03",
    title: "Smart Assistant",
    eyebrow: "Standalone or combined",
    text: "A conversational front door for product questions, early qualification and guided next steps. It can work on its own or help people reach the right structured tool.",
    bullets: ["Answers from your approved information", "Gathers the details your team actually needs", "Turns a conversation into a clear enquiry summary"],
  },
] as const;

const controls = [
  ["Products & rules", "Add, remove and organise products; control what can be selected and how outputs are built."],
  ["Pricing", "Manage public, trade and customer-specific price levels without exposing rates to the wrong audience."],
  ["Trade access", "Invite, remove and manage contractor users who can see approved trade pricing and saved work."],
  ["Offers & actions", "Place the right next step at the right moment: request a formal quote, unlock a first-order offer or discuss trade pricing."],
  ["Quote intelligence", "See quote activity, indicative value, repeat users and the products most often selected."],
  ["Team workflow", "Choose which work stays public, which requires login, and when your team needs to review the result."],
] as const;

export default function RoofingBusinessToolsPage() {
  return (
    <main className="rb-page">
      <style>{styles}</style>
      <header className="rb-header">
        <a className="rb-brand" href="/roofing-solutions" aria-label="T3 Labs roofing solutions">
          <span className="rb-brand-mark">T3</span><span>T3 Labs</span>
        </a>
        <a className="rb-nav-cta" href="#build-your-system">Build your system <span aria-hidden="true">→</span></a>
      </header>

      <section className="rb-hero">
        <div className="rb-grid-glow" aria-hidden="true" />
        <div className="rb-shell rb-hero-grid">
          <div>
            <p className="rb-eyebrow">Roofing growth systems</p>
            <h1>Turn your roofing website into a <em>quoting, trade-growth and lead-generation system.</em></h1>
            <p className="rb-lead">Give customers and contractors genuinely useful tools. Keep control of products, pricing, trade access, offers and follow-up from one business portal.</p>
            <div className="rb-hero-actions">
              <a className="rb-primary" href="#build-your-system">Map your ideal setup <span aria-hidden="true">→</span></a>
              <a className="rb-secondary" href="#the-system">See the system</a>
            </div>
            <p className="rb-fineprint">Choose one tool or combine them. Built around your products, team and sales strategy.</p>
          </div>
          <div className="rb-dashboard" aria-label="Illustration of the roofing business control centre">
            <div className="rb-dash-top"><span className="rb-live"><i /> Live activity</span><span>Admin portal</span></div>
            <div className="rb-stat-grid"><div><strong>38</strong><span>quote journeys</span></div><div><strong>£84k</strong><span>indicative value</span></div><div><strong>12</strong><span>trade users</span></div></div>
            <div className="rb-chart"><span>Quote activity</span><div className="rb-bars"><i /><i /><i /><i /><i /><i /><i /></div></div>
            <div className="rb-product-row"><span className="rb-dot" /> Most selected: Heritage clay tile <b>View activity →</b></div>
            <div className="rb-dash-offer"><span>Trade opportunity</span><p>Offer approved trade pricing to repeat users.</p><button type="button">Configure prompt</button></div>
          </div>
        </div>
      </section>

      <section className="rb-proof">
        <div className="rb-shell rb-proof-grid"><p>Not another brochure-site calculator.</p><p>One configurable system that helps people act — and gives your team the visibility to turn that activity into sales.</p></div>
      </section>

      <section className="rb-section rb-shell" id="the-system">
        <div className="rb-section-heading"><p className="rb-eyebrow">Choose your setup</p><h2>Start with what would make the biggest difference to your business.</h2><p>Each module works around the others, but you only buy what you need. Add more capability as your workflow grows.</p></div>
        <div className="rb-module-grid">
          {modules.map((module) => <article className="rb-module" key={module.number}>
            <span className="rb-number">{module.number}</span><p className="rb-card-eyebrow">{module.eyebrow}</p><h3>{module.title}</h3><p>{module.text}</p>
            <ul>{module.bullets.map((bullet) => <li key={bullet}><span>✓</span>{bullet}</li>)}</ul>
          </article>)}
        </div>
        <div className="rb-flow" aria-label="Core tool flow">
          <div><span>Start</span><b>Known measurements</b><small>or add plan measurement</small></div><i>→</i><div><span>Your system</span><b>Products & pricing</b><small>rules set by your business</small></div><i>→</i><div><span>Outcome</span><b>Quote, enquiry or order path</b><small>with the right next action</small></div>
        </div>
      </section>

      <section className="rb-section rb-showcase">
        <div className="rb-shell rb-showcase-grid">
          <div className="rb-shot-wrap"><img src="/assets/roofing-solutions/result-quote-output.jpg" alt="Example roofing estimate output with materials and pricing" /><p>Example workflow visual — tailored output, products and branding are configured for each business.</p></div>
          <div><p className="rb-eyebrow">Useful for the people using it</p><h2>A tool worth returning to. A better sales conversation when they do.</h2><div className="rb-outcomes"><article><h3>Homeowners</h3><p>A clear guided path from a basic roof question to a useful next step, without making a call the only option.</p></article><article><h3>Roofing contractors</h3><p>Faster material take-offs, product lists and quote preparation — plus an obvious route into your trade programme.</p></article><article><h3>Your internal team</h3><p>Configured internal tools that reduce re-keying, speed up estimating and preserve the job context.</p></article></div></div>
        </div>
      </section>

      <section className="rb-section rb-shell">
        <div className="rb-section-heading"><p className="rb-eyebrow">Your business stays in control</p><h2>Manage the system from your own admin portal.</h2><p>The tools are only useful if they reflect how you sell. The portal gives your team control without making them dependent on a developer for every product or pricing change.</p></div>
        <div className="rb-controls">
          {controls.map(([title, text]) => <article key={title}><span className="rb-control-icon" aria-hidden="true">+</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </section>

      <section className="rb-section rb-opportunity">
        <div className="rb-shell rb-opportunity-grid"><div><p className="rb-eyebrow">Turn activity into opportunity</p><h2>See what gets quoted. Then give the right people a reason to buy from you.</h2><p>A useful contractor tool creates value before a sales call. With the right permissions and consent, your team can identify repeated activity, high-value quote journeys and product demand — then offer trade access, a first-order incentive or help with a formal quote.</p></div><div className="rb-opportunity-card"><p className="rb-card-eyebrow">Example conversion moment</p><h3>“Are you a roofing contractor?”</h3><p>Unlock approved trade pricing and save your next quote.</p><div><button type="button">Discuss trade pricing</button><button type="button">Continue as a customer</button></div><small>Prompts, eligibility, offers and routing are configured for your business.</small></div></div>
      </section>

      <section className="rb-section rb-configuration">
        <div className="rb-shell"><p className="rb-eyebrow">Flexible deployment</p><h2>Public, trade-only, internal — or a combination.</h2><div className="rb-deployment-grid"><article><h3>Public website tool</h3><p>Help customers understand products, build an indicative output and make a better enquiry.</p></article><article><h3>Contractor & trade portal</h3><p>Give approved users saved jobs, controlled prices and a reason to come back to your business.</p></article><article><h3>Internal estimating workspace</h3><p>Keep the full capability behind login for faster take-offs, quote preparation and team use.</p></article></div></div>
      </section>

      <section className="rb-close" id="build-your-system">
        <div className="rb-shell rb-close-inner"><p className="rb-eyebrow">Build your roofing system</p><h2>Show us your products, pricing approach and sales process. We’ll map the right starting point.</h2><p>You do not need to launch everything at once. Start with the tool that solves the most expensive bottleneck, then add the rest when it earns its place.</p><div className="rb-hero-actions"><a className="rb-primary" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book a free roofing workflow call <span aria-hidden="true">→</span></a><a className="rb-secondary" href="/roofing-solutions">Back to Roofing Solutions</a></div></div>
      </section>
      <footer className="rb-footer"><div className="rb-shell"><span>© T3 Labs</span><span>Roofing tools · Trade growth · Smarter quoting</span></div></footer>
    </main>
  );
}

const styles = String.raw`
.rb-page{--lime:#d7ff00;--ink:#090b12;--surface:#10141f;--raised:#151b29;--line:#2a3243;--muted:#a5adbd;background:var(--ink);color:#f5f7fc;font-family:Arial,Helvetica,sans-serif;line-height:1.5}.rb-page *{box-sizing:border-box}.rb-page :is(h1,h2,h3,p){margin:0}.rb-shell{max-width:1180px;margin:auto;padding-inline:24px}.rb-header{height:74px;display:flex;align-items:center;justify-content:space-between;max-width:1180px;padding-inline:24px;margin:auto}.rb-brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none;font-weight:800}.rb-brand-mark{display:grid;place-items:center;width:35px;height:35px;background:var(--lime);color:var(--ink);border-radius:8px;font-size:12px;letter-spacing:-1px}.rb-nav-cta,.rb-secondary{color:#fff;text-decoration:none;font-weight:700;font-size:14px}.rb-hero{position:relative;overflow:hidden;padding:74px 0 86px;background:radial-gradient(circle at 75% 35%,rgba(215,255,0,.15),transparent 28%),linear-gradient(135deg,#090b12,#111827)}.rb-grid-glow{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:44px 44px;mask-image:linear-gradient(to right,#000 35%,transparent 85%)}.rb-hero-grid{position:relative;display:grid;grid-template-columns:1.05fr .95fr;gap:64px;align-items:center}.rb-eyebrow,.rb-card-eyebrow{color:var(--lime);font-size:12px;text-transform:uppercase;letter-spacing:.14em;font-weight:800}.rb-hero h1{font-size:clamp(40px,5vw,70px);line-height:.98;letter-spacing:-.055em;margin-top:18px;max-width:740px}.rb-hero h1 em{font-style:normal;color:var(--lime)}.rb-lead{font-size:18px;line-height:1.65;color:var(--muted);max-width:630px;margin-top:26px}.rb-hero-actions{display:flex;flex-wrap:wrap;gap:20px;align-items:center;margin-top:32px}.rb-primary{display:inline-flex;gap:9px;align-items:center;border-radius:999px;background:var(--lime);color:var(--ink);padding:15px 22px;text-decoration:none;font-size:14px;font-weight:800;transition:transform .2s,box-shadow .2s}.rb-primary:hover{transform:translateY(-2px);box-shadow:0 13px 30px rgba(215,255,0,.26)}.rb-secondary{border-bottom:1px solid rgba(255,255,255,.5);padding-bottom:3px}.rb-fineprint{font-size:13px;color:#8892a6;margin-top:22px}.rb-dashboard{border:1px solid #3b475c;border-radius:18px;background:rgba(17,24,39,.9);box-shadow:0 28px 70px rgba(0,0,0,.38);padding:22px;transform:rotate(2deg)}.rb-dash-top,.rb-product-row{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:#9ba5b8}.rb-live{color:#fff}.rb-live i{display:inline-block;width:7px;height:7px;background:var(--lime);border-radius:50%;margin-right:6px}.rb-stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:22px 0}.rb-stat-grid div,.rb-chart,.rb-dash-offer{background:#202938;border:1px solid #334057;border-radius:11px;padding:14px}.rb-stat-grid strong{display:block;font-size:21px}.rb-stat-grid span{display:block;font-size:10px;color:#9ba5b8;margin-top:4px}.rb-chart{height:116px;color:#aab4c7;font-size:11px}.rb-bars{height:72px;display:flex;gap:8px;align-items:end;padding-top:10px}.rb-bars i{background:linear-gradient(#d7ff00,#7f9b08);width:10%;border-radius:3px 3px 0 0}.rb-bars i:nth-child(1){height:27%}.rb-bars i:nth-child(2){height:45%}.rb-bars i:nth-child(3){height:38%}.rb-bars i:nth-child(4){height:74%}.rb-bars i:nth-child(5){height:57%}.rb-bars i:nth-child(6){height:88%}.rb-bars i:nth-child(7){height:65%}.rb-product-row{padding:17px 2px}.rb-product-row b{color:var(--lime);font-weight:700}.rb-dot{width:8px;height:8px;background:#77aaff;border-radius:50%;margin-right:7px}.rb-dash-offer{border-color:rgba(215,255,0,.35);background:rgba(215,255,0,.08)}.rb-dash-offer span{font-size:10px;text-transform:uppercase;color:var(--lime);font-weight:700;letter-spacing:.08em}.rb-dash-offer p{font-size:13px;color:#fff;margin:6px 0 12px}.rb-dash-offer button,.rb-opportunity-card button{border:0;border-radius:999px;padding:8px 11px;background:var(--lime);color:var(--ink);font-size:11px;font-weight:800}.rb-proof{border-block:1px solid var(--line);background:#0d111a}.rb-proof-grid{display:grid;grid-template-columns:1fr 1.6fr;gap:24px;padding-block:22px}.rb-proof p:first-child{color:var(--lime);font-weight:800}.rb-proof p:last-child{color:var(--muted)}.rb-section{padding-block:104px}.rb-section-heading{max-width:800px}.rb-section-heading h2,.rb-showcase h2,.rb-opportunity h2,.rb-configuration h2,.rb-close h2{font-size:clamp(31px,4vw,51px);line-height:1.04;letter-spacing:-.045em;margin-top:15px}.rb-section-heading>p:last-child,.rb-opportunity>p,.rb-close p{margin-top:18px;color:var(--muted);font-size:17px;line-height:1.65}.rb-module-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:45px}.rb-module{position:relative;padding:28px;background:var(--surface);border:1px solid var(--line);border-radius:14px;min-height:355px}.rb-number{position:absolute;right:22px;top:20px;color:#667086;font-size:13px;font-weight:800}.rb-module h3,.rb-controls h3,.rb-outcomes h3,.rb-deployment-grid h3{font-size:22px;letter-spacing:-.025em;margin:12px 0}.rb-module>p{color:var(--muted);font-size:15px}.rb-module ul{list-style:none;padding:0;margin:26px 0 0;display:grid;gap:11px;color:#d9deea;font-size:13px}.rb-module li{display:flex;gap:8px}.rb-module li span{color:var(--lime);font-weight:900}.rb-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:14px;background:#151a26;border:1px solid var(--line);border-radius:14px;padding:24px;margin-top:18px}.rb-flow div{display:grid;gap:3px}.rb-flow span{font-size:11px;color:var(--lime);font-weight:800;text-transform:uppercase;letter-spacing:.09em}.rb-flow b{font-size:15px}.rb-flow small{color:var(--muted)}.rb-flow i{font-style:normal;color:var(--lime);font-size:22px}.rb-showcase{background:#f3f5f9;color:#10131c}.rb-showcase-grid,.rb-opportunity-grid{display:grid;grid-template-columns:.9fr 1.1fr;gap:72px;align-items:center}.rb-shot-wrap{background:#fff;padding:10px;border:1px solid #d5dae5;border-radius:14px;box-shadow:0 24px 55px rgba(18,27,46,.13)}.rb-shot-wrap img{display:block;width:100%;height:auto;border-radius:8px}.rb-shot-wrap p{font-size:11px;line-height:1.4;color:#606a7b;padding:10px 5px 2px}.rb-showcase .rb-eyebrow{color:#627700}.rb-outcomes{display:grid;gap:12px;margin-top:28px}.rb-outcomes article{border-left:3px solid var(--lime);padding:7px 0 7px 17px}.rb-outcomes h3{font-size:17px;margin:0 0 4px}.rb-outcomes p{color:#596274;font-size:14px}.rb-controls{margin-top:45px;display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.rb-controls article{padding:22px;background:var(--surface);border:1px solid var(--line);border-radius:12px}.rb-control-icon{display:grid;place-items:center;width:29px;height:29px;border-radius:50%;background:rgba(215,255,0,.12);color:var(--lime);font-weight:800}.rb-controls h3{font-size:17px}.rb-controls p{font-size:14px;color:var(--muted)}.rb-opportunity{background:linear-gradient(135deg,#1b2432,#10151f);border-block:1px solid var(--line)}.rb-opportunity p{color:var(--muted);margin-top:19px;line-height:1.65}.rb-opportunity-card{background:#fbfcff;color:#121722;border-radius:15px;padding:30px;box-shadow:0 24px 55px rgba(0,0,0,.25)}.rb-opportunity-card .rb-card-eyebrow{color:#647800}.rb-opportunity-card h3{font-size:24px;margin:11px 0}.rb-opportunity-card p{color:#596274;margin:0 0 22px}.rb-opportunity-card div{display:flex;gap:9px}.rb-opportunity-card button+button{background:#eef1f5;color:#273041}.rb-opportunity-card small{display:block;color:#7a8495;font-size:11px;line-height:1.45;margin-top:22px}.rb-configuration{background:#0d111a}.rb-deployment-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:43px}.rb-deployment-grid article{padding:25px;border-top:3px solid var(--lime);background:var(--surface)}.rb-deployment-grid p{color:var(--muted);font-size:14px}.rb-close{padding-block:110px;background:radial-gradient(circle at 30% 0,rgba(215,255,0,.14),transparent 32%),#080a0f}.rb-close-inner{max-width:830px;text-align:center}.rb-close h2{margin-inline:auto}.rb-close p{max-width:690px;margin-inline:auto}.rb-close .rb-hero-actions{justify-content:center}.rb-footer{border-top:1px solid var(--line);color:#8d96a9;font-size:12px}.rb-footer .rb-shell{display:flex;justify-content:space-between;padding-block:25px}@media(max-width:800px){.rb-shell{padding-inline:20px}.rb-header{padding-inline:20px}.rb-hero{padding-block:46px 58px}.rb-hero-grid,.rb-showcase-grid,.rb-opportunity-grid{grid-template-columns:1fr;gap:38px}.rb-dashboard{transform:none}.rb-proof-grid,.rb-module-grid,.rb-controls,.rb-deployment-grid{grid-template-columns:1fr}.rb-proof-grid{padding-block:18px}.rb-section{padding-block:68px}.rb-flow{grid-template-columns:1fr}.rb-flow i{transform:rotate(90deg)}.rb-module{min-height:0}.rb-footer .rb-shell{flex-direction:column;gap:8px}.rb-hero h1{font-size:42px}.rb-section-heading h2,.rb-showcase h2,.rb-opportunity h2,.rb-configuration h2,.rb-close h2{font-size:34px}}
`;
