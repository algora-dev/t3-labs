'use client';

import { useEffect, useState } from 'react';

export interface TeaserConfig {
  assistantLabel: string;
  accentColor: string;
  teaserTitle: string;
  teaserText: string;
  teaserExample: string;
}

const SESSION_KEY = 't3-smart-assistant-teaser-shown';

export function SmartAssistantTeaser({ config, onOpenAssistant }: { config: TeaserConfig; onOpenAssistant: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(SESSION_KEY) === '1'; } catch { seen = false; }
    if (seen) return;
    const showTimer = setTimeout(() => setVisible(true), 1600);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
    }, 12000);
    return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
  };

  return (
    <div className="fixed bottom-24 left-3 right-3 z-40 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/15 sm:bottom-[6.5rem] sm:left-auto sm:right-5 sm:w-[360px]" role="status" aria-label="Smart Assistant introduction">
      <button onClick={dismiss} aria-label="Dismiss" className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      <div className="pr-7">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: config.accentColor }} />
          Smart website
        </div>
        <p className="text-sm font-bold text-slate-950">{config.teaserTitle}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">{config.teaserText}</p>
      </div>

      {config.teaserExample && (
        <button
          onClick={() => { dismiss(); onOpenAssistant(); }}
          className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-slate-300 hover:bg-slate-100"
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Try asking</span>
          <span className="mt-1 block text-xs font-medium leading-relaxed text-slate-800">“{config.teaserExample}”</span>
        </button>
      )}

      <button onClick={() => { dismiss(); onOpenAssistant(); }} className="mt-3 w-full rounded-full px-4 py-2.5 text-xs font-bold text-white hover:opacity-90" style={{ backgroundColor: config.accentColor }}>
        Try {config.assistantLabel}
      </button>
    </div>
  );
}
