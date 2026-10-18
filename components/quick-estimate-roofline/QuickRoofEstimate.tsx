"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { RooflineToolHeader } from '../demo-helper/RooflineToolHeader';
import { HELPER_COMMAND_EVENT, takeHelperCommand, recordHelperSignal, getHelper, updateHelper } from '../../lib/demo-helper/store';
import { useDemoHelper } from '../demo-helper/useDemoHelper';
import { QuickQuoteEnquiry } from './QuickQuoteEnquiry';
import { trackDemo } from '../../lib/demo-conversion/metrics';
import { updateConversion } from '../../lib/demo-conversion/store';
import type { ReactNode } from 'react';
import type { SupplierProduct } from '../../app/supplier-pricing-tool/types';
import { PITCH_BANDS, SIZE_BANDS } from '../../lib/quick-estimate/config';
import { INITIAL_DRAFT as initial, readQuickDraft, type QuickDraft as Draft } from '../../lib/quick-estimate/draft';
import { createHandoff, HANDOFF_KEY } from '../../lib/quick-estimate/handoff';
import { createQuickResult, type PricingProfile, type QuickResult } from '../../lib/quick-estimate/pricing';
import { PITCHED_SHAPES, ROOF_TEMPLATES } from '../../lib/quick-estimate/templates';
import { parseQuickInput } from '../../lib/quick-estimate/validation';
import type { CoveringId, ExistingMaterial, PitchId, Quantities, QuickEstimateInput, ShapeId, SizeId } from '../../lib/quick-estimate/types';
import { PitchIllustration, RoofIllustration } from './RoofIllustration';
import { RoofPlanIllustration } from './RoofPlanIllustration';
import { DEMO_ACTION_EVENT, actionFromEvent, getJourney, recordDemoSignal, updateJourney } from '../../lib/demo-journey/store';

