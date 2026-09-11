'use client';

import { useMemo, useState } from 'react';
import type {
  AreaType,
  EstimateDraft,
  EstimateDraftComponent,
  PitchBandId,
  ProjectType,
  RoofShape,
  SizeBandId,
} from '@/lib/pricing/estimate-engine';

export interface EstimatorConfig {
  coverings: { id: string; name: string; blurb: string; minPitchDegrees?: number }[];
  components: { id: string; name: string; unit: string; estimable: boolean }[];
  sizeBands: { id: string; label: string; minM2: number; maxM2: number }[];
  pitchBands: { id: string; label: string; minDegrees: number; maxDegrees: number; representativeDegrees: number }[];
  removal: { stripRatePerM2: number; stripLabel: string; disposalAllowancePerJob: number; disposalLabel: string; assumptionNote: string };
  currencySymbol: string;
}

interface Props {
  config: EstimatorConfig;
  accentColor: string;
  busy: boolean;
  initialDraft?: EstimateDraft | null;
  onSubmit: (draft: EstimateDraft) => void;
  onChat: (message: string) => void;
  onCancel: () => void;
}

type ComponentsChoice = 'covering_only' | 'choose' | 'estimate_for_me';

const STEP_TITLES = ['New roof or replacement?', 'How large is the roof?', 'What sort of pitch is it?', 'Choose a roof covering', 'Anything else to include?'];
const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none';

function selectedMapFromDraft(draft?: EstimateDraft | null): Record<string, string> {
  if (!draft) return {};
  return Object.fromEntries(
    draft.components
      .filter((component) => component.selected)
      .map((component) => [component.componentId, component.quantity != null ? String(component.quantity) : ''])
  );
}

