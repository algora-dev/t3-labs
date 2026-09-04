"use client";

import { useState } from "react";

/**
 * T3 Labs - "Become Part of the Answer" sales landing page (conversion upgrade).
 * Short by default, deep on demand: proof + detail in expandable cards.
 * Dark/light theme toggle (persisted), tokens matching growth proposal pages.
 */

type Theme = "dark" | "light";

type Tokens = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  muted: string;
  accent: string; // lime fill (both modes)
  accentText: string; // text on lime fill
  accentInk: string; // accent-colored text on page bg
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
  accentInk: "#d7ff00",
  accentSoft: "rgba(215,255,0,0.08)",
};

const light: Tokens = {
  bg: "#fbfcff",
  surface: "#ffffff",
  surfaceAlt: "#f3f5fa",
  border: "#e7e9ef",
  text: "#0a0b10",
  muted: "#5a6172",
  accent: "#d7ff00",
  accentText: "#0a0b10",
  accentInk: "#809000",
  accentSoft: "rgba(215,255,0,0.18)",
};

const BOOKING_URL = "https://calendly.com/cece-t3labs/20min";

const FEATURED_DEMOS = [
  {
    name: "Apex Roofing - Supplier Pricing Tool",
    problem: "Let customers measure a job, calculate quantities and apply supplier pricing before your team needs to touch the enquiry.",
    href: "/supplier-pricing-tool/apex-roofing",
  },
  {
    name: "Oakline Flooring - Supplier Pricing Tool",
    problem: "Let flooring customers estimate a room, apply pricing and send a much more complete enquiry to the supplier.",
    href: "/supplier-pricing-tool/oakline-flooring",
  },
  {
    name: "Free Roof Takeoff Builder",
    problem: "Give customers useful measurements and quantities immediately instead of making them wait for a reply.",
    href: "https://quote-core.com/free-roofing-takeoff-builder",
  },
];

