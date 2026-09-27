"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PUBLIC_SERVICES,
  SERVICE_ORDER,
  buildSummaryText,
  calculateBallpark,
  defaultSelection,
  formatBand,
  formatTotal,
  tierBand,
  type BallparkSelection,
  type Currency,
  type ServiceKey,
} from "@/lib/public-pricing";

type PageVariant = "direct" | "referred";

const bookingUrl = "https://calendly.com/insights-t3labs/20-minute-meeting";
const logoSrc = "/assets/t3-logo-white.png";

const EXPLAINER_VIDEO_ID = "FIqNbi3bG7A";
const VIDEO_POSTER = "/assets/roofing-business-tools/admin-3.jpg";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  );
}

function CurrencyToggle({ currency, onChange }: { currency: Currency; onChange: (next: Currency) => void }) {
  return (
    <div className="pc-cur" role="group" aria-label="Currency">
      <button type="button" aria-pressed={currency === "USD"} className={currency === "USD" ? "is-active" : ""} onClick={() => onChange("USD")}>
        $ USD
      </button>
      <button type="button" aria-pressed={currency === "GBP"} className={currency === "GBP" ? "is-active" : ""} onClick={() => onChange("GBP")}>
        &pound; GBP
      </button>
    </div>
  );
}

function HeroVideo() {
  const [active, setActive] = useState(false);
  return (
    <figure className="pc-hero-video">
      {active ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${EXPLAINER_VIDEO_ID}?autoplay=1&rel=0`}
          title="T3 Labs 90-second overview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="pc-video-facade"
          onClick={() => setActive(true)}
          aria-label="Play the T3 Labs overview video"
        >
          <img src={VIDEO_POSTER} alt="T3 Labs business tools overview" />
          <span className="pc-video-facade-overlay" aria-hidden="true" />
          <span className="pc-video-play" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span>
          <span className="pc-video-label">Watch the 90-second overview</span>
        </button>
      )}
    </figure>
  );
}

export function PricingCalculatorPage({ variant = "referred" }: { variant?: PageVariant }) {
  const isReferral = variant === "referred";
  const [currency, setCurrency] = useState<Currency>("USD");
  const [selection, setSelection] = useState<BallparkSelection>({ calculator: defaultSelection("calculator") });
  const [activeTab, setActiveTab] = useState<ServiceKey | null>("calculator");
  const [flash, setFlash] = useState(0);
  const [copied, setCopied] = useState(false);

  // GBP default for UK visitors. Runs after mount so server and first client render match.
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.startsWith("Europe/London")) setCurrency("GBP");
    } catch {
      // Timezone unavailable, keep USD.
    }
  }, []);

  const bump = () => setFlash((seq) => seq + 1);

  const toggleService = (key: ServiceKey) => {
    bump();
    const next: BallparkSelection = { ...selection };
    if (next[key]) {
      delete next[key];
      setSelection(next);
      if (activeTab === key) {
        setActiveTab(SERVICE_ORDER.find((k) => next[k]) ?? null);
      }
    } else {
      next[key] = defaultSelection(key);
      setSelection(next);
      setActiveTab(key);
    }
  };

  const selectAll = () => {
    bump();
    const next: BallparkSelection = {};
    for (const key of SERVICE_ORDER) next[key] = selection[key] ?? defaultSelection(key);
    setSelection(next);
    if (!activeTab || !next[activeTab]) setActiveTab(SERVICE_ORDER[0]);
  };

  const clearAll = () => {
    bump();
    setSelection({});
    setActiveTab(null);
  };

  const setTier = (key: ServiceKey, tierId: string) => {
    setSelection((current) =>
      current[key] ? { ...current, [key]: { ...current[key], tierId } } : current,
    );
  };

  const setExisting = (key: ServiceKey, existingSite: boolean) => {
    setSelection((current) =>
      current[key] ? { ...current, [key]: { ...current[key], existingSite } } : current,
    );
  };

  const ballpark = useMemo(() => calculateBallpark(selection, currency), [selection, currency]);
  const selectedKeys = SERVICE_ORDER.filter((key) => selection[key]);
  const selectedCount = selectedKeys.length;
  const activeService = activeTab && selection[activeTab] ? PUBLIC_SERVICES[activeTab] : null;
  const activeTabIndex = activeTab ? selectedKeys.indexOf(activeTab) : -1;

  const copyConfig = async () => {
    const text = buildSummaryText(selection, currency);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard unavailable, ignore.
    }
  };

  return (
    <main className="pc-page">
      <style>{styles}</style>

      <header className="pc-header">
        <div className="pc-shell pc-header-inner">
          <a href={isReferral ? "/our-solution/referred" : "/our-solution"} className="pc-brand" aria-label="T3 Labs">
            <span><img src={logoSrc} alt="T3 Labs" /></span>
            <b>T3 Labs</b>
          </a>
          <div className="pc-header-actions">
            {isReferral ? (
              <a className="pc-header-call" href="#next-step">Next step</a>
            ) : (
              <a className="pc-header-call" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book a call</a>
            )}
          </div>
        </div>
      </header>

      <section className="pc-hero">
        <div className="pc-grid-glow" aria-hidden="true" />
        <div className="pc-shell pc-hero-grid">
          <div className="pc-hero-copy">
            <p className="pc-eyebrow">T3 Labs ballpark pricing</p>
            <h1>
              See roughly what your <em>T3 Labs solution</em> could cost.
            </h1>
            <p className="pc-lead">
              Choose the tools you want, select roughly how capable each needs to be, and your ballpark updates instantly.
              No contact details required.
            </p>
            <p className="pc-hero-sub">Select one tool or combine several.</p>
            <div className="pc-actions">
              <a className="pc-primary" href="#build">Build my ballpark</a>
              <CurrencyToggle currency={currency} onChange={setCurrency} />
            </div>
            <p className="pc-fineprint">Indicative one-off setup ranges, not quotes. Hosting, support and usage are confirmed separately where applicable.</p>
          </div>
          <HeroVideo />
        </div>
      </section>

      <section className="pc-quick-strip" aria-label="How the pricing calculator works">
        <div className="pc-shell pc-how-grid">
          <article><b>01</b><div><strong>Pick what you need</strong><span>Choose one tool or combine several.</span></div></article>
          <article><b>02</b><div><strong>Choose the level</strong><span>Pick the closest capability tier for each.</span></div></article>
          <article><b>03</b><div><strong>See your ballpark</strong><span>Your indicative range updates immediately.</span></div></article>
        </div>
      </section>

      <section className="pc-section pc-shell" id="build">
        <div className="pc-heading">
          <p className="pc-eyebrow">Choose your building blocks</p>
          <h2>Select the parts you want.</h2>
          <p>Four building blocks, one configurable system. Select one card or combine several, then choose the closest capability level below.</p>
        </div>

        <div className="pc-picker-status" aria-live="polite">
          <span className="pc-picker-count">{selectedCount} of {SERVICE_ORDER.length} selected</span>
          <div className="pc-picker-status-actions">
            <button type="button" onClick={selectAll} disabled={selectedCount === SERVICE_ORDER.length}>Select all</button>
            <button type="button" onClick={clearAll} disabled={selectedCount === 0}>Clear</button>
          </div>
        </div>

        <div className="pc-picker-grid">
          {SERVICE_ORDER.map((key) => {
            const service = PUBLIC_SERVICES[key];
            const active = Boolean(selection[key]);
            return (
              <button
                key={key}
                type="button"
                className={`pc-picker${active ? " is-active" : ""}`}
                onClick={() => toggleService(key)}
                aria-pressed={active}
              >
                <span className="pc-picker-top">
                  <b>{service.number}</b>
                  <i>{service.eyebrow}</i>
                  <em className="pc-picker-check" aria-hidden="true"><CheckIcon /></em>
                </span>
                <strong>{service.name}</strong>
                <span>{service.short}</span>
                <span className="pc-picker-hint">{active ? "Selected, tap to remove" : "Tap to select"}</span>
              </button>
            );
          })}
        </div>

        <div className="pc-build-layout">
          <div className="pc-build-main">
            {selectedKeys.length === 0 ? (
              <div className="pc-build-empty">
                <p className="pc-card-label">Nothing selected yet</p>
                <h3>Pick a card above to choose complexity levels.</h3>
                <p>Every part is useful on its own. Combine several and the ballpark adds them together.</p>
              </div>
            ) : (
              <div>
                <div
                  className="pc-tabs"
                  role="tablist"
                  aria-label="Selected services"
                  style={{ gridTemplateColumns: `repeat(${selectedKeys.length}, minmax(0, 1fr))` }}
                >
                  {activeTabIndex >= 0 ? (
                    <span
                      className="pc-tab-thumb"
                      aria-hidden="true"
                      style={{
                        width: `calc((100% - 8px) / ${selectedKeys.length})`,
                        transform: `translateX(${activeTabIndex * 100}%)`,
                      }}
                    />
                  ) : null}
                  {selectedKeys.map((key) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={activeTab === key}
                      className={`pc-tab${activeTab === key ? " is-active" : ""}`}
                      onClick={() => setActiveTab(key)}
                    >
                      {PUBLIC_SERVICES[key].name}
                    </button>
                  ))}
                </div>
                {activeService ? (
                  <section className="pc-service" role="tabpanel" aria-label={activeService.name}>
                    <div className="pc-service-head">
                      <div>
                        <p className="pc-eyebrow"><b>{activeService.number}</b> {activeService.eyebrow}</p>
                        <h3>{activeService.name}</h3>
                        <p className="pc-service-intro">{activeService.intro}</p>
                      </div>
                      {activeService.key === "websites" ? (
                        <div className="pc-seg" role="group" aria-label="New or existing website">
                          <button type="button" className={!selection.websites?.existingSite ? "is-active" : ""} onClick={() => setExisting("websites", false)} aria-pressed={!selection.websites?.existingSite}>
                            New website
                          </button>
                          <button type="button" className={selection.websites?.existingSite ? "is-active" : ""} onClick={() => setExisting("websites", true)} aria-pressed={Boolean(selection.websites?.existingSite)}>
                            Existing site, 25% off
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <div className="pc-tier-grid">
                      {activeService.tiers.map((tier, tierIndex) => {
                        const state = selection[activeService.key];
                        if (!state) return null;
                        const existingSite = activeService.key === "websites" && state.existingSite;
                        const band = tierBand(tier, currency, existingSite);
                        const active = state.tierId === tier.id;
                        const previousTier = tierIndex > 0 ? activeService.tiers[tierIndex - 1] : null;
                        return (
                          <button
                            key={tier.id}
                            type="button"
                            className={`pc-tier${active ? " is-active" : ""}`}
                            onClick={() => setTier(activeService.key, tier.id)}
                            aria-pressed={active}
                          >
                            <span className="pc-tier-check" aria-hidden="true"><CheckIcon /></span>
                            <strong>{tier.name}</strong>
                            <span className="pc-tier-blurb">{tier.blurb}</span>
                            <span className="pc-tier-price">{formatBand(band, currency, tier.openTop)}</span>
                            {tier.includes === "previous" && previousTier ? (
                              <span className="pc-tier-includes">Includes everything in {previousTier.name}, plus the above.</span>
                            ) : tier.includes === "custom" ? (
                              <span className="pc-tier-includes pc-tier-includes--custom">Need more than these options? Something custom-built to your needs.</span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ) : null}
              </div>
            )}
          </div>

          <aside className="pc-total" id="ballpark" aria-label="Your ballpark">
            <div className={`pc-total-inner${flash > 0 ? " pc-flash" : ""}`} key={flash}>
              <div className="pc-total-top">
                <p className="pc-card-label">Your setup ballpark</p>
                <CurrencyToggle currency={currency} onChange={setCurrency} />
              </div>
              {selectedKeys.length === 0 ? (
                <>
                  <p className="pc-total-empty">Pick a service to see your ballpark.</p>
                  <p className="pc-total-hint">Select a card above and the range appears here instantly.</p>
                </>
              ) : (
                <>
                  <p className="pc-total-value" aria-live="polite">{formatTotal(ballpark, currency)}</p>
                  {ballpark.hasStretch ? <p className="pc-total-note">Includes an open-ended tier, the top end can stretch further.</p> : null}
                  {ballpark.hasFrom ? <p className="pc-total-note">Includes a from-price tier, final cost depends on scope.</p> : null}
                  {ballpark.hasContact ? <p className="pc-total-note">Includes a contact-us tier, priced after a short conversation.</p> : null}
                  <ul className="pc-total-lines">
                    {ballpark.lines.map((line) => (
                      <li key={line.serviceKey}>
                        <span>
                          {line.serviceName}
                          {line.note ? <em> ({line.note.toLowerCase()})</em> : null}
                        </span>
                        <b>{line.tierName}</b>
                        <i>{formatBand(line.band, currency, line.openTop)}</i>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {selectedKeys.length > 0 ? (
                <div className="pc-value-prompt">
                  <strong>What would this need to deliver to pay for itself?</strong>
                  <span>A few staff hours saved, one extra job, or stronger enquiries can change the comparison quickly.</span>
                </div>
              ) : null}
              <div className="pc-total-ctas">
                {isReferral ? (
                  <p className="pc-total-refer">Like what you are seeing? Copy this ballpark and send it back to the person who shared this page.</p>
                ) : (
                  <>
                    <a className="pc-primary" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book a free 20-minute call</a>
                    <a className="pc-secondary-btn" href="/our-solution#start">Send us what you need</a>
                  </>
                )}
                <button type="button" className="pc-copy" onClick={copyConfig} disabled={selectedKeys.length === 0}>
                  {copied ? "Copied" : "Copy my configuration"}
                </button>
                <p className="pc-copy-help">{isReferral ? "Copy your selections and ballpark, then send them to the person who shared this page." : "Copy your selections and ballpark, then send them to us if you would rather not book a call yet."}</p>
              </div>
              <p className="pc-total-disclaimer">One-off setup ballpark only, not a quote. Ongoing costs are confirmed separately where applicable.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="pc-support pc-shell" aria-labelledby="pc-support-title">
        <div className="pc-reassurance">
          <p className="pc-card-label">Not sure which level you need?</p>
          <h2 id="pc-support-title">You do not need to get every selection right.</h2>
          <p>This calculator is designed to give you a sensible starting range. We can simplify the scope, remove things you do not need, or map something more bespoke before anything is quoted.</p>
        </div>
        <nav className="pc-learn-links" aria-label="Learn more about T3 Labs solutions">
          <a href={isReferral ? "/our-solution/referred" : "/our-solution"}><span>Understand the approach</span><b>Our Solution →</b></a>
          <a href={isReferral ? "/roofing-solutions/referred" : "/roofing-solutions"}><span>See a worked construction example</span><b>Roofing Solutions →</b></a>
          <a href={isReferral ? "/roofing-business-tools/referred" : "/roofing-business-tools"}><span>Go deeper on the tools</span><b>Roofing Business Tools →</b></a>
        </nav>
      </section>

      <section className="pc-close" id="next-step">
        <div className="pc-shell pc-close-inner">
          <p className="pc-eyebrow">Next step</p>
          <h2>{isReferral ? "Send this ballpark back to the person who shared it." : "Turn your ballpark into a real plan."}</h2>
          <p>
            {isReferral
              ? "They can confirm which options make sense, remove anything you do not need and tighten the ballpark into a real scope."
              : "Book a short call or send us what you need. We will confirm what fits, simplify the scope where possible and quote the real build."}
          </p>
          <div className="pc-actions pc-actions--center">
            {isReferral ? (
              <button type="button" className="pc-primary pc-primary-button" onClick={copyConfig} disabled={selectedKeys.length === 0}>
                {copied ? "Copied" : "Copy my ballpark"}
              </button>
            ) : (
              <>
                <a className="pc-primary" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book a free 20-minute call</a>
                <a className="pc-secondary-btn" href="/our-solution#start">Send us what you need</a>
              </>
            )}
          </div>
          {isReferral ? <p className="pc-close-note">Copy the configuration above and paste it into your existing conversation with your representative.</p> : null}
        </div>
      </section>

      <footer className="pc-footer">
        <div className="pc-shell">
          <span>&copy; T3 Labs</span>
          <span>Ballpark prices are indicative, not quotes.</span>
        </div>
      </footer>
    </main>
  );
}

export default function PricingCalculatorReferredPage() {
  return <PricingCalculatorPage variant="referred" />;
}

const styles = String.raw`
.pc-page{--lime:#d7ff00;--ink:#0a0b10;--surface:#101722;--surface2:#172131;--line:#303d51;--muted:#aab4c6;background:var(--ink);color:#fff;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.5}
.pc-page *{box-sizing:border-box}.pc-page :where(h1,h2,h3,p){margin:0}.pc-page button,.pc-page a{font:inherit}.pc-page :where(a,button):focus-visible{outline:2px solid var(--lime);outline-offset:3px}.pc-shell{max-width:1180px;margin:auto;padding-inline:24px}.pc-page [id]{scroll-margin-top:86px}
.pc-header{position:sticky;top:0;z-index:50;background:rgba(9,11,18,.9);backdrop-filter:blur(18px);border-bottom:1px solid #242b3a}.pc-header-inner{min-height:66px;display:flex;align-items:center;justify-content:space-between;gap:22px}.pc-brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none}.pc-brand span{display:grid;place-items:center;width:34px;height:34px;border-radius:9px;background:#0d111b}.pc-brand img{width:24px;height:24px;object-fit:contain}.pc-brand b{font-size:14px}.pc-header-actions{display:flex;align-items:center;gap:14px}.pc-header-call{background:var(--lime);color:#080a0f;text-decoration:none;font-size:12px;font-weight:600;padding:9px 14px;border-radius:999px}
.pc-eyebrow,.pc-card-label{font-size:11px;text-transform:uppercase;letter-spacing:.15em;font-weight:700;color:var(--lime)}.pc-eyebrow b{margin-right:4px}
.pc-hero{position:relative;overflow:hidden;padding:82px 0 66px;background:radial-gradient(circle at 82% 26%,rgba(215,255,0,.14),transparent 26%),linear-gradient(135deg,#0a0b10,#101722)}.pc-grid-glow{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:46px 46px;mask-image:linear-gradient(to right,#000 25%,transparent 92%)}.pc-hero-grid{position:relative;display:grid;grid-template-columns:.95fr 1.05fr;gap:54px;align-items:center}.pc-hero-copy{min-width:0}
.pc-hero h1{font-size:clamp(42px,5vw,68px);line-height:.99;letter-spacing:-.055em;margin-top:16px}.pc-hero h1 em{font-style:normal;color:var(--lime)}
.pc-lead{font-size:18px;line-height:1.67;color:var(--muted);max-width:650px;margin-top:24px}.pc-hero-sub{font-size:14px;line-height:1.6;color:#d2d9e5;margin-top:15px;max-width:600px}
.pc-actions{display:flex;flex-wrap:wrap;gap:18px;align-items:center;margin-top:30px}
.pc-primary{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--lime);color:#0a0b10;text-decoration:none;padding:14px 20px;border:0;border-radius:999px;font-weight:700;font-size:14px;transition:.2s;cursor:pointer}.pc-primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 28px rgba(215,255,0,.2)}.pc-primary:disabled{opacity:.4;cursor:default}.pc-primary-button{font-family:inherit}
.pc-secondary{color:#fff;font-size:14px;font-weight:600;border-bottom:1px solid rgba(255,255,255,.45);padding-bottom:3px}.pc-secondary-btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;border:1px solid var(--line);background:transparent;color:#fff;text-decoration:none;padding:11px 18px;border-radius:999px;font-size:13px;font-weight:700;transition:.2s}.pc-secondary-btn:hover{transform:translateY(-2px);border-color:rgba(215,255,0,.7);box-shadow:0 0 0 1px rgba(215,255,0,.18),0 0 22px rgba(215,255,0,.10)}
.pc-cur{display:inline-flex;gap:4px;padding:4px;border:1px solid var(--line);border-radius:999px;background:var(--surface)}.pc-cur button{appearance:none;border:0;background:transparent;color:#a8b0bf;font-size:12px;font-weight:700;padding:7px 12px;border-radius:999px;cursor:pointer;transition:.2s}.pc-cur button:hover:not(.is-active){color:#fff}.pc-cur button.is-active{background:var(--lime);color:#080a0f}
.pc-fineprint{font-size:13px;color:#858fa2;margin-top:22px;max-width:640px}.pc-hero-video{min-width:0;margin:0;padding:9px;border:1px solid #3a465d;border-radius:18px;background:#101722;box-shadow:0 30px 70px rgba(0,0,0,.38)}.pc-hero-video iframe{display:block;width:100%;aspect-ratio:16/9;border:0;border-radius:11px;background:#000}.pc-video-facade{appearance:none;border:0;padding:0;width:100%;display:block;position:relative;cursor:pointer;border-radius:11px;overflow:hidden;background:#000}.pc-video-facade img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;opacity:.5}.pc-video-facade-overlay{position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,rgba(9,11,18,.1),rgba(9,11,18,.88))}.pc-video-play{position:absolute;left:50%;top:45%;transform:translate(-50%,-50%);display:grid;place-items:center;width:78px;height:78px;border-radius:50%;background:var(--lime);color:#080a0f;box-shadow:0 0 40px rgba(215,255,0,.45);transition:.2s}.pc-video-facade:hover .pc-video-play{transform:translate(-50%,-50%) scale(1.08);box-shadow:0 0 60px rgba(215,255,0,.65)}.pc-video-label{position:absolute;left:0;right:0;bottom:18px;text-align:center;color:#fff;font-size:15px;font-weight:600;letter-spacing:.02em}
.pc-quick-strip{border-block:1px solid #303d51;background:#101722}.pc-how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding-block:18px}.pc-how-grid article{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:start;padding:12px 14px;border-radius:12px}.pc-how-grid article>b{color:var(--lime);font-size:12px;letter-spacing:.08em}.pc-how-grid article>div{display:grid;gap:3px}.pc-how-grid strong{color:#fff;font-size:14px}.pc-how-grid span{color:#aab4c6;font-size:12px;line-height:1.5}
.pc-section{padding-block:92px}
.pc-heading{max-width:850px}.pc-heading h2{font-size:clamp(31px,4vw,50px);line-height:1.04;letter-spacing:-.045em;margin-top:14px}.pc-heading>p:last-child{margin-top:17px;color:var(--muted);font-size:18px;line-height:1.68}
.pc-picker-status{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:32px;padding:7px 9px;border:1px solid var(--line);border-radius:999px;background:var(--surface);width:fit-content}.pc-picker-count{display:inline-flex;align-items:center;background:var(--lime);color:#080a0f;font-size:13px;font-weight:700;padding:8px 14px;border-radius:999px}.pc-picker-status-actions{display:flex;align-items:center;gap:4px}.pc-picker-status-actions button{appearance:none;border:1px solid transparent;background:transparent;color:#a8b0bf;font-size:13px;font-weight:600;padding:8px 12px;border-radius:999px;cursor:pointer;transition:.2s}.pc-picker-status-actions button:hover:not(:disabled){color:#fff;border-color:rgba(215,255,0,.5);box-shadow:0 0 14px rgba(215,255,0,.18)}.pc-picker-status-actions button:disabled{opacity:.35;cursor:default}
.pc-picker-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:14px}
.pc-picker{appearance:none;text-align:left;border:1px solid var(--line);background:var(--surface);color:#fff;padding:22px;border-radius:15px;display:grid;gap:10px;cursor:pointer;transition:.2s}.pc-picker:hover{transform:translateY(-2px);border-color:rgba(215,255,0,.55);box-shadow:0 10px 30px rgba(215,255,0,.14)}.pc-picker.is-active{border-color:rgba(215,255,0,.5);background:linear-gradient(180deg,rgba(215,255,0,.08),rgba(255,255,255,.015))}.pc-picker.is-active:hover{box-shadow:0 12px 34px rgba(215,255,0,.2)}
.pc-picker-top{display:flex;justify-content:space-between;align-items:center;gap:14px}.pc-picker-top b{color:var(--lime);font-size:12px}.pc-picker-top i{font-style:normal;font-size:11px;text-transform:uppercase;letter-spacing:.11em;color:#8f99ab}
.pc-picker-check{flex:none;display:grid;place-items:center;width:30px;height:30px;border-radius:9px;border:2px solid #46536e;color:transparent;font-style:normal;transition:.2s}.pc-picker-check svg{width:14px;height:14px}.pc-picker:not(.is-active):hover .pc-picker-check{border-color:rgba(215,255,0,.75);box-shadow:0 0 14px rgba(215,255,0,.22)}.pc-picker.is-active .pc-picker-check{background:var(--lime);border-color:var(--lime);color:#080a0f}
.pc-picker>strong{font-size:20px}.pc-picker>span:not(.pc-picker-hint){color:var(--muted);font-size:14px;line-height:1.55}.pc-picker-hint{font-size:13px;font-weight:600;color:#9aa6ba}.pc-picker.is-active .pc-picker-hint{color:var(--lime)}
.pc-build-layout{display:grid;grid-template-columns:1fr;gap:28px;margin-top:34px}
.pc-build-main{display:grid;gap:22px;min-width:0}
.pc-build-empty{padding:28px;border:1px dashed #46536e;border-radius:17px;background:var(--surface)}.pc-build-empty h3{font-size:26px;line-height:1.1;letter-spacing:-.03em;margin-top:11px}.pc-build-empty p:last-child{color:var(--muted);font-size:16px;line-height:1.65;margin-top:14px}
.pc-tabs{position:relative;display:grid;padding:4px;border:1px solid var(--line);border-radius:999px;background:var(--surface);margin-bottom:16px}
.pc-tab-thumb{position:absolute;top:4px;bottom:4px;left:4px;border-radius:999px;background:var(--lime);z-index:0;transition:transform .25s cubic-bezier(.4,0,.2,1),width .25s cubic-bezier(.4,0,.2,1)}
.pc-tab{appearance:none;border:0;background:transparent;color:#a8b0bf;font-size:13px;font-weight:700;padding:10px 6px;border-radius:999px;cursor:pointer;transition:color .2s;position:relative;z-index:1;text-align:center;line-height:1.25}
.pc-tab:hover:not(.is-active){color:#fff}
.pc-tab.is-active{color:#080a0f}
.pc-service{padding:26px;border:1px solid var(--line);border-radius:17px;background:var(--surface)}
.pc-service-head{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;flex-wrap:wrap;margin-bottom:18px}
.pc-service-head h3{font-size:26px;letter-spacing:-.03em;margin-top:10px}.pc-service-intro{color:var(--muted);font-size:15px;line-height:1.6;margin-top:8px;max-width:620px}
.pc-seg{display:inline-flex;gap:4px;padding:4px;border:1px solid var(--line);border-radius:999px;background:var(--surface2)}.pc-seg button{appearance:none;border:0;background:transparent;color:#a8b0bf;font-size:12px;font-weight:700;padding:8px 14px;border-radius:999px;cursor:pointer;transition:.2s}.pc-seg button:hover:not(.is-active){color:#fff}.pc-seg button.is-active{background:var(--lime);color:#080a0f}
.pc-tier-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:12px}
.pc-tier{appearance:none;text-align:left;border:1px solid #303d51;background:var(--surface2);color:#fff;padding:18px;border-radius:13px;display:grid;gap:8px;cursor:pointer;transition:.2s;align-content:start}.pc-tier:hover{transform:translateY(-2px);border-color:rgba(215,255,0,.55);box-shadow:0 8px 24px rgba(215,255,0,.12)}.pc-tier.is-active{border-color:rgba(215,255,0,.5);background:linear-gradient(180deg,rgba(215,255,0,.08),rgba(255,255,255,.015))}
.pc-tier-check{display:grid;place-items:center;width:26px;height:26px;border-radius:8px;border:2px solid #46536e;color:transparent;transition:.2s}.pc-tier-check svg{width:12px;height:12px}.pc-tier:not(.is-active):hover .pc-tier-check{border-color:rgba(215,255,0,.75)}.pc-tier.is-active .pc-tier-check{background:var(--lime);border-color:var(--lime);color:#080a0f}
.pc-tier>strong{font-size:17px}.pc-tier-blurb{color:var(--muted);font-size:13px;line-height:1.55}.pc-tier-price{font-size:15px;font-weight:700;color:var(--lime)}.pc-tier.is-active .pc-tier-price{color:var(--lime)}
.pc-tier-includes{font-size:11.5px;line-height:1.5;color:#9aa6ba;border-top:1px dashed #303d51;padding-top:8px}.pc-tier-includes--custom{color:#d2d9e5}
.pc-total{align-self:start}
.pc-total-inner{position:sticky;top:86px;padding:24px;border:1px solid var(--line);border-radius:17px;background:var(--surface);display:grid;gap:14px}
.pc-total-top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.pc-total-value{font-size:clamp(30px,3vw,40px);font-weight:800;letter-spacing:-.04em;line-height:1.05;color:#fff}
.pc-total-empty{font-size:22px;font-weight:700;letter-spacing:-.02em}.pc-total-hint{color:var(--muted);font-size:14px;line-height:1.6}
.pc-total-note{font-size:12.5px;color:#cdd6e2;background:var(--surface2);border:1px solid #303d51;border-radius:10px;padding:8px 10px;line-height:1.5}
.pc-total-lines{list-style:none;padding:0;margin:0;display:grid;gap:8px}
.pc-total-lines li{display:grid;gap:2px;padding:10px 12px;border-radius:10px;border:1px solid #303d51;background:var(--surface2)}
.pc-total-lines span{font-size:13px;font-weight:600;color:#e7ecf4}.pc-total-lines span em{font-style:normal;color:#8f99ab;font-weight:500}
.pc-total-lines b{font-size:12px;color:var(--lime)}.pc-total-lines i{font-style:normal;font-size:14px;font-weight:700}
.pc-value-prompt{display:grid;gap:5px;padding:12px;border-left:3px solid var(--lime);background:rgba(215,255,0,.055);border-radius:0 10px 10px 0}.pc-value-prompt strong{font-size:13px;color:#fff}.pc-value-prompt span{font-size:11.5px;line-height:1.5;color:#aab4c6}.pc-total-ctas{display:grid;gap:10px;justify-items:stretch}.pc-total-refer{font-size:13px;font-weight:600;line-height:1.55;color:#e7ecf4;border:1px dashed rgba(215,255,0,.4);border-radius:12px;padding:12px;text-align:center}.pc-copy-help{font-size:11.5px;line-height:1.5;color:#8f99ab;text-align:center}
.pc-copy{appearance:none;border:1px solid rgba(215,255,0,.45);background:transparent;color:#fff;font-size:13px;font-weight:700;padding:11px 16px;border-radius:999px;cursor:pointer;transition:.2s}.pc-copy:hover:not(:disabled){border-color:var(--lime);box-shadow:0 0 18px rgba(215,255,0,.25)}.pc-copy:disabled{opacity:.35;cursor:default}
.pc-total-disclaimer{font-size:11.5px;color:#858fa2;line-height:1.5}
.pc-flash{animation:pc-flash .75s ease}@keyframes pc-flash{0%{box-shadow:0 0 0 rgba(215,255,0,0);border-color:var(--line)}30%{box-shadow:0 0 36px rgba(215,255,0,.35);border-color:rgba(215,255,0,.7)}100%{box-shadow:0 0 0 rgba(215,255,0,0);border-color:var(--line)}}
.pc-support{padding-block:0 92px}.pc-reassurance{padding:28px;border:1px solid var(--line);border-radius:17px;background:var(--surface)}.pc-reassurance h2{font-size:clamp(25px,3vw,36px);line-height:1.08;letter-spacing:-.035em;margin-top:10px}.pc-reassurance>p:last-child{color:var(--muted);font-size:15px;line-height:1.65;max-width:820px;margin-top:12px}.pc-learn-links{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.pc-learn-links a{display:grid;gap:6px;padding:17px 18px;border:1px solid var(--line);border-radius:12px;background:var(--surface);text-decoration:none;transition:.2s}.pc-learn-links a:hover{transform:translateY(-2px);border-color:rgba(215,255,0,.6);box-shadow:0 0 0 1px rgba(215,255,0,.14),0 0 22px rgba(215,255,0,.09)}.pc-learn-links span{font-size:11.5px;color:#8f99ab}.pc-learn-links b{font-size:14px;color:#fff}.pc-close{padding:104px 0;background:radial-gradient(circle at 50% 0,rgba(215,255,0,.13),transparent 34%),#080a0f}.pc-close-inner{max-width:850px;text-align:center}.pc-close h2{font-size:clamp(31px,4vw,50px);line-height:1.04;letter-spacing:-.045em;margin-top:14px}.pc-close-inner>p:not(.pc-eyebrow){color:var(--muted);font-size:18px;line-height:1.7;max-width:720px;margin:18px auto 0}.pc-actions--center{justify-content:center}.pc-close-note{font-size:12px!important;color:#858fa2!important;margin-top:16px!important}
.pc-footer{border-top:1px solid var(--line);color:#858fa0;font-size:11px}.pc-footer .pc-shell{display:flex;justify-content:space-between;gap:20px;padding-block:24px}
@media(min-width:1080px){.pc-build-layout{grid-template-columns:minmax(0,1fr) 360px}}
@media(max-width:980px){.pc-hero-grid{grid-template-columns:1fr;gap:34px}.pc-how-grid{grid-template-columns:1fr}.pc-picker-grid{grid-template-columns:1fr 1fr}.pc-learn-links{grid-template-columns:1fr}}
@media(max-width:720px){.pc-shell{padding-inline:18px}.pc-header-inner{min-height:60px}.pc-brand b{display:none}.pc-header-call{font-size:11px}.pc-hero{padding:54px 0 44px}.pc-hero h1{font-size:40px}.pc-lead{font-size:16px}.pc-section{padding-block:66px}.pc-support{padding-bottom:66px}.pc-heading h2,.pc-close h2{font-size:34px}.pc-heading>p:last-child{font-size:16px}.pc-picker-grid{grid-template-columns:1fr}.pc-service{padding:20px}.pc-total-inner{position:static}.pc-actions .pc-cur{width:100%;justify-content:center}.pc-reassurance{padding:22px}}
@media(max-width:720px){.pc-tab{font-size:12px;padding:9px 6px}}
@media(prefers-reduced-motion:reduce){.pc-flash{animation:none}.pc-primary,.pc-secondary-btn,.pc-picker,.pc-tier,.pc-copy,.pc-tab,.pc-video-play,.pc-learn-links a{transition:none}.pc-tab-thumb{transition:none}}
`;
