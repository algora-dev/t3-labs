import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/t3-rebuild/Header";
import { MarketingFooter } from "@/components/t3-rebuild/MarketingFooter";
import { ROOFING_SOLUTIONS } from "@/components/t3-rebuild/solutions";
import "../t3-rebuild.css";
import "@/components/t3-rebuild/solutions-pages.css";

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  title: { absolute: "Roofing Business Solutions: Websites, SEO & Software | T3Labs" },
  description: "Explore seven practical roofing business solutions from T3Labs: websites, SEO, estimators, quoting, AI assistants, automation and custom roofing software.",
  alternates: { canonical: `${BASE_URL}/solutions` },
  openGraph: {
    title: "Roofing Business Solutions | T3Labs",
    description: "Choose a ready-made solution or talk to us about custom software built around the way your roofing business works.",
    url: `${BASE_URL}/solutions`,
    type: "website",
  },
};

export default function SolutionsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Solutions for Roofing Businesses",
    url: `${BASE_URL}/solutions`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: ROOFING_SOLUTIONS.map((solution, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: solution.title,
        url: `${BASE_URL}/${solution.slug}`,
      })),
    },
  };

  return (
    <div className="t3-rebuild">
      <Header />
      <main className="t3s-main" id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section className="t3s-hero">
          <div className="t3s-shell">
            <nav className="t3s-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Solutions</span></nav>
            <span className="t3s-eyebrow">PRACTICAL TECHNOLOGY FOR THE ROOFING TRADE</span>
            <h1>Find the right solution for <em>your roofing business.</em></h1>
            <p>Whether you need more enquiries, faster estimates, less admin or a tool built just for you, start with the problem you want to solve. Explore what we already offer or talk to us about a custom build.</p>
            <div className="t3s-actions"><Link className="t3s-button" href="/free-review">Get a free business review <span aria-hidden="true">↗</span></Link><a className="t3s-text-link t3s-text-link-light" href="#solutions-list">Browse the solutions ↓</a></div>
          </div>
        </section>
        <section className="t3s-section" id="solutions-list">
          <div className="t3s-shell">
            <span className="t3s-eyebrow t3s-eyebrow-ink">SEVEN WAYS WE CAN HELP</span>
            <h2>Choose a starting point.</h2>
            <p className="t3s-section-intro">Each solution page explains the problem it solves, what the options look like and where to go next. You do not need to know which technology you need before speaking to us.</p>
            <div className="t3s-cards">
              {ROOFING_SOLUTIONS.map((solution, index) => (
                <article key={solution.slug} className={`t3s-card${solution.slug === "custom-roofing-software" ? " t3s-card-featured" : ""}`}>
                  <span className="t3s-card-count">{String(index + 1).padStart(2, "0")} / {solution.outcome}</span>
                  <h3><Link href={`/${solution.slug}`}>{solution.title}</Link></h3>
                  <p>{solution.description}</p>
                  <Link className="t3s-card-link" href={`/${solution.slug}`} aria-label={`Explore ${solution.title}`}>Explore solution <span aria-hidden="true">↗</span></Link>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="t3s-choice-band">
          <div className="t3s-shell t3s-choice-layout">
            <div><span className="t3s-eyebrow">READY-MADE OR CUSTOM</span><h2>Don&apos;t need another all-in-one subscription?</h2><p>If you only use a few features across several apps, we can help you find a simpler route. Sometimes an existing tool is enough. Sometimes a small, purpose-built app is the better fit.</p></div>
            <Link className="t3s-button" href="/custom-roofing-software">Explore custom roofing software ↗</Link>
          </div>
        </section>
        <section className="t3s-section t3s-section-soft">
          <div className="t3s-shell t3s-proof-strip">
            <div><span className="t3s-eyebrow t3s-eyebrow-ink">REAL WORK, NOT JUST IDEAS</span><h2>See what we have built.</h2><p>QuoteCore+ is an example of a larger roofing software platform we&apos;ve built. You can explore the real platform or read about the project before deciding what might make sense for your business.</p></div>
            <div className="t3s-proof-links"><Link href="/case-studies/quotecore">Read the QuoteCore+ case study ↗</Link><a href="https://quote-core.com/" target="_blank" rel="noopener noreferrer">Explore QuoteCore+ ↗</a><Link href="/roofing-solutions">See our working customer tools example ↗</Link></div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
