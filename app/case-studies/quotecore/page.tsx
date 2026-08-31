import type { Metadata } from "next";
import Link from "next/link";
import ServiceIntakeCTA from "@/components/ai-services/service-intake-cta";
import IntakeModalMount from "@/components/intake/intake-modal-mount";

const BASE_URL = "https://www.t3labs.tech";

/**
 * Asset 3 — T3 Labs QuoteCore+ case study.
 * Two-brand custom software strategy (30 Aug 2026), brief §Asset 3.
 * Product-truth gate: every capability listed below is cross-checked against
 * the product repo's CURRENT_TRUTH.md (sanitised) — live/implemented only.
 * No invented metrics, timelines or outcomes.
 */
export const metadata: Metadata = {
  title: "How We Built QuoteCore+: Roofing Workflow to SaaS Platform | T3 Labs",
  description:
    "Case study: how T3 Labs turned a fragmented roofing estimating workflow into QuoteCore+ — digital takeoff, AI-assisted scanning, reusable pricing components, quoting, ordering, invoicing and supplier workflows.",
  alternates: { canonical: `${BASE_URL}/case-studies/quotecore` },
  openGraph: {
    title: "How We Built QuoteCore+: Roofing Workflow to SaaS Platform | T3 Labs",
    description:
      "How T3 Labs turned a fragmented roofing estimating workflow into a working SaaS platform.",
    url: `${BASE_URL}/case-studies/quotecore`,
    siteName: "T3 Labs",
    type: "website",
  },
};

const builtCapabilities: { title: string; body: string }[] = [
  {
    title: "Digital plan takeoff",
    body: "Upload plans or site drawings, calibrate the scale, and measure directly on the plan — multiple pages, named roof areas, area and lineal measurements, and roof elements like ridges, hips, valleys and barges.",
  },
  {
    title: "AI Scan Assist",
    body: "AI reads an uploaded roof plan and proposes the roof geometry — areas and lines — for the user to review, adjust and accept. The person measuring is always the final verifier; AI accelerates, it doesn't decide.",
  },
  {
    title: "Reusable Smart Components",
    body: "The heart of the platform: a component packages a measurement together with its materials, labour, waste rules, coverage, pricing and presentation — so the trade knowledge is captured once and reused on every future job.",
  },
  {
    title: "Consistent pricing logic",
    body: "Pitch factors, percentage and fixed waste, pack sizes and coverage, cost versus selling price, margin behaviour — the calculation rules contractors use, applied the same way every time, with results that remain explainable after the fact.",
  },
  {
    title: "Quoting through to invoicing",
    body: "Accepted job information flows into customer quotes, material orders, labour sheets and invoices — one connected chain instead of the same data being re-entered in four different places.",
  },
  {
    title: "Supplier workflows",
    body: "Suppliers publish product catalogues and component libraries that contractors discover and calculate with directly, creating enquiries with the pricing context preserved.",
  },
];

