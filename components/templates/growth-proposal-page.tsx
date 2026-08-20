"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GrowthBlock, GrowthProposalConfig } from "@/sites/types";

/**
 * GROWTH PROPOSAL PAGE
 *
 * Text-led proposal renderer built from config-driven content blocks.
 * T3 Labs theme with dark/light toggle (persisted per prospect).
 * Dark: #0a0b10 base, #d7ff00 lime accent. Light: #fbfcff base, olive accent.
 */

type Theme = "dark" | "light";

type ThemeTokens = {
  page: string;
  headerCard: string;
  headerText: string;
  sectionCard: string;
  sectionBorder: string;
  heading: string;
  body: string;
  muted: string;
  faint: string;
  chip: string;
  itemCard: string;
  checkColor: string;
  quote: string;
  toolCard: string;
  toolNum: string;
  ctaSection: string;
  ctaPrimary: string;
  ctaSecondary: string;
  divider: string;
  heroGlow: string;
};

const dark: ThemeTokens = {
  page: "bg-[#0a0b10] text-[#e8eaf0]",
  headerCard: "border-white/10 bg-white/[0.04] backdrop-blur",
  headerText: "text-white/70",
  sectionCard: "bg-white/[0.03]",
  sectionBorder: "border-white/10",
  heading: "text-white",
  body: "text-white/70",
  muted: "text-white/85",
  faint: "text-white/40",
  chip: "border-[#d7ff00]/30 bg-[#d7ff00]/[0.07] text-[#eaffa0]",
  itemCard: "border-white/10 bg-white/[0.03] text-white/85",
  checkColor: "text-[#d7ff00]",
  quote: "border-[#d7ff00] bg-[#d7ff00]/[0.05] text-white",
  toolCard: "border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent",
  toolNum: "text-[#d7ff00]",
  ctaSection: "border-[#d7ff00]/25 bg-[radial-gradient(circle_at_50%_0%,rgba(215,255,0,0.1),transparent_22rem)]",
  ctaPrimary: "bg-[#d7ff00] text-[#0a0b10] shadow-[0_14px_30px_rgba(215,255,0,0.18)]",
  ctaSecondary: "border-white/20 text-white hover:border-white/40",
  divider: "bg-[#d7ff00]",
  heroGlow: "bg-[radial-gradient(circle_at_85%_10%,rgba(215,255,0,0.08),transparent_24rem)]",
};

const light: ThemeTokens = {
  page: "bg-[#fbfcff] text-[#0a0b10]",
  headerCard: "border-[#e7e9ef] bg-white shadow-[0_8px_28px_rgba(24,31,51,0.06)]",
  headerText: "text-[#424657]",
  sectionCard: "bg-white shadow-[0_8px_28px_rgba(24,31,51,0.05)]",
  sectionBorder: "border-[#e7e9ef]",
  heading: "text-[#0a0b10]",
  body: "text-[#3e4352]",
  muted: "text-[#252933]",
  faint: "text-[#707582]",
  chip: "border-[#809100]/30 bg-[#d7ff00]/[0.35] text-[#4d5900]",
  itemCard: "border-[#e7e9ef] bg-[#fbfcff] text-[#252933]",
  checkColor: "text-[#809100]",
  quote: "border-[#809000] bg-[#d7ff00]/[0.18] text-[#0a0b10]",
  toolCard: "border-[#e7e9ef] bg-gradient-to-b from-[#f4ffd6]/60 to-transparent",
  toolNum: "text-[#809000]",
  ctaSection: "border-[#809000]/25 bg-[radial-gradient(circle_at_50%_0%,rgba(150,180,0,0.1),transparent_22rem)]",
  ctaPrimary: "bg-[#0a0b10] text-[#d7ff00] shadow-[0_14px_30px_rgba(10,11,16,0.25)]",
  ctaSecondary: "border-[#0a0b10]/20 text-[#0a0b10] hover:border-[#0a0b10]/40",
  divider: "bg-[#809000]",
  heroGlow: "bg-[radial-gradient(circle_at_85%_10%,rgba(150,180,0,0.07),transparent_24rem)]",
};

