import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { PremiumContractorConfig, PremiumService } from "@/types/premium-contractor";
import { MobileContactBar, PremiumHeader } from "./premium-shell";
import styles from "./premium-contractor.module.css";

export const premiumBase = "/contractor-template-premium";

export function premiumMetadata(title: string, description: string, path = premiumBase, image = { src: "/assets/contractor-template-premium/architectural-extension-hero.webp", alt: "Premium contractor website template preview" }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: { index: false, follow: false, noarchive: true, nosnippet: true, googleBot: { index: false, follow: false, noimageindex: true } },
    openGraph: { title, description, type: "website", images: [{ url: image.src, alt: image.alt }] },
  };
}

export function PremiumSiteFrame({ site, children }: { site: PremiumContractorConfig; children: ReactNode }) {
  const brand = { "--premium-ink": site.branding.primaryColour, "--premium-accent": site.branding.accentColour, "--premium-accent-light": site.branding.accentLightColour, "--premium-hero-accent": site.branding.heroAccentColour, "--premium-paper": site.branding.backgroundColour, "--premium-text": site.branding.textColour, "--premium-muted": site.branding.mutedColour } as CSSProperties;
  return <div className={styles.site} style={brand}><PremiumHeader site={site} />{children}<PremiumFooter site={site} /><MobileContactBar site={site} /></div>;
}

export function HomePage({ site }: { site: PremiumContractorConfig }) {
  return <main>
    <section className={styles.hero}>
      <Image src={site.hero.image.src} alt={site.hero.image.alt} fill priority sizes="100vw" className={styles.heroImage} />
      <div className={styles.heroShade} />
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>{site.hero.eyebrow}</p>
        <h1>{site.hero.heading}</h1>
        <p className={styles.heroCopy}>{site.hero.supportingText}</p>
        <div className={styles.buttonRow}><Link className={styles.accentButton} href={`${site.basePath}/quote-request`}>{site.hero.primaryCta}<span aria-hidden="true">↗</span></Link><Link className={styles.ghostButton} href="#projects">{site.hero.secondaryCta}<span aria-hidden="true">↓</span></Link></div>
        <p className={styles.heroNote}><span aria-hidden="true" />{site.hero.credibilityNote}</p>
      </div>
    </section>
    {site.visibility.trustStrip && site.trustItems.length > 0 && <TrustStrip site={site} />}
    <Intro site={site} />
    <ServicesPreview site={site} />
    {site.visibility.projects && site.projects.length > 0 && <Projects site={site} />}
    <Reasons site={site} />
    <Process site={site} />
    {site.visibility.reviews && site.reviews.length > 0 && <Reviews site={site} />}
    {site.visibility.serviceAreas && site.serviceAreas.length > 0 && <ServiceAreas site={site} />}
    <QuoteCallout site={site} />
  </main>;
}

function TrustStrip({ site }: { site: PremiumContractorConfig }) {
  return <section className={styles.trustStrip} aria-label="How we work"><div className={styles.container}>{site.trustItems.map((item, index) => <div key={item.title} className={styles.trustItem}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.title}</strong><p>{item.supportingText}</p></div></div>)}</div></section>;
}

function Intro({ site }: { site: PremiumContractorConfig }) {
  return <section className={styles.section}><div className={`${styles.container} ${styles.introGrid}`}><div className={styles.introImage}><Image src={site.introduction.image.src} alt={site.introduction.image.alt} fill sizes="(max-width: 760px) 100vw, 42vw" /></div><div className={styles.introCopy}><p className={styles.eyebrow}>{site.introduction.eyebrow}</p><h2>{site.introduction.heading}</h2>{site.introduction.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<Link className={styles.textLink} href={`${site.basePath}/services`}>Explore our services <span aria-hidden="true">↗</span></Link></div></div></section>;
}

function SectionHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy?: string; action?: ReactNode }) {
  return <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{eyebrow}</p><h2>{title}</h2></div>{copy && <p>{copy}</p>}{action}</div>;
}

