"use client";

import { useEffect, useState } from "react";

/**
 * T3 Labs — "Become Part of the Answer" sales landing page.
 * Dark/light theme toggle (persisted), same tokens as growth proposal pages.
 * Dual purpose: standalone prospect page + live rep aid during sales calls.
 */

type Theme = "dark" | "light";

type Tokens = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  accentSoft: string;
};

const dark: Tokens = {
  bg: "#0a0b10",
  surface: "#101219",
  surfaceAlt: "#161927",
  border: "#262a3a",
  text: "#e8eaf2",
  muted: "#9aa1b5",
  accent: "#d7ff00",
  accentText: "#0a0b10",
  accentSoft: "rgba(215,255,0,0.08)",
};

const light: Tokens = {
  bg: "#fbfcff",
  surface: "#ffffff",
  surfaceAlt: "#f3f5fa",
  border: "#dfe3ee",
  text: "#161a28",
  muted: "#5a6172",
  accent: "#5d6b00",
  accentText: "#ffffff",
  accentSoft: "rgba(93,107,0,0.08)",
};

const BOOKING_URL = "https://calendly.com/cece-t3labs/20min";
const DEMOS = [
  {
    name: "Apex Roofing — Supplier Pricing Tool",
    problem: "Lets roofing customers measure a job, calculate quantities and apply supplier pricing before making an enquiry.",
    href: "/supplier-pricing-tool/apex-roofing",
    trade: "Roofing supplier",
  },
  {
    name: "Vertex Cladding — Supplier Pricing Tool",
    problem: "Lets cladding customers work out sheet quantities and pricing themselves instead of waiting for a quote.",
    href: "/supplier-pricing-tool/vertex-cladding",
    trade: "Cladding supplier",
  },
  {
    name: "Oakline Flooring — Supplier Pricing Tool",
    problem: "Lets flooring customers estimate a room, apply pricing and send a much more complete enquiry to the supplier.",
    href: "/supplier-pricing-tool/oakline-flooring",
    trade: "Flooring supplier",
  },
  {
    name: "Free Roof Takeoff Builder",
    problem: "Let customers measure a job from a plan before your team needs to touch the enquiry.",
    href: "https://quote-core.com/free-roofing-takeoff-builder",
    trade: "Roofing / trades",
  },
  {
    name: "Free Quote Generator",
    problem: "Give customers a formatted, professional quote document immediately — no account, no waiting.",
    href: "https://quote-core.com/free-quote-generator",
    trade: "Any trade",
  },
  {
    name: "Free Construction Calculator",
    problem: "Give buyers useful quantities and pricing instantly instead of making them wait for a reply.",
    href: "https://quote-core.com/free-construction-calculator",
    trade: "Construction",
  },
];

