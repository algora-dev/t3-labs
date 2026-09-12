import Link from "next/link";
import { OldApexFooter } from "@/components/demo-sites/old-apex/OldApexFooter";
import { OldApexHeader } from "@/components/demo-sites/old-apex/OldApexHeader";

export default function OldApexHomePage() {
  return (
    <div className="legacy-site">
      <OldApexHeader />
      <main>
        <section className="legacy-hero">
          <img
            className="legacy-hero-image"
            src="/assets/demo-act-roofing/apex-hero.webp"
            alt="Completed residential roof"
          />
          <div className="legacy-hero-overlay" />
          <div className="legacy-shell hero-layout">
            <div className="hero-copy-panel">
              <div className="hero-badges">
                <span>Local roofing specialists</span>
                <span>Fully insured</span>
                <span>10-year guarantee</span>
              </div>
              <h1>Roofing services, repairs & materials across Leeds</h1>
              <p>
                Apex Roofing provides domestic and commercial roofing services, roof repairs,
                re-roofing, flat roofing, leadwork and a wide range of pitched roofing materials.
              </p>
              <div className="hero-button-row">
                <Link href="/demo/roofing-site2/request-price" className="legacy-btn legacy-btn-primary">Request a Quote</Link>
                <a href="tel:+448081570426" className="legacy-btn legacy-btn-secondary">Call 0808 157 0426</a>
              </div>
              <div className="hero-small-links">
                <a href="#">Emergency roofing</a>
                <a href="#">Insurance repairs</a>
                <a href="#">Technical downloads</a>
                <a href="#">Areas we cover</a>
              </div>
            </div>

            <aside className="hero-side-card">
              <div className="side-card-title">How can we help?</div>
              <ul className="busy-quick-list">
                <li><a href="#">I need a new roof <span>›</span></a></li>
                <li><a href="#">I have a roof leak <span>›</span></a></li>
                <li><a href="#">I need roofing materials <span>›</span></a></li>
                <li><a href="#">I need technical information <span>›</span></a></li>
                <li><a href="#">I need a roof inspection <span>›</span></a></li>
                <li><a href="#">I need a price <span>›</span></a></li>
              </ul>
              <div className="side-card-contact">
                <small>Can’t find what you need?</small>
                <strong>Speak to our roofing team</strong>
                <a href="tel:+448081570426">0808 157 0426</a>
              </div>
            </aside>
          </div>
        </section>

        <section className="busy-home-strip">
          <div className="legacy-shell busy-strip-grid">
            <div><strong>500+</strong><span>Roofs completed</span></div>
            <div><strong>4.9/5</strong><span>Customer rating</span></div>
            <div><strong>24hr</strong><span>Emergency response</span></div>
            <div><strong>10 years</strong><span>Workmanship guarantee</span></div>
            <div className="strip-cta"><span>Looking for a product?</span><button type="button">Browse our full range</button></div>
          </div>
        </section>

        <section className="legacy-shell busy-card-row">
          <article><span className="card-kicker">Popular</span><h2>Roof replacements</h2><p>Complete re-roofing and replacement systems for homes across Leeds.</p><a href="#">View roofing services →</a></article>
          <article><span className="card-kicker">Products</span><h2>Tiles, slate & accessories</h2><p>Browse roof coverings, membranes, ventilation, lead and roofline products.</p><button type="button">Open product catalogue →</button></article>
          <article><span className="card-kicker">Advice</span><h2>Technical centre</h2><p>Guides, downloads, installation information and answers to common questions.</p><a href="#">Visit technical centre →</a></article>
          <aside className="mini-news"><strong>Latest updates</strong><a href="#">Choosing tile colours for older homes</a><a href="#">Changes to roof ventilation guidance</a><a href="#">Storm damage - what to check first</a></aside>
        </section>
      </main>
      <OldApexFooter />
    </div>
  );
}
