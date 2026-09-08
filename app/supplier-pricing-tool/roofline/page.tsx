'use client';

// Roofline Canterbury brand entry: step 0 = trade choice (roofing vs
// cladding/walls). Clicking a tile pushes straight into step 1 of that
// flow (roofline-roofing / roofline-cladding routes). Static route wins
// over the [supplierSlug] dynamic route, so /roofline renders this page
// instead of falling back to the default supplier.
//
// T3 LABS PORT NOTE: this page is T3-only (upstream has no brand-level
// entry for Roofline). Re-apply if the tool is ever re-ported wholesale.

import Link from 'next/link';

const OPTIONS = [
  {
    href: '/supplier-pricing-tool/roofline-roofing',
    title: 'Roofing',
    desc: 'Measure a roof - Roofdeck or Corrugate coverings, ridge, hip, valley and barge flashings, underlays, screws, fascia, guttering and downpipes.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-8 9 8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v10h14V10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20v-6h6v6" />
      </>
    ),
  },
  {
    href: '/supplier-pricing-tool/roofline-cladding',
    title: 'Walls / Cladding',
    desc: 'Measure walls - Weatherboard cladding with corners, joiners, sills, flashings and trims, measured per wall.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V8l8-5 8 5v13" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 16h16M8 8h8" />
      </>
    ),
  },
];

export default function RooflineEntryPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f8]">
      {/* Roofline brand header - black, logo in white box */}
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#111111]">
        <div className="mx-auto flex h-16 w-[min(1080px,calc(100%-40px))] items-center">
          <div className="inline-flex items-center gap-3">
            <span className="flex h-10 w-20 items-center justify-center rounded-lg bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/supplier-logos/roofline-canterbury.png" alt="Roofline Canterbury" className="max-h-8 w-auto object-contain" />
            </span>
            <span className="text-xs font-medium text-white/60">
              Roofing &amp; Cladding Manufacturers - Christchurch
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto w-[min(1080px,calc(100%-40px))] py-14 md:py-20">
        <div className="text-center">
          <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight text-[#111111]">
            What are you measuring?
          </h1>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {OPTIONS.map(o => (
            <Link
              key={o.href}
              href={o.href}
              className="group rounded-xl border border-[#E3A5AD] bg-white px-6 py-8 text-center transition hover:border-[#C8102E] hover:shadow-[0_0_24px_rgba(200,16,46,0.12)]"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C8102E] text-white transition group-hover:shadow-[0_0_16px_rgba(200,16,46,0.4)]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {o.icon}
                </svg>
              </span>
              <div className="mt-4 text-base font-bold text-[#111111]">{o.title}</div>
              <div className="mt-1.5 text-xs leading-relaxed text-slate-500">{o.desc}</div>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          Each flow runs end to end: measure from a plan or site dimensions, pick products, get priced totals in NZD.
        </p>
      </div>
    </main>
  );
}
