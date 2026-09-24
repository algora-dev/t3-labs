"use client";

import { useEffect, useMemo, useState } from "react";
import {
  INTERNAL_PRICING,
  INTERNAL_PRICING_VERSION,
  calculateInternalPrice,
  createDefaultPricingSelection,
  type PriceOption,
  type PricingSelection,
} from "../../../lib/internal-pricing";
import { buildEstimatePdf } from "./summary-pdf";

type SavedSummary = {
  id: string;
  name: string;
  setup: number;
  monthly: number;
  features: string[];
  savedAt: string;
};

const STORAGE_KEY = "t3-internal-pricing-summaries-v1";

function usd(value: number) {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function getOption(options: readonly PriceOption[], id: string) {
  return options.find((option) => option.id === id) ?? options[0];
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly PriceOption[];
  onChange: (value: string) => void;
}) {
  const selected = getOption(options, value);
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-white">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-[var(--t3-radius-control)] border border-[var(--t3-slate-border)] bg-[var(--t3-slate-800)] px-3.5 text-sm text-white outline-none transition focus:border-[var(--t3-lime)]"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="text-xs leading-5 text-[var(--t3-dark-muted)]">
        {selected.description}
        {(selected.setup || selected.monthly) ? (
          <b className="ml-1 font-semibold text-[#dbe3ef]">
            {selected.setup ? `+${usd(selected.setup)} setup` : ""}
            {selected.setup && selected.monthly ? " · " : ""}
            {selected.monthly ? `+${usd(selected.monthly)}/mo` : ""}
          </b>
        ) : null}
      </span>
    </label>
  );
}

