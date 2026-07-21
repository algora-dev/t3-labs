"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { PremiumContractorConfig } from "@/types/premium-contractor";
import styles from "./premium-contractor.module.css";

export function PremiumHeader({ site }: { site: PremiumContractorConfig }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const base = site.basePath;

  const links = [
    { label: "Home", href: base, active: pathname === base },
    ...(site.navigation.showServices ? [{ label: "Services", href: `${base}/services`, active: pathname === `${base}/services` }] : []),
    ...(site.navigation.showProjects ? [{ label: "Projects", href: `${base}#projects`, active: false }] : []),
    ...(site.navigation.showProcess ? [{ label: "Our process", href: `${base}#process`, active: false }] : []),
  ];

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href={base} className={styles.logoLink} aria-label={`${site.company.name} home`}>
          <Image src={site.company.logoLight.src} alt={site.company.logoLight.alt} width={292} height={56} priority />
        </Link>
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {links.map((link) => <Link key={link.label} href={link.href} aria-current={link.active ? "page" : undefined}>{link.label}</Link>)}
        </nav>
        <div className={styles.headerActions}>
          <a href={site.contact.phoneHref} className={styles.phoneAction} aria-label={`Call ${site.company.shortName} on ${site.contact.phone}`}>{site.contact.phone}</a>
          {site.navigation.showQuote && <Link href={`${base}/quote-request`} className={styles.headerQuote}>Request a quote</Link>}
        </div>
        <button className={styles.menuButton} type="button" aria-expanded={open} aria-controls="premium-mobile-menu" onClick={() => setOpen((value) => !value)}>
          <span className={styles.menuIcon} aria-hidden="true"><span /><span /></span>
          <span>{open ? "Close" : "Menu"}</span>
        </button>
      </div>
      <div id="premium-mobile-menu" className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`} hidden={!open}>
        <nav aria-label="Mobile navigation">
          {links.map((link) => <Link key={link.label} href={link.href} aria-current={link.active ? "page" : undefined} onClick={() => setOpen(false)}>{link.label}<span aria-hidden="true">↗</span></Link>)}
          <a href={site.contact.phoneHref}>Call {site.contact.phone}<span aria-hidden="true">↗</span></a>
          {site.navigation.showQuote && <Link href={`${base}/quote-request`} onClick={() => setOpen(false)}>Request a quote<span aria-hidden="true">↗</span></Link>}
        </nav>
      </div>
    </header>
  );
}

export function MobileContactBar({ site }: { site: PremiumContractorConfig }) {
  return (
    <div className={styles.mobileContactBar} aria-label="Contact actions">
      <a href={site.contact.phoneHref}>Call</a>
      <Link href={`${site.basePath}/quote-request`}>Request a quote</Link>
      {site.visibility.whatsapp && site.contact.whatsapp ? <a href={site.contact.whatsapp}>WhatsApp</a> : null}
    </div>
  );
}
