'use client';

import { useEffect, useState } from 'react';
import type { Estimate, EstimateComponentSelection, EstimateScope } from '@/lib/pricing/estimate-engine';

import { getHelper, recordHelperSignal } from '@/lib/demo-helper/store';
import { validateDemoContact } from '@/lib/demo-helper/enquiry-preview';

interface SessionPrefill {
  facts: {
    projectType: string | null;
    roofArea: number | null;
    areaType: string | null;
    roofShape: string | null;
    pitchDegrees: number | null;
    material: string | null;
    location: string | null;
    estimateScope: EstimateScope | null;
    components: EstimateComponentSelection[];
    extras: string[];
  };
  lead: { name: string | null; email: string | null; phone: string | null };
  latestEstimate: Estimate | null;
  latestEstimates?: Estimate[];
  draftSummary: string[];
  recentUserMessages: string[];
  handoff?: {
    summary: string;
    category: 'general' | 'product_advice' | 'quotes_surveys' | 'accounts_billing' | 'emergency';
    createdAt: string;
    sourceUserMessages: string[];
  } | null;
}

interface PendingAttachment {
  name: string;
  contentType: string;
  sizeBytes: number;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/plain'];

type Phase = 'loading' | 'review' | 'edit' | 'contact' | 'submitting' | 'success';

const inputCls =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200';
const labelCls = 'mb-1 block text-[11px] font-semibold text-slate-500';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2 last:border-0">
      <span className="shrink-0 text-xs font-medium text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}

function scopeLabel(scope: EstimateScope | null) {
  if (scope === 'covering_only') return 'Roof covering only';
  if (scope === 'specified_components') return 'Covering plus specified components';
  if (scope === 'estimated_components') return 'Covering plus estimated roof components';
  return 'Not specified';
}

export function RooflineEnquiryPanel({ onClose, accentColor }: { onClose: () => void; accentColor: string }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [prefill, setPrefill] = useState<SessionPrefill | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [projectType, setProjectType] = useState('');
  const [roofArea, setRoofArea] = useState('');
  const [areaType, setAreaType] = useState('');
  const [roofShape, setRoofShape] = useState('');
  const [pitch, setPitch] = useState('');
  const [material, setMaterial] = useState('');
  const [location, setLocation] = useState('');
  const [estimateScope, setEstimateScope] = useState<EstimateScope | ''>('');
  const [extras, setExtras] = useState('');
  const [notes, setNotes] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attachments, setAttachments] = useState<PendingAttachment[]>([]);
  const [draftSummary, setDraftSummary] = useState<string[]>([]);
  const [contextSummary, setContextSummary] = useState('');
  const [contextMessages, setContextMessages] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const context = { runId: getHelper().runId, task: getHelper().current };
    fetch('/api/roofline/session', { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('Could not load session');
        return r.json();
      })
      .then((data: SessionPrefill) => {
        if (cancelled) return;
        setPrefill(data);
        setProjectType(data.facts.projectType ?? 'Roofing enquiry');
        setRoofArea(data.facts.roofArea != null ? String(data.facts.roofArea) : '');
        setAreaType(data.facts.areaType ?? '');
        setRoofShape(data.facts.roofShape ?? '');
        setPitch(data.facts.pitchDegrees != null ? String(data.facts.pitchDegrees) : '');
        setMaterial(data.latestEstimate?.project.materialLabel ?? data.facts.material ?? '');
        setLocation(data.facts.location ?? '');
        setEstimateScope(data.facts.estimateScope ?? '');
        setExtras(data.facts.extras.join(', '));
        const recent = Array.isArray(data.recentUserMessages) ? data.recentUserMessages.filter(Boolean).slice(-4) : [];
        const handoffMessages = data.handoff?.sourceUserMessages?.filter(Boolean) ?? [];
        const carriedMessages = [...new Set([...handoffMessages, ...recent])].slice(-4);
        const carriedSummary = data.handoff?.summary?.trim() || (!data.latestEstimate ? carriedMessages.at(-1) ?? '' : '');
        setContextSummary(carriedSummary);
        setContextMessages(carriedMessages);
        setNotes(carriedSummary);
        setName(data.lead.name ?? '');
        setEmail(data.lead.email ?? '');
        setPhone(data.lead.phone ?? '');
        setDraftSummary(Array.isArray(data.draftSummary) ? data.draftSummary : []);
        setPhase('review');
        if (data.latestEstimate?.total && data.latestEstimate.lineItems.length) recordHelperSignal('assistant-enquiry-open', context);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load the conversation details. You can still enter them manually.');
          setPhase('edit');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onFilesChosen = async (fileList: FileList | null) => {
    setError(null);
    if (!fileList) return;
    const next: PendingAttachment[] = [];
    for (const file of Array.from(fileList).slice(0, 5)) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`"${file.name}" is not a supported file type (images, PDF or text).`);
        continue;
      }
      if (file.size <= 0 || file.size > 2_500_000) {
        setError(`"${file.name}" must be a non-empty file under 2.5 MB.`);
        continue;
      }
      // Demo mode stores safe metadata only. A live client deployment should upload
      // the file to object storage and retain a file reference, not base64 in session JSON.
      next.push({ name: file.name, contentType: file.type, sizeBytes: file.size });
    }
    setAttachments((current) => [...current, ...next].slice(0, 5));
  };

  const submit = () => {
    const validation = validateDemoContact({ name, email, phone });
    if (validation) { setError(validation); setPhase('contact'); return; }
    // This demo intentionally does not POST contact details or file data.
    // The complete estimate stays attached in component memory for the receipt below.
    setError(null); setPhase('success');
    if (prefill?.latestEstimate?.total) recordHelperSignal('assistant-enquiry-ready');
  };

  const attachedEstimates = (prefill?.latestEstimates?.length
    ? prefill.latestEstimates : prefill?.latestEstimate ? [prefill.latestEstimate] : [])
    .filter(e => Number.isFinite(e.total)).slice().sort((a, b) => a.total - b.total);
  const money = (n: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n);
  const estimateLabel = attachedEstimates.length > 1
    ? `${money(attachedEstimates[0].total)} to ${money(attachedEstimates[attachedEstimates.length - 1].total)}`
    : attachedEstimates.length ? money(attachedEstimates[0].total) : '';

  const hasProjectDetails = !!prefill && !!(
    prefill.latestEstimate
    || prefill.facts.projectType
    || prefill.facts.roofArea
    || prefill.facts.roofShape
    || prefill.facts.pitchDegrees != null
    || prefill.facts.material
    || prefill.facts.location
    || prefill.facts.estimateScope
    || prefill.facts.components.length
    || prefill.facts.extras.length
  );
  const roofSummary = [
    roofArea ? `${roofArea} m²` : '',
    roofShape ? roofShape.replace(/_/g, ' ') : '',
    pitch ? `${pitch}°` : '',
  ].filter(Boolean).join(' · ');

  if (phase === 'loading') {
    return (
      <div className="flex h-full items-center justify-center px-6">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300" style={{ borderTopColor: accentColor }} />
          Pulling together your project details...
        </div>
      </div>
    );
  }

  if (phase === 'success') {
    return <div className="flex h-full flex-col overflow-y-auto px-5 py-6" role="status">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-xl text-emerald-700" aria-hidden="true">✓</div>
      <h2 className="text-xl font-bold text-slate-900">Here’s what Apex would receive.</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        The request and useful conversation details are already attached{estimateLabel ? ', including the indicative estimate' : ''}. <strong>This is a demo, so no email was sent.</strong> On a live site this would go straight to the business team.
      </p>
      <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
        <Row label="Customer" value={name} />
        <Row label="Contact" value={[email, phone].filter(Boolean).join(' · ')} />
        {contextSummary && <Row label="Enquiry" value={notes || contextSummary} />}
        {hasProjectDetails && <Row label="Project" value={(projectType || 'Roofing enquiry').replace(/_/g, ' ')} />}
        {roofSummary && <Row label="Roof" value={roofSummary} />}
        {material && <Row label="Covering" value={material} />}
        {location && <Row label="Location" value={location} />}
        {estimateLabel && <Row label="Indicative estimate" value={`${estimateLabel} excl. VAT`} />}
        {!contextSummary && notes && <Row label="Enquiry note" value={notes} />}
        {attachments.length > 0 && <Row label="Selected files" value={attachments.map(f => f.name).join(', ')} />}
      </div>
      {estimateLabel && <p className="mt-3 text-xs leading-relaxed text-slate-500">The full calculated scope and assumptions sit behind this summary. Prices remain indicative and subject to a proper assessment.</p>}
      <p className="mt-2 text-xs leading-relaxed text-slate-500">Selected files are represented by their names only. These form details stay in memory on this page and are not uploaded or saved.</p>
      <button type="button" onClick={onClose} className="mt-5 min-h-11 rounded-xl px-5 py-3 text-sm font-semibold text-white" style={{ backgroundColor: accentColor }}>Back to assistant</button>
    </div>;
  }

  const estimate = prefill?.latestEstimate;

  if (phase === 'review') {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-bold text-slate-900">Here is what I know so far</p>
              <p className="mt-1 text-xs text-slate-500">I have carried across what you already told me, so you do not need to type it again.</p>
            </div>
            <button onClick={onClose} className="text-xs font-semibold text-slate-500 hover:text-slate-800">Back to chat</button>
          </div>

          {contextSummary && (
            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Enquiry carried from chat</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{contextSummary}</p>
              {contextMessages.length > 1 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-[11px] font-semibold text-slate-500">View conversation details being carried across</summary>
                  <ul className="mt-2 space-y-1">
                    {contextMessages.map((message, index) => <li key={`${message}-${index}`} className="text-[11px] leading-relaxed text-slate-500">- {message}</li>)}
                  </ul>
                </details>
              )}
            </div>
          )}

          {hasProjectDetails && (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
              <Row label="Project" value={projectType || 'Roofing enquiry'} />
              <Row label="Area" value={roofArea ? `Approx. ${roofArea} m²` : 'Not specified'} />
              <Row label="Roof type" value={roofShape ? roofShape.replace(/_/g, ' ') : 'Not specified'} />
              <Row label="Pitch" value={pitch ? `Approx. ${pitch}°` : 'Not specified'} />
              <Row label="Material" value={material || 'Not specified'} />
              <Row label="Estimate scope" value={scopeLabel(estimateScope || null)} />
              {location && <Row label="Location" value={location} />}
            </div>
          )}

          {draftSummary.length > 0 && (
            <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-[11px] font-bold text-slate-700">Guided estimate draft</p>
              <ul className="mt-1.5 space-y-1">
                {draftSummary.map((line) => <li key={line} className="text-[11px] leading-relaxed text-slate-500">- {line}</li>)}
              </ul>
            </div>
          )}

          {estimate && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-4 py-3 text-white">
                <div>
                  <p className="text-xs font-semibold">Indicative estimate</p>
                  <p className="mt-0.5 text-[10px] text-slate-300">{attachedEstimates.length > 1 ? 'Both range scenarios included' : `Reference ${estimate.id}`}</p>
                </div>
                <div><p className="text-lg font-bold">{estimateLabel}</p><p className="text-[11px] text-slate-300">GBP, excluding VAT</p></div>
              </div>
              <details className="px-4 py-3"><summary className="cursor-pointer text-xs font-semibold text-slate-600">View priced scope and assumptions</summary>
                {attachedEstimates.map((item, index) => <div key={item.id} className="py-2">
                  {attachedEstimates.length > 1 && <p className="mt-2 text-xs font-bold text-slate-700">{index === 0 ? 'Lower' : 'Upper'} scenario: {money(item.total)}</p>}
                  {item.lineItems.map((line) => <Row key={`${line.catalogItemId}-${line.quantity}`} label={line.label} value={`${line.quantity.toLocaleString()} ${line.unit} - ${item.symbol}${line.subtotal.toLocaleString()}`} />)}
                  {item.assumptions.length > 0 && <div className="border-t border-slate-100 py-2">
                    <p className="text-xs font-bold text-slate-500">Pricing assumptions</p>
                    <ul className="mt-1 space-y-1">{item.assumptions.slice(0, 5).map((a, i) => <li key={i} className="text-xs leading-relaxed text-slate-500">- {a}</li>)}</ul>
                  </div>}
                </div>)}
              </details>
            </div>
          )}

          <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
            Need to change the price? Return to chat to recalculate before previewing your enquiry.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-3">
          <button onClick={() => setPhase('edit')} className="rounded-full border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
            Edit details
          </button>
          <button onClick={() => setPhase('contact')} className="rounded-full px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90" style={{ backgroundColor: accentColor }}>
            Looks good
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'edit') {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-bold text-slate-900">Edit enquiry details</p>
              <p className="mt-1 text-xs text-slate-500">Update anything the business should receive.</p>
            </div>
            <button onClick={() => setPhase('review')} className="text-xs font-semibold text-slate-500 hover:text-slate-800">Cancel</button>
          </div>

          {estimate && (
            <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
              Editing these fields changes the enquiry notes only. If you change size, material or roof type and want a new price, return to chat so the estimate can be recalculated.
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2.5 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="col-span-2">
              <label className={labelCls}>Project</label>
              <input className={inputCls} value={projectType} onChange={(e) => setProjectType(e.target.value)} placeholder="Roof replacement" />
            </div>
            <div>
              <label className={labelCls}>Roof area (m²)</label>
              <input className={inputCls} inputMode="decimal" value={roofArea} onChange={(e) => setRoofArea(e.target.value)} placeholder="200" />
            </div>
            <div>
              <label className={labelCls}>Pitch (degrees)</label>
              <input className={inputCls} inputMode="decimal" value={pitch} onChange={(e) => setPitch(e.target.value)} placeholder="30" />
            </div>
            <div>
              <label className={labelCls}>Roof type</label>
              <select className={inputCls} value={roofShape} onChange={(e) => setRoofShape(e.target.value)}>
                <option value="">Not specified</option>
                <option value="gable">Gable</option>
                <option value="hip">Hip</option>
                <option value="valley_complex">Hip and valley</option>
                <option value="flat">Flat</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Area type</label>
              <select className={inputCls} value={areaType} onChange={(e) => setAreaType(e.target.value)}>
                <option value="">Not specified</option>
                <option value="actual_roof_area">Actual roof area</option>
                <option value="plan_area">Footprint / plan area</option>
                <option value="unknown">Not sure</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Material</label>
              <input className={inputCls} value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Concrete tile" />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Location (optional)</label>
              <input className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Town / postcode" />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Other requirements (optional)</label>
              <input className={inputCls} value={extras} onChange={(e) => setExtras(e.target.value)} placeholder="e.g. insulation, fascia" />
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 bg-white p-3">
          <button onClick={() => setPhase('contact')} className="w-full rounded-full px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90" style={{ backgroundColor: accentColor }}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-bold text-slate-900">How should the team contact you?</p>
            <button type="button" className="mt-2 min-h-9 text-xs font-semibold text-blue-700" onClick={() => { setName('Sam Taylor'); setEmail('homeowner@example.com'); setPhone(''); }}>Use example contact details</button>
            <p className="mt-1 text-xs text-slate-500">Your request and known details are already attached. I just need a way to reach you.</p>
          </div>
          <button onClick={() => setPhase('review')} className="text-xs font-semibold text-slate-500 hover:text-slate-800">Review</button>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <div>
            <label className={labelCls} htmlFor="sa-enquiry-name">Name *</label>
            <input className={inputCls} id="sa-enquiry-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <div>
              <label className={labelCls} htmlFor="sa-enquiry-email">Email</label>
              <input className={inputCls} type="email" id="sa-enquiry-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </div>
            <div>
              <label className={labelCls} htmlFor="sa-enquiry-phone">Phone</label>
              <input className={inputCls} type="tel" id="sa-enquiry-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional if email supplied" autoComplete="tel" />
            </div>
          </div>
          <div className="mt-3">
            <label className={labelCls}>Enquiry summary</label>
            <textarea className={`${inputCls} min-h-[88px] resize-none`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="The assistant will carry across the request it already understands." />
          </div>
        </div>

          <div className="mt-3">
            <label className={labelCls}>Attachments (optional)</label>
            <input type="file" multiple className={`${inputCls} py-2 text-xs`} onChange={(e) => { void onFilesChosen(e.target.files); e.target.value = ''; }} />
            <p className="mt-1 text-[10px] leading-relaxed text-slate-400">Roof photos, plans, an existing quote, a survey or measurements. Up to 5 files, 2.5 MB each. Never required.</p>
            {attachments.length > 0 && (
              <ul className="mt-2 space-y-1">
                {attachments.map((file, i) => (
                  <li key={`${file.name}-${i}`} className="flex items-center justify-between gap-2 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[11px] text-slate-600">
                    <span className="truncate">{file.name} ({Math.max(1, Math.round(file.sizeBytes / 1024))} KB)</span>
                    <button onClick={() => setAttachments((current) => current.filter((_, idx) => idx !== i))} className="shrink-0 font-semibold text-slate-400 hover:text-slate-700" aria-label={`Remove ${file.name}`}>x</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

        {estimate && (
          <div className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-[11px] text-slate-600">
            {attachedEstimates.length > 1 ? 'Both range scenarios' : 'Your estimate'} ({estimateLabel}, excluding VAT) will be attached.
          </div>
        )}
        {error && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{error}</div>}
        <p className="mt-3 text-[10px] leading-relaxed text-slate-400">Demo preview only. No email is sent. On a live site this enquiry would be delivered to the business or its CRM workflow.</p>
      </div>

      <div className="border-t border-slate-200 bg-white p-3">
        <button
          onClick={submit}
          disabled={phase === 'submitting' || !name.trim() || (!email.trim() && !phone.trim())}
          className="w-full rounded-full px-4 py-3 text-xs font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ backgroundColor: accentColor }}
        >
          {phase === 'submitting' ? 'Preparing enquiry...' : 'Preview what Apex receives'}
        </button>
      </div>
    </div>
  );
}
