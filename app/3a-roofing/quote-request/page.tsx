import { Faqs, premiumMetadata, QuotePageIntro, QuoteSupport } from "@/components/premium-contractor/premium-sections";
import { QuoteForm } from "@/components/premium-contractor/quote-form";
import styles from "@/components/premium-contractor/premium-contractor.module.css";
import { threeARoofingPremiumSite } from "@/config/3a-roofing-premium-site";

const path = `${threeARoofingPremiumSite.basePath}/quote-request`;

export const metadata = premiumMetadata(
  threeARoofingPremiumSite.seo.quoteTitle,
  threeARoofingPremiumSite.seo.quoteDescription,
  path,
  threeARoofingPremiumSite.hero.image,
);

export default function ThreeARoofingQuoteRequestPage() {
  return <main>
    <QuotePageIntro site={threeARoofingPremiumSite} />
    <section className={styles.quotePageBody}>
      <div className={`${styles.container} ${styles.quotePageGrid}`}>
        <QuoteForm site={threeARoofingPremiumSite} />
        <QuoteSupport site={threeARoofingPremiumSite} />
      </div>
    </section>
    <Faqs title="Quotation questions" items={threeARoofingPremiumSite.quoteFaqs} />
  </main>;
}
