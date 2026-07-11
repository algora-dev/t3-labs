"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { falcon } from "./content/falcon";

const navItems = [
  ["Services", "#services"],
  ["Projects", "#projects"],
  ["About", "#about"],
  ["Areas Covered", "#areas"],
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

function ButtonLink({
  href,
  children,
  variant = "dark",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light" | "line" | "heroLine";
}) {
  const style =
    variant === "dark"
      ? "bg-[#1d2529] text-white hover:bg-[#b65d3b]"
      : variant === "light"
        ? "bg-white text-[#1d2529] hover:bg-[#f1e7dc]"
        : variant === "heroLine"
          ? "border-white/45 text-white hover:border-white hover:bg-white hover:text-[#1d2529]"
          : "border-[#9aa5a7] text-[#1d2529] hover:border-[#1d2529] hover:bg-white";

  return (
    <a className={`button-base ${style}`} href={href}>
      {children}
    </a>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const phoneHref = falcon.telephone ? `tel:${falcon.telephone.replace(/\s+/g, "")}` : "#contact";

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f6f4ef]/95 backdrop-blur">
      <div className="site-shell flex min-h-20 items-center justify-between gap-5">
        <a className="flex items-center gap-3" href="#top" aria-label="Falcon Contracting home">
          <span className="relative block h-12 w-44 overflow-hidden bg-white sm:w-48">
            <Image src="/assets/falcon/falcon-wordmark.png" alt="Falcon logo" fill sizes="192px" className="object-contain p-1.5" priority />
          </span>
        </a>
        <nav className="hidden items-center gap-6 text-sm font-bold uppercase tracking-[0.08em] text-[#394348] lg:flex" aria-label="Main navigation">
          {navItems.map(([label, href]) => (
            <a key={label} className="hover:text-[#b65d3b]" href={href}>
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href={phoneHref} variant="line">
            <PhoneIcon />
            {falcon.telephone || "Call Falcon"}
          </ButtonLink>
          <ButtonLink href="#contact">
            {falcon.ctas.quote}
            <ArrowIcon />
          </ButtonLink>
        </div>
        <button
          className="button-base border-[#9aa5a7] text-[#1d2529] lg:!hidden"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span aria-hidden="true">{open ? "Close" : "Menu"}</span>
        </button>
      </div>
      {open ? (
        <div id="mobile-menu" className="border-t border-black/10 bg-[#f6f4ef] lg:hidden">
          <nav className="site-shell grid gap-2 py-5 text-sm font-bold uppercase tracking-[0.08em]" aria-label="Mobile navigation">
            {navItems.map(([label, href]) => (
              <a key={label} className="border-b border-black/10 py-3" href={href} onClick={() => setOpen(false)}>
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
    <section id="top" className="relative isolate min-h-[calc(100vh-80px)] overflow-hidden bg-[#1d2529] text-white">
      <Image
        src="/assets/falcon/standing-seam-pyramid-roof.png"
        alt="Falcon Contracting standing seam roof project"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="image-shade absolute inset-0" />
      <div className="site-shell relative z-10 flex min-h-[calc(100vh-80px)] items-center py-20">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex border border-white/35 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/90">
            Long Green roofing and construction
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-7xl">
            New roofs and construction across Essex and surrounding areas.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl">
            Falcon Contracting Ltd delivers new roofs, roofing, refurbishment and construction work for residential and commercial projects from its Long Green base.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#contact" variant="light">
              {falcon.ctas.quote}
              <ArrowIcon />
            </ButtonLink>
            <ButtonLink href={falcon.telephone ? `tel:${falcon.telephone.replace(/\s+/g, "")}` : "#contact"} variant="heroLine">
              <PhoneIcon />
              {falcon.ctas.call}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Intro() {
  return (
    <section id="about" className="roof-lines border-b border-[#d8dedc] bg-white py-18 sm:py-24">
      <div className="site-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#b65d3b]">Established capability</p>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
            A practical construction partner with roofing at the centre.
          </h2>
        </div>
        <div className="max-w-2xl text-base leading-8 text-[#4f5a5f] sm:text-lg">
          <p>
            Public company information presents Falcon Contracting Ltd as an Essex construction business with 18 years&apos; experience, working across London,
            the East of England and the Home Counties. Additional business wording places Falcon in Long Green with a focus on new roofs.
          </p>
          <p className="mt-5">
            The page keeps the message focused on verified service themes: new roofs, roofing, refurbishment, residential and commercial construction,
            loft conversions, extensions and new build work.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section id="services" className="bg-[#f6f4ef] py-18 sm:py-24">
      <div className="site-shell">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#b65d3b]">Services</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">New roofs, roofing and construction work presented clearly.</h2>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden border border-[#d8dedc] bg-[#d8dedc] md:grid-cols-2 lg:grid-cols-4">
          {falcon.services.map((service) => (
            <article key={service.title} className="group bg-white">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={service.image} alt={`${service.title} by Falcon Contracting`} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition duration-300 group-hover:scale-[1.03]" />
              </div>
              <div className="min-h-52 p-6">
                <h3 className="text-xl font-bold">{service.title}</h3>
                <p className="mt-4 leading-7 text-[#5e696f]">{service.summary}</p>
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
    <section id="projects" className="bg-[#1d2529] py-18 text-white sm:py-24">
      <div className="site-shell">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#e5b990]">Project work</p>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">Real Falcon work, shown without stock imagery.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-white/75">
            The gallery uses neutral labels because exact project locations, dates and values have not been verified.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {falcon.projectImages.map((project, index) => (
            <figure key={project.src} className={`${index === 0 ? "md:col-span-2 md:row-span-2" : ""} group relative min-h-72 overflow-hidden bg-black`}>
              <Image src={project.src} alt={project.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover opacity-90 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 text-sm font-bold uppercase tracking-[0.08em]">
                {project.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChoose() {
  return (
    <section className="bg-white py-18 sm:py-24">
      <div className="site-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#b65d3b]">Why Falcon</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">Credible reasons to start a conversation.</h2>
        </div>
        <div className="grid gap-px border border-[#d8dedc] bg-[#d8dedc]">
          {falcon.whyChoose.map((item, index) => (
            <div key={item} className="grid gap-4 bg-white p-6 sm:grid-cols-[64px_1fr]">
              <span className="text-3xl font-bold text-[#9b8f77]">{String(index + 1).padStart(2, "0")}</span>
              <p className="text-lg leading-8 text-[#4f5a5f]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Feedback() {
  return (
    <section className="bg-[#ebe7df] py-18 sm:py-24">
      <div className="site-shell">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#b65d3b]">Customer feedback</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">What customers say</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {/* Falcon must approve testimonial use before public launch. These are concise summaries based on public Checkatrade feedback themes. */}
          {falcon.reviews.map((review) => (
            <figure key={review.quote} className="border border-[#d8dedc] bg-white p-7">
              <blockquote className="text-xl font-bold leading-8">&ldquo;{review.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 text-sm font-bold uppercase tracking-[0.08em] text-[#5e696f]">
                Customer feedback published on Checkatrade
                <span className="mt-1 block font-normal normal-case tracking-normal">{review.date}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProcessAndAreas() {
  return (
    <section id="areas" className="bg-white py-18 sm:py-24">
      <div className="site-shell grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#b65d3b]">Process</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">A straightforward route from enquiry to completion.</h2>
          <ol className="mt-8 grid gap-px border border-[#d8dedc] bg-[#d8dedc]">
            {falcon.process.map((step, index) => (
              <li key={step} className="flex items-center gap-5 bg-white p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#1d2529] text-sm font-bold text-white">{index + 1}</span>
                <span className="text-lg font-bold">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-[#1d2529] p-8 text-white sm:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#e5b990]">Areas covered</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">Based in Long Green. Working across the verified region.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {falcon.coverage.map((area) => (
              <span key={area} className="border border-white/25 px-4 py-3 text-sm font-bold uppercase tracking-[0.08em]">
                {area}
              </span>
            ))}
          </div>
          <p className="mt-8 leading-8 text-white/75">
            Additional town-by-town coverage should be confirmed with Falcon before adding more specific location content.
          </p>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [status, setStatus] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Form delivery must be connected before launch.");
  }

  return (
    <section id="contact" className="bg-[#f6f4ef] py-18 sm:py-24">
      <div className="site-shell grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#b65d3b]">Contact</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">Discuss a roofing or construction project.</h2>
          <p className="mt-6 text-lg leading-8 text-[#5e696f]">
            Share a few details below, then connect a real form service before launch.
          </p>
          <div className="mt-8 grid gap-3">
            <ButtonLink href={falcon.telephone ? `tel:${falcon.telephone.replace(/\s+/g, "")}` : "#contact"} variant="dark">
              <PhoneIcon />
              {falcon.telephone || "Telephone to be confirmed"}
            </ButtonLink>
          </div>
        </div>
        <form className="grid gap-5 border border-[#d8dedc] bg-white p-6 sm:p-8" onSubmit={onSubmit}>
          {/* Form delivery must be connected to a real service before launch. */}
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em]">
              Name
              <input className="min-h-12 border border-[#cbd3d2] px-4 text-base font-normal normal-case tracking-normal" name="name" required />
            </label>
            <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em]">
              Telephone
              <input className="min-h-12 border border-[#cbd3d2] px-4 text-base font-normal normal-case tracking-normal" name="phone" inputMode="tel" required />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em]">
            Email
            <input className="min-h-12 border border-[#cbd3d2] px-4 text-base font-normal normal-case tracking-normal" name="email" type="email" />
          </label>
          <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em]">
            Project type
            <select className="min-h-12 border border-[#cbd3d2] bg-white px-4 text-base font-normal normal-case tracking-normal" name="project" required defaultValue="">
              <option value="" disabled>
                Select a service
              </option>
              {falcon.services.map((service) => (
                <option key={service.title}>{service.title}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold uppercase tracking-[0.08em]">
            Project details
            <textarea className="min-h-36 resize-y border border-[#cbd3d2] p-4 text-base font-normal normal-case tracking-normal" name="message" required />
          </label>
          <button className="button-base bg-[#1d2529] text-white hover:bg-[#b65d3b]" type="submit">
            Send Enquiry
            <ArrowIcon />
          </button>
          {status ? <p className="text-sm font-bold text-[#4f5a5f]" role="status">{status}</p> : null}
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#1d2529] py-10 text-white">
      <div className="site-shell grid gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <Image src="/assets/falcon/falcon-wordmark.png" alt="Falcon logo" width={190} height={70} className="bg-white p-2" />
          <p className="mt-5 font-bold">{falcon.companyName}</p>
          <p className="mt-1 text-white/70">{falcon.location}</p>
          <p className="mt-4 text-sm text-white/60">Email details can be added once confirmed.</p>
        </div>
        <nav className="grid gap-3 text-sm font-bold uppercase tracking-[0.08em]" aria-label="Footer navigation">
          {navItems.map(([label, href]) => (
            <a key={label} className="hover:text-[#e5b990]" href={href}>
              {label}
            </a>
          ))}
          <a className="hover:text-[#e5b990]" href={falcon.linkedinUrl}>
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
