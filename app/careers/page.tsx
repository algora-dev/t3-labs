import type { Metadata } from "next";
import Link from "next/link";
import IntakeModalMount from "@/components/intake/intake-modal-mount";

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  title: "Commission-Only Sales Roles — Sell Custom Software & AI Solutions | T3 Labs",
  description:
    "Commission-based sales opportunities with T3 Labs and QuoteCore+. Refer high-ticket custom software and AI projects, or sell contractor SaaS subscriptions. Uncapped commission, real products in production, one-to-one support.",
  alternates: { canonical: `${BASE_URL}/careers` },
  openGraph: {
    title: "Commission-Only Sales Roles — T3 Labs & QuoteCore+",
    description:
      "Refer high-ticket custom software builds to T3 Labs, or sell QuoteCore+ subscriptions to contractors. Uncapped commission, existing assets, one-to-one support.",
    url: `${BASE_URL}/careers`,
    siteName: "T3 Labs",
    type: "website",
  },
};

const faqs = [
  {
    q: "Is this a salaried job?",
    a: "No. These are commission-only, self-employed opportunities. You earn when we earn — no base salary, no cap on commission, no exclusivity required. It suits people who want control over how, when and what they sell.",
  },
  {
    q: "What exactly would I be selling?",
    a: "Two things from one team. T3 Labs builds custom software, AI integrations, portals and workflow systems for construction businesses running on outdated, disjointed processes — high-ticket projects. QuoteCore+ is our multi-use subscription quoting platform for contractors — one app covering takeoffs, quoting, ordering and invoicing. Many conversations open doors in both directions, so you can sell whichever fits the prospect.",
  },
  {
    q: "How much can I earn?",
    a: "Custom software projects start in the thousands, so a single qualified, closed referral can pay significantly more than months of small sales. Subscription referrals pay a recurring share of monthly revenue that compounds as your base grows. And custom deals can be structured flexibly — paying you a one-off commission, a recurring share of monthly payments, or a mix of both. Exact rates are agreed in writing before you start.",
  },
  {
    q: "How do customers pay for T3 Labs custom projects?",
    a: "Flexibly — there is no single pricing model. A customer can pay a larger upfront fee with lower ongoing monthly hosting and support costs, or pay less upfront with higher monthly payments for an agreed period. If a prospect understands the value but does not want to risk a lot of capital to find out if it works, the payment structure can usually be shaped around that. It makes these deals far easier to close.",
  },
  {
    q: "Can I earn recurring commission on custom projects, not just one-off payments?",
    a: "Yes — it depends on how the deal is structured. You might take a smaller share of the upfront payment and a larger share of the ongoing monthly revenue, or a larger one-off payment with little or no recurring. Your commission structure can be matched to the deal and to how you prefer to earn.",
  },
  {
    q: "Do I need a technical background?",
    a: "No. You find and qualify the opportunity — the business with a spreadsheet problem, the growing firm drowning in manual process. Our team scopes, pitches and builds. You need to recognise the pain and start the conversation; we handle the technical depth.",
  },
  {
    q: "What support and materials do I get?",
    a: "A full asset library: live products you can demo, free tools that work as lead magnets, case studies (including the full QuoteCore+ build story), videos, cost guides and comparison content. Plus optional one-to-one calls to sharpen your strategy, and custom content built for your approach on request. Use any of it, all of it, or none of it — your strategy is yours.",
  },
  {
    q: "Can I sell both products?",
    a: "Yes, and the best sellers do. A manufacturer buying a custom pricing system may employ contractors who need QuoteCore+; a contractor using QuoteCore+ may want an integration that becomes a T3 Labs project. Every conversation can pay twice.",
  },
  {
    q: "Where are these roles based?",
    a: "Remote-first. T3 Labs builds for UK and international clients, and QuoteCore+ serves the UK, US, NZ and AU markets. You can work from anywhere.",
  },
  {
    q: "How do I apply?",
    a: "Email careers@t3labs.co.uk or book a call with a short note about which role fits you, your network, and how you would approach selling. We respond to every genuine application.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Careers", item: `${BASE_URL}/careers` },
  ],
};

