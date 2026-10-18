// Main flow orchestrator: Step 1 (entry mode + inline upload / sub-choice)
// - in-tool takeoff station (measure a plan) OR measurement entry - one
// product step per populated group - output. Standard/Advanced mode is a
// persistent toggle held here. Fully self-contained: no links out to any
// other tool.

'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { EntryMode, HaveSubMode, MeasurementSet, Mode } from './types';
import { emptyMeasurementSet, GROUP_DEFS } from './types';
import type { SupplierProduct } from './types';
import { StepProgress } from './StepShell';
import { EntryModeStep } from './EntryModeStep';
import { PricingModeChoice, includeLabourFor } from './PricingModeChoice';
import type { PricingMode } from './PricingModeChoice';
import { MeasureEntryStep } from './MeasureEntryStep';
import { ProductStep } from './ProductStep';
import { OutputView } from './OutputView';
import { CustomComponentsStep } from './CustomComponentsStep';
import { TakeoffStation, stageSlug } from './TakeoffStation';
import { tradeUnitPrice, useSupplierConfig } from './supplierConfig';
import { readAdminData, effectiveTrade } from './adminData';
import { useFreeToolsAuth } from '../_components/FreeToolsAuthProvider';
import { QuickEstimateImport } from '../../components/quick-estimate/QuickEstimateImport';
import { DemoPlanExercise } from '../../components/demo-journey/DemoPlanExercise';
import { useDemoJourney } from '../../components/demo-journey/useDemoJourney';
import { applyDemoRecipe, createDemoMeasurements } from '../../lib/demo-journey/samples';
import { DEMO_ACTION_EVENT, actionFromEvent, recordDemoFailure, recordDemoSignal, updateJourney } from '../../lib/demo-journey/store';
import { updateConversion } from '../../lib/demo-conversion/store';
import { priceOutput } from './pricing';

/** Session persistence: the whole in-progress flow survives Back navigation,
 *  refreshes and the output -> back loop. sessionStorage (not localStorage)
 *  so genuinely leaving (closing the tab) starts fresh. */
const FLOW_KEY = '***';

interface PersistedFlow {
  entryMode: EntryMode | null;
  haveSubMode: HaveSubMode | null;
  pricingMode: PricingMode | null;
  measureSet: MeasurementSet;
  mode: Mode;
  flowSpeed: 'guide' | 'fast';
  step: number;
  guidedSamplePlan?: boolean;
}

function readPersisted(key = FLOW_KEY): PersistedFlow | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const p = JSON.parse(raw) as PersistedFlow;
    if (!p?.measureSet?.groups || typeof p.step !== 'number') return null;
    return p;
  } catch {
    return null;
  }
}

