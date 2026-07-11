"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { falcon } from "./content/falcon";

const navItems = [
  ["Services", "#services"],
  ["Projects", "#projects"],
  ["Contact", "#contact"],
] as const;

const mobileNavItems = [
  ["Services", "#services"],
  ["Projects", "#projects"],
  ["About", "#about"],
  ["Areas", "#areas"],
  ["Contact", "#contact"],
] as const;

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

export function Header() {
  const [open, setOpen] = useState(false);
  const phoneHref = `tel:${falcon.telephone.replace(/\s+/g, "")}`;

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f5ef]/96 backdrop-blur">
      <div className="site-shell flex min-h-20 items-center justify-between gap-5">
        <a className="flex items-center gap-3" href="#top" aria-label="Falcon Contracting home">
          <span className="relative block h-12 w-44 overflow-hidden rounded-[8px] bg-white sm:w-48">
            <Image src="/assets/falcon/falcon-wordmark.png" alt="Falcon logo" fill sizes="192px" className="object-contain p-1.5" priority />
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-bold uppercase tracking-[0.08em] text-[#394348] lg:flex" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
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
          <ButtonLink href="#contact">
            {falcon.ctas.quote}
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
            {mobileNavItems.map(([label, href]) => (
              <a key={label} className="rounded-[8px] border border-black/10 bg-white px-4 py-3" href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <div className="grid gap-3 pt-3 sm:grid-cols-2">
              <ButtonLink href={phoneHref} variant="line">
                <PhoneIcon />
                {falcon.ctas.call}
              </ButtonLink>
              <ButtonLink href="#contact">
                {falcon.ctas.quote}
                <ArrowIcon />
              </ButtonLink>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function Hero() {
  return (
    <section id="top" className="bg-[#182226] py-4 text-white sm:py-5">
      <div className="site-shell">
        <div className="relative isolate min-h-[620px] overflow-hidden rounded-[16px] bg-[#1d2529] sm:min-h-[680px]">
          <Image
            src="/assets/falcon/new-tiled-roof-brickwork.png"
            alt="Completed tiled roof and brickwork by Falcon Contracting"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="image-shade absolute inset-0" />
          <div className="relative z-10 flex min-h-[620px] items-end p-5 sm:min-h-[680px] sm:p-10 lg:p-14">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-[8px] border border-white/35 bg-black/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/90">
                Roofing and construction across Essex
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
                New roofs and building work handled with care.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl">
                Falcon Contracting Ltd works on roofing, refurbishment and construction projects across Essex and surrounding areas.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#contact" variant="light">
                  {falcon.ctas.quote}
                  <ArrowIcon />
                </ButtonLink>
                <ButtonLink href={`tel:${falcon.telephone.replace(/\s+/g, "")}`} variant="heroLine">
                  <PhoneIcon />
                  {falcon.ctas.call}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Intro() {
  return (
    <section id="about" className="section-pad bg-white">
      <div className="site-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <p className="section-eyebrow text-[#a95537]">About Falcon Contracting</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1d2529] sm:text-4xl lg:text-5xl">
            Practical roofing and construction support from first conversation to finished work.
          </h2>
        </div>
        <div className="grid gap-5 text-lg leading-8 text-[#566267]">
          <p>
            Based in the Essex area, Falcon Contracting Ltd undertakes new roofs, roof repairs, flat roofing, refurbishment, extensions and wider construction work.
          </p>
          <p>
            Recent project photography helps customers quickly understand the type of work Falcon handles and how to start a conversation.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="section-pad bg-[#f7f5ef]">
      <div className="site-shell">
        <SectionIntro eyebrow="Services" title="Roofing and construction services, clearly laid out.">
          <p>From new roofs and repairs through to larger construction work, each service is presented in plain language with a direct route to enquire.</p>
        </SectionIntro>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {falcon.services.map((service) => (
            <article key={service.title} className="group overflow-hidden rounded-[12px] border border-[#d8dedc] bg-white transition hover:-translate-y-0.5">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={service.image}
                  alt={`${service.title} by Falcon Contracting`}
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

export function Projects() {
  return (
    <section id="projects" className="section-pad bg-[#1d2529] text-white">
      <div className="site-shell">
        <SectionIntro eyebrow="Recent work" title="Recent roofing and construction work" light>
          <p>Large, genuine project images give customers a quick sense of finish, scale and site experience before they make contact.</p>
        </SectionIntro>
        <div className="mt-10 grid gap-4 md:grid-cols-6">
          {falcon.projectImages.map((project, index) => {
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

export function WhyChoose() {
  return (
    <section className="section-pad bg-white">
      <div className="site-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="section-eyebrow text-[#a95537]">Why choose Falcon Contracting?</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1d2529] sm:text-4xl lg:text-5xl">
            A calm, capable choice for roof and building projects.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {falcon.whyChoose.map((item, index) => (
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

export function Feedback() {
  return (
    <section className="section-pad bg-[#eee9df]">
      <div className="site-shell">
        <SectionIntro eyebrow="Customer feedback" title="What customers say">
          <p>Simple customer feedback summaries from Falcon&apos;s Checkatrade profile, presented without badges or rating claims.</p>
        </SectionIntro>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {falcon.reviews.map((review) => (
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

export function ProcessAndAreas() {
  return (
    <section id="areas" className="section-pad bg-white">
      <div className="site-shell grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[16px] border border-[#d8dedc] bg-[#fbfaf7] p-6 sm:p-8">
          <p className="section-eyebrow text-[#a95537]">Process</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1d2529] sm:text-4xl">A straightforward route from enquiry to completed work.</h2>
          <ol className="mt-8 grid gap-3">
            {falcon.process.map((step, index) => (
              <li key={step} className="flex items-center gap-4 rounded-[12px] border border-[#d8dedc] bg-white p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] bg-[#223036] text-sm font-bold text-white">{index + 1}</span>
                <span className="text-lg font-bold text-[#29353a]">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-[16px] bg-[#223036] p-6 text-white sm:p-8">
          <p className="section-eyebrow text-[#f1c59f]">Areas covered</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Based around Long Green and working across Essex and surrounding areas.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {falcon.coverage.map((area) => (
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

export function Contact() {
  const [status, setStatus] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(`Thanks. Please call ${falcon.telephone} to continue your enquiry.`);
  }

  return (
    <section id="contact" className="section-pad bg-[#f7f5ef]">
      <div className="site-shell grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="section-eyebrow text-[#a95537]">Contact</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1d2529] sm:text-4xl lg:text-5xl">Tell us about your upcoming project.</h2>
          <p className="mt-5 text-lg leading-8 text-[#566267]">
            Share the basics of the job, or call Falcon directly to discuss new roofs, repairs, refurbishment or construction work.
          </p>
          <div className="mt-8 grid gap-3 sm:max-w-sm">
            <ButtonLink href={`tel:${falcon.telephone.replace(/\s+/g, "")}`} variant="dark">
              <PhoneIcon />
              {falcon.telephone}
            </ButtonLink>
          </div>
        </div>
        <form className="grid gap-5 rounded-[16px] border border-[#d8dedc] bg-white p-6 sm:p-8" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
              Name
              <input className="form-field" name="name" required />
            </label>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
              Telephone
              <input className="form-field" name="phone" inputMode="tel" required />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
            Email
            <input className="form-field" name="email" type="email" />
          </label>
          <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
            Project type
            <select className="form-field bg-white" name="project" required defaultValue="">
              <option value="" disabled>
                Select a service
              </option>
              {falcon.services.map((service) => (
                <option key={service.title}>{service.title}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em] text-[#29353a]">
            Project details
            <textarea className="form-field min-h-36 resize-y p-4" name="message" required />
          </label>
          <button className="button-base rounded-[8px] bg-[#223036] text-white hover:bg-[#a95537]" type="submit">
            Send Enquiry
            <ArrowIcon />
          </button>
          {status ? <p className="rounded-[8px] bg-[#f7f5ef] p-3 text-sm font-bold text-[#4f5a5f]" role="status">{status}</p> : null}
        </form>
      </div>
    </section>
  );
}

export function MobileActions() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-[#f7f5ef]/96 p-3 backdrop-blur lg:hidden">
      <div className="grid grid-cols-2 gap-3">
        <ButtonLink href={`tel:${falcon.telephone.replace(/\s+/g, "")}`} variant="line" className="px-3 text-xs">
          <PhoneIcon />
          Call
        </ButtonLink>
        <ButtonLink href="#contact" className="px-3 text-xs">
          Quote
          <ArrowIcon />
        </ButtonLink>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#1d2529] pb-24 pt-10 text-white lg:pb-10">
      <div className="site-shell grid gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <Image src="/assets/falcon/falcon-wordmark.png" alt="Falcon logo" width={190} height={70} className="rounded-[8px] bg-white p-2" />
          <p className="mt-5 font-bold">{falcon.companyName}</p>
          <p className="mt-1 text-white/70">{falcon.location}</p>
          <a className="mt-4 inline-flex font-bold text-white hover:text-[#f1c59f]" href={`tel:${falcon.telephone.replace(/\s+/g, "")}`}>
            {falcon.telephone}
          </a>
        </div>
        <nav className="grid gap-3 text-sm font-bold uppercase tracking-[0.08em]" aria-label="Footer navigation">
          {navItems.map(([label, href]) => (
            <a key={label} className="hover:text-[#f1c59f]" href={href}>
              {label}
            </a>
          ))}
          <a className="hover:text-[#f1c59f]" href={falcon.linkedinUrl}>
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
