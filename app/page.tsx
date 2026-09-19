"use client";

import { useState, useEffect } from "react";
import AnimatedHero from "@/components/t3-home/animated-hero";
import MissionStatement from "@/components/t3-home/mission-statement";
import AIServicesSection from "@/components/t3-home/ai-services-section";
import T3OutcomeAnimation from "@/components/t3-outcomes/T3OutcomeAnimation";
import IntakeModalMount from "@/components/intake/intake-modal-mount";
import { openIntakeModal } from "@/lib/intake/analytics";
import "@/app/intake-modal.css";

/* ------------------------------------------------------------------ */
/*  T3 Labs Homepage - React/Tailwind conversion of legacy index.html */
/*  Visuals must match the original exactly.                          */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#custom-solutions", label: "Custom" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

const WORK_CARDS = [
  {
    num: "01",
    title: "QuoteCore+",
    desc: "A fully functional, feature-packed construction quoting and job-management SaaS app. From large software products like this to small focused tools - a clear picture of what we can build.",
    img: "/assets/quotecore-card.jpg",
    link: { href: "https://quote-core.com/", label: "View QuoteCore+" },
  },
  {
    num: "02",
    title: "Roofing Website Demo",
    desc: "A demo roofing website showcasing the tools we build to create solutions - measuring, quoting, pricing and an AI Smart Assistant.",
    img: "/assets/roofing-solutions/apex-demo-home.jpg",
    link: { href: "/demo/roofing-site", label: "View the demo site" },
  },
  {
    num: "03",
    title: "Custom Systems",
    desc: "Websites, dashboards, analytics, SEO, marketing systems, automation workflows, and AI-powered tools built around real business problems.",
    img: "/assets/hero-audit-phone.png",
    link: { href: "/business-audit", label: "Business Audit tool", note: "(one example)" },
  },
];

const CUSTOM_SOLUTIONS = [
  {
    img: "/assets/custom-solution-lead-gen.png",
    title: "Lead Intelligence",
    desc: "Automated lead discovery, scoring, and enrichment pipelines that find qualified prospects before your competitors do.",
  },
  {
    img: "/assets/custom-solution-automation.png",
    title: "Workflow Automation",
    desc: "Visual workflow builders that connect your tools, eliminate manual steps, and keep data flowing where it needs to.",
  },
  {
    img: "/assets/custom-solution-crm.png",
    title: "Custom CRM & Internal Tools",
    desc: "Bespoke dashboards, job management systems, and internal tools built around how your team actually works.",
  },
  {
    img: "/assets/custom-solution-seo.png",
    title: "SEO & AI Search Platform",
    desc: "Content optimisation and AI search indexing tools that track rankings across Google, Bing, and AI assistants.",
  },
];

const CAPABILITY_TAGS = [
  "Lead Generation",
  "Workflow Automation",
  "Internal Tools",
  "CRM Systems",
  "Dashboards & Analytics",
  "API Integration",
  "AI Search Optimisation",
  "Custom Software",
];

const TESTIMONIALS = [
  {
    quote:
      "I'm terrible with tech so I jumped on a call, and within 15 minutes they built and showed me a solution we've been trying to solve for years. We now hand any tech-related problem to T3 Labs with full confidence - pricing is incredibly affordable!",
    name: "James R.",
    role: "Operations Manager, UK",
    initials: "JR",
  },
  {
    quote:
      "I was nervous about getting on a call because I thought it would be a hard sell. It was the complete opposite - super friendly, no pressure at all. They listened, understood the problem fast, and came back with something that actually worked. Can't believe how quick it was.",
    name: "Sarah K.",
    role: "Small Business Owner, Manchester",
    initials: "SK",
  },
  {
    quote:
      "We'd been quoted thousands by other agencies. T3 Labs solved our problem in a fraction of the time and cost. The team is approachable, fast, and they don't overcomplicate things. Wish we'd found them sooner.",
    name: "David M.",
    role: "Founder, London",
    initials: "DM",
  },
];

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);

  function openIntake() {
    openIntakeModal({
      trigger: "hero",
      source_page: "/",
      cta_text: "Tell us your problem",
    });
  }

