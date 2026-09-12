import Link from "next/link";

export function OldApexFooter() {
  return (
    <footer className="legacy-footer">
      <div className="legacy-shell footer-grid">
        <div>
          <img
            className="footer-logo"
            src="/assets/demo-act-roofing/ApexLogoWhite---f166f5cd-ea1d-4d9c-86d4-f2e3dc127812.png"
            alt="Apex Roofing"
          />
          <p>Roofing services, repairs and materials across Leeds and West Yorkshire.</p>
        </div>
        <div><strong>Services</strong><a href="#">New roofs</a><a href="#">Repairs</a><a href="#">Flat roofing</a></div>
        <div><strong>Products</strong><Link href="/demo/roofing-site2/products/heritage-clay-pantile">Clay tiles</Link><a href="#">Concrete tiles</a><a href="#">Slate</a></div>
        <div><strong>Contact</strong><a href="tel:+448081570426">0808 157 0426</a><Link href="/demo/roofing-site2/request-price">Request a quote</Link></div>
      </div>
    </footer>
  );
}
