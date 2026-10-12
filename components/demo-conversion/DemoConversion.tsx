'use client';
import { createPortal } from 'react-dom';
import { useEffect, useRef, type KeyboardEvent } from 'react';
import { useDemoHelper, useHelperSurface } from '../demo-helper/useDemoHelper';
import { useConversion } from './useConversion';
import { CORE_TASKS } from '../../lib/demo-helper/config';
import { getHelper, updateHelper, revealHelper } from '../../lib/demo-helper/store';
import { CONVERSION_OFFER, INTRO_COPY, CLOSING_COPY, EXIT_MIN_VISIT_MS, EXIT_AFTER_INTRO_MS } from '../../lib/demo-conversion/config';
import { canOfferExit } from '../../lib/demo-conversion/state';
import { getConversion, updateConversion } from '../../lib/demo-conversion/store';
import { trackDemo } from '../../lib/demo-conversion/metrics';
import { lockBodyScroll } from '../../lib/demo-helper/scroll-lock';
import './conversion.css';

const editing = () => document.activeElement?.matches('input,textarea,select,[contenteditable="true"]') ?? false;
const otherModal = () => !!document.querySelector('dialog[open]:not(.t3-cv-dialog),[aria-modal="true"]:not(.t3-cv-dialog)');
function Arrow() { return <span aria-hidden="true">↗</span>; }

