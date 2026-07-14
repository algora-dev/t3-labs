"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import type { ProspectSiteConfig } from "@/sites/types";

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

function ButtonLink({
  href,
  children,
  variant = "dark",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light" | "line" | "heroLine";
  className?: string;
}) {
  const style =
    variant === "dark"
      ? "bg-[#223036] text-white hover:bg-[#a95537]"
      : variant === "light"
        ? "bg-white text-[#1d2529] hover:bg-[#f1e7dc]"
        : variant === "heroLine"
          ? "border-white/55 text-white hover:border-white hover:bg-white hover:text-[#1d2529]"
          : "border-[#a7b0ae] text-[#1d2529] hover:border-[#1d2529] hover:bg-white";

  return (
    <a className={`button-base rounded-[8px] ${style} ${className}`} href={href}>
      {children}
    </a>
  );
}

function SectionIntro({
  eyebrow,
  title,
  children,
  light = false,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1fr] lg:items-end">
      <div>
        <p className={`section-eyebrow ${light ? "text-[#f1c59f]" : "text-[#a95537]"}`}>{eyebrow}</p>
        <h2 className={`mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${light ? "text-white" : "text-[#1d2529]"}`}>{title}</h2>
      </div>
      {children ? <div className={`max-w-2xl text-base leading-8 sm:text-lg ${light ? "text-white/76" : "text-[#566267]"}`}>{children}</div> : null}
    </div>
  );
}

