"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ApexToolHeader } from '../demo-helper/ApexToolHeader';
import { HELPER_COMMAND_EVENT, takeHelperCommand, recordHelperSignal, getHelper, updateHelper } from '../../lib/demo-helper/store';
import { useDemoHelper } from '../demo-helper/useDemoHelper';
import { QuickQuoteEnquiry } from './QuickQuoteEnquiry';
import { trackDemo } from '../../lib/demo-conversion/metrics';
import { updateConversion } from '../../lib/demo-conversion/store';
import type { ReactNode } from 'react';
import type { SupplierProduct } from '../../app/supplier-pricing-tool/types';
import { EXTENSION_BANDS, PITCH_BANDS, SIZE_BANDS } from '../../lib/quick-estimate/config';
import { INITIAL_DRAFT as initial, readQuickDraft, type QuickDraft as Draft } from '../../lib/quick-estimate/draft';
import { createHandoff, HANDOFF_KEY } from '../../lib/quick-estimate/handoff';
import { createQuickResult, type PricingProfile, type QuickResult } from '../../lib/quick-estimate/pricing';
import { PITCHED_SHAPES, ROOF_TEMPLATES } from '../../lib/quick-estimate/templates';
import { parseQuickInput } from '../../lib/quick-estimate/validation';
import type { CoveringId, ExistingMaterial, ExtensionSizeId, FlatComplexity, PitchId, Quantities, QuickEstimateInput, ShapeId, SizeId } from '../../lib/quick-estimate/types';
import { PitchIllustration, RoofIllustration } from './RoofIllustration';
import { RoofPlanIllustration } from './RoofPlanIllustration';
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
const MATERIAL_PHOTOS: Partial<Record<CoveringId, { src: string; position?: string }>> = {
  tile: { src: '/assets/apex-roof-materials/concrete-tile.webp' },
  slate: { src: '/assets/apex-roof-materials/natural-slate.webp' },
  shingle: { src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Asphalt_Shingles_Texture_DTXR-ST-AP-1.jpg/960px-Asphalt_Shingles_Texture_DTXR-ST-AP-1.jpg' },
  pressed_metal: { src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Red_metal_tile_on_a_home.jpg/960px-Red_metal_tile_on_a_home.jpg', position: 'center 58%' },
  longrun: { src: '/assets/apex-roof-materials/long-run-metal.webp' },
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
  const { answers: a } = draft;
  const [notice, setNotice] = useState('');
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [sampleCovering, setSampleCovering] = useState<CoveringId>('tile');
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
      const action = takeHelperCommand(['quick-enquiry', 'quick-example']);
      if (action === 'quick-enquiry' && result) setEnquiryOpen(true);
      if (action === 'quick-example') {
        if (result?.price.low && result.price.high) recordHelperSignal('quick-result');
        else { setShowExample(true); requestAnimationFrame(() => { exampleHeading.current?.focus({ preventScroll: true }); exampleHeading.current?.scrollIntoView({ block: 'center' }); }); }
      }
    };
    window.addEventListener(HELPER_COMMAND_EVENT, command); command();
    return () => window.removeEventListener(HELPER_COMMAND_EVENT, command);
  }, [result]);
  const canContinue = current === 'Roof' ? !!a.shape
    : current === 'Size' ? !!a.size && !!a.storeys
    : current === 'Pitch' ? !!a.pitch
    : current === 'Project' ? !!a.project && (a.project === 'new_roof' || !!a.existingMaterial)
    : current === 'Covering' ? !!a.covering && (!a.flatExtension || !!a.flatCovering) : false;
  const titles: Record<string, string> = { Roof: 'Which roof looks most like yours?', Size: 'How big is your roof?', Pitch: 'How steep is your roof?', Project: 'What are you planning?', Covering: 'What would you like on your roof?', Result: 'Your ballpark roof estimate' };
  const subtitles: Record<string, string> = {
    Roof: 'No need to know its name. Just choose the closest shape.', Size: 'Picture your roof from above. Choose the closest size.',
    Pitch: 'Choose the closest illustration. You do not need an exact angle.', Project: 'A replacement includes removing the old covering. A new roof does not.',
    Covering: 'Choose the finish you prefer. We allow for the main supporting materials and fixings.', Result: 'An initial price range, based on your choices.',
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
    <ApexToolHeader title="Quick Roof Estimate" />
    <main className="qr-shell qr-main">
      {showExample && current !== 'Result' ? <section className="qr-demo-example" aria-labelledby="quick-demo-example">
        <p className="qr-eyebrow">FAST DEMO SHORTCUT</p>
        <div className="qr-demo-example-body"><RoofPlanIllustration shape="gable" size="small" /><div><h1 id="quick-demo-example" ref={exampleHeading} tabIndex={-1}>Try a roof. See a real calculation.</h1><p>Small gable · 60–100 m² footprint · one storey · 15–30° pitch. Replacing concrete tiles; no flat extension.</p><p className="qr-muted">We&apos;ve pre-filled the roof shape, size, pitch and project details so you can see the result faster. You can still switch to the full step-by-step tool at any time.</p></div></div>
        <Field label="Which covering would you choose?"><div className="qr-three-grid">{(['tile', 'slate', 'longrun'] as const).map(id => <Choice key={id} name="sample-covering" value={id} selected={sampleCovering === id} onSelect={() => setSampleCovering(id)}><MaterialThumbnail id={id} /><b>{coveringLabels[id]}</b></Choice>)}</div></Field>
        <p className="qr-muted qr-demo-example-note">Apex uses demo rates. A live version can use your exact prices, starting prices or ranges.</p>
        <div className="qr-example-actions"><button type="button" className="qr-button" onClick={calculateExample}>Calculate this example →</button><button type="button" className="qr-text-button" onClick={() => { setShowExample(false); requestAnimationFrame(() => heading.current?.focus({ preventScroll: true })); }}>Try the full tool instead</button></div>
      </section> : <>
      <ol className="qr-progress" aria-label="Estimate progress">{steps.map((label, i) => <li key={label} className={i === step ? 'is-current' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}><button type="button" disabled={i > step} onClick={() => go(i)}><span>{i < step ? '✓' : String(i + 1).padStart(2, '0')}</span><b>{label}</b></button></li>)}</ol>
      <div className={`qr-workspace ${current === 'Result' ? 'qr-is-result' : ''}`}>
        <section className="qr-panel">
          {!(current === 'Result' && enquiryOpen) && <div className="qr-panel-heading">{current !== 'Result' && <p className="qr-eyebrow">{`STEP ${step + 1} OF ${steps.length - 1}`}</p>}<h1 ref={heading} tabIndex={-1}>{titles[current]}</h1><p>{subtitles[current]}</p></div>}
          {current === 'Roof' && <>
            <Field label="Roof category"><div className="qr-segmented"><Choice name="category" value="pitched" selected={!flat} onSelect={() => chooseShape('gable')}><b>Pitched roof</b><small>Tiles, slate or metal</small></Choice><Choice name="category" value="flat" selected={flat} onSelect={() => chooseShape('flat')}><b>Flat membrane roof</b><small>Felt, rubber or fibreglass</small></Choice></div></Field>
            {flat ? <div className="qr-flat-intro"><RoofIllustration shape="flat" /><div><h2>Nearly level, with a waterproof covering.</h2><p>For flat roofs with a waterproof covering, such as rubber or fibreglass.</p><p className="qr-muted">A single-slope tiled or metal roof? Choose Pitched roof, then Single slope.</p></div></div>
              : <Field label="Choose the closest roof shape"><div className="qr-roof-grid">{PITCHED_SHAPES.map(t => <Choice key={t.id} name="shape" value={t.id} selected={a.shape === t.id} onSelect={() => chooseShape(t.id)} className="qr-roof-card"><RoofIllustration shape={t.id} /><b>{t.label}</b><small>{t.description}</small></Choice>)}</div></Field>}
            <div className="qr-help-line"><span aria-hidden="true">ⓘ</span><p>Your roof does not have to match exactly. These are reference shapes, not measured plans. You can add a flat extension on the next step.</p></div>
          </>}
          {current === 'Size' && <>
            <Field label="Choose an approximate footprint"><div className="qr-size-grid">{Object.entries(SIZE_BANDS).map(([id, b]) => <Choice key={id} name="size" value={id} selected={a.size === id} onSelect={() => update({ size: id as SizeId })} className="qr-size-card"><RoofPlanIllustration shape={a.shape ?? 'gable'} size={id as SizeId} /><b>{b.label}</b><small>{b.min}-{b.max} m²</small></Choice>)}</div></Field>
            <p className="qr-info">Include the roof overhangs, but don’t add upstairs floor area.</p>
            <Field label="How many storeys?"><div className="qr-two-grid">{([1, 2] as const).map(v => <Choice key={v} name="storeys" value={String(v)} selected={a.storeys === v} onSelect={() => update({ storeys: v })}><b>{v === 1 ? 'Single storey' : 'Two storeys'}</b><small>{v === 1 ? 'Ground floor only' : 'Ground floor and upstairs'}</small></Choice>)}</div></Field>
            {!flat && <Field label="Also replacing a flat-roof extension?" hint="Only include the extra flat section, not any part of the main footprint above."><div className="qr-two-grid"><Choice name="extension" value="no" selected={!a.flatExtension} onSelect={() => update({ flatExtension: null, flatCovering: null, flatComplexity: undefined })}><b>No flat section</b></Choice><Choice name="extension" value="yes" selected={!!a.flatExtension} onSelect={() => update({ flatExtension: 'small', flatCovering: undefined, flatComplexity: a.flatComplexity ?? 'typical' })}><b>Yes, add a flat section</b></Choice></div>{a.flatExtension && <div className="qr-three-grid qr-gap-top">{Object.entries(EXTENSION_BANDS).map(([id, b]) => <Choice key={id} name="extension-size" value={id} selected={a.flatExtension === id} onSelect={() => update({ flatExtension: id as ExtensionSizeId })}><b>{b.label}</b><small>{b.min}-{b.max} m² extra</small></Choice>)}</div>}</Field>}
          </>}
          {current === 'Size' && (flat || !!a.flatExtension) && <Field label="How complicated does the flat-roof section look?" hint="Choose what looks closest."><div className="qr-three-grid">{([['simple', 'Simple', 'Mostly rectangular, few obstacles'], ['typical', 'Typical', 'Some corners or roof features'], ['complex', 'Complex', 'Several corners, levels or obstacles']] as const).map(([id, label, description]) => <Choice key={id} name="flat-complexity" value={id} selected={(a.flatComplexity ?? 'typical') === id} onSelect={() => update({ flatComplexity: id as FlatComplexity })}><b>{label}</b><small>{description}</small></Choice>)}</div></Field>}
          {current === 'Pitch' && <>
            <Field label="Choose the closest slope"><div className="qr-three-grid">{Object.entries(PITCH_BANDS).map(([id, b]) => <Choice key={id} name="pitch" value={id} selected={a.pitch === id} onSelect={() => update({ pitch: id as PitchId })} className="qr-pitch-card"><PitchIllustration degrees={(b.min + b.max) / 2} /><b>{b.label}</b><small>{b.description}</small><span className="qr-tag">{b.min}-{b.max}°</span></Choice>)}</div></Field>
            <p className="qr-info">A steeper roof needs more covering over the same footprint. We allow for this in your estimate.</p>
            <p className="qr-muted">Some coverings need a minimum pitch. We will flag this before showing a price. Do not climb onto your roof to check.</p>
          </>}
          {current === 'Project' && <>
            <Field label="Your project"><div className="qr-two-grid"><Choice name="project" value="reroof" selected={a.project === 'reroof'} onSelect={() => update({ project: 'reroof', existingMaterial: a.existingMaterial ?? 'unknown' })}><b>Replace an existing roof</b><small>Remove the old covering and fit a new one</small></Choice><Choice name="project" value="new_roof" selected={a.project === 'new_roof'} onSelect={() => update({ project: 'new_roof', existingMaterial: null })}><b>A new roof</b><small>No old covering to remove</small></Choice></div></Field>
            {a.project === 'reroof' && <Field label="What is on the roof now?"><div className="qr-material-grid">{Object.entries(existingLabels).map(([id, label]) => <Choice key={id} name="existing" value={id} selected={a.existingMaterial === id} onSelect={() => update({ existingMaterial: id as ExistingMaterial })}><b>{label}</b></Choice>)}</div><p className="qr-muted">We allow for removing the existing covering. Unknown roof condition or hazardous materials need a professional assessment.</p></Field>}
          </>}
          {current === 'Covering' && <>
            <Field label={flat ? 'Your flat-roof covering' : 'Your new roof covering'}><div className="qr-three-grid">{(flat ? ['epdm', 'grp'] as const : ['tile', 'slate', 'shingle', 'pressed_metal', 'longrun'] as const).map(id => <Choice key={id} name="covering" value={id} selected={a.covering === id} onSelect={() => update({ covering: id })} className="qr-material-card"><MaterialThumbnail id={id} /><b>{coveringLabels[id]}</b>{!profile.systems[id] && <small>Measurements available; rates not loaded</small>}</Choice>)}</div></Field>
            {a.flatExtension && <Field label="Covering for the flat extension"><div className="qr-three-grid">{(['epdm', 'grp'] as const).map(id => <Choice key={id} name="flat-covering" value={id} selected={a.flatCovering === id} onSelect={() => update({ flatCovering: id })}><b>{coveringLabels[id]}</b></Choice>)}</div></Field>}
            <div className="qr-help-line"><span aria-hidden="true">ⓘ</span><p>Apex uses demo products and rates. A live version can use your products with exact prices, starting prices or ranges. No contact details needed.</p></div>
          </>}
          {current === 'Result' && !enquiryOpen && (result ? <Results result={result} example={draft.example === true} onRefine={refine} onDownload={download} onEdit={() => go(0)} onEnquire={() => setEnquiryOpen(true)} /> : <div role="alert" className="qr-info">Some selections are missing or invalid. <button type="button" onClick={() => go(0)}>Review your roof</button></div>)}
          {notice && <p role="alert" className="qr-info">{notice}</p>}
          {current === 'Result' && result && <QuickQuoteEnquiry key={JSON.stringify(result.input)} open={enquiryOpen} result={result} guided={helper.current === 'quick-price' && helper.started} onClose={() => setEnquiryOpen(false)} />}
      {current !== 'Result' && <div className="qr-panel-actions"><button className="qr-text-button" type="button" onClick={() => go(Math.max(0, step - 1))} disabled={step === 0}>← Back</button><span>No measurements. No sign-up.</span><button className="qr-button" type="button" disabled={!canContinue} onClick={() => go(step + 1)}>{current === 'Covering' ? 'See my estimate' : 'Continue'} <span aria-hidden="true">→</span></button></div>}
        </section>

      </div></>}
      <footer className="qr-footer"><p><b>Apex Roofing</b> · A fictional business demonstration by T3 Labs.</p><button type="button" className="qr-text-button" onClick={() => { if (window.confirm('Start a new estimate? This will replace your current choices.')) { writeDraft(initial); setEnquiryOpen(false); setNotice(''); } }}>Start a new estimate</button></footer>
    </main>
  </div>;
}

