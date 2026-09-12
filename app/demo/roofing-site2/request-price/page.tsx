import Link from "next/link";
import { OldApexFooter } from "@/components/demo-sites/old-apex/OldApexFooter";
import { OldApexHeader } from "@/components/demo-sites/old-apex/OldApexHeader";
import { RequestPriceForm } from "@/components/demo-sites/old-apex/RequestPriceForm";

export default function RequestPricePage() {
  return (
    <div className="legacy-site">
      <OldApexHeader />
      <main className="enquiry-page">
        <div className="legacy-shell breadcrumb-row"><Link href="/demo/roofing-site2">Home</Link><span>›</span><Link href="/demo/roofing-site2/products/heritage-clay-pantile">Heritage Clay Pantile</Link><span>›</span><strong>Request pricing</strong></div>
        <section className="legacy-shell enquiry-heading">
          <div>
            <span className="form-eyebrow">ROOFING ENQUIRY</span>
            <h1>Request a price or quotation</h1>
            <p>Please complete the form below with as much information as possible. Once submitted, a member of our team will review your enquiry and contact you to discuss your requirements.</p>
          </div>
          <aside><strong>Prefer to speak to someone?</strong><p>Call our roofing team during office hours.</p><a href="tel:+448081570426">0808 157 0426</a><small>Mon-Sat, 7:30am-6:00pm</small></aside>
        </section>
        <div className="legacy-shell form-notice"><strong>Before you begin</strong><span>This form normally takes around 5-10 minutes to complete. Fields marked * are required. Prices are subject to review and may require a site visit.</span></div>
        <div className="legacy-shell"><RequestPriceForm /></div>
      </main>
      <OldApexFooter />
    </div>
  );
}
