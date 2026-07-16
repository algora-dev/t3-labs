import Link from "next/link";
import { proposalLegalLinks, websitePackageTerms } from "@/lib/website-package-terms";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#fbfcff] px-5 py-8 text-[#0a0b10]">
      <div className="mx-auto grid w-full max-w-4xl gap-6">
        <Link href="/" className="text-xs font-black uppercase tracking-[0.16em] text-[#758300]">T3 Labs</Link>
        <section className="rounded-xl border border-[#e7e9ef] bg-white p-6 shadow-[0_10px_32px_rgba(24,31,51,0.05)] sm:p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#758300]">T3 Labs</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">{title}</h1>
          <div className="mt-6 grid gap-4 text-sm leading-7 text-[#424657]">{children}</div>
        </section>
        <footer className="grid gap-4 text-xs text-[#606575]">
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Legal footer">
            {proposalLegalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-[#0a0b10]">{link.label}</Link>
            ))}
          </nav>
          <p>{websitePackageTerms.tradingName} is a trading name of {websitePackageTerms.legalEntityName}, registered in {websitePackageTerms.registeredJurisdiction}.</p>
          <p>Last updated: {websitePackageTerms.lastUpdated}.</p>
        </footer>
      </div>
    </main>
  );
}