function Check({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={`mt-[7px] h-4 w-4 shrink-0 ${color}`} fill="none">
      <path d="m4 10.5 4 4 8-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Lock() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <rect x="4.5" y="8" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 8V6.5a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function Sun() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Moon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <path d="M16 12.3A7 7 0 0 1 7.7 4a7 7 0 1 0 8.3 8.3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function SectionHeading({ t, children }: { t: ThemeTokens; children: React.ReactNode }) {
  return (
    <h2 className={`text-[clamp(1.4rem,3vw,2rem)] font-extrabold leading-[1.2] tracking-[-0.01em] ${t.heading}`}>
      {children}
    </h2>
  );
}

function Block({ block, t }: { block: GrowthBlock; t: ThemeTokens }) {
  if (block.type === "text") {
    return (
      <section className={`rounded-2xl border px-6 py-10 sm:px-12 ${t.sectionBorder} ${t.sectionCard}`}>
        <SectionHeading t={t}>{block.heading}</SectionHeading>
        {block.paragraphs.map((para, i) => (
          <p key={i} className={`mt-5 max-w-3xl leading-[1.75] ${t.body}`}>{para}</p>
        ))}
        {block.pullQuote ? (
          <blockquote className={`mt-8 rounded-xl border-l-4 px-6 py-5 text-[clamp(1.05rem,2vw,1.2rem)] font-semibold leading-[1.6] ${t.quote}`}>
            {block.pullQuote}
          </blockquote>
        ) : null}
      </section>
    );
  }

  if (block.type === "list") {
    return (
      <section className={`rounded-2xl border px-6 py-10 sm:px-12 ${t.sectionBorder} ${t.sectionCard}`}>
        <SectionHeading t={t}>{block.heading}</SectionHeading>
        {block.intro ? <p className={`mt-5 max-w-3xl leading-[1.75] ${t.body}`}>{block.intro}</p> : null}
        {block.paragraphs?.map((para, i) => (
          <p key={i} className={`mt-5 max-w-3xl leading-[1.75] ${t.body}`}>{para}</p>
        ))}
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {block.items.map((item) => (
            <li key={item} className={`flex items-start gap-3 rounded-xl border px-5 py-4 ${t.itemCard}`}>
              <Check color={t.checkColor} />
              <span className="leading-[1.55]">{item}</span>
            </li>
          ))}
        </ul>
        {block.closing ? <p className={`mt-6 max-w-3xl font-semibold ${t.muted}`}>{block.closing}</p> : null}
      </section>
    );
  }

  if (block.type === "groups") {
    return (
      <section className={`rounded-2xl border px-6 py-10 sm:px-12 ${t.sectionBorder} ${t.sectionCard}`}>
        <SectionHeading t={t}>{block.heading}</SectionHeading>
        {block.paragraphs?.map((para, i) => (
          <p key={i} className={`mt-5 max-w-3xl leading-[1.75] ${t.body}`}>{para}</p>
        ))}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {block.groups.map((group) => (
            <div key={group.heading} className={`rounded-xl border p-6 ${t.sectionBorder} ${t.itemCard}`}>
              <h3 className={`text-xs font-bold uppercase tracking-[0.14em] ${t.toolNum}`}>{group.heading}</h3>
              <ul className="mt-4 grid gap-2.5">
                {group.items.map((item) => (
                  <li key={item} className={`flex items-start gap-3 ${t.muted}`}>
                    <Check color={t.checkColor} />
                    <span className="leading-[1.55]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // cards
  return (
    <section className={`rounded-2xl border px-6 py-10 sm:px-12 ${t.sectionBorder} ${t.sectionCard}`}>
      <SectionHeading t={t}>{block.heading}</SectionHeading>
      {block.intro ? <p className={`mt-5 max-w-3xl leading-[1.75] ${t.body}`}>{block.intro}</p> : null}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {block.cards.map((card, i) => (
          <div key={card.title} className={`flex h-full flex-col rounded-xl border p-6 ${t.toolCard}`}>
            <span className={`text-xs font-bold ${t.toolNum}`}>0{i + 1}</span>
            <h3 className={`mt-3 font-bold leading-[1.35] ${t.heading}`}>{card.title}</h3>
            <p className={`mt-3 text-sm leading-[1.65] ${t.body}`}>{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function GrowthProposalPage({ proposal }: { proposal: GrowthProposalConfig }) {
  const p = proposal;
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem(`t3-growth-theme:${p.prospectId}`);
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, [p.prospectId]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem(`t3-growth-theme:${p.prospectId}`, next);
  };

  const t = theme === "dark" ? dark : light;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${t.page}`} style={{ fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div className="mx-auto w-[min(1180px,calc(100%-28px))] py-4 sm:w-[min(1180px,calc(100%-40px))] sm:py-6">
        <header className={`flex min-h-16 items-center justify-between gap-3 rounded-xl border px-4 sm:px-6 ${t.headerCard}`}>
          <a href="https://www.t3labs.tech/" aria-label="T3 Labs home" className="relative h-8 w-24 shrink-0">
            <Image src="/assets/t3-labs-black.png" alt="T3 Labs" fill sizes="96px" className="object-contain object-left" priority />
          </a>
          <div className={`flex items-center gap-2 text-sm font-semibold ${t.headerText}`}>
            <Lock />
            <span className="hidden sm:inline">Private growth proposal</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition ${t.sectionBorder} ${t.headerText} hover:opacity-80`}
            >
              {theme === "dark" ? <Sun /> : <Moon />}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
            <a href={p.actions.calendlyUrl} className="hidden text-sm font-semibold text-[#809000] hover:underline sm:block">
              Book a call
            </a>
          </div>
        </header>

        <main className="mt-6 grid gap-6 pb-16">
          {/* HERO */}
          <section className={`relative overflow-hidden rounded-2xl border px-6 py-12 sm:px-12 sm:py-16 ${t.sectionBorder} ${t.sectionCard} ${t.heroGlow}`}>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${t.faint}`}>{p.hero.overline}</p>
            <div className="mt-6 flex items-center gap-5">
              {p.logo ? (
                <div
                  className={`relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl shadow-sm sm:h-36 sm:w-36 ${p.logo.darkCard ? "bg-[#0a0b10]" : "bg-white"}`}
                >
                  <Image src={p.logo.src} alt={p.logo.alt} fill sizes="144px" className="object-contain p-3" priority />
                </div>
              ) : (
                <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border px-3 text-center text-[clamp(0.8rem,2vw,1.05rem)] font-black uppercase leading-[1.2] tracking-wide sm:h-28 sm:w-28 ${t.sectionBorder} ${t.muted}`}>
                  {p.companyName}
                </div>
              )}
            </div>
            <h1 className={`mt-8 max-w-2xl text-[clamp(2rem,5vw,3.4rem)] font-black leading-[1.08] tracking-[-0.02em] ${t.heading}`}>
              {p.hero.headline}
            </h1>
            <div className={`mt-6 h-1 w-10 rounded-full ${t.divider}`} />
            <p className={`mt-6 max-w-2xl text-[clamp(1.05rem,2vw,1.25rem)] leading-[1.65] ${t.body}`}>
              {p.hero.supportingCopy}
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {p.hero.metaChips.map((chip) => (
                <span key={chip} className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] ${t.chip}`}>
                  {chip}
                </span>
              ))}
            </div>
            <p className={`mt-8 flex items-center gap-2 text-xs font-medium ${t.faint}`}>
              <Lock />
              {p.hero.privacyNote}
            </p>
          </section>

          {/* CONTENT BLOCKS */}
          {p.sections.map((block) => (
            <Block key={block.heading} block={block} t={t} />
          ))}

          {/* FINAL CTA */}
          <section className={`relative overflow-hidden rounded-2xl border px-6 py-14 text-center sm:px-12 ${t.ctaSection}`}>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${t.faint}`}>Next step</p>
            <h2 className={`mx-auto mt-4 max-w-2xl text-[clamp(1.5rem,3.5vw,2.4rem)] font-extrabold leading-[1.2] ${t.heading}`}>
              Talk it through with us.
            </h2>
            <p className={`mx-auto mt-4 max-w-xl leading-[1.7] ${t.body}`}>
              We&apos;ll walk through the proposal, answer questions and agree the priorities that matter most to {p.companyName}.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={p.actions.calendlyUrl}
                className={`inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full px-[26px] py-3.5 text-[15px] font-bold transition hover:-translate-y-0.5 ${t.ctaPrimary}`}
              >
                {p.actions.ctaLabel}
                <Arrow />
              </a>
              <a
                href={p.actions.emailUrl}
                className={`inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full border px-[26px] py-3.5 text-[15px] font-semibold transition hover:-translate-y-0.5 ${t.ctaSecondary}`}
              >
                Email us instead
              </a>
            </div>
          </section>

          <footer className={`pt-4 text-center text-xs ${t.faint}`}>
            Prepared by{" "}
            <a href="https://www.t3labs.tech/" className={`font-semibold ${t.muted} hover:underline`}>
              T3 Labs
            </a>{" "}
            — private proposal for {p.companyName}
            {p.location ? ` · ${p.location}` : ""}.
          </footer>
        </main>
      </div>
    </div>
  );
}
