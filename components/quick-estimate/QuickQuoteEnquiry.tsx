'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { QuickResult } from '../../lib/quick-estimate/pricing';
import { ROOF_TEMPLATES } from '../../lib/quick-estimate/templates';
import { SIZE_BANDS, PITCH_BANDS } from '../../lib/quick-estimate/config';
import { recordHelperSignal, setHelperSurface } from '../../lib/demo-helper/store';
import { validateDemoContact, describeDemoFile, type DemoFile } from '../../lib/demo-helper/enquiry-preview';
const pounds = (n: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(n);
const materials: Record<string, string> = { tile: 'Concrete tiles', slate: 'Natural slate', shingle: 'Asphalt shingles', pressed_metal: 'Pressed metal tiles', longrun: 'Long-run metal', metal: 'Metal', epdm: 'EPDM rubber membrane', grp: 'GRP fibreglass', felt: 'Felt', membrane: 'Membrane', unknown: 'Not sure' };
export function makeQuickEnquirySummary(r: QuickResult) {
  const i = r.input;
  return [
    'Apex Roofing - indicative roof estimate (fictional demo)',
    `Roof: ${ROOF_TEMPLATES[i.shape].label}`,
    `Footprint: ${SIZE_BANDS[i.size].min}-${SIZE_BANDS[i.size].max} m²`,
    `Pitch: ${i.shape === 'flat' ? 'Flat' : i.pitch ? `${PITCH_BANDS[i.pitch].min}-${PITCH_BANDS[i.pitch].max}°` : 'Not supplied'}`,
    `Storeys: ${i.storeys}`, `Project: ${i.project}`, `Existing covering: ${materials[i.existingMaterial ?? ''] ?? 'N/A'}`,
    `Preferred covering: ${materials[i.covering]}`,
    ...(i.flatExtension ? [`Flat extension: ${i.flatExtension}, ${materials[i.flatCovering!]}`] : []),
    `Roof area: ${r.measurements.low.totals.roofAreaM2.toFixed(1)}-${r.measurements.high.totals.roofAreaM2.toFixed(1)} m²`,
    `Price: ${r.price.low && r.price.high ? `${pounds(Math.floor(r.price.low.total / 100) * 100)} to ${pounds(Math.ceil(r.price.high.total / 100) * 100)}` : 'Requires review'}`,
    r.price.taxNote, 'Not a formal quote. The actual price could be higher or lower.',
  ].join('\n');
}
export function QuickQuoteEnquiry({ result, onClose, guided = false, open = true }: { result: QuickResult; onClose: () => void; guided?: boolean; open?: boolean }) {
  const [submitted, setSubmitted] = useState(false);
  const [editDetails, setEditDetails] = useState(!guided);
  const [details, setDetails] = useState({ name: '', email: '', phone: '', postcode: '', address: '', notes: '', contactPreference: 'email' });
  const [files, setFiles] = useState<DemoFile[]>([]);
  const [error, setError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const i = result.input;
  const summary = makeQuickEnquirySummary(result);
  const amount = result.price.low && result.price.high ? `${pounds(Math.floor(result.price.low.total / 100) * 100)} to ${pounds(Math.ceil(result.price.high.total / 100) * 100)}` : 'Requires professional review';
  useEffect(() => {
    if (!open) return;
    setHelperSurface('quick-enquiry', 'quick');
    if (result.price.low && result.price.high) recordHelperSignal('quick-enquiry-open');
    heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ block: 'start' });
    return () => setHelperSurface('website', 'quick');
  }, [result, open]);
  function update(key: keyof typeof details, value: string) { setDetails(s => ({ ...s, [key]: value })); }
  function preparePreview(next = details) {
    const validation = validateDemoContact(next);
    if (validation) { setError(validation); return; }
    setDetails(next); setError(''); setSubmitted(true);
    if (result.price.low && result.price.high) recordHelperSignal('quick-enquiry-ready');
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'start' }); });
  }
  function exampleDetails() {
    // Explicit demo shortcut, using the same validation and current estimate.
    // Never read personal details from another form or from storage.
    return { ...details, name: 'Sam Taylor', email: 'homeowner@example.com', phone: '', postcode: 'LS1 1AA', address: '', contactPreference: 'email' };
  }
  function fillExample() {
    const hasContact = [details.name, details.email, details.phone, details.address, details.postcode].some(value => value.trim());
    if (hasContact && !window.confirm('Replace these contact details with the fictional example? Your notes and selected files will be kept.')) return;
    setDetails(exampleDetails()); setError('');
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    preparePreview();
  }
  const fields = [ ['Roof', ROOF_TEMPLATES[i.shape].label], ['Size', SIZE_BANDS[i.size].label], ['Project', i.project === 'reroof' ? 'Replace existing roof' : 'New roof'], ['Covering', materials[i.covering]], ['Indicative range', amount] ];
  return <section className="qr-enquiry" hidden={!open} aria-labelledby="quick-enquiry-heading">
    <div className="qr-enquiry-head"><div><p className="qr-eyebrow">YOUR NEXT STEP · DEMO PREVIEW</p><h2 id="quick-enquiry-heading" ref={heading} tabIndex={-1}>{submitted ? 'Here’s what Apex would receive.' : 'Request a quote.'}</h2></div><button type="button" className="qr-text-button" onClick={onClose} aria-label="Close quote enquiry">Close ×</button></div>
    {submitted ? <div className="qr-enquiry-confirm">
      <p role="status" className="qr-enquiry-attached"><strong>Enquiry preview ready. Nothing was sent.</strong><br />The business would receive your details and the complete estimate together.</p>
      <dl>{[['Name', details.name], ['Email', details.email], ['Preferred contact', details.contactPreference === 'call' ? 'Phone' : 'Email'], ...(details.phone ? [['Phone', details.phone]] : []), ...(details.address || details.postcode ? [['Property', [details.address, details.postcode].filter(Boolean).join(', ')]] : []), ...fields].map(([k,v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      {details.notes && <p><strong>Your note</strong><br />{details.notes}</p>}
      {files.length > 0 && <p><strong>Selected files, not uploaded</strong><br />{files.map(f => f.name).join(', ')}</p>}
      <p className="qr-muted">The calculation and its assumptions stay attached behind this summary. This price is a starting point, not a formal quote. {result.price.taxNote}</p>
      <details className="qr-details"><summary>View the attached estimate summary</summary><pre>{summary}</pre></details>
      <div className="qr-example-actions"><button type="button" className="qr-button" onClick={onClose}>Return to my estimate →</button><button type="button" className="qr-text-button" onClick={() => { setSubmitted(false); setEditDetails(true); }}>Edit details / add notes or files</button></div>
    </div> : <form onSubmit={submit} className="qr-enquiry-form" onKeyDown={e => {
      // Preview-only action: sandboxed HTML viewers may prohibit native form submits.
      // Keep Enter and native validity checks, without requesting any navigation.
      if (e.key !== 'Enter' || e.nativeEvent.isComposing || !(e.target instanceof HTMLInputElement)) return;
      if (['file', 'radio', 'checkbox', 'button', 'submit'].includes(e.target.type)) return;
      e.preventDefault();
      if (e.currentTarget.reportValidity()) preparePreview();
    }}>
      <div className="qr-enquiry-attached"><strong>✓ Your roof details and {amount.toLowerCase().startsWith('requires') ? 'selections' : amount} are attached.</strong><p>Tell us how to reach you. You won’t need to describe your roof again.</p></div>
      {!editDetails ? <div className="qr-enquiry-shortcut">
        <p><strong>Try it without typing.</strong><br />Preview with Sam Taylor, homeowner@example.com and postcode LS1 1AA. These are fictional contact details; the estimate above is your actual result.</p>
        <button type="button" className="qr-button" onClick={() => preparePreview(exampleDetails())}>Preview with example details →</button>
        <button type="button" className="qr-text-button" onClick={() => setEditDetails(true)}>Edit details / add notes or files</button>
        <p className="qr-muted">Demo enquiry only. Nothing is sent or uploaded.</p>
        {error && <p role="alert" className="qr-info">{error}</p>}
      </div> : <>
      <button type="button" className="qr-text-button" onClick={fillExample}>Use example contact details</button>
      <div className="qr-enquiry-grid"><label>Full name *<input required autoComplete="name" maxLength={100} value={details.name} onChange={e => update('name',e.target.value)} /></label><label>Email address *<input required type="email" autoComplete="email" maxLength={150} value={details.email} onChange={e => update('email',e.target.value)} /></label><label>Telephone (optional)<input type="tel" autoComplete="tel" maxLength={30} value={details.phone} onChange={e => update('phone',e.target.value)} /></label><label>Property postcode (optional)<input autoComplete="postal-code" maxLength={20} value={details.postcode} onChange={e => update('postcode',e.target.value)} /></label></div>
      <label>Property address (optional)<input autoComplete="street-address" maxLength={250} value={details.address} onChange={e => update('address',e.target.value)} /></label>
      <label>Anything else we should know? (optional)<textarea rows={3} maxLength={2000} placeholder="Roof condition, plans, preferred materials or when you hope to start." value={details.notes} onChange={e => update('notes',e.target.value)} /></label>
      <label>Plans or photos (optional)<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" onChange={e => {
        const selected = Array.from(e.target.files ?? []); const valid = selected.slice(0,5).map(describeDemoFile).filter((v): v is DemoFile => !!v);
        setFiles(valid); setError(selected.length > 5 || valid.length !== selected.length ? 'Select up to five images or PDFs, each under 2.5 MB. Only their names will appear in this preview.' : '');
      }} /></label>
      {files.length > 0 && <p className="qr-muted">Preview attachments: {files.map(f => f.name).join(', ')}</p>}
      <fieldset><legend>Preferred contact method</legend><label><input type="radio" name="contact" checked={details.contactPreference === 'email'} onChange={() => update('contactPreference','email')} /> Email</label><label><input type="radio" name="contact" checked={details.contactPreference === 'call'} onChange={() => update('contactPreference','call')} /> Phone</label></fieldset>
      {error && <p role="alert" className="qr-info">{error}</p>}
      <p className="qr-muted">Use example details for this demonstration. Nothing is emailed, uploaded or saved. You will see a preview of the enquiry.</p>
      <button className="qr-button" type="button" onClick={e => {
        if (e.currentTarget.form?.reportValidity()) preparePreview();
      }}>Preview my enquiry →</button>
      </>}
    </form>}
  </section>;
}
