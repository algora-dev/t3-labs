'use client';

import { useEffect, useState } from 'react';

/**
 * Enquiry flow (UX brief section 6): "Here's what I know so far" review card
 * with [Looks Good] / [Edit Details] feel, then a pre-filled form asking only
 * for missing contact fields. Never asks for anything already captured.
 * Submit wiring to /api/inquiry and /api/session is unchanged.
 */

const BLUE = '#1769E0';

interface SessionPrefill {
  facts: {
    projectType: string | null;
    roofArea: number | null;
    roofShape: string | null;
    pitchDegrees: number | null;
    material: string | null;
    location: string | null;
    extras: string[];
  };
  lead: { name: string | null; email: string | null; phone: string | null };
  latestEstimate: { id: string; total: number; currency: string; symbol: string; status: string } | null;
  lastUserMessage: string | null;
}

type Phase = 'loading' | 'review' | 'form' | 'submitting' | 'success';

const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1769E0] focus:outline-none';
const labelCls = 'mb-1 block text-[11px] font-medium text-slate-500';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 border-b border-slate-100 last:border-0">
      <span className="shrink-0 text-[11px] font-medium text-slate-500">{label}</span>
      <span className="text-right text-xs text-slate-800">{value}</span>
    </div>
  );
}

export function EnquiryPanel({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [prefill, setPrefill] = useState<SessionPrefill | null>(null);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [projectType, setProjectType] = useState('');
  const [roofArea, setRoofArea] = useState('');
  const [roofShape, setRoofShape] = useState('');
  const [pitch, setPitch] = useState('');
  const [material, setMaterial] = useState('');
  const [location, setLocation] = useState('');
  const [extras, setExtras] = useState('');
  const [notes, setNotes] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch('/api/session')
      .then((r) => r.json())
      .then((data: SessionPrefill) => {
        if (cancelled) return;
        setPrefill(data);
        setProjectType(data.facts.projectType ?? '');
        setRoofArea(data.facts.roofArea != null ? String(data.facts.roofArea) : '');
        setRoofShape(data.facts.roofShape ?? '');
        setPitch(data.facts.pitchDegrees != null ? String(data.facts.pitchDegrees) : '');
        setMaterial(data.facts.material ?? '');
        setLocation(data.facts.location ?? '');
        setExtras(data.facts.extras.join(', '));
        setNotes(data.lastUserMessage ?? '');
        setName(data.lead.name ?? '');
        setEmail(data.lead.email ?? '');
        setPhone(data.lead.phone ?? '');
        setPhase('review');
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load your details. Please try again.');
          setPhase('form');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async () => {
    setError(null);
    setPhase('submitting');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          question: notes,
          project: { projectType, roofArea, roofShape, pitchDegrees: pitch, material, location, extras: extras.split(',').map((e) => e.trim()).filter(Boolean) },
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Something went wrong. Please try again.');
      setPhase('success');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
      setPhase('form');
    }
  };

  if (phase === 'loading') {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-[#1769E0]" />
          Gathering what I know so far…
        </div>
      </div>
    );
  }

  if (phase === 'success') {
    return (
      <div className="flex h-full flex-col items-center justify-center px-5 text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-900">Enquiry prepared successfully</p>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
          Thanks - your demo enquiry has been prepared. In a live deployment this would be sent directly into the
          business&apos;s enquiry/CRM workflow. Apex Roofing is fictional, so no one will actually contact you.
        </p>
        <button
          onClick={onClose}
          className="mt-4 rounded-full px-4 py-2 text-xs font-medium text-white hover:opacity-90"
          style={{ backgroundColor: BLUE }}
        >
          Keep chatting
        </button>
      </div>
    );
  }

  const est = prefill?.latestEstimate;

  /* ---------- Review step: "Here's what I know so far" (brief section 6) ---------- */

  if (phase === 'review') {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="text-sm font-bold text-slate-900">Here&apos;s what I know so far</p>
          <p className="mt-1 text-xs text-slate-500">Everything below came from our conversation.</p>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <Row label="Project" value={projectType || 'Not specified yet'} />
            <Row label="Roof type" value={roofShape ? roofShape.replace(/_/g, ' ') : 'Not specified'} />
            <Row label="Area" value={roofArea ? `Approx. ${roofArea} m²` : 'Not specified'} />
            <Row label="Pitch" value={pitch ? `Approx. ${pitch}°` : 'Not specified'} />
            <Row label="Material" value={material || 'Not specified'} />
            {location && <Row label="Location" value={location} />}
            <Row label="Also interested in" value={extras || 'Nothing yet'} />
            {est && (
              <Row
                label="Indicative estimate"
                value={`${est.symbol}${est.total.toLocaleString()} ${est.currency} · ref ${est.id}`}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-3">
          <button
            onClick={() => setPhase('form')}
            className="rounded-full border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            Edit Details
          </button>
          <button
            onClick={() => setPhase('form')}
            className="rounded-full px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90"
            style={{ backgroundColor: BLUE }}
          >
            Looks Good
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Form step: editable pre-filled details + only missing contact fields ---------- */

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <p className="text-sm font-bold text-slate-900">Enquiry details</p>
        <p className="mt-1 text-xs text-slate-500">Pre-filled from our conversation - edit anything before sending.</p>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Project</p>
          <div className="mt-2 grid grid-cols-2 gap-2.5">
            <div className="col-span-2">
              <label className={labelCls}>Project details (e.g. full roof replacement)</label>
              <input className={inputCls} value={projectType} onChange={(e) => setProjectType(e.target.value)} placeholder="e.g. Full roof replacement" />
            </div>
            <div>
              <label className={labelCls}>Roof area (m²)</label>
              <input className={inputCls} inputMode="decimal" value={roofArea} onChange={(e) => setRoofArea(e.target.value)} placeholder="e.g. 200" />
            </div>
            <div>
              <label className={labelCls}>Pitch (degrees)</label>
              <input className={inputCls} inputMode="decimal" value={pitch} onChange={(e) => setPitch(e.target.value)} placeholder="e.g. 30" />
            </div>
            <div>
              <label className={labelCls}>Roof type</label>
              <select className={inputCls} value={roofShape} onChange={(e) => setRoofShape(e.target.value)}>
                <option value="">Not specified</option>
                <option value="gable">Gable</option>
                <option value="hip">Hip</option>
                <option value="valley_complex">Hip &amp; valley</option>
                <option value="flat">Flat</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Material</label>
              <input className={inputCls} value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g. Concrete tile" />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Location / postcode (optional)</label>
              <input className={inputCls} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Bromley" />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Also interested in (comma separated)</label>
              <input className={inputCls} value={extras} onChange={(e) => setExtras(e.target.value)} placeholder="e.g. gutters, insulation" />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Your note / question</label>
              <textarea className={`${inputCls} min-h-[64px] resize-none`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything else the team should know" />
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">How can the team reach you?</p>
          <div className="mt-2 grid grid-cols-2 gap-2.5">
            <div className="col-span-2">
              <label className={labelCls}>Name *</label>
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="At least one of email/phone" autoComplete="tel" />
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{error}</div>
        )}

        <p className="mt-3 text-[10px] leading-relaxed text-slate-400">
          Demo enquiry only - nothing is sent anywhere. Apex Roofing is a fictional business.
        </p>
      </div>

      <div className="flex gap-2 border-t border-slate-200 bg-white p-3">
        <button
          onClick={() => setPhase('review')}
          disabled={phase === 'submitting'}
          className="flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-xs font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={submit}
          disabled={phase === 'submitting' || !name.trim() || (!email.trim() && !phone.trim())}
          className="flex-1 rounded-full px-4 py-2.5 text-xs font-medium text-white hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: BLUE }}
        >
          {phase === 'submitting' ? 'Sending…' : 'Send enquiry'}
        </button>
      </div>
    </div>
  );
}