export function GuidedEstimator({ config, accentColor, busy, initialDraft, onSubmit, onChat, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState<ProjectType | null>(initialDraft?.projectType ?? null);
  const [sizeBand, setSizeBand] = useState<SizeBandId | null>(initialDraft?.area.band ?? null);
  const [exactArea, setExactArea] = useState(initialDraft?.area.exactM2 != null ? String(initialDraft.area.exactM2) : '');
  const [areaType, setAreaType] = useState<AreaType>(initialDraft?.area.areaType ?? 'actual_roof_area');
  const [pitchBand, setPitchBand] = useState<PitchBandId | null>(initialDraft?.pitch.band ?? null);
  const [exactPitch, setExactPitch] = useState(initialDraft?.pitch.degrees != null ? String(initialDraft.pitch.degrees) : '');
  const [materialId, setMaterialId] = useState<string | null>(initialDraft?.materialId ?? null);
  const [roofShape, setRoofShape] = useState<RoofShape>(initialDraft?.roofShape ?? 'unknown');
  const [componentsChoice, setComponentsChoice] = useState<ComponentsChoice | null>(initialDraft?.components.length ? 'choose' : null);
  const [selected, setSelected] = useState<Record<string, string>>(() => selectedMapFromDraft(initialDraft));
  const [helpChoosing, setHelpChoosing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedIds = Object.keys(selected);
  const effectivePitch = useMemo(() => {
    const exact = Number(exactPitch);
    if (exactPitch && Number.isFinite(exact)) return exact;
    if (pitchBand) return config.pitchBands.find((band) => band.id === pitchBand)?.representativeDegrees;
    return undefined;
  }, [exactPitch, pitchBand, config.pitchBands]);

  const summary = useMemo(() => {
    const parts: string[] = [];
    if (projectType) parts.push(projectType === 'reroof' ? 'Re-roof' : 'New roof');
    if (exactArea) parts.push(`${exactArea} m² ${areaType === 'plan_area' ? 'footprint' : 'roof area'}`);
    else if (sizeBand) {
      const band = config.sizeBands.find((b) => b.id === sizeBand);
      if (band) parts.push(`${band.label} (${band.minM2}-${band.maxM2} m²)`);
    }
    if (exactPitch) parts.push(`${exactPitch}° pitch`);
    else if (pitchBand) {
      const band = config.pitchBands.find((b) => b.id === pitchBand);
      if (band) parts.push(`${band.label} pitch`);
    }
    if (materialId) parts.push(config.coverings.find((c) => c.id === materialId)?.name ?? '');
    if (selectedIds.length) parts.push(`${selectedIds.length} component${selectedIds.length > 1 ? 's' : ''}`);
    return parts.filter(Boolean);
  }, [projectType, exactArea, areaType, sizeBand, pitchBand, exactPitch, materialId, selectedIds.length, config]);

  const buildComponents = (allowHeuristic: boolean): EstimateDraftComponent[] =>
    selectedIds.map((id) => {
      const component = config.components.find((item) => item.id === id)!;
      const qty = Number(selected[id]);
      const hasQty = Number.isFinite(qty) && qty > 0;
      return {
        componentId: id,
        selected: true,
        quantity: hasQty ? qty : null,
        unit: component.unit,
        quantitySource: hasQty ? 'user' : allowHeuristic ? 'heuristic' : undefined,
      };
    });

  const submitDraft = (components: EstimateDraftComponent[], shape: RoofShape = roofShape) => {
    if (!projectType || !materialId) return;
    const area = exactArea
      ? { exactM2: Number(exactArea), source: 'user_exact' as const, areaType }
      : { band: sizeBand ?? 'medium', source: 'configured_band' as const, areaType };
    const pitch = exactPitch
      ? { degrees: Number(exactPitch), source: 'user_exact' as const }
      : { band: pitchBand ?? 'medium', source: 'user_band' as const };
    onSubmit({ projectType, mode: 'guided', area, pitch, roofShape: shape, materialId, components });
  };

  const defaultComponentsForShape = (shape: RoofShape): EstimateDraftComponent[] => {
    const ids = shape === 'valley_complex' ? ['ridge_hip_system', 'valley_trough'] : shape === 'flat' ? [] : ['ridge_hip_system'];
    return ids
      .map((id) => config.components.find((component) => component.id === id))
      .filter((component): component is EstimatorConfig['components'][number] => !!component?.estimable)
      .map((component) => ({ componentId: component.id, selected: true, quantity: null, unit: component.unit, quantitySource: 'heuristic' as const }));
  };

  const handleComponentsChoice = (choice: ComponentsChoice) => {
    setError(null);
    setComponentsChoice(choice);
    if (choice === 'covering_only') submitDraft([]);
    if (choice === 'choose') return;
    // estimate_for_me waits for roof shape. This avoids silently assuming gable geometry
    // and limits automatic allowances to roofline components implied by that shape.
  };

  const submitEstimatedForShape = (shape: RoofShape) => {
    setRoofShape(shape);
    const components = defaultComponentsForShape(shape);
    if (!components.length) {
      submitDraft([], shape);
      return;
    }
    setSelected(Object.fromEntries(components.map((component) => [component.componentId, ''])));
    submitDraft(components, shape);
  };

  const needsShapeForMissing = () => selectedIds.some((id) => {
    const qty = Number(selected[id]);
    return (!Number.isFinite(qty) || qty <= 0) && config.components.find((component) => component.id === id)?.estimable;
  });

  const useTheseQuantities = () => {
    setError(null);
    const missing = selectedIds.filter((id) => {
      const qty = Number(selected[id]);
      return !Number.isFinite(qty) || qty <= 0;
    });
    if (missing.length) {
      setError(`Please enter a quantity for ${missing.map((id) => config.components.find((c) => c.id === id)?.name ?? id).join(', ')}, or use "Estimate missing quantities".`);
      return;
    }
    submitDraft(buildComponents(false));
  };

  const estimateMissing = () => {
    setError(null);
    const notEstimable = selectedIds.filter((id) => {
      const qty = Number(selected[id]);
      const empty = !Number.isFinite(qty) || qty <= 0;
      return empty && !config.components.find((c) => c.id === id)?.estimable;
    });
    if (notEstimable.length) {
      setError(`I can't safely estimate ${notEstimable.map((id) => config.components.find((c) => c.id === id)?.name ?? id).join(', ')}. Please enter a length/count or untick them.`);
      return;
    }
    if (needsShapeForMissing() && roofShape === 'unknown') {
      setError('Choose the roof shape below so I can make a clearly labelled geometry allowance for the missing quantities.');
      return;
    }
    submitDraft(buildComponents(true));
  };

  const stepReady = () => {
    if (step === 0) return projectType != null;
    if (step === 1) return !!exactArea || sizeBand != null;
    if (step === 2) return !!exactPitch || pitchBand != null;
    if (step === 3) return materialId != null;
    return componentsChoice != null;
  };

  const materialCompatible = (covering: EstimatorConfig['coverings'][number]) => {
    if (covering.minPitchDegrees == null || effectivePitch == null) return true;
    return effectivePitch >= covering.minPitchDegrees;
  };

  return (
    <section className="mt-3 rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 rounded-t-2xl px-4 py-3 text-white" style={{ backgroundColor: '#0F172A' }}>
        <div>
          <p className="text-sm font-bold">Guided estimate</p>
          <p className="text-[10px] text-slate-300">Step {step + 1} of 5 - {STEP_TITLES[step]}</p>
        </div>
        <button onClick={onCancel} disabled={busy} aria-label="Close guided estimate" className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
      </div>

      <div className="px-4 py-3">
        {summary.length > 0 && <div className="mb-3 flex flex-wrap gap-1.5">{summary.map((part) => <span key={part} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">{part}</span>)}</div>}

        {step === 0 && <div className="grid grid-cols-2 gap-2">
          <button onClick={() => setProjectType('new_roof')} className={`rounded-xl border p-3 text-left text-xs font-bold transition ${projectType === 'new_roof' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>New Roof<span className="mt-0.5 block text-[10px] font-medium text-slate-500">No old roof to strip or remove</span></button>
          <button onClick={() => setProjectType('reroof')} className={`rounded-xl border p-3 text-left text-xs font-bold transition ${projectType === 'reroof' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>Re-Roof<span className="mt-0.5 block text-[10px] font-medium text-slate-500">Adds {config.currencySymbol}{config.removal.stripRatePerM2}/m² strip + {config.currencySymbol}{config.removal.disposalAllowancePerJob.toLocaleString()} disposal allowance</span></button>
        </div>}

        {step === 1 && <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">{config.sizeBands.map((band) => <button key={band.id} onClick={() => { setSizeBand(band.id as SizeBandId); setExactArea(''); setAreaType('actual_roof_area'); }} className={`rounded-xl border p-3 text-left text-xs font-bold transition ${sizeBand === band.id && !exactArea ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>{band.label}<span className="mt-0.5 block text-[10px] font-medium text-slate-500">{band.minM2}-{band.maxM2} m²</span></button>)}</div>
          <div><label className="mb-1 block text-[11px] font-semibold text-slate-500">Or enter an area (m²)</label><input className={inputCls} inputMode="decimal" value={exactArea} onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, ''); if (v === '' || Number(v) > 0) { setExactArea(v); if (v) setSizeBand(null); } }} placeholder="e.g. 185" /></div>
          {exactArea && <div><p className="mb-1.5 text-[11px] font-semibold text-slate-500">What does that measurement represent?</p><div className="grid grid-cols-2 gap-2"><button onClick={() => setAreaType('actual_roof_area')} className={`rounded-xl border p-2.5 text-left text-[11px] font-semibold ${areaType === 'actual_roof_area' ? 'border-slate-900 bg-slate-50' : 'border-slate-200'}`}>Actual roof area<span className="block pt-0.5 text-[9px] font-medium text-slate-400">Measured along the sloping roof</span></button><button onClick={() => setAreaType('plan_area')} className={`rounded-xl border p-2.5 text-left text-[11px] font-semibold ${areaType === 'plan_area' ? 'border-slate-900 bg-slate-50' : 'border-slate-200'}`}>Footprint / plan area<span className="block pt-0.5 text-[9px] font-medium text-slate-400">Pitch will convert this to roof area</span></button></div></div>}
        </div>}

        {step === 2 && <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">{config.pitchBands.map((band) => <button key={band.id} onClick={() => { setPitchBand(band.id as PitchBandId); setExactPitch(''); }} className={`rounded-xl border p-3 text-left text-xs font-bold transition ${pitchBand === band.id && !exactPitch ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>{band.label}<span className="mt-0.5 block text-[10px] font-medium text-slate-500">{band.maxDegrees >= 85 ? `${band.minDegrees}°+` : `${band.minDegrees}-${band.maxDegrees}°`}</span></button>)}</div>
          <div><label className="mb-1 block text-[11px] font-semibold text-slate-500">Or enter the exact pitch (degrees)</label><input className={inputCls} inputMode="decimal" value={exactPitch} onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, ''); if (v === '' || (Number(v) >= 0 && Number(v) <= 85)) { setExactPitch(v); if (v) setPitchBand(null); } }} placeholder="e.g. 27" /></div>
          {areaType === 'plan_area' && <p className="rounded-xl bg-blue-50 px-3 py-2 text-[10px] leading-relaxed text-blue-800">Because you entered a footprint / plan area, the pricing engine will use this pitch to convert it to the estimated sloped roof area.</p>}
        </div>}

        {step === 3 && <div className="space-y-2">
          {config.coverings.map((covering) => { const compatible = materialCompatible(covering); return <button key={covering.id} disabled={!compatible} onClick={() => setMaterialId(covering.id)} className={`w-full rounded-xl border p-3 text-left transition ${materialId === covering.id ? 'border-slate-900 bg-slate-50' : compatible ? 'border-slate-200 hover:border-slate-300' : 'border-slate-200 bg-slate-50 opacity-55'}`}><span className="block text-xs font-bold text-slate-900">{covering.name}</span><span className="mt-0.5 block text-[10px] leading-snug text-slate-500">{covering.blurb}</span>{!compatible && covering.minPitchDegrees != null && <span className="mt-1 block text-[10px] font-semibold text-amber-700">Configured minimum pitch: {covering.minPitchDegrees}°</span>}</button>; })}
          {effectivePitch != null && config.coverings.every((covering) => !materialCompatible(covering)) && <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-[10px] leading-relaxed text-blue-800"><p className="font-bold">This pitch needs a different roofing system.</p><p className="mt-1">The configured tile and slate systems are not suitable at this pitch. Apex also handles flat and low-slope roofing, but that pricing is not configured in this demo estimator.</p><button type="button" onClick={() => onChat('I need help with a flat or low-slope roof. What can Apex do, and can I request a quote?')} className="mt-2 rounded-full bg-blue-700 px-3 py-1.5 font-semibold text-white">Ask about flat roofing</button></div>}
          <button onClick={() => setHelpChoosing((value) => !value)} className="w-full rounded-xl border border-dashed border-slate-300 p-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">Not sure - help me choose</button>
          {helpChoosing && <div className="rounded-xl bg-slate-50 p-3 text-[10px] leading-relaxed text-slate-600"><p className="font-bold text-slate-800">Quick guide</p><p className="mt-1">Concrete is the value-focused option, clay adds character, and natural slate is the premium long-life option. Options that do not suit the pitch you selected are disabled. You can change the pitch with Back.</p></div>}
        </div>}

        {step === 4 && componentsChoice === null && <div className="space-y-2">
          <button onClick={() => handleComponentsChoice('covering_only')} className="w-full rounded-xl border border-slate-200 p-3 text-left text-xs font-bold text-slate-900 transition hover:border-slate-300">Roof covering only<span className="mt-0.5 block text-[10px] font-medium text-slate-500">Keep the estimate to the main roof system</span></button>
          <button onClick={() => handleComponentsChoice('choose')} className="w-full rounded-xl border border-slate-200 p-3 text-left text-xs font-bold text-slate-900 transition hover:border-slate-300">Choose components<span className="mt-0.5 block text-[10px] font-medium text-slate-500">Pick only the items that are actually relevant</span></button>
          <button onClick={() => handleComponentsChoice('estimate_for_me')} className="w-full rounded-xl border border-slate-200 p-3 text-left text-xs font-bold text-slate-900 transition hover:border-slate-300">Estimate roofline components<span className="mt-0.5 block text-[10px] font-medium text-slate-500">I will ask the roof shape and estimate only ridge/hip/valley allowances implied by it</span></button>
        </div>}

        {step === 4 && componentsChoice === 'estimate_for_me' && <div className="space-y-2"><p className="text-xs font-semibold text-slate-800">What shape is the roof?</p><p className="text-[10px] leading-relaxed text-slate-500">This is only used to create rough roofline allowances. Guttering, insulation and other extras are never added automatically.</p><div className="grid grid-cols-2 gap-2">{([['gable','Gable'],['hip','Hip'],['valley_complex','Hip + valley']] as [RoofShape,string][]).map(([shape,label]) => <button key={shape} onClick={() => submitEstimatedForShape(shape)} className="rounded-xl border border-slate-200 p-3 text-left text-xs font-bold hover:border-slate-400">{label}</button>)}</div></div>}

        {step === 4 && componentsChoice === 'choose' && <div className="space-y-2">
          {config.components.map((component) => { const checked = component.id in selected; return <div key={component.id} className={`rounded-xl border p-2.5 transition ${checked ? 'border-slate-900 bg-slate-50' : 'border-slate-200'}`}><label className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-xs font-semibold text-slate-800"><input type="checkbox" checked={checked} onChange={(e) => setSelected((current) => { const next = { ...current }; if (e.target.checked) next[component.id] = ''; else delete next[component.id]; return next; })} className="h-4 w-4 accent-slate-900" />{component.name}</span>{checked && <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500"><input className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-xs focus:border-slate-500 focus:outline-none" inputMode="decimal" value={selected[component.id]} onChange={(e) => setSelected((current) => ({ ...current, [component.id]: e.target.value.replace(/[^0-9.]/g, '') }))} placeholder={component.unit === 'count' ? 'qty' : component.unit} />{component.unit === 'count' ? '' : component.unit}</span>}</label></div>; })}
          {needsShapeForMissing() && <div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-[10px] font-semibold text-slate-700">Roof shape for any estimated lengths</p><div className="mt-2 flex flex-wrap gap-1.5">{([['gable','Gable'],['hip','Hip'],['valley_complex','Hip + valley']] as [RoofShape,string][]).map(([shape,label]) => <button key={shape} type="button" onClick={() => setRoofShape(shape)} className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${roofShape === shape ? 'border-slate-900 bg-white text-slate-900' : 'border-slate-300 text-slate-500'}`}>{label}</button>)}</div></div>}
          <p className="text-[10px] leading-relaxed text-slate-400">Enter lengths/counts you know. Leave an estimable item blank and choose Estimate missing quantities to authorise a rough allowance.</p>
          <div className="grid grid-cols-2 gap-2"><button onClick={estimateMissing} disabled={busy || selectedIds.length === 0} className="rounded-full border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Estimate missing quantities</button><button onClick={useTheseQuantities} disabled={busy || selectedIds.length === 0} className="rounded-full px-3 py-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: accentColor }}>Use these quantities</button></div>
        </div>}

        {error && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">{error}</div>}

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <button onClick={() => { if (step === 4 && componentsChoice) { setComponentsChoice(null); setError(null); return; } setStep((s) => Math.max(0, s - 1)); }} disabled={step === 0 || busy} className="rounded-full border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">Back</button>
          {step < 4 && <button onClick={() => stepReady() && setStep((s) => s + 1)} disabled={!stepReady() || busy} className="rounded-full px-4 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-40" style={{ backgroundColor: accentColor }}>Continue</button>}
          {step === 4 && componentsChoice === 'choose' && <button onClick={() => submitDraft([])} disabled={busy} className="text-[10px] font-semibold text-slate-400 hover:text-slate-600">Skip - covering only</button>}
        </div>
      </div>
    </section>
  );
}
