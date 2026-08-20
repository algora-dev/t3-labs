import Image from "next/image";
import type { GrowthProposalConfig } from "@/sites/types";

/**
 * GROWTH PROPOSAL PAGE
 *
 * Text-led proposal renderer (no video / concept screenshots).
 * Dark T3 Labs theme: #0a0b10 base, #d7ff00 lime accent, Inter.
 * Server component — static content only.
 */

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-[7px] h-4 w-4 shrink-0 text-[#d7ff00]" fill="none">
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-extrabold leading-[1.2] tracking-[-0.01em] text-white">
      {children}
    </h2>
  );
}

export function GrowthProposalPage({ proposal }: { proposal: GrowthProposalConfig }) {
  const p = proposal;

  return (
    <div className="min-h-screen bg-[#0a0b10] text-[#e8eaf0]" style={{ fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div className="mx-auto w-[min(1180px,calc(100%-28px))] py-4 sm:w-[min(1180px,calc(100%-40px))] sm:py-6">
        <header className="flex min-h-16 items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 backdrop-blur sm:px-6">
          <a href="https://www.t3labs.tech/" aria-label="T3 Labs home" className="relative h-8 w-24 shrink-0">
            <Image src="/assets/t3-labs-black.png" alt="T3 Labs" fill sizes="96px" className="object-contain object-left" priority />
          </a>
          <div className="flex items-center gap-2 text-sm font-semibold text-white/70">
            <Lock />
            <span>Private growth proposal</span>
          </div>
          <a href={p.actions.calendlyUrl} className="hidden text-sm font-semibold text-[#d7ff00] hover:underline sm:block">
            Book a call
          </a>
        </header>

        <main className="mt-6 grid gap-6 pb-16">
          {/* HERO */}
          <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_85%_10%,rgba(215,255,0,0.08),transparent_24rem)] px-6 py-12 sm:px-12 sm:py-16">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">{p.hero.overline}</p>
            <div className="relative mt-6 h-28 w-28 overflow-hidden rounded-2xl bg-white sm:h-36 sm:w-36">
              <Image src={p.logo.src} alt={p.logo.alt} fill sizes="144px" className="object-contain p-3" priority />
            </div>
            <h1 className="mt-8 max-w-2xl text-[clamp(2rem,5vw,3.4rem)] font-black leading-[1.08] tracking-[-0.02em] text-white">
              {p.hero.headline}
            </h1>
            <div className="mt-6 h-1 w-10 rounded-full bg-[#d7ff00]" />
            <p className="mt-6 max-w-2xl text-[clamp(1.05rem,2vw,1.25rem)] leading-[1.65] text-white/70">
              {p.hero.supportingCopy}
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {p.hero.metaChips.map((chip) => (
                <span key={chip} className="rounded-full border border-[#d7ff00]/30 bg-[#d7ff00]/[0.07] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#eaffa0]">
                  {chip}
                </span>
              ))}
            </div>
            <p className="mt-8 flex items-center gap-2 text-xs font-medium text-white/40">
              <Lock />
              {p.hero.privacyNote}
            </p>
          </section>

          {/* OPPORTUNITY */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 sm:px-12">
            <SectionHeading>{p.opportunity.heading}</SectionHeading>
            {p.opportunity.paragraphs.map((para, i) => (
              <p key={i} className="mt-5 max-w-3xl leading-[1.75] text-white/70">{para}</p>
            ))}
            <blockquote className="mt-8 rounded-xl border-l-4 border-[#d7ff00] bg-[#d7ff00]/[0.05] px-6 py-5 text-[clamp(1.05rem,2vw,1.2rem)] font-semibold leading-[1.6] text-white">
              {p.opportunity.pullQuote}
            </blockquote>
          </section>

          {/* ADVANTAGE */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 sm:px-12">
            <SectionHeading>{p.advantage.heading}</SectionHeading>
            {p.advantage.paragraphs.map((para, i) => (
              <p key={i} className="mt-5 max-w-3xl leading-[1.75] text-white/70">{para}</p>
            ))}
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {p.advantage.items.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white/85">
                  <Check />
                  <span className="leading-[1.55]">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* SEARCH REACH */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 sm:px-12">
            <SectionHeading>{p.searchReach.heading}</SectionHeading>
            {p.searchReach.paragraphs.map((para, i) => (
              <p key={i} className="mt-5 max-w-3xl leading-[1.75] text-white/70">{para}</p>
            ))}
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {p.searchReach.groups.map((group) => (
                <div key={group.heading} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#d7ff00]">{group.heading}</h3>
                  <ul className="mt-4 grid gap-2.5">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-white/85">
                        <Check />
                        <span className="leading-[1.55]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* PROJECTS */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 sm:px-12">
            <SectionHeading>{p.projects.heading}</SectionHeading>
            {p.projects.paragraphs.map((para, i) => (
              <p key={i} className="mt-5 max-w-3xl leading-[1.75] text-white/70">{para}</p>
            ))}
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {p.projects.items.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white/85">
                  <Check />
                  <span className="leading-[1.55]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-3xl font-semibold text-white">{p.projects.closing}</p>
          </section>

          {/* TOOLS */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 sm:px-12">
            <SectionHeading>{p.tools.heading}</SectionHeading>
            <p className="mt-5 max-w-3xl leading-[1.75] text-white/70">{p.tools.intro}</p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {p.tools.cards.map((card, i) => (
                <div key={card.title} className="flex h-full flex-col rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6">
                  <span className="text-xs font-bold text-[#d7ff00]">0{i + 1}</span>
                  <h3 className="mt-3 font-bold leading-[1.35] text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-[1.65] text-white/65">{card.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SOCIAL */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 sm:px-12">
            <SectionHeading>{p.social.heading}</SectionHeading>
            {p.social.paragraphs.map((para, i) => (
              <p key={i} className="mt-5 max-w-3xl leading-[1.75] text-white/70">{para}</p>
            ))}
          </section>

          {/* REFINEMENTS */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 sm:px-12">
            <SectionHeading>{p.refinements.heading}</SectionHeading>
            <p className="mt-5 max-w-3xl leading-[1.75] text-white/70">{p.refinements.intro}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {p.refinements.items.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white/85">
                  <Check />
                  <span className="leading-[1.55]">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* TIMELINE */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 sm:px-12">
            <SectionHeading>{p.timeline.heading}</SectionHeading>
            {p.timeline.body.map((para, i) => (
              <p key={i} className="mt-5 max-w-3xl leading-[1.75] text-white/70">{para}</p>
            ))}
          </section>

          {/* SUCCESS */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-10 sm:px-12">
            <SectionHeading>{p.success.heading}</SectionHeading>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {p.success.items.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white/85">
                  <Check />
                  <span className="leading-[1.55]">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-3xl rounded-xl border-l-4 border-[#d7ff00] bg-[#d7ff00]/[0.05] px-6 py-5 leading-[1.7] text-white/85">
              {p.success.closing}
            </p>
          </section>

          {/* FINAL CTA */}
          <section className="relative overflow-hidden rounded-2xl border border-[#d7ff00]/25 bg-[radial-gradient(circle_at_50%_0%,rgba(215,255,0,0.1),transparent_22rem)] px-6 py-14 text-center sm:px-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">Next step</p>
            <h2 className="mx-auto mt-4 max-w-2xl text-[clamp(1.5rem,3.5vw,2.4rem)] font-extrabold leading-[1.2] text-white">
              Talk it through with us.
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-[1.7] text-white/65">
              We'll walk through the proposal, answer questions and agree the priorities that matter most to Sunflow.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={p.actions.calendlyUrl}
                className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-[#d7ff00] px-[26px] py-3.5 text-[15px] font-bold text-[#0a0b10] shadow-[0_14px_30px_rgba(215,255,0,0.18)] transition hover:-translate-y-0.5"
              >
                {p.actions.ctaLabel}
                <Arrow />
              </a>
              <a
                href={p.actions.emailUrl}
                className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-white/20 px-[26px] py-3.5 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/40"
              >
                Email us instead
              </a>
            </div>
          </section>

          <footer className="pt-4 text-center text-xs text-white/35">
            Prepared by{" "}
            <a href="https://www.t3labs.tech/" className="font-semibold text-white/60 hover:underline">
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
