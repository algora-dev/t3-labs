"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import type { ActRoofingSiteConfig } from "@/components/demo-sites/act-roofing/types";

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
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light" | "line" | "heroGreen";
  className?: string;
  onClick?: () => void;
}) {
  const style =
    variant === "dark"
      ? "bg-[#223036] text-white hover:bg-[#a95537]"
      : variant === "light"
        ? "bg-white text-[#1d2529] hover:bg-[#f1e7dc]"
        : variant === "heroGreen"
          ? "bg-[#a5d52f] text-[#1d2529] hover:bg-[#b6e342]"
          : "border-[#a7b0ae] text-[#1d2529] hover:border-[#1d2529] hover:bg-white";

  return (
    <a className={`button-base rounded-[8px] ${style} ${className}`} href={href} onClick={onClick}>
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

function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="More information"
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="flex h-5 w-5 shrink-0 cursor-help items-center justify-center rounded-full border border-[#cfd3d2] bg-white text-[10px] font-bold leading-none text-[#6f7377] transition hover:scale-110 hover:border-[#9da3a6]"
      >
        i
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute right-full top-1/2 z-[100] mr-2 w-64 -translate-y-1/2 rounded-lg bg-[#1d2529] px-3 py-2 text-xs font-normal leading-relaxed text-white shadow-xl"
        >
          {text}
        </span>
      )}
    </span>
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
        <p className={`section-eyebrow ${light ? "text-[#cfd3d2]" : "text-[#6f7377]"}`}>{eyebrow}</p>
        <h2 className={`mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${light ? "text-white" : "text-[#1d2529]"}`}>{title}</h2>
      </div>
      {children ? <div className={`max-w-2xl text-base leading-8 sm:text-lg ${light ? "text-white/76" : "text-[#566267]"}`}>{children}</div> : null}
    </div>
  );
}

