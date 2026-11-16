import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { FEATURED_ROOFING_GUIDES } from "@/lib/roofing-content";
import { Header } from "@/components/t3-rebuild/Header";
import { MarketingFooter } from "@/components/t3-rebuild/MarketingFooter";
import "../t3-rebuild.css";
import "@/components/t3-rebuild/solutions-pages.css";

const BASE_URL = "https://www.t3labs.tech";
export const metadata: Metadata = {
  title: { absolute: "Roofing Business Guides: Better Leads, Quotes & Workflows | T3Labs" },
  description: "Practical roofing business guides on better website enquiries, quoting, estimating, follow-ups and software, grounded in tools and work by T3Labs.",
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    images: [{ url: "/og-roofing.png", width: 1200, height: 630, alt: "T3 Labs – better roofing leads, faster quotes, less admin" }],
    title: "Roofing Business Guides | T3Labs",
    description: "Practical articles for roofing contractors who want better enquiries, easier quoting and less admin.",
    url: `${BASE_URL}/blog`,
    siteName: "T3 Labs",
    type: "website",
  },
};

export default function BlogIndex() {
  const posts = getAllPosts();
  const featured = FEATURED_ROOFING_GUIDES.flatMap(slug => posts.filter(post => post.slug === slug));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "T3 Labs Roofing Business Guides",
    url: `${BASE_URL}/blog`,
    blogPost: featured.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      author: { "@type": "Person", name: post.author.name },
      url: `${BASE_URL}/blog/${post.slug}`,
    })),
  };
  const article = (post: (typeof posts)[number]) => (
    <article key={post.slug} className="t3s-card">
      <span className="t3s-card-count">{new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
      <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
      <p>{post.description}</p>
      <Link className="t3s-card-link" href={`/blog/${post.slug}`}>Read the guide ↗</Link>
    </article>
  );
  return (
    <div className="t3-rebuild">
      <Header />
      <main className="t3s-main" id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <section className="t3s-hero"><div className="t3s-shell">
          <nav className="t3s-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Guides</span></nav>
          <span className="t3s-eyebrow">ROOFING BUSINESS GUIDES</span>
          <h1>Better roofing leads. <em>Smarter quoting. Less admin.</em></h1>
          <p>Practical thinking on the questions roofing business owners ask: how to attract suitable work, give useful answers online, prepare quotes and keep jobs moving. Start with the roofing-focused guides below.</p>
          <div className="t3s-actions"><a href="#roofing-guides" className="t3s-button">Explore roofing guides ↓</a><Link href="/solutions" className="t3s-text-link t3s-text-link-light">Explore our solutions ↗</Link></div>
        </div></section>
        <section className="t3s-section" id="roofing-guides"><div className="t3s-shell">
          <span className="t3s-eyebrow t3s-eyebrow-ink">START HERE</span>
          <h2>Articles directly relevant to roofing businesses.</h2>
          <p className="t3s-section-intro">Real lessons from building trade software, alongside practical ideas for lead conversion and estimating. Examples are not claims of guaranteed business results.</p>
          <div className="t3s-cards t3s-cards-two">{featured.map(article)}</div>
        </div></section>
        <section className="t3s-final"><div className="t3s-shell t3s-choice-layout">
          <div><span className="t3s-eyebrow">A REAL BUSINESS PROBLEM?</span><h2>Show us what is costing you time or enquiries.</h2><p>We can review your current site, the way you quote or where work gets stuck, and suggest a sensible first step.</p></div>
          <Link className="t3s-button" href="/free-review">Get my free business review ↗</Link>
        </div></section>
      </main>
      <MarketingFooter />
    </div>
  );
}
