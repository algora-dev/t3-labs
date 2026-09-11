'use client';

import { useMemo, useState } from 'react';
import type { EstimateDraft, EstimateDraftComponent, PitchBandId, ProjectType, SizeBandId } from '@/lib/pricing/estimate-engine';

/**
 * V4 guided estimator (brief section 9): new vs re-roof -> size -> pitch ->
 * covering cards -> components choice. Users can go back and change previous
 * answers; a compact live summary is always visible. Commercial values
 * (bands, allowances, catalogue) come only from the server-provided config.
 */

export interface EstimatorConfig {
  coverings: { id: string; name: string; blurb: string }[];
  components: { id: string; name: string; unit: string; estimable: boolean }[];
  sizeBands: { id: string; label: string; minM2: number; maxM2: number }[];
  pitchBands: { id: string; label: string; minDegrees: number; maxDegrees: number }[];
  removal: { stripRatePerM2: number; stripLabel: string; disposalAllowancePerJob: number; disposalLabel: string; assumptionNote: string };
}

interface Props {
  config: EstimatorConfig;
  accentColor: string;
  busy: boolean;
  onSubmit: (draft: EstimateDraft) => void;
  onChat: (message: string) => void;
  onCancel: () => void;
}

type ComponentsChoice = 'covering_only' | 'choose' | 'estimate_for_me';

const STEP_TITLES = ['New roof or replacement?', 'How large is the roof?', 'What sort of pitch is it?', 'Choose a roof covering', 'Anything else to include?'];

const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none';