export function Header({ site }: { site: ActRoofingSiteConfig }) {
  const [open, setOpen] = useState(false);
  const phoneHref = site.contact.telephoneHref;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f5ef]/96 backdrop-blur">
      <div className="site-shell flex min-h-20 items-center justify-between gap-5">
        <a className="flex items-center gap-3" href="#top" aria-label={`${site.companyName} home`}>
          <span className="relative block h-14 w-44 sm:w-48">
            <Image src={site.brand.wordmark.src} alt={site.brand.wordmark.alt} fill sizes="192px" className="object-contain" priority />
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-bold uppercase tracking-[0.08em] text-[#5f666a] lg:flex" aria-label="Main navigation">
          {site.navigation.map(({ label, href }) => (
            <a key={label} className="transition hover:text-[#2f383d]" href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="#quote-request" className="header-quote-button" onClick={openQuoteChoice}>
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
            <div className="pt-3">
              <ButtonLink href="#quote-request" onClick={() => { setOpen(false); openQuoteChoice(); }}>
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

export function Hero({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section id="top" className="bg-[#182226] py-4 text-white sm:py-5">
      <div className="site-shell">
        <div className="relative isolate min-h-[620px] overflow-hidden rounded-[16px] border border-white/10 bg-[#0d1b2a] sm:min-h-[680px]">
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
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,20,34,0.94)_0%,rgba(7,20,34,0.82)_38%,rgba(7,20,34,0.34)_72%,rgba(7,20,34,0.12)_100%),linear-gradient(0deg,rgba(7,20,34,0.50)_0%,rgba(7,20,34,0.04)_55%)]"
            aria-hidden="true"
          />
          <div className="relative z-10 flex min-h-[620px] items-end p-6 sm:min-h-[680px] sm:p-10 lg:p-14">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-[8px] border border-white/35 bg-black/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/90">
                {site.hero.eyebrow}
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                {site.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl">
                {site.hero.description}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#quote-request" variant="light" onClick={openQuoteChoice}>
                  {site.callsToAction.quote}
                  <ArrowIcon />
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Intro({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section id="about" className="section-pad bg-white">
      <div className="site-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="section-eyebrow text-[#6f7377]">{site.about.eyebrow}</p>
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

export function Services({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section id="services" className="section-pad bg-[#f7f5ef]">
      <div className="site-shell">
        <SectionIntro eyebrow={site.servicesIntro.eyebrow} title={site.servicesIntro.title}>
          <p>{site.servicesIntro.description}</p>
        </SectionIntro>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {site.services.map((service) => (
            <article key={service.title} className="group overflow-hidden rounded-[12px] border border-[#d8dedc] bg-white transition hover:-translate-y-0.5">
              {service.image ? (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image.src}
                    alt={service.image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.025]"
                  />
                </div>
              ) : (
                <div className="h-2 bg-[#2e7d32]" aria-hidden="true" />
              )}
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

export function Projects({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section id="projects" className="section-pad bg-[#1d2529] text-white">
      <div className="site-shell">
        <SectionIntro eyebrow={site.projectsIntro.eyebrow} title={site.projectsIntro.title} light>
          <p>{site.projectsIntro.description}</p>
        </SectionIntro>
        <div className="mt-10">
          {site.projects.map((project) => (
              <figure key={project.src} className="group overflow-hidden rounded-[12px] border border-white/15 bg-[#0d1b2a]">
                <div className="relative aspect-[917/161] min-h-[170px] w-full overflow-hidden">
                <Image
                  src={project.src}
                  alt={project.alt}
                  fill
                  sizes="100vw"
                  className="object-cover opacity-[0.96] transition duration-300 group-hover:scale-[1.01]"
                />
                </div>
                <figcaption className="border-t border-white/10 bg-[#0d1b2a] p-5 text-sm font-bold uppercase tracking-[0.08em]">
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
    <section className="section-pad bg-white">
      <div className="site-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="section-eyebrow text-[#6f7377]">{site.whyChoose.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1d2529] sm:text-4xl lg:text-5xl">{site.whyChoose.title}</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#566267]">
            {site.whyChoose.description}
          </p>
          {site.whyChoose.image ? (
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[16px] bg-[#1d2529]">
              <Image src={site.whyChoose.image.src} alt={site.whyChoose.image.alt} fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
            </div>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {site.whyChoose.items.map((item, index) => (
            <div key={item} className="rounded-[16px] border border-[#d8dedc] bg-[#fbfaf7] p-6">
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-[#6f7377]">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-4 text-lg font-bold leading-7 text-[#29353a]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Feedback({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section id="reviews" className="section-pad bg-[#eee9df]">
      <div className="site-shell">
        <SectionIntro eyebrow={site.testimonials.eyebrow} title={site.testimonials.title}>
          <p>{site.testimonials.description}</p>
        </SectionIntro>
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
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

export function ProcessAndAreas({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <section id="areas" className="section-pad bg-white">
      <div className="site-shell grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[16px] border border-[#d8dedc] bg-[#fbfaf7] p-6 sm:p-8">
          <p className="section-eyebrow text-[#6f7377]">{site.process.eyebrow}</p>
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
          <p className="section-eyebrow text-[#cfd3d2]">{site.coverage.eyebrow}</p>
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

export function Contact({ site }: { site: ActRoofingSiteConfig }) {
  const [status, setStatus] = useState("");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [choiceOpen, setChoiceOpen] = useState(false);
  const [attachmentLabel, setAttachmentLabel] = useState(site.quoteRequest?.fileEmptyText ?? "No file chosen");
  const quoteRequest = site.quoteRequest ?? {
    projectTypes: ["Re-roof", "New Roof", "Extension", "Repairs", "Spouting/Downpipes", "Solar", "Other"],
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

  return (
    <section id="contact" className="section-pad bg-[#f7f5ef]">
      <div className="site-shell grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="section-eyebrow text-[#6f7377]">{site.contactSection.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1d2529] sm:text-4xl lg:text-5xl">{site.contactSection.title}</h2>
          <p className="mt-5 text-lg leading-8 text-[#566267]">
            {site.contactSection.description}
          </p>
          <div className="mt-8 grid gap-3 sm:max-w-sm">
            <ButtonLink href={site.contact.telephoneHref} variant="dark">
              <PhoneIcon />
              {site.contact.telephone}
            </ButtonLink>
            <ButtonLink href="#quote-request" variant="line" className="bg-white" onClick={openQuoteChoice}>
              Request a Quote
              <ArrowIcon />
            </ButtonLink>
            <ButtonLink href={`mailto:${site.contact.email}`} variant="line" className="bg-white">
              {site.callsToAction.email}
            </ButtonLink>
          </div>
        </div>
        <div className="rounded-[16px] border border-[#d8dedc] bg-white p-6 sm:p-8">
          <p className="section-eyebrow text-[#6f7377]">General enquiry</p>
          <h3 className="mt-3 text-2xl font-bold leading-tight text-[#1d2529]">{site.contactSection.generalFormTitle ?? `Send ${site.companyName} a message`}</h3>
          <form className="mt-6 grid gap-5" onSubmit={onSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                Name
                <input className="form-field" name="contact-name" required />
              </label>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                Phone
                <input className="form-field" name="contact-phone" inputMode="tel" required />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
              Email
              <input className="form-field" name="contact-email" type="email" />
            </label>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
              Message
              <textarea className="form-field min-h-32 resize-y p-4" name="contact-message" required />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="button-base rounded-[8px] bg-[#223036] text-white hover:bg-[#a95537]" type="submit">
                Send message
                <ArrowIcon />
              </button>
              <a className="button-base rounded-[8px] border-[#cbd3d2] bg-[#f7f5ef] text-[#1d2529] hover:border-[#1d2529] hover:bg-[#eee9df]" href="#quote-request" onClick={openQuoteChoice}>
                Request a quote
              </a>
            </div>
            {status ? <p className="rounded-[8px] bg-[#f7f5ef] p-3 text-sm font-bold text-[#4f5a5f]" role="status">{status}</p> : null}
          </form>
        </div>
      </div>
      {choiceOpen ? (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#12191c]/72 px-4 py-6 backdrop-blur-sm sm:py-10" role="dialog" aria-modal="true" aria-labelledby="choice-modal-title">
          <button className="fixed inset-0 h-full w-full cursor-default" type="button" aria-label="Close" onClick={closeChoiceModal} />
          <div className="relative mx-auto max-w-2xl rounded-[16px] border border-[#d8dedc] bg-white p-5 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="section-eyebrow text-[#6f7377]">Request a Quote</p>
                <h3 id="choice-modal-title" className="mt-3 text-2xl font-bold leading-tight text-[#1d2529] sm:text-3xl">How would you like to proceed?</h3>
              </div>
              <button className="cursor-pointer grid h-10 w-10 shrink-0 place-items-center rounded-[8px] border border-[#d8dedc] text-[#1d2529] transition hover:border-[#1d2529] hover:bg-[#f7f5ef]" type="button" onClick={closeChoiceModal}>
                <span className="sr-only">Close</span>
                <MenuIcon open />
              </button>
            </div>
            <div className="mt-6 grid gap-4">
              {/* Tool option — featured */}
              <a href="/demo-sites/act-roofing-ltd/takeoff" className="group relative cursor-pointer overflow-hidden rounded-[16px] border-2 border-[#2e7d32] bg-[#f0f7f0] p-6 transition hover:border-[#1b5e20] hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-[#1d2529]">{site.quoteModal?.toolTitle ?? "Get Preliminary Pricing"}</h4>
                    <p className="mt-2 leading-7 text-[#4a5559]">
                      {site.quoteModal?.toolDescription}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#2e7d32] transition group-hover:gap-3">
                      Use the tool
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
              </a>
              {/* Form option — secondary */}
              <button type="button" onClick={openQuoteFormFromChoice} className="group relative cursor-pointer overflow-hidden rounded-[16px] border border-[#d8dedc] bg-[#fbfaf7] p-6 text-left transition hover:border-[#9da3a6] hover:bg-white">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-[#1d2529]">{site.quoteModal?.formTitle ?? "Fill out our request form"}</h4>
                    <p className="mt-2 leading-7 text-[#4a5559]">
                      {site.quoteModal?.formDescription}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#6f7377] transition group-hover:gap-3">
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
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#12191c]/72 px-4 py-6 backdrop-blur-sm sm:py-10" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
          <button className="fixed inset-0 h-full w-full cursor-default" type="button" aria-label="Close quote form" onClick={closeQuoteModal} />
          <div className="relative mx-auto max-w-3xl rounded-[16px] border border-[#d8dedc] bg-white p-5 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="section-eyebrow text-[#6f7377]">{quoteRequest.eyebrow ?? "Quote request form"}</p>
                <h3 id="quote-modal-title" className="mt-3 text-2xl font-bold leading-tight text-[#1d2529] sm:text-3xl">{quoteRequest.title ?? "Request a quote"}</h3>
                <p className="mt-3 text-sm italic leading-6 text-[#7b8588]">
                  {quoteRequest.helperText ?? "The more info you can provide us now the faster we can get a quote back to you"}
                </p>
              </div>
              <button className="cursor-pointer grid h-10 w-10 shrink-0 place-items-center rounded-[8px] border border-[#d8dedc] text-[#1d2529] transition hover:border-[#1d2529] hover:bg-[#f7f5ef]" type="button" onClick={closeQuoteModal}>
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
                  Postcode
                  <input className="form-field" name="postcode" autoComplete="postal-code" required />
                </label>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                  Service required
                  <select className="form-field bg-white" name="project" required defaultValue="">
                    <option value="" disabled>Select a service</option>
                    {quoteRequest.projectTypes.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                  Preferred timeframe
                  <select className="form-field bg-white" name="timeframe" required defaultValue="">
                    <option value="" disabled>Select a timeframe</option>
                    {preferredTimeframes.map((timeframe) => <option key={timeframe}>{timeframe}</option>)}
                  </select>
                </label>
              </div>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                {quoteRequest.fileLabel ?? "Attach plans/photos"}
                <span className="flex min-h-12 items-center justify-between gap-3 rounded-[8px] border border-[#cbd3d2] bg-white px-3 py-2 text-base font-normal normal-case tracking-normal text-[#1d2529]">
                  <span className="rounded-[8px] bg-[#223036] px-4 py-2 text-sm font-bold text-white">
                    {quoteRequest.fileButtonText ?? "Choose files"}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[#566267]">{attachmentLabel}</span>
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
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
                Project description
                <textarea className="form-field min-h-36 resize-y p-4" name="message" placeholder="Tell us about the property, the work you have in mind and anything that may affect the project." required />
              </label>
              <div className="grid gap-5 md:grid-cols-2">
                <fieldset className="grid gap-3 rounded-[12px] border border-[#d8dedc] bg-[#fbfaf7] p-4">
                  <legend className="px-1 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Preferred contact method</legend>
                  {preferredContactMethods.map((method) => (
                    <label key={method} className="flex items-start gap-3 text-sm font-bold text-[#29353a]">
                      <input className="mt-1 h-4 w-4 accent-[#a95537]" name="preferred-contact" type="radio" value={method} required />
                      {method}
                    </label>
                  ))}
                </fieldset>
                <fieldset className="grid gap-3 rounded-[12px] border border-[#d8dedc] bg-[#fbfaf7] p-4">
                  <legend className="px-1 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Before a quote</legend>
                  {beforeQuoteOptions.map((option) => (
                    <label key={option} className="flex items-start gap-3 text-sm font-bold text-[#29353a]">
                      <input className="mt-1 h-4 w-4 accent-[#a95537]" name="contact-before-quote" type="checkbox" value={option} />
                      {option}
                    </label>
                  ))}
                </fieldset>
              </div>
              <label className="flex items-start gap-3 rounded-[12px] border border-[#d8dedc] bg-[#fbfaf7] p-4 text-sm leading-6 text-[#29353a]">
                <input className="mt-1 h-4 w-4 shrink-0 accent-[#a95537]" name="consent" type="checkbox" required />
                I agree that the details entered may be used to respond to this enquiry. This demonstration does not send or store information.
              </label>
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

export function MobileActions({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[#f7f5ef]/96 p-3 backdrop-blur lg:hidden">
      <ButtonLink href="#quote-request" className="w-full px-3 text-xs" onClick={openQuoteChoice}>
        {site.callsToAction.quote}
        <ArrowIcon />
      </ButtonLink>
    </div>
  );
}

export function Footer({ site }: { site: ActRoofingSiteConfig }) {
  return (
    <footer className="bg-[#1d2529] pb-24 pt-10 text-white lg:pb-10">
      <div className="site-shell grid gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <Image src={site.brand.logo.src} alt={site.brand.logo.alt} width={240} height={70} className="h-auto w-[240px]" />
          <p className="mt-5 font-bold">{site.companyName}</p>
          <p className="mt-1 text-white/70">{site.footer.location}</p>
          <a className="mt-4 inline-flex font-bold text-white hover:text-[#f1c59f]" href={site.contact.telephoneHref}>
            {site.contact.telephone}
          </a>
          {site.contact.email ? (
            <a className="mt-2 block font-bold text-white/80 hover:text-[#f1c59f]" href={`mailto:${site.contact.email}`}>
              {site.contact.email}
            </a>
          ) : null}
        </div>
        <nav className="grid gap-3 text-sm font-bold uppercase tracking-[0.08em]" aria-label="Footer navigation">
          {site.navigation.map(({ label, href }) => (
            <a key={label} className="hover:text-[#f1c59f]" href={href}>
              {label}
            </a>
          ))}
          {site.contact.socialLinks.map((social) => (
            <a key={social.label} className="hover:text-[#f1c59f]" href={social.url} target="_blank" rel="noreferrer">
              {social.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
