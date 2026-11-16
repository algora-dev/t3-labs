import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/t3-rebuild/Header";
import { MarketingFooter } from "@/components/t3-rebuild/MarketingFooter";
import { TrackedLink } from "@/components/marketing/TrackedLink";
import { ClickToPlayOverview } from "@/components/marketing/ClickToPlayOverview";
import { ROOFING_OUTCOMES, ROOFING_SOLUTIONS } from "@/components/t3-rebuild/solutions";
import "../t3-rebuild.css";
import "@/components/t3-rebuild/solutions-pages.css";

const BASE_URL = "https://www.t3labs.tech";
const VIDEO_ID = "FIqNbi3bG7A"; // Existing video also used on /our-solution; keep source in sync.

export const metadata: Metadata = {
  title: { absolute: "Roofing Business Solutions: Better Leads, Faster Quotes | T3Labs" },
  description: "Improve roofing leads, website conversions, estimating, quoting and follow-up. See practical examples, then explore seven specialist roofing solutions from T3Labs.",
  alternates: { canonical: `${BASE_URL}/solutions` },
  openGraph: {
    images: [{ url: "/og-roofing.png", width: 1200, height: 630, alt: "T3 Labs – better roofing leads, faster quotes, less admin" }],
    title: "Get Better Roofing Leads, Quote Faster & Reduce Admin | T3Labs",
    description: "See how roofing websites, estimators, quoting tools and automation can work together. Includes a real video overview and examples.",
    url: `${BASE_URL}/solutions`,
    type: "website",
  },
};

