import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/t3-rebuild/Header";
import { MarketingFooter } from "@/components/t3-rebuild/MarketingFooter";
import { BOOK_CALL_URL } from "@/components/t3-rebuild/review-topics";
import "../t3-rebuild.css";
import "@/components/t3-rebuild/solutions-pages.css";

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  title: { absolute: "Contact T3Labs | Roofing Websites & Software" },
  description: "Contact T3Labs about roofing websites, estimating tools, automation or custom software. Send a free business review request, book a call or email the team.",
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: { title: "Contact T3Labs", description: "Talk with T3Labs about websites, roofing software and practical business technology.", url: `${BASE_URL}/contact`, type: "website" },
};

export default function ContactPage() {
  return (
    <div className="t3-rebuild">
      <Header />
      <main className="t3s-main" id="main-content">
        <section className="t3s-hero"><div className="t3s-shell">
          <nav className="t3s-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Contact</span></nav>
          <span className="t3s-eyebrow">GET IN TOUCH</span>
          <h1>Tell us what you <em>want to improve.</em></h1>
          <p>Need help with a roofing website, quoting workflow, automation or a custom app? Tell us what you&apos;re trying to solve and we&apos;ll help you work out a sensible next step.</p>
        </div></section>
        <section className="t3s-section"><div className="t3s-shell">
          <div className="t3s-cards t3s-contact-cards">
            <article className="t3s-card"><span className="t3s-card-count">01 / WRITTEN ENQUIRY</span><h2>Send us a quick enquiry</h2><p>Choose what you want to improve and give us a little context. A real person will reply within 48 hours.</p><Link className="t3s-card-link" href="/free-review">Start a free business review ↗</Link></article>
            <article className="t3s-card"><span className="t3s-card-count">02 / SPEAK TO US</span><h2>Book a 20-minute call</h2><p>Talk directly about your current workflow, your goals or which existing solution might fit.</p><a className="t3s-card-link" href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer">Book a call ↗</a></article>
            <article className="t3s-card"><span className="t3s-card-count">03 / EMAIL</span><h2>Email the team</h2><p>Already know what you want to send us? Describe your project or ask a question.</p><a className="t3s-card-link" href="mailto:insights@t3labs.tech">insights@t3labs.tech ↗</a></article>
          </div>
        </div></section>
        <section className="t3s-choice-band"><div className="t3s-shell t3s-choice-layout"><div><span className="t3s-eyebrow">NOT SURE WHAT YOU NEED?</span><h2>Explore the options first.</h2><p>Our roofing solutions cover websites, SEO, estimators, quoting, smart assistants, automation and custom software.</p></div><Link className="t3s-button" href="/solutions">Browse roofing solutions ↗</Link></div></section>
      </main>
      <MarketingFooter />
    </div>
  );
}
