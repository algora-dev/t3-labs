"use client";

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { QuickQuoteEnquiry } from './QuickQuoteEnquiry';
import type { ReactNode } from 'react';
import type { SupplierProduct } from '../../app/supplier-pricing-tool/types';
import { EXTENSION_BANDS, PITCH_BANDS, SIZE_BANDS } from '../../lib/quick-estimate/config';
import { INITIAL_DRAFT as initial, readQuickDraft, type QuickDraft as Draft } from '../../lib/quick-estimate/draft';
import { createHandoff, HANDOFF_KEY } from '../../lib/quick-estimate/handoff';
import { createQuickResult, type PricingProfile, type QuickResult } from '../../lib/quick-estimate/pricing';
import { PITCHED_SHAPES, ROOF_TEMPLATES } from '../../lib/quick-estimate/templates';
import { parseQuickInput } from '../../lib/quick-estimate/validation';
import type { CoveringId, ExistingMaterial, ExtensionSizeId, FlatComplexity, PitchId, QuickEstimateInput, ShapeId, SizeId } from '../../lib/quick-estimate/types';
import { PitchIllustration, RoofIllustration } from './RoofIllustration';
import { QUICK_DEMO_INPUT } from '../../lib/demo-journey/samples';
import { DEMO_ACTION_EVENT, actionFromEvent, getJourney, recordDemoSignal, updateJourney } from '../../lib/demo-journey/store';

const DRAFT_KEY = 'apex.quick-roof.draft.v1';
let memorySnapshot: string | null = null;
function snapshot() { try { return sessionStorage.getItem(DRAFT_KEY) ?? memorySnapshot; } catch { return memorySnapshot; } }
function subscribe(fn: () => void) { window.addEventListener('quick-roof-draft', fn); window.addEventListener('storage', fn); return () => { window.removeEventListener('quick-roof-draft', fn); window.removeEventListener('storage', fn); }; }
function writeDraft(draft: Draft) { memorySnapshot = JSON.stringify(draft); try { sessionStorage.setItem(DRAFT_KEY, memorySnapshot); } catch { /* In-memory mode still works when storage is disabled. */ } window.dispatchEvent(new Event('quick-roof-draft')); }
const serverSnapshot = () => null;
const sample: QuickEstimateInput = QUICK_DEMO_INPUT;
const coveringLabels: Record<CoveringId, string> = { tile: 'Concrete tiles', slate: 'Natural slate', metal: 'Long-run metal (legacy)', shingle: 'Asphalt shingles', pressed_metal: 'Pressed metal tiles', longrun: 'Long-run metal', epdm: 'Rubber membrane (EPDM)', grp: 'Fibreglass (GRP)', felt: 'Roofing felt' };
const existingLabels: Record<ExistingMaterial, string> = { tile: 'Tiles', slate: 'Slate', metal: 'Metal', membrane: 'Felt or membrane', unknown: 'Not sure' };
const n = (v: number) => v.toLocaleString('en-GB', { maximumFractionDigits: 1 });
const money = (v: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(v);
const range = (lo: number, hi: number) => `${n(lo)}-${n(hi)}`;

function Choice({ name, value, selected, onSelect, children, className = '' }: { name: string; value: string; selected: boolean; onSelect: () => void; children: ReactNode; className?: string }) {
  return <label className={`qr-choice ${selected ? 'is-selected' : ''} ${className}`}>
    <input type="radio" name={name} value={value} checked={selected} onChange={onSelect} />
    <span className="qr-choice-check" aria-hidden="true">{selected ? '✓' : ''}</span>{children}
  </label>;
}
function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return <fieldset className="qr-field"><legend>{label}</legend>{hint && <p className="qr-field-hint">{hint}</p>}{children}</fieldset>;
}