/** Sales overlays wrap the real demo. They never submit an enquiry or alter a price. */
export function DemoConversion() {
  const c = useConversion();
  const h = useDemoHelper();
  const surface = useHelperSurface();
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const arrival = useRef(0);
  const introClosed = useRef(0);
  const entered = useRef(false);

  useEffect(() => {
    arrival.current = Date.now(); introClosed.current = Date.now();
    const prior = getHelper();
    const resume = prior.view !== 'welcome' || Object.values(prior.status).some(status => status !== 'untried');
    updateConversion({ type: 'initialise', resume });
    if (getConversion().modal === 'intro') updateHelper({ type: 'collapse', value: true });
    else if (prior.view === 'welcome') {
      // A reload during the intro must not resurrect the old helper welcome.
      updateHelper({ type: 'start' }); updateHelper({ type: 'collapse', value: true });
    }
  }, []);

  const coreVerified = CORE_TASKS.every(task => h.status[task] === 'observed');
  useEffect(() => {
    if (!c.ready || c.closerSeen) return;
    // Completion updates the guide. Only an explicit finish/benefit acknowledgement
    // opens the invitation, so the advanced-tool explanation is never timed away.
    if (h.view === 'finish') updateConversion({ type: 'queue', reason: coreVerified ? 'complete' : 'tour-ended' });
  }, [c.ready, c.closerSeen, h.view, coreVerified]);

  useEffect(() => {
    if (!c.pending || c.modal || c.closerSeen) return;
    const attempt = () => {
      if (document.visibilityState !== 'visible' || editing() || otherModal()
        || document.querySelector('.dh-panel.is-dragging') || surface.includes('enquiry')) return;
      updateConversion({ type: 'show-closing', reason: c.pending! });
    };
    const frame = requestAnimationFrame(attempt);
    window.addEventListener('focusout', attempt);
    document.addEventListener('visibilitychange', attempt);
    window.addEventListener('pointerup', attempt);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('focusout', attempt); document.removeEventListener('visibilitychange', attempt); window.removeEventListener('pointerup', attempt); };
  }, [c.pending, c.modal, c.closerSeen, surface]);

  useEffect(() => {
    if (!c.ready || c.modal || c.closerSeen) return;
    const enter = (event: MouseEvent) => { if (event.clientY > 60) entered.current = true; };
    const exit = (event: MouseEvent) => {
      if (event.relatedTarget || event.clientY > 8 || event.buttons) return;
      if (canOfferExit(getConversion(), {
        finePointer: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
        enteredPage: entered.current, elapsed: Date.now() - arrival.current,
        sinceIntro: Date.now() - introClosed.current,
        visible: document.visibilityState === 'visible', editing: editing(),
        dragging: !!document.querySelector('.dh-panel.is-dragging'),
        busySurface: surface.includes('enquiry'), otherModal: otherModal(),
      }, EXIT_MIN_VISIT_MS, EXIT_AFTER_INTRO_MS)) updateConversion({ type: 'show-closing', reason: 'exit' });
    };
    document.addEventListener('mousemove', enter);
    document.addEventListener('mouseout', exit);
    // Deliberately no beforeunload, history trapping, inactivity popup, or mobile back interception.
    return () => { document.removeEventListener('mousemove', enter); document.removeEventListener('mouseout', exit); };
  }, [c.ready, c.modal, c.closerSeen, surface]);

  useEffect(() => {
    const node = dialog.current;
    if (!c.modal || !node) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const releaseScroll = lockBodyScroll();
    if (!node.open) node.showModal();
    const frame = requestAnimationFrame(() => title.current?.focus({ preventScroll: true }));
    return () => {
      cancelAnimationFrame(frame);
      if (node.open) node.close();
      releaseScroll();
      requestAnimationFrame(() => {
        if (previous?.isConnected) previous.focus({ preventScroll: true });
        else (document.querySelector('#t3-demo-guide,.dh-launcher,.dh-demo-strip button') as HTMLElement | null)?.focus({ preventScroll: true });
      });
    };
  }, [c.modal]);

  function containTab(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])')).filter(node => node.getClientRects().length > 0);
    const first = controls[0], last = controls[controls.length - 1];
    if (!first) { event.preventDefault(); title.current?.focus(); return; }
    if (event.shiftKey && (document.activeElement === first || !controls.includes(document.activeElement as HTMLElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function leaveIntro(start: boolean) {
    introClosed.current = Date.now();
    trackDemo(start ? 'intro_started' : 'intro_dismissed');
    updateConversion({ type: 'dismiss-intro' });
    // Prevent a second welcome inside the helper after closing the intro.
    if (getHelper().view === 'welcome') updateHelper({ type: 'start' });
    updateHelper({ type: 'collapse', value: !start });
    if (start) requestAnimationFrame(revealHelper);
  }
  function dismiss() {
    if (c.modal === 'intro') leaveIntro(false);
    else { trackDemo('closing_dismissed', { reason: c.reason ?? undefined }); updateConversion({ type: 'dismiss-closing' }); }
  }
  function contact(kind: 'booking_clicked' | 'contact_clicked') {
    trackDemo(kind, { reason: c.reason ?? undefined }); updateConversion({ type: 'contact' });
  }
  if (!c.ready || !c.modal) return null;
  const intro = c.modal === 'intro';
  return createPortal(<dialog ref={dialog} className={`t3-cv-dialog ${intro ? 't3-cv-intro' : 't3-cv-closing'}`} aria-modal="true" aria-labelledby="t3-conversion-title" aria-describedby="t3-conversion-description" onKeyDown={containTab} onCancel={event => { event.preventDefault(); dismiss(); }}>
    <div className="t3-cv-head">
      <div className="t3-cv-brand">
        {/* The supplied T3 brand asset is preserved, including its glow. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/t3-demo-guide/t3-logo-icon-glow-transparent.png" width="52" height="52" alt="" />
        <div><b>T3 LABS</b><span>More customers. Less work.</span></div>
      </div>
      <button type="button" className="t3-cv-close" aria-label={intro ? 'Close introduction' : 'Close invitation'} onClick={dismiss}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>
    </div>
    <div className="t3-cv-body">
      <p className="t3-cv-eyebrow">{intro ? INTRO_COPY.eyebrow : CLOSING_COPY.eyebrow}</p>
      <h2 id="t3-conversion-title" ref={title} tabIndex={-1}>{intro ? INTRO_COPY.title : CLOSING_COPY.title}</h2>
      {intro ? <>
        <p id="t3-conversion-description" className="t3-cv-description">{INTRO_COPY.body}</p>
        <p className="t3-cv-freedom">{INTRO_COPY.freedom}</p>
        <p className="t3-cv-question">{INTRO_COPY.question}</p>
        <button type="button" className="t3-cv-primary" onClick={() => leaveIntro(true)}>{INTRO_COPY.action}<span aria-hidden="true">→</span></button>
        <p className="t3-cv-small t3-cv-centre">{INTRO_COPY.reassurance}</p>
        <button type="button" className="t3-cv-text t3-cv-explore" onClick={() => leaveIntro(false)}>{INTRO_COPY.secondary}</button>
      </> : <>
        <p id="t3-conversion-description" className="t3-cv-description">{CLOSING_COPY.question}</p>
        <div className="t3-cv-offer"><p className="t3-cv-offer-question">{CONVERSION_OFFER.priceLabel} <strong>{CONVERSION_OFFER.startingPrice}</strong>?</p></div>
        
        <a className="t3-cv-primary" href={CONVERSION_OFFER.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => contact('booking_clicked')}>{CONVERSION_OFFER.bookingLabel}<Arrow /></a>
        <p className="t3-cv-small t3-cv-centre">{CLOSING_COPY.callNote} Booking opens in a new tab.</p>
        <div className="t3-cv-alternatives"><a className="t3-cv-text" href={CONVERSION_OFFER.contactUrl} target="_blank" rel="noopener noreferrer" onClick={() => contact('contact_clicked')}>Ask a question instead <Arrow /></a><button type="button" className="t3-cv-text" onClick={dismiss}>Keep exploring</button></div>

      </>}
    </div>
  </dialog>, document.body);
}