export default function Page() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "QuoteCore+",
        item: `${BASE_URL}/case-studies/quotecore`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <IntakeModalMount />
      <main className="min-h-screen bg-[#0a0b10] text-white">
        {/* Hero */}
        <section className="border-b border-white/10">
          <div className="mx-auto w-[min(880px,calc(100%-40px))] py-20 sm:py-24">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#d7ff00]">
              Case Study · Custom Software
            </p>
            <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-tight tracking-tight">
              How We Built QuoteCore+: Turning a Roofing Workflow Into a SaaS Platform
            </h1>
            <p className="mt-5 max-w-[720px] text-lg leading-9 text-white/75">
              QuoteCore+ is T3 Labs' own product — a roofing estimating and
              commercial workflow platform, live and in production. This is the
              story of how a fragmented trade process became structured software.
            </p>
          </div>
        </section>

        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
          {/* The original workflow problem */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              The original workflow problem
            </h2>
            <p className="mt-4 text-base leading-8 text-white/75">
              Roofing estimating pulls together measurements, pitch calculations,
              material quantities, reusable pricing, labour, waste, quoting,
              purchase ordering, invoicing and supplier pricing. In most
              businesses, that work is spread across plans, calculators,
              spreadsheets, supplier catalogues, handwritten rules, previous
              quotes and individual experience.
            </p>
            <p className="mt-4 text-base leading-8 text-white/75">
              The result is duplicated work, inconsistent pricing, knowledge that
              lives in one person's head, and a real risk of omissions — the same
              job measured twice by two people produces two different quotes.
            </p>
          </section>

          {/* The product challenge */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              The product challenge
            </h2>
            <p className="mt-4 text-base leading-8 text-white/75">
              The task wasn't "build a roofing app". It was to create one system
              where different measurement paths — a drawn plan, an AI-scanned
              plan, or measurements typed in from a site visit — converge into a
              single reusable calculation and pricing engine, and then flow
              onward into the commercial documents a contractor actually sends.
            </p>
            <p className="mt-4 text-base leading-8 text-white/75">
              Three entry paths, one set of rules, one chain of documents.
            </p>
          </section>

          {/* What was built */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              What was built
            </h2>
            <p className="mt-4 text-base leading-8 text-white/75">
              Every capability below is live in the product today:
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {builtCapabilities.map((c) => (
                <div
                  key={c.title}
                  className="rounded-xl border border-white/10 bg-white/5 p-6"
                >
                  <h3 className="text-base font-semibold text-white">{c.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/70">{c.body}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-base leading-8 text-white/75">
              See it working:{" "}
              <a
                href="https://quote-core.com?utm_source=t3labs&utm_medium=referral&utm_campaign=custom-solutions"
                className="text-[#d7ff00] underline underline-offset-2 hover:text-[#b8dd00]"
              >
                QuoteCore+
              </a>
            </p>
          </section>

          {/* The deeper lesson */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              The deeper lesson
            </h2>
            <p className="mt-4 text-base leading-8 text-white/75">
              The important proof here is not "T3 can code". It's that T3 can
              take a complex real-world workflow — one full of trade-specific
              rules, exceptions and hard-won judgement — model those rules
              faithfully in software, simplify the experience enough that a busy
              contractor will actually use it, and turn the whole process into
              reusable, structured logic.
            </p>
            <p className="mt-4 text-base leading-8 text-white/75">
              The same principles that turn roof measurements into material,
              labour and quote calculations apply to fabrication pricing,
              supplier portals, manufacturing estimates, service quotes and other
              rule-heavy workflows. If your business has that shape, this case
              study is about you — roofing is just where it was proven.
            </p>
          </section>

          {/* CTA */}
          <section
            id="intake"
            className="mb-16 rounded-2xl border border-[#d7ff00]/25 bg-white/5 p-8 text-center sm:p-12"
          >
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Have a workflow off-the-shelf software can't handle?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/70">
              Tell us the problem — your spreadsheet, screenshots, process notes
              or a short video all work. We'll come back with a plain-English
              view of whether it needs configuration, integration or a custom build.
            </p>
            <div className="mt-7">
              <ServiceIntakeCTA
                buttonText="Tell us the problem"
                problemCategory="custom-software-case-study"
                trigger="page-cta"
              />
            </div>
          </section>

          {/* Related */}
          <section className="mb-20">
            <h2 className="mb-5 text-xl font-semibold tracking-tight">
              Related
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href="/custom-software"
                className="rounded-xl border border-white/10 bg-white/5 p-5 text-base font-medium text-white/80 transition hover:border-[#d7ff00]/40 hover:text-white"
              >
                Custom Software Development <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/blog/custom-roofing-software"
                className="rounded-xl border border-white/10 bg-white/5 p-5 text-base font-medium text-white/80 transition hover:border-[#d7ff00]/40 hover:text-white"
              >
                Custom Roofing Software Guide <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