function CoreToggle({
  active,
  title,
  description,
  setup,
  monthly,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  setup: number;
  monthly: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`pricing-option rounded-[var(--t3-radius-card)] border p-4 text-left transition ${
        active
          ? "border-[var(--t3-lime)] bg-[rgba(215,255,0,.08)]"
          : "border-[var(--t3-slate-border)] bg-[var(--t3-slate-800)]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <strong className="block text-base text-white">{title}</strong>
          <span className="mt-1 block text-xs leading-5 text-[var(--t3-dark-muted)]">{description}</span>
        </div>
        <span
          aria-hidden="true"
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs font-bold ${
            active
              ? "border-[var(--t3-lime)] bg-[var(--t3-lime)] text-[var(--t3-black)]"
              : "border-[var(--t3-slate-border)] text-transparent"
          }`}
        >
          ✓
        </span>
      </div>
      <span className="mt-3 block text-xs font-semibold text-[var(--t3-lime)]">
        {usd(setup)} setup{monthly ? ` · +${usd(monthly)}/mo` : ""}
      </span>
    </button>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--t3-radius-feature)] border border-[var(--t3-slate-border)] bg-[var(--t3-slate-900)] p-5 sm:p-6">
      <p className="text-[var(--t3-type-meta)] font-bold uppercase tracking-[.14em] text-[var(--t3-lime)]">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold tracking-[-.02em] text-white">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function PricingConfigurator() {
  const [selection, setSelection] = useState<PricingSelection>(() => createDefaultPricingSelection());
  const [saved, setSaved] = useState<SavedSummary[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      // Browser-only convenience. Pricing works without local storage.
    }
  }, []);

  const estimate = useMemo(() => calculateInternalPrice(selection), [selection]);
  const setField = <K extends keyof PricingSelection>(key: K, value: PricingSelection[K]) =>
    setSelection((current) => ({ ...current, [key]: value }));

  const toggleCore = (key: keyof PricingSelection["core"]) => {
    setSelection((current) => {
      const next = { ...current.core, [key]: !current.core[key] };
      if (key === "takeoff" && next.takeoff) next.measurement = true;
      if (key === "measurement" && !next.measurement) next.takeoff = false;
      return { ...current, core: next };
    });
  };

  const downloadPdf = () => {
    try {
      const bytes = buildEstimatePdf({
        name: selection.estimateName.trim() || "Untitled estimate",
        generatedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
        features: estimate.mainFeatures,
        lines: estimate.lines,
        setup: estimate.setup,
        monthly: estimate.monthly,
        notes: estimate.notes,
        version: INTERNAL_PRICING_VERSION,
      });
      const slug =
        selection.estimateName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 40) || "estimate";
      const date = new Date().toISOString().slice(0, 10);
      const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = `T3-ballpark-${slug}-${date}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch {
      // PDF download is best-effort; the local browser entry still saves.
    }
  };

  const saveSummary = () => {
    if (!estimate.mainFeatures.length) return;
    downloadPdf();
    const next: SavedSummary = {
      id: crypto.randomUUID(),
      name: selection.estimateName.trim() || "Untitled estimate",
      setup: estimate.setup,
      monthly: estimate.monthly,
      features: estimate.mainFeatures,
      savedAt: new Date().toISOString(),
    };
    const updated = [next, ...saved].slice(0, 10);
    setSaved(updated);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors.
    }
  };

  const copySummary = async () => {
    const lines = [
      `${selection.estimateName.trim() || "T3 Labs estimate"}`,
      `Setup: ${usd(estimate.setup)}`,
      `Monthly: ${usd(estimate.monthly)}/mo`,
      estimate.mainFeatures.length ? `Main scope: ${estimate.mainFeatures.join(", ")}` : "Main scope: not selected",
      selection.core.assistant ? "Variable AI/model usage: additional" : "",
      selection.internalNotes.trim() ? `Notes: ${selection.internalNotes.trim()}` : "",
    ].filter(Boolean);
    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const reset = () => setSelection(createDefaultPricingSelection());

  return (
    <div className="min-h-screen bg-[var(--t3-black)] text-white">
      <style>{`
        .pricing-option:hover { transform: translateY(-2px); border-color: rgba(215,255,0,.7); box-shadow: var(--t3-glow); }
        .pricing-soft:hover { border-color: rgba(215,255,0,.55); box-shadow: 0 0 22px rgba(215,255,0,.10); }
      `}</style>

      <header className="sticky top-0 z-30 border-b border-[var(--t3-slate-border)] bg-[rgba(10,11,16,.92)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1180px] items-center justify-between gap-4 px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/assets/t3-labs-white.png" alt="T3 Labs" className="h-auto w-20" />
            <span className="hidden text-xs font-semibold uppercase tracking-[.12em] text-[var(--t3-dark-muted)] sm:inline">Internal pricing</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold">
            <a href="/dashboard" className="rounded-full border border-[var(--t3-slate-border)] px-3 py-2 text-[var(--t3-dark-muted)] transition hover:border-[var(--t3-lime)] hover:text-white">Analytics</a>
            <form action="/api/dashboard/logout" method="post">
              <button type="submit" className="text-[var(--t3-dark-muted)] transition hover:text-[var(--t3-lime)]">Log out</button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1180px] px-5 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--t3-lime)]">T3 Labs internal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Pricing configurator</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--t3-dark-muted)] sm:text-base">
            Build a quick internal ballpark from the project scope. Prices are USD and are designed to be adjusted as we test real and fictitious jobs.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid gap-5">
            <Section eyebrow="Estimate" title="Name the job">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold">Estimate / customer name</span>
                  <input
                    value={selection.estimateName}
                    onChange={(event) => setField("estimateName", event.target.value)}
                    placeholder="e.g. Apex Supplier portal"
                    className="min-h-11 rounded-[var(--t3-radius-control)] border border-[var(--t3-slate-border)] bg-[var(--t3-slate-800)] px-3.5 text-sm text-white outline-none placeholder:text-[#697487] focus:border-[var(--t3-lime)]"
                  />
                </label>
              </div>
            </Section>

            <Section eyebrow="01 / Core tools" title="What are we building?">
              <div className="grid gap-3 md:grid-cols-3">
                <CoreToggle active={selection.core.measurement} title={INTERNAL_PRICING.core.measurement.label} description={INTERNAL_PRICING.core.measurement.description} setup={INTERNAL_PRICING.core.measurement.setup} monthly={INTERNAL_PRICING.core.measurement.monthly} onClick={() => toggleCore("measurement")} />
                <CoreToggle active={selection.core.takeoff} title={INTERNAL_PRICING.core.takeoff.label} description={INTERNAL_PRICING.core.takeoff.description} setup={INTERNAL_PRICING.core.takeoff.setup} monthly={INTERNAL_PRICING.core.takeoff.monthly} onClick={() => toggleCore("takeoff")} />
                <CoreToggle active={selection.core.assistant} title={INTERNAL_PRICING.core.assistant.label} description={INTERNAL_PRICING.core.assistant.description} setup={INTERNAL_PRICING.core.assistant.setup} monthly={INTERNAL_PRICING.core.assistant.monthly} onClick={() => toggleCore("assistant")} />
              </div>
              <p className="mt-3 text-xs leading-5 text-[var(--t3-dark-muted)]">Digital takeoff automatically includes Measurement-to-price because its measurements flow into that pricing workflow.</p>
            </Section>

            <Section eyebrow="02 / Products + pricing" title="How much information and logic sits behind it?">
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label="Catalogue size" value={selection.catalogueSize} options={INTERNAL_PRICING.catalogueSize} onChange={(value) => setField("catalogueSize", value)} />
                <SelectField label="Data readiness" value={selection.dataReadiness} options={INTERNAL_PRICING.dataReadiness} onChange={(value) => setField("dataReadiness", value)} />
                <div className="sm:col-span-2">
                  <SelectField label="Pricing / calculation complexity" value={selection.pricingLogic} options={INTERNAL_PRICING.pricingLogic} onChange={(value) => setField("pricingLogic", value)} />
                </div>
              </div>
            </Section>

            {selection.core.takeoff ? (
              <Section eyebrow="03 / Digital takeoff" title="How specialised is the measurement workflow?">
                <SelectField label="Takeoff complexity" value={selection.takeoffComplexity} options={INTERNAL_PRICING.takeoffComplexity} onChange={(value) => setField("takeoffComplexity", value)} />
              </Section>
            ) : null}

            {selection.core.assistant ? (
              <Section eyebrow="04 / Smart Assistant" title="How capable does the assistant need to be?">
                <SelectField label="Assistant scope" value={selection.assistantScope} options={INTERNAL_PRICING.assistantScope} onChange={(value) => setField("assistantScope", value)} />
                <p className="mt-4 rounded-[var(--t3-radius-card)] border border-[rgba(215,255,0,.22)] bg-[rgba(215,255,0,.05)] p-4 text-xs leading-5 text-[var(--t3-dark-muted)]">
                  Fixed monthly pricing covers the platform/support allowance. Actual AI/model usage remains variable and is not included in the fixed monthly figure.
                </p>
              </Section>
            ) : null}

            <Section eyebrow="05 / Access + controls" title="Who needs access and how much control do they need?">
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label="Trade / customer access" value={selection.tradeAccess} options={INTERNAL_PRICING.tradeAccess} onChange={(value) => setField("tradeAccess", value)} />
                <SelectField label="Admin / internal workspace" value={selection.adminLevel} options={INTERNAL_PRICING.adminLevel} onChange={(value) => setField("adminLevel", value)} />
                <div className="sm:col-span-2">
                  <SelectField label="Analytics / tracking" value={selection.analyticsLevel} options={INTERNAL_PRICING.analyticsLevel} onChange={(value) => setField("analyticsLevel", value)} />
                </div>
              </div>
            </Section>

            <Section eyebrow="06 / Output + connections" title="What needs to happen after the result?">
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label="Outputs" value={selection.outputLevel} options={INTERNAL_PRICING.outputLevel} onChange={(value) => setField("outputLevel", value)} />
                <SelectField label="Integrations" value={selection.integrationLevel} options={INTERNAL_PRICING.integrationLevel} onChange={(value) => setField("integrationLevel", value)} />
              </div>
            </Section>

            <Section eyebrow="07 / Bespoke work" title="How far are we moving away from the standard framework?">
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label="UI / UX customisation" value={selection.customisationLevel} options={INTERNAL_PRICING.customisationLevel} onChange={(value) => setField("customisationLevel", value)} />
                <SelectField label="Additional custom development" value={selection.customDevelopment} options={INTERNAL_PRICING.customDevelopment} onChange={(value) => setField("customDevelopment", value)} />
              </div>
            </Section>

            <Section eyebrow="08 / Ongoing" title="How much ongoing involvement should we allow for?">
              <SelectField label="Support level" value={selection.supportLevel} options={INTERNAL_PRICING.supportLevel} onChange={(value) => setField("supportLevel", value)} />
            </Section>

            <Section eyebrow="09 / Internal adjustment" title="Override the ballpark if the job needs it">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Setup adjustment (USD)</span>
                  <input type="number" step="50" value={selection.manualSetupAdjustment} onChange={(event) => setField("manualSetupAdjustment", Number(event.target.value))} className="min-h-11 rounded-[var(--t3-radius-control)] border border-[var(--t3-slate-border)] bg-[var(--t3-slate-800)] px-3.5 text-sm text-white outline-none focus:border-[var(--t3-lime)]" />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Monthly adjustment (USD)</span>
                  <input type="number" step="10" value={selection.manualMonthlyAdjustment} onChange={(event) => setField("manualMonthlyAdjustment", Number(event.target.value))} className="min-h-11 rounded-[var(--t3-radius-control)] border border-[var(--t3-slate-border)] bg-[var(--t3-slate-800)] px-3.5 text-sm text-white outline-none focus:border-[var(--t3-lime)]" />
                </label>
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold">Internal notes</span>
                  <textarea value={selection.internalNotes} onChange={(event) => setField("internalNotes", event.target.value)} rows={3} placeholder="Anything unusual about this scope..." className="rounded-[var(--t3-radius-control)] border border-[var(--t3-slate-border)] bg-[var(--t3-slate-800)] px-3.5 py-3 text-sm text-white outline-none placeholder:text-[#697487] focus:border-[var(--t3-lime)]" />
                </label>
              </div>
            </Section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-[var(--t3-radius-container)] border border-[var(--t3-slate-border)] bg-[var(--t3-slate-900)] p-5 shadow-2xl shadow-black/25 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[.15em] text-[var(--t3-lime)]">Current ballpark</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[var(--t3-radius-card)] bg-[var(--t3-slate-800)] p-4">
                  <span className="text-xs text-[var(--t3-dark-muted)]">Setup</span>
                  <strong className="mt-1 block text-2xl tracking-[-.03em]">{usd(estimate.setup)}</strong>
                </div>
                <div className="rounded-[var(--t3-radius-card)] bg-[var(--t3-slate-800)] p-4">
                  <span className="text-xs text-[var(--t3-dark-muted)]">Monthly</span>
                  <strong className="mt-1 block text-2xl tracking-[-.03em]">{usd(estimate.monthly)}</strong>
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-[var(--t3-dark-muted)]">USD. Monthly excludes variable AI/model usage where applicable.</p>

              <div className="mt-5 border-t border-[var(--t3-slate-border)] pt-5">
                <span className="text-xs font-semibold uppercase tracking-[.12em] text-[var(--t3-dark-muted)]">Main scope</span>
                {estimate.mainFeatures.length ? (
                  <ul className="mt-3 grid gap-2 text-sm text-[#dbe3ef]">
                    {estimate.mainFeatures.map((feature) => <li key={feature} className="flex gap-2"><span className="text-[var(--t3-lime)]">✓</span>{feature}</li>)}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-[var(--t3-dark-muted)]">Select a tool or custom requirement.</p>
                )}
              </div>

              {estimate.lines.length ? (
                <details className="mt-5 border-t border-[var(--t3-slate-border)] pt-5">
                  <summary className="cursor-pointer text-sm font-semibold text-white">Show price breakdown</summary>
                  <div className="mt-3 grid gap-2">
                    {estimate.lines.map((line, index) => (
                      <div key={`${line.group}-${line.label}-${index}`} className="flex items-start justify-between gap-4 text-xs">
                        <div><b className="block text-[#dbe3ef]">{line.label}</b><span className="text-[var(--t3-dark-muted)]">{line.group}</span></div>
                        <div className="text-right text-[var(--t3-dark-muted)]">
                          {line.setup ? <span className="block">{line.setup > 0 ? "+" : ""}{usd(line.setup)}</span> : null}
                          {line.monthly ? <span className="block">{line.monthly > 0 ? "+" : ""}{usd(line.monthly)}/mo</span> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}

              <div className="mt-6 grid gap-2">
                <button type="button" onClick={saveSummary} disabled={!estimate.mainFeatures.length} className="min-h-11 rounded-full bg-[var(--t3-lime)] px-5 text-sm font-semibold text-[var(--t3-black)] transition hover:-translate-y-0.5 hover:shadow-[var(--t3-glow)] disabled:cursor-not-allowed disabled:opacity-40">Save PDF</button>
                <button type="button" onClick={copySummary} className="min-h-11 rounded-full border border-[var(--t3-slate-border)] px-5 text-sm font-semibold text-white transition hover:border-[var(--t3-lime)]">{copied ? "Copied" : "Copy summary"}</button>
                <button type="button" onClick={reset} className="py-2 text-xs font-semibold text-[var(--t3-dark-muted)] transition hover:text-white">Reset estimate</button>
              </div>

              <p className="mt-4 text-[10px] leading-4 text-[#697487]">Pricing model {INTERNAL_PRICING_VERSION}. Internal use only.</p>
            </div>

            {saved.length ? (
              <div className="mt-4 rounded-[var(--t3-radius-feature)] border border-[var(--t3-slate-border)] bg-[var(--t3-slate-900)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong className="text-sm">Recent estimates</strong>
                  <button type="button" onClick={() => { setSaved([]); window.localStorage.removeItem(STORAGE_KEY); }} className="text-[10px] font-semibold uppercase tracking-wide text-[var(--t3-dark-muted)] hover:text-white">Clear</button>
                </div>
                <p className="mt-1 text-[10px] text-[#697487]">Saved on this browser only.</p>
                <div className="mt-3 grid gap-2">
                  {saved.slice(0, 5).map((item) => (
                    <article key={item.id} className="pricing-soft rounded-[var(--t3-radius-card)] border border-[var(--t3-slate-border)] bg-[var(--t3-slate-800)] p-3 transition">
                      <strong className="block truncate text-xs">{item.name}</strong>
                      <span className="mt-1 block text-[11px] text-[var(--t3-dark-muted)]">{usd(item.setup)} setup · {usd(item.monthly)}/mo</span>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </main>
    </div>
  );
}