export default function SolutionsPage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Roofing business solutions",
      url: `${BASE_URL}/solutions`,
      description: "Practical digital solutions for roofing leads, conversion, quoting and administration.",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: ROOFING_SOLUTIONS.map((solution, index) => ({
          "@type": "ListItem", position: index + 1, name: solution.title,
          url: `${BASE_URL}/${solution.slug}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Solutions", item: `${BASE_URL}/solutions` },
      ],
    },
  ];

  return (
    <div className="t3-rebuild">
      <Header />
      <main className="t3s-main" id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section className="t3s-hero">
          <div className="t3s-shell">
            <nav className="t3s-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Solutions</span></nav>
            <span className="t3s-eyebrow">BUILT FOR ROOFING BUSINESSES</span>
            <h1>Better enquiries. Faster quotes. <em>More of the right jobs won.</em></h1>
            <p>Not sure whether you need a new website, an estimator or better quoting software? Start with what is slowing your roofing business down. We help you attract relevant enquiries, answer customers sooner, quote more easily and reduce repeat admin.</p>
            <div className="t3s-actions"><TrackedLink className="t3s-button" href="/free-review" eventName="solutions_to_review_click" source="solutions-hero">Get a free business review <span aria-hidden="true">↗</span></TrackedLink><a className="t3s-text-link t3s-text-link-light" href="#pathways">Find my starting point ↓</a></div>
          </div>
        </section>

        <section className="t3s-section t3s-section-soft" aria-labelledby="solutions-video-heading">
          <div className="t3s-shell t3s-feature">
            <div className="t3s-feature-media">
              <ClickToPlayOverview videoId={VIDEO_ID} />
            </div>
            <div className="t3s-feature-copy">
              <span className="t3s-eyebrow t3s-eyebrow-ink">SEE THE BIG PICTURE</span>
              <h2 id="solutions-video-heading">See how the pieces can fit together.</h2>
              <p>This overview introduces how practical online tools can support roofing enquiries and quoting. Explore the four areas below to see where an improvement might help your own business.</p>
              <p>A stronger online journey connects what the customer needs to know with the information your team needs to prepare and follow up on a quote.</p>
              <div className="t3s-proof-links"><a href={`https://www.youtube.com/watch?v=${VIDEO_ID}`} target="_blank" rel="noopener noreferrer">Watch the video on YouTube ↗</a><a href="#pathways">Explore the four outcomes ↓</a></div>
              <p className="t3s-video-note">Open the video here, or watch it directly on YouTube.</p>
            </div>
          </div>
        </section>

        <section className="t3s-section" id="pathways" aria-labelledby="pathways-heading">
          <div className="t3s-shell">
            <span className="t3s-eyebrow t3s-eyebrow-ink">FOUR BUSINESS OUTCOMES</span>
            <h2 id="pathways-heading">Where would you like to improve first?</h2>
            <p className="t3s-section-intro">Most problems are connected, but you do not need to replace everything at once. Pick the place where your business loses the most opportunities or time.</p>
            <div className="t3s-outcome-grid">
              {ROOFING_OUTCOMES.map((outcome) => (
                <article className="t3s-outcome" key={outcome.id}>
                  <span className="t3s-card-count">{outcome.step} / {outcome.label}</span>
                  <h3>{outcome.title}</h3>
                  <p>{outcome.description}</p>
                  <p className="t3s-outcome-check"><strong>Ask yourself:</strong> {outcome.check}</p>
                  <a href={`#${outcome.id}`} className="t3s-card-link">See relevant solutions ↓</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="t3s-section t3s-section-soft" aria-labelledby="solutions-list-heading">
          <div className="t3s-shell">
            <span className="t3s-eyebrow t3s-eyebrow-ink">SEVEN SPECIALIST SOLUTIONS</span>
            <h2 id="solutions-list-heading">Practical tools for a specific problem.</h2>
            <p className="t3s-section-intro">Each page explains what to check first, what the options are and a relevant example. You can start small or connect several improvements.</p>
            {ROOFING_OUTCOMES.map((outcome) => (
              <div className="t3s-outcome-group" key={outcome.id} id={outcome.id}>
                <div className="t3s-outcome-group-heading"><span className="t3s-card-count">{outcome.step} / {outcome.label}</span><h3>{outcome.title}</h3></div>
                <div className="t3s-cards t3s-cards-two">
                  {ROOFING_SOLUTIONS.filter((solution) => (outcome.slugs as readonly string[]).includes(solution.slug)).map((solution) => (
                    <article key={solution.slug} className="t3s-card">
                      <span className="t3s-card-count">{solution.outcome}</span>
                      <h3><Link href={`/${solution.slug}`}>{solution.title}</Link></h3>
                      <p>{solution.description}</p>
                      <TrackedLink className="t3s-card-link" href={`/${solution.slug}`} ariaLabel={`Explore ${solution.title}`} eventName="solutions_to_service_click" source={solution.slug}>Explore this solution ↗</TrackedLink>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="t3s-section" aria-labelledby="joined-up-journey-heading">
          <div className="t3s-shell">
            <span className="t3s-eyebrow t3s-eyebrow-ink">FROM THE BUSINESS TOOLS DEMO</span>
            <h2 id="joined-up-journey-heading">One enquiry can become a simpler quoting workflow.</h2>
            <p className="t3s-section-intro">You do not have to buy every module. An estimator, digital plan takeoff, smart assistant and quoting process can each be useful on their own. Where appropriate, they can be planned as connected steps, with your team keeping control of pricing and decisions.</p>
            <ol className="t3s-workflow-steps">
              <li><span className="t3s-card-count">01 / ANSWER</span><h3>Help the customer get started.</h3><p>Give useful service and pricing answers, ask about their roofing job and hand over complex questions to your team.</p><Link href="/roofing-ai-website-assistants">Website assistants ↗</Link></li>
              <li><span className="t3s-card-count">02 / UNDERSTAND</span><h3>Capture useful measurements.</h3><p>Start with known dimensions, a visual customer estimator or a measured roof plan, depending on what the job needs.</p><Link href="/roofing-website-estimators">Website estimators ↗</Link></li>
              <li><span className="t3s-card-count">03 / QUOTE</span><h3>Apply your actual pricing rules.</h3><p>Use product quantities, labour and waste rules to prepare a reviewable quote without manually re-entering the same information.</p><Link href="/roofing-quoting-software">Quoting tools ↗</Link></li>
              <li><span className="t3s-card-count">04 / FOLLOW UP</span><h3>Keep the next step visible.</h3><p>Track quote status and agree when your team should follow up, with automation where it genuinely saves admin.</p><Link href="/roofing-business-automation">Business automation ↗</Link></li>
            </ol>
            <p className="t3s-workflow-note">Illustrative workflow, not a claim that every tool is bundled or every integration is available. We scope each step around your existing systems.</p>
          </div>
        </section>
        <section className="t3s-section t3s-section-soft">
          <div className="t3s-shell t3s-proof-strip">
            <div>
              <span className="t3s-eyebrow t3s-eyebrow-ink">WORK YOU CAN EXPLORE</span>
              <h2>Look at real working examples.</h2>
              <p>We can show you a working roofing-site demonstration, a quick-estimate flow and a developed roofing software platform. These demonstrate capabilities, not guaranteed leads or quoting results for your business.</p>
            </div>
            <div className="t3s-proof-links">
              <TrackedLink href="https://www.t3labs.tech/demo/roofing-site/quick-estimate" eventName="demo_click" source="solutions-quick-estimate">Try the Quick Estimate ↗</TrackedLink>
              <a href="https://www.roofhub.co.nz/" target="_blank" rel="noopener noreferrer">See a roofing website example: RoofHub ↗</a>
              <Link href="/case-studies/quotecore">Read how we built QuoteCore+ ↗</Link>
              <TrackedLink href="https://quote-core.com/" eventName="demo_click" source="solutions-quotecore">Explore QuoteCore+ ↗</TrackedLink>
            </div>
          </div>
        </section>
        <section className="t3s-final">
          <div className="t3s-shell t3s-choice-layout">
            <div><span className="t3s-eyebrow">NOT SURE WHERE TO START?</span><h2>Show us where you lose enquiries or time.</h2><p>Tell us which jobs you want more of, how you quote today and what takes longer than it should. We will help you identify a practical first improvement.</p></div>
            <div className="t3s-final-actions"><TrackedLink className="t3s-button" href="/free-review" eventName="solutions_to_review_click" source="solutions-final">Get my free business review ↗</TrackedLink><Link className="t3s-text-link t3s-text-link-light" href="/contact">Other ways to contact us ↗</Link></div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
