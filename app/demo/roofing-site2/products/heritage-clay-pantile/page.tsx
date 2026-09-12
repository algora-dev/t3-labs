import Link from "next/link";
import { OldApexFooter } from "@/components/demo-sites/old-apex/OldApexFooter";
import { OldApexHeader } from "@/components/demo-sites/old-apex/OldApexHeader";

export default function HeritageClayPantilePage() {
  return (
    <div className="legacy-site">
      <OldApexHeader />
      <main className="product-page">
        <div className="legacy-shell breadcrumb-row">
          <Link href="/demo/roofing-site2">Home</Link><span>›</span><a href="#">Products & Materials</a><span>›</span><a href="#">Clay Roof Tiles</a><span>›</span><strong>Heritage Clay Pantile</strong>
        </div>

        <div className="legacy-shell product-layout">
          <aside className="product-side-nav">
            <div className="side-nav-title">Roofing Products</div>
            <a href="#">Concrete tiles</a>
            <a href="#">Clay roof tiles</a>
            <a href="#" className="active">Heritage Clay Pantiles</a>
            <a href="#">Natural slate</a>
            <a href="#">Fibre cement slate</a>
            <a href="#">Roofing battens</a>
            <a href="#">Membranes</a>
            <a href="#">Ridge & hip systems</a>
            <a href="#">Valleys</a>
            <a href="#">Leadwork</a>
            <a href="#">Ventilation</a>
            <a href="#">Guttering</a>
            <div className="side-help-box"><strong>Need help?</strong><p>Call our technical team for product advice and availability.</p><a href="tel:+448081570426">0808 157 0426</a></div>
          </aside>

          <section className="product-main">
            <div className="product-top-grid">
              <div className="product-image-panel">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Terracotta_clay_tile_%28Unsplash%29.jpg/960px-Terracotta_clay_tile_%28Unsplash%29.jpg"
                  alt="Terracotta clay roof tiles"
                />
                <div className="thumbnail-row"><button>Image 1</button><button>Colours</button><button>Roof example</button></div>
              </div>

              <div className="product-summary">
                <span className="product-category">CLAY ROOF TILES</span>
                <h1>Apex Heritage Clay Pantile</h1>
                <div className="product-code">Product code: APX-CLAY-HP15</div>
                <p className="product-intro">A traditional clay pantile profile suitable for refurbishment and new-build pitched roofing where a classic appearance is required.</p>

                <div className="product-status-row"><span className="status-dot" /> Available to order <span className="separator">|</span> Lead time varies by quantity</div>

                <div className="price-request-box">
                  <small>Pricing</small>
                  <strong>Call for current price</strong>
                  <p>Pricing depends on quantity, roof requirements, accessories and delivery location.</p>
                  <a href="tel:+448081570426" className="price-phone">0808 157 0426</a>
                  <Link href="/demo/roofing-site2/request-price" className="legacy-btn legacy-btn-primary full-width">Enquire for a Price</Link>
                </div>

                <div className="product-actions-grid">
                  <button type="button">Request a sample</button>
                  <button type="button">Download data sheet</button>
                  <button type="button">Check availability</button>
                  <button type="button">Ask technical support</button>
                </div>
              </div>
            </div>

            <div className="product-tabs"><button className="active">Product details</button><button>Technical data</button><button>Colours</button><button>Accessories</button><button>Downloads</button></div>

            <div className="product-content-grid">
              <article>
                <h2>Product overview</h2>
                <p>The Apex Heritage Clay Pantile combines a traditional flowing roof profile with modern interlocking performance. It is intended for pitched roofing applications where the appearance of natural fired clay is preferred.</p>
                <p>The tile is available in several colour options and can be combined with matching ridge, verge and ventilation accessories. Suitability will depend on roof pitch, exposure, fixing specification and project requirements.</p>
                <h2>Key features</h2>
                <ul className="technical-bullets"><li>Natural fired clay finish</li><li>Traditional pantile appearance</li><li>Interlocking side profile</li><li>Suitable for refurbishment and new build</li><li>Matching ridge and verge accessories available</li><li>Multiple colour finishes</li></ul>
              </article>
              <aside className="technical-card">
                <h3>Technical information</h3>
                <dl><div><dt>Material</dt><dd>Clay</dd></div><div><dt>Profile</dt><dd>Interlocking pantile</dd></div><div><dt>Minimum pitch</dt><dd>From 15°*</dd></div><div><dt>Approx. coverage</dt><dd>14-15 tiles/m²*</dd></div><div><dt>Finish</dt><dd>Natural / weathered options</dd></div><div><dt>Application</dt><dd>Pitched roofing</dd></div></dl>
                <small>*Indicative product information for this fictional demo. Final specification must be confirmed for each project.</small>
              </aside>
            </div>

            <div className="product-bottom-cta">
              <div><strong>Need a price for your project?</strong><span>Tell us about the roof and our team will come back to you.</span></div>
              <Link href="/demo/roofing-site2/request-price" className="legacy-btn legacy-btn-primary">Request Pricing</Link>
            </div>
          </section>
        </div>
      </main>
      <OldApexFooter />
    </div>
  );
}