function Results({ result: r, example = false, onRefine, onDownload, onEdit, onEnquire }: { result: QuickResult; example?: boolean; onRefine: (endpoint: 'low' | 'high') => void; onDownload: () => void; onEdit: () => void; onEnquire: () => void }) {
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
    {example && <div className="qr-example-result"><p><strong>Pre-filled demo roof.</strong> Shape, size, pitch and project were selected for this example, not your home.</p><button type="button" className="qr-text-button" onClick={onEdit}>Review every roof choice →</button></div>}
    <div className="qr-price-card" aria-label="Estimated price range">
      {p.low && p.high ? <><div className="qr-price-value">{money(Math.floor(p.low.total / 100) * 100)}<span> to </span>{money(Math.ceil(p.high.total / 100) * 100)}</div><p>Estimated materials, fitting and applicable basic access/removal allowances, based on your choices. {p.taxNote}</p></>
        : <><h2>{p.status === 'incompatible' ? 'This covering needs a different roof pitch.' : 'We need to check your roof before pricing it.'}</h2><p>We have your choices and can include them in a quote request. We won&rsquo;t invent a price.</p></>}
    </div>
    <div className="qr-result-enquire"><button className="qr-button" type="button" onClick={onEnquire}>Request a quote →</button><p>Your roof details and estimate carry through.<br /><span>Demo only: preview the enquiry, without sending it.</span></p></div>
    <section className="qr-home-summary"><h2>Your roof at a glance</h2><dl>{labels.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
    <section className="qr-home-disclaimer"><strong>A starting point, not a formal quote.</strong><p>Your actual price could be higher or lower. Exact measurements, roof condition, access and additional work need a professional assessment.</p></section>
    <details className="qr-details"><summary>What’s included & technical details (optional)</summary><p className="qr-muted">Typical roofing materials, supporting components, fixings, fitting and configured basic access/removal allowances. Structural repairs, insulation, specialist drainage and unusual site conditions need separate assessment. VAT is not included in these fictional demo rates.</p><p className="qr-muted">For anyone who wants to inspect the estimated quantities, the lower and upper roof surface areas are {range(m.low.totals.roofAreaM2, m.high.totals.roofAreaM2)} m².</p><p className="qr-muted">{p.missing.length ? `Site-specific or unpriced items: ${p.missing.join('; ')}.` : 'No additional catalogue items flagged.'}</p><div className="qr-result-actions"><button className="qr-text-button" type="button" onClick={() => onRefine('high')}>Open detailed estimator →</button><button className="qr-text-button" type="button" onClick={onDownload}>Download calculation data</button></div></details>
    <div className="qr-result-actions"><button className="qr-text-button" type="button" onClick={onEdit}>← Change my roof</button><button className="qr-text-button" type="button" onClick={() => window.print()}>Print summary</button></div>
  </div>;
}
