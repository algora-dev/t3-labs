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

export function PricingCalculatorPage({ variant = "referred" }: { variant?: PageVariant }) {
  const isReferral = variant === "referred";
  const [currency, setCurrency] = useState<Currency>("USD");
  const [selection, setSelection] = useState<BallparkSelection>({ calculator: defaultSelection("calculator") });
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
    setSelection((current) => {
      const next = { ...current };
      if (next[key]) delete next[key];
      else next[key] = defaultSelection(key);
      return next;
    });
  };

  const selectAll = () => {
    bump();
    setSelection(() => {
      const next: BallparkSelection = {};
      for (const key of SERVICE_ORDER) next[key] = defaultSelection(key);
      return next;
    });
  };

  const clearAll = () => {
    bump();
    setSelection({});
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
          <nav>
            <a href="#build">Build yours</a>
            <a href="#ballpark">Your ballpark</a>
            <a href={isReferral ? "/roofing-solutions/referred" : "/roofing-solutions"}>Examples</a>
          </nav>
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
        <div className="pc-shell pc-hero-inner">
          <p className="pc-eyebrow">T3 Labs ballpark pricing</p>
          <h1>
            Get a <em>ballpark</em> for your build in two minutes.
          </h1>
          <p className="pc-lead">
            Pick the parts you want, choose how complex each one is, and watch the price range update live.
            No contact details needed, no sales pressure.
          </p>
          <div className="pc-actions">
            <a className="pc-primary" href="#build">Build my ballpark</a>
            <CurrencyToggle currency={currency} onChange={setCurrency} />
          </div>
          <p className="pc-fineprint">Honest ranges, not quotes. The final price is confirmed in a short conversation.</p>
        </div>
      </section>

      <section className="pc-quick-strip">
        <div className="pc-shell">
          <strong>Four building blocks, one system.</strong>
          <span>
            Pick any combination. Each part has simple complexity tiers, and your ballpark updates the moment you change anything.
          </span>
        </div>
      </section>

      <section className="pc-section pc-shell" id="build">
        <div className="pc-heading">
          <p className="pc-eyebrow">Choose your building blocks</p>
          <h2>Select the parts you want.</h2>
          <p>Select one card or combine several. Each selected part opens its own complexity choices below.</p>
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
              selectedKeys.map((key) => {
                const service = PUBLIC_SERVICES[key];
                const state = selection[key];
                if (!state) return null;
                const existingSite = key === "websites" && state.existingSite;
                return (
                  <section className="pc-service" key={key} aria-label={service.name}>
                    <div className="pc-service-head">
                      <div>
                        <p className="pc-eyebrow"><b>{service.number}</b> {service.eyebrow}</p>
                        <h3>{service.name}</h3>
                        <p className="pc-service-intro">{service.intro}</p>
                      </div>
                      {key === "websites" ? (
                        <div className="pc-seg" role="group" aria-label="New or existing website">
                          <button type="button" className={!state.existingSite ? "is-active" : ""} onClick={() => setExisting(key, false)} aria-pressed={!state.existingSite}>
                            New website
                          </button>
                          <button type="button" className={state.existingSite ? "is-active" : ""} onClick={() => setExisting(key, true)} aria-pressed={state.existingSite}>
                            Existing site, 25% off
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <div className="pc-tier-grid">
                      {service.tiers.map((tier) => {
                        const band = tierBand(tier, currency, existingSite);
                        const active = state.tierId === tier.id;
                        return (
                          <button
                            key={tier.id}
                            type="button"
                            className={`pc-tier${active ? " is-active" : ""}`}
                            onClick={() => setTier(key, tier.id)}
                            aria-pressed={active}
                          >
                            <span className="pc-tier-check" aria-hidden="true"><CheckIcon /></span>
                            <strong>{tier.name}</strong>
                            <span className="pc-tier-blurb">{tier.blurb}</span>
                            <span className="pc-tier-price">{formatBand(band, currency, tier.openTop)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })
            )}
          </div>

          <aside className="pc-total" id="ballpark" aria-label="Your ballpark">
            <div className={`pc-total-inner${flash > 0 ? " pc-flash" : ""}`} key={flash}>
              <div className="pc-total-top">
                <p className="pc-card-label">Your ballpark</p>
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
              <div className="pc-total-ctas">
                {isReferral ? (
                  <p className="pc-total-refer">Continue with the person who shared this page.</p>
                ) : (
                  <a className="pc-primary" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book a 20-minute call</a>
                )}
                <button type="button" className="pc-copy" onClick={copyConfig} disabled={selectedKeys.length === 0}>
                  {copied ? "Copied" : "Copy my configuration"}
                </button>
              </div>
              <p className="pc-total-disclaimer">Ballpark only, not a quote. Final price is confirmed after a short conversation.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="pc-close" id="next-step">
        <div className="pc-shell pc-close-inner">
          <p className="pc-eyebrow">Next step</p>
          <h2>{isReferral ? "Take this ballpark to the person who shared it." : "Turn your ballpark into a real plan."}</h2>
          <p>
            {isReferral
              ? "They already know the tools, the tiers and the ranges. Share your configuration and they will confirm what fits and what it really costs."
              : "Book a short call or send over your configuration. We will confirm what fits, tighten the range and quote the real build."}
          </p>
          <div className="pc-actions pc-actions--center">
            {isReferral ? (
              <span className="pc-secondary">Continue with the person who shared this page</span>
            ) : (
              <a className="pc-primary" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book a 20-minute call</a>
            )}
            <button type="button" className="pc-copy" onClick={copyConfig} disabled={selectedKeys.length === 0}>
              {copied ? "Copied" : "Copy my configuration"}
            </button>
          </div>
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
.pc-page *{box-sizing:border-box}.pc-page :where(h1,h2,h3,p){margin:0}.pc-page button,.pc-page a{font:inherit}.pc-shell{max-width:1180px;margin:auto;padding-inline:24px}.pc-page [id]{scroll-margin-top:86px}
.pc-header{position:sticky;top:0;z-index:50;background:rgba(9,11,18,.9);backdrop-filter:blur(18px);border-bottom:1px solid #242b3a}.pc-header-inner{min-height:66px;display:flex;align-items:center;justify-content:space-between;gap:22px}.pc-brand{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none}.pc-brand span{display:grid;place-items:center;width:34px;height:34px;border-radius:9px;background:#0d111b}.pc-brand img{width:24px;height:24px;object-fit:contain}.pc-brand b{font-size:14px}.pc-header nav{display:flex;gap:22px}.pc-header nav a{color:#a8b0bf;text-decoration:none;font-size:14px}.pc-header nav a:hover{color:#fff}.pc-header-actions{display:flex;align-items:center;gap:14px}.pc-header-call{background:var(--lime);color:#080a0f;text-decoration:none;font-size:12px;font-weight:600;padding:9px 14px;border-radius:999px}
.pc-eyebrow,.pc-card-label{font-size:11px;text-transform:uppercase;letter-spacing:.15em;font-weight:700;color:var(--lime)}.pc-eyebrow b{margin-right:4px}
.pc-hero{position:relative;overflow:hidden;padding:82px 0 58px;background:radial-gradient(circle at 82% 26%,rgba(215,255,0,.14),transparent 26%),linear-gradient(135deg,#0a0b10,#101722)}.pc-grid-glow{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.03) 1px,transparent 1px);background-size:46px 46px;mask-image:linear-gradient(to right,#000 25%,transparent 92%)}.pc-hero-inner{position:relative;max-width:760px}
.pc-hero h1{font-size:clamp(42px,5vw,68px);line-height:.99;letter-spacing:-.055em;margin-top:16px}.pc-hero h1 em{font-style:normal;color:var(--lime)}
.pc-lead{font-size:18px;line-height:1.67;color:var(--muted);max-width:650px;margin-top:24px}
.pc-actions{display:flex;flex-wrap:wrap;gap:18px;align-items:center;margin-top:30px}
.pc-primary{display:inline-flex;align-items:center;gap:8px;background:var(--lime);color:#0a0b10;text-decoration:none;padding:14px 20px;border-radius:999px;font-weight:700;font-size:14px;transition:.2s}.pc-primary:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(215,255,0,.2)}
.pc-secondary{color:#fff;font-size:14px;font-weight:600;border-bottom:1px solid rgba(255,255,255,.45);padding-bottom:3px}
.pc-cur{display:inline-flex;gap:4px;padding:4px;border:1px solid var(--line);border-radius:999px;background:var(--surface)}.pc-cur button{appearance:none;border:0;background:transparent;color:#a8b0bf;font-size:12px;font-weight:700;padding:7px 12px;border-radius:999px;cursor:pointer;transition:.2s}.pc-cur button:hover:not(.is-active){color:#fff}.pc-cur button.is-active{background:var(--lime);color:#080a0f}
.pc-fineprint{font-size:14px;color:#858fa2;margin-top:24px;max-width:640px}
.pc-quick-strip{border-block:1px solid #303d51;background:#101722}.pc-quick-strip .pc-shell{display:grid;grid-template-columns:.8fr 1.4fr;gap:34px;padding-block:22px}.pc-quick-strip strong{color:var(--lime);font-size:16px}.pc-quick-strip span{color:#aab4c6;font-size:14px}
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
.pc-service{padding:26px;border:1px solid var(--line);border-radius:17px;background:var(--surface)}
.pc-service-head{display:flex;justify-content:space-between;align-items:flex-end;gap:18px;flex-wrap:wrap;margin-bottom:18px}
.pc-service-head h3{font-size:26px;letter-spacing:-.03em;margin-top:10px}.pc-service-intro{color:var(--muted);font-size:15px;line-height:1.6;margin-top:8px;max-width:620px}
.pc-seg{display:inline-flex;gap:4px;padding:4px;border:1px solid var(--line);border-radius:999px;background:var(--surface2)}.pc-seg button{appearance:none;border:0;background:transparent;color:#a8b0bf;font-size:12px;font-weight:700;padding:8px 14px;border-radius:999px;cursor:pointer;transition:.2s}.pc-seg button:hover:not(.is-active){color:#fff}.pc-seg button.is-active{background:var(--lime);color:#080a0f}
.pc-tier-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:12px}
.pc-tier{appearance:none;text-align:left;border:1px solid #303d51;background:var(--surface2);color:#fff;padding:18px;border-radius:13px;display:grid;gap:8px;cursor:pointer;transition:.2s;align-content:start}.pc-tier:hover{transform:translateY(-2px);border-color:rgba(215,255,0,.55);box-shadow:0 8px 24px rgba(215,255,0,.12)}.pc-tier.is-active{border-color:rgba(215,255,0,.5);background:linear-gradient(180deg,rgba(215,255,0,.08),rgba(255,255,255,.015))}
.pc-tier-check{display:grid;place-items:center;width:26px;height:26px;border-radius:8px;border:2px solid #46536e;color:transparent;transition:.2s}.pc-tier-check svg{width:12px;height:12px}.pc-tier:not(.is-active):hover .pc-tier-check{border-color:rgba(215,255,0,.75)}.pc-tier.is-active .pc-tier-check{background:var(--lime);border-color:var(--lime);color:#080a0f}
.pc-tier>strong{font-size:17px}.pc-tier-blurb{color:var(--muted);font-size:13px;line-height:1.55}.pc-tier-price{font-size:15px;font-weight:700;color:var(--lime)}.pc-tier.is-active .pc-tier-price{color:var(--lime)}
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
.pc-total-ctas{display:grid;gap:10px;justify-items:stretch}.pc-total-refer{font-size:14px;font-weight:600;color:#e7ecf4;border:1px dashed rgba(215,255,0,.4);border-radius:12px;padding:12px;text-align:center}
.pc-copy{appearance:none;border:1px solid rgba(215,255,0,.45);background:transparent;color:#fff;font-size:13px;font-weight:700;padding:11px 16px;border-radius:999px;cursor:pointer;transition:.2s}.pc-copy:hover:not(:disabled){border-color:var(--lime);box-shadow:0 0 18px rgba(215,255,0,.25)}.pc-copy:disabled{opacity:.35;cursor:default}
.pc-total-disclaimer{font-size:11.5px;color:#858fa2;line-height:1.5}
.pc-flash{animation:pc-flash .75s ease}@keyframes pc-flash{0%{box-shadow:0 0 0 rgba(215,255,0,0);border-color:var(--line)}30%{box-shadow:0 0 36px rgba(215,255,0,.35);border-color:rgba(215,255,0,.7)}100%{box-shadow:0 0 0 rgba(215,255,0,0);border-color:var(--line)}}
.pc-close{padding:104px 0;background:radial-gradient(circle at 50% 0,rgba(215,255,0,.13),transparent 34%),#080a0f}.pc-close-inner{max-width:850px;text-align:center}.pc-close h2{font-size:clamp(31px,4vw,50px);line-height:1.04;letter-spacing:-.045em;margin-top:14px}.pc-close-inner>p:not(.pc-eyebrow){color:var(--muted);font-size:18px;line-height:1.7;max-width:720px;margin:18px auto 0}.pc-actions--center{justify-content:center}
.pc-footer{border-top:1px solid var(--line);color:#858fa0;font-size:11px}.pc-footer .pc-shell{display:flex;justify-content:space-between;gap:20px;padding-block:24px}
@media(min-width:1080px){.pc-build-layout{grid-template-columns:minmax(0,1fr) 360px}}
@media(max-width:980px){.pc-header nav{display:none}.pc-quick-strip .pc-shell{grid-template-columns:1fr;gap:8px}.pc-picker-grid{grid-template-columns:1fr 1fr}}
@media(max-width:720px){.pc-shell{padding-inline:18px}.pc-header-inner{min-height:60px}.pc-brand b{display:none}.pc-header-call{font-size:11px}.pc-hero{padding:54px 0 44px}.pc-hero h1{font-size:40px}.pc-lead{font-size:16px}.pc-section{padding-block:66px}.pc-heading h2,.pc-close h2{font-size:34px}.pc-heading>p:last-child{font-size:16px}.pc-picker-grid{grid-template-columns:1fr}.pc-service{padding:20px}.pc-total-inner{position:static}.pc-actions .pc-cur{width:100%;justify-content:center}}
@media(prefers-reduced-motion:reduce){.pc-flash{animation:none}.pc-primary,.pc-picker,.pc-tier,.pc-copy{transition:none}}
`;