function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window !== "undefined") {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("event", name, params);
  }
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function OurSolutionPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [tab, setTab] = useState<"ai" | "customers" | "contractors" | "team">("ai");

  useEffect(() => {
    const stored = window.localStorage.getItem("t3-solution-theme");
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("t3-solution-theme", theme);
  }, [theme]);

  const t = theme === "dark" ? dark : light;

  return (
    <main
      style={{ background: t.bg, color: t.text }}
      className="min-h-screen antialiased transition-colors duration-200"
    >
      {/* Sticky header */}
      <header
        style={{ background: theme === "dark" ? "rgba(10,11,16,0.85)" : "rgba(251,252,255,0.9)", borderColor: t.border }}
        className="sticky top-0 z-50 border-b backdrop-blur"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="https://www.t3labs.tech" className="flex items-center gap-2 font-semibold tracking-tight">
            <span style={{ background: t.accent, color: t.accentText }} className="rounded-md px-2 py-0.5 text-sm font-bold">T3</span>
            <span className="hidden text-sm sm:inline" style={{ color: t.muted }}>Labs</span>
          </a>
          <nav className="hidden items-center gap-5 text-sm lg:flex" style={{ color: t.muted }}>
            <button onClick={() => scrollToId("shift")} className="hover:opacity-70">The Shift</button>
            <button onClick={() => scrollToId("demos")} className="hover:opacity-70">Demos</button>
            <button onClick={() => scrollToId("who")} className="hover:opacity-70">Who It Helps</button>
            <button onClick={() => scrollToId("phases")} className="hover:opacity-70">Phases</button>
            <button onClick={() => scrollToId("start-small")} className="hover:opacity-70">Start Small</button>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle light or dark theme"
              style={{ border: `1px solid ${t.border}`, color: t.muted }}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-70"
            >
              {theme === "dark" ? "☀ Light" : "☾ Dark"}
            </button>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("solution_cta_click", { location: "sticky" })}
              style={{ background: t.accent, color: t.accentText }}
              className="hidden rounded-full px-4 py-1.5 text-xs font-semibold sm:inline-block"
            >
              Show us your current process
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5">
        {/* ===== Section 1 — Hero ===== */}
        <section className="py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: t.accent }}>
            How customers buy is changing
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            People now expect the answer immediately.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8" style={{ color: t.muted }}>
            AI is increasingly giving customers those answers before they ever visit a website.
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: t.muted }}>
            We help make your business part of the answer — and give customers, contractors and your own team tools
            that make it faster and easier to price, quote and buy.
          </p>

          <div style={{ background: t.surface, borderColor: t.border }} className="mt-10 rounded-2xl border p-6 sm:p-8">
            <p className="text-lg font-semibold leading-8">
              Have you ever used ChatGPT or another AI to compare options, check a price, choose a product or find a
              supplier?
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() => { trackEvent("solution_qualify_1", { answer: "yes" }); scrollToId("shift"); }}
                style={{ background: t.accent, color: t.accentText }}
                className="rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                Yes, I do this
              </button>
              <button
                onClick={() => { trackEvent("solution_qualify_1", { answer: "seen" }); scrollToId("shift"); }}
                style={{ border: `1px solid ${t.border}`, color: t.text }}
                className="rounded-full px-6 py-2.5 text-sm font-medium"
              >
                I&apos;ve seen people doing this
              </button>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("solution_cta_click", { location: "hero" })}
              style={{ background: t.accent, color: t.accentText }}
              className="inline-flex min-h-12 items-center justify-center rounded-full px-8 text-base font-semibold"
            >
              Show us your current process
            </a>
            <button
              onClick={() => { trackEvent("solution_demo_cta", { location: "hero" }); scrollToId("demos"); }}
              style={{ border: `1px solid ${t.border}` }}
              className="inline-flex min-h-12 items-center justify-center rounded-full px-8 text-base font-medium"
            >
              Try the demo tools
            </button>
          </div>
        </section>

        {/* ===== Section 2 — The Shift ===== */}
        <section id="shift" className="scroll-mt-20 py-16 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The way people find answers is changing.</h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Old way */}
            <div style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: t.muted }}>The old way</p>
              <div className="mt-6 space-y-3">
                {["Search", "Visit several websites", "Compare products", "Find pricing", "Make enquiries", "Wait for replies", "Work out the answer yourself"].map((s, i, arr) => (
                  <div key={s}>
                    <p style={{ background: t.surfaceAlt }} className="rounded-xl px-4 py-2.5 text-sm font-medium">{s}</p>
                    {i < arr.length - 1 && <p style={{ color: t.muted }} className="py-0.5 text-center text-xs">↓</p>}
                  </div>
                ))}
              </div>
            </div>
            {/* AI way */}
            <div style={{ background: t.accentSoft, borderColor: t.accent }} className="rounded-2xl border p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: theme === "dark" ? t.accent : t.accent }}>The AI way</p>
              <div className="mt-6 space-y-3">
                {["Explain the problem", "AI searches for useful information", "AI compares the options", "AI builds the answer", "The customer gets a result immediately"].map((s, i, arr) => (
                  <div key={s}>
                    <p style={{ background: theme === "dark" ? t.surface : t.surface }} className="rounded-xl px-4 py-2.5 text-sm font-medium">{s}</p>
                    {i < arr.length - 1 && <p style={{ color: t.accent }} className="py-0.5 text-center text-xs">↓</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
            AI is moving the work away from the customer. Instead of giving people a list of websites and asking them
            to do the research, AI increasingly tries to solve the problem for them.
          </p>
        </section>

        {/* ===== Section 3 — Why this matters ===== */}
        <section className="py-16 sm:py-20">
          <h2 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            If AI is building the answer, how much of that answer can it currently get from you?
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
            To recommend a product, estimate a price or suggest a supplier, AI needs useful information it can
            understand and trust.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Pricing", "Products", "Reviews", "Location", "Tools", "Technical content", "Real-world data", "Clear next steps"].map((c) => (
              <div key={c} style={{ background: t.surface, borderColor: t.border }} className="rounded-xl border px-4 py-4 text-sm font-medium">
                {c}
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-lg font-semibold">
            The more useful information your business can provide, the more opportunity it has to become part of the
            answer.
          </p>
        </section>

        {/* ===== Section 4 — What we build ===== */}
        <section className="py-16 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">We turn websites into tools customers can actually use.</h2>
          <p className="mt-6 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
            Instead of a website that simply says:
          </p>
          <p style={{ background: t.surfaceAlt, borderColor: t.border }} className="mt-3 max-w-md rounded-xl border px-5 py-3 text-sm italic" >
            &ldquo;Contact us for a quote.&rdquo;
          </p>
          <p className="mt-6 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
            we can build a system that helps the customer start solving the problem immediately. Depending on the
            business, customers may be able to:
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Upload a plan or image", "Measure a project", "Calculate quantities", "Select products", "Apply pricing", "Add labour", "Add waste", "Generate an estimate", "Create a quote", "Send a complete job to the supplier"].map((c) => (
              <span key={c} style={{ background: t.surface, borderColor: t.border, color: t.text }} className="rounded-full border px-4 py-2 text-sm">
                {c}
              </span>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-base leading-7">
            <span style={{ color: t.muted }}>The exact tool changes from business to business. The goal stays the same:</span>{" "}
            <strong>give people the answer faster, make it easier to buy, and reduce the amount of manual work required
            from your team.</strong>
          </p>
        </section>

        {/* ===== Section 5 — Demos ===== */}
        <section id="demos" className="scroll-mt-20 py-16 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">See what this looks like in practice.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
            These are live tools built for real trades and suppliers — open any of them and try it yourself.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {DEMOS.map((d) => (
              <div key={d.name} style={{ background: t.surface, borderColor: t.border }} className="flex flex-col rounded-2xl border p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: t.accent }}>{d.trade}</p>
                <h3 className="mt-2 text-lg font-semibold">{d.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-6" style={{ color: t.muted }}>{d.problem}</p>
                <a
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("solution_demo_open", { demo: d.name })}
                  style={{ background: t.accent, color: t.accentText }}
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold"
                >
                  Try the demo ↗
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Section 6 — Who uses the system ===== */}
        <section id="who" className="scroll-mt-20 py-16 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">One system. Four winners.</h2>

          <div className="mt-8 flex flex-wrap gap-2">
            {([["ai", "AI & Search"], ["customers", "Customers"], ["contractors", "Contractors"], ["team", "Your Team"]] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setTab(key); trackEvent("solution_tab", { tab: key }); }}
                style={tab === key ? { background: t.accent, color: t.accentText, borderColor: t.accent } : { border: `1px solid ${t.border}`, color: t.muted }}
                className="rounded-full border px-5 py-2 text-sm font-medium"
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ background: t.surface, borderColor: t.border }} className="mt-6 rounded-2xl border p-6 sm:p-10">
            {tab === "ai" && (
              <div>
                <h3 className="text-2xl font-semibold">Give AI useful information to work with.</h3>
                <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
                  We structure tools and information so they are easy for machines to understand. Where AI systems can
                  access that information, your products, pricing, calculations, technical knowledge and supporting
                  content can help them build better answers and reference your business as the source.
                </p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {["Better product information", "Accessible pricing", "Useful calculations", "Stronger technical content", "Original data", "More reasons to reference the business"].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm" style={{ color: t.muted }}>
                      <span style={{ color: t.accent }} className="font-bold">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === "customers" && (
              <div>
                <h3 className="text-2xl font-semibold">Give customers the answer now.</h3>
                <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
                  Customers can work out quantities, pricing or options themselves instead of submitting a basic form
                  and waiting for your team.
                </p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {["Genuine buyers get answers faster", "Casual researchers use less staff time", "Better customer experience", "Faster path to enquiry or purchase", "More opportunities to convert before a competitor does"].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm" style={{ color: t.muted }}>
                      <span style={{ color: t.accent }} className="font-bold">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === "contractors" && (
              <div>
                <h3 className="text-2xl font-semibold">Give contractors a reason to keep quoting with your products.</h3>
                <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
                  The same tools can be good enough for contractors to measure, price and quote their own work:
                  measure the job, calculate materials, use your products and pricing, apply their own labour and
                  waste, and generate a quote for their customer.
                </p>
                <p style={{ background: t.accentSoft }} className="mt-6 rounded-xl px-5 py-4 text-base font-semibold">
                  &ldquo;Use our system to quote your jobs.&rdquo; If a contractor is already using the supplier&apos;s
                  products and pricing to build the quote, the supplier is naturally closer to the final material
                  purchase.
                </p>
              </div>
            )}
            {tab === "team" && (
              <div>
                <h3 className="text-2xl font-semibold">Make the same system useful for your own quoting team.</h3>
                <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
                  If the system is good enough for customers and contractors to quote with, it can also be tailored
                  for the supplier&apos;s own staff — staff logins, trade pricing, customer-specific discounts,
                  internal margins, pricing rules, user permissions, custom quote workflows and internal product
                  combinations.
                </p>
                <p className="mt-6 text-base" style={{ color: t.muted }}>
                  The goal is not another disconnected piece of software. The goal is to make the way the team already
                  quotes: <strong style={{ color: t.text }}>faster, easier, more consistent.</strong>
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ===== Section 7 — Second qualification ===== */}
        <section className="py-16 sm:py-20">
          <div style={{ background: t.accentSoft, borderColor: t.accent }} className="rounded-2xl border p-8 text-center sm:p-12">
            <p className="mx-auto max-w-3xl text-2xl font-bold leading-snug sm:text-3xl">
              If a customer could work out the right quantities, get useful pricing and send you a much more complete
              job before your team touched the enquiry — would that save your team time or help you win more work?
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => { trackEvent("solution_qualify_2", { answer: "yes" }); scrollToId("phases"); }}
                style={{ background: t.accent, color: t.accentText }}
                className="rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                Yes — definitely
              </button>
              <button
                onClick={() => { trackEvent("solution_qualify_2", { answer: "probably" }); scrollToId("phases"); }}
                style={{ border: `1px solid ${t.border}` }}
                className="rounded-full px-6 py-2.5 text-sm font-medium"
              >
                It probably would
              </button>
            </div>
          </div>
        </section>

        {/* ===== Sections 8-9 — Phase One / Phase Two ===== */}
        <section id="phases" className="scroll-mt-20 py-16 sm:py-20">
          <div className="grid gap-6 lg:grid-cols-2">
            <div style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-6 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: t.accent }}>Phase One</p>
              <h3 className="mt-3 text-2xl font-bold">Make the business more useful now.</h3>
              <p className="mt-4 text-base leading-7" style={{ color: t.muted }}>
                The first phase focuses on immediate commercial improvements: give customers answers faster, convert
                more visitors, generate better enquiries, reduce staff workload, speed up quoting, make products
                easier to buy and help contractors quote with your products.
              </p>
              <p className="mt-6 text-lg font-semibold">More customers. Faster sales. Less manual work.</p>
            </div>
            <div style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-6 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: t.accent }}>Phase Two</p>
              <h3 className="mt-3 text-2xl font-bold">Turn usage into a competitive advantage.</h3>
              <p className="mt-4 text-base leading-7" style={{ color: t.muted }}>
                Once customers, contractors and staff start using the tools, the business builds valuable information
                of its own: products people are pricing, project sizes, quantities, combinations, locations, common
                questions and demand patterns. That becomes industry reports, pricing resources, guides and
                calculators based on real activity — not generic content anyone could create.
              </p>
              <p className="mt-6 text-base font-semibold">
                That gives customers, search engines and AI more reasons to trust and reference your business.
              </p>
            </div>
          </div>

          {/* Compounding loop */}
          <div style={{ background: t.surfaceAlt, borderColor: t.border }} className="mt-6 rounded-2xl border p-6 sm:p-10">
            <h3 className="text-center text-2xl font-bold">The advantage compounds.</h3>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {["Useful Tools", "More Users", "More Data", "Better Information", "More Authority", "More Visibility", "More Customers"].map((s, i, arr) => (
                <span key={s} className="flex items-center gap-2 sm:gap-3">
                  <span style={{ background: i === 0 ? t.accent : t.surface, color: i === 0 ? t.accentText : t.text, borderColor: t.border }} className="rounded-full border px-4 py-2 text-sm font-medium">
                    {s}
                  </span>
                  <span style={{ color: t.accent }} className="text-xs">{i < arr.length - 1 ? "→" : "↺"}</span>
                </span>
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6" style={{ color: t.muted }}>
              The long-term goal is to make the business one of the strongest sources in its niche — so that when a
              customer asks AI about that product or market, the business has supplied more of the useful information
              than its competitors have.
            </p>
          </div>
        </section>

        {/* ===== Section 11 — Benefits ===== */}
        <section className="py-16 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What this can improve</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Visibility", items: ["Get found by more potential customers", "Increase visibility in AI-generated answers", "Build stronger search authority", "Become a stronger source in your niche", "Differentiate from competitors"] },
              { title: "Conversion", items: ["Give customers instant answers", "Make pricing easier to access", "Convert more visitors into buyers", "Respond faster than competitors", "Improve the buying experience"] },
              { title: "Efficiency", items: ["Reduce low-quality enquiries", "Reduce staff back-and-forth", "Save staff quoting time", "Improve enquiry quality", "Speed up the sales process"] },
              { title: "Trade customers", items: ["Help contractors quote jobs", "Encourage use of your products", "Give trade customers quoting tools", "Make repeat quoting easier"] },
              { title: "Data", items: ["Capture useful project data", "Identify customer demand", "Create proprietary industry information", "Build content from real activity", "Create a long-term information advantage"] },
              { title: "Your team", items: ["Faster, more consistent quoting", "Fewer repetitive admin tasks", "One connected system instead of disconnected tools", "Staff focus on valuable work"] },
            ].map((g) => (
              <div key={g.title} style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-6">
                <h3 className="text-lg font-semibold">{g.title}</h3>
                <ul className="mt-4 space-y-2">
                  {g.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm leading-6" style={{ color: t.muted }}>
                      <span style={{ color: t.accent }} className="font-bold">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Section 12 — Flexible scope ===== */}
        <section id="start-small" className="scroll-mt-20 py-16 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start with what makes sense for your business.</h2>
          <p className="mt-6 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
            This does not need to begin as a large platform. We can start with the simplest commercial opportunity and
            expand from there. Commercial and payment structures can also be tailored around the project.
          </p>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              { n: "1", title: "One useful tool", body: "A focused calculator, estimator or quoting tool designed to solve one clear problem." },
              { n: "2", title: "Connected sales tools", body: "Multiple tools working together across pricing, estimating, quoting or customer journeys." },
              { n: "3", title: "Bespoke platform", body: "A deeper system tailored around customers, contractors, staff, pricing, workflows and business rules." },
            ].map((s) => (
              <div key={s.n} style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-6">
                <span style={{ background: t.accentSoft, color: t.accent }} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
                  {s.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>{s.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-base font-semibold">
            The starting point is simply finding the easiest place to create meaningful value.
          </p>
        </section>

        {/* ===== Section 15 — Final CTA ===== */}
        <section className="py-20 sm:py-28">
          <div style={{ background: t.accentSoft, borderColor: t.accent }} className="rounded-2xl border p-8 text-center sm:p-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start with your current process.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
              You do not need to know which tool you need. Show us how customers currently find you, work out what
              they need, get pricing and place orders — and how your team handles those enquiries. We&apos;ll look for
              the simplest opportunities to remove friction, save time, improve conversion and strengthen your
              position online.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("solution_cta_click", { location: "final" })}
                style={{ background: t.accent, color: t.accentText }}
                className="inline-flex min-h-12 items-center justify-center rounded-full px-8 text-base font-semibold"
              >
                Show us your current process
              </a>
              <button
                onClick={() => { trackEvent("solution_demo_cta", { location: "final" }); scrollToId("demos"); }}
                style={{ border: `1px solid ${t.border}` }}
                className="inline-flex min-h-12 items-center justify-center rounded-full px-8 text-base font-medium"
              >
                Try the demo tools
              </button>
            </div>
            <p className="mt-6 text-xs" style={{ color: t.muted }}>
              Projects can range from a single focused tool to a fully bespoke platform, with flexible commercial
              options available.
            </p>
          </div>
        </section>

        <footer style={{ borderColor: t.border }} className="border-t py-8 text-center text-sm" >
          <a href="https://www.t3labs.tech" style={{ color: t.muted }} className="hover:opacity-70">
            ← t3labs.tech — We remove your headache
          </a>
        </footer>
      </div>

      {/* Mobile sticky bottom CTA */}
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("solution_cta_click", { location: "mobile_sticky" })}
        style={{ background: t.accent, color: t.accentText }}
        className="fixed inset-x-4 bottom-4 z-50 flex min-h-12 items-center justify-center rounded-full text-sm font-semibold shadow-lg sm:hidden"
      >
        Show us your current process
      </a>
      <div className="h-16 sm:hidden" />
    </main>
  );
}