export function GuidedEstimator({ config, accentColor, busy, onSubmit, onChat, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [sizeBand, setSizeBand] = useState<SizeBandId | null>(null);
  const [exactArea, setExactArea] = useState('');
  const [pitchBand, setPitchBand] = useState<PitchBandId | null>(null);
  const [exactPitch, setExactPitch] = useState('');
  const [materialId, setMaterialId] = useState<string | null>(null);
  const [componentsChoice, setComponentsChoice] = useState<ComponentsChoice | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const summary = useMemo(() => {
    const parts: string[] = [];
    if (projectType) parts.push(projectType === 'reroof' ? 'Re-roof' : 'New roof');
    if (exactArea) parts.push(`${exactArea} m²`);
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
    const names = Object.keys(selected);
    if (names.length) parts.push(`${names.length} component${names.length > 1 ? 's' : ''}`);
    return parts.filter(Boolean);
  }, [projectType, sizeBand, exactArea, pitchBand, exactPitch, materialId, selected, config]);

  const selectedIds = Object.keys(selected);
  const buildComponents = (heuristic: boolean): EstimateDraftComponent[] =>
    config.components.map((c) => {
      const qtyRaw = selected[c.id];
      const qty = qtyRaw ? Number(qtyRaw) : NaN;
      return {
        componentId: c.id,
        selected: true,
        quantity: Number.isFinite(qty) && qty > 0 ? qty : null,
        unit: c.unit,
        quantitySource: Number.isFinite(qty) && qty > 0 ? ('user' as const) : heuristic ? ('heuristic' as const) : undefined,
      };
    });

  const submitDraft = (components: EstimateDraftComponent[]) => {
    if (!projectType || !materialId) return;
    const area = exactArea
      ? { exactM2: Number(exactArea), source: 'user_exact' as const }
      : { band: sizeBand ?? 'medium', source: 'configured_band' as const };
    const pitch = exactPitch
      ? { degrees: Number(exactPitch), source: 'user_exact' as const }
      : { band: pitchBand ?? 'medium', source: 'user_band' as const };
    onSubmit({ projectType, mode: 'guided', area, pitch, materialId, components });
  };

  const handleComponentsChoice = (choice: ComponentsChoice) => {
    setError(null);
    if (choice === 'covering_only') {
      setComponentsChoice(choice);
      submitDraft([]);
      return;
    }
    if (choice === 'estimate_for_me') {
      setComponentsChoice(choice);
      const estimable = config.components.filter((c) => c.estimable);
      setSelected(Object.fromEntries(estimable.map((c) => [c.id, ''])));
      submitDraft(estimable.map((c) => ({ componentId: c.id, selected: true, quantity: null, unit: c.unit, quantitySource: 'heuristic' as const })));
      return;
    }
    setComponentsChoice('choose');
  };

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
      setError(`I can't safely estimate ${notEstimable.map((id) => config.components.find((c) => c.id === id)?.name ?? id).join(', ')} - please enter a length or untick them.`);
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
        {summary.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {summary.map((part) => (
              <span key={part} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">{part}</span>
            ))}
          </div>
        )}

        {step === 0 && (
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setProjectType('new_roof')} className={`rounded-xl border p-3 text-left text-xs font-bold transition ${projectType === 'new_roof' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
              New Roof
              <span className="mt-0.5 block text-[10px] font-medium text-slate-500">No removal of an existing roof</span>
            </button>
            <button onClick={() => setProjectType('reroof')} className={`rounded-xl border p-3 text-left text-xs font-bold transition ${projectType === 'reroof' ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
              Re-Roof
              <span className="mt-0.5 block text-[10px] font-medium text-slate-500">Includes ${config.removal.stripRatePerM2}/m² strip + ${config.removal.disposalAllowancePerJob.toLocaleString()} disposal allowances</span>
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {config.sizeBands.map((band) => (
                <button key={band.id} onClick={() => { setSizeBand(band.id as SizeBandId); setExactArea(''); }} className={`rounded-xl border p-3 text-left text-xs font-bold transition ${sizeBand === band.id && !exactArea ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  {band.label}
                  <span className="mt-0.5 block text-[10px] font-medium text-slate-500">{band.minM2}-{band.maxM2} m²</span>
                </button>
              ))}
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-500">Or enter the exact area (m²)</label>
              <input
                className={inputCls}
                inputMode="decimal"
                value={exactArea}
                onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, ''); if (v === '' || Number(v) > 0) { setExactArea(v); if (v) setSizeBand(null); } }}
                placeholder="e.g. 185"
              />
              {exactArea && <p className="mt-1 text-[10px] text-slate-400">Using your exact measurement gives a single figure instead of a range.</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {config.pitchBands.map((band) => (
                <button key={band.id} onClick={() => { setPitchBand(band.id as PitchBandId); setExactPitch(''); }} className={`rounded-xl border p-3 text-left text-xs font-bold transition ${pitchBand === band.id && !exactPitch ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  {band.label}
                  <span className="mt-0.5 block text-[10px] font-medium text-slate-500">{band.maxDegrees >= 85 ? `${band.minDegrees}°+` : `${band.minDegrees}-${band.maxDegrees}°`}</span>
                </button>
              ))}
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold text-slate-500">Or enter the exact pitch (degrees)</label>
              <input
                className={inputCls}
                inputMode="decimal"
                value={exactPitch}
                onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, ''); if (v === '' || Number(v) >= 0) { setExactPitch(v); if (v) setPitchBand(null); } }}
                placeholder="e.g. 27"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-2">
            {config.coverings.map((covering) => (
              <button key={covering.id} onClick={() => setMaterialId(covering.id)} className={`w-full rounded-xl border p-3 text-left transition ${materialId === covering.id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <span className="block text-xs font-bold text-slate-900">{covering.name}</span>
                <span className="mt-0.5 block text-[10px] leading-snug text-slate-500">{covering.blurb}</span>
              </button>
            ))}
            <button onClick={() => onChat("I'm not sure which roof covering suits my project. Can you help me choose?")} className="w-full rounded-xl border border-dashed border-slate-300 p-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              Not sure - help me choose
            </button>
          </div>
        )}

        {step === 4 && componentsChoice === null && (
          <div className="space-y-2">
            <button onClick={() => handleComponentsChoice('covering_only')} className="w-full rounded-xl border border-slate-200 p-3 text-left text-xs font-bold text-slate-900 transition hover:border-slate-300">
              Roof covering only
              <span className="mt-0.5 block text-[10px] font-medium text-slate-500">Keep the estimate to the main roof system</span>
            </button>
            <button onClick={() => handleComponentsChoice('choose')} className="w-full rounded-xl border border-slate-200 p-3 text-left text-xs font-bold text-slate-900 transition hover:border-slate-300">
              Choose components
              <span className="mt-0.5 block text-[10px] font-medium text-slate-500">Pick items and add approximate lengths</span>
            </button>
            <button onClick={() => handleComponentsChoice('estimate_for_me')} className="w-full rounded-xl border border-slate-200 p-3 text-left text-xs font-bold text-slate-900 transition hover:border-slate-300">
              Estimate components for me
              <span className="mt-0.5 block text-[10px] font-medium text-slate-500">Use indicative allowances for the typical roof components</span>
            </button>
          </div>
        )}

        {step === 4 && componentsChoice === 'choose' && (
          <div className="space-y-2">
            {config.components.map((component) => {
              const checked = component.id in selected;
              return (
                <div key={component.id} className={`rounded-xl border p-2.5 transition ${checked ? 'border-slate-900 bg-slate-50' : 'border-slate-200'}`}>
                  <label className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => setSelected((current) => {
                          const next = { ...current };
                          if (e.target.checked) next[component.id] = '';
                          else delete next[component.id];
                          return next;
                        })}
                        className="h-4 w-4 accent-slate-900"
                      />
                      {component.name}
                    </span>
                    {checked && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                        <input
                          className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-xs focus:border-slate-500 focus:outline-none"
                          inputMode="decimal"
                          value={selected[component.id]}
                          onChange={(e) => setSelected((current) => ({ ...current, [component.id]: e.target.value.replace(/[^0-9.]/g, '') }))}
                          placeholder={component.unit === 'count' ? 'qty' : `${component.unit}`}
                        />
                        {component.unit === 'count' ? '' : component.unit}
                      </span>
                    )}
                  </label>
                </div>
              );
            })}
            <p className="text-[10px] leading-relaxed text-slate-400">If you don&apos;t know a length, leave it blank and use &quot;Estimate missing quantities&quot; - I&apos;ll mark those as estimated allowances, never as measured figures.</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={estimateMissing} disabled={busy || selectedIds.length === 0} className="rounded-full border border-slate-300 px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">Estimate missing quantities</button>
              <button onClick={useTheseQuantities} disabled={busy || selectedIds.length === 0} className="rounded-full px-3 py-2.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50" style={{ backgroundColor: accentColor }}>Use these quantities</button>
            </div>
          </div>
        )}

        {error && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">{error}</div>}

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || busy} className="rounded-full border border-slate-300 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40">
            Back
          </button>
          {step < 4 && componentsChoice !== 'choose' && (
            <button
              onClick={() => stepReady() && setStep((s) => s + 1)}
              disabled={!stepReady() || busy}
              className="rounded-full px-4 py-2 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: accentColor }}
            >
              {step === 3 ? 'Next' : 'Continue'}
            </button>
          )}
          {step === 4 && componentsChoice === 'choose' && (
            <button onClick={() => submitDraft(buildComponents(false))} disabled={busy} className="text-[10px] font-semibold text-slate-400 hover:text-slate-600">
              Skip - covering only
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