export function QuickRoofEstimate({ catalog, profile }: { catalog: SupplierProduct[]; profile: PricingProfile }) {
  const raw = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const draft = useMemo(() => readQuickDraft(raw), [raw]);
  const { answers: a, demo } = draft;
  const [notice, setNotice] = useState('');
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const flat = a.shape === 'flat';
  const steps = flat ? ['Roof', 'Size', 'Project', 'Covering', 'Result'] : ['Roof', 'Size', 'Pitch', 'Project', 'Covering', 'Result'];
  const step = Math.min(draft.step, steps.length - 1), current = steps[step];
  function update(patch: Partial<QuickEstimateInput>) { writeDraft({ ...draft, answers: { ...a, ...patch } }); setNotice(''); }
  function go(next: number) { writeDraft({ ...draft, step: next }); setNotice(''); }
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, [step]);
  const result = useMemo<QuickResult | null>(() => {
    if (current !== 'Result') return null;
    try { return createQuickResult(parseQuickInput(a), catalog, profile); } catch { return null; }
  }, [a, current, catalog, profile]);
  useEffect(() => {
    if (result?.price.low && result.price.high) recordDemoSignal('quick-result');
  }, [result]);
  useEffect(() => {
    const onDemo = (event: Event) => { if (actionFromEvent(event) === 'quick-example') startExample(); };
    window.addEventListener(DEMO_ACTION_EVENT, onDemo);
    return () => window.removeEventListener(DEMO_ACTION_EVENT, onDemo);
  // startExample reads the latest draft; the effect must be renewed with it.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);
  const canContinue = current === 'Roof' ? !!a.shape
    : current === 'Size' ? !!a.size && !!a.storeys
    : current === 'Pitch' ? !!a.pitch
    : current === 'Project' ? !!a.project && (a.project === 'new_roof' || !!a.existingMaterial)
    : current === 'Covering' ? !!a.covering && (!a.flatExtension || !!a.flatCovering) : false;
  const titles: Record<string, string> = { Roof: 'Which roof looks most like yours?', Size: 'How big is the roof footprint?', Pitch: 'How steep is your roof?', Project: 'What are you planning?', Covering: 'What would you like on your roof?', Result: result?.price.low ? 'Your estimated roof cost' : 'Your roof estimate' };
  const subtitles: Record<string, string> = {
    Roof: 'No need to know its name. Just choose the closest shape.', Size: 'Think of the space the roof covers when viewed from above, not the total floor area across both storeys.',
    Pitch: 'Choose the closest illustration. You do not need an exact angle.', Project: 'A replacement includes removing the old covering. A new roof does not.',
    Covering: 'Choose the main covering. We handle the configured supporting components.', Result: 'A useful starting point for your project. A proper quote requires a professional assessment.',
  };
  function chooseShape(shape: ShapeId) {
    const categoryChanged = (shape === 'flat') !== flat;
    update({ shape, pitch: shape === 'flat' ? null : a.pitch ?? undefined, covering: categoryChanged ? undefined : a.covering, flatExtension: shape === 'flat' ? null : a.flatExtension, flatCovering: shape === 'flat' ? null : a.flatCovering, flatComplexity: shape === 'flat' ? (a.flatComplexity ?? 'typical') : a.flatExtension ? (a.flatComplexity ?? 'typical') : undefined });
  }
  function refine(endpoint: 'low' | 'high') {
    if (!result) return;
    try { sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(createHandoff(result.input, endpoint))); window.location.assign('/supplier-pricing-tool/apex-roofing?from=quick-roof'); }
    catch { setNotice('Browser storage is unavailable. Download the measurements below, then open the detailed estimator from the navigation.'); }
  }
  function download() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'apex-quick-roof-estimate.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function startExample() {
    if ((draft.step > 0 || JSON.stringify(a) !== JSON.stringify(initial.answers)) && !window.confirm('Load the example roof? This replaces your current quick-estimate selections in this tab.')) {
      updateJourney({ type: 'cancel' }); return;
    }
    writeDraft({ step: 0, answers: { ...sample }, demo: !getJourney().active });
  }

  return <div className="qr-app">
    <header className="qr-site-header"><div className="qr-shell qr-header-inner">
      <Link className="qr-brand" href="/demo/roofing-site" aria-label="Apex Roofing home"><svg viewBox="0 0 38 36" aria-hidden="true"><path d="M3 20L19 5L35 20M9 19V31H29V19" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" /></svg><span>Apex<span> Roofing</span></span></Link>
      <nav aria-label="Roof tools"><Link href="/demo/roofing-site">Home</Link><Link href="/supplier-pricing-tool/apex-roofing">Detailed estimator</Link><Link href="/demo/roofing-site/price-list">Our products</Link></nav>
      <span className="qr-header-badge">QUICK ROOF ESTIMATE</span>
    </div></header>
    <main className="qr-shell qr-main">
      <div className="qr-intro-bar"><p><Link href="/demo/roofing-site">Apex Roofing</Link><span>/</span>Roof tools<span>/</span>Quick estimate</p><button type="button" className="qr-text-button" onClick={() => writeDraft({ ...draft, demo: !demo })}>{demo ? 'Hide business demo' : 'Trying this for your business?'}</button></div>
      {demo && <section className="qr-demo-note" aria-label="Business demo guide"><div><span className="qr-eyebrow">SEE IT THROUGH YOUR CUSTOMER’S EYES</span><h2>How would they get this answer on your website today?</h2><p>{current === 'Result' ? 'They have explored the roof and its costs without a call or an email. Try a more complex shape and see how the required components change.' : 'Try a small gable roof, typical pitch and concrete tiles. Then change the roof shape to see why a job is more than a price per tile.'}</p></div><button className="qr-button qr-button-small" type="button" onClick={startExample}>Load example <span aria-hidden="true">↗</span></button></section>}
      <ol className="qr-progress" aria-label="Estimate progress">{steps.map((label, i) => <li key={label} className={i === step ? 'is-current' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}><button type="button" disabled={i > step} onClick={() => go(i)}><span>{i < step ? '✓' : String(i + 1).padStart(2, '0')}</span><b>{label}</b></button></li>)}</ol>
      <div className={`qr-workspace ${current === 'Result' ? 'qr-is-result' : ''}`}>
        <section className="qr-panel">
          <div className="qr-panel-heading"><p className="qr-eyebrow">{current === 'Result' ? 'YOUR INDICATIVE ESTIMATE' : `STEP ${step + 1} OF ${steps.length - 1}`}</p><h1 ref={heading} tabIndex={-1}>{titles[current]}</h1><p>{subtitles[current]}</p></div>
          {current === 'Roof' && <>
            <Field label="Roof category"><div className="qr-segmented"><Choice name="category" value="pitched" selected={!flat} onSelect={() => chooseShape('gable')}><b>Pitched roof</b><small>Tiles, slate or metal</small></Choice><Choice name="category" value="flat" selected={flat} onSelect={() => chooseShape('flat')}><b>Flat membrane roof</b><small>Felt, rubber or fibreglass</small></Choice></div></Field>
            {flat ? <div className="qr-flat-intro"><RoofIllustration shape="flat" /><div><h2>Nearly level, with a waterproof covering.</h2><p>This follows a separate membrane-roof calculation. We will not apply pitched-roof ridge, hip or valley components.</p><p className="qr-muted">A single-slope tiled or metal roof? Choose Pitched roof, then Single slope.</p></div></div>
              : <Field label="Choose the closest roof shape"><div className="qr-roof-grid">{PITCHED_SHAPES.map(t => <Choice key={t.id} name="shape" value={t.id} selected={a.shape === t.id} onSelect={() => chooseShape(t.id)} className="qr-roof-card"><RoofIllustration shape={t.id} /><b>{t.label}</b><small>{t.description}</small></Choice>)}</div></Field>}
            <div className="qr-help-line"><span aria-hidden="true">ⓘ</span><p>Your roof does not have to match exactly. These are reference shapes, not measured plans. You can add a flat extension on the next step.</p></div>
          </>}
          {current === 'Size' && <>
            <Field label="Choose an approximate footprint"><div className="qr-size-grid">{Object.entries(SIZE_BANDS).map(([id, b], i) => <Choice key={id} name="size" value={id} selected={a.size === id} onSelect={() => update({ size: id as SizeId })} className="qr-size-card"><span className="qr-size-icon" style={{ width: 32 + i * 7, height: 26 + i * 4 }} aria-hidden="true" /><b>{b.label}</b><small>{b.min}-{b.max} m²</small></Choice>)}</div></Field>
            <p className="qr-info">Select the closest band. These are roof footprints, including overhangs. A two-storey home does not automatically have a larger roof.</p>
            <Field label="How many storeys?"><div className="qr-two-grid">{([1, 2] as const).map(v => <Choice key={v} name="storeys" value={String(v)} selected={a.storeys === v} onSelect={() => update({ storeys: v })}><b>{v === 1 ? 'Single storey' : 'Two storeys'}</b><small>{v === 1 ? 'Ground floor only' : 'Ground floor and upstairs'}</small></Choice>)}</div></Field>
            {!flat && <Field label="Also replacing a flat-roof extension?" hint="Only include the extra flat section, not any part of the main footprint above."><div className="qr-two-grid"><Choice name="extension" value="no" selected={!a.flatExtension} onSelect={() => update({ flatExtension: null, flatCovering: null, flatComplexity: undefined })}><b>No flat section</b></Choice><Choice name="extension" value="yes" selected={!!a.flatExtension} onSelect={() => update({ flatExtension: 'small', flatCovering: undefined, flatComplexity: a.flatComplexity ?? 'typical' })}><b>Yes, add a flat section</b></Choice></div>{a.flatExtension && <div className="qr-three-grid qr-gap-top">{Object.entries(EXTENSION_BANDS).map(([id, b]) => <Choice key={id} name="extension-size" value={id} selected={a.flatExtension === id} onSelect={() => update({ flatExtension: id as ExtensionSizeId })}><b>{b.label}</b><small>{b.min}-{b.max} m² extra</small></Choice>)}</div>}</Field>}
          </>}
          {current === 'Size' && (flat || !!a.flatExtension) && <Field label="How complicated does the flat-roof section look?" hint="Choose what looks closest. This adjusts the indicative price range, not the measured area."><div className="qr-three-grid">{([['simple', 'Simple', 'Mostly rectangular, few obstacles'], ['typical', 'Typical', 'Some corners or roof features'], ['complex', 'Complex', 'Several corners, levels or obstacles']] as const).map(([id, label, description]) => <Choice key={id} name="flat-complexity" value={id} selected={(a.flatComplexity ?? 'typical') === id} onSelect={() => update({ flatComplexity: id as FlatComplexity })}><b>{label}</b><small>{description}</small></Choice>)}</div></Field>}
          {current === 'Pitch' && <>
            <Field label="Choose the closest slope"><div className="qr-three-grid">{Object.entries(PITCH_BANDS).map(([id, b]) => <Choice key={id} name="pitch" value={id} selected={a.pitch === id} onSelect={() => update({ pitch: id as PitchId })} className="qr-pitch-card"><PitchIllustration degrees={(b.min + b.max) / 2} /><b>{b.label}</b><small>{b.description}</small><span className="qr-tag">{b.min}-{b.max}°</span></Choice>)}</div></Field>
            <p className="qr-info">Steeper roofs have more surface area over the same footprint. We calculate that geometrically, rather than adding a price percentage.</p>
            <p className="qr-muted">Some coverings need a minimum pitch. We will flag this before showing a price. Do not climb onto your roof to check.</p>
          </>}
          {current === 'Project' && <>
            <Field label="Your project"><div className="qr-two-grid"><Choice name="project" value="reroof" selected={a.project === 'reroof'} onSelect={() => update({ project: 'reroof', existingMaterial: a.existingMaterial ?? 'unknown' })}><b>Replace an existing roof</b><small>Remove the old covering and fit a new one</small></Choice><Choice name="project" value="new_roof" selected={a.project === 'new_roof'} onSelect={() => update({ project: 'new_roof', existingMaterial: null })}><b>A new roof</b><small>No old covering to remove</small></Choice></div></Field>
            {a.project === 'reroof' && <Field label="What is on the roof now?"><div className="qr-material-grid">{Object.entries(existingLabels).map(([id, label]) => <Choice key={id} name="existing" value={id} selected={a.existingMaterial === id} onSelect={() => update({ existingMaterial: id as ExistingMaterial })}><b>{label}</b></Choice>)}</div><p className="qr-muted">Apex currently uses one generic removal allowance. Material-specific removal rates can be configured by each business. Suspected asbestos or other hazardous materials need specialist assessment.</p></Field>}
          </>}
          {current === 'Covering' && <>
            <Field label={flat ? 'Your flat-roof covering' : 'Your new roof covering'}><div className="qr-three-grid">{(flat ? ['epdm', 'grp', 'felt'] as const : ['tile', 'slate', 'shingle', 'pressed_metal', 'longrun'] as const).map(id => <Choice key={id} name="covering" value={id} selected={a.covering === id} onSelect={() => update({ covering: id })} className="qr-material-card"><span className={`qr-material-swatch qr-swatch-${id}`} aria-hidden="true" /><b>{coveringLabels[id]}</b><small>{profile.systems[id] ? 'Uses Apex’s configured products' : 'Measurements available; rates not loaded'}</small></Choice>)}</div></Field>
            {a.flatExtension && <Field label="Covering for the flat extension"><div className="qr-three-grid">{(['epdm', 'grp', 'felt'] as const).map(id => <Choice key={id} name="flat-covering" value={id} selected={a.flatCovering === id} onSelect={() => update({ flatCovering: id })}><b>{coveringLabels[id]}</b><small>Uses Apex demo product rates</small></Choice>)}</div></Field>}
            <div className="qr-help-line"><span aria-hidden="true">ⓘ</span><p>No contact details are needed. Seven Apex demo covering systems are configured with indicative UK rates. This is not a formal quotation.</p></div>
          </>}
          {current === 'Result' && (result ? <Results result={result} onRefine={refine} onDownload={download} onEdit={() => go(0)} onEnquire={() => setEnquiryOpen(true)} /> : <div role="alert" className="qr-info">Some selections are missing or invalid. <button type="button" onClick={() => go(0)}>Review your roof</button></div>)}
          {notice && <p role="alert" className="qr-info">{notice}</p>}
          {current === 'Result' && result && enquiryOpen && <QuickQuoteEnquiry result={result} onClose={() => setEnquiryOpen(false)} />}
      {current !== 'Result' && <div className="qr-panel-actions"><button className="qr-text-button" type="button" onClick={() => go(Math.max(0, step - 1))} disabled={step === 0}>← Back</button><span>No measurements. No sign-up.</span><button className="qr-button" type="button" disabled={!canContinue} onClick={() => go(step + 1)}>{current === 'Covering' ? 'See my estimate' : 'Continue'} <span aria-hidden="true">→</span></button></div>}
        </section>
        <aside className="qr-sidebar" aria-label="Your selections">
          <div className="qr-summary"><p className="qr-eyebrow">YOUR ROOF AT A GLANCE</p><RoofIllustration shape={a.shape ?? 'gable'} pitch={a.pitch ? (PITCH_BANDS[a.pitch].min + PITCH_BANDS[a.pitch].max) / 2 : 30} /><h2>{a.shape ? ROOF_TEMPLATES[a.shape].label : 'Let’s start with the shape'}</h2><p className="qr-muted">{a.shape ? 'Representative illustration, not a survey.' : 'Choose the image that feels closest.'}</p><dl><div><dt>Footprint</dt><dd>{a.size ? `${SIZE_BANDS[a.size].min}-${SIZE_BANDS[a.size].max} m²` : 'Not selected'}</dd></div><div><dt>Storeys</dt><dd>{a.storeys === 2 ? 'Two storeys' : 'Single storey'}</dd></div><div><dt>Pitch</dt><dd>{flat ? 'Flat membrane' : a.pitch ? `${PITCH_BANDS[a.pitch].min}-${PITCH_BANDS[a.pitch].max}°` : 'Not selected'}</dd></div><div><dt>Project</dt><dd>{a.project === 'new_roof' ? 'New roof' : 'Replacement'}</dd></div><div><dt>Covering</dt><dd>{a.covering ? coveringLabels[a.covering] : 'Not selected'}</dd></div>{(flat || a.flatExtension) && <div><dt>Flat complexity</dt><dd>{a.flatComplexity ?? 'Typical'}</dd></div>}{a.flatExtension && <div><dt>Flat extension</dt><dd>{EXTENSION_BANDS[a.flatExtension].min}-{EXTENSION_BANDS[a.flatExtension].max} m² extra</dd></div>}</dl></div>
          <div className="qr-sidebar-note"><span className="qr-mini-icon" aria-hidden="true">↗</span><h3>Know your measurements?</h3><p>Use the detailed estimator to build your own roof quantities and choose individual products.</p><Link href="/supplier-pricing-tool/apex-roofing">Open detailed estimator →</Link></div>
          <p className="qr-config-note">Built around your business.<br />This is one example. The branding, questions, roof types, product catalogue and pricing rules can all be tailored.</p>
        </aside>
      </div>
      <footer className="qr-footer"><p><b>Apex Roofing</b> · A fictional business demonstration by T3 Labs.</p><button type="button" className="qr-text-button" onClick={() => { writeDraft(initial); setNotice(''); }}>Start a new estimate</button></footer>
    </main>
  </div>;
}

