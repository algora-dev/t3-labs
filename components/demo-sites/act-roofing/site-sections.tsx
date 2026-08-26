"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import type { ActRoofingSiteConfig } from "./types";

const PRIMARY = "#1769E0";
const PRIMARY_HOVER = "#1257BC";
const TEXT_PRIMARY = "#101828";
const TEXT_SECONDARY = "#667085";
const BORDER = "#E5E7EB";
const DARK_SECTION = "#101828";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h11m0 0-4.5-4.5M15 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="none">
      <path d="M6.2 3.8 8.1 7l-1.3 1.3c.8 1.7 2.2 3.1 3.9 3.9l1.3-1.3 3.2 1.9-.7 2.8c-.1.5-.6.9-1.1.8-5.2-.5-9.3-4.6-9.8-9.8-.1-.5.3-1 .8-1.1l1.8-.7Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg aria-hidden="true" className={`h-4 w-4 ${filled ? "text-[#F59E0B]" : "text-[#D0D5DD]"}`} viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.35 0-4.34-1.58-5.05-3.71H.96v2.34A8.99 8.99 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.95 10.71a5.41 5.41 0 0 1 0-3.42V4.95H.96a9 9 0 0 0 0 8.1l2.99-2.34Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A8.99 8.99 0 0 0 .96 4.95l2.99 2.34C4.66 5.16 6.65 3.58 9 3.58Z" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="none">
      {open ? (
        <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
      ) : (
        <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
      )}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none">
      <path d="m4 10.5 4 4L16 6" stroke={PRIMARY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "onDark" | "ghostDark";
  className?: string;
  onClick?: () => void;
}) {
  const style =
    variant === "primary"
      ? "bg-[#1769E0] text-white shadow-[0_1px_2px_rgba(16,24,40,0.1)] hover:bg-[#1257BC]"
      : variant === "onDark"
        ? "bg-white text-[#101828] hover:bg-[#F0F4FA]"
        : variant === "ghostDark"
          ? "border border-white/30 text-white hover:border-white/70 hover:bg-white/5"
          : `border border-[#D0D5DD] bg-white text-[#101828] hover:border-[#1769E0] hover:text-[#1769E0]`;

  return (
    <a className={`button-base ${style} ${className}`} href={href} onClick={onClick}>
      {children}
    </a>
  );
}

function openQuoteRequest() {
  window.dispatchEvent(new CustomEvent("contractor:open-quote-request"));
}

function openQuoteChoice() {
  window.dispatchEvent(new CustomEvent("contractor:open-quote-choice"));
}

