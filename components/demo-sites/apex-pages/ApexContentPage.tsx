import Image from 'next/image';
import Link from 'next/link';
import { actRoofingSite } from '../act-roofing/site-config';
import type { ApexPage } from './apex-page-content';

export function ApexContentPage({ page }: { page: ApexPage }) {
  const groupLabel = page.group === 'services' ? 'Services' : page.group === 'information' ? 'Roofing Guides' : 'Contact';

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#101828]">
      <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between gap-5 px-4 sm:px-6">
          <Link href="/demo/roofing-site" className="flex items-center gap-3" aria-label="Apex Roofing home">
            <span className="relative block h-11 w-11 shrink-0">
              <Image src={actRoofingSite.brand.logoMark.src} alt={actRoofingSite.brand.logoMark.alt} fill sizes="44px" className="object-contain" />
            </span>
            <span>
              <span className="block text-sm font-bold">Apex Roofing</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1769E0]">{groupLabel}</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold text-[#475467] sm:flex">
            <Link href="/demo/roofing-site/services/roof-replacement" className="hover:text-[#1769E0]">Roof Replacement</Link>
            <Link href="/demo/roofing-site/information/roofing-materials" className="hover:text-[#1769E0]">Materials</Link>
            <Link href="/demo/roofing-site/information/roof-pitch-guide" className="hover:text-[#1769E0]">Pitch Guide</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="border-b border-[#E5E7EB] bg-white">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1769E0]">{groupLabel}</p>
            <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-[-0.025em] sm:text-5xl">{page.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#475467] sm:text-lg">{page.intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" data-open-smart-assistant className="rounded-full bg-[#1769E0] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1257BC]">
                Ask Apex about this page
              </button>
              <Link href="/demo/roofing-site" className="rounded-full border border-[#D0D5DD] bg-white px-5 py-2.5 text-sm font-semibold text-[#344054] hover:border-[#1769E0] hover:text-[#1769E0]">
                Back to home
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-4xl gap-6 px-4 py-10 sm:px-6 sm:py-14">
          {page.sections.map((section, index) => (
            <article key={index} className="rounded-[18px] border border-[#E5E7EB] bg-white p-6 shadow-[0_2px_10px_rgba(16,24,40,0.04)] sm:p-8">
              {section.heading && <h2 className="text-xl font-bold tracking-[-0.01em] text-[#101828]">{section.heading}</h2>}
              {section.body?.map((paragraph, pIndex) => <p key={pIndex} className="mt-3 leading-8 text-[#475467]">{paragraph}</p>)}
              {section.bullets && (
                <ul className="mt-4 grid gap-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3 text-sm leading-7 text-[#475467]">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1769E0]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </section>

        <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
          <div className="rounded-[22px] bg-[#101828] px-6 py-8 text-white sm:px-9 sm:py-10">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8AB4F8]">Smart website</p>
            <h2 className="mt-3 text-2xl font-bold">Want an answer or a ballpark price without searching?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">Ask the Smart Assistant about this page, your roof, materials, pricing or the next step. It can keep this page open while you continue the conversation.</p>
            <button type="button" data-open-smart-assistant className="mt-6 rounded-full bg-[#1769E0] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1257BC]">Ask Apex</button>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E5E7EB] bg-white py-7 text-center text-xs text-[#667085]">
        Apex Roofing is a fictional interactive demo by T3 Labs.
      </footer>
    </div>
  );
}
