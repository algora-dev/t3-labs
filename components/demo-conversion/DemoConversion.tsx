'use client';

import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useDemoHelper, useHelperSurface } from '../demo-helper/useDemoHelper';
import { useConversion } from './useConversion';
import { CORE_TASKS, isAdminPath } from '../../lib/demo-helper/config';
import { getHelper, updateHelper, revealHelper } from '../../lib/demo-helper/store';
import { holdMobileStart } from '../../lib/demo-helper/mobile-notice';
import { MobileNotice } from '../demo-helper/MobileNotice';
import { CONVERSION_OFFER, INTRO_COPY, TOUR_REMINDER_COPY, DASHBOARD_INTRO_COPY, CLOSING_COPY, EXPLORE_DELAY_MS, EARNED_INTERACTIONS_REQUIRED } from '../../lib/demo-conversion/config';
import { getConversion, updateConversion } from '../../lib/demo-conversion/store';
import type { MeaningfulInteraction } from '../../lib/demo-conversion/state';
import { trackDemo } from '../../lib/demo-conversion/metrics';
import { lockBodyScroll } from '../../lib/demo-helper/scroll-lock';
import './conversion.css';

const editing = () => document.activeElement?.matches('input,textarea,select,[contenteditable="true"]') ?? false;
const otherModal = () => !!document.querySelector('dialog[open]:not(.t3-cv-dialog),[aria-modal="true"]:not(.t3-cv-dialog)');
const taskEarned = (status: string) => status === 'observed';
function Arrow() { return <span aria-hidden="true">↗</span>; }

