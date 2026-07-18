import { Faqs, premiumMetadata, QuotePageIntro, QuoteSupport } from "@/components/premium-contractor/premium-sections";
import { QuoteForm } from "@/components/premium-contractor/quote-form";
import styles from "@/components/premium-contractor/premium-contractor.module.css";
import { premiumContractorSite } from "@/config/premium-contractor-site";

export const metadata = premiumMetadata(premiumContractorSite.seo.quoteTitle, premiumContractorSite.seo.quoteDescription, "/contractor-template-premium/quote-request");

export default function PremiumContractorQuoteRequestPage() {
  return <main>
    <QuotePageIntro site={premiumContractorSite} />
    <section className={styles.quotePageBody}>
      <div className={`${styles.container} ${styles.quotePageGrid}`}>
        <QuoteForm site={premiumContractorSite} />
        <QuoteSupport site={premiumContractorSite} />
      </div>
    </section>
    <Faqs title="Quotation questions" items={premiumContractorSite.quoteFaqs} />
  </main>;
}
