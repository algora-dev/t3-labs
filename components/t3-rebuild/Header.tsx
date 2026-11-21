"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROOFING_SOLUTIONS } from "./solutions";

const primaryLinks = [
  { href: "/solutions", label: "Solutions" },
  { href: "/#who-we-are", label: "Who we are" },
  { href: "/#packages", label: "Packages" },
];
const siteLinks = [
  { href: "/", label: "Home" },
  { href: "/#outcomes", label: "Four outcomes" },
  { href: "/#examples", label: "Tools & examples" },
  { href: "/#packages", label: "Packages" },
  { href: "/#who-we-are", label: "Who we are" },
  { href: "/case-studies/quotecore", label: "QuoteCore+ case study" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    // The About destination is an accessible homepage disclosure.
    const revealAbout = () => {
      if (window.location.hash === "#who-we-are") {
        const details = document.getElementById("who-we-are") as HTMLDetailsElement | null;
        if (details) {
          details.open = true;
          requestAnimationFrame(() => details.scrollIntoView({ block: "start" }));
        }
      }
    };
    revealAbout();
    window.addEventListener("hashchange", revealAbout);
    return () => window.removeEventListener("hashchange", revealAbout);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        document.getElementById("site-menu-toggle")?.focus();
      }
    };
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [menuOpen]);

  const navClick = (href: string) => {
    setMenuOpen(false);
    if (href.endsWith("#who-we-are")) {
      const about = document.getElementById("who-we-are") as HTMLDetailsElement | null;
      if (about) about.open = true;
    }
  };

  return (
    <header className="header" ref={headerRef}>
      <div className="header-inner">
        <Link href="/" aria-label="T3Labs homepage" className="brand" onClick={() => setMenuOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="T3 Labs" src="/assets/t3-logo/T3LabsLong.png" width={420} height={240} />
        </Link>
        <nav aria-label="Main navigation" className="nav">
          {primaryLinks.map((link) => (
            <Link href={link.href} key={link.label} aria-current={pathname === link.href ? "page" : undefined} onClick={() => navClick(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn-dark head-cta" href="/free-review" onClick={() => setMenuOpen(false)}>
          Get a free review <span aria-hidden="true">↗</span>
        </Link>
        <button
          type="button"
          className="site-menu-toggle"
          id="site-menu-toggle"
          aria-label={menuOpen ? "Close site menu" : "Open site menu"}
          aria-expanded={menuOpen}
          aria-controls="site-menu-panel"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? "✕" : "☰"}</span><span>{menuOpen ? "Close" : "Menu"}</span>
        </button>
      </div>
      <nav className={`mobile-panel t3-site-menu${menuOpen ? " open" : ""}`} id="site-menu-panel" aria-label="Expanded site navigation" aria-hidden={!menuOpen}>
        {menuOpen && (
          <>
            <div className="t3-site-menu-group">
              <strong>Explore T3Labs</strong>
              {siteLinks.map((link) => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={() => navClick(link.href)}>{link.label}</Link>)}
            </div>
            <div className="t3-site-menu-group">
              <strong>Roofing solutions</strong>
              <Link href="/solutions" onClick={() => navClick("/solutions")}>All solutions</Link>
              {ROOFING_SOLUTIONS.map((solution) => <Link key={solution.slug} href={`/${solution.slug}`} aria-current={pathname === `/${solution.slug}` ? "page" : undefined} onClick={() => navClick(`/${solution.slug}`)}>{solution.title}</Link>)}
            </div>
            <Link className="t11-mobile-review t3-site-menu-review" href="/free-review" onClick={() => navClick("/free-review")}>Get a free review ↗</Link>
          </>
        )}
      </nav>
    </header>
  );
}