const DRAFT_KEY = 'roofline.quick-roof.draft.v2';
let memorySnapshot: string | null = null;
function snapshot() { try { return sessionStorage.getItem(DRAFT_KEY) ?? memorySnapshot; } catch { return memorySnapshot; } }
function subscribe(fn: () => void) { window.addEventListener('quick-roof-draft', fn); window.addEventListener('storage', fn); return () => { window.removeEventListener('quick-roof-draft', fn); window.removeEventListener('storage', fn); }; }
function writeDraft(draft: Draft) { memorySnapshot = JSON.stringify(draft); try { sessionStorage.setItem(DRAFT_KEY, memorySnapshot); } catch { /* In-memory mode still works when storage is disabled. */ } window.dispatchEvent(new Event('quick-roof-draft')); }
const serverSnapshot = () => null;
const sample: QuickEstimateInput = {
  shape: 'gable', size: 'medium', pitch: 'typical', storeys: 1, flatExtension: null,
  exactRoofAreaM2: 160, exactPitchDegrees: 20, project: 'reroof', existingMaterial: 'metal',
  covering: 'pressed_metal', flatCovering: null,
};
const coveringLabels: Record<CoveringId, string> = { tile: 'Concrete tiles', slate: 'Natural slate', metal: 'Corrugate or Roofdeck 0.55g', shingle: 'Asphalt shingles', pressed_metal: 'Roofdeck 0.40g (ColorCote)', longrun: 'Corrugate 0.40g (ColorCote)', epdm: 'Rubber membrane (EPDM)', grp: 'Fibreglass (GRP)', felt: 'Roofing felt', everest_tray: 'Everest Tray 0.55g (hidden fix)' };
const MATERIAL_PHOTOS: Partial<Record<CoveringId, { src: string; position?: string }>> = {
  longrun: { src: '/assets/demo-roofline/roof-material-corrugate.webp' },
  pressed_metal: { src: '/assets/demo-roofline/roof-material-roofdeck.webp' },
  everest_tray: { src: '/assets/demo-roofline/roof-material-everest.webp' },
  metal: { src: '/assets/demo-roofline/roof-material-longrun.webp' },
};
function MaterialThumbnail({ id }: { id: CoveringId }) {
  const photo = MATERIAL_PHOTOS[id];
  if (photo) {
    // Two demo-only remote photos are credited in docs/ROOF_MATERIAL_IMAGE_CREDITS.md.
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="qr-material-swatch qr-material-photo" src={photo.src} alt="" width={560} height={250} loading="lazy" draggable={false} style={photo.position ? { objectPosition: photo.position } : undefined} />;
  }
  return <span className={`qr-material-swatch qr-swatch-${id}`} aria-hidden="true" />;
}
const existingLabels: Record<ExistingMaterial, string> = { tile: 'Concrete or clay tiles', slate: 'Slate', metal: 'Existing metal roof', membrane: 'Felt or membrane', unknown: 'Not sure' };
const n = (v: number) => v.toLocaleString('en-NZ', { maximumFractionDigits: 1 });
const money = (v: number) => `NZ$${new Intl.NumberFormat('en-NZ', { maximumFractionDigits: 0 }).format(v)}`;
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
  const { answers: a } = draft;
  const [notice, setNotice] = useState('');
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [sampleCovering, setSampleCovering] = useState<CoveringId>('pressed_metal');
  // Raw keystroke text for the optional exact-value fields. The draft only ever
  // holds committed values; while the visitor is mid-keystroke the text lives
  // here so React's controlled-input revert never fights the typist.
  const [areaText, setAreaText] = useState<string | null>(null);
  const [pitchText, setPitchText] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- resync raw text when the committed value changes (including external draft writes)
  useEffect(() => { setAreaText(null); }, [a.exactRoofAreaM2]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- same resync for pitch
  useEffect(() => { setPitchText(null); }, [a.exactPitchDegrees]);
  const areaValue = areaText !== null ? areaText : a.exactRoofAreaM2 != null ? String(a.exactRoofAreaM2) : '';
  const pitchValue = pitchText !== null ? pitchText : a.exactPitchDegrees != null ? String(a.exactPitchDegrees) : '';
  const helper = useDemoHelper();
  const exampleHeading = useRef<HTMLHeadingElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const hadEnquiry = useRef(false);
  useEffect(() => {
    if (hadEnquiry.current && !enquiryOpen) requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: 'start', behavior: 'auto' }); });
    hadEnquiry.current = enquiryOpen;
  }, [enquiryOpen]);
  const flat = a.shape === 'flat';
  const steps = flat ? ['Roof', 'Size', 'Project', 'Covering', 'Result'] : ['Roof', 'Size', 'Pitch', 'Project', 'Covering', 'Result'];
  const step = Math.min(draft.step, steps.length - 1), current = steps[step];
  function update(patch: Partial<QuickEstimateInput>) { writeDraft({ ...draft, answers: { ...a, ...patch }, example: false }); setNotice(''); }
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
    if (result?.price.low && result.price.high) {
      const h = getHelper();
      if (h.current === 'quick-price' && h.view === 'task' && !h.started) updateHelper({ type: 'prepare' });
      recordDemoSignal('quick-result'); recordHelperSignal('quick-result'); updateConversion({ type: 'interact', key: 'quick-price', at: Date.now() });
    }
  }, [result]);
  useEffect(() => {
    const command = () => {
      const action = takeHelperCommand(['quick-enquiry', 'quick-example', 'quick-full', 'quick-instant']);
      if (action === 'quick-enquiry' && result) setEnquiryOpen(true);
      if (action === 'quick-full') {
        setShowExample(false); setEnquiryOpen(false); setNotice('');
        writeDraft(initial);
        requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: 'start', behavior: 'auto' }); });
      }
      if (action === 'quick-instant') {
        trackDemo('sample_selected', { task: 'quick-price' });
        setShowExample(false); setEnquiryOpen(false); setNotice('');
        writeDraft({ step: 5, answers: { ...sample, covering: 'pressed_metal' }, demo: false, example: true });
      }
      if (action === 'quick-example') {
        if (result?.price.low && result.price.high) recordHelperSignal('quick-result');
        else { setShowExample(true); requestAnimationFrame(() => { exampleHeading.current?.focus({ preventScroll: true }); exampleHeading.current?.scrollIntoView({ block: 'center' }); }); }
      }
    };
    window.addEventListener(HELPER_COMMAND_EVENT, command); command();
    return () => window.removeEventListener(HELPER_COMMAND_EVENT, command);
  }, [result]);
  const canContinue = current === 'Roof' ? !!a.shape
    : current === 'Size' ? (!!a.size || a.exactRoofAreaM2 !== undefined) && !!a.storeys
    : current === 'Pitch' ? !!a.pitch || a.exactPitchDegrees !== undefined
    : current === 'Project' ? !!a.project && (a.project === 'new_roof' || !!a.existingMaterial)
    : current === 'Covering' ? !!a.covering && (!a.flatExtension || !!a.flatCovering) : false;
  const titles: Record<string, string> = { Roof: 'Which roof looks most like yours?', Size: 'How big is your roof?', Pitch: 'How steep is your roof?', Project: 'What are you planning?', Covering: 'What would you like on your roof?', Result: 'Your ballpark roof estimate' };
  const subtitles: Record<string, string> = {
    Roof: 'No need to know its name. Just choose the closest shape.', Size: 'Choose a size band, or enter the actual roof area if you know it.',
    Pitch: 'Choose the closest illustration, or enter the actual pitch if you know it.', Project: 'A replacement includes removing the old covering. A new roof does not.',
    Covering: 'Choose the finish you prefer. We allow for the main supporting materials and fixings.', Result: 'An initial price range, based on your choices.',
  };
  function chooseShape(shape: ShapeId) {
    const categoryChanged = (shape === 'flat') !== flat;
    update({ shape, pitch: shape === 'flat' ? null : a.pitch ?? undefined, covering: categoryChanged ? undefined : a.covering, flatExtension: shape === 'flat' ? null : a.flatExtension, flatCovering: shape === 'flat' ? null : a.flatCovering, flatComplexity: shape === 'flat' ? (a.flatComplexity ?? 'typical') : a.flatExtension ? (a.flatComplexity ?? 'typical') : undefined });
  }
  function refine(endpoint: 'low' | 'high') {
    if (!result) return;
    try { sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(createHandoff(result.input, endpoint))); window.location.assign('/supplier-pricing-tool/roofline-roofing?from=quick-roof'); }
    catch { setNotice('Browser storage is unavailable. Download the measurements below, then open the detailed estimator from the navigation.'); }
  }
  function download() {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'roofline-quick-roof-estimate.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function calculateExample() {
    if ((draft.step > 0 || JSON.stringify(a) !== JSON.stringify(initial.answers)) && !window.confirm('Use the sample roof instead? This replaces your current Quick Estimate selections in this tab.')) return;
    trackDemo('sample_selected', { task: 'quick-price' });
    setShowExample(false);
    // Same calculator and catalogue as the normal questionnaire. Never a canned price.
    writeDraft({ step: 5, answers: { ...sample, covering: sampleCovering }, demo: false, example: true });
  }
  function startExample() {
    if ((draft.step > 0 || JSON.stringify(a) !== JSON.stringify(initial.answers)) && !window.confirm('Load the example roof? This replaces your current quick-estimate selections in this tab.')) {
      updateJourney({ type: 'cancel' }); return;
    }
    writeDraft({ step: 0, answers: { ...sample }, demo: !getJourney().active });
  }
  useEffect(() => {
    const onDemo = (event: Event) => { if (actionFromEvent(event) === 'quick-example') startExample(); };
    window.addEventListener(DEMO_ACTION_EVENT, onDemo);
    return () => window.removeEventListener(DEMO_ACTION_EVENT, onDemo);
  // startExample reads the latest draft; the effect must be renewed with it.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return <div className="qr-app">
    <RooflineToolHeader title="Quick Roof Estimate" />
    <main className="qr-shell qr-main">
      {showExample && current !== 'Result' ? <section className="qr-demo-example" aria-labelledby="quick-demo-example">
        <p className="qr-eyebrow">FAST DEMO SHORTCUT</p>
        <div className="qr-demo-example-body"><RoofPlanIllustration shape="gable" size="medium" /><div><h1 id="quick-demo-example" ref={exampleHeading} tabIndex={-1}>Try a roof. See a real calculation.</h1><p>160 m² gable roof · one storey · 20° pitch. Replacing an existing metal roof.</p><p className="qr-muted">We&apos;ve pre-filled the roof shape, size, pitch and project details so you can see the result faster. You can still switch to the full step-by-step tool at any time.</p></div></div>
        <Field label="Which Roofline profile would you choose?"><div className="qr-three-grid">{(['longrun', 'pressed_metal', 'everest_tray'] as const).map(id => <Choice key={id} name="sample-covering" value={id} selected={sampleCovering === id} onSelect={() => setSampleCovering(id)}><MaterialThumbnail id={id} /><b>{coveringLabels[id]}</b></Choice>)}</div></Field>
        <p className="qr-muted qr-demo-example-note">Roofline uses demo rates. A live version can use your exact prices, starting prices or ranges.</p>
        <div className="qr-example-actions"><button type="button" className="qr-button" onClick={calculateExample}>Calculate this example →</button><button type="button" className="qr-text-button" onClick={() => { setShowExample(false); requestAnimationFrame(() => heading.current?.focus({ preventScroll: true })); }}>Try the full tool instead</button></div>
      </section> : <>
      <ol className="qr-progress" aria-label="Estimate progress">{steps.map((label, i) => <li key={label} className={i === step ? 'is-current' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}><button type="button" disabled={i > step} onClick={() => go(i)}><span>{i < step ? '✓' : String(i + 1).padStart(2, '0')}</span><b>{label}</b></button></li>)}</ol>
      <div className={`qr-workspace ${current === 'Result' ? 'qr-is-result' : ''}`}>
        <section className="qr-panel">
          {!(current === 'Result' && enquiryOpen) && <div className="qr-panel-heading">{current !== 'Result' && <p className="qr-eyebrow">{`STEP ${step + 1} OF ${steps.length - 1}`}</p>}<h1 ref={heading} tabIndex={-1}>{titles[current]}</h1><p>{subtitles[current]}</p></div>}
          {current === 'Roof' && <>
            <Field label="Choose the closest roof shape"><div className="qr-roof-grid">{PITCHED_SHAPES.map(t => <Choice key={t.id} name="shape" value={t.id} selected={a.shape === t.id} onSelect={() => chooseShape(t.id)} className="qr-roof-card"><RoofIllustration shape={t.id} /><b>{t.label}</b><small>{t.description}</small></Choice>)}</div></Field>
            <div className="qr-help-line"><span aria-hidden="true">ⓘ</span><p>Your roof does not have to match exactly. Roofline&apos;s demo focuses on long-run metal roofing. Low-pitch projects can still be handled with a suitable Roofline profile.</p></div>
          </>}
          {current === 'Size' && <>
            <Field label="Choose an approximate roof size"><div className="qr-size-grid">{Object.entries(SIZE_BANDS).map(([id, b]) => <Choice key={id} name="size" value={id} selected={a.size === id} onSelect={() => update({ size: id as SizeId })} className="qr-size-card"><RoofPlanIllustration shape={a.shape ?? 'gable'} size={id as SizeId} /><b>{b.label}</b><small>{b.min}-{b.max} m²</small></Choice>)}</div></Field>
            <label className="qr-exact-field"><span><b>Know the actual roof area?</b><small>Optional. Enter the sloped roof surface area to tighten the price range.</small></span><span className="qr-exact-input"><input type="number" inputMode="decimal" min="20" max="1200" step="1" value={areaValue} placeholder="e.g. 160" onChange={e => { setAreaText(e.target.value); const v = e.target.value === '' ? undefined : Number(e.target.value); if (v === undefined || (Number.isFinite(v) && v >= 20 && v <= 1200)) update({ exactRoofAreaM2: v }); }} /><b>m²</b></span></label>
            <p className="qr-info">If you only know the building footprint, use the size cards. If you know the roof surface area from plans or measurements, enter it above for a tighter estimate.</p>
            <Field label="How many storeys?"><div className="qr-two-grid">{([1, 2] as const).map(v => <Choice key={v} name="storeys" value={String(v)} selected={a.storeys === v} onSelect={() => update({ storeys: v })}><b>{v === 1 ? 'Single storey' : 'Two storeys'}</b><small>{v === 1 ? 'Ground floor only' : 'Ground floor and upstairs'}</small></Choice>)}</div></Field>
          </>}
          {current === 'Pitch' && <>
            <Field label="Choose the closest slope"><div className="qr-three-grid">{Object.entries(PITCH_BANDS).map(([id, b]) => <Choice key={id} name="pitch" value={id} selected={a.pitch === id} onSelect={() => update({ pitch: id as PitchId })} className="qr-pitch-card"><PitchIllustration degrees={(b.min + b.max) / 2} /><b>{b.label}</b><small>{b.description}</small><span className="qr-tag">{b.min}-{b.max}°</span></Choice>)}</div></Field>
            <label className="qr-exact-field"><span><b>Know the actual pitch?</b><small>Optional. An exact pitch helps narrow the estimate and confirm profile suitability.</small></span><span className="qr-exact-input"><input type="number" inputMode="decimal" min="3" max="50" step="0.5" value={pitchValue} placeholder="e.g. 20" onChange={e => { setPitchText(e.target.value); const v = e.target.value === '' ? undefined : Number(e.target.value); if (v === undefined || (Number.isFinite(v) && v >= 0 && v <= 50)) update({ exactPitchDegrees: v }); }} /><b>°</b></span></label>
            <p className="qr-info">A steeper roof needs more covering over the same footprint. Exact pitch and exact roof area materially tighten the indicative range.</p>
            <p className="qr-muted">Some coverings need a minimum pitch. We will flag this before showing a price. Do not climb onto your roof to check.</p>
          </>}
          {current === 'Project' && <>
            <Field label="Your project"><div className="qr-two-grid"><Choice name="project" value="reroof" selected={a.project === 'reroof'} onSelect={() => update({ project: 'reroof', existingMaterial: a.existingMaterial ?? 'unknown' })}><b>Replace an existing roof</b><small>Remove the old covering and fit a new one</small></Choice><Choice name="project" value="new_roof" selected={a.project === 'new_roof'} onSelect={() => update({ project: 'new_roof', existingMaterial: null })}><b>A new roof</b><small>No old covering to remove</small></Choice></div></Field>
            {a.project === 'reroof' && <Field label="What is on the roof now?"><div className="qr-material-grid">{Object.entries(existingLabels).map(([id, label]) => <Choice key={id} name="existing" value={id} selected={a.existingMaterial === id} onSelect={() => update({ existingMaterial: id as ExistingMaterial })}><b>{label}</b></Choice>)}</div><p className="qr-muted">We allow for removing the existing covering. Unknown roof condition or hazardous materials need a professional assessment.</p></Field>}
          </>}
          {current === 'Covering' && <>
            <Field label="Your new Roofline profile"><div className="qr-three-grid">{(['longrun', 'pressed_metal', 'everest_tray'] as const).map(id => <Choice key={id} name="covering" value={id} selected={a.covering === id} onSelect={() => update({ covering: id })} className="qr-material-card"><MaterialThumbnail id={id} /><b>{coveringLabels[id]}</b>{!profile.systems[id] && <small>Measurements available; rates not loaded</small>}</Choice>)}</div></Field>
            <div className="qr-help-line"><span aria-hidden="true">ⓘ</span><p>Roofline uses demo products and rates. A live version can use your products with exact prices, starting prices or ranges. No contact details needed.</p></div>
          </>}
          {current === 'Result' && !enquiryOpen && (result ? <Results result={result} example={draft.example === true} onRefine={refine} onDownload={download} onEdit={() => go(0)} onEnquire={() => setEnquiryOpen(true)} /> : <div role="alert" className="qr-info">Some selections are missing or invalid. <button type="button" onClick={() => go(0)}>Review your roof</button></div>)}
          {notice && <p role="alert" className="qr-info">{notice}</p>}
          {current === 'Result' && result && <QuickQuoteEnquiry key={JSON.stringify(result.input)} open={enquiryOpen} result={result} guided={helper.current === 'quick-price' && helper.started} onClose={() => setEnquiryOpen(false)} />}
      {current !== 'Result' && <div className="qr-panel-actions"><button className="qr-text-button" type="button" onClick={() => go(Math.max(0, step - 1))} disabled={step === 0}>← Back</button><span>No measurements. No sign-up.</span><button className="qr-button" type="button" disabled={!canContinue} onClick={() => go(step + 1)}>{current === 'Covering' ? 'See my estimate' : 'Continue'} <span aria-hidden="true">→</span></button></div>}
        </section>

      </div></>}
      <footer className="qr-footer"><p><b>Roofline Canterbury</b> · demonstration website by T3 Labs.</p><button type="button" className="qr-text-button" onClick={() => { if (window.confirm('Start a new estimate? This will replace your current choices.')) { writeDraft(initial); setEnquiryOpen(false); setNotice(''); } }}>Start a new estimate</button></footer>
    </main>
  </div>;
}

function Results({ result: r, example = false, onRefine, onDownload, onEdit, onEnquire }: { result: QuickResult; example?: boolean; onRefine: (endpoint: 'low' | 'high') => void; onDownload: () => void; onEdit: () => void; onEnquire: () => void }) {
  const { price: p, measurements: m, input } = r;
  const labels = [
    ['Roof style', ROOF_TEMPLATES[input.shape].label],
    ['Roof area', input.exactRoofAreaM2 !== undefined ? `${n(input.exactRoofAreaM2)} m² supplied` : `${SIZE_BANDS[input.size]?.label ?? input.size} (approx.)`],
    ['Roof pitch', input.exactPitchDegrees !== undefined ? `${n(input.exactPitchDegrees)}° supplied` : input.shape === 'flat' ? 'Flat roof' : `${(input.pitch ? PITCH_BANDS[input.pitch]?.label : undefined) ?? String(input.pitch)} (approx.)`],
    ['Property height', `${input.storeys} storey${input.storeys === 1 ? '' : 's'}`],
    ['Project', input.project === 'reroof' ? 'Replace existing roof' : 'New roof'],
    ['Preferred covering', coveringLabels[input.covering]],
    ...(input.flatExtension ? [['Flat-roof extension', `${input.flatExtension} · ${coveringLabels[input.flatCovering!]}`]] : []),
  ];
  return <div className="qr-results qr-simple-results">
    {example && <div className="qr-example-result"><p><strong>Pre-filled demo roof.</strong> Shape, size, pitch and project were selected for this example, not your home.</p><button type="button" className="qr-text-button" onClick={onEdit}>Review every roof choice →</button></div>}
    <div className="qr-price-card" aria-label="Estimated price range">
      {p.low && p.high && p.presentation ? <><p className="qr-eyebrow">{p.presentation.label.toUpperCase()}</p><div className="qr-price-value">{money(p.presentation.low)}<span> to </span>{money(p.presentation.high)}</div><p>Estimated materials, installation and applicable basic access/removal allowances, based on your choices. {p.taxNote}</p>{p.presentation.reasons.length > 0 && <div className="qr-range-note"><strong>Why this is a range</strong><span>{p.presentation.reasons.join('; ')}. Add more exact information to narrow it further.</span></div>}</>
        : <><h2>{p.status === 'incompatible' ? 'This covering needs a different roof pitch.' : 'We need to check your roof before pricing it.'}</h2><p>We have your choices and can include them in a quote request. We won&rsquo;t invent a price.</p></>}
    </div>
    <div className="qr-result-enquire"><button className="qr-button" type="button" onClick={onEnquire}>Request a quote →</button><p>Your roof details and estimate carry through.<br /><span>Demo only: preview the enquiry, without sending it.</span></p></div>
    <section className="qr-home-summary"><h2>Your roof at a glance</h2><dl>{labels.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
    <section className="qr-home-disclaimer"><strong>A useful starting point, not a formal quote.</strong><p>The range tightens as the information becomes more exact. Site access, substrate condition, flashings, penetrations and final scope can still move the completed quote below or above this indication.</p></section>
    <details className="qr-details"><summary>What’s included & technical details (optional)</summary><p className="qr-muted">Typical roofing materials, supporting components, fixings, fitting and configured basic access/removal allowances. Structural repairs, insulation, specialist drainage and unusual site conditions need separate assessment. These are illustrative NZD demonstration rates; final GST treatment and commercial pricing can be configured by Roofline.</p><p className="qr-muted">For anyone who wants to inspect the estimated quantities, the lower and upper roof surface areas are {range(m.low.totals.roofAreaM2, m.high.totals.roofAreaM2)} m².</p><p className="qr-muted">{p.missing.length ? `Site-specific or unpriced items: ${p.missing.join('; ')}.` : 'No additional catalogue items flagged.'}</p><div className="qr-result-actions"><button className="qr-text-button" type="button" onClick={() => onRefine('high')}>Open detailed estimator →</button><button className="qr-text-button" type="button" onClick={onDownload}>Download calculation data</button></div></details>
    <div className="qr-result-actions"><button className="qr-text-button" type="button" onClick={onEdit}>← Change my roof</button><button className="qr-text-button" type="button" onClick={() => window.print()}>Print summary</button></div>
  </div>;
}
