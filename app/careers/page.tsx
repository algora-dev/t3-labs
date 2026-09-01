import type { Metadata } from "next";
import Link from "next/link";
import IntakeModalMount from "@/components/intake/intake-modal-mount";

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  title: "Commission-Only Sales Roles - Find Business Problems, Earn When We Solve Them | T3 Labs",
  description:
    "Commission-based sales opportunity with T3 Labs. Find businesses stuck with slow, manual, outdated or disconnected ways of working - we scope, pitch and build the solution. Also sell QuoteCore+ subscriptions for recurring commission.",
  alternates: { canonical: `${BASE_URL}/careers` },
  openGraph: {
    title: "Commission-Only Sales Roles - T3 Labs & QuoteCore+",
    description:
      "Find valuable business problems. We build the solution. High-ticket commission with flexible deal structures, plus recurring QuoteCore+ subscription income.",
    url: `${BASE_URL}/careers`,
    siteName: "T3 Labs",
    type: "website",
  },
};

const faqs = [
  {
    q: "Is this a salaried job?",
    a: "No. These are commission-only, self-employed opportunities. You earn when we earn - no base salary, no cap on commission, no exclusivity required. It suits people who want control over how, when and what they sell.",
  },
  {
    q: "What exactly would I be selling?",
    a: "With T3 Labs, you are not limited to one software product. You find businesses with valuable problems - manual processes, old systems, weak online sales workflows, disconnected software, repetitive staff admin or other operational bottlenecks. T3 Labs then works out the right solution, which could be anything from a website tool or workflow automation to a customer portal or complete bespoke software platform. You can also sell QuoteCore+ subscriptions to contractors for recurring commission.",
  },
  {
    q: "How do I know if a business needs what T3 Labs builds?",
    a: "Listen for expensive friction: staff copying data between systems, spreadsheets running core processes, customers phoning for things a website should do, or a business that needs another admin person just to keep up. If a problem is slow, manual, outdated or disconnected - and costing real time or money - it is worth a conversation.",
  },
  {
    q: "Do I need a technical background?",
    a: "No. Your job is to recognise a commercially important problem, ask sensible questions and connect us with the right people. T3 Labs handles technical discovery, scoping, solution design and development.",
  },
  {
    q: "How much can I earn?",
    a: "Custom software projects start in the thousands, so a single qualified, closed referral can pay significantly more than months of small sales. Subscription referrals pay a recurring share of monthly revenue that compounds as your base grows. And custom deals can be structured flexibly - paying you a one-off commission, a recurring share of monthly payments, or a mix of both. Exact rates are agreed in writing before you start.",
  },
  {
    q: "How do customers pay for T3 Labs custom projects?",
    a: "Flexibly - there is no single pricing model. A customer can pay a larger upfront fee with lower ongoing monthly hosting and support costs, or pay less upfront with higher monthly payments for an agreed period. If a prospect understands the value but does not want to risk a lot of capital to find out if it works, the payment structure can usually be shaped around that. It makes these deals far easier to close.",
  },
  {
    q: "Can I earn recurring commission on custom projects, not just one-off payments?",
    a: "Yes - it depends on how the deal is structured. You might take a smaller share of the upfront payment and a larger share of the ongoing monthly revenue, or a larger one-off payment with little or no recurring. Your commission structure can be matched to the deal and to how you prefer to earn.",
  },
  {
    q: "What support and materials do I get?",
    a: "A full asset library: live products you can demo, free tools that work as lead magnets, case studies (including the full QuoteCore+ build story), videos, cost guides and comparison content. Plus optional one-to-one calls to sharpen your strategy, and custom content built for your approach on request. Use any of it, all of it, or none of it - your strategy is yours.",
  },
  {
    q: "Can I sell both products?",
    a: "Yes, and the best sellers do. A manufacturer buying a custom solution may employ contractors who need QuoteCore+; a contractor using QuoteCore+ may surface a workflow problem that becomes a custom build. Every conversation can pay twice.",
  },
  {
    q: "Where are these roles based?",
    a: "Remote-first. T3 Labs builds for UK and international clients, and QuoteCore+ serves the UK, US, NZ and AU markets. You can work from anywhere.",
  },
  {
    q: "How do I apply?",
    a: "Email insights@t3labs.co.uk or book a call with a short note about which role fits you, your network, and how you would approach selling. We respond to every genuine application.",
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

const salesTriggers = [
  {
    quote: "\u201cWe still use spreadsheets for most of this.\u201d",
    signals: "Quoting, pricing, production planning, order tracking, stock, customer records, job management, reporting.",
  },
  {
    quote: "\u201cOur staff spend hours doing this manually.\u201d",
    signals: "Copying information between systems, retyping orders, rebuilding the same documents, checking multiple spreadsheets, answering repetitive customer questions, producing reports by hand.",
  },
  {
    quote: "\u201cOur website doesn\u2019t really help us sell.\u201d",
    signals: "Poor enquiry flow, no instant estimate or quote path, customers can\u2019t configure products, staff handle every basic enquiry, weak or dated website experience.",
  },
  {
    quote: "\u201cCustomers keep calling us to do something they should be able to do themselves.\u201d",
    signals: "Requesting pricing, configuring products, uploading files, checking order or job status, requesting quotes, booking services, retrieving documents.",
  },
  {
    quote: "\u201cOur systems don\u2019t talk to each other.\u201d",
    signals: "Website to spreadsheet, CRM to accounting, quoting to ordering, ordering to production, customer portal to internal system, duplicate entry across multiple apps.",
  },
  {
    quote: "\u201cWe\u2019ve outgrown the software we use.\u201d",
    signals: "Old internal software, unsupported legacy systems, Access databases, desktop-only apps, a process that changed but the software didn\u2019t.",
  },
  {
    quote: "\u201cWe need more leads / we\u2019re hard to find online.\u201d",
    signals: "Website improvements, SEO, AI search visibility, better landing pages, content and tools that attract and convert the right visitors.",
  },
  {
    quote: "\u201cWe need another member of staff just to keep up with admin.\u201d",
    signals: "Often the strongest signal of all - the opportunity is usually to remove repetitive work before the business hires more people.",
  },
];

const uncoverQuestions = [
  "What part of the business still takes far more manual work than it should?",
  "What do your staff keep copying, retyping or rebuilding?",
  "What do customers regularly have to phone or email you for?",
  "Is there anything your website should be doing that your staff currently do manually?",
  "Are there spreadsheets or old systems the business could not operate without?",
  "Do your systems share information, or does somebody move it between them?",
  "Is there anything stopping you selling more because the current process cannot keep up?",
  "If you could remove one repetitive problem from the business tomorrow, what would it be?",
];

const sellCategories = [
  {
    title: "Website upgrades & rebuilds",
    desc: "Clearer product presentation, better conversion paths, landing pages, enquiry flows, modern rebuilds, integrations with internal systems.",
  },
  {
    title: "SEO, GEO & AI search visibility",
    desc: "Easier discovery through Google, local and industry search, and AI answer engines - stronger site structure, better content, useful tools that attract qualified visitors.",
  },
  {
    title: "Interactive sales tools",
    desc: "Calculators, estimators, quote builders, product selectors, configurators, measurement and pricing tools built into a website so customers can understand, configure or buy with less staff involvement.",
  },
  {
    title: "Internal workflow tools",
    desc: "Estimating systems, pricing tools, order processing, job tracking, production workflows, reporting dashboards, document generation, approvals, staff portals, automation between systems.",
  },
  {
    title: "Customer, dealer & supplier portals",
    desc: "Self-service, trade pricing, dealer ordering, quote requests, file uploads, order tracking, account documents, repeat ordering, product configuration.",
  },
  {
    title: "AI added to existing workflows",
    desc: "Document processing, extracting information, classification, drafting, search, recommendations, workflow assistance, internal knowledge - where it genuinely improves the workflow, not as a buzzword.",
  },
  {
    title: "Integrations & automation",
    desc: "Connecting systems that currently need people to move data: website to CRM, CRM to accounting, quoting to ordering, portals to internal systems, custom APIs.",
  },
  {
    title: "Legacy software replacement",
    desc: "Replacing Access databases, old desktop apps, unsupported bespoke systems and spreadsheet-driven processes the business has outgrown.",
  },
  {
    title: "Complete bespoke software platforms",
    desc: "For larger opportunities: estimating and quoting platforms, industry-specific SaaS, operational systems, multi-user workflow applications designed around the business.",
  },
];

const roles = [
  {
    tag: "Role 1 · High-ticket deals",
    title: "Custom Solutions Sales - T3 Labs",
    summary:
      "Find construction and trade businesses stuck on outdated, disjointed processes - who need custom software, portals, integrations or workflow automation, and refer them to us. Projects start in the thousands - one closed deal can outweigh months of small sales.",
    points: [
      "High commission per closed project",
      "Broad B2B opportunity - any business with expensive friction",
      "No technical background required",
      "Flexible customer payment options - more upfront and less monthly, or the reverse",
      "Your commission can follow the deal: bigger one-off, or recurring share of monthly payments",
    ],
  },
  {
    tag: "Role 2 · Recurring revenue",
    title: "SaaS Subscription Sales - QuoteCore+",
    summary:
      "Sell QuoteCore+ subscriptions to roofing and construction contractors - our live, multi-use quoting and takeoff platform. Every paying customer pays you a share of their subscription, every month they stay.",
    points: [
      "Recurring commission on monthly subscriptions",
      "Target: roofers, builders, estimators (UK, US, NZ, AU)",
      "Free tools and calculators work as powerful lead magnets",
      "Compounds as your customer base grows",
    ],
  },
  {
    tag: "Role 3 · Best of both",
    title: "Hybrid Sales - T3 Labs + QuoteCore+",
    summary:
      "Sell both. Business software conversations reveal contractors who need quoting tools; contractor conversations surface workflow problems that become custom builds. Hybrid sellers earn big one-off commissions plus recurring income.",
    points: [
      "High-ticket project commissions + recurring subscriptions",
      "Cross-sell in both directions",
      "Shape the role around your network",
      "Best long-term earning potential for the right person",
    ],
  },
];

const assets = [
  { title: "Live products in production", desc: "QuoteCore+ is our strongest live proof of what T3 Labs can design and deliver - a complete production software platform built from a real industry problem. Demo it on any call." },
  { title: "Case studies & the QuoteCore+ story", desc: "The full build story - from problem to production platform - published and ready to share with prospects." },
  { title: "Free tools as lead magnets", desc: "Calculators, quote and invoice generators, a takeoff builder - genuinely useful tools you can hand to any prospect. They start conversations." },
  { title: "Cost guides & comparisons", desc: "UK custom software cost guides and competitor comparison content, maintained and current." },
  { title: "Videos & demos", desc: "Product walkthroughs and tutorials you can send or embed in your outreach." },
  { title: "Custom content on request", desc: "Need a specific deck, landing page or demo environment for your strategy? Ask - we build it with you." },
];

function Check({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm leading-6 text-white/75">
      <span className="mt-1 text-[#d7ff00]" aria-hidden="true">✓</span>
      {children}
    </li>
  );
}

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-[#0a0b10] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Site header - logo links back to t3labs.tech */}
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
            Find valuable business problems. Earn commission when we solve them.
          </h1>
          <div className="mt-5 max-w-[720px]">
            <p className="text-lg leading-9 text-white/75">
              We&rsquo;re recruiting commission-based salespeople for two ways to earn from one team:
            </p>
            <ul className="mt-4 space-y-2 text-lg leading-9 text-white/75">
              <li className="flex items-start gap-3">
                <span className="mt-4 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d7ff00]" aria-hidden="true"></span>
                <span><span className="text-white">T3 Labs</span> - custom software and workflow solutions for
                construction businesses running on outdated, disjointed processes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-4 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d7ff00]" aria-hidden="true"></span>
                <span><span className="text-white">QuoteCore+</span> - our multi-use quoting platform for contractors.</span>
              </li>
            </ul>
            <p className="mt-4 text-lg leading-9 text-white/75">
              Uncapped commission. Your strategy, your proven formula - support and assets only if you want them.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="mailto:insights@t3labs.co.uk"
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

      {/* Two ways to earn */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Multiple ways to earn</h2>
          <p className="mt-4 max-w-[720px] text-base leading-8 text-white/75">
            Earn from high-ticket custom projects, recurring subscriptions, or both at once.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-lg font-semibold">T3 Labs - custom solutions, high-ticket projects</h3>
              <p className="mt-3 text-base leading-8 text-white/75">
                We find and fix expensive business problems with whatever digital solution makes sense - websites,
                sales tools, workflows, portals or complete software platforms. You find the problem; we scope, pitch
                and build the solution. Flexible payment structures: more upfront and less monthly, or the reverse.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-lg font-semibold">QuoteCore+ - recurring revenue</h3>
              <p className="mt-3 text-base leading-8 text-white/75">
                A live, multi-use product already built and growing: takeoffs, quoting, ordering and invoicing for
                roofing and construction contractors. Subscriptions recur monthly - your commission does too,
                compounding as your base grows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems worth listening for */}
      <section id="sales-triggers" className="border-b border-white/10">
        <div className="mx-auto w-[min(1080px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Problems worth listening for</h2>
          <p className="mt-4 max-w-[720px] text-base leading-8 text-white/75">
            Most prospects will not say, &ldquo;We need custom software.&rdquo; They will describe the problem
            instead. If you hear any of these, there may be an opportunity:
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {salesTriggers.map((t) => (
              <div key={t.quote} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <p className="font-semibold text-white">{t.quote}</p>
                <p className="mt-2 text-sm leading-7 text-white/70">{t.signals}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ask better questions */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            You don&rsquo;t need to pitch software. Ask better questions.
          </h2>
          <p className="mt-4 text-base leading-8 text-white/75">
            A good T3 Labs lead often appears after only a few simple questions:
          </p>
          <ol className="mt-8 space-y-3">
            {uncoverQuestions.map((q, i) => (
              <li key={q} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
                <span className="text-sm font-bold text-[#d7ff00]">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-base leading-7 text-white/80">{q}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 rounded-xl border border-[#d7ff00]/30 bg-[#d7ff00]/5 p-6 text-base leading-8 text-white/85">
            <strong className="text-white">You do not have to design the answer.</strong> If the problem is real and
            valuable enough to solve, bring us into the conversation.
          </p>
        </div>
      </section>

      {/* What can you actually sell */}
      <section id="what-we-build" className="border-b border-white/10">
        <div className="mx-auto w-[min(1080px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What can you actually sell through T3 Labs?</h2>
          <p className="mt-4 max-w-[720px] text-base leading-8 text-white/75">
            There is no fixed catalogue. These are examples of the kinds of problems we can solve - not the limit of
            what we can build.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sellCategories.map((c) => (
              <div key={c.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/70">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Good lead / not a good lead */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What does a good T3 Labs lead look like?</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-semibold">1. A real problem</h3>
              <p className="mt-2 text-sm leading-7 text-white/70">
                Something slow, manual, expensive, repetitive, outdated, disconnected, difficult for customers, or
                limiting growth.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-semibold">2. It matters financially</h3>
              <p className="mt-2 text-sm leading-7 text-white/70">
                It consumes staff time, delays quotes or orders, loses enquiries, requires extra hiring, creates
                mistakes, or restricts sales.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-semibold">3. Someone wants it fixed</h3>
              <p className="mt-2 text-sm leading-7 text-white/70">
                They don&rsquo;t need to know the technical answer - just that the current process costs them enough
                to make solving it worthwhile.
              </p>
            </div>
          </div>
          <div className="mt-8 rounded-xl border border-white/10 p-6">
            <h3 className="font-semibold">Not every problem needs custom software</h3>
            <p className="mt-2 text-sm leading-7 text-white/70">
              Poor-fit leads: someone with only an idea and no real business problem; a tiny inconvenience with
              little commercial value; no budget and no value case; a request to clone a huge platform for almost
              nothing; or no one who owns the problem or makes decisions. Qualify first - quality beats volume.
            </p>
          </div>
        </div>
      </section>

      {/* How one deal can pay twice - example */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">How one deal can pay twice</h2>
          <p className="mt-4 max-w-[720px] text-base leading-8 text-white/75">
            An example of the hybrid opportunity:
          </p>
          <div className="mt-8 rounded-xl border border-[#d7ff00]/30 bg-[#d7ff00]/5 p-7">
            <p className="text-base leading-8 text-white/85">
              Picture a construction supplies business with multiple stores or branches. T3 Labs builds them tools
              that help their customers buy more of their products while cutting the time their staff spend on
              quotes and admin - a high-ticket project that earns your commission on its own. Their trade customers
              can also use QuoteCore+ for their own quoting, which is recurring commission for you. The business
              loses nothing by their customers using our app, and you earn on both sides of the relationship.
            </p>
          </div>
        </div>
      </section>

      {/* Your job vs T3 Labs' job */}
      <section className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Your job is to find the opportunity - not design the software
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-lg font-semibold">You</h3>
              <ul className="mt-4 space-y-2.5">
                <Check>Identify the business</Check>
                <Check>Recognise the problem</Check>
                <Check>Ask enough questions to understand why it matters</Check>
                <Check>Get the right decision-maker into the conversation</Check>
                <Check>Make the introduction and help move the opportunity forward</Check>
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-7">
              <h3 className="text-lg font-semibold">T3 Labs</h3>
              <ul className="mt-4 space-y-2.5">
                <Check>Investigates the workflow</Check>
                <Check>Works out what should be built</Check>
                <Check>Scopes the project and handles technical questions</Check>
                <Check>Presents and prices the solution</Check>
                <Check>Builds and supports it</Check>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-base leading-8 text-white/85">
            <strong className="text-white">You do not need a technical background.</strong> You need commercial
            awareness and the ability to recognise expensive problems.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="border-b border-white/10">
        <div className="mx-auto w-[min(880px,calc(100%-40px))] py-16">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">The roles</h2>
          <p className="mt-4 text-base leading-8 text-white/75">
            Three ways in - same products, different strategies. Pick the one that fits your network and how you like
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
                    <Check key={pt}>{pt}</Check>
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
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">You don&rsquo;t get paid unless we get paid</h2>
          <p className="mt-4 max-w-[720px] text-base leading-8 text-white/75">
            We only earn when you earn, so helping you sell effectively matters to us as much as it matters to
            you. But none of this boxes you in.
            If you have your own strategy and a proven formula, run it your way. Everything below is optional - take
            what helps, ignore what doesn&rsquo;t. All that matters is that you&rsquo;re effective and you sell:
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              "Optional one-to-one calls to sharpen your strategy",
              "Custom content built for your approach - decks, videos, landing pages",
              "Technical backup on calls with serious prospects",
              "Honest feedback on what's working across the team",
              "A growing asset, tool and content library",
              "Direct line to the founders - no layers of management",
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
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">A lot is already built - and we build the rest</h2>
          <p className="mt-4 text-base leading-8 text-white/75">
            We have already built a range of tools, calculators and live products that showcase how we solve
            problems. Some will fit a prospect perfectly; when they don&apos;t, that is the custom solution we build
            for them. Client work we have delivered for other businesses often can&apos;t be shown publicly, so what
            you see here is only what we own and can share. You get this library from day one:
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
              href="mailto:insights@t3labs.co.uk"
              className="inline-flex items-center gap-2 rounded-full bg-[#d7ff00] px-7 py-3.5 text-sm font-semibold text-[#0a0b10] transition hover:bg-[#b8dd00]"
            >
              Email insights@t3labs.co.uk <span aria-hidden="true">&rarr;</span>
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
            Commission-only, self-employed opportunities - not employment. Terms agreed in writing before you start.{" "}
            <Link href="/privacy" className="underline hover:text-white/60">Privacy Policy</Link>.
          </p>
        </div>
      </section>
      <IntakeModalMount />
    </main>
  );
}
