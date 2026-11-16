import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/t3-rebuild/Header";
import { MarketingFooter } from "@/components/t3-rebuild/MarketingFooter";
import "../t3-rebuild.css";
import "@/components/t3-rebuild/solutions-pages.css";

const BASE_URL = "https://www.t3labs.tech";
const REVIEW_URL = "/free-review?focus=Something+custom+or+not+sure+yet";
// When an approved hosted walkthrough is ready, supply its HTTPS embed URL here.
// Do not add a fake play button or video structured data before a real video exists.
const VIDEO_EMBED_URL = "";

export const metadata: Metadata = {
  title: { absolute: "Custom Roofing Software & Apps Built for Your Business | T3Labs" },
  description: "Custom roofing software, calculators, estimating tools and connected workflows. Replace unused features and disconnected apps with tools built around your process. See QuoteCore+.",
  alternates: { canonical: `${BASE_URL}/custom-roofing-software` },
  openGraph: {
    images: [{ url: "/og-roofing.png", width: 1200, height: 630, alt: "T3 Labs – better roofing leads, faster quotes, less admin" }],
    title: "Custom Roofing Software & Apps Built for Your Business | T3Labs",
    description: "From one useful calculator to a platform like QuoteCore+. Get roofing software shaped around the way your business actually works.",
    url: `${BASE_URL}/custom-roofing-software`,
    type: "website",
  },
};

const examples = [
  { title: "One useful tool", body: "A calculator, price builder, measurement worksheet or quote template that follows your exact rules." },
  { title: "A few connected workflows", body: "Bring the parts you use from different systems into one straightforward place, with fewer copy-and-paste steps." },
  { title: "Your own business app", body: "An internal dashboard, team portal, customer journey, supplier workflow or tailored estimating process." },
  { title: "A complete platform", body: "More involved software covering multiple jobs and teams. QuoteCore+ is proof of the scale of product we can develop." },
];

