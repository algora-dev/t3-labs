import type { Metadata } from 'next';
import Image from 'next/image';
import { SmartAssistantLauncher } from '../../components/assistant/SmartAssistantLauncher';

export const metadata: Metadata = {
  title: 'Apex Roofing | Roof Replacement, Repairs & Insurance Work | Interactive Demo',
  description:
    'Apex Roofing - quality roof replacement, repairs, gutters and insurance work. Interactive demo website built by T3 Labs.',
  robots: { index: false, follow: false },
};

const SERVICES = [
  {
    name: 'Roof Replacement',
    text: 'Complete tear-off and re-roofing in concrete tile, clay tile, or natural Spanish slate. Most homes finished in 2-4 days.',
  },
  {
    name: 'Roof Repairs',
    text: 'Leak detection, tile and slate replacement, flashing repairs, and storm damage repair with a 2-year workmanship warranty.',
  },
  {
    name: 'Gutters & Downpipes',
    text: 'Seamless gutter replacement, downpipes, and gutter guards - standalone or as part of your re-roof.',
  },
  {
    name: 'Insurance Roofing Work',
    text: 'Documented damage assessments, adjuster meetings, and full claim support with all major insurers.',
  },
  {
    name: 'Emergency Callout',
    text: '24/7 emergency response for active leaks and storm damage. On site within 4 hours, every day of the year.',
  },
  {
    name: 'Roof Inspections',
    text: 'Free full roof inspection with a written photo report - ideal for home purchase or maintenance planning.',
  },
];

const GUARANTEES = [
  '10-year workmanship warranty on all full roof replacements',
  '2-year workmanship warranty on repairs',
  'Manufacturer material warranties of 30-50 years depending on product line',
  'Written warranty documents issued with every completed job',
];

export default function ApexRoofingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Demo label */}
      <div className="bg-[#1E293B] text-white text-center text-xs py-2 px-4">
        <span className="font-semibold text-[#d7ff00]">Interactive Demo</span>
        <span className="text-slate-300"> by T3 Labs - Apex Roofing is a fictional company showcasing a Smart Assistant</span>
      </div>

      {/* Header */}
      <header className="bg-white/95 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/apex-roofing/apex-roofing.png" alt="Apex Roofing logo" width={44} height={44} className="rounded-lg" />
            <div>
              <p className="font-bold text-lg leading-tight text-[#1769E0]">Apex Roofing</p>
              <p className="text-xs text-slate-500">Quality roofing, done right the first time</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-[#1769E0]">Services</a>
            <a href="#insurance" className="hover:text-[#1769E0]">Insurance</a>
            <a href="#guarantees" className="hover:text-[#1769E0]">Guarantees</a>
            <a href="#pricing-tool" className="hover:text-[#1769E0]">Instant Pricing</a>
            <a href="#contact" className="hover:text-[#1769E0]">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#1E293B] to-[#1769E0] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Your roof, handled by people who care
          </h1>
          <p className="mt-4 text-base md:text-lg text-slate-100 max-w-2xl mx-auto">
            Full roof replacements, repairs, gutters, and insurance work across the Greater Portland
            area. Free inspections, written quotes within 48 hours, and warranties that mean something.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#contact"
              className="rounded-full bg-white text-[#1769E0] font-semibold px-7 py-3 text-sm hover:bg-slate-100 transition"
            >
              Book a free inspection
            </a>
            <a
              href="#pricing-tool"
              className="rounded-full border border-white/60 text-white font-semibold px-7 py-3 text-sm hover:bg-white/10 transition"
            >
              Get instant pricing
            </a>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
          <div><p className="text-2xl font-bold text-[#1769E0]">20+</p><p className="text-slate-500">Years roofing</p></div>
          <div><p className="text-2xl font-bold text-[#1769E0]">2,400+</p><p className="text-slate-500">Roofs completed</p></div>
          <div><p className="text-2xl font-bold text-[#1769E0]">10 yr</p><p className="text-slate-500">Workmanship warranty</p></div>
          <div><p className="text-2xl font-bold text-[#1769E0]">24/7</p><p className="text-slate-500">Emergency callout</p></div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-20">
        <h2 className="text-2xl md:text-3xl font-bold">Our Services</h2>
        <p className="text-slate-500 mt-2">Everything your roof needs, from a single slipped tile to a full replacement.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => (
            <div key={s.name} className="rounded-xl border border-slate-200 p-5 hover:border-[#1769E0]/50 hover:shadow-md transition">
              <h3 className="font-semibold text-[#1769E0]">{s.name}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Insurance */}
      <section id="insurance" className="bg-slate-50 border-y border-slate-200 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-bold">Insurance Roofing Work</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>Storm or hail damage? We handle the whole insurance process with you:</p>
              <ul className="space-y-2 text-sm">
                <li>- Documented damage assessment with photos</li>
                <li>- We meet your insurance adjuster on site</li>
                <li>- Support with all major insurers</li>
                <li>- Full claim guidance from inspection to final sign-off</li>
              </ul>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-6">
              <h3 className="font-semibold">Our process</h3>
              <ol className="mt-3 space-y-2 text-sm text-slate-600">
                <li>1. Free consultation and roof inspection</li>
                <li>2. Written itemized quote within 48 hours</li>
                <li>3. Material selection and scheduling</li>
                <li>4. Installation (most replacements 2-4 days)</li>
                <li>5. Final inspection, cleanup, written warranty</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section id="guarantees" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-20">
        <h2 className="text-2xl md:text-3xl font-bold">Guarantees &amp; Warranties</h2>
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          {GUARANTEES.map((g) => (
            <div key={g} className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-[#1769E0] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-slate-700">{g}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing tool */}
      <section id="pricing-tool" className="bg-[#1E293B] text-white scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Instant Supply Pricing Tool</h2>
          <p className="mt-3 text-slate-300 max-w-2xl mx-auto">
            Measure your roof from a plan or image and price Apex roofing materials live - our
            interactive supply pricing tool does the takeoff for you.
          </p>
          <a
            href="https://app.quote-core.com/supplier-pricing-tool/apex-roofing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 rounded-full bg-[#1769E0] text-white font-semibold px-8 py-3 text-sm hover:bg-[#0f55b8] transition"
          >
            Open the pricing tool
          </a>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-20">
        <h2 className="text-2xl md:text-3xl font-bold">Contact Us</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-5">
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Phone</h3>
            <p className="mt-2 font-semibold text-[#1769E0]">(503) 555-0142</p>
            <p className="text-xs text-slate-500 mt-1">24/7 emergency line</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Email</h3>
            <p className="mt-2 font-semibold text-[#1769E0]">hello@apexroofing-demo.com</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Hours</h3>
            <p className="mt-2 text-sm text-slate-600">Mon-Fri 7:00 AM - 6:00 PM</p>
            <p className="text-sm text-slate-600">Sat 8:00 AM - 2:00 PM - Sun emergency only</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-slate-500">
          Serving Portland, Beaverton, Hillsboro, Tigard, Lake Oswego, Gresham, Milwaukie, and Vancouver WA.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E293B] text-slate-400 text-xs">
        <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>Apex Roofing (fictional) - interactive demo by T3 Labs</p>
          <p>Smart Assistant trained on business knowledge, products &amp; pricing</p>
        </div>
      </footer>

      {/* Smart Assistant */}
      <SmartAssistantLauncher />
    </div>
  );
}