function SectionIntro({
  eyebrow,
  title,
  children,
  light = false,
  center = false,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`grid gap-6 ${center ? "mx-auto max-w-2xl text-center" : "lg:grid-cols-[0.9fr_1fr] lg:items-end"}`}>
      <div>
        <p className={`section-eyebrow ${light ? "!text-[#8AB4F8]" : ""}`}>{eyebrow}</p>
        <h2 className={`mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem] ${light ? "text-white" : `text-[#101828]`}`}>{title}</h2>
      </div>
      {children ? <div className={`max-w-xl text-base leading-8 sm:text-lg ${light ? "text-white/70" : `text-[#667085]`}`}>{children}</div> : null}
    </div>
  );
}

export function Header({ site }: { site: ActRoofingSiteConfig }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur">
      <div className="site-shell flex min-h-[72px] items-center justify-between gap-5">
        <a className="flex items-center gap-3" href="#top" aria-label={`${site.companyName} home`}>
          <span className="relative block h-[72px] w-[280px] sm:w-[320px]">
            <Image src={site.brand.wordmark.src} alt={site.brand.wordmark.alt} fill sizes="320px" className="object-contain" priority />
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-[0.95rem] font-medium text-[#475467] lg:flex" aria-label="Main navigation">
          {site.navigation.map(({ label, href }) => (
            <a key={label} className="transition hover:text-[#101828]" href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href={site.estimateTool.ctaHref} className="header-quote-button !min-h-[44px]">
            {site.callsToAction.estimate}
          </ButtonLink>
        </div>
        <button
          className="grid h-11 w-11 place-items-center rounded-[10px] border border-[#D0D5DD] bg-white text-[#101828] transition hover:border-[#101828] lg:!hidden"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
          <MenuIcon open={open} />
        </button>
      </div>
      {open ? (
        <div id="mobile-menu" className="border-t border-[#E5E7EB] bg-white lg:hidden">
          <nav className="site-shell grid gap-1 py-4 text-base font-medium" aria-label="Mobile navigation">
            {site.mobileNavigation.map(({ label, href }) => (
              <a key={label} className="rounded-[10px] px-4 py-3 text-[#344054] transition hover:bg-[#F7F8FA] hover:text-[#101828]" href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <div className="mt-3 px-1">
              <ButtonLink href={site.estimateTool.ctaHref} className="w-full" onClick={() => setOpen(false)}>
                {site.callsToAction.estimate}
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function Hero({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-[#101828] text-white">
      <Image
        src={site.hero.image.src}
        alt={site.hero.image.alt}
        fill
        sizes="100vw"
        className="object-cover object-center"
        priority
        loading="eager"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,24,40,0.88)_0%,rgba(16,24,40,0.66)_38%,rgba(16,24,40,0.22)_72%,rgba(16,24,40,0.1)_100%),linear-gradient(0deg,rgba(16,24,40,0.55)_0%,rgba(16,24,40,0.08)_55%)]"
        aria-hidden="true"
      />
      <div className="site-shell relative z-10 flex min-h-[600px] items-center py-20 sm:min-h-[660px] lg:min-h-[720px]">
        <div className="max-w-2xl">
          <p className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[0.8rem] font-medium tracking-wide text-white/90 backdrop-blur-sm">
            {site.hero.eyebrow}
          </p>
          <h1 className="mt-6 text-[2.5rem] font-bold leading-[1.08] tracking-[-0.025em] sm:text-5xl lg:text-[4.25rem]">
            {site.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/85 sm:text-xl sm:leading-9">
            {site.hero.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={site.estimateTool.ctaHref} className="!bg-[#1769E0] !text-white hover:!bg-[#1257BC]">
              {site.callsToAction.estimate}
              <ArrowIcon />
            </ButtonLink>
            {site.hero.secondaryCta ? (
              <ButtonLink href={site.hero.secondaryCta.href} variant="ghostDark">
                {site.hero.secondaryCta.label}
              </ButtonLink>
            ) : null}
          </div>
          {/* Featured Google review */}
          {site.featuredReview ? (
            <HeroReviewCard review={site.featuredReview} />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function HeroReviewCard({ review }: { review: { summary: string; source: string; rating: number } }) {
  return (
    <figure className="mt-10 max-w-md rounded-[14px] border border-white/15 bg-white/95 p-5 shadow-[0_8px_24px_rgba(16,24,40,0.25)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} filled={i < review.rating} />
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-[#667085]">
          <GoogleGlyph />
          Google Review
        </span>
      </div>
      <blockquote className="mt-3 text-[0.98rem] leading-7 text-[#344054]">
        &ldquo;{review.summary}&rdquo;
      </blockquote>
      <figcaption className="mt-3 text-sm font-semibold text-[#101828]">
        {review.source}
      </figcaption>
    </figure>
  );
}

export function TrustStrip({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section aria-label="Trust highlights" className="border-b border-[#E5E7EB] bg-white">
      <div className="site-shell flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6 sm:justify-between">
        {site.trustStrip.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <CheckIcon />
            <span className="text-[0.95rem] font-medium text-[#344054]">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Intro({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section id="about" className="section-pad bg-white">
      <div className="site-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="section-eyebrow">{site.about.eyebrow}</p>
          <h2 className={`mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] text-[#101828] sm:text-4xl lg:text-[2.75rem]`}>
            {site.about.title}
          </h2>
        </div>
        <div className="grid gap-5 text-lg leading-8 text-[#475467]">
          {site.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}

export function Services({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section id="services" className="section-pad bg-[#F7F8FA]">
      <div className="site-shell">
        <SectionIntro eyebrow={site.servicesIntro.eyebrow} title={site.servicesIntro.title}>
          <p>{site.servicesIntro.description}</p>
        </SectionIntro>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {site.services.map((service) => (
            <article key={service.title} className="group overflow-hidden rounded-[18px] border border-[#E5E7EB] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(16,24,40,0.15)]">
              {service.image ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-[#E9EDF3]">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              ) : (
                <div className="h-1.5 bg-[#1769E0]" aria-hidden="true" />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#101828]">{service.title}</h3>
                <p className="mt-3 text-[0.98rem] leading-7 text-[#475467]">{service.summary}</p>
                {service.linkLabel ? (
                  <a href="#contact" className="mt-4 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-[#1769E0] transition hover:gap-3">
                    {service.linkLabel}
                    <ArrowIcon />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EstimateToolSection({ site }: { site: ActRoofingSiteConfig }) {
  const tool = site.estimateTool;
  return (
    <section id="estimate" className="section-pad bg-white">
      <div className="site-shell grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="section-eyebrow">{tool.eyebrow}</p>
          <h2 className={`mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] text-[#101828] sm:text-4xl lg:text-[2.75rem]`}>
            {tool.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#475467]">
            {tool.description}
          </p>
          <ul className="mt-7 grid max-w-md gap-3 sm:grid-cols-2">
            {tool.benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2.5 text-[0.95rem] font-medium text-[#344054]">
                <CheckIcon />
                {benefit}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ButtonLink href={tool.ctaHref}>
              {tool.ctaLabel}
              <ArrowIcon />
            </ButtonLink>
          </div>
        </div>
        {/* Tool preview */}
        <div className="relative">
          <div className="absolute -inset-3 rounded-[28px] bg-[#1769E0]/[0.06] sm:-inset-5" aria-hidden="true" />
          <div className="relative rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-[0_16px_48px_-16px_rgba(16,24,40,0.18)] sm:p-8">
            <ol className="relative grid gap-0" aria-label="Estimate tool steps">
              {tool.previewSteps.map((step, index) => {
                const isLast = index === tool.previewSteps.length - 1;
                return (
                  <li key={step} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold ${
                          isLast
                            ? "bg-[#1769E0] text-white"
                            : "border-2 border-[#1769E0] bg-white text-[#1769E0]"
                        }`}
                      >
                        {isLast ? "→" : index + 1}
                      </span>
                      {!isLast ? <span className="h-9 w-px bg-[#D0D5DD]" aria-hidden="true" /> : null}
                    </div>
                    <div className={`pb-"pb-0" pt-2`}>
                      <p className={`font-semibold ${isLast ? "text-[#1769E0]" : "text-[#101828]"}`}>{step}</p>
                      {!isLast ? (
                        <p className="mt-0.5 text-sm text-[#667085]">
                          {index === 0 ? "Detached, semi or terrace" : index === 1 ? "Slate, tile or flat" : "Small, medium or large"}
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 rounded-[12px] bg-[#F7F8FA] p-4 text-sm leading-6 text-[#475467]">
              {tool.previewNote}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Projects({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section id="projects" className="section-pad bg-[#F7F8FA]">
      <div className="site-shell">
        <SectionIntro eyebrow={site.projectsIntro.eyebrow} title={site.projectsIntro.title}>
          <p>{site.projectsIntro.description}</p>
        </SectionIntro>
        <div className="mt-12 grid gap-6">
          {site.projects.map((project) => (
            <figure key={project.src} className="group overflow-hidden rounded-[22px] border border-[#E5E7EB] bg-white">
              <div className="relative aspect-[16/9] min-h-[260px] w-full overflow-hidden bg-[#E9EDF3]">
                <Image
                  src={project.src}
                  alt={project.alt}
                  fill
                  sizes="100vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.01]"
                />
              </div>
              <figcaption className="border-t border-[#E5E7EB] bg-white p-5 text-[0.95rem] font-medium text-[#475467]">
                {project.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChoose({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section id="about" className="section-pad bg-white">
      <div className="site-shell">
        <SectionIntro eyebrow={site.whyChoose.eyebrow} title={site.whyChoose.title}>
          <p>{site.whyChoose.description}</p>
        </SectionIntro>
        <ul className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {site.whyChoose.items.map((item) => (
            <li key={item} className="flex items-start gap-3 border-t border-[#E5E7EB] pt-5">
              <CheckIcon />
              <span className="text-[1.05rem] font-medium leading-7 text-[#344054]">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Feedback({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section id="reviews" className="section-pad bg-[#F7F8FA]">
      <div className="site-shell">
        <SectionIntro eyebrow={site.testimonials.eyebrow} title={site.testimonials.title} />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {site.testimonials.items.map((review) => (
            <article key={review.source} className="flex flex-col rounded-[18px] border border-[#E5E7EB] bg-white p-7 shadow-[0_2px_10px_rgba(16,24,40,0.05)]">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#F2F4F7] text-base font-semibold text-[#344054]" aria-hidden="true">
                  {review.source.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.95rem] font-semibold text-[#101828]">{review.source}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} filled={i < review.rating} />
                      ))}
                    </div>
                    <span className="text-xs text-[#667085]">·</span>
                    <GoogleGlyph />
                  </div>
                </div>
              </div>
              <blockquote className="mt-5 flex-1 text-[1.02rem] leading-8 text-[#344054]">
                {review.summary}
              </blockquote>
              <footer className="mt-6 border-t border-[#F2F4F7] pt-4 text-sm text-[#667085]">
                Google Review
              </footer>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[#98A2B3]">{site.demoDisclaimer}</p>
      </div>
    </section>
  );
}

export function Process({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section className="section-pad bg-white">
      <div className="site-shell">
        <SectionIntro eyebrow={site.process.eyebrow} title={site.process.title} center />
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-6">
          {site.process.steps.map((step, index) => (
            <li key={step.title} className="relative text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#1769E0]/10 text-lg font-semibold text-[#1769E0]">
                {index + 1}
              </span>
              <h3 className={`mt-5 text-xl font-semibold tracking-[-0.01em] text-[#101828]`}>{step.title}</h3>
              <p className="mx-auto mt-3 max-w-xs leading-7 text-[#475467]">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Gallery({ site }: { site: ActRoofingSiteConfig }) {
  if (!site.gallery.items.length) return null;
  return (
    <section aria-label={site.gallery.title} className="section-pad !pt-0 bg-white">
      <div className="site-shell">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {site.gallery.items.map((item, index) => (
            <figure
              key={item.src + index}
              className={`group overflow-hidden rounded-[18px] border border-[#E5E7EB] bg-[#E9EDF3] ${index === 0 ? "col-span-2 aspect-[16/10] lg:col-span-2" : "aspect-[4/3]"}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Coverage({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section id="areas" className="section-pad bg-[#F7F8FA]">
      <div className="site-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="section-eyebrow">{site.coverage.eyebrow}</p>
          <h2 className={`mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] text-[#101828] sm:text-4xl`}>{site.coverage.title}</h2>
          <p className="mt-5 max-w-md text-lg leading-8 text-[#475467]">
            {site.coverage.description}
          </p>
        </div>
        <ul className="flex flex-wrap gap-3">
          {site.coverage.areas.map((area) => (
            <li key={area} className="rounded-full border border-[#D0D5DD] bg-white px-5 py-2.5 text-[0.95rem] font-medium text-[#344054]">
              {area}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FinalCta({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section className="section-pad bg-[#101828] text-white">
      <div className="site-shell text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem]">
          {site.finalCta.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/70">
          {site.finalCta.description}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={site.estimateTool.ctaHref} className="!bg-[#1769E0] !text-white hover:!bg-[#1257BC]">
            {site.finalCta.primaryLabel}
            <ArrowIcon />
          </ButtonLink>
          <ButtonLink href="#contact" variant="ghostDark">
            {site.finalCta.secondaryLabel}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export function Contact({ site }: { site: ActRoofingSiteConfig }) {
  const [status, setStatus] = useState("");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [attachmentLabel, setAttachmentLabel] = useState(site.quoteRequest?.fileEmptyText ?? "No file chosen");
  const quoteRequest = site.quoteRequest ?? {
    projectTypes: ["New roof", "Roof repair", "Flat roofing", "Slate & tiling", "Leadwork & chimneys", "Inspection & maintenance"],
  };
  const beforeQuoteOptions = quoteRequest.beforeQuoteOptions ?? ["Request call before quote", "Request email before quote"];
  const preferredTimeframes = quoteRequest.preferredTimeframes ?? ["As soon as practical", "Within 1–3 months", "Within 3–6 months", "More than 6 months away", "Just researching"];
  const preferredContactMethods = quoteRequest.preferredContactMethods ?? ["Phone", "Email"];

  useEffect(() => {
    function syncQuoteModal() {
      if (window.location.hash === "#quote-request") setChoiceOpen(true);
    }

    function openQuoteModal() {
      setQuoteOpen(true);
    }

    function openChoiceModal() {
      setChoiceOpen(true);
    }

    syncQuoteModal();
    window.addEventListener("contractor:open-quote-request", openQuoteModal);
    window.addEventListener("contractor:open-quote-choice", openChoiceModal);
    window.addEventListener("hashchange", syncQuoteModal);
    return () => {
      window.removeEventListener("contractor:open-quote-request", openQuoteModal);
      window.removeEventListener("contractor:open-quote-choice", openChoiceModal);
      window.removeEventListener("hashchange", syncQuoteModal);
    };
  }, []);

  useEffect(() => {
    if (!quoteOpen && !choiceOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (quoteOpen) closeQuoteModal();
        else if (choiceOpen) closeChoiceModal();
      }
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [quoteOpen, choiceOpen]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(site.contactSection.formStatus);
  }

  function closeQuoteModal() {
    setQuoteOpen(false);
    if (window.location.hash === "#quote-request") {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }

  function closeChoiceModal() {
    setChoiceOpen(false);
    if (window.location.hash === "#quote-request") {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }

  function openQuoteFormFromChoice() {
    setChoiceOpen(false);
    setQuoteOpen(true);
  }

  const labelClass = "grid gap-2 text-sm font-medium text-[#344054]";

  return (
    <section id="contact" className="section-pad bg-white">
      <div className="site-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="section-eyebrow">{site.contactSection.eyebrow}</p>
          <h2 className={`mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] text-[#101828] sm:text-4xl`}>{site.contactSection.title}</h2>
          <p className="mt-5 text-lg leading-8 text-[#475467]">
            {site.contactSection.description}
          </p>
          <div className="mt-8 grid gap-3 sm:max-w-sm">
            <ButtonLink href={site.estimateTool.ctaHref} variant="primary">
              {site.callsToAction.estimate}
              <ArrowIcon />
            </ButtonLink>
            <ButtonLink href={site.contact.telephoneHref} variant="secondary">
              <PhoneIcon />
              {site.contact.telephone}
            </ButtonLink>
            <ButtonLink href="#quote-request" variant="secondary" onClick={openQuoteChoice}>
              {site.callsToAction.quote}
            </ButtonLink>
            <ButtonLink href={`mailto:${site.contact.email}`} variant="secondary">
              {site.callsToAction.email}
            </ButtonLink>
          </div>
        </div>
        <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-[0_8px_28px_-14px_rgba(16,24,40,0.12)] sm:p-8">
          <p className="section-eyebrow">General enquiry</p>
          <h3 className={`mt-3 text-2xl font-semibold tracking-[-0.01em] text-[#101828]`}>{site.contactSection.generalFormTitle ?? `Send ${site.companyName} a message`}</h3>
          <form className="mt-6 grid gap-5" onSubmit={onSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <label className={labelClass}>
                Name
                <input className="form-field" name="contact-name" required />
              </label>
              <label className={labelClass}>
                Phone
                <input className="form-field" name="contact-phone" inputMode="tel" required />
              </label>
            </div>
            <label className={labelClass}>
              Email
              <input className="form-field" name="contact-email" type="email" />
            </label>
            <label className={labelClass}>
              Message
              <textarea className="form-field min-h-32 resize-y p-4" name="contact-message" required />
            </label>
            <div>
              <button className="button-base bg-[#1769E0] text-white hover:bg-[#1257BC]" type="submit">
                Send message
                <ArrowIcon />
              </button>
            </div>
            {status ? <p className="rounded-[10px] bg-[#F0F7FF] p-3 text-sm font-medium text-[#175CD3]" role="status">{status}</p> : null}
          </form>
        </div>
      </div>
      {choiceOpen ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#101828]/70 px-4 py-6 backdrop-blur-sm sm:py-10" role="dialog" aria-modal="true" aria-labelledby="choice-modal-title">
          <button className="fixed inset-0 h-full w-full cursor-default" type="button" aria-label="Close" onClick={closeChoiceModal} />
          <div className="relative mx-auto max-w-2xl rounded-[20px] border border-[#E5E7EB] bg-white p-5 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="section-eyebrow">How can we help?</p>
                <h3 id="choice-modal-title" className={`mt-3 text-2xl font-semibold tracking-[-0.01em] text-[#101828] sm:text-3xl`}>Get a price for your roof</h3>
              </div>
              <button className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-[#E5E7EB] text-[#101828] transition hover:border-[#101828] hover:bg-[#F7F8FA]" type="button" onClick={closeChoiceModal}>
                <span className="sr-only">Close</span>
                <MenuIcon open />
              </button>
            </div>
            <div className="mt-6 grid gap-4">
              {/* Tool option — featured */}
              <a href={site.estimateTool.ctaHref} className="group relative overflow-hidden rounded-[18px] border-2 border-[#1769E0] bg-[#F0F7FF] p-6 transition hover:border-[#1257BC] hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className={`text-xl font-semibold text-[#101828]`}>{site.quoteModal?.toolTitle ?? "Get an Instant Estimate"}</h4>
                    <p className="mt-2 leading-7 text-[#475467]">
                      {site.quoteModal?.toolDescription}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1769E0] transition group-hover:gap-3">
                      Use the tool
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
              </a>
              {/* Form option — secondary */}
              <button type="button" onClick={openQuoteFormFromChoice} className="group relative cursor-pointer overflow-hidden rounded-[18px] border border-[#E5E7EB] bg-[#F7F8FA] p-6 text-left transition hover:border-[#98A2B3] hover:bg-white">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className={`text-xl font-semibold text-[#101828]`}>{site.quoteModal?.formTitle ?? "Fill out our request form"}</h4>
                    <p className="mt-2 leading-7 text-[#475467]">
                      {site.quoteModal?.formDescription}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#475467] transition group-hover:gap-3">
                      Fill out a form
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {quoteOpen ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#101828]/70 px-4 py-6 backdrop-blur-sm sm:py-10" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
          <button className="fixed inset-0 h-full w-full cursor-default" type="button" aria-label="Close quote form" onClick={closeQuoteModal} />
          <div className="relative mx-auto max-w-3xl rounded-[20px] border border-[#E5E7EB] bg-white p-5 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="section-eyebrow">{quoteRequest.eyebrow ?? "Quote request form"}</p>
                <h3 id="quote-modal-title" className={`mt-3 text-2xl font-semibold tracking-[-0.01em] text-[#101828] sm:text-3xl`}>{quoteRequest.title ?? "Request a quote"}</h3>
                <p className="mt-3 text-sm italic leading-6 text-[#667085]">
                  {quoteRequest.helperText ?? "The more info you can provide us now the faster we can get a quote back to you"}
                </p>
              </div>
              <button className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-[10px] border border-[#E5E7EB] text-[#101828] transition hover:border-[#101828] hover:bg-[#F7F8FA]" type="button" onClick={closeQuoteModal}>
                <span className="sr-only">Close quote form</span>
                <MenuIcon open />
              </button>
            </div>
            <form className="mt-6 grid gap-5" onSubmit={onSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className={labelClass}>
                  Name
                  <input className="form-field" name="name" required />
                </label>
                <label className={labelClass}>
                  Phone
                  <input className="form-field" name="phone" inputMode="tel" required />
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className={labelClass}>
                  Email
                  <input className="form-field" name="email" type="email" required />
                </label>
                <label className={labelClass}>
                  Postcode
                  <input className="form-field" name="postcode" autoComplete="postal-code" required />
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className={labelClass}>
                  Service required
                  <select className="form-field" name="project" required defaultValue="">
                    <option value="" disabled>Select a service</option>
                    {quoteRequest.projectTypes.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </label>
                <label className={labelClass}>
                  Preferred timeframe
                  <select className="form-field" name="timeframe" required defaultValue="">
                    <option value="" disabled>Select a timeframe</option>
                    {preferredTimeframes.map((timeframe) => <option key={timeframe}>{timeframe}</option>)}
                  </select>
                </label>
              </div>
              <label className={labelClass}>
                {quoteRequest.fileLabel ?? "Attach plans/photos"}
                <span className="flex min-h-12 items-center justify-between gap-3 rounded-[10px] border border-[#D0D5DD] bg-white px-3 py-2 text-base font-normal text-[#101828]">
                  <span className="rounded-[8px] bg-[#1769E0] px-4 py-2 text-sm font-semibold text-white">
                    {quoteRequest.fileButtonText ?? "Choose files"}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[#475467]">{attachmentLabel}</span>
                </span>
                <input
                  className="sr-only"
                  name="attachments"
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={(event) => {
                    const files = event.currentTarget.files;
                    if (!files?.length) {
                      setAttachmentLabel(quoteRequest.fileEmptyText ?? "No file chosen");
                      return;
                    }
                    setAttachmentLabel(files.length === 1 ? files[0].name : `${files.length} files selected`);
                  }}
                />
              </label>
              <label className={labelClass}>
                Project description
                <textarea className="form-field min-h-36 resize-y p-4" name="message" placeholder="Tell us about the property, the work you have in mind and anything that may affect the project." required />
              </label>
              <div className="grid gap-5 md:grid-cols-2">
                <fieldset className="grid gap-3 rounded-[14px] border border-[#E5E7EB] bg-[#F7F8FA] p-4">
                  <legend className="px-1 text-sm font-medium text-[#344054]">Preferred contact method</legend>
                  {preferredContactMethods.map((method) => (
                    <label key={method} className="flex items-start gap-3 text-sm font-medium text-[#344054]">
                      <input className="mt-1 h-4 w-4 accent-[#1769E0]" name="preferred-contact" type="radio" value={method} required />
                      {method}
                    </label>
                  ))}
                </fieldset>
                <fieldset className="grid gap-3 rounded-[14px] border border-[#E5E7EB] bg-[#F7F8FA] p-4">
                  <legend className="px-1 text-sm font-medium text-[#344054]">Before a quote</legend>
                  {beforeQuoteOptions.map((option) => (
                    <label key={option} className="flex items-start gap-3 text-sm font-medium text-[#344054]">
                      <input className="mt-1 h-4 w-4 accent-[#1769E0]" name="contact-before-quote" type="checkbox" value={option} />
                      {option}
                    </label>
                  ))}
                </fieldset>
              </div>
              <label className="flex items-start gap-3 rounded-[14px] border border-[#E5E7EB] bg-[#F7F8FA] p-4 text-sm leading-6 text-[#344054]">
                <input className="mt-1 h-4 w-4 shrink-0 accent-[#1769E0]" name="consent" type="checkbox" required />
                I agree that the details entered may be used to respond to this enquiry. This demonstration does not send or store information.
              </label>
              <button className="button-base bg-[#1769E0] text-white hover:bg-[#1257BC]" type="submit">
                Send
                <ArrowIcon />
              </button>
              {status ? <p className="rounded-[10px] bg-[#F0F7FF] p-3 text-sm font-medium text-[#175CD3]" role="status">{status}</p> : null}
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function MobileActions({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E5E7EB] bg-white/97 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(16,24,40,0.08)] backdrop-blur lg:hidden">
      <ButtonLink href={site.estimateTool.ctaHref} className="w-full !bg-[#1769E0] !text-white hover:!bg-[#1257BC]">
        Get Instant Estimate
        <ArrowIcon />
      </ButtonLink>
    </div>
  );
}

export function Footer({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <footer className="bg-[#101828] pb-28 pt-14 text-white lg:pb-14">
      <div className="site-shell grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
        <div>
          <Image src={site.brand.logo.src} alt={site.brand.logo.alt} width={180} height={52} className="h-auto w-[180px]" />
          <p className="mt-5 max-w-xs leading-7 text-white/60">
            {site.footer.location}. Straightforward advice, reliable workmanship and a job finished properly.
          </p>
        </div>
        <nav className="grid content-start gap-3 text-[0.95rem]" aria-label="Footer navigation">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/40">Explore</p>
          {site.navigation.map(({ label, href }) => (
            <a key={label} className="text-white/70 transition hover:text-white" href={href}>
              {label}
            </a>
          ))}
        </nav>
        <nav className="grid content-start gap-3 text-[0.95rem]" aria-label="Footer services">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/40">Services</p>
          {site.services.map((service) => (
            <a key={service.title} className="text-white/70 transition hover:text-white" href="#services">
              {service.title}
            </a>
          ))}
        </nav>
        <div className="grid content-start gap-3 text-[0.95rem]">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-white/40">Contact</p>
          <a className="font-semibold text-white transition hover:text-[#8AB4F8]" href={site.contact.telephoneHref}>
            {site.contact.telephone}
          </a>
          {site.contact.email ? (
            <a className="text-white/70 transition hover:text-white" href={`mailto:${site.contact.email}`}>
              {site.contact.email}
            </a>
          ) : null}
          <p className="text-white/60">{site.contact.location} and surrounding areas</p>
          {site.contact.socialLinks.map((social) => (
            <a key={social.label} className="text-white/70 transition hover:text-white" href={social.url} target="_blank" rel="noreferrer">
              {social.label}
            </a>
          ))}
        </div>
      </div>
      <div className="site-shell mt-12 border-t border-white/10 pt-6">
        <p className="text-sm leading-6 text-white/40">{site.demoDisclaimer}</p>
        <p className="mt-2 text-sm text-white/40">
          © {new Date().getFullYear()} {site.companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