function openIntakeFromPageCta(ctaText: string, startAt?: "contact") {
    openIntakeModal({
      trigger: "page-cta",
      source_page: "/",
      cta_text: ctaText,
      startAt,
    });
  }

  function toggleNav() {
    setNavOpen((v) => !v);
  }

  function closeNav() {
    setNavOpen(false);
  }

  return (
    <>
      <Header navOpen={navOpen} onToggle={toggleNav} onClose={closeNav} />

      <main id="top">
        <AnimatedHero onCtaClick={openIntake} />
        <MissionStatement />
        <div className="mb-[104px]">
          <T3OutcomeAnimation />
        </div>
        <WorkSection />
        <AIServicesSection />
        <CustomSolutionsSection onCtaClick={() => openIntakeFromPageCta("Start a project")} />
        <Testimonials />
        <CTASection onCtaClick={() => openIntakeFromPageCta("Get in touch")} onEmailClick={() => openIntakeFromPageCta("Email us", "contact")} />
      </main>

      <IntakeModalMount />
      <Footer />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

function Header({
  navOpen,
  onToggle,
  onClose,
}: {
  navOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderVisible(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`t3-header${headerVisible ? " t3-header--visible" : ""}`}
    >
      <a href="#top" aria-label="T3 Labs home" className="inline-flex items-center shrink-0">
        <img
          src="/assets/t3-labs-black.png"
          alt="T3 Labs"
          className="w-[116px] h-auto object-contain"
        />
      </a>

      <nav
        aria-label="Primary navigation"
        className={`flex items-center justify-center gap-2 text-sm font-semibold ${
          navOpen ? "fixed top-[76px] left-5 right-5 grid gap-2 p-4 border border-[var(--line)] rounded-xl bg-white shadow-[0_26px_80px_rgba(24,31,51,0.12)]" : "hidden md:flex"
        }`}
      >
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={onClose} className="t3-header__nav-link">
            {link.label}
          </a>
        ))}
      </nav>

      <a
        href="#contact"
        onClick={onClose}
        className="t3-header__cta hidden md:inline-flex"
      >
        Build with T3 Labs
      </a>

      <button
        type="button"
        aria-label="Open navigation"
        aria-expanded={navOpen}
        onClick={onToggle}
        className="md:hidden flex w-[42px] h-[42px] shrink-0 flex-col items-center justify-center gap-1 border border-[var(--line)] rounded-lg bg-white"
      >
        <span className="w-[18px] h-0.5 bg-[var(--ink)]" />
        <span className="w-[18px] h-0.5 bg-[var(--ink)]" />
      </button>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Work / Built                                                       */
/* ------------------------------------------------------------------ */

