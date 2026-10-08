"use client";

import { useEffect, useState } from 'react';
import { HANDOFF_KEY, resolveHandoff } from '../../lib/quick-estimate/handoff';
import type { MeasurementSet } from '../../app/supplier-pricing-tool/types';

type Resolved = ReturnType<typeof resolveHandoff>;
/** Explicit confirmation keeps an existing detailed-estimator draft intact. */
export function QuickEstimateImport({ supplierSlug, onImport }: { supplierSlug: string; onImport: (set: MeasurementSet) => void }) {
  const [pending, setPending] = useState<Resolved | null>(null);
  const [imported, setImported] = useState(false);
  useEffect(() => {
    if (supplierSlug !== 'apex-roofing' || new URLSearchParams(window.location.search).get('from') !== 'quick-roof') return;
    const frame = requestAnimationFrame(() => {
      try { const raw = sessionStorage.getItem(HANDOFF_KEY); if (raw) setPending(resolveHandoff(JSON.parse(raw))); }
      catch { /* Invalid or expired handoffs must not alter the estimator. */ }
    });
    return () => cancelAnimationFrame(frame);
  }, [supplierSlug]);
  function clear() {
    try { sessionStorage.removeItem(HANDOFF_KEY); } catch { /* Storage can be disabled. */ }
    const url = new URL(window.location.href); url.searchParams.delete('from');
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`); setPending(null);
  }
  if (imported) return <div role="status" className="mx-auto my-4 max-w-5xl rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Imported approximate roof geometry, not surveyed measurements. Check every dimension and material pitch compatibility before quoting. Product choices, removal, access and unsupported detailing have not been imported.</div>;
  if (!pending) return null;
  return <section className="mx-auto my-4 max-w-5xl rounded-xl border border-blue-200 bg-blue-50 p-5 text-sm text-slate-700" aria-label="Quick estimate import">
    <h2 className="font-bold text-slate-900">Continue from your quick roof estimate?</h2>
    <p className="mt-2">Import the {pending.endpoint === 'low' ? 'lower' : 'upper'} estimated measurement scenario. This replaces the current measurements in this estimator only after you confirm. No prices or trade discounts are copied.</p>
    {!!pending.unmapped.length && <p className="mt-2">Some high-edge, flashing or flat-perimeter details have no matching group here. They are not silently included and must be added as custom components.</p>}
    <div className="mt-4 flex flex-wrap gap-4"><button type="button" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white" onClick={() => { onImport(pending.set); setImported(true); clear(); }}>Use estimated measurements</button><button type="button" className="font-semibold text-blue-700" onClick={clear}>Keep my current estimate</button></div>
  </section>;
}