function ServicesPreview({ site }: { site: PremiumContractorConfig }) {
  const content = site.presentation.servicesPreview;
  return <section className={`${styles.section} ${styles.darkSection}`}><div className={styles.container}><SectionHeading eyebrow={content.eyebrow} title={content.heading} copy={content.description} action={<Link href={`${site.basePath}/services`} className={styles.lightTextLink}>View all services <span aria-hidden="true">↗</span></Link>} /><div className={styles.servicePreviewGrid}>{site.services.map((service, index) => <Link key={service.id} href={`${site.basePath}/services#${service.id}`} className={styles.servicePreview}><div className={styles.servicePreviewImage}>{service.image && <Image src={service.image.src} alt={service.image.alt} fill sizes="(max-width: 760px) 100vw, 25vw" />}</div><div className={styles.servicePreviewCopy}><span>{String(index + 1).padStart(2, "0")}</span><h3>{service.name}</h3><p>{service.shortDescription}</p><strong>Explore service <span aria-hidden="true">↗</span></strong></div></Link>)}</div></div></section>;
}

function Projects({ site }: { site: PremiumContractorConfig }) {
  const [featured, ...rest] = [...site.projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  const content = site.presentation.projects;
  return <section id="projects" className={styles.section}><div className={styles.container}><SectionHeading eyebrow={content.eyebrow} title={content.heading} copy={content.description} /><div className={styles.projectsGrid}><ProjectCard project={featured} featured />{rest.map((project) => <ProjectCard key={project.title} project={project} />)}</div></div></section>;
}

function ProjectCard({ project, featured = false }: { project: PremiumContractorConfig["projects"][number]; featured?: boolean }) {
  return <article className={`${styles.projectCard} ${featured ? styles.projectFeatured : ""}`}><div className={styles.projectImage}><Image src={project.image.src} alt={project.image.alt} fill sizes={featured ? "(max-width: 760px) 100vw, 62vw" : "(max-width: 760px) 100vw, 31vw"} /></div><div className={styles.projectMeta}><div><p>{project.category}{project.location ? ` · ${project.location}` : ""}</p><h3>{project.title}</h3></div>{project.description && <p>{project.description}</p>}</div></article>;
}

function Reasons({ site }: { site: PremiumContractorConfig }) {
  const content = site.presentation.reasons;
  return <section className={`${styles.section} ${styles.reasonSection}`}><div className={`${styles.container} ${styles.reasonGrid}`}><div><p className={styles.eyebrow}>{content.eyebrow}</p><h2>{content.heading}</h2><p>{content.description}</p></div><div className={styles.reasonList}>{site.reasons.map((reason, index) => <article key={reason.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{reason.title}</h3><p>{reason.description}</p></div></article>)}</div></div></section>;
}

function Process({ site }: { site: PremiumContractorConfig }) {
  return <section id="process" className={`${styles.section} ${styles.processSection}`}><div className={styles.container}><SectionHeading eyebrow={site.presentation.process.eyebrow} title={site.presentation.process.heading} /><div className={styles.processGrid}>{site.process.map((step) => <article key={step.step}><span>{step.step}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div></div></section>;
}

function Reviews({ site }: { site: PremiumContractorConfig }) {
  const content = site.presentation.reviews;
  return <section className={styles.section}><div className={`${styles.container} ${styles.reviewGrid}`}><div><p className={styles.eyebrow}>{content.eyebrow}</p><h2>{content.heading}</h2><p>{content.description}</p></div><div>{site.reviews.map((review) => <blockquote key={review.quote}><p>“{review.quote}”</p><footer><strong>{review.customerName}</strong><span>{[review.projectType, review.customerLocation].filter(Boolean).join(" · ")}</span></footer></blockquote>)}</div></div></section>;
}

function ServiceAreas({ site }: { site: PremiumContractorConfig }) {
  const content = site.presentation.serviceAreas;
  return <section className={styles.areaSection}><div className={`${styles.container} ${styles.areaGrid}`}><div><p className={styles.eyebrow}>{content.eyebrow}</p><h2>{content.heading}</h2><p>{content.description}</p></div><ul>{site.serviceAreas.map((area) => <li key={area}>{area}<span aria-hidden="true">↗</span></li>)}</ul></div></section>;
}

export function QuoteCallout({ site }: { site: PremiumContractorConfig }) {
  return <section className={styles.callout}><div className={styles.container}><p className={styles.eyebrow}>{site.callout.eyebrow}</p><div className={styles.calloutGrid}><div><h2>{site.callout.heading}</h2><p>{site.callout.description}</p></div><div><Link className={styles.accentButton} href={`${site.basePath}/quote-request`}>Request a quote <span aria-hidden="true">↗</span></Link><a className={styles.calloutPhone} href={site.contact.phoneHref}>Or call {site.contact.phone}</a><small>{site.callout.note}</small></div></div></div></section>;
}

export function ServicesPage({ site }: { site: PremiumContractorConfig }) {
  return <main>
    <PageHero eyebrow={site.presentation.servicesHero.eyebrow} title={site.presentation.servicesHero.heading} copy={site.presentation.servicesHero.description} image={site.projects[2].image} site={site} />
    <nav className={styles.serviceIndex} aria-label="Service index"><div className={styles.container}><span>Jump to a service</span>{site.services.map((service, index) => <a key={service.id} href={`#${service.id}`}>{String(index + 1).padStart(2, "0")} {service.name}</a>)}</div></nav>
    <section className={styles.servicesDetail}>{site.services.map((service, index) => <ServiceDetail key={service.id} service={service} index={index} basePath={site.basePath} />)}</section>
    {site.visibility.commercialResidentialSplit && <ResidentialCommercial site={site} />}
    <ServicesProcess site={site} />
    {site.visibility.projects && <RelatedProjects site={site} />}
    <Faqs title="Practical questions before you enquire" items={site.faqs} />
    <QuoteCallout site={site} />
  </main>;
}

function PageHero({ eyebrow, title, copy, image, site }: { eyebrow: string; title: string; copy: string; image: { src: string; alt: string }; site: PremiumContractorConfig }) {
  return <section className={styles.pageHero}><div className={`${styles.container} ${styles.pageHeroGrid}`}><div><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p>{copy}</p><Link className={styles.accentButton} href={`${site.basePath}/quote-request`}>Request a quote <span aria-hidden="true">↗</span></Link><a href={site.contact.phoneHref} className={styles.pageHeroPhone}>Prefer to talk? {site.contact.phone}</a></div><div className={styles.pageHeroImage}><Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 760px) 100vw, 50vw" /></div></div></section>;
}

function ServiceDetail({ service, index, basePath }: { service: PremiumService; index: number; basePath: string }) {
  return <article id={service.id} className={`${styles.serviceDetail} ${index % 2 ? styles.serviceDetailReverse : ""}`}><div className={styles.container}><div className={styles.serviceDetailImage}>{service.image && <Image src={service.image.src} alt={service.image.alt} fill sizes="(max-width: 760px) 100vw, 48vw" />}</div><div className={styles.serviceDetailCopy}><p className={styles.eyebrow}>{String(index + 1).padStart(2, "0")} / Service</p><h2>{service.name}</h2><p className={styles.serviceLead}>{service.fullDescription}</p><div className={styles.serviceColumns}><List title="Common projects" items={service.projectTypes} /><List title="What may be included" items={service.inclusions} /></div><div className={styles.benefitList}><strong>Why this approach helps</strong>{service.benefits.map((item) => <span key={item}>— {item}</span>)}</div>{service.projectExample && <p className={styles.projectExample}><strong>Example scope:</strong> {service.projectExample}</p>}<Link className={styles.textLink} href={`${basePath}/quote-request`}>Discuss this service <span aria-hidden="true">↗</span></Link></div></div></article>;
}

function List({ title, items }: { title: string; items: string[] }) { return <div><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></div>; }

function ResidentialCommercial({ site }: { site: PremiumContractorConfig }) {
  return <section className={`${styles.section} ${styles.darkSection}`}><div className={styles.container}><SectionHeading eyebrow={site.presentation.capability.eyebrow} title={site.presentation.capability.heading} /><div className={styles.splitGrid}>{Object.values(site.residentialCommercial).map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.description}</p><ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul></article>)}</div></div></section>;
}

function ServicesProcess({ site }: { site: PremiumContractorConfig }) {
  const content = site.presentation.servicesProcess;
  return <section className={styles.section}><div className={`${styles.container} ${styles.servicesProcess}`}><div><p className={styles.eyebrow}>{content.eyebrow}</p><h2>{content.heading}</h2><p>{content.description}</p><Link className={styles.textLink} href={`${site.basePath}/quote-request`}>Start an enquiry <span aria-hidden="true">↗</span></Link></div><ol>{site.process.slice(0, 3).map((step) => <li key={step.step}><span>{step.step}</span><div><strong>{step.title}</strong><p>{step.description}</p></div></li>)}</ol></div></section>;
}

function RelatedProjects({ site }: { site: PremiumContractorConfig }) {
  return <section className={styles.relatedProjects}><div className={styles.container}><SectionHeading eyebrow={site.presentation.relatedProjects.eyebrow} title={site.presentation.relatedProjects.heading} /><div>{site.projects.slice(1, 4).map((project) => <ProjectCard key={project.title} project={project} />)}</div></div></section>;
}

export function Faqs({ title, items }: { title: string; items: Array<{ question: string; answer: string }> }) {
  return <section className={styles.faqSection}><div className={`${styles.container} ${styles.faqGrid}`}><div><p className={styles.eyebrow}>Frequently asked</p><h2>{title}</h2></div><div>{items.map((item) => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></div></section>;
}

export function QuotePageIntro({ site }: { site: PremiumContractorConfig }) {
  return <section className={styles.quoteIntro}><div className={styles.container}><p className={styles.eyebrow}>{site.quote.eyebrow}</p><h1>{site.quote.heading}</h1><div className={styles.quoteIntroGrid}><p>{site.quote.introduction}</p><div><strong>What usually happens next</strong><p>{site.quote.nextStep}</p></div></div></div></section>;
}

export function QuoteSupport({ site }: { site: PremiumContractorConfig }) {
  return <aside className={styles.quoteSupport}><div><p className={styles.eyebrow}>Before you begin</p><h2>Useful information to prepare</h2><ul><li>A short description of the work</li><li>The project postcode or location</li><li>Any drawings, specifications or target dates</li><li>Clear photos of the wider area and details</li></ul><p>{site.quote.photoNote}</p></div><div className={styles.contactPanel}><p className={styles.eyebrow}>Prefer to talk?</p><a href={site.contact.phoneHref}>{site.contact.phone}</a><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a><span>{site.contact.openingHours}</span><span>{site.contact.address}</span></div></aside>;
}

function PremiumFooter({ site }: { site: PremiumContractorConfig }) {
  return <footer className={styles.footer}><div className={`${styles.container} ${styles.footerGrid}`}><div><Image src={site.company.logoLight.src} alt={site.company.logoLight.alt} width={292} height={56} /><p>{site.company.tagline}</p><small>{site.company.description}</small></div><div><strong>Explore</strong><Link href={site.basePath}>Home</Link><Link href={`${site.basePath}/services`}>Services</Link><Link href={`${site.basePath}#projects`}>Projects</Link><Link href={`${site.basePath}/quote-request`}>Request a quote</Link></div><div><strong>Contact</strong><a href={site.contact.phoneHref}>{site.contact.phone}</a><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a><span>{site.contact.address}</span><span>{site.contact.openingHours}</span></div><div><strong>Service area</strong><p>{site.serviceAreas.slice(0, 4).join(" · ")}</p>{site.presentation.footerLegalItems.map((item) => <span key={item}>{item}</span>)}</div></div><div className={`${styles.container} ${styles.footerBottom}`}><span>© {new Date().getFullYear()} {site.company.legalName}</span><span>{site.presentation.footerNote}</span></div></footer>;
}
