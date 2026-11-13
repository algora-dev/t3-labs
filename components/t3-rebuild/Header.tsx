"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { href: "/#solutions", label: "What we solve" },
  { href: "/#who-we-are", label: "Who we are" },
  { href: "/#packages", label: "Packages" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // The About destination is a native, accessible disclosure, not a separate page.
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
  }, []);

  const navClick = (href: string) => {
    setMenuOpen(false);
    if (href.endsWith("#who-we-are")) {
      const about = document.getElementById("who-we-are") as HTMLDetailsElement | null;
      if (about) about.open = true;
    }
  };

  return (
    <header className="header">
      <div className="header-inner">
        <Link href="/" aria-label="T3Labs homepage" className="brand">
          {/* Existing brand identity in the approved preview */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="T3Labs" src="/assets/t3-rebuild/v18-ca36a8dffccf.png" />
        </Link>
        <nav aria-label="Main navigation" className="nav">
          {links.map((link) => (
            <Link href={link.href} key={link.label} onClick={() => navClick(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn-dark head-cta" href="/free-review">
          Get a free review <span aria-hidden="true">↗</span>
        </Link>
        <button
          type="button"
          className="mobile-toggle"
          id="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="mobile-panel"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu ☰
        </button>
      </div>
      <nav className={`mobile-panel${menuOpen ? " open" : ""}`} id="mobile-panel" aria-label="Mobile navigation">
        {links.map((link) => (
          <Link href={link.href} key={link.label} onClick={() => navClick(link.href)}>
            {link.label}
          </Link>
        ))}
        <Link className="t11-mobile-review" href="/free-review" onClick={() => setMenuOpen(false)}>
          Get a free review ↗
        </Link>
      </nav>
    </header>
  );
}
