'use client';

import type { Estimate, EstimateLineItem, PricedDraft } from '@/lib/pricing/estimate-engine';

/**
 * V4 estimate result card (brief section 10): roof system, removal allowances
 * for re-roofs, components with quantity-source labels, ballpark total or
 * range, indicative disclaimer.
 */

const SLATE = '#0F172A';

function lineQtyLabel(line: EstimateLineItem, symbol: string): string {
  const source =
    line.quantitySource === 'heuristic'
      ? ' - estimated allowance'
      : line.quantitySource === 'area'
        ? line.catalogItemId === 'reroof_strip_allowance'
          ? ' - indicative allowance'
          : ''
        : '';
  return `${line.quantity.toLocaleString()} ${line.unit} x ${symbol}${line.rate.toLocaleString()}${source}`;
}

function isAllowance(id: string) {
  return id === 'reroof_strip_allowance' || id === 'reroof_disposal_allowance';
}

function LineRow({ estimate, line, symbol }: { estimate: Estimate; line: EstimateLineItem; symbol: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-800">{line.label}</p>
        <p className="mt-0.5 text-[10px] text-slate-400">{lineQtyLabel(line, symbol)}</p>
      </div>
      <span className="shrink-0 text-xs font-semibold text-slate-900">{symbol}{line.subtotal.toLocaleString()}</span>
    </div>
  );
}

function SingleEstimate({ estimate }: { estimate: Estimate }) {
  const covering = estimate.lineItems.filter((li) => !isAllowance(li.catalogItemId) && li.catalogItemId === estimate.project.material);
  const removal = estimate.lineItems.filter((li) => isAllowance(li.catalogItemId));
  const components = estimate.lineItems.filter((li) => li.catalogItemId !== estimate.project.material && !isAllowance(li.catalogItemId));

  return (
    <div>
      {covering.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Roof</p>
          {covering.map((line, i) => <LineRow key={i} estimate={estimate} line={line} symbol={estimate.symbol} />)}
        </div>
      )}
      {removal.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Existing roof removal (indicative allowances)</p>
          {removal.map((line, i) => <LineRow key={i} estimate={estimate} line={line} symbol={estimate.symbol} />)}
        </div>
      )}
      {components.length > 0 && (
        <div className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Additional components</p>
          {components.map((line, i) => <LineRow key={i} estimate={estimate} line={line} symbol={estimate.symbol} />)}
        </div>
      )}
    </div>
  );
}

export function EstimateResultCard({ result, accentColor }: { result: PricedDraft; accentColor: string }) {
  const low = result.mode === 'range' ? result.low : null;
  const high = result.mode === 'range' ? result.high : null;
  const range = low && high ? { low, high } : null;
  const single = result.mode === 'single' ? result.estimate : null;
  const primary = single ?? high!;
  const totalLabel = range
    ? `${range.low.symbol}${range.low.total.toLocaleString()} - ${range.high.symbol}${range.high.total.toLocaleString()}`
    : `${single!.symbol}${single!.total.toLocaleString()}`;
  const areaLabel = range
    ? `${range.low.project.roofArea.toLocaleString()}-${range.high.project.roofArea.toLocaleString()} m²`
    : `${single!.project.roofArea.toLocaleString()} m²`;

  return (
    <section className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-4 py-3 text-white" style={{ backgroundColor: SLATE }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold">Indicative Roof Estimate</p>
            <p className="mt-1 text-[11px] text-slate-300">
              {primary.project.projectType === 'reroof' ? 'Re-roof' : 'New roof'} · {areaLabel} · {primary.project.materialLabel}
            </p>
          </div>
          {result.indicative && <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-slate-200">Indicative</span>}
        </div>
      </div>

      <div className="px-4 py-3.5">
        {range ? (
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Smaller end of the size band</p>
              <SingleEstimate estimate={range.low} />
            </div>
            <div className="border-t border-dashed border-slate-200 pt-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Larger end of the size band</p>
              <SingleEstimate estimate={range.high} />
            </div>
          </div>
        ) : (
          <SingleEstimate estimate={single!} />
        )}

        <div className="mt-3 flex items-end justify-between border-t-2 border-slate-900 pt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Ballpark total</p>
            <p className="mt-0.5 text-[10px] text-slate-400">Ref {primary.id}</p>
          </div>
          <span className="text-xl font-black" style={{ color: accentColor }}>
            {totalLabel}
            <span className="ml-1 text-xs font-semibold">{primary.currency}</span>
          </span>
        </div>

        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-[10px] italic leading-relaxed text-slate-500">
          This is an indicative ballpark estimate based on the information provided. It is not a formal quotation and may change following inspection and confirmation of measurements.
        </p>
      </div>
    </section>
  );
}
