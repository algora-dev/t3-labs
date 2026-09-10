'use client';

import { useEffect, useState } from 'react';

/**
 * First-3-seconds teaser (UX brief section 1): small premium card that appears
 * ~2.5s after load, once per session, above the Ask Apex launcher.
 * Dismissible; auto-collapses after ~12s if ignored (launcher stays visible).
 */

const BLUE = '#1769E0';
const SESSION_KEY = 't3-apex-teaser-shown';

export function SmartAssistantTeaser({ onOpenAssistant }: { onOpenAssistant: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      seen = false;
    }
    if (seen) return;

    const showTimer = setTimeout(() => setVisible(true), 2500);
    // Auto-collapse after ~12s of being ignored
    const hideTimer = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
    }, 2500 + 12000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      role="status"
      aria-label="Smart Assistant introduction"
      className="fixed z-40 right-3 bottom-24 left-3 sm:left-auto sm:w-[340px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/15 sm:bottom-[6.5rem]"
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: BLUE }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l2.4 5.4L20 9.3l-4 4 .9 5.9L12 16.6 7.1 19.2l.9-5.9-4-4 5.6-1.9L12 2z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">This is a Smart Website</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Don&apos;t waste time searching through pages. Ask the Smart Assistant anything about Apex Roofing —
            services, roofing advice, pricing, or where to find something.
          </p>
        </div>
      </div>

      <div className="mt-2.5 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Example question</p>
        <p className="mt-0.5 text-xs italic leading-relaxed text-slate-700">
          &ldquo;Roughly what would a 200m² concrete tile roof replacement cost?&rdquo;
        </p>
      </div>

      <button
        onClick={() => {
          dismiss();
          onOpenAssistant();
        }}
        className="mt-3 w-full rounded-full px-4 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: BLUE }}
      >
        Ask the Smart Assistant →
      </button>
    </div>
  );
}