function WorkSection() {
  return (
    <section id="work" className="mb-[104px] w-[min(1180px,calc(100%-40px))] mx-auto">
      <div className="mb-8.5">
        <p className="block m-0 text-[#515763] text-xs font-semibold tracking-[0.18em] uppercase">
          What we&rsquo;ve built
        </p>
        <h2 className="max-w-[920px] mb-0 text-[#050505] text-[clamp(2rem,3vw,3.1rem)] font-semibold leading-[1.04]">
          Useful products across different problems.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
        {WORK_CARDS.map((card) => (
          <article
            key={card.num}
            className="group flex flex-col min-h-[330px] p-7 pb-6 border border-[var(--line)] rounded-lg bg-[radial-gradient(circle_at_84%_14%,rgba(215,255,0,0.055),transparent_11rem),rgba(255,255,255,0.92)] shadow-[0_10px_32px_rgba(24,31,51,0.05)] hover:border-[#e3e8bc] hover:bg-[radial-gradient(circle_at_84%_14%,rgba(215,255,0,0.11),transparent_11rem),#fbfff0] hover:shadow-[0_14px_34px_rgba(24,31,51,0.07)] transition-all duration-200"
          >
            {card.img && (
              <div className="mb-5 overflow-hidden rounded-lg border border-[var(--line)] bg-[#f6f8f0] transition-all duration-200 group-hover:border-[#e3e8bc] group-hover:shadow-[0_10px_28px_rgba(215,255,0,0.35)]">
                <img
                  src={card.img}
                  alt={`${card.title} preview`}
                  loading="lazy"
                  className="block aspect-[16/10] w-full object-cover object-top transition-transform duration-200 group-hover:scale-[1.04]"
                />
              </div>
            )}
            <h3 className="max-w-[260px] mb-3.5 text-[1.45rem] font-semibold leading-[1.15]">
              {card.title}
            </h3>
            <p className="mb-0 text-[var(--muted)] text-base leading-[1.65]">{card.desc}</p>
            {card.link && (
              <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-6">
                <a
                  href={card.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-auto min-h-[32px] px-3.5 py-1.5 border border-[var(--line)] rounded-lg bg-white text-[var(--ink)] text-xs font-semibold shadow-[0_8px_18px_rgba(16,24,40,0.04)] hover:-translate-y-px hover:border-[#e3e8bc] hover:bg-[#fbfff0] hover:text-black hover:shadow-[0_12px_24px_rgba(16,24,40,0.07)] transition-all duration-200"
                >
                  {card.link.label}
                  <span className="inline-grid w-[18px] h-[18px] place-items-center rounded-full bg-[#d7ff00] text-[var(--ink)] text-[10px]">
                    &rarr;
                  </span>
                </a>
                {card.link.note && (
                  <span className="text-[var(--muted)] text-xs font-medium">{card.link.note}</span>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Custom Solutions Section                                          */
/* ------------------------------------------------------------------ */

function CustomSolutionsSection({
  onCtaClick,
}: {
  onCtaClick: () => void;
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % CUSTOM_SOLUTIONS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <section
      id="custom-solutions"
      className="mb-[104px] w-[min(1180px,calc(100%-40px))] mx-auto"
    >
      {/* Header */}
      <div className="mb-8.5">
        <p className="block m-0 text-[#515763] text-xs font-semibold tracking-[0.18em] uppercase">
          What else we build
        </p>
        <h2 className="max-w-[920px] mb-4.5 text-[#050505] text-[clamp(2rem,3vw,3.1rem)] font-semibold leading-[1.04]">
          Custom software solutions for every business.
        </h2>
        <p className="max-w-[760px] mb-0 text-[#373c4c] text-[1.08rem] leading-[1.65]">
          Beyond our productised tools, T3 Labs builds tailored software that solves
          specific operational problems. From lead generation engines to workflow
          automation, internal tools, and advanced integrations - if a process can be
          improved with software, we can build it.
        </p>
      </div>

      {/* Capability tags */}
      <div className="flex flex-wrap gap-2 mb-8.5">
        {CAPABILITY_TAGS.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1.5 border border-[var(--line)] rounded-full bg-white text-[#4f5567] text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Carousel */}
      <div
        className="relative overflow-hidden border border-[var(--line)] rounded-2xl bg-[radial-gradient(circle_at_84%_14%,rgba(215,255,0,0.05),transparent_20rem),rgba(255,255,255,0.92)] shadow-[0_26px_80px_rgba(24,31,51,0.12)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slides */}
        <div className="relative h-[420px]">
          {CUSTOM_SOLUTIONS.map((solution, i) => (
            <div
              key={solution.title}
              className={`absolute inset-0 transition-opacity duration-500 ${
                i === activeSlide ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div
                className="grid h-full md:[grid-template-columns:minmax(0,1fr)_minmax(0,0.85fr)] max-md:grid-cols-1"
              >
                {/* Image side */}
                <div className="relative overflow-hidden bg-[#0a0b10]">
                  <img
                    src={solution.img}
                    alt={solution.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle gradient overlay for blend */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgba(10,11,16,0.3)]" />
                </div>

                {/* Text side */}
                <div className="flex flex-col justify-center gap-4 p-8.5 bg-[radial-gradient(circle_at_80%_20%,rgba(215,255,0,0.06),transparent_16rem),white]">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-grid w-[32px] h-[32px] place-items-center border border-[#d7ff00] rounded-lg bg-[#d7ff00] text-[var(--ink)] text-[11px] font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[#515763] text-xs font-semibold tracking-[0.12em] uppercase">
                      Custom Build
                    </span>
                  </div>
                  <h3 className="text-[1.6rem] font-semibold leading-[1.15]">
                    {solution.title}
                  </h3>
                  <p className="text-[var(--muted)] text-base leading-[1.65]">
                    {solution.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-5 right-6 flex gap-2 z-10">
          {CUSTOM_SOLUTIONS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setActiveSlide(i)}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === activeSlide
                  ? "w-7 bg-[#d7ff00]"
                  : "w-2 bg-[#c5c8d4] hover:bg-[#a5a9b8]"
              }`}
            />
          ))}
        </div>

        {/* Prev/Next arrows */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => setActiveSlide((prev) => (prev - 1 + CUSTOM_SOLUTIONS.length) % CUSTOM_SOLUTIONS.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex w-10 h-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-[var(--line)] text-[var(--ink)] shadow-[0_5px_16px_rgba(20,25,40,0.08)] hover:bg-white hover:border-[#e3e8bc] transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => setActiveSlide((prev) => (prev + 1) % CUSTOM_SOLUTIONS.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex w-10 h-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-[var(--line)] text-[var(--ink)] shadow-[0_5px_16px_rgba(20,25,40,0.08)] hover:bg-white hover:border-[#e3e8bc] transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      {/* Positioning statement + CTA */}
      <div
        className="grid gap-7 items-center mt-6 p-8.5 border border-[var(--line)] rounded-xl bg-[radial-gradient(circle_at_12%_20%,rgba(17,19,24,0.04),transparent_20rem),radial-gradient(circle_at_82%_30%,rgba(215,255,0,0.06),transparent_16rem),white] md:[grid-template-columns:1fr_auto] max-md:grid-cols-1"
      >
        <div>
          <p className="block mb-3 text-[#373c4c] text-[1.05rem] leading-[1.65]">
            We keep the process simple. You explain the problem, we work out the
            right technology, and we involve your team only where their judgment
            is genuinely needed. The result is practical software, automation and
            AI systems designed around how your business actually works.
          </p>
          <p className="block m-0 text-[var(--muted)] text-sm leading-[1.6]">
            Lead generation. Workflow automation. Internal tools. Advanced integrations.
            If it can be built, we build it.
          </p>
        </div>
        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); onCtaClick(); }}
          className="inline-flex min-h-[48px] items-center justify-center gap-3 px-5 py-3.5 rounded-lg bg-gradient-to-br from-[#050608] to-[#242832] text-white text-sm font-semibold shadow-[0_14px_30px_rgba(10,11,16,0.16)] hover:-translate-y-0.5 transition-transform whitespace-nowrap"
        >
          Start a project <span>&rarr;</span>
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials                                                      */
/* ------------------------------------------------------------------ */

function Testimonials() {
  return (
    <section id="testimonials" className="mb-[104px] w-[min(1180px,calc(100%-40px))] mx-auto">
      <div className="mb-8.5">
        <p className="block m-0 text-[#515763] text-xs font-semibold tracking-[0.18em] uppercase">
          What people say
        </p>
        <h2 className="mb-0 text-[clamp(2rem,3vw,3.1rem)] font-semibold leading-none">
          Real results, real people.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((t) => (
          <article
            key={t.initials}
            className="flex flex-col gap-4 p-7 border border-[var(--line)] rounded-lg bg-[radial-gradient(circle_at_84%_14%,rgba(215,255,0,0.045),transparent_11rem),rgba(255,255,255,0.94)] shadow-[0_10px_32px_rgba(24,31,51,0.05)] hover:-translate-y-0.5 hover:border-[#e3e8bc] hover:shadow-[0_14px_34px_rgba(24,31,51,0.07)] transition-all duration-200"
          >
            <div className="text-[#f5a623] text-base tracking-[2px]">
              {"\u2605".repeat(5)}
            </div>
            <p className="flex-1 m-0 text-[#3e4352] text-base italic leading-[1.7]">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#050608] to-[#242832] text-white text-xs font-bold">
                {t.initials}
              </div>
              <div>
                <strong className="block text-[var(--ink)] text-sm">{t.name}</strong>
                <span className="block text-[var(--muted)] text-xs">{t.role}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA                                                               */
/* ------------------------------------------------------------------ */

function CTASection({ onCtaClick, onEmailClick }: { onCtaClick: () => void; onEmailClick: () => void }) {
  return (
    <section
      id="contact"
      className="grid gap-7 items-center mb-8.5 p-10.5 border border-[rgba(17,19,24,0.1)] rounded-2xl bg-[radial-gradient(circle_at_12%_20%,rgba(17,19,24,0.06),transparent_24rem),radial-gradient(circle_at_82%_30%,rgba(215,255,0,0.08),transparent_17rem),white] shadow-[0_26px_80px_rgba(24,31,51,0.12)] w-[min(1180px,calc(100%-40px))] mx-auto md:[grid-template-columns:1fr_auto] max-md:grid-cols-1 max-md:p-7"
    >
      <div>
        <p className="block m-0 text-[#515763] text-xs font-semibold tracking-[0.18em] uppercase">
          Build with T3 Labs
        </p>
        <h2 className="mb-4.5 text-[clamp(2rem,3vw,3.1rem)] font-semibold leading-none">
          Got a problem you think technology could solve?
        </h2>
        <p className="mb-2 text-[1.08rem] leading-[1.65]">
          You don't need to know whether it needs AI, automation, existing
          software or something custom. Tell us what's happening and we'll work
          out the sensible next step.
        </p>
        <p className="mb-0 text-sm leading-[1.6] text-[#515763]">
          Speak it or type it - no technical brief needed. A real person at T3
          Labs reviews every enquiry.
        </p>
      </div>
      <div className="flex flex-col items-stretch gap-3">
        <button
          type="button"
          onClick={onCtaClick}
          className="inline-flex min-h-[52px] items-center justify-center gap-3 px-5.5 py-3.5 rounded-lg bg-gradient-to-br from-[#050608] to-[#242832] text-white text-sm font-semibold shadow-[0_14px_30px_rgba(10,11,16,0.16)] hover:-translate-y-0.5 transition-transform cursor-pointer"
        >
          Tell us your problem <span>&rarr;</span>
        </button>
        <a
          href="https://calendly.com/insights-t3labs/20-minute-meeting"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[rgba(17,19,24,0.2)] px-5.5 py-2.5 text-sm font-semibold text-[#050608] transition hover:border-[#050608]/50"
        >
          Book a free call
        </a>
        <button
          type="button"
          onClick={onEmailClick}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[rgba(17,19,24,0.2)] px-5.5 py-2.5 text-sm font-semibold text-[#050608] transition hover:border-[#050608]/50 cursor-pointer"
        >
          Email us
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                            */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="grid gap-2 w-[min(1180px,calc(100%-40px))] mx-auto pt-7 pb-10.5 text-[#6f7584] text-sm">
      <p className="m-0">
        &copy; 2026 T3 Labs &middot;{" "}
        <a href="/privacy" className="text-[var(--ink)] font-semibold no-underline hover:underline">Privacy</a>
        {" "}&middot;{" "}
        <a href="/cookies" className="text-[var(--ink)] font-semibold no-underline hover:underline">Cookies</a>
        {" "}&middot;{" "}
        <a href="/terms" className="text-[var(--ink)] font-semibold no-underline hover:underline">Terms</a>
        {" "}&middot;{" "}
        <a href="/ai-consultancy" className="text-[var(--ink)] font-semibold no-underline hover:underline">AI Consultancy</a>
        {" "}&middot;{" "}
        <a href="/ai-implementation" className="text-[var(--ink)] font-semibold no-underline hover:underline">AI Implementation</a>
        {" "}&middot;{" "}
        <a href="/ai-automation" className="text-[var(--ink)] font-semibold no-underline hover:underline">AI Automation</a>
        {" "}&middot;{" "}
        <a href="/ai-training" className="text-[var(--ink)] font-semibold no-underline hover:underline">AI Training</a>
      </p>
      <p className="m-0">T3 Labs is a trading name of T3 Play Limited.</p>
    </footer>
  );
}
