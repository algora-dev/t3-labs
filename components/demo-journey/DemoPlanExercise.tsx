'use client';
import { useMemo, useState } from 'react';
import { SAMPLE_CORNERS, createSamplePlanMeasurements } from '../../lib/demo-journey/samples';
import { groupPitchedTotal, type MeasurementSet } from '../../app/supplier-pricing-tool/types';
export function DemoPlanExercise({ onFinish, onCancel }: { onFinish: (set: MeasurementSet) => void; onCancel: () => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState('');
  const set = useMemo(() => selected.length === 4 ? createSamplePlanMeasurements(selected) : null, [selected]);
  const next = selected.length;
  function select(i: number) {
    if (i !== next) { setError(`Select corner ${next + 1} next, following the numbers around the roof.`); return; }
    setSelected([...selected, i]); setError('');
  }
  return <section className="ag-plan-exercise" aria-label="Guided sample plan exercise">
    <div className="ag-plan-heading"><div><p className="ag-eyebrow ag-blue">GUIDED SAMPLE · SCALE ALREADY SET</p><h1>Four corners. One useful measurement.</h1><p>Trace the footprint by selecting corners 1 to 4. This training roof is 10 × 8 m, with a 30° pitch.</p></div><button className="ag-text-button" type="button" onClick={onCancel}>Use the full measuring workspace instead</button></div>
    <div className="ag-plan-layout"><div className="ag-plan-board">
      <svg viewBox="0 0 700 600" role="img" aria-label="Rectangular gable-roof plan, ten metres wide and eight metres deep, with a central ridge. Select the four numbered corner buttons.">
        <defs><pattern id="ag-plan-grid" width="25" height="25" patternUnits="userSpaceOnUse"><path d="M25 0H0V25" fill="none" stroke="#e8edf4" strokeWidth="1" /></pattern></defs>
        <rect width="700" height="600" fill="url(#ag-plan-grid)" />
        <path d="M100 90H600V490H100Z" fill="#e5effe" stroke="#334155" strokeWidth="3" />
        <path d="M100 290H600" stroke="#1769e0" strokeWidth="3" strokeDasharray="8 5" />
        <path d="M100 52H600M100 42V62M600 42V62M651 90V490M641 90H661M641 490H661" fill="none" stroke="#64748b" strokeWidth="1.5" />
        <g fill="#475569" fontFamily="Arial,sans-serif" fontSize="18" textAnchor="middle"><text x="350" y="40">10 m</text><text x="673" y="302">8 m</text><text x="350" y="185">Roof face A · 30°</text><text x="350" y="398">Roof face B · 30°</text><text x="350" y="275" fill="#1769e0">Ridge: 10 m</text><text x="350" y="548" fontSize="15">Training drawing only. Not a construction plan.</text></g>
        {selected.length > 1 && <polyline points={selected.map(i => `${SAMPLE_CORNERS[i].x},${SAMPLE_CORNERS[i].y}`).join(' ') + (selected.length === 4 ? ' 100,90' : '')} stroke="#1769e0" strokeWidth="6" fill={selected.length === 4 ? '#1769e016' : 'none'} />}
      </svg>
      {SAMPLE_CORNERS.map((p, i) => <button type="button" key={i} className={`ag-corner ${selected.includes(i) ? 'is-selected' : ''} ${next === i ? 'is-next' : ''}`} style={{ left: `${p.x / 7}%`, top: `${p.y / 6}%` }} disabled={selected.includes(i)} aria-label={`Select corner ${i + 1}`} onClick={() => select(i)}>{selected.includes(i) ? '✓' : i + 1}</button>)}
    </div><div className="ag-plan-reading"><span className="ag-eyebrow">LIVE MEASUREMENT</span><h2>{set ? 'Ready to carry across.' : `Select corner ${next + 1}`}</h2><p role="status">{set ? 'The footprint is traced. The existing pitch calculation converts it into roof surface area.' : `${selected.length} of 4 corners selected. Click the numbered points, or use Tab and Enter.`}</p>
      {error && <p className="ag-error" role="alert">{error}</p>}
      {set && <dl className="ag-metrics"><div><dt>Traced footprint</dt><dd>80 m²</dd></div><div><dt>Sloping roof surface</dt><dd>{groupPitchedTotal(set, 'roofAreas').toFixed(1)} m²</dd></div><div><dt>Pre-identified ridge</dt><dd>10 m</dd></div><div><dt>Pre-identified barges</dt><dd>{groupPitchedTotal(set, 'barges').toFixed(1)} m</dd></div></dl>}
      <p className="ag-small-copy">For this simple sample, the ridge and four barge runs are already identified. On your own drawings, the full tool lets you set the scale and measure each component.</p>
      <button className="ag-button ag-wide" type="button" disabled={!set} onClick={() => set && onFinish(set)}>Send to the estimator <span aria-hidden="true">→</span></button><button className="ag-text-button" type="button" onClick={() => { setSelected([]); setError(''); }}>Clear the trace</button>
    </div></div>
  </section>;
}