/** Sales overlays wrap the real demo. They never submit an enquiry or alter a price. */
export function DemoConversion() {
  const c = useConversion();
  const h = useDemoHelper();
  const surface = useHelperSurface();
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const [mobileHold, setMobileHold] = useState<'intro' | 'reminder' | null>(null);
  const [dwellTick, setDwellTick] = useState(0);

  useEffect(() => {
    const prior = getHelper();
    const resume = prior.view !== 'welcome' || Object.values(prior.status).some(status => status !== 'untried');
    updateConversion({ type: 'initialise', resume, at: Date.now() });
    if (getConversion().modal === 'intro') updateHelper({ type: 'collapse', value: true });
    else if (prior.view === 'welcome') {
      // A reload after the intro must not resurrect a second helper welcome.
      updateHelper({ type: 'start' });
      updateHelper({ type: 'collapse', value: true });
    }
  }, []);

  const earned = new Set<MeaningfulInteraction>(c.interactions);
  if (taskEarned(h.status.answers)) earned.add('assistant-answer');
  if (taskEarned(h.status['assistant-price'])) earned.add('assistant-price');
  if (taskEarned(h.status['quick-price'])) earned.add('quick-price');
  if (taskEarned(h.status.admin)) earned.add('dashboard');
  const earnedCount = earned.size;
  const earnedClose = earnedCount >= EARNED_INTERACTIONS_REQUIRED;
  const coreVerified = CORE_TASKS.every(task => h.status[task] === 'observed');

  // The completed guided tour does not auto-open the sales invitation. The visitor
  // explicitly asks for the business meaning from the helper. Partial/self-guided
  // journeys can still earn the timed invitation below after enough real interaction.

  useEffect(() => {
    if (!c.ready || c.modal || c.dashboardIntroSeen || !isAdminPath(path)) return;
    if (new URLSearchParams(window.location.search).get('demo') !== 'helper') return;
    updateConversion({ type: 'show-dashboard-intro' });
  }, [c.ready, c.modal, c.dashboardIntroSeen, path]);

  // Visitors who chose self-guided exploration get one helpful tour reminder at
  // four minutes. Time alone never unlocks the sales invitation.
  useEffect(() => {
    if (!c.ready || c.closerSeen || c.modal || c.exploredAt == null || c.tourReminderSeen || c.tourEngaged) return;
    const attempt = () => {
      if (Date.now() < c.exploredAt! + EXPLORE_DELAY_MS) return;
      if (document.visibilityState !== 'visible' || editing() || otherModal()
        || document.querySelector('.dh-panel.is-dragging') || surface.includes('enquiry')) return;
      updateConversion({ type: 'show-tour-reminder', at: Date.now() });
    };
    const remaining = c.exploredAt + EXPLORE_DELAY_MS - Date.now();
    let timer: number | null = null;
    if (remaining <= 0) requestAnimationFrame(attempt);
    else timer = window.setTimeout(attempt, remaining);
    window.addEventListener('focusout', attempt);
    document.addEventListener('visibilitychange', attempt);
    window.addEventListener('pointerup', attempt);
    return () => {
      if (timer != null) window.clearTimeout(timer);
      window.removeEventListener('focusout', attempt);
      document.removeEventListener('visibilitychange', attempt);
      window.removeEventListener('pointerup', attempt);
    };
  }, [c.ready, c.closerSeen, c.modal, c.exploredAt, c.tourReminderSeen, c.tourEngaged, surface]);

  // After four minutes, two meaningful interactions can earn the sales close.
  // Self-guided visitors must see the tour reminder first and then keep engaging,
  // which prevents a reminder and a sales modal appearing back-to-back.
  useEffect(() => {
    if (!c.ready || c.closerSeen || c.modal || c.pending || !earnedClose || coreVerified || c.startedAt == null) return;
    const elapsed = Date.now() >= c.startedAt + EXPLORE_DELAY_MS;
    if (!elapsed) {
      const timer = window.setTimeout(() => setDwellTick(value => value + 1), Math.max(0, c.startedAt + EXPLORE_DELAY_MS - Date.now()));
      return () => window.clearTimeout(timer);
    }
    const selfGuided = c.exploredAt != null && !c.tourEngaged;
    const engagedAfterReminder = c.reminderShownAt != null && c.lastInteractionAt != null && c.lastInteractionAt > c.reminderShownAt;
    if (selfGuided && !c.tourReminderSeen) return;
    if (c.reminderShownAt != null && !engagedAfterReminder) return;
    // Do not interrupt somebody in the middle of a guided task. A benefit screen,
    // collapsed guide or explicit finish is a natural checkpoint.
    if (h.view === 'task' && h.started) return;
    updateConversion({ type: 'queue', reason: coreVerified ? 'complete' : h.view === 'finish' ? 'tour-ended' : 'explored' });
  }, [c.ready, c.closerSeen, c.modal, c.pending, c.startedAt, c.exploredAt, c.tourEngaged, c.tourReminderSeen, c.reminderShownAt, c.lastInteractionAt, c.interactions, earnedClose, h.view, h.started, coreVerified, dwellTick]);

  useEffect(() => {
    if (!c.pending || c.modal || c.closerSeen || !earnedClose) return;
    const attempt = () => {
      if (document.visibilityState !== 'visible' || editing() || otherModal()
        || document.querySelector('.dh-panel.is-dragging') || surface.includes('enquiry')
        || (h.view === 'task' && h.started)) return;
      updateConversion({ type: 'show-closing', reason: c.pending! });
    };
    const frame = requestAnimationFrame(attempt);
    window.addEventListener('focusout', attempt);
    document.addEventListener('visibilitychange', attempt);
    window.addEventListener('pointerup', attempt);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('focusout', attempt);
      document.removeEventListener('visibilitychange', attempt);
      window.removeEventListener('pointerup', attempt);
    };
  }, [c.pending, c.modal, c.closerSeen, earnedClose, surface, h.view, h.started]);

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

  function beginHelperTour() {
    updateConversion({ type: 'tour-engaged' });
    if (getHelper().view === 'welcome') updateHelper({ type: 'start' });
    updateHelper({ type: 'collapse', value: false });
    requestAnimationFrame(revealHelper);
  }

  function leaveIntro(start: boolean) {
    trackDemo(start ? 'intro_started' : 'intro_dismissed');
    updateConversion({ type: 'dismiss-intro' });
    if (start && holdMobileStart()) { setMobileHold('intro'); return; }
    finishIntroChoice(start);
  }

  function finishIntroChoice(start: boolean) {
    if (!start) {
      updateConversion({ type: 'explore', at: Date.now() });
      if (getHelper().view === 'welcome') updateHelper({ type: 'start' });
      updateHelper({ type: 'collapse', value: true });
      return;
    }
    beginHelperTour();
  }

  function startReminderTour() {
    trackDemo('tour_reminder_started');
    updateConversion({ type: 'dismiss-tour-reminder' });
    if (holdMobileStart()) { setMobileHold('reminder'); return; }
    beginHelperTour();
  }

  function dismiss() {
    if (c.modal === 'intro') leaveIntro(false);
    else if (c.modal === 'tour-reminder') {
      trackDemo('tour_reminder_dismissed');
      updateConversion({ type: 'dismiss-tour-reminder' });
    } else if (c.modal === 'dashboard-intro') {
      updateConversion({ type: 'dismiss-dashboard-intro' });
    } else {
      trackDemo('closing_dismissed', { reason: c.reason ?? undefined });
      updateConversion({ type: 'dismiss-closing' });
    }
  }

  function contact(kind: 'booking_clicked' | 'contact_clicked') {
    trackDemo(kind, { reason: c.reason ?? undefined });
    updateConversion({ type: 'contact' });
  }

  if (!c.ready) return null;
  const intro = c.modal === 'intro';
  const reminder = c.modal === 'tour-reminder';
  const dashboardIntro = c.modal === 'dashboard-intro';
  const closeLabel = intro ? 'Close introduction' : reminder ? 'Close tour reminder' : dashboardIntro ? 'Close dashboard introduction' : 'Close invitation';

  return <>
    {mobileHold && <MobileNotice
      onContinue={() => {
        const source = mobileHold;
        setMobileHold(null);
        if (source === 'intro') finishIntroChoice(true);
        else beginHelperTour();
      }}
      onExplore={() => {
        const source = mobileHold;
        setMobileHold(null);
        if (source === 'intro') finishIntroChoice(false);
        else updateHelper({ type: 'collapse', value: true });
        requestAnimationFrame(() => (document.querySelector('.dh-launcher') as HTMLElement | null)?.focus({ preventScroll: true }));
      }} />}
    {c.modal && createPortal(<dialog ref={dialog} className={`t3-cv-dialog ${intro ? 't3-cv-intro' : reminder ? 't3-cv-reminder' : dashboardIntro ? 't3-cv-dashboard' : 't3-cv-closing'}`} aria-modal="true" aria-labelledby="t3-conversion-title" aria-describedby="t3-conversion-description" onKeyDown={containTab} onCancel={event => { event.preventDefault(); dismiss(); }}>
      <div className="t3-cv-head">
        <div className="t3-cv-brand">
          {/* The supplied T3 brand asset is preserved, including its glow. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/t3-demo-guide/t3-logo-icon-glow-transparent.png" width="52" height="52" alt="" />
          <div><b>T3 LABS</b><span>More customers. Less work.</span></div>
        </div>
        <button type="button" className="t3-cv-close" aria-label={closeLabel} onClick={dismiss}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg></button>
      </div>
      <div className="t3-cv-body">
        <p className="t3-cv-eyebrow">{intro ? INTRO_COPY.eyebrow : reminder ? TOUR_REMINDER_COPY.eyebrow : dashboardIntro ? DASHBOARD_INTRO_COPY.eyebrow : CLOSING_COPY.eyebrow}</p>
        <h2 id="t3-conversion-title" ref={title} tabIndex={-1}>{intro ? INTRO_COPY.title : reminder ? TOUR_REMINDER_COPY.title : dashboardIntro ? DASHBOARD_INTRO_COPY.title : CLOSING_COPY.title}</h2>
        {intro ? <>
          <p id="t3-conversion-description" className="t3-cv-description">{INTRO_COPY.body}</p>
          <p className="t3-cv-freedom">{INTRO_COPY.freedom}</p>
          <p className="t3-cv-question">{INTRO_COPY.question}</p>
          <button type="button" className="t3-cv-primary" onClick={() => leaveIntro(true)}>{INTRO_COPY.action}<span aria-hidden="true">→</span></button>
          <p className="t3-cv-small t3-cv-centre">{INTRO_COPY.reassurance}</p>
          <button type="button" className="t3-cv-text t3-cv-explore" onClick={() => leaveIntro(false)}>{INTRO_COPY.secondary}</button>
        </> : reminder ? <>
          <p id="t3-conversion-description" className="t3-cv-description">{TOUR_REMINDER_COPY.body}</p>
          <button type="button" className="t3-cv-primary" onClick={startReminderTour}>{TOUR_REMINDER_COPY.action}<span aria-hidden="true">→</span></button>
          <button type="button" className="t3-cv-text t3-cv-explore" onClick={dismiss}>{TOUR_REMINDER_COPY.secondary}</button>
        </> : dashboardIntro ? <>
          <p id="t3-conversion-description" className="t3-cv-description">{DASHBOARD_INTRO_COPY.body}</p>
          <ul className="t3-cv-benefits">{DASHBOARD_INTRO_COPY.bullets.map(item => <li key={item}>{item}</li>)}</ul>
          <button type="button" className="t3-cv-primary" onClick={dismiss}>{DASHBOARD_INTRO_COPY.action}<span aria-hidden="true">→</span></button>
        </> : <>
          <p id="t3-conversion-description" className="t3-cv-description">{CLOSING_COPY.question}</p>
          <div className="t3-cv-offer"><p className="t3-cv-offer-question">{CONVERSION_OFFER.priceLabel} <strong>{CONVERSION_OFFER.startingPrice}</strong>?</p></div>
          <a className="t3-cv-primary" href={CONVERSION_OFFER.bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => contact('booking_clicked')}>{CONVERSION_OFFER.bookingLabel}<Arrow /></a>
          <p className="t3-cv-small t3-cv-centre">{CLOSING_COPY.callNote} Booking opens in a new tab.</p>
          <div className="t3-cv-alternatives"><a className="t3-cv-text" href={CONVERSION_OFFER.contactUrl} target="_blank" rel="noopener noreferrer" onClick={() => contact('contact_clicked')}>Ask a question instead <Arrow /></a><button type="button" className="t3-cv-text" onClick={dismiss}>Keep exploring</button></div>
        </>}
      </div>
    </dialog>, document.body)}
  </>;
}
