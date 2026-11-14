import Link from "next/link";

export function MarketingFooter() {
  return (
    <footer className="t3s-footer">
      <div className="t3s-shell t3s-footer-grid">
        <div>
          <Link href="/" className="t3s-footer-brand">T3Labs</Link>
          <p>Practical websites, software and automation for roofing and construction businesses.</p>
        </div>
        <nav aria-label="Solutions and proof">
          <strong>Explore</strong>
          <Link href="/solutions">All roofing solutions</Link>
          <Link href="/custom-roofing-software">Custom roofing software</Link>
          <Link href="/case-studies/quotecore">QuoteCore+ case study</Link>
          <Link href="/blog">Articles & guides</Link>
        </nav>
        <nav aria-label="Company and contact">
          <strong>Get in touch</strong>
          <Link href="/#who-we-are">Who we are</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/free-review">Free business review</Link>
        </nav>
      </div>
    </footer>
  );
}
