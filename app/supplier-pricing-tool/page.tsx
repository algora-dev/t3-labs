'use client';

// Supplier Pricing Tool - combined demo entry point. One page, one question:
// what are you pricing? Roof -> Apex Roofing (roofing flow), Walls/cladding
// -> Vertex Cladding, Flooring -> Oakline Flooring. Direct per-supplier
// routes (e.g. /supplier-pricing-tool/burton-roofing) keep working for
// single-trade customer demos (Burton = real-customer example).
//
// T3 LABS PORT NOTE: this hub page diverges from the quotecore-plus source
// (dark #0a0b10 + #d7ff00 brand theme, T3 Labs site header). Re-apply this
// theming if the hub is ever re-ported from upstream. Per-supplier routes
// stay branded from their defs - only this entry page is T3-branded.

import Link from 'next/link';
import { FreeToolsAuthProvider } from '../_components/FreeToolsAuthProvider';

const OPTIONS = [
  {
    href: '/supplier-pricing-tool/apex-roofing',
    title: 'Roof',
    desc: 'Price a full roof - slate or tile, ridges, valleys, hips, barges, spouting and downpipes.',
    demo: 'Apex Roofing',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-8 9 8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10v10h14V10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20v-6h6v6" />
      </>
    ),
  },
  {
    href: '/supplier-pricing-tool/vertex-cladding',
    title: 'Walls / Cladding',
    desc: 'Price wall systems - weatherboard, fibre cement, cedar and trims, measured per wall.',
    demo: 'Vertex Cladding',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 21V8l8-5 8 5v13" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 16h16M8 8h8" />
      </>
    ),
  },
  {
    href: '/supplier-pricing-tool/oakline-flooring',
    title: 'Flooring',
    desc: 'Price floor systems - hybrid, LVT, laminate, underlay, skirting and floor fittings.',
    demo: 'Oakline Flooring',
    icon: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M9 6v12M15 6v12" />
      </>
    ),
  },
];

function Hub() {
  return (
    <main className="min-h-screen bg-[#0a0b10]">
      {/* Site header - logo links back to t3labs.tech */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0b10]/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-[min(1080px,calc(100%-40px))] items-center justify-between">
          <a href="https://www.t3labs.tech" aria-label="T3 Labs home" className="inline-flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/t3-labs-white.png" alt="T3 Labs" className="h-8 w-auto object-contain" />
          </a>
          <a href="https://www.t3labs.tech" className="text-sm font-semibold text-white/70 transition hover:text-[#d7ff00]">
            t3labs.tech <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </header>

      <div className="mx-auto w-[min(1080px,calc(100%-40px))] py-14 md:py-20">
        <div className="text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#d7ff00]">
            Interactive Demo
          </p>
          <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight text-white">
            What would you like to price?
          </h1>
          <p className="mt-3 text-base leading-7 text-white/60">
            Pick a trade to start - you can restart with another at any time.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {OPTIONS.map(o => (
            <Link
              key={o.href}
              href={o.href}
              className="group rounded-xl border border-white/10 bg-white/[0.03] px-6 py-8 text-center transition hover:border-[#d7ff00]/40 hover:bg-white/[0.05] hover:shadow-[0_0_24px_rgba(215,255,0,0.08)]"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#d7ff00] text-black transition group-hover:shadow-[0_0_16px_rgba(215,255,0,0.4)]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {o.icon}
                </svg>
              </span>
              <div className="mt-4 text-base font-bold text-white">{o.title}</div>
              <div className="mt-1.5 text-xs leading-relaxed text-white/55">{o.desc}</div>
              <div className="mt-3 text-[11px] font-medium uppercase tracking-wide text-[#d7ff00]/70">{o.demo}</div>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-white/40">
          Each trade runs the full flow: measure from a plan or site dimensions, pick products, get priced totals with trade discounts. Demo only - not a real company.
        </p>
      </div>
    </main>
  );
}

export default function Page() {
  return (
    <FreeToolsAuthProvider>
      <Hub />
    </FreeToolsAuthProvider>
  );
}