const roles = [
  {
    tag: "Role 1 · High-ticket deals",
    title: "Custom Software & AI Sales — T3 Labs",
    summary:
      "Find construction and trade businesses stuck on outdated, disjointed processes — spreadsheets, Word docs, PDFs and separate apps stitched together — who need custom software, portals, integrations or workflow automation, and refer them to us. Projects start in the thousands — one closed deal can outweigh months of small sales.",
    points: [
      "High commission per closed project",
      "Target: construction & trade businesses lagging on tech — also SMBs, manufacturers, service businesses",
      "You qualify the lead — T3 Labs scopes, pitches and builds",
      "Flexible customer payment options — more upfront and less monthly, or the reverse",
      "Your commission can follow the deal: bigger one-off, or recurring share of monthly payments",
      "Ideal if you have a B2B or trade network or consultative sales background",
    ],
  },
  {
    tag: "Role 2 · Recurring revenue",
    title: "SaaS Subscription Sales — QuoteCore+",
    summary:
      "Sell QuoteCore+ subscriptions to roofing and construction contractors — our live, multi-use quoting and takeoff platform. Every paying customer pays you a share of their subscription, every month they stay.",
    points: [
      "Recurring commission on monthly subscriptions",
      "Target: roofers, builders, estimators (UK, US, NZ, AU)",
      "Free tools and calculators work as powerful lead magnets",
      "Compounds as your customer base grows",
    ],
  },
  {
    tag: "Role 3 · Best of both",
    title: "Hybrid Sales — T3 Labs + QuoteCore+",
    summary:
      "Sell both. Business software conversations reveal contractors who need quoting tools; contractor conversations surface custom software needs. Hybrid sellers earn big one-off commissions plus recurring income.",
    points: [
      "High-ticket project commissions + recurring subscriptions",
      "Cross-sell in both directions",
      "Shape the role around your network",
      "Best long-term earning potential for the right person",
    ],
  },
];

