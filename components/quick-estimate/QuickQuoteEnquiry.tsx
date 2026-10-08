'use client';
import { useState, type FormEvent } from 'react';
import type { QuickResult } from '../../lib/quick-estimate/pricing';
import { ROOF_TEMPLATES } from '../../lib/quick-estimate/templates';
import { SIZE_BANDS, PITCH_BANDS } from '../../lib/quick-estimate/config';

const pounds = (v:number) => new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(v);
export function makeQuickEnquirySummary(r:QuickResult){
  const i=r.input;
  const lines=[
    'Apex Roofing — indicative roof estimate (fictional demo)',
    `Roof: ${ROOF_TEMPLATES[i.shape].label}`,
    `Footprint: ${SIZE_BANDS[i.size].min}–${SIZE_BANDS[i.size].max} m²`,
    `Pitch: ${i.shape==='flat'?'Flat':i.pitch ? `${PITCH_BANDS[i.pitch].min}–${PITCH_BANDS[i.pitch].max}°`:'Not supplied'}`,
    `Storeys: ${i.storeys}`,`Project: ${i.project}`,`Existing covering: ${i.existingMaterial ?? 'N/A'}`,
    `Preferred covering: ${i.covering}`,
    ...(i.flatExtension ? [`Flat extension: ${i.flatExtension}, covering: ${i.flatCovering}, complexity: ${i.flatComplexity ?? 'typical'}`] : []),
    `Roof area range: ${r.measurements.low.totals.roofAreaM2.toFixed(1)}–${r.measurements.high.totals.roofAreaM2.toFixed(1)} m²`,
    `Indicative price: ${r.price.low && r.price.high ? `${pounds(Math.floor(r.price.low.total/100)*100)} – ${pounds(Math.ceil(r.price.high.total/100)*100)}`:'Not available — requires review'}`,
    `Pricing status: ${r.price.status}`,`Tax: ${r.price.taxNote}`,
    `Unpriced or site-specific items: ${r.price.missing.join('; ') || 'See standard exclusions'}`,
    'This is not a formal quote. A survey may increase or decrease the price.'
  ];
  return lines.join('\n');
}
export function QuickQuoteEnquiry({result,onClose}:{result:QuickResult;onClose:()=>void}){
  const [submitted,setSubmitted]=useState(false);
  const [details,setDetails]=useState({name:'',email:'',phone:'',postcode:'',address:'',notes:'',contactPreference:'email'});
  const [attachmentNames,setAttachmentNames]=useState<string[]>([]);
  const summary=makeQuickEnquirySummary(result);
  const update=(key:keyof typeof details,value:string)=>setDetails(s=>({...s,[key]:value}));
  const submit=(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();setSubmitted(true);};
  return <section className="qr-enquiry" aria-label="Request a more accurate quote">
    <div className="qr-enquiry-head"><div><p className="qr-eyebrow">NO-OBLIGATION ENQUIRY · DEMO</p><h2>{submitted?'Here’s what Apex would receive':'Request a more accurate quote'}</h2></div><button type="button" className="qr-text-button" onClick={onClose}>Close ✕</button></div>
    {submitted ? <div role="status" className="qr-enquiry-confirm"><h3>Enquiry preview ready ✓</h3><p>This is how a qualified customer enquiry could look. <strong>No email was sent, and nothing was saved.</strong></p><dl>{Object.entries(details).filter(([k,v])=>v && k!=='contactPreference').map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>{attachmentNames.length>0&&<p>Selected files (not uploaded): {attachmentNames.join(', ')}</p>}<pre>{summary}</pre><button type="button" className="qr-button" onClick={onClose}>Return to my estimate</button></div> : <form onSubmit={submit} className="qr-enquiry-form">
      <div className="qr-enquiry-attached"><strong>✓ Your roof details and estimated range are already attached.</strong><p>You only need to tell us how to reach you and where the property is.</p></div>
      <div className="qr-enquiry-grid"><label>Full name *<input required autoComplete="name" value={details.name} onChange={e=>update('name',e.target.value)} /></label><label>Email address *<input required type="email" autoComplete="email" value={details.email} onChange={e=>update('email',e.target.value)} /></label><label>Telephone (optional)<input type="tel" autoComplete="tel" value={details.phone} onChange={e=>update('phone',e.target.value)} /></label><label>Property postcode<input autoComplete="postal-code" value={details.postcode} onChange={e=>update('postcode',e.target.value)} /></label></div>
      <label>Property address (optional)<input autoComplete="street-address" value={details.address} onChange={e=>update('address',e.target.value)} /></label>
      <label>Anything else we should know?<textarea rows={3} placeholder="Roof condition, access, timeframe, materials or anything you want to clarify…" value={details.notes} onChange={e=>update('notes',e.target.value)} /></label>
      <label>Plans or photos (optional — preview only)<input type="file" multiple accept="image/*,.pdf" onChange={e=>setAttachmentNames(Array.from(e.target.files??[]).map(f=>f.name))} /></label>
      <fieldset><legend>How would you prefer to be contacted?</legend><label><input type="radio" name="contact" checked={details.contactPreference==='email'} onChange={()=>update('contactPreference','email')} /> Email</label><label><input type="radio" name="contact" checked={details.contactPreference==='call'} onChange={()=>update('contactPreference','call')} /> Phone</label></fieldset>
      <p className="qr-muted">This is an interactive demonstration. Submitting shows a preview only; your information and selected files are not sent or stored.</p>
      <button className="qr-button" type="submit">Preview my enquiry →</button>
    </form>}
  </section>;
}
