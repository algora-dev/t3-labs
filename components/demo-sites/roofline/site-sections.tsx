"use client";

import Image from "next/image";
import Link from "next/link";
import { ApexIcon } from "../../demo-helper/ApexIcon";
import { RoofToolChoices } from "../../demo-helper/RooflineToolChoices";
import { FormEvent, useEffect, useState } from "react";
import type { ActRoofingSiteConfig } from "../act-roofing/types";

const PRIMARY = "#C8102E";
const PRIMARY_HOVER = "#A50D26";
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
  return <ApexIcon name="phone" className="h-4 w-4" />;
}

function EmailIcon() {
  return <ApexIcon name="mail" className="h-4 w-4" />;
}

function SearchIcon() {
  return <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
    <circle cx="9" cy="9" r="5.5" />
    <path d="m13.5 13.5 3 3" />
  </svg>;
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
      ? "bg-[#C8102E] text-white shadow-[0_1px_2px_rgba(16,24,40,0.1)] hover:bg-[#A50D26]"
      : variant === "onDark"
        ? "bg-white text-[#101828] hover:bg-[#F0F4FA]"
        : variant === "ghostDark"
          ? "border border-white/30 text-white hover:border-white/70 hover:bg-white/5"
          : `border border-[#D0D5DD] bg-white text-[#101828] hover:border-[#C8102E] hover:text-[#C8102E]`;

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
    <header id="top" className="relative z-50">
      {/* Tier 1: red utility strip, mirroring roofline.co.nz */}
      <div className="bg-[#C8102E] text-white">
        <div className="site-shell flex min-h-[34px] items-center justify-between gap-4">
          <p className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase text-white/95">Canterbury roofing specialists</p>
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="text-white/90">
              <SearchIcon />
            </span>
          </div>
        </div>
      </div>
      {/* Tier 2: white contact row - logo, call us, free quote */}
      <div className="border-b border-[#E9ECEF] bg-white">
        <div className="site-shell flex min-h-[84px] items-center justify-between gap-5 py-3">
          <a href="#top" aria-label={`${site.companyName} home`} className="relative flex h-14 w-[128px] shrink-0 items-center sm:h-16 sm:w-[150px]">
            <Image src={site.brand.logoMark.src} alt={site.brand.logoMark.alt} fill sizes="150px" className="object-contain object-left" priority />
          </a>
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={site.contact.telephoneHref}
              aria-label={`Call ${site.companyName} on ${site.contact.telephone}`}
              className="hidden items-center gap-3 text-[#111111] transition hover:text-[#C8102E] sm:flex"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full border border-[#E9ECEF] text-[#C8102E]">
                <PhoneIcon />
              </span>
              <span className="leading-tight">
                <span className="block text-[0.62rem] font-semibold tracking-[0.18em] uppercase text-[#667085]">Call us</span>
                <span className="block text-[1.05rem] font-bold tracking-[-0.01em]">{site.contact.telephone}</span>
              </span>
            </a>
            <a href="#estimate" className="button-base bg-[#C8102E] text-white shadow-[0_1px_2px_rgba(16,24,40,0.1)] hover:bg-[#A50D26]">
              Instant Roof Estimate
            </a>
            <button
              className="grid h-11 w-11 place-items-center rounded-[10px] border border-[#D0D5DD] bg-white text-[#101828] transition hover:border-[#101828] lg:hidden"
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
              <MenuIcon open={open} />
            </button>
          </div>
        </div>
      </div>
      {/* Tier 3: black uppercase nav bar */}
      <nav aria-label="Main navigation" className="hidden bg-[#111111] lg:block">
        <div className="site-shell flex items-center gap-1">
          {site.navigation.map(({ label, href }, index) => (
            <a
              key={label}
              href={href}
              className={`inline-block px-4 py-[15px] text-[0.8rem] font-semibold tracking-[0.08em] uppercase transition-colors ${
                index === 0 ? "text-[#C8102E]" : "text-white/90 hover:text-[#C8102E]"
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
      {open ? (
        <div id="mobile-menu" className="border-b border-[#E5E7EB] bg-white lg:hidden">
          <nav className="site-shell grid gap-1 py-4 text-base font-medium" aria-label="Mobile navigation">
            {site.mobileNavigation.map(({ label, href }) => (
              <a key={label} className="rounded-[10px] px-4 py-3 text-[#344054] transition hover:bg-[#F7F7F8] hover:text-[#111111]" href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <a href={site.contact.telephoneHref} className="rounded-[10px] px-4 py-3 font-bold text-[#C8102E]" onClick={() => setOpen(false)}>
              Call {site.contact.telephone}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function Hero({ site }: { site: ActRoofingSiteConfig }) {
  // Mirrors roofline.co.nz: the supplied aerial frame carries the headline
  // baked into the artwork, so the hero renders image-only.
  return (
    <section aria-label="Introduction" className="relative isolate w-full overflow-hidden bg-[#111111]">
      <div className="relative mx-auto h-[52vw] min-h-[260px] w-full sm:min-h-[320px] lg:max-h-[78vh]">
        <Image
          src={site.hero.image.src}
          alt={site.hero.image.alt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
          loading="eager"
        />
      </div>
      <h1 className="sr-only">{site.hero.title}</h1>
    </section>
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="services" className="section-pad bg-[#F7F8FA]">
      <div className="site-shell">
        <SectionIntro eyebrow={site.servicesIntro.eyebrow} title={site.servicesIntro.title}>
          <p>{site.servicesIntro.description}</p>
        </SectionIntro>
        <ul className="mt-10 divide-y divide-[#E5E7EB] border-y border-[#E5E7EB]">
          {site.services.map((service, index) => {
            const isOpen = openIndex === index;
            return (
              <li key={service.title}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left transition hover:text-[#C8102E]"
                  aria-expanded={isOpen}
                  aria-controls={`service-panel-${index}`}
                  id={`service-button-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="flex items-baseline gap-4">
                    <span className="text-sm font-semibold tracking-[0.08em] text-[#98A2B3]">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-lg font-semibold tracking-[-0.01em] text-[#101828]">{service.title}</span>
                  </span>
                  <svg
                    aria-hidden="true"
                    className={`h-5 w-5 shrink-0 text-[#667085] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  id={`service-panel-${index}`}
                  role="region"
                  aria-labelledby={`service-button-${index}`}
                  className={`grid transition-[grid-template-rows] duration-200 ${isOpen ? "[grid-template-rows:1fr]" : "[grid-template-rows:0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-4 pb-6 pl-10 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-xl text-[0.98rem] leading-7 text-[#475467]">{service.summary}</p>
                      {service.linkLabel ? (
                        <a href={service.linkHref ?? "#contact"} className="inline-flex shrink-0 items-center gap-2 text-[0.9rem] font-semibold text-[#C8102E] transition hover:gap-3">
                          {service.linkLabel}
                          <ArrowIcon />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function EstimateToolSection({ site }: { site: ActRoofingSiteConfig }) {
  return <section id="estimate" className="section-pad bg-white"><div className="site-shell"><div className="rounded-[24px] border border-[#D6E5F8] bg-[#F5F9FF] p-6 sm:p-10 lg:p-12">
    <div className="grid items-center gap-9 lg:grid-cols-2">
      <div><p className="section-eyebrow">FREE ROOF TOOLS</p><h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#101828] sm:text-4xl">A starting price.<br />A clearer next step.</h2><p className="mt-5 max-w-xl text-base leading-8 text-[#667085]">Choose the route that fits what you know. Get a ballpark without measurements, or use more detail to build an itemised estimate.</p>
        <ul className="mt-6 grid gap-3 text-sm text-[#344054]"><li className="flex gap-2"><CheckIcon/>No account needed to try the tools</li><li className="flex gap-2"><CheckIcon/>Uses Roofline products with illustrative demo pricing</li><li className="flex gap-2"><CheckIcon/>Carry your estimate into a quote enquiry</li></ul>
        <div className="mt-7"><ButtonLink href={site.estimateTool.ctaHref}>See your pricing options<ArrowIcon/></ButtonLink></div>
      </div><RoofToolChoices compact />
    </div>
  </div></div></section>;
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
                    <span className="text-xs text-[#667085]">ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â·</span>
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
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#C8102E]/10 text-lg font-semibold text-[#C8102E]">
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
          <ButtonLink href={site.estimateTool.ctaHref} className="!bg-[#C8102E] !text-white hover:!bg-[#A50D26]">
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
  const preferredTimeframes = quoteRequest.preferredTimeframes ?? ["As soon as practical", "Within 1ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“3 months", "Within 3ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“6 months", "More than 6 months away", "Just researching"];
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

  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    const isQuoteForm = formData.has("project");
    const pretty: Record<string, string> = isQuoteForm
      ? {
          Name: String(formData.get("name") ?? ""),
          Phone: String(formData.get("phone") ?? ""),
          Email: String(formData.get("email") ?? ""),
          Postcode: String(formData.get("postcode") ?? ""),
          "Service required": String(formData.get("project") ?? ""),
          "Preferred timeframe": String(formData.get("timeframe") ?? ""),
          "Preferred contact method": String(formData.get("preferred-contact") ?? ""),
          "Before a quote": String(formData.getAll("contact-before-quote").join(", ")),
          "Project description": String(formData.get("message") ?? ""),
        }
      : {
          Name: String(formData.get("contact-name") ?? ""),
          Phone: String(formData.get("contact-phone") ?? ""),
          Email: String(formData.get("contact-email") ?? ""),
          Message: String(formData.get("contact-message") ?? ""),
        };
    const attachmentNames = formData
      .getAll("attachments")
      .flatMap((f) => (f instanceof File && f.name ? [f.name] : [])) as string[];

    setSending(true);
    setStatus("");
    try {
      const res = await fetch("/api/site-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: isQuoteForm ? "quote" : "contact", fields: pretty, attachmentNames }),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus(site.contactSection.formStatus);
      form.reset();
      setAttachmentLabel(site.quoteRequest?.fileEmptyText ?? "No file chosen");
    } catch {
      setStatus("Sorry - something went wrong sending your message. Please try again or call us directly.");
    } finally {
      setSending(false);
    }
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
          <div className="mt-8 grid gap-5 sm:max-w-sm">
            <ButtonLink href={site.estimateTool.ctaHref} variant="primary">
              {site.callsToAction.estimate}
              <ArrowIcon />
            </ButtonLink>
            <div className="grid gap-3 border-t border-[#E5E7EB] pt-5 text-[0.95rem]">
              <a className="flex items-center gap-2.5 font-medium text-[#344054] transition hover:text-[#C8102E]" href={site.contact.telephoneHref}>
                <PhoneIcon />
                {site.contact.telephone}
              </a>
              <a className="font-medium text-[#344054] transition hover:text-[#C8102E]" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
              <a className="font-medium text-[#C8102E] transition hover:gap-3 inline-flex items-center gap-2 w-fit" href="#quote-request" onClick={openQuoteChoice}>
                {site.callsToAction.quote}
                <ArrowIcon />
              </a>
            </div>
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
              <button className="button-base bg-[#C8102E] text-white hover:bg-[#A50D26]" type="submit">
                Send message
                <ArrowIcon />
              </button>
            </div>
            {status ? <p className="rounded-[10px] bg-[#FDF2F4] p-3 text-sm font-medium text-[#175CD3]" role="status">{status}</p> : null}
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
              {/* Tool option - featured */}
              <a href={site.estimateTool.ctaHref} className="group relative overflow-hidden rounded-[18px] border-2 border-[#C8102E] bg-[#FDF2F4] p-6 transition hover:border-[#A50D26] hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className={`text-xl font-semibold text-[#101828]`}>{site.quoteModal?.toolTitle ?? "Get an Instant Estimate"}</h4>
                    <p className="mt-2 leading-7 text-[#475467]">
                      {site.quoteModal?.toolDescription}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#C8102E] transition group-hover:gap-3">
                      Use the tool
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
              </a>
              {/* Form option - secondary */}
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
                  <span className="rounded-[8px] bg-[#C8102E] px-4 py-2 text-sm font-semibold text-white">
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
                      <input className="mt-1 h-4 w-4 accent-[#C8102E]" name="preferred-contact" type="radio" value={method} required />
                      {method}
                    </label>
                  ))}
                </fieldset>
                <fieldset className="grid gap-3 rounded-[14px] border border-[#E5E7EB] bg-[#F7F8FA] p-4">
                  <legend className="px-1 text-sm font-medium text-[#344054]">Before a quote</legend>
                  {beforeQuoteOptions.map((option) => (
                    <label key={option} className="flex items-start gap-3 text-sm font-medium text-[#344054]">
                      <input className="mt-1 h-4 w-4 accent-[#C8102E]" name="contact-before-quote" type="checkbox" value={option} />
                      {option}
                    </label>
                  ))}
                </fieldset>
              </div>
              <label className="flex items-start gap-3 rounded-[14px] border border-[#E5E7EB] bg-[#F7F8FA] p-4 text-sm leading-6 text-[#344054]">
                <input className="mt-1 h-4 w-4 shrink-0 accent-[#C8102E]" name="consent" type="checkbox" required />
                I agree that the details entered may be used to respond to this enquiry.
              </label>
              <button className="button-base bg-[#C8102E] text-white hover:bg-[#A50D26]" type="submit">
                Send
                <ArrowIcon />
              </button>
              {status ? <p className="rounded-[10px] bg-[#FDF2F4] p-3 text-sm font-medium text-[#175CD3]" role="status">{status}</p> : null}
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
      <ButtonLink href={site.estimateTool.ctaHref} className="w-full !bg-[#C8102E] !text-white hover:!bg-[#A50D26]">
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
          <a className="flex items-center gap-3" href="#top" aria-label={`${site.companyName} home`}>
            <span className="relative block h-11 w-11 shrink-0">
              <Image src={site.brand.logo.src} alt={site.brand.logo.alt} fill sizes="44px" className="object-contain" />
            </span>
            <span className="text-lg font-bold tracking-[-0.01em] text-white">
              Roofline<span className="text-[#C8102E]"> Canterbury</span>
            </span>
          </a>
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
            <a key={service.title} className="text-white/70 transition hover:text-white" href={service.linkHref ?? "#services"}>
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
          ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© {new Date().getFullYear()} {site.companyName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