function PortalFlowReady() {
  const { config, basePath } = useSupplierConfig();
  // Keep Apex training jobs out of other suppliers' saved demo flows.
  const storageKey = config.slug === 'apex-roofing' ? 'apex.supplier.flow.v1' : config.slug === 'roofline-roofing' ? 'roofline.supplier.flow.v1' : FLOW_KEY;
  const restored = readPersisted(storageKey) ?? (config.slug === 'apex-roofing' ? readPersisted() : null);
  const journey = useDemoJourney();
  const [samplePlan, setSamplePlan] = useState(restored?.guidedSamplePlan ?? false);
  const [sampleRevision, setSampleRevision] = useState(0);
  const [entryMode, setEntryMode] = useState<EntryMode | null>(restored?.entryMode ?? null);
  const [haveSubMode, setHaveSubMode] = useState<HaveSubMode | null>(restored?.haveSubMode ?? null);
  const [pricingMode, setPricingMode] = useState<PricingMode | null>(restored?.pricingMode ?? null);
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [planUrl, setPlanUrl] = useState<string | null>(null);
  const [measureSet, setMeasureSet] = useState<MeasurementSet>(restored?.measureSet ?? emptyMeasurementSet());
  // Plan images captured at the takeoff station (annotated + originals) -
  // handed to the send-to-supplier enquiry as pre-attached files.
  const [planImages, setPlanImages] = useState<{ name: string; dataUrl: string; annotated: boolean }[] | null>(null);
  const [mode, setMode] = useState<Mode>(restored?.mode ?? 'standard');
  const [step, setStep] = useState(() => {
    // A restored takeoff flow at the station step has no plan file to
    // re-render - drop to start (measurements survive for the manual edit).
    if (restored && restored.entryMode === 'measure' && restored.step === 2 && !restored.guidedSamplePlan) return 1;
    return restored?.step ?? 1;
  });
  // Guide (one product group per page) vs Fast (all groups on one page).
  // Mirrors the takeoff tool's Guide me / Fast mode switch.
  const [flowSpeed, setFlowSpeed] = useState<'guide' | 'fast'>(restored?.flowSpeed ?? 'guide');
  // Header brand click: offer go-back vs restart instead of wiping
  const [restartOpen, setRestartOpen] = useState(false);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('entry');
    if (requested !== 'plan' && requested !== 'measurements') return;
    const hasSavedWork = restored && (restored.step > 1 || Object.values(restored.measureSet.groups).some(g => g.entries.length > 0));
    if (hasSavedWork) return; // Never discard measurements when following an exploration link.
    // Location search is unreadable during SSR; the one-time URL intent is applied after hydration.
    // Roofline uses these intents to make website CTAs feel like one continuous experience.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (requested === 'plan') { setEntryMode('measure'); setHaveSubMode(null); }
    if (requested === 'measurements') {
      setEntryMode('have');
      setHaveSubMode(config.slug === 'roofline-roofing' ? 'actual' : null);
    }
  // Initial route intent only. Later selections belong to the visitor.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist after every change so Back/refresh/output-return never loses work
  useEffect(() => {
    try {
      const p: PersistedFlow = { entryMode, haveSubMode, pricingMode, measureSet, mode, flowSpeed, step, guidedSamplePlan: samplePlan };
      window.sessionStorage.setItem(storageKey, JSON.stringify(p));
    } catch { /* ignore quota */ }
  }, [entryMode, haveSubMode, pricingMode, measureSet, mode, flowSpeed, step, samplePlan, storageKey]);

  const populated = GROUP_DEFS.filter(g => measureSet.groups[g.key].entries.length > 0);
  const productDefs = populated;

  // Trade pricing (Phase 5): logged-in users see trade prices when the
  // supplier config allows it; anonymous users always see baseline prices.
  // When the login feature is OFF nobody can log in, so trade-requires-login
  // can never be satisfied - treat trade pricing as public in that case.
  const { user, signInWithDemo } = useFreeToolsAuth();
  // Supply-mode choice (materials only vs materials + install). Bypassed
  // (labour included) when the supplier config disables the feature.
  const showPricingMode = config.features.pricingMode;
  const includeLabour = showPricingMode ? includeLabourFor(pricingMode) : true;
  const showTrade = (config.features.login && user != null) || !config.tradeRequiresLogin;
  const trade = effectiveTrade(config, readAdminData(config.slug, config), user?.email);
  const catalog = useMemo<SupplierProduct[]>(() =>
    showTrade
      ? config.products.map(p => ({ ...p, unitPrice: tradeUnitPrice(p, config, trade.pct) }))
      : config.products,
    [config, showTrade, trade.pct]);

  const steps = [
    { key: 'mode', label: 'How do you want to price this job?' },
    ...(entryMode === 'measure'
      ? [{ key: 'takeoff', label: 'Measure your plan' }]
      : [{ key: 'measure', label: 'Measurements & products' }]),
    // manual flow assigns products inline on the measurement pages (merged
    // flow) - only the takeoff path gets separate product steps.
    ...(entryMode === 'measure'
      ? productDefs.map(d => ({ key: d.key, label: `Products - ${d.label}` }))
      : []),
    { key: 'custom', label: 'Custom components' },
    { key: 'output', label: 'Output' },
  ];
  const currentStep = Math.min(step, steps.length);
  const productStepIdx = step - 3; // 0-based index into productDefs
  const activeGroupKey = step >= 3 && productStepIdx < productDefs.length ? productDefs[productStepIdx].key : null;
  // custom components step sits between the last product/measure step and
  // the output in BOTH flows (manual + takeoff).
  const customStepNum = 3 + (entryMode === 'measure' ? productDefs.length : 0);
  const outputStepNum = customStepNum + 1;

  // Keep the URL hash in sync with the current stage so the user always
  // knows where they are (e.g. #digital-takeoff, #products-ridges, #output).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const slug = stageSlug(step, entryMode, activeGroupKey);
    if (window.location.hash !== slug) {
      window.history.replaceState(null, '', `${basePath}${window.location.search}${slug}`);
    }
  }, [step, entryMode, activeGroupKey, basePath]);

  function reset() {
    setSamplePlan(false);
    setEntryMode(null);
    setHaveSubMode(null);
    setPricingMode(null);
    setPlanFile(null);
    if (planUrl) URL.revokeObjectURL(planUrl);
    setPlanUrl(null);
    setMeasureSet(emptyMeasurementSet());
    setStep(1);
    try { window.sessionStorage.removeItem(storageKey); } catch { /* ignore */ }
  }

  // Header brand click restarts the flow (choice modal keeps progress)
  const hasProgress = step > 1
    || Object.values(measureSet.groups).some(g => g.entries.length > 0)
    || measureSet.appliedProducts.length > 0
    || (measureSet.customComponents?.length ?? 0) > 0;
  const exampleTotals = useMemo(() => priceOutput(measureSet, catalog, includeLabour), [measureSet, catalog, includeLabour]);
  const publicTotals = useMemo(() => priceOutput(measureSet, config.products, includeLabour), [measureSet, config.products, includeLabour]);
  useEffect(() => {
    if (config.slug !== 'apex-roofing' || step !== outputStepNum || !exampleTotals.lines.length) return;
    recordDemoSignal('detailed-output');
    updateConversion({ type: 'interact', key: 'detailed', at: Date.now() });
    if (showTrade) recordDemoSignal('trade-preview');
  }, [config.slug, step, outputStepNum, exampleTotals, showTrade, journey.attempted]);
  useEffect(() => {
    if (config.slug !== 'apex-roofing') return;
    const onDemoAction = (event: Event) => {
      const action = actionFromEvent(event);
      if (!['detailed-example', 'plan-example', 'trade-example'].includes(action ?? '')) return;
      const hasMeasurements = Object.values(measureSet.groups).some(group => group.entries.length > 0);
      const replacesDraft = action !== 'trade-example' || !hasMeasurements;
      if (replacesDraft && (hasProgress || planFile) && !window.confirm('Load this demo example? This replaces the current estimator draft and any in-progress drawing in this tab.')) {
        updateJourney({ type: 'cancel' }); return;
      }
      try {
        if (action === 'trade-example' && hasMeasurements) {
          signInWithDemo(); setStep(outputStepNum); return;
        }
        const example = action === 'plan-example' ? emptyMeasurementSet() : createDemoMeasurements(config.products);
        setMeasureSet(example); setPlanImages(null); setPlanFile(null);
        if (planUrl) URL.revokeObjectURL(planUrl);
        setPlanUrl(null); setSamplePlan(action === 'plan-example');
        if (action === 'plan-example') setSampleRevision(value => value + 1);
        setMode('standard'); setFlowSpeed('fast'); setPricingMode('supplyInstall');
        setEntryMode(action === 'plan-example' ? 'measure' : 'have'); setHaveSubMode('actual');
        if (action === 'trade-example') { signInWithDemo(); setStep(4); }
        else setStep(2);
      } catch {
        recordDemoFailure(action === 'plan-example' ? 'plan' : action === 'trade-example' ? 'trade' : 'detailed');
      }
    };
    window.addEventListener(DEMO_ACTION_EVENT, onDemoAction);
    return () => window.removeEventListener(DEMO_ACTION_EVENT, onDemoAction);
  }, [config.slug, config.products, measureSet, hasProgress, planFile, planUrl, outputStepNum, signInWithDemo]);

  useEffect(() => {
    const restart = () => { if (hasProgress) setRestartOpen(true); };
    window.addEventListener('qc-spt-restart', restart);
    return () => window.removeEventListener('qc-spt-restart', restart);
  }, [hasProgress]);
  // Warn before closing the tab with a job in progress (browser prompt)
  useEffect(() => {
    if (!hasProgress) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [hasProgress]);

  function handleTakeoffFinish(set: MeasurementSet, planImages?: { name: string; dataUrl: string; annotated: boolean }[]) {
    setSamplePlan(false);
    setMeasureSet(set);
    if (set.groups.roofAreas.entries.length) {
      recordDemoSignal('plan-transfer');
      updateConversion({ type: 'interact', key: 'plan', at: Date.now() });
    }
    setPlanImages(planImages ?? null);
    // skip the manual entry step - measurements came from the station
    setStep(3);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <QuickEstimateImport supplierSlug={config.slug} onImport={(set) => {
        setSamplePlan(false);
        setMeasureSet(set);
        setEntryMode('have');
        setHaveSubMode('actual');
        setPricingMode('supplyInstall');
        setPlanFile(null);
        if (planUrl) URL.revokeObjectURL(planUrl);
        setPlanUrl(null);
        setPlanImages(null);
        setStep(2);
      }} />
      {step < 3 && (
        <StepProgress steps={steps} current={currentStep} />
      )}
      <div className="mx-auto max-w-5xl px-4 py-6 pb-16">
        {journey.active && config.slug === 'apex-roofing' && step >= 2 && !samplePlan && (
          <section className="ag-demo-work-note" aria-label="Demo estimate scope">
            <strong>{journey.current === 'trade' ? 'The same job, with example trade prices' : 'Your measurements and selected products, together'}</strong>
            <p>This is a selected-product estimate, not a full roof quotation. Read the output scope: access, removal and other unselected work are not added here.</p>
            {journey.current === 'trade' && showTrade && <div className="ag-trade-comparison">
              <div><span>Public material subtotal</span><b>£{publicTotals.material.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</b></div>
              <div><span>Example trade material subtotal</span><b>£{exampleTotals.material.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</b></div>
              <p>Same measurements. Configured product rates change; installation rates do not. Prices exclude VAT. This is a local demo account, not a real login.</p>
            </div>}
          </section>
        )}
        {step === 2 && entryMode === 'measure' && samplePlan && <DemoPlanExercise key={sampleRevision}
          onCancel={() => { setSamplePlan(false); setStep(1); }}
          onFinish={(set) => handleTakeoffFinish(applyDemoRecipe(set, config.products))}
        />}

        {/* Persistent Standard/Advanced + Guide/Fast toggles - entry step onward, but NOT on the takeoff step */}
        {step >= 2 && !(step === 2 && entryMode === 'measure') && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-0.5 w-fit">
                <button
                  onClick={() => setMode('standard')}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${mode === 'standard' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setMode('advanced')}
                  title="Advanced adds per-entry products, labour, waste and overrides - your choice is remembered across steps"
                  className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${mode === 'advanced' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                >
                  Advanced
                </button>
              </div>
              {step >= 2 && (
                <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-0.5 w-fit">
                  <button
                    onClick={() => setFlowSpeed('guide')}
                    title="Step by step, one page at a time with diagrams"
                    className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${flowSpeed === 'guide' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                  >
                    Guide me
                  </button>
                  <button
                    onClick={() => setFlowSpeed('fast')}
                    title="Everything on one page"
                    className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${flowSpeed === 'fast' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
                  >
                    Fast mode
                  </button>
                </div>
              )}
            </div>
            <span className="text-xs text-slate-400">
              {mode === 'standard' ? 'Fast materials pricing' : 'Detailed job costing - per-entry products, labour, waste, overrides'}
            </span>
          </div>
        )}

        {step === 1 && (
          <EntryModeStep
            entryMode={entryMode}
            setEntryMode={setEntryMode}
            haveSubMode={haveSubMode}
            setHaveSubMode={setHaveSubMode}
            pricingMode={pricingMode}
            setPricingMode={setPricingMode}
            showPricingMode={showPricingMode}
            planFile={planFile}
            setPlanFile={f => {
              if (planUrl) URL.revokeObjectURL(planUrl);
              setPlanFile(f);
              setPlanUrl(f ? URL.createObjectURL(f) : null);
            }}
            onNext={() => {
              if (entryMode === 'have' && haveSubMode === 'plan') {
                setMeasureSet({ ...emptyMeasurementSet(), entryPath: 'plan' });
              } else {
                setMeasureSet({ ...emptyMeasurementSet(), entryPath: entryMode === 'measure' ? 'measure' : 'actual' });
              }
              setStep(2);
            }}
          />
        )}

        {/* Step 2a: in-tool takeoff station (measure a plan) */}
        {step === 2 && entryMode === 'measure' && !samplePlan && planUrl && (
          <TakeoffStation planUrl={planUrl} onFinish={handleTakeoffFinish} contained={config.slug === 'apex-roofing' && journey.active} />
        )}

        {/* Step 2b: manual measurement entry (have measurements).
            Merged flow: entry + product assignment happen on the SAME page
            per group (guide = one group per page, fast = all stacked).
            Next goes straight to the output - there is no separate product phase. */}
        {step === 2 && entryMode !== 'measure' && (
          <MeasureEntryStep
            measureSet={measureSet}
            setMeasureSet={setMeasureSet}
            flowSpeed={flowSpeed}
            catalog={catalog}
            mode={mode}
            includeLabour={includeLabour}
            onBack={() => setStep(1)}
            onNext={() => setStep(customStepNum)}
          />
        )}

        {/* Product assignment: Fast mode = every populated group on one page;
            Guide = one group per step. */}
        {step >= 3 && productStepIdx < productDefs.length && flowSpeed === 'fast' && entryMode === 'measure' && (
          <div className="space-y-4">
            {productDefs.map(def => (
              <ProductStep
                key={def.key}
                def={def}
                measureSet={measureSet}
                catalog={catalog}
                setMeasureSet={setMeasureSet}
                mode={mode}
                includeLabour={includeLabour}
                hideNav
                onBack={() => setStep(2)}
                onNext={() => {}}
                stepNum={productDefs.indexOf(def) + 1}
                totalSteps={productDefs.length}
              />
            ))}
            <div className="flex items-center justify-between pt-2">
              <button onClick={() => setStep(2)} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:border-slate-400 transition">
                Back
              </button>
              <button
                onClick={() => setStep(customStepNum)}
                disabled={catalog.length === 0 || !measureSet.appliedProducts.some(ap => productDefs.some(d => d.key === ap.groupKey))}
                className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 hover:shadow-[0_0_16px_rgba(37,99,235,0.5)] disabled:opacity-40"
              >
                Next: Custom components
              </button>
            </div>
          </div>
        )}

        {step >= 3 && flowSpeed === 'guide' && entryMode === 'measure' && productStepIdx < productDefs.length && productStepIdx >= 0 && (
          <ProductStep
            def={productDefs[productStepIdx]}
            measureSet={measureSet}
            catalog={catalog}
            setMeasureSet={setMeasureSet}
            mode={mode}
            includeLabour={includeLabour}
            onBack={() => setStep(step - 1)}
            onNext={() => setStep(step + 1)}
            stepNum={productStepIdx + 1}
            totalSteps={productDefs.length}
          />
        )}

        {/* Custom components: final step before the output in both flows */}
        {step === customStepNum && (
          <CustomComponentsStep
            measureSet={measureSet}
            setMeasureSet={setMeasureSet}
            includeLabour={includeLabour}
            onBack={() => setStep(customStepNum - 1)}
            onNext={() => setStep(outputStepNum)}
          />
        )}

        {step >= outputStepNum && (
          <OutputView
            measureSet={measureSet}
            catalog={catalog}
            baselineCatalog={config.products}
            showTrade={showTrade}
            tradeLabel={showTrade && trade.pct > 0 ? trade.label : null}
            includeLabour={includeLabour}
            pricingMode={showPricingMode ? pricingMode : null}
            onBack={() => setStep(customStepNum)}
            onAddCustom={() => setStep(customStepNum)}
            onRestart={reset}
            planImages={planImages ?? undefined}
          />
        )}
      </div>

      {/* Header restart choice: keep the job or start fresh */}
      {restartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-xl p-6 text-center">
            <h3 className="text-base font-bold text-slate-900">You have a job in progress</h3>
            <p className="mt-1 text-sm text-slate-500">Everything is saved - your measurements, products and choices. Go back to carry on where you left off, or start fresh.</p>
            <div className="mt-4 grid gap-2">
              <button
                onClick={() => setRestartOpen(false)}
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition cursor-pointer"
              >
                Go back to my job
              </button>
              <button
                onClick={() => { reset(); setRestartOpen(false); }}
                className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-600 hover:border-slate-400 transition cursor-pointer"
              >
                Start a new job (clears everything)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Read browser drafts only after hydration, so a saved job cannot mismatch the server HTML.
const subscribeHydration = () => () => {};
export function PortalFlow() {
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  return hydrated ? <PortalFlowReady /> : <div className="p-8 text-sm text-slate-500" role="status">Loading your estimator...</div>;
}
