"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const primaryMenu = [
  "Home",
  "About Apex Roofing",
  "Domestic Roofing",
  "Commercial Roofing",
  "New Roofs",
  "Re-Roofing",
  "Roof Repairs",
  "Emergency Roofing",
  "Flat Roofing",
  "Leadwork",
  "Chimney Repairs",
  "Roof Inspections",
  "Products & Materials",
  "Roofing Systems",
  "Technical Information",
  "Downloads & Brochures",
  "Planning & Building Control",
  "Insurance Work",
  "Case Studies",
  "Customer Reviews",
  "Areas We Cover",
  "Frequently Asked Questions",
  "News & Advice",
  "Careers",
  "Contact Us",
];

const productGroups = [
  {
    title: "Pitched Roofing",
    items: [
      "Concrete Interlocking Tiles",
      "Concrete Plain Tiles",
      "Clay Plain Tiles",
      "Heritage Clay Pantiles",
      "Natural Slate",
      "Fibre Cement Slate",
      "Dry Ridge Systems",
      "Dry Verge Systems",
      "Roofing Battens",
      "Breathable Membranes",
    ],
  },
  {
    title: "Roofline & Accessories",
    items: [
      "GRP Valleys",
      "Lead Flashing",
      "Code 4 Lead",
      "Code 5 Lead",
      "Eaves Ventilation",
      "Tile Vents",
      "Ridge Tiles",
      "Hip Tiles",
      "UPVC Fascia",
      "Guttering & Downpipes",
    ],
  },
];

export function OldApexHeader() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setProductsOpen(false);
      }
    }
    function closeOnOutside(event: MouseEvent) {
      if (open && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
        setProductsOpen(false);
      }
    }
    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("mousedown", closeOnOutside);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("mousedown", closeOnOutside);
    };
  }, [open]);

  return (
    <>
      <div className="legacy-demo-note">
        <span>T3 Labs comparison demo</span>
        <span>Apex Roofing is a fictional business</span>
      </div>

      <div className="legacy-utility-bar">
        <div className="legacy-shell utility-inner">
          <div className="utility-items">
            <span>Leeds & West Yorkshire</span>
            <span>Mon-Sat 7:30am-6:00pm</span>
            <span>24hr Emergency Callouts</span>
            <span>Fully Insured</span>
            <span>4.9/5 Customer Rating</span>
          </div>
          <a href="tel:+448081570426" className="utility-phone">0808 157 0426</a>
        </div>
      </div>

      <header className="legacy-header" ref={menuRef}>
        <div className="legacy-shell header-main-row">
          <Link href="/demo/roofing-site2" className="legacy-logo-link" aria-label="Apex Roofing home">
            <img
              className="legacy-logo"
              src="/assets/demo-act-roofing/ApexLogoBlack---ae397798-5fc2-4f9a-9c88-5c1e394f7e69.png"
              alt="Apex Roofing"
            />
          </Link>

          <div className="header-search">
            <label htmlFor="site-search">Search our website</label>
            <div className="search-box">
              <input id="site-search" placeholder="Search products, services, advice..." />
              <button type="button">Search</button>
            </div>
          </div>

          <div className="header-actions">
            <div className="header-call-copy">
              <small>Need roofing advice?</small>
              <strong>Call 0808 157 0426</strong>
            </div>
            <Link href="/demo/roofing-site2/request-price" className="legacy-btn quote-top-btn">
              Request a Quote
            </Link>
          </div>
        </div>

        <div className="legacy-nav-bar">
          <div className="legacy-shell nav-row">
            <button
              type="button"
              className={`mega-menu-trigger ${open ? "is-open" : ""}`}
              onClick={() => {
                setOpen((current) => !current);
                if (open) setProductsOpen(false);
              }}
              aria-expanded={open}
            >
              <span className="hamburger" aria-hidden="true"><i /><i /><i /></span>
              Menu
            </button>
            <nav className="quick-nav" aria-label="Quick navigation">
              <a href="#">Roofing Services</a>
              <a href="#">Roof Repairs</a>
              <a href="#">Materials</a>
              <a href="#">Technical Centre</a>
              <a href="#">Areas We Cover</a>
              <a href="#">Contact</a>
            </nav>
          </div>
        </div>

        {open && (
          <div className="mega-menu-wrap">
            <div className="legacy-shell mega-menu-card">
              <div className="mega-column mega-primary-column">
                <div className="mega-heading">
                  <strong>Browse Apex Roofing</strong>
                  <span>Services, products, technical information and more</span>
                </div>
                <div className="mega-primary-list">
                  {primaryMenu.map((item) => {
                    const isProducts = item === "Products & Materials";
                    return (
                      <div
                        key={item}
                        className={`mega-primary-item ${isProducts && productsOpen ? "active" : ""}`}
                      >
                        {isProducts ? (
                          <button
                            type="button"
                            onClick={() => setProductsOpen((v) => !v)}
                            className="menu-row-button"
                          >
                            <span>{item}</span><b>›</b>
                          </button>
                        ) : (
                          <a href="#" onClick={(event) => event.preventDefault()}>
                            <span>{item}</span>{item.includes("Roof") && <small>›</small>}
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`mega-column mega-product-column ${productsOpen ? "visible" : ""}`}>
                {!productsOpen ? (
                  <div className="menu-empty-state">
                    <strong>Choose a section</strong>
                    <p>Select an item from the menu to see more options.</p>
                  </div>
                ) : (
                  <>
                    <div className="mega-heading product-heading">
                      <strong>Products & Materials</strong>
                      <span>Browse our roofing product range</span>
                    </div>
                    <div className="product-menu-grid">
                      {productGroups.map((group) => (
                        <section key={group.title}>
                          <h3>{group.title}</h3>
                          <ul>
                            {group.items.map((item) => (
                              <li key={item}>
                                {item === "Heritage Clay Pantiles" ? (
                                  <Link href="/demo/roofing-site2/products/heritage-clay-pantile">
                                    {item}<span>›</span>
                                  </Link>
                                ) : (
                                  <a href="#" onClick={(event) => event.preventDefault()}>
                                    {item}<span>›</span>
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>
                    <div className="mega-product-footer">
                      <a href="#" onClick={(event) => event.preventDefault()}>View all products</a>
                      <a href="#" onClick={(event) => event.preventDefault()}>Download product catalogue</a>
                    </div>
                  </>
                )}
              </div>

              <aside className="mega-help-column">
                <div className="help-panel">
                  <strong>Need help choosing?</strong>
                  <p>Speak to our team about products, suitability, quantities and availability.</p>
                  <a href="tel:+448081570426">Call 0808 157 0426</a>
                  <Link href="/demo/roofing-site2/request-price">Send an enquiry</Link>
                </div>
                <div className="catalogue-panel">
                  <span>2026 Roofing Catalogue</span>
                  <strong>148 pages of products & technical data</strong>
                  <a href="#" onClick={(event) => event.preventDefault()}>Download PDF</a>
                </div>
              </aside>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