export function Header({ site }: { site: ProspectSiteConfig }) {
  const [open, setOpen] = useState(false);
  const phoneHref = site.contact.telephoneHref;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f5ef]/96 backdrop-blur">
      <div className="site-shell flex min-h-20 items-center justify-between gap-5">
        <a className="flex items-center gap-3" href="#top" aria-label="Falcon Contracting home">
          <span className="relative block h-12 w-40 overflow-hidden rounded-[8px] bg-white sm:w-44">
            <Image src={site.brand.wordmark.src} alt={site.brand.wordmark.alt} fill sizes="176px" className="scale-125 object-contain" priority />
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-bold uppercase tracking-[0.08em] text-[#394348] lg:flex" aria-label="Main navigation">
          {site.navigation.map(({ label, href }) => (
            <a key={label} className="transition hover:text-[#a95537]" href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href={phoneHref} variant="line" className="px-4">
            <PhoneIcon />
            Call now
          </ButtonLink>
          <ButtonLink href="#quote-request">
            {site.callsToAction.quote}
            <ArrowIcon />
          </ButtonLink>
        </div>
        <button
          className="grid h-11 w-11 place-items-center rounded-[8px] border border-[#a7b0ae] bg-white text-[#1d2529] transition hover:border-[#1d2529] lg:!hidden"
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
        <div id="mobile-menu" className="border-t border-black/10 bg-[#f7f5ef] lg:hidden">
          <nav className="site-shell grid gap-2 py-5 text-sm font-bold uppercase tracking-[0.08em]" aria-label="Mobile navigation">
            {site.mobileNavigation.map(({ label, href }) => (
              <a key={label} className="rounded-[8px] border border-black/10 bg-white px-4 py-3" href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <div className="grid gap-3 pt-3 sm:grid-cols-2">
              <ButtonLink href={phoneHref} variant="line">
                <PhoneIcon />
                Call now
              </ButtonLink>
              <ButtonLink href="#quote-request">
                {site.callsToAction.quote}
                <ArrowIcon />
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function Hero({ site }: { site: ProspectSiteConfig }) {
  return (
    <section id="top" className="bg-[#182226] py-4 text-white sm:py-5">
      <div className="site-shell">
        <div className="relative isolate min-h-[620px] overflow-hidden rounded-[16px] bg-[#1d2529] sm:min-h-[680px]">
          <Image
            src={site.hero.image.src}
            alt={site.hero.image.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="image-shade absolute inset-0" />
          <div className="relative z-10 flex min-h-[620px] items-end p-5 sm:min-h-[680px] sm:p-10 lg:p-14">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-[8px] border border-white/35 bg-black/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/90">
                {site.hero.eyebrow}
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-5xl">
                {site.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl">
                {site.hero.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#quote-request" variant="light">
                  {site.callsToAction.quote}
                  <ArrowIcon />
                </ButtonLink>
                <ButtonLink href={site.contact.telephoneHref} variant="heroLine">
                  <PhoneIcon />
                  {site.callsToAction.call}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Intro({ site }: { site: ProspectSiteConfig }) {
  return (
    <section id="about" className="section-pad bg-white">
      <div className="site-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="section-eyebrow text-[#a95537]">{site.about.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1d2529] sm:text-4xl lg:text-5xl">
            {site.about.title}
          </h2>
        </div>
        <div className="grid gap-5 text-lg leading-8 text-[#566267]">
          {site.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
    </section>
  );
}

export function Services({ site }: { site: ProspectSiteConfig }) {
  return (
    <section id="services" className="section-pad bg-[#f7f5ef]">
      <div className="site-shell">
        <SectionIntro eyebrow={site.servicesIntro.eyebrow} title={site.servicesIntro.title}>
          <p>{site.servicesIntro.description}</p>
        </SectionIntro>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {site.services.map((service) => (
            <article key={service.title} className="group overflow-hidden rounded-[12px] border border-[#d8dedc] bg-white transition hover:-translate-y-0.5">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={service.image.src}
                  alt={service.image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.025]"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1d2529]">{service.title}</h3>
                <p className="mt-3 leading-7 text-[#5e696f]">{service.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Projects({ site }: { site: ProspectSiteConfig }) {
  return (
    <section id="projects" className="section-pad bg-[#1d2529] text-white">
      <div className="site-shell">
        <SectionIntro eyebrow={site.projectsIntro.eyebrow} title={site.projectsIntro.title} light>
          <p>{site.projectsIntro.description}</p>
        </SectionIntro>
        <div className="mt-10 grid gap-4 md:grid-cols-6">
          {site.projects.map((project, index) => {
            const featured = index === 0 || index === 1;
            return (
              <figure
                key={project.src}
                className={`${featured ? "md:col-span-3 lg:col-span-3" : "md:col-span-3 lg:col-span-2"} group relative min-h-72 overflow-hidden rounded-[12px] bg-black`}
              >
                <Image
                  src={project.src}
                  alt={project.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover opacity-[0.92] transition duration-300 group-hover:scale-[1.025]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/78 to-transparent p-5 text-sm font-bold uppercase tracking-[0.08em]">
                  {project.label}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WhyChoose({ site }: { site: ProspectSiteConfig }) {
  return (
    <section className="section-pad bg-white">
      <div className="site-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="section-eyebrow text-[#a95537]">{site.whyChoose.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1d2529] sm:text-4xl lg:text-5xl">{site.whyChoose.title}</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#566267]">
            {site.whyChoose.description}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {site.whyChoose.items.map((item, index) => (
            <div key={item} className="rounded-[16px] border border-[#d8dedc] bg-[#fbfaf7] p-6">
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-[#a95537]">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-4 text-lg font-bold leading-7 text-[#29353a]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Feedback({ site }: { site: ProspectSiteConfig }) {
  return (
    <section className="section-pad bg-[#eee9df]">
      <div className="site-shell">
        <SectionIntro eyebrow={site.testimonials.eyebrow} title={site.testimonials.title}>
          <p>{site.testimonials.description}</p>
        </SectionIntro>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {site.testimonials.items.map((review) => (
            <article key={review.summary} className="rounded-[16px] border border-[#d8dedc] bg-white p-7">
              <p className="text-lg font-bold leading-8 text-[#29353a]">{review.summary}</p>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.08em] text-[#6a7478]">{review.source}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessAndAreas({ site }: { site: ProspectSiteConfig }) {
  return (
    <section id="areas" className="section-pad bg-white">
      <div className="site-shell grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[16px] border border-[#d8dedc] bg-[#fbfaf7] p-6 sm:p-8">
          <p className="section-eyebrow text-[#a95537]">{site.process.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1d2529] sm:text-4xl">{site.process.title}</h2>
          <ol className="mt-8 grid gap-3">
            {site.process.steps.map((step, index) => (
              <li key={step} className="flex items-center gap-4 rounded-[12px] border border-[#d8dedc] bg-white p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#223036] text-sm font-bold text-white">{index + 1}</span>
                <span className="text-lg font-bold text-[#29353a]">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-[16px] bg-[#223036] p-6 text-white sm:p-8">
          <p className="section-eyebrow text-[#f1c59f]">{site.coverage.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{site.coverage.title}</h2>
          <p className="mt-5 leading-8 text-white/76">
            {site.coverage.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {site.coverage.areas.map((area) => (
              <span key={area} className="rounded-[8px] border border-white/25 bg-white/5 px-4 py-3 text-sm font-bold uppercase tracking-[0.08em]">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact({ site }: { site: ProspectSiteConfig }) {
  const [status, setStatus] = useState("");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const quoteTypes = ["Re-roof", "New Roof", "Extension", "Repairs", "Spouting/Downpipes", "Solar", "Other"];

  useEffect(() => {
    function syncQuoteModal() {
      setQuoteOpen(window.location.hash === "#quote-request");
    }

    syncQuoteModal();
    window.addEventListener("hashchange", syncQuoteModal);
    return () => window.removeEventListener("hashchange", syncQuoteModal);
  }, []);

  useEffect(() => {
    if (!quoteOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeQuoteModal();
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [quoteOpen]);

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

  return (
    <section id="contact" className="section-pad bg-[#f7f5ef]">
      <div className="site-shell grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="section-eyebrow text-[#a95537]">{site.contactSection.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1d2529] sm:text-4xl lg:text-5xl">{site.contactSection.title}</h2>
          <p className="mt-5 text-lg leading-8 text-[#566267]">
            {site.contactSection.description}
          </p>
          <div className="mt-8 grid gap-3 sm:max-w-sm">
            <ButtonLink href={site.contact.telephoneHref} variant="dark">
              <PhoneIcon />
              {site.contact.telephone}
            </ButtonLink>
            <ButtonLink href="#quote-request" variant="line">
              Request a Quote
              <ArrowIcon />
            </ButtonLink>
          </div>
        </div>
        <div className="rounded-[16px] border border-[#d8dedc] bg-white p-6 sm:p-8">
          <p className="section-eyebrow text-[#a95537]">Quote request</p>
          <h3 className="mt-3 text-2xl font-bold leading-tight text-[#1d2529]">Ready to price the work?</h3>
          <p className="mt-4 leading-7 text-[#566267]">
            Send the details through the quote form and Falcon can review the job information before coming back to you.
          </p>
          <a className="button-base mt-7 rounded-[8px] bg-[#223036] text-white hover:bg-[#a95537]" href="#quote-request">
            Open quote form
            <ArrowIcon />
          </a>
        </div>
      </div>
      {quoteOpen ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#12191c]/72 px-4 py-6 backdrop-blur-sm sm:py-10" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
          <button className="fixed inset-0 h-full w-full cursor-default" type="button" aria-label="Close quote form" onClick={closeQuoteModal} />
          <div className="relative mx-auto max-w-3xl rounded-[16px] border border-[#d8dedc] bg-white p-5 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="section-eyebrow text-[#a95537]">Quote request form</p>
                <h3 id="quote-modal-title" className="mt-3 text-2xl font-bold leading-tight text-[#1d2529] sm:text-3xl">Request a quote</h3>
                <p className="mt-3 text-sm italic leading-6 text-[#7b8588]">
                  The more info you can provide us now the faster we can get a quote back to you
                </p>
              </div>
              <button className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] border border-[#d8dedc] text-[#1d2529] transition hover:border-[#1d2529] hover:bg-[#f7f5ef]" type="button" onClick={closeQuoteModal}>
                <span className="sr-only">Close quote form</span>
                <MenuIcon open />
              </button>
            </div>
            <form className="mt-6 grid gap-5" onSubmit={onSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                  Name
                  <input className="form-field" name="name" required />
                </label>
                <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                  Phone
                  <input className="form-field" name="phone" inputMode="tel" required />
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                  Email
                  <input className="form-field" name="email" type="email" required />
                </label>
                <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                  Start date
                  <input className="form-field" name="start-date" type="date" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                Address
                <input className="form-field" name="address" required />
              </label>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                Project type
                <select className="form-field bg-white" name="project" required defaultValue="">
                  <option value="" disabled>
                    Select project type
                  </option>
                  {quoteTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                Attach plans/photos
                <input className="form-field file:mr-4 file:rounded-[8px] file:border-0 file:bg-[#223036] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white" name="attachments" type="file" accept="image/*,.pdf" multiple />
              </label>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                Message
                <textarea className="form-field min-h-36 resize-y p-4" name="message" required />
              </label>
              <fieldset className="grid gap-3 rounded-[12px] border border-[#d8dedc] bg-[#fbfaf7] p-4">
                <legend className="px-1 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Before quote</legend>
                <label className="flex items-start gap-3 text-sm font-bold text-[#29353a]">
                  <input className="mt-1 h-4 w-4 accent-[#a95537]" name="contact-before-quote" type="checkbox" value="call" />
                  Request call before quote
                </label>
                <label className="flex items-start gap-3 text-sm font-bold text-[#29353a]">
                  <input className="mt-1 h-4 w-4 accent-[#a95537]" name="contact-before-quote" type="checkbox" value="email" />
                  Request email before quote
                </label>
              </fieldset>
              <button className="button-base rounded-[8px] bg-[#223036] text-white hover:bg-[#a95537]" type="submit">
                Send
                <ArrowIcon />
              </button>
              {status ? <p className="rounded-[8px] bg-[#f7f5ef] p-3 text-sm font-bold text-[#4f5a5f]" role="status">{status}</p> : null}
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function MobileActions({ site }: { site: ProspectSiteConfig }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[#f7f5ef]/96 p-3 backdrop-blur lg:hidden">
      <div className="grid grid-cols-2 gap-3">
        <ButtonLink href={site.contact.telephoneHref} variant="line" className="px-3 text-xs">
          <PhoneIcon />
          Call
        </ButtonLink>
        <ButtonLink href="#quote-request" className="px-3 text-xs">
          Quote
          <ArrowIcon />
        </ButtonLink>
      </div>
    </div>
  );
}

export function Footer({ site }: { site: ProspectSiteConfig }) {
  return (
    <footer className="bg-[#1d2529] pb-24 pt-10 text-white lg:pb-10">
      <div className="site-shell grid gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <Image src={site.brand.wordmark.src} alt={site.brand.wordmark.alt} width={190} height={70} className="rounded-[8px] bg-white p-2" />
          <p className="mt-5 font-bold">{site.companyName}</p>
          <p className="mt-1 text-white/70">{site.footer.location}</p>
          <a className="mt-4 inline-flex font-bold text-white hover:text-[#f1c59f]" href={site.contact.telephoneHref}>
            {site.contact.telephone}
          </a>
        </div>
        <nav className="grid gap-3 text-sm font-bold uppercase tracking-[0.08em]" aria-label="Footer navigation">
          {site.navigation.map(({ label, href }) => (
            <a key={label} className="hover:text-[#f1c59f]" href={href}>
              {label}
            </a>
          ))}
          <a className="hover:text-[#f1c59f]" href={site.contact.linkedinUrl}>
            {site.footer.socialLabel}
          </a>
        </nav>
      </div>
    </footer>
  );
}
