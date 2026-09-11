import Link from 'next/link';
import type { ApexPage } from './apex-page-content';

/**
 * Credible, modest content-page renderer for the Apex Roofing demo (V4 brief
 * section 19). Follows the act-roofing demo styling conventions.
 */

export function ApexContentPage({ page }: { page: ApexPage }) {
  const groupLabel = page.group === 'services' ? 'Services' : page.group === 'information' ? 'Information' : 'Contact';

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div className="bg-[#1E293B] py-2 text-center text-xs text-slate-300">
        <span className="font-semibold text-[#d7ff00]">Interactive Demo</span> by T3 Labs - Apex Roofing is fictional
      </div>

      <header className="border-b border-slate-200 bg-white/95">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/demo/roofing-site" className="text-sm text-slate-500 transition hover:text-slate-900">
            &larr; Back to Apex Roofing home
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wide text-[#1769E0]">{groupLabel}</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <section className="py-10">
          <h1 className="text-2xl font-bold md:text-3xl">{page.title}</h1>
          <p className="mt-3 leading-relaxed text-slate-600">{page.intro}</p>
        </section>

        <div className="space-y-8">
          {page.sections.map((section, index) => (
            <section key={index}>
              {section.heading && <h2 className="text-lg font-semibold text-[#1769E0]">{section.heading}</h2>}
              {section.body?.map((paragraph, pIndex) => (
                <p key={pIndex} className="mt-2 leading-relaxed text-slate-600">{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="mt-2 space-y-1.5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-slate-600">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#1769E0]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl bg-gradient-to-b from-[#1E293B] to-[#1769E0] px-6 py-8 text-center text-white">
          <p className="text-lg font-bold">Want a price for your roof?</p>
          <p className="mt-2 text-sm text-slate-100">The Smart Assistant can answer questions, give an indicative estimate or prepare your enquiry.</p>
          <button
            type="button"
            data-open-smart-assistant
            className="mt-5 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#1769E0] transition hover:bg-slate-100"
          >
            Ask Apex
          </button>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-6 text-center text-xs text-slate-500">
        Apex Roofing (fictional) - interactive demo by T3 Labs
      </footer>
    </div>
  );
}