const assets = [
  { title: "Live products in production", desc: "QuoteCore+ is a real platform used by contractors — and T3 Labs built it. That's your proof we deliver. Demo it live on any call." },
  { title: "Case studies & the QuoteCore+ story", desc: "The full build story — from problem to production platform — published and ready to share with prospects." },
  { title: "Free tools as lead magnets", desc: "Calculators, quote and invoice generators, a takeoff builder — genuinely useful tools you can hand to any prospect. They start conversations." },
  { title: "Cost guides & comparisons", desc: "UK custom software cost guides and competitor comparison content, maintained and current." },
  { title: "Videos & demos", desc: "Product walkthroughs and tutorials you can send or embed in your outreach." },
  { title: "Custom content on request", desc: "Need a specific deck, landing page or demo environment for your strategy? Ask — we build it with you." },
];

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Site header — logo links back to t3labs.tech */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0b10]/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-[min(1080px,calc(100%-40px))] items-center justify-between">
          <a href="https://www.t3labs.tech" aria-label="T3 Labs home" className="inline-flex items-center">
            <img src="/assets/t3-labs-white.png" alt="T3 Labs" className="h-8 w-auto object-contain" />
          </a>
          <a href="https://www.t3labs.tech" className="text-sm font-semibold text-white/70 transition hover:text-[#d7ff00]">
            t3labs.tech <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-20 sm:py-24">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#d7ff00]">
            Commission-Only Sales Opportunities
          </p>
          <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-tight tracking-tight">
            Earn serious commission selling software that&apos;s already built, live and proving itself.
          </h1>
          <p className="mt-5 max-w-[720px] text-lg leading-9 text-white/75">
            We&apos;re recruiting commission-based salespeople for two ways to earn from one team:{" "}
            <span className="text-white">T3 Labs</span> — custom software and workflow solutions for construction
            businesses running on outdated, disjointed processes — and{" "}
            <span className="text-white">QuoteCore+</span>, our multi-use quoting platform for contractors. Uncapped
            commission. Your strategy, your proven formula — support and assets only if you want them.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="mailto:careers@t3labs.co.uk"
              className="inline-flex items-center gap-2 rounded-full bg-[#d7ff00] px-7 py-3.5 text-sm font-semibold text-[#0a0b10] transition hover:bg-[#b8dd00]"
            >
              Apply now <span aria-hidden="true">&rarr;</span>
            </a>
            <a
              href="https://calendly.com/cece-t3labs/20min"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[#d7ff00] underline underline-offset-2 hover:text-[#b8dd00]"
            >
              Book a call
            </a>
          </div>
          <p className="mt-3 text-sm text-white/50">Commission-only · Remote · Uncapped · No exclusivity required</p>
        </div>
      </section>

      {/* Two products */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">One team. Two ways to earn.</h2>
          <p className="mt-4 max-w-[720px] text-base leading-8 text-white/75">
            Every conversation can pay twice. A construction business buying a custom solution may employ contractors
            who need proper quoting tools. A contractor on QuoteCore+ may surface a workflow problem that becomes a
            custom build. You choose which door to open — or both.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-lg font-semibold">T3 Labs — custom solutions, high-ticket projects</h3>
              <p className="mt-3 text-base leading-8 text-white/75">
                We build custom software, AI integrations, portals and workflow systems for construction industry
                businesses lagging behind on tech — teams stitching spreadsheets, Word docs, PDFs and separate apps
                together just to get through the day. We replace that with one effective, cost-efficient solution that
                helps them sell more of their own product or service while reducing their staff&apos;s workload — so
                they scale without hiring. Projects start in the thousands; one closed referral can outweigh months
                of small sales. Payment structures are flexible too: customers can pay more upfront with lower ongoing
                monthly costs, or less upfront with higher monthly payments for an agreed period — so if capital risk
                is the only thing blocking a sale, the deal can usually be shaped around the customer.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-lg font-semibold">QuoteCore+ — recurring revenue</h3>
              <p className="mt-3 text-base leading-8 text-white/75">
                A live, multi-use product already built and growing: takeoffs, quoting, ordering and invoicing for
                roofing and construction contractors — one app, many workflows. Subscriptions recur monthly — your
                commission does too, compounding as your base grows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">The roles</h2>
          <p className="mt-4 text-base leading-8 text-white/75">
            Three ways in — same products, different strategies. Pick the one that fits your network and how you like
            to sell.
          </p>
          <div className="mt-10 space-y-5">
            {roles.map((r) => (
              <div key={r.title} className="rounded-xl border border-white/10 bg-white/5 p-7 transition hover:border-[#d7ff00]/40">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#d7ff00]">{r.tag}</p>
                <h3 className="mt-2 text-xl font-semibold">{r.title}</h3>
                <p className="mt-3 text-base leading-8 text-white/75">{r.summary}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {r.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm leading-6 text-white/75">
                      <span className="mt-1 text-[#d7ff00]" aria-hidden="true">✓</span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">You don&apos;t get paid unless we get paid</h2>
          <p className="mt-4 max-w-[720px] text-base leading-8 text-white/75">
            That&apos;s the whole model — so making you effective is our problem too. But none of this boxes you in.
            If you have your own strategy and a proven formula, run it your way. Everything below is optional — take
            what helps, ignore what doesn&apos;t. All that matters is that you&apos;re effective and you sell:
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Optional one-to-one calls to sharpen your strategy",
              "Custom content built for your approach — decks, videos, landing pages",
              "Technical backup on calls with serious prospects",
              "Honest feedback on what's working across the team",
              "A growing asset, tool and content library",
              "Direct line to the founders — no layers of management",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-white/80">
                <span className="mt-0.5 text-[#d7ff00]" aria-hidden="true">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Assets */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Everything you need is already built</h2>
          <p className="mt-4 text-base leading-8 text-white/75">
            You are not selling a slide deck. Both products are live and in production — and you get a library of
            material to use from day one.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {assets.map((a) => (
              <div key={a.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/70">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How it works</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {[
              { step: "01", title: "Talk to us", desc: "Tell us which role fits, your network and how you'd sell. Short conversation, no CV theatre." },
              { step: "02", title: "Agree your terms", desc: "Commission rates, attribution and support agreed in writing before you sell anything." },
              { step: "03", title: "Sell and earn", desc: "Use the assets, your strategy and our support. Commission paid on the agreed schedule. No caps." },
            ].map((s) => (
              <div key={s.step} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <span className="text-sm font-bold text-[#d7ff00]">{s.step}</span>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Common questions</h2>
          <div className="mt-8 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
            {faqs.map((f) => (
              <details key={f.q} className="group p-6">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-white/40 transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="mt-3 text-base leading-8 text-white/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Apply CTA */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Apply</h2>
          <p className="mx-auto mt-4 max-w-[620px] text-base leading-8 text-white/75">
            Email us a short note about which role fits you, your network, and how you would approach selling. We
            respond to every genuine application.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:careers@t3labs.co.uk"
              className="inline-flex items-center gap-2 rounded-full bg-[#d7ff00] px-7 py-3.5 text-sm font-semibold text-[#0a0b10] transition hover:bg-[#b8dd00]"
            >
              Email careers@t3labs.co.uk <span aria-hidden="true">&rarr;</span>
            </a>
            <a
              href="https://calendly.com/cece-t3labs/20min"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[#d7ff00] underline underline-offset-2 hover:text-[#b8dd00]"
            >
              Book a discovery call
            </a>
          </div>
          <p className="mt-10 text-xs leading-5 text-white/40">
            Commission-only, self-employed opportunities — not employment. Terms agreed in writing before you start.{" "}
            <Link href="/privacy" className="underline hover:text-white/60">Privacy Policy</Link>.
          </p>
        </div>
      </section>
      <IntakeModalMount />
    </main>
  );
}