const ALL_DEMOS = [
  ...FEATURED_DEMOS,
  {
    name: "Vertex Cladding - Supplier Pricing Tool",
    problem: "Let cladding customers work out sheet quantities and pricing themselves instead of waiting for a quote.",
    href: "/supplier-pricing-tool/vertex-cladding",
  },
  {
    name: "Free Quote Generator",
    problem: "Give customers a formatted, professional quote document immediately - no account, no waiting.",
    href: "https://quote-core.com/free-quote-generator",
  },
  {
    name: "Free Construction Calculator",
    problem: "Give buyers useful quantities and pricing instantly instead of making them wait for a reply.",
    href: "https://quote-core.com/free-construction-calculator",
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

/** Expandable card - collapsed headline/stat stays in DOM; expanded content rendered but visually hidden until open (crawlable). */
function ExpandCard({
  t,
  id,
  headline,
  stat,
  source,
  children,
}: {
  t: Tokens;
  id: string;
  headline: string;
  stat: React.ReactNode;
  source: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border">
      <button
        onClick={() => { setOpen(!open); if (!open) trackEvent("solution_card_expand", { card: id }); }}
        aria-expanded={open}
        className="card-toggle flex w-full cursor-pointer items-start justify-between gap-4 p-6 text-left"
      >
        <div>
          <p className="text-base font-semibold">{headline}</p>
          <p className="proof-stat mt-2 text-sm leading-6" style={{ color: t.muted }}>{stat}</p>
          {source ? <p className="mt-2 text-xs font-semibold uppercase tracking-wide" style={{ color: t.accentInk }}>Source: {source}</p> : null}
        </div>
        <span style={{ color: t.accentInk }} className={`mt-1 shrink-0 text-lg transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>
      <div hidden={!open} className="px-6 pb-6">
        <div className="border-t pt-4 text-sm leading-7" style={{ borderColor: t.border, color: t.muted }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function OurSolutionPage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [tab, setTab] = useState<"ai" | "customers" | "contractors" | "team">("ai");
  const [showAllDemos, setShowAllDemos] = useState(false);
  const t = theme === "dark" ? dark : light;

  const tabOrder = ["ai", "customers", "contractors", "team"] as const;
  const tabLabels: Record<string, string> = { ai: "AI & Search", customers: "Customers", contractors: "Contractors", team: "Your Team" };
  const tabIndex = tabOrder.indexOf(tab);
  const switchTab = (dir: 1 | -1) => {
    const next = tabOrder[(tabIndex + dir + tabOrder.length) % tabOrder.length];
    setTab(next);
    trackEvent("solution_carousel", { tab: next, dir: dir === 1 ? "next" : "prev" });
  };

  const switchTheme = (next: Theme) => {
    setTheme(next);
    window.localStorage.setItem("t3-solution-theme", next);
  };

  return (
    <main
      style={{ background: t.bg, color: t.text, ["--t-accent-ink" as string]: t.accentInk, ["--t-accent" as string]: t.accent }}
      className="min-h-screen antialiased transition-colors duration-200 [button]:cursor-pointer [a]:cursor-pointer"
    >
      <style>{`
        main button, main a, main [role="button"], main summary { cursor: pointer; }
        main button, main a { transition: filter .15s ease, transform .15s ease, opacity .15s ease, border-color .15s ease, background-color .15s ease, box-shadow .15s ease; }
        .btn-solid:hover { filter: brightness(1.12); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(215,255,0,0.28); }
        .btn-solid:active { transform: translateY(0); filter: brightness(0.97); }
        .btn-outline:hover { border-color: var(--t-accent-ink) !important; transform: translateY(-1px); }
        .btn-soft:hover { background-color: var(--t-accent-ink) !important; color: ${t.accentText} !important; }
        .hover-card:hover { transform: translateY(-2px); border-color: var(--t-accent-ink) !important; }
        .card-toggle:hover { background-color: rgba(127,127,127,0.06); }
        .proof-stat strong { color: var(--t-accent-ink); }
      `}</style>
      {/* ===== Sticky header ===== */}
      <header
        style={{ background: theme === "dark" ? "rgba(10,11,16,0.85)" : "rgba(251,252,255,0.92)", borderColor: t.border }}
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
              onClick={() => switchTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle light or dark theme"
              style={{ border: `1px solid ${t.border}`, color: t.muted }}
              className="btn-outline rounded-full px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-70"
            >
              {theme === "dark" ? "☀ Light" : "☾ Dark"}
            </button>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("solution_cta_click", { location: "sticky" })}
              style={{ background: t.accent, color: t.accentText }}
              className="btn-solid hidden rounded-full px-4 py-1.5 text-xs font-semibold sm:inline-block"
            >
              Show us your current process
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5">
        {/* ===== 1. Hero ===== */}
        <section className="py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: t.accentInk }}>
            How customers buy is changing
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            People now expect the answer immediately.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8" style={{ color: t.muted }}>
            AI is increasingly giving customers those answers before they ever visit a website.
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-8" style={{ color: t.muted }}>
            We help make your business part of the answer - and give customers, contractors and your own team tools
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
                className="btn-solid rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                Yes, I do this
              </button>
              <button
                onClick={() => { trackEvent("solution_qualify_1", { answer: "seen" }); scrollToId("shift"); }}
                style={{ border: `1px solid ${t.border}`, color: t.text }}
                className="btn-outline rounded-full px-6 py-2.5 text-sm font-medium"
              >
                I&apos;ve seen people doing this
              </button>
            </div>
          </div>

          {/* Cold-traffic CTA priority: see how it works first */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => { trackEvent("solution_cta_click", { location: "hero_see_how" }); scrollToId("shift"); }}
              style={{ background: t.accent, color: t.accentText }}
              className="btn-solid inline-flex min-h-12 items-center justify-center rounded-full px-8 text-base font-semibold"
            >
              See how it works
            </button>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("solution_cta_click", { location: "hero" })}
              style={{ border: `1px solid ${t.border}` }}
              className="btn-outline inline-flex min-h-12 items-center justify-center rounded-full px-8 text-base font-medium"
            >
              Show us your current process
            </a>
          </div>
        </section>

        {/* ===== 2. Old Way vs AI Way ===== */}
        <section id="shift" className="scroll-mt-20 py-16 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">The way people find answers is changing.</h2>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-6 text-center sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: t.muted }}>The old way</p>
              <div className="mx-auto mt-6 max-w-xs space-y-3">
                {["Search (2-3 keywords)", "Visit several websites", "Compare products", "Find pricing", "Make enquiries", "Wait for replies", "Work out the answer yourself"].map((s, i, arr) => (
                  <div key={s}>
                    <p style={{ background: t.surfaceAlt }} className="rounded-xl px-4 py-2.5 text-sm font-medium">{s}</p>
                    {i < arr.length - 1 && <p style={{ color: t.muted }} className="py-0.5 text-center text-xs">↓</p>}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: t.accentSoft, borderColor: t.accentInk }} className="rounded-2xl border p-6 text-center sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: t.accentInk }}>The new way</p>
              <div className="mx-auto mt-6 max-w-xs space-y-3">
                {["Ask AI your question, in full", "AI searches for useful information", "AI compares the options", "AI builds the answer", "The customer gets a result immediately"].map((s, i, arr) => (
                  <div key={s}>
                    <p style={{ background: t.surface }} className="rounded-xl px-4 py-2.5 text-sm font-medium">{s}</p>
                    {i < arr.length - 1 && <p style={{ color: t.accentInk }} className="py-0.5 text-center text-xs">↓</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
            The customer is doing less of the research themselves. AI is increasingly doing more of it for them.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
            In many cases the customer no longer needs to leave the AI page at all: AI is creating the solution right
            there. And when the next step is a link, those are the links that get clicked.
          </p>
        </section>

        {/* ===== 3. NEW - Proof: this is already happening ===== */}
        <section className="py-16 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">This is already happening.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
            These are not predictions about a distant future. Search behaviour and buying behaviour are already changing.
          </p>

          <div className="mt-8 space-y-4">
            <ExpandCard
              t={t}
              id="google_ai_mode"
              headline="People are asking AI more detailed questions."
              stat={<>Google says the average AI Mode query is now <strong>around 3× longer</strong> than a traditional Search query.</>}
              source="Google"
            >
              <p>
                Google says people are using AI Mode for more complex, multi-part questions, and that the average AI
                Mode query is approximately triple the length of a traditional Google Search query. That supports the
                shift from short keyword searches such as:
              </p>
              <p className="italic">&ldquo;roof suppliers Christchurch&rdquo;</p>
              <p>towards more conversational requests such as:</p>
              <p className="italic">
                &ldquo;I need to replace a metal tile roof on a roughly 180m² house in Christchurch. What should it
                cost, what products should I consider, and which suppliers look trustworthy?&rdquo;
              </p>
              <p>This is the type of buying journey T3 Labs designs for.</p>
              <a
                href="https://blog.google/products-and-platforms/products/search/ai-mode-us-insights/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("solution_source_click", { source: "google_ai_mode" })}
                style={{ color: t.accentInk }}
                className="mt-2 inline-block font-semibold hover:underline"
              >
                Read Google&apos;s research →
              </a>
            </ExpandCard>

            <ExpandCard
              t={t}
              id="invoca_genai"
              headline="AI is already part of the buying journey."
              stat={<>In a 2026 US/UK home-services study, <strong>63% of consumers surveyed</strong> said they used generative AI to research a high-stakes purchase - up from <strong>46% in 2025</strong>, and likely to keep increasing each year.</>}
              source="Invoca, 2026"
            >
              <p>
                Invoca&apos;s 2026 Home Services Buyer Experience Report found that 63% of the US and UK home-services
                consumers in its sample had used tools such as ChatGPT, Gemini or Claude to research a high-stakes
                purchase - up 17 percentage points from the previous year.
              </p>
              <p>
                This is survey evidence of a direction of travel, not a claim that 63% of all consumers everywhere
                behave this way.
              </p>
              <a
                href="https://www.invoca.com/uk/reports/home-services-buyer-experience-report-2026"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("solution_source_click", { source: "invoca_genai" })}
                style={{ color: t.accentInk }}
                className="mt-2 inline-block font-semibold hover:underline"
              >
                View the research →
              </a>
            </ExpandCard>

            <ExpandCard
              t={t}
              id="invoca_speed"
              headline="Customers are willing to move to whoever answers faster."
              stat={<>In the same 2026 home-services study, <strong>79%</strong> of consumers surveyed said they would switch to a competitor that responds faster.</>}
              source="Invoca, 2026"
            >
              <p>
                The same research found that 79% of surveyed US and UK home-services consumers would switch to a
                competitor that responds faster, and that <strong>26% had called a business because information they
                needed was not available online</strong>.
              </p>
              <p>
                Speed matters, and customers are willing to change provider when another business answers faster. Our
                approach gives customers more of the answer before they need to call, email or wait for somebody to
                respond.
              </p>
              <a
                href="https://www.invoca.com/uk/reports/home-services-buyer-experience-report-2026"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("solution_source_click", { source: "invoca_speed" })}
                style={{ color: t.accentInk }}
                className="mt-2 inline-block font-semibold hover:underline"
              >
                View the research →
              </a>
            </ExpandCard>
          </div>
        </section>

        {/* ===== 4. Qualification ===== */}
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
              <div key={c} style={{ background: t.surface, borderColor: t.border }} className="rounded-xl border px-4 py-4 text-center text-sm font-medium">
                {c}
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
            If the answer is &ldquo;not much&rdquo;, a competitor that publishes more useful information has an
            opportunity you don&apos;t.{" "}
            <strong style={{ color: t.text }}>The more useful information your business can provide, the more
            opportunity it has to become part of the answer.</strong>
          </p>
        </section>

        {/* ===== 5. What we build ===== */}
        <section className="py-16 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">We turn websites into tools customers can actually use.</h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Answer Faster", body: "Give customers useful information without unnecessary waiting." },
              { title: "Quote Easier", body: "Help customers, contractors and staff calculate and quote more efficiently." },
              { title: "Send Better Enquiries", body: "Collect more useful project information before the job reaches the team." },
            ].map((o) => (
              <div key={o.title} style={{ background: t.accentSoft, borderColor: t.accentInk }} className="hover-card rounded-2xl border p-6">
                <h3 className="text-lg font-semibold">{o.title}</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: t.muted }}>{o.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
            Instead of a website that simply says:
          </p>
          <p style={{ background: t.surfaceAlt, borderColor: t.border }} className="mt-3 max-w-md rounded-xl border px-5 py-3 text-sm italic">
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

        {/* ===== 6. Demos ===== */}
        <section id="demos" className="scroll-mt-20 py-16 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">See what this looks like in practice.</h2>
          <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
            These are live tools built for real trades and suppliers - open any of them and try it yourself.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {(showAllDemos ? ALL_DEMOS : FEATURED_DEMOS).map((d) => (
              <div key={d.name} style={{ background: t.surface, borderColor: t.border }} className="hover-card flex flex-col rounded-2xl border p-6">
                <h3 className="text-lg font-semibold">{d.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-6" style={{ color: t.muted }}>{d.problem}</p>
                <a
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("solution_demo_open", { demo: d.name })}
                  style={{ background: t.accent, color: t.accentText }}
                  className="btn-solid mt-5 inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-semibold"
                >
                  Try the demo ↗
                </a>
              </div>
            ))}
          </div>

          <button
            onClick={() => { setShowAllDemos(!showAllDemos); trackEvent("solution_see_all_demos", { expanded: String(!showAllDemos) }); }}
            style={{ color: t.accentInk }}
            className="mt-8 text-sm font-semibold hover:underline"
          >
            {showAllDemos ? "Show fewer demo tools →" : "See all demo tools →"}
          </button>
        </section>

        {/* ===== 7. Four ways the system creates value ===== */}
        <section id="who" className="scroll-mt-20 py-16 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">One system. Four ways it creates value.</h2>

          {/* Carousel controls - large arrows so it's obvious you can move between audiences */}
          <div className="mt-8 flex items-center justify-between gap-3 sm:gap-6">
            <button
              onClick={() => switchTab(-1)}
              aria-label="Previous audience"
              style={{ background: t.accent, color: t.accentText }}
              className="btn-solid flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl font-bold leading-none"
            >
              ←
            </button>
            <div className="min-w-0 flex-1 text-center">
              <p className="truncate text-lg font-semibold">{tabLabels[tab]}</p>
              <p className="mt-1 text-xs" style={{ color: t.muted }}>
                {tabIndex + 1} of {tabOrder.length} · use the arrows to see who benefits
              </p>
            </div>
            <button
              onClick={() => switchTab(1)}
              aria-label="Next audience"
              style={{ background: t.accent, color: t.accentText }}
              className="btn-solid flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl font-bold leading-none"
            >
              →
            </button>
          </div>

          <div style={{ background: t.surface, borderColor: t.border }} className="mt-6 rounded-2xl border p-6 sm:p-10">
            {tab === "ai" && (
              <div>
                <h3 className="text-2xl font-semibold">Give AI useful information to work with.</h3>
                <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
                  We structure tools and supporting information so they are easier for search engines and AI systems
                  to understand and access. Where these systems can use that information, your products, pricing,
                  calculations, technical knowledge and original data can help them build better answers and reference
                  your business as a source.
                </p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {["Better product information", "Accessible pricing", "Useful calculations", "Stronger technical content", "Original data", "More reasons to reference the business"].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm" style={{ color: t.muted }}>
                      <span style={{ color: t.accentInk }} className="font-bold">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === "customers" && (
              <div>
                <h3 className="text-2xl font-semibold">Give customers the answer now.</h3>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {["Faster answers for genuine buyers", "Useful pricing without waiting", "Self-service for casual researchers", "Stronger next step for serious buyers", "A better chance of converting before a competitor responds"].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm" style={{ color: t.muted }}>
                      <span style={{ color: t.accentInk }} className="font-bold">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {tab === "contractors" && (
              <div>
                <h3 className="text-2xl font-semibold">Give contractors a reason to keep quoting with your products.</h3>
                <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
                  The same tools let contractors measure the job, calculate materials, apply your products and pricing,
                  add their own labour and waste, and produce a quote for their customer - which naturally connects the
                  material purchase to the supplier.
                </p>
                <p style={{ background: t.accentSoft }} className="mt-6 rounded-xl px-5 py-4 text-base font-semibold">
                  &ldquo;Use our system to quote your jobs.&rdquo;
                </p>
              </div>
            )}
            {tab === "team" && (
              <div>
                <h3 className="text-2xl font-semibold">Make the same system useful for your own quoting team.</h3>
                <p className="mt-4 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
                  If the system is good enough for customers and contractors to quote with, it can also be tailored
                  around how your own team quotes.
                </p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-3">
                  {["Staff logins", "Internal pricing", "Trade pricing", "Customer-specific pricing", "Margin rules", "Custom workflows", "Different permissions", "Faster quote creation", "More consistent quoting"].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm" style={{ color: t.muted }}>
                      <span style={{ color: t.accentInk }} className="font-bold">✓</span> {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-base font-semibold">
                  The goal is not to replace the team. It is to remove repetitive work so the team can spend more time
                  on the work that actually needs them.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ===== 8. Second qualification ===== */}
        <section className="py-16 sm:py-20">
          <div style={{ background: t.accentSoft, borderColor: t.accentInk }} className="rounded-2xl border p-8 text-center sm:p-12">
            <p className="mx-auto max-w-3xl text-2xl font-bold leading-snug sm:text-3xl">
              If a customer could work out the right quantities, get useful pricing and send you a much more complete
              job before your team touched the enquiry - would that save your team time or help you win more work?
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => { trackEvent("solution_qualify_2", { answer: "yes" }); scrollToId("phases"); }}
                style={{ background: t.accent, color: t.accentText }}
                className="btn-solid rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                Yes - definitely
              </button>
              <button
                onClick={() => { trackEvent("solution_qualify_2", { answer: "probably" }); scrollToId("phases"); }}
                style={{ border: `1px solid ${t.border}` }}
                className="btn-outline rounded-full px-6 py-2.5 text-sm font-medium"
              >
                It probably would
              </button>
            </div>
          </div>
        </section>

        {/* ===== 9. Phase One + 10. speed proof ===== */}
        <section id="phases" className="scroll-mt-20 py-16 sm:py-20">
          <div className="grid gap-6 lg:grid-cols-2">
            <div style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-6 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: t.accentInk }}>Phase One</p>
              <h3 className="mt-3 text-2xl font-bold">Make the business more useful now.</h3>
              <p className="mt-4 text-base leading-7" style={{ color: t.muted }}>
                The first phase focuses on immediate commercial improvements: give customers answers faster, convert
                more visitors, generate better enquiries, reduce unnecessary enquiries, speed up quoting, make products
                easier to buy and help contractors quote with your products.
              </p>
              <p className="mt-4 text-base leading-7" style={{ color: t.muted }}>
                Better enquiries arrive with more of the information your staff need to actually quote or sell. This
                removes repetitive work so your existing team can spend more time on valuable quoting, sales and
                customer service.
              </p>
              <p className="mt-6 text-lg font-semibold">More customers. Faster sales. Less manual work.</p>
            </div>
            <div style={{ background: t.surface, borderColor: t.border }} className="rounded-2xl border p-6 sm:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: t.accentInk }}>Phase Two</p>
              <h3 className="mt-3 text-2xl font-bold">Turn usage into a competitive advantage.</h3>
              <p className="mt-4 text-base leading-7" style={{ color: t.muted }}>
                Once customers, contractors and staff start using the tools, the business learns things such as: what
                products people price, project sizes, material quantities, product combinations, locations, common
                questions, pricing trends and demand patterns.
              </p>
              <p className="mt-4 text-base leading-7" style={{ color: t.muted }}>
                That becomes pricing resources, industry reports, product guides, technical resources, new calculators
                and market insights.
              </p>
              <p className="mt-6 text-base font-semibold">
                Instead of publishing generic content that anybody could create, the business can publish information
                based on its own products, expertise and real-world activity.
              </p>
            </div>
          </div>

          {/* Compact speed / information-gap proof strip */}
          <div className="mt-6">
            <ExpandCard
              t={t}
              id="speed_gap"
              headline="Customers do not want to wait for basic information."
              stat={<><strong>79%</strong> of surveyed US and UK home-services consumers said they would switch to a competitor that responds faster. <strong>26%</strong> had called a business because the information they needed was not available online.</>}
              source="Invoca, 2026"
            >
              <p>Our approach is simple: give customers more of the answer before they need to ask.</p>
              <a
                href="https://www.invoca.com/uk/reports/home-services-buyer-experience-report-2026"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("solution_source_click", { source: "invoca_speed_gap" })}
                style={{ color: t.accentInk }}
                className="mt-2 inline-block font-semibold hover:underline"
              >
                View research →
              </a>
            </ExpandCard>
          </div>

          {/* ===== 12. Google + OpenAI validation ===== */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <ExpandCard
              t={t}
              id="google_guidance"
              headline="This follows Google's own guidance for generative AI Search."
              stat={<>Google recommends creating <strong>unique, useful, non-commodity content</strong> and says its generative AI Search features retrieve relevant, up-to-date pages from the web to help ground responses.</>}
              source="Google Search Central"
            >
              <ul className="space-y-2">
                <li>Generative AI Search remains rooted in Google&apos;s Search ranking and quality systems.</li>
                <li>Google retrieves relevant, up-to-date web pages to ground AI responses.</li>
                <li>Google recommends content that is unique, useful and based on first-hand expertise or experience.</li>
                <li>Google specifically warns against simply recycling generic information that already exists elsewhere.</li>
                <li>Publicly accessible and crawlable content is important for discovery in Google&apos;s AI Search experiences.</li>
              </ul>
              <p className="mt-3">
                This aligns directly with the T3 Labs strategy: build genuinely useful tools, publish better product
                and pricing information, capture original data, and turn that into useful resources customers actually
                want. Our strategy aligns with the type of useful, original and crawlable information Google itself
                recommends.
              </p>
              <a
                href="https://developers.google.com/search/docs/fundamentals/ai-optimization-guide"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("solution_source_click", { source: "google_guidance" })}
                style={{ color: t.accentInk }}
                className="mt-2 inline-block font-semibold hover:underline"
              >
                Read Google&apos;s guidance →
              </a>
            </ExpandCard>

            <ExpandCard
              t={t}
              id="openai_guidance"
              headline="Public websites can be surfaced and cited in ChatGPT Search."
              stat={<>OpenAI says public websites can appear in ChatGPT Search and provides specific guidance for allowing its search crawler to discover, surface and cite site content.</>}
              source="OpenAI"
            >
              <p>
                OpenAI states that public websites can appear in ChatGPT Search. It advises publishers who want their
                content discoverable, surfaced and clearly cited to allow access to OAI-SearchBot. OpenAI also says
                publishers can track referral traffic coming from ChatGPT Search.
              </p>
              <p>
                This supports the basic principle that making useful public information accessible to AI and search
                systems creates an opportunity for that information - and the business behind it - to be surfaced in
                AI-led research.
              </p>
              <a
                href="https://help.openai.com/en/articles/12627856-publishers-and-developers-faq"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("solution_source_click", { source: "openai_guidance" })}
                style={{ color: t.accentInk }}
                className="mt-2 inline-block font-semibold hover:underline"
              >
                Read OpenAI guidance →
              </a>
            </ExpandCard>
          </div>

          {/* ===== 13. Compounding loop ===== */}
          <div style={{ background: t.surfaceAlt, borderColor: t.border }} className="mt-6 rounded-2xl border p-6 sm:p-10">
            <h3 className="text-center text-2xl font-bold">The advantage compounds.</h3>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {["Useful Tools", "More Users", "More Data", "Better Information", "More Authority", "More Visibility", "More Customers"].map((s, i, arr) => (
                <span key={s} className="flex items-center gap-2 sm:gap-3">
                  <span style={{ background: i === 0 ? t.accent : t.surface, color: i === 0 ? t.accentText : t.text, borderColor: t.border }} className="rounded-full border px-4 py-2 text-sm font-medium">
                    {s}
                  </span>
                  <span style={{ color: t.accentInk }} className="text-xs">{i < arr.length - 1 ? "→" : "↺"}</span>
                </span>
              ))}
            </div>
            <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-6" style={{ color: t.muted }}>
              The long-term goal is to make the business one of the strongest useful sources in its niche - so that
              when customers ask AI or search engines about that product, industry or market, the business has more
              useful information available than competitors who publish little more than generic product pages and
              quote forms.
            </p>
          </div>
        </section>

        {/* ===== 14. Benefits - 4 expandable cards ===== */}
        <section className="py-16 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What this can improve</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <ExpandCard
              t={t}
              id="benefits_found"
              headline="Get Found"
              stat={<>Make the business easier for customers, search engines and AI to understand and discover.</>}
              source=""
            >
              <ul className="space-y-2">
                {["Get found by more potential customers", "Increase opportunities to appear in AI-generated answers", "Build stronger search authority", "Publish better product and technical information", "Become a stronger source in your niche", "Differentiate from competitors"].map((b) => <li key={b}>• {b}</li>)}
              </ul>
            </ExpandCard>
            <ExpandCard
              t={t}
              id="benefits_convert"
              headline="Convert More"
              stat={<>Give buyers more of the information they need before they leave or contact a competitor.</>}
              source=""
            >
              <ul className="space-y-2">
                {["Give customers faster answers", "Make pricing easier to access", "Convert more visitors into enquiries", "Respond faster", "Improve the buying experience", "Create clearer next steps", "Help buyers understand products and quantities"].map((b) => <li key={b}>• {b}</li>)}
              </ul>
            </ExpandCard>
            <ExpandCard
              t={t}
              id="benefits_time"
              headline="Save Time"
              stat={<>Reduce repetitive work and improve the quality of the enquiries that reach the team.</>}
              source=""
            >
              <ul className="space-y-2">
                {["Reduce basic enquiries", "Reduce staff back-and-forth", "Save quoting time", "Collect better project information", "Improve enquiry quality", "Speed up quote preparation", "Let staff focus on more valuable work"].map((b) => <li key={b}>• {b}</li>)}
              </ul>
            </ExpandCard>
            <ExpandCard
              t={t}
              id="benefits_advantage"
              headline="Build an Advantage"
              stat={<>Turn tools, usage and first-party information into something competitors cannot easily copy.</>}
              source=""
            >
              <ul className="space-y-2">
                {["Capture useful project data", "Identify demand patterns", "Create proprietary industry information", "Build content from real activity", "Create useful pricing resources", "Improve contractor loyalty", "Build a longer-term information advantage"].map((b) => <li key={b}>• {b}</li>)}
              </ul>
            </ExpandCard>
          </div>
        </section>

        {/* ===== 15. Flexible scope ===== */}
        <section id="start-small" className="scroll-mt-20 py-16 sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start with what makes sense for your business.</h2>
          <p className="mt-6 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
            This does not need to begin as a large platform. We can start with the simplest commercial opportunity and
            expand from there. Commercial and payment structures can also be tailored around the opportunity.
          </p>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              { n: "1", title: "One useful tool", body: "A focused calculator, estimator or quoting tool solving one commercial problem." },
              { n: "2", title: "Connected sales tools", body: "Multiple tools working across pricing, estimating, quoting or customer journeys." },
              { n: "3", title: "Bespoke platform", body: "A deeper system tailored around customers, contractors, staff, pricing and workflows." },
            ].map((s) => (
              <div key={s.n} style={{ background: t.surface, borderColor: t.border }} className="hover-card rounded-2xl border p-6 text-center">
                <span style={{ background: t.accentSoft, color: t.accentInk }} className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold">
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

        {/* ===== 16. Final CTA ===== */}
        <section className="py-20 sm:py-28">
          <div style={{ background: t.accentSoft, borderColor: t.accentInk }} className="rounded-2xl border p-8 text-center sm:p-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start with your current process.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7" style={{ color: t.muted }}>
              You do not need to know which tool you need. Show us how customers currently find you, work out what
              they need, get pricing and place orders - and how your team handles those enquiries. We&apos;ll look for
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
                className="btn-solid inline-flex min-h-12 items-center justify-center rounded-full px-8 text-base font-semibold"
              >
                Show us your current process
              </a>
              <button
                onClick={() => { trackEvent("solution_demo_cta", { location: "final" }); scrollToId("demos"); }}
                style={{ border: `1px solid ${t.border}` }}
                className="btn-outline inline-flex min-h-12 items-center justify-center rounded-full px-8 text-base font-medium"
              >
                Try the demo tools
              </button>
            </div>
            <p className="mt-6 text-xs" style={{ color: t.muted }}>
              Projects can start with one simple commercial improvement and grow from there.
            </p>
          </div>
        </section>

        <footer style={{ borderColor: t.border }} className="border-t py-8 text-center text-sm">
          <a href="https://www.t3labs.tech" style={{ color: t.muted }} className="hover:opacity-70">
            ← t3labs.tech - We remove your headache
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
        className="btn-solid fixed inset-x-4 bottom-4 z-50 flex min-h-12 items-center justify-center rounded-full text-sm font-semibold shadow-lg sm:hidden"
      >
        Show us your current process
      </a>
      <div className="h-16 sm:hidden" />
    </main>
  );
}