export default function CustomRoofingSoftwarePage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "Custom Roofing Software Development",
      serviceType: "Roofing business software, calculators and connected workflows",
      description: "T3Labs designs focused custom roofing tools and software around each contractor's workflow, from a single calculator to a larger platform.",
      provider: { "@type": "Organization", name: "T3Labs", url: BASE_URL },
      url: `${BASE_URL}/custom-roofing-software`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Roofing solutions", item: `${BASE_URL}/solutions` },
        { "@type": "ListItem", position: 3, name: "Custom Roofing Software", item: `${BASE_URL}/custom-roofing-software` },
      ],
    },
  ];
  const faq = [
    { q: "Can you build something small, or does it need to be a big project?", a: "Small is often the best place to start. A single calculator, pricing rule or internal form may solve the problem without a full app. We scope the smallest useful version first." },
    { q: "Can it replace several apps we already pay for?", a: "Possibly. We look at which features you genuinely use, where information moves between them and whether the systems offer integration access. A focused build may replace some subscriptions, while others are better kept or connected." },
    { q: "Will we own the software?", a: "We can scope a business-owned solution with agreed rights to the custom code and deliverables. Hosting, ongoing support, third-party services and any licensed components are explained in the proposal before work starts." },
    { q: "Is custom roofing software cheaper than subscriptions?", a: "Sometimes over time, but not always. A custom build has an upfront cost and may still need hosting, maintenance, API charges or updates. We compare the real costs with keeping and integrating the tools you already use." },
    { q: "What if QuoteCore+ or another existing tool already does the job?", a: "We'll recommend the simplest sensible option. A ready-made tool is often better than building something new when it meets your workflow without unnecessary compromise." },
  ];

  return (
    <div className="t3-rebuild">
      <Header />
      <main className="t3s-main" id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section className="t3s-hero">
          <div className="t3s-shell">
            <nav className="t3s-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/solutions">Solutions</Link><span aria-hidden="true">/</span><span aria-current="page">Custom Roofing Software</span></nav>
            <span className="t3s-eyebrow">CUSTOM SOFTWARE FOR ROOFING BUSINESSES</span>
            <h1>Custom roofing software. <em>Only the features you actually need.</em></h1>
            <p>Paying for several apps but only using one or two features in each? Struggling to move job details, measurements and prices between them? We can build a focused roofing tool that brings the pieces you actually need together, without the extra complexity.</p>
            <div className="t3s-actions"><Link href={REVIEW_URL} className="t3s-button">Talk about a custom build ↗</Link><Link href="/solutions" className="t3s-text-link t3s-text-link-light">See our ready-made options ↗</Link></div>
          </div>
        </section>
        <section className="t3s-section t3s-section-soft" aria-label="QuoteCore+ proof and future walkthrough">
          <div className="t3s-shell t3s-feature">
            <div className="t3s-feature-media">
              {VIDEO_EMBED_URL ? (
                <iframe loading="lazy" src={VIDEO_EMBED_URL} title="Custom roofing software walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
              ) : (
                <div className="t3s-feature-preview">
                  <Image src="/assets/t3-phase3/hero-quotecore-desktop.png" alt="Screenshot of the QuoteCore+ roofing measurement and quoting software platform" width={1280} height={800} sizes="(max-width: 850px) 100vw, 52vw" priority />
                  <span>Real product example: QuoteCore+</span>
                </div>
              )}
            </div>
            <div className="t3s-feature-copy">
              <span className="t3s-eyebrow t3s-eyebrow-ink">FROM SMALL TO PLATFORM-SCALE</span>
              <h2>We built QuoteCore+. We can build something just for you.</h2>
              <p>QuoteCore+ shows what our team can build for the roofing trade, including takeoff, pricing and quoting workflows. But your business might only need one calculation, a few connected steps or a straightforward internal app.</p>
              <p>We start with the problem, not a long feature list. A bigger system is an option, not the starting requirement.</p>
              <div className="t3s-proof-links"><Link href="/case-studies/quotecore">Read the QuoteCore+ case study ↗</Link><a href="https://quote-core.com/" target="_blank" rel="noopener noreferrer">Explore the working platform ↗</a></div>
            </div>
          </div>
        </section>
        <section className="t3s-section" id="what-we-build">
          <div className="t3s-shell">
            <span className="t3s-eyebrow t3s-eyebrow-ink">THE SIZE IS UP TO THE PROBLEM</span>
            <h2>A simple calculator or a complete business platform.</h2>
            <p className="t3s-section-intro">The right answer could be much smaller than the software you&apos;re using today.</p>
            <div className="t3s-cards t3s-cards-two">{examples.map((item, i) => <article className="t3s-card" key={item.title}><span className="t3s-card-count">{String(i + 1).padStart(2,"0")} / EXAMPLE</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
          </div>
        </section>
        <section className="t3s-choice-band">
          <div className="t3s-shell t3s-choice-layout">
            <div><span className="t3s-eyebrow">READY-MADE OR MADE FOR YOU</span><h2>You don&apos;t have to buy another complicated app.</h2><p>If an existing <Link href="/roofing-quoting-software">quoting tool</Link> or <Link href="/roofing-business-automation">automation</Link> solves the problem, we&apos;ll show you. If the missing piece is unique to your business, we can build that instead.</p></div>
            <Link href="/solutions" className="t3s-button">Explore the ready-made solutions ↗</Link>
          </div>
        </section>
        <section className="t3s-section" aria-labelledby="roofing-workflow-heading">
          <div className="t3s-shell">
            <span className="t3s-eyebrow t3s-eyebrow-ink">ONE CONNECTED ROOFING WORKFLOW</span>
            <h2 id="roofing-workflow-heading">From job details to a quote your team can follow up.</h2>
            <p className="t3s-section-intro">For example, a contractor may receive measurements by email, re-enter them in a pricing spreadsheet and then build a quote in another app. The right tool can connect those steps, with review and approval kept where they are needed.</p>
            <div className="t3s-cards t3s-cards-two">
              <article className="t3s-card"><span className="t3s-card-count">FIRST / CAPTURE THE RIGHT DETAILS</span><h3>Keep the information together.</h3><p>Collect the roof dimensions, product choices, customer details and site notes needed for an informed quote.</p><Link href="/roofing-website-estimators" className="t3s-card-link">See website estimators ↗</Link></article>
              <article className="t3s-card"><span className="t3s-card-count">NEXT / REDUCE RE-ENTRY</span><h3>Use the same data through the job.</h3><p>Apply agreed pricing rules, create documents and support follow-up. The exact integrations depend on your existing systems.</p><Link href="/roofing-quoting-software" className="t3s-card-link">See roofing quoting tools ↗</Link></article>
            </div>
          </div>
        </section>
        <section className="t3s-section t3s-section-soft">
          <div className="t3s-shell t3s-split">
            <div><span className="t3s-eyebrow t3s-eyebrow-ink">THE COST OF TOO MANY TOOLS</span><h2>Pay for the workflow you use, not features you don&apos;t.</h2></div>
            <div><p>If your business is spending $4,000 to $5,000 a year across software subscriptions, it&apos;s worth asking what those tools actually do for you. You may be paying repeatedly for overlapping features while still copying information from app to app.</p><p>A custom build can make sense when the same focused process is central to your business. We&apos;ll compare build, hosting, support and integration costs with your current subscriptions, not promise that custom software is always cheaper.</p><p>We can also scope a solution you own under agreed contract terms, rather than tying the core workflow to another broad subscription. Third-party licences and any ongoing services will be made clear upfront.</p></div>
          </div>
        </section>
        <section className="t3s-section">
          <div className="t3s-shell t3s-split">
            <div><span className="t3s-eyebrow t3s-eyebrow-ink">HOW WE START</span><h2>Show us how you work today.</h2><p>We don&apos;t need a technical specification. A spreadsheet, a screen recording or a few examples of where you lose time is enough to begin.</p></div>
            <ol className="t3s-steps"><li><strong>Tell us what&apos;s frustrating.</strong><span>Which apps do you use, and which features really matter?</span></li><li><strong>We map the simplest useful solution.</strong><span>Keep what works, connect what can be connected or replace unnecessary steps.</span></li><li><strong>Agree on scope and ownership.</strong><span>You&apos;ll know what&apos;s being built, what&apos;s included and any running costs before committing.</span></li></ol>
          </div>
        </section>
        <section className="t3s-section t3s-section-soft">
          <div className="t3s-shell t3s-split">
            <div><span className="t3s-eyebrow t3s-eyebrow-ink">COMMON QUESTIONS</span><h2>Do you really need custom software?</h2></div>
            <div className="t3s-faq">{faq.map((item) => <details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div>
          </div>
        </section>
        <section className="t3s-final"><div className="t3s-shell t3s-choice-layout"><div><span className="t3s-eyebrow">LET&apos;S FIND THE RIGHT FIT</span><h2>Tell us the two or three features you actually need.</h2><p>We&apos;ll help you decide whether an existing tool, a small custom app or a larger build makes sense for your roofing business.</p></div><div className="t3s-final-actions"><Link href={REVIEW_URL} className="t3s-button">Get a free business review ↗</Link><Link href="/contact" className="t3s-text-link t3s-text-link-light">Other ways to contact us ↗</Link></div></div></section>
        <aside className="t3s-related"><div className="t3s-shell"><strong>RELATED SOLUTIONS</strong><div><Link href="/solutions">All roofing solutions ↗</Link><Link href="/roofing-quoting-software">Roofing quoting software ↗</Link><Link href="/roofing-business-automation">Business automation ↗</Link><Link href="/roofing-website-estimators">Website estimators ↗</Link><Link href="/case-studies/quotecore">How we built QuoteCore+ ↗</Link></div></div></aside>
      </main>
      <MarketingFooter />
    </div>
  );
}
