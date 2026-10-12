'use client';
import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';
import './helper.css';
/** Mobile-only choice, shown once per tab before the guided tour starts on a
 *  small screen. Compact, same guide surface, above the centred welcome panel. */
export function MobileNotice({ onContinue, onExplore }: { onContinue: () => void; onExplore: () => void }) {
  const focus = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const frame = requestAnimationFrame(() => focus.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, []);
  return createPortal(<>
    <div className="dh-notice-scrim" aria-hidden="true" />
    <div ref={focus} role="dialog" aria-modal="true" aria-labelledby="dh-notice-title" tabIndex={-1} className="dh-panel dh-notice">
      <div className="dh-top"><div className="dh-brand">
        {/* Supplied brand asset, unchanged. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="dh-logo" src="/assets/t3-demo-guide/t3-logo-icon-glow-transparent.png" width="56" height="56" alt="" draggable={false} />
        <span><b>T3 LABS</b><span>Demo guide</span></span>
      </div></div>
      <div className="dh-content">
        <h2 id="dh-notice-title">Better on a bigger screen</h2>
        <p>Everything works on mobile - the demo guide itself leaves less room for the tools you&#39;re exploring.</p>
        <button type="button" className="dh-primary" onClick={onContinue}>Continue guided demo <span aria-hidden="true">→</span></button>
        <button type="button" className="dh-secondary" onClick={onExplore}>Explore without the guide</button>
        <p className="dh-small dh-centre">You can reopen the guide anytime.</p>
      </div>
    </div>
  </>, document.body);
}