function Results({ result: r, onRefine, onDownload, onEdit, onEnquire }: { result: QuickResult; onRefine: (endpoint: 'low' | 'high') => void; onDownload: () => void; onEdit: () => void; onEnquire: () => void }) {
  const { price: p, measurements: m, input } = r;
  const labels = [
    ['Roof style', ROOF_TEMPLATES[input.shape].label],
    ['Approximate footprint', SIZE_BANDS[input.size]?.label ?? input.size],
    ['Roof pitch', input.shape === 'flat' ? 'Flat roof' : (input.pitch ? PITCH_BANDS[input.pitch]?.label : undefined) ?? String(input.pitch)],
    ['Property height', `${input.storeys} storey${input.storeys === 1 ? '' : 's'}`],
    ['Project', input.project === 'reroof' ? 'Replace existing roof' : 'New roof'],
    ['Preferred covering', coveringLabels[input.covering]],
    ...(input.flatExtension ? [['Flat-roof extension', `${input.flatExtension} · ${coveringLabels[input.flatCovering!]}`]] : []),
  ];
  return <div className="qr-results qr-simple-results">
    <div className="qr-price-card"><p className="qr-eyebrow">YOUR BALLPARK ESTIMATE</p>
      {p.low && p.high ? <><div className="qr-price-value">{money(Math.floor(p.low.total / 100) * 100)}<span> to </span>{money(Math.ceil(p.high.total / 100) * 100)}</div><p>Estimated materials, fitting and applicable basic access/removal allowances, based on your choices. VAT treatment: {p.taxNote}</p></>
        : <><h2>{p.status === 'incompatible' ? 'This covering needs a different roof pitch.' : 'We need to check your roof before pricing it.'}</h2><p>We have your choices and can include them in a quote request. We won’t invent a price.</p></>}
    </div>
    <section className="qr-home-summary"><h2>Your roof at a glance</h2><dl>{labels.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
    <section className="qr-home-explainer"><h2>What does this cover?</h2><p>Typical roof covering, supporting materials and fixings, installation labour, and basic access and removal allowances where configured. It is an approximate starting point, not a measured quotation.</p><p className="qr-muted">Apex Roofing is a fictional business and uses illustrative UK demo rates.</p></section>
    <section className="qr-home-disclaimer"><strong>Important: this is not a formal quote.</strong><p>The actual price may be higher or lower. Roof condition, exact dimensions, access, structural repairs, insulation, drainage, VAT and site-specific work may change the cost. A professional assessment is needed for a reliable quotation.</p></section>
    <div className="qr-next-step"><span className="qr-eyebrow">READY TO TAKE THE NEXT STEP?</span><h2>Get a more accurate quote.</h2><p>We’ll carry your roof choices and estimate into a short enquiry, so you won’t need to start again.</p><button className="qr-button" type="button" onClick={onEnquire}>Request a proper quote →</button><p className="qr-muted">Demo only: the enquiry is previewed, never emailed or saved.</p></div>
    <details className="qr-details"><summary>Technical details (optional)</summary><p className="qr-muted">For anyone who wants to inspect the estimated quantities, the lower and upper roof surface areas are {range(m.low.totals.roofAreaM2, m.high.totals.roofAreaM2)} m².</p><p className="qr-muted">{p.missing.length ? `Site-specific or unpriced items: ${p.missing.join('; ')}.` : 'No additional catalogue items flagged.'}</p><button className="qr-text-button" type="button" onClick={() => onRefine('high')}>Open detailed estimator →</button></details>
    <div className="qr-result-actions"><button className="qr-text-button" type="button" onClick={onEdit}>← Change my roof</button><button className="qr-text-button" type="button" onClick={onDownload}>Download full estimate data</button><button className="qr-text-button" type="button" onClick={() => window.print()}>Print summary</button></div>
  </div>;
}
