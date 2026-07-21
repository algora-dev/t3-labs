"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
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
      ? "bg-[var(--site-ink)] text-white hover:bg-[var(--site-accent)]"
      : variant === "light"
        ? "bg-white text-[var(--site-ink)] hover:bg-[var(--site-paper)]"
        : variant === "heroLine"
          ? "border-white/55 text-white hover:border-white hover:bg-white hover:text-[var(--site-ink)]"
          : "border-[#a7b0ae] text-[var(--site-ink)] hover:border-[var(--site-ink)] hover:bg-white";

  return (
    <a className={`button-base rounded-[8px] ${style} ${className}`} href={href}>
      {children}
    </a>
  );
}

function renderHeading(title: string) {
  return title.split("\n").map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ));
}

export function Header({ site }: { site: ProspectSiteConfig }) {
  const [open, setOpen] = useState(false);
  const phoneHref = site.contact.telephoneHref;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[color:var(--site-paper)]/96 backdrop-blur">
      <div className="site-shell flex min-h-20 items-center justify-between gap-5">
        <a className="flex items-center gap-3" href="#top" aria-label={`${site.companyName} home`}>
          <span className="relative block h-16 w-52 overflow-hidden rounded-[8px] bg-white sm:h-18 sm:w-60">
            <Image src={site.brand.wordmark.src} alt={site.brand.wordmark.alt} fill sizes="240px" className="object-contain p-0.5 sm:p-0" priority />
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-bold uppercase tracking-[0.08em] text-[#394348] lg:flex" aria-label="Main navigation">
          {site.navigation.map(({ label, href }) => (
            <a key={label} className="transition hover:text-[var(--site-accent)]" href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href={phoneHref} variant="line" className="bg-white px-4">
            <PhoneIcon />
            Call now
          </ButtonLink>
          <ButtonLink href="#quote-request">
            {site.callsToAction.quote}
            <ArrowIcon />
          </ButtonLink>
        </div>
        <button
          className="grid h-11 w-11 place-items-center rounded-[8px] border border-[#a7b0ae] bg-white text-[var(--site-ink)] transition hover:border-[var(--site-ink)] lg:!hidden"
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
        <div id="mobile-menu" className="border-t border-black/10 bg-[var(--site-paper)] lg:hidden">
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
    <section id="top" className="bg-[var(--site-ink)] py-4 text-white sm:py-5">
      <div className="site-shell">
        <div className="relative isolate min-h-[620px] overflow-hidden rounded-[16px] bg-[var(--site-ink)] sm:min-h-[680px]">
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

export function TrustStrip({ site }: { site: ProspectSiteConfig }) {
  if (!site.trustItems?.length) return null;

  return (
    <aside className="border-b border-black/10 bg-white" aria-label="Company highlights">
      <div className="site-shell grid divide-y divide-black/10 py-3 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {site.trustItems.map((item) => (
          <p key={item} className="flex items-center justify-center gap-3 px-5 py-4 text-center text-sm font-bold uppercase tracking-[0.08em] text-[var(--site-ink)]">
            <span className="h-2 w-2 rounded-full bg-[var(--site-accent)]" aria-hidden="true" />
            {item}
          </p>
        ))}
      </div>
    </aside>
  );
}

export function Intro({ site }: { site: ProspectSiteConfig }) {
  return (
    <section id="about" className="section-pad bg-white">
      <div className={`site-shell grid gap-8 ${site.about.image ? "lg:grid-cols-[0.8fr_1fr_0.9fr]" : "lg:grid-cols-[0.85fr_1.15fr]"} lg:items-center`}>
        <div>
          <p className="section-eyebrow text-[var(--site-accent)]">{site.about.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--site-ink)] sm:text-4xl lg:text-5xl">
            {site.about.title}
          </h2>
        </div>
        <div className="grid gap-5 text-lg leading-8 text-[#566267]">
          {site.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        {site.about.image ? (
          <div className="relative min-h-80 overflow-hidden rounded-[16px] bg-[#d8dedc] lg:min-h-[460px]">
            <Image src={site.about.image.src} alt={site.about.image.alt} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function Services({ site }: { site: ProspectSiteConfig }) {
  return (
    <section id="services" className="section-pad bg-[var(--site-paper)]">
      <div className="site-shell">
        <div className="max-w-5xl">
          <p className="section-eyebrow text-[var(--site-accent)]">{site.servicesIntro.eyebrow}</p>
          <h2 className="mt-4 max-w-[40ch] text-3xl font-bold leading-tight text-[var(--site-ink)] sm:text-4xl lg:text-5xl">
            {renderHeading(site.servicesIntro.title)}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#566267] sm:text-lg">{site.servicesIntro.description}</p>
        </div>
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
                <h3 className="text-xl font-bold text-[var(--site-ink)]">{service.title}</h3>
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
    <section id="projects" className="section-pad bg-[var(--site-ink)] text-white">
      <div className="site-shell">
        <div className="max-w-5xl">
          <p className="section-eyebrow text-white/70">{site.projectsIntro.eyebrow}</p>
          <h2 className="mt-4 max-w-[28ch] text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {renderHeading(site.projectsIntro.title)}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/76 sm:text-lg">{site.projectsIntro.description}</p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-6">
          {site.projects.map((project, index) => {
            const finalWidePair = site.projects.length % 3 === 1 && index >= site.projects.length - 2;
            const featured = index === 0 || index === 1 || finalWidePair;
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
          <p className="section-eyebrow text-[var(--site-accent)]">{site.whyChoose.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--site-ink)] sm:text-4xl lg:text-5xl">{site.whyChoose.title}</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#566267]">
            {site.whyChoose.description}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {site.whyChoose.items.map((item, index) => (
            <div key={item} className="rounded-[16px] border border-[#d8dedc] bg-[#fbfaf7] p-6">
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--site-accent)]">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-4 text-lg font-bold leading-7 text-[#29353a]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Feedback({ site }: { site: ProspectSiteConfig }) {
  if (!site.testimonials.items.length) return null;

  return (
    <section id="reviews" className="section-pad bg-[#eee9df]">
      <div className="site-shell">
        <div className="max-w-3xl">
          <p className="section-eyebrow text-[var(--site-accent)]">{site.testimonials.eyebrow}</p>
          <h2 className="mt-4 max-w-[760px] text-3xl font-bold leading-tight text-[var(--site-ink)] sm:text-4xl lg:text-5xl">{site.testimonials.title}</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#566267] sm:text-lg">{site.testimonials.description}</p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {site.testimonials.items.map((review) => (
            <article key={review.summary} className="rounded-[16px] border border-[#d8dedc] bg-white p-7">
              <p className="text-lg font-bold leading-8 text-[#29353a]">“{review.summary}”</p>
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
          <p className="section-eyebrow text-[var(--site-accent)]">{site.process.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--site-ink)] sm:text-4xl">{site.process.title}</h2>
          <ol className="mt-8 grid gap-3">
            {site.process.steps.map((step, index) => (
              <li key={step} className="flex items-center gap-4 rounded-[12px] border border-[#d8dedc] bg-white p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[var(--site-ink)] text-sm font-bold text-white">{index + 1}</span>
                <span className="text-lg font-bold text-[#29353a]">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-[16px] bg-[var(--site-ink)] p-6 text-white sm:p-8">
          <p className="section-eyebrow text-white/70">{site.coverage.eyebrow}</p>
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

function ModalFrame({ eyebrow, title, description, closeLabel, onClose, children }: { eyebrow: string; title: string; description: string; closeLabel: string; onClose: () => void; children: ReactNode }) {
  const titleId = `${closeLabel.toLowerCase().replaceAll(" ", "-")}-title`;

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#101326]/78 px-4 py-6 backdrop-blur-sm sm:py-10" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className="fixed inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl rounded-[16px] border border-[#d8dedc] bg-white p-5 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="section-eyebrow text-[var(--site-accent)]">{eyebrow}</p>
            <h3 id={titleId} className="mt-3 text-2xl font-bold leading-tight text-[var(--site-ink)] sm:text-3xl">{title}</h3>
            <p className="mt-3 max-w-2xl leading-7 text-[#667176]">{description}</p>
          </div>
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] border border-[#d8dedc] text-[var(--site-ink)] transition hover:border-[var(--site-ink)] hover:bg-[var(--site-paper)]" type="button" aria-label={closeLabel} onClick={onClose}>
            <MenuIcon open />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Contact({ site }: { site: ProspectSiteConfig }) {
  const [activeModal, setActiveModal] = useState<"contact" | "quote" | null>(null);
  const [contactStatus, setContactStatus] = useState("");
  const [quoteStatus, setQuoteStatus] = useState("");
  const [attachmentLabel, setAttachmentLabel] = useState(site.quoteRequest?.fileEmptyText ?? "No files selected");

  useEffect(() => {
    function syncModal() {
      setActiveModal(window.location.hash === "#contact-me" ? "contact" : window.location.hash === "#quote-request" ? "quote" : null);
    }

    syncModal();
    window.addEventListener("hashchange", syncModal);
    return () => window.removeEventListener("hashchange", syncModal);
  }, []);

  useEffect(() => {
    if (!activeModal) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal();
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeModal]);

  function closeModal() {
    setActiveModal(null);
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}#contact`);
  }

  function onContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContactStatus("Thank you - this demonstration shows how a contact request would be confirmed. No information has been sent.");
  }

  function onQuoteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setQuoteStatus(site.contactSection.formStatus);
  }

  const services = site.quoteServices ?? site.services.map((service) => service.title);
  const quoteRequest = site.quoteRequest ?? {};
  const preferredTimeframes = quoteRequest.preferredTimeframes ?? ["As soon as practical", "Within 1-3 months", "Within 3-6 months", "Planning ahead"];
  const preferredContactMethods = quoteRequest.preferredContactMethods ?? ["Phone", "Email"];
  const beforeQuoteOptions = quoteRequest.beforeQuoteOptions ?? ["Request call before quote", "Request email before quote"];

  return (
    <section id="contact" className="section-pad bg-[var(--site-paper)]">
      <div className="site-shell grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="section-eyebrow text-[var(--site-accent)]">{site.contactSection.eyebrow}</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[var(--site-ink)] sm:text-4xl lg:text-5xl">{site.contactSection.title}</h2>
          <p className="mt-5 text-lg leading-8 text-[#566267]">{site.contactSection.description}</p>
          <div className="mt-8 grid gap-3 sm:max-w-sm">
            <ButtonLink href={site.contact.telephoneHref}>
              <PhoneIcon />
              {site.contact.telephone}
            </ButtonLink>
            <ButtonLink href="#quote-request" variant="line" className="bg-white">
              Request a Quote
              <ArrowIcon />
            </ButtonLink>
            {site.contact.email ? (
              <ButtonLink href={`mailto:${site.contact.email}`} variant="line" className="bg-white">
                {site.callsToAction.email}
              </ButtonLink>
            ) : null}
          </div>
        </div>

        <div className="rounded-[16px] border border-[#d8dedc] bg-white p-6 sm:p-8">
          <p className="section-eyebrow text-[var(--site-accent)]">General enquiry</p>
          <h3 className="mt-3 text-2xl font-bold leading-tight text-[var(--site-ink)]">Send {site.companyName} a message</h3>
          <form className="mt-6 grid gap-5" onSubmit={onContactSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Name<input className="form-field" name="contact-name" required /></label>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Phone<input className="form-field" name="contact-phone" inputMode="tel" required /></label>
            </div>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Email<input className="form-field" name="contact-email" type="email" /></label>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Message<textarea className="form-field min-h-32 resize-y p-4" name="contact-message" required /></label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="button-base rounded-[8px] bg-[var(--site-ink)] text-white hover:bg-[var(--site-accent)]" type="submit">
                Send message
                <ArrowIcon />
              </button>
              <a className="button-base rounded-[8px] border-[#cbd3d2] bg-[var(--site-paper)] text-[var(--site-ink)] hover:border-[var(--site-ink)] hover:bg-white" href="#quote-request">
                Request a quote
              </a>
            </div>
            {contactStatus ? <p className="rounded-[8px] bg-[var(--site-paper)] p-3 text-sm font-bold text-[#4f5a5f]" role="status">{contactStatus}</p> : null}
          </form>
        </div>
      </div>

      {activeModal === "contact" ? (
        <ModalFrame eyebrow="Contact me" title={`Ask ${site.companyName} to get in touch`} description="Leave your contact details and a short message. This concept form is for demonstration only and does not send data." closeLabel="Close contact form" onClose={closeModal}>
          <form className="mt-6 grid gap-5" onSubmit={onContactSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Name<input className="form-field" name="contact-name" autoFocus required /></label>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Telephone<input className="form-field" name="contact-phone" inputMode="tel" required /></label>
            </div>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Email<input className="form-field" name="contact-email" type="email" required /></label>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Preferred contact<select className="form-field bg-white" name="contact-method" required defaultValue=""><option value="" disabled>Select a method</option><option>Phone</option><option>Email</option><option>Either</option></select></label>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">How can Aspire help?<textarea className="form-field min-h-32 resize-y p-4" name="contact-message" required /></label>
            <label className="flex items-start gap-3 text-sm leading-6 text-[#4f5a5f]"><input className="mt-1 h-5 w-5 shrink-0 accent-[var(--site-accent)]" name="contact-consent" type="checkbox" required /><span>I agree that these details may be used to respond to this enquiry. This demonstration does not send or store information.</span></label>
            <button className="button-base rounded-[8px] bg-[var(--site-ink)] text-white hover:bg-[var(--site-accent)]" type="submit">Send Contact Request<ArrowIcon /></button>
            {contactStatus ? <p className="rounded-[8px] bg-[var(--site-paper)] p-4 text-sm font-bold text-[#4f5a5f]" role="status">{contactStatus}</p> : null}
          </form>
        </ModalFrame>
      ) : null}

      {activeModal === "quote" ? (
        <ModalFrame eyebrow={quoteRequest.eyebrow ?? "Quote request"} title={quoteRequest.title ?? "Tell Aspire what the roof needs"} description={quoteRequest.helperText ?? "The more useful detail you can provide now, the better prepared the team can be for the first conversation. This demonstration does not send data."} closeLabel="Close quote form" onClose={closeModal}>
          <form className="mt-6 grid gap-5" onSubmit={onQuoteSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Name<input className="form-field" name="quote-name" autoFocus required /></label>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Telephone<input className="form-field" name="quote-phone" inputMode="tel" required /></label>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Email<input className="form-field" name="quote-email" type="email" required /></label>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Project postcode<input className="form-field" name="quote-postcode" autoComplete="postal-code" required /></label>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Service required<select className="form-field bg-white" name="quote-service" required defaultValue=""><option value="" disabled>Select a service</option>{services.map((service) => <option key={service}>{service}</option>)}</select></label>
              <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Preferred timeframe<select className="form-field bg-white" name="quote-timeframe" required defaultValue=""><option value="" disabled>Select a timeframe</option>{preferredTimeframes.map((timeframe) => <option key={timeframe}>{timeframe}</option>)}</select></label>
            </div>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
              {quoteRequest.fileLabel ?? site.quoteUploadLabel ?? "Project photos"}
              <span className="flex min-h-12 items-center justify-between gap-3 rounded-[8px] border border-[#cbd3d2] bg-white px-3 py-2 text-base font-normal normal-case tracking-normal text-[var(--site-ink)]">
                <span className="rounded-[8px] bg-[var(--site-ink)] px-4 py-2 text-sm font-bold text-white">{quoteRequest.fileButtonText ?? "Choose files"}</span>
                <span className="min-w-0 flex-1 truncate text-[#566267]">{attachmentLabel}</span>
              </span>
              <input
                className="sr-only"
                name="quote-photos"
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={(event) => {
                  const files = event.currentTarget.files;
                  if (!files?.length) {
                    setAttachmentLabel(quoteRequest.fileEmptyText ?? "No files selected");
                    return;
                  }
                  setAttachmentLabel(files.length === 1 ? files[0].name : `${files.length} files selected`);
                }}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Project details<textarea className="form-field min-h-36 resize-y p-4" name="quote-message" placeholder="Tell Aspire about the property, roof type, issue, timescale and anything that may affect access." required /></label>
            <div className="grid gap-5 md:grid-cols-2">
              <fieldset className="grid gap-3 rounded-[12px] border border-[#d8dedc] bg-[#fbfaf7] p-4">
                <legend className="px-1 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Preferred contact method</legend>
                {preferredContactMethods.map((method) => (
                  <label key={method} className="flex items-start gap-3 text-sm font-bold text-[#29353a]">
                    <input className="mt-1 h-4 w-4 accent-[var(--site-accent)]" name="quote-preferred-contact" type="radio" value={method} required />
                    {method}
                  </label>
                ))}
              </fieldset>
              <fieldset className="grid gap-3 rounded-[12px] border border-[#d8dedc] bg-[#fbfaf7] p-4">
                <legend className="px-1 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">Before a quote</legend>
                {beforeQuoteOptions.map((option) => (
                  <label key={option} className="flex items-start gap-3 text-sm font-bold text-[#29353a]">
                    <input className="mt-1 h-4 w-4 accent-[var(--site-accent)]" name="quote-before-quote" type="checkbox" value={option} />
                    {option}
                  </label>
                ))}
              </fieldset>
            </div>
            <label className="flex items-start gap-3 rounded-[12px] border border-[#d8dedc] bg-[#fbfaf7] p-4 text-sm leading-6 text-[#29353a]"><input className="mt-1 h-4 w-4 shrink-0 accent-[var(--site-accent)]" name="quote-consent" type="checkbox" required /><span>I agree that the details entered may be used to respond to this roofing enquiry. This demonstration does not send or store information.</span></label>
            <button className="button-base rounded-[8px] bg-[var(--site-ink)] text-white hover:bg-[var(--site-accent)]" type="submit">Send<ArrowIcon /></button>
            {quoteStatus ? <p className="rounded-[8px] bg-[var(--site-paper)] p-4 text-sm font-bold text-[#4f5a5f]" role="status">{quoteStatus}</p> : null}
          </form>
        </ModalFrame>
      ) : null}
    </section>
  );
}

export function MobileActions({ site }: { site: ProspectSiteConfig }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[color:var(--site-paper)]/96 p-3 backdrop-blur lg:hidden">
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
    <footer className="bg-[var(--site-ink)] pb-24 pt-10 text-white lg:pb-10">
      <div className="site-shell grid gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <Image src={site.brand.wordmark.src} alt={site.brand.wordmark.alt} width={190} height={70} className="rounded-[8px] bg-white p-2" />
          <p className="mt-5 font-bold">{site.companyName}</p>
          <p className="mt-1 text-white/70">{site.footer.location}</p>
          <a className="mt-4 inline-flex font-bold text-white hover:text-white/70" href={site.contact.telephoneHref}>
            {site.contact.telephone}
          </a>
          {site.contact.email ? <a className="mt-2 block text-white/70 hover:text-white" href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : null}
        </div>
        <nav className="grid gap-3 text-sm font-bold uppercase tracking-[0.08em]" aria-label="Footer navigation">
          {site.navigation.map(({ label, href }) => (
            <a key={label} className="hover:text-white/70" href={href}>
              {label}
            </a>
          ))}
          {site.contact.checkatradeUrl ? (
            <a className="hover:text-white/70" href={site.contact.checkatradeUrl}>
              Review profile
            </a>
          ) : null}
          {site.contact.linkedinUrl ? <a className="hover:text-white/70" href={site.contact.linkedinUrl}>{site.footer.socialLabel}</a> : null}
          {site.contact.facebookUrl ? <a className="hover:text-white/70" href={site.contact.facebookUrl}>Facebook</a> : null}
        </nav>
      </div>
    </footer>
  );
}
