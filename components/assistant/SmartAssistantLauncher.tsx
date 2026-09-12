'use client';

import { type PointerEvent as ReactPointerEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AssistantAction, AssistantCard, AssistantTurn } from '@/lib/assistant/types';
import type { Estimate, EstimateDraft } from '@/lib/pricing/estimate-engine';
import { EnquiryPanel } from './EnquiryPanel';
import { SmartAssistantTeaser } from './SmartAssistantTeaser';
import { EstimateResultCard } from './EstimateResultCard';
import { GuidedEstimator, type EstimatorConfig } from './GuidedEstimator';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  streaming?: boolean;
  turn?: AssistantTurn;
}

interface PublicConfig {
  assistantName: string;
  assistantLabel: string;
  brandName: string;
  accentColor: string;
  launcherSubtitle: string;
  teaserTitle: string;
  teaserText: string;
  teaserExample: string;
  openingIntro: string;
  demoFooter: string;
  starterPrompts: string[];
  maxUserMessageChars: number;
  estimator?: EstimatorConfig;
}

const FALLBACK_CONFIG: PublicConfig = {
  assistantName: 'Smart Assistant',
  assistantLabel: 'Smart Assistant',
  brandName: 'the business',
  accentColor: '#1769E0',
  launcherSubtitle: 'Answers, pricing and help',
  teaserTitle: 'This is a Smart Website',
  teaserText: 'Instead of searching through pages, just ask the Smart Assistant.',
  teaserExample: 'Can you give me an indicative price for my project?',
  openingIntro: 'Ask me anything about this business.',
  demoFooter: 'Interactive demo by T3 Labs',
  starterPrompts: [],
  maxUserMessageChars: 1000,
};
const SLATE = '#0F172A';
const POS_STORAGE_KEY = 't3_sa_panel_pos';

function uid() { return Math.random().toString(36).slice(2, 10); }

const OPENING_ACTIONS: { title: string; blurb: string; message: string; icon: ReactNode }[] = [
  {
    title: 'Get an estimate', blurb: 'Guided, ballpark or quick material rates.', message: "I'd like a price for a roofing project.",
    icon: <><path d="M4 19h16M6 16l3-9 3 6 3-10 3 13" /></>,
  },
  {
    title: 'Ask a roofing question', blurb: 'Materials, roof types, repairs, pitch and more.', message: 'I have a roofing question.',
    icon: <><path d="M21 12a8.5 8.5 0 01-9 8.5A9.5 9.5 0 014 19l-1 2 1-5A8.5 8.5 0 1121 12z" /><path d="M9.5 9a2.6 2.6 0 015 1c0 2-2.5 2-2.5 4M12 17h.01" /></>,
  },
  {
    title: 'Find something', blurb: 'Tell me what page or information you need.', message: 'Help me find something on this website.',
    icon: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>,
  },
  {
    title: 'Prepare an enquiry', blurb: 'I will carry what we already know into the form.', message: "I'd like to prepare an enquiry.",
    icon: <><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  },
];

function scopeText(estimate: Estimate) {
  if (estimate.project.componentScope === 'covering_only') return 'Roof covering only';
  if (estimate.project.componentScope === 'specified_components') return 'Specified components included';
  return 'Estimated roof components included';
}

function EstimateCard({ estimate, accentColor }: { estimate: Estimate; accentColor: string }) {
  return (
    <section className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-4 py-3 text-white" style={{ backgroundColor: SLATE }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold">Indicative estimate</p>
            <p className="mt-1 text-[11px] text-slate-300">{estimate.project.roofArea.toLocaleString()} m² · {estimate.project.materialLabel}</p>
          </div>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-slate-200">{scopeText(estimate)}</span>
        </div>
      </div>

      <div className="px-4 py-3.5">
        <div className="space-y-0.5">
          {estimate.lineItems.map((li, i) => (
            <div key={`${li.catalogItemId}-${li.quantity}-${i}`} className="flex items-start justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-800">{li.label}</p>
                <p className="mt-0.5 text-[10px] text-slate-400">
                  {li.quantity.toLocaleString()} {li.unit} × {estimate.symbol}{li.rate.toLocaleString()}
                  {li.quantitySource === 'heuristic' ? ' · estimated allowance' : ''}
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-slate-900">{estimate.symbol}{li.subtotal.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-end justify-between border-t-2 border-slate-900 pt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Indicative total</p>
            <p className="mt-0.5 text-[10px] text-slate-400">Ref {estimate.id}</p>
          </div>
          <span className="text-xl font-black" style={{ color: accentColor }}>{estimate.symbol}{estimate.total.toLocaleString()} <span className="text-xs font-semibold">{estimate.currency}</span></span>
        </div>

        <details className="mt-3 rounded-xl bg-slate-50 px-3 py-2">
          <summary className="cursor-pointer select-none text-[11px] font-semibold text-slate-600">Assumptions and exclusions</summary>
          <ul className="mt-2 space-y-1.5">
            {estimate.assumptions.map((a, i) => <li key={i} className="text-[10px] leading-relaxed text-slate-500">• {a}</li>)}
          </ul>
          {estimate.exclusions.length > 0 && <p className="mt-2 text-[10px] leading-relaxed text-slate-400">Excludes: {estimate.exclusions.join('; ')}.</p>}
          <p className="mt-2 text-[10px] italic leading-relaxed text-slate-400">{estimate.disclaimer}</p>
        </details>
      </div>
    </section>
  );
}

function CardRenderer({ card, accentColor }: { card: AssistantCard; accentColor: string }) {
  if (card.type === 'estimate_result') return <EstimateResultCard result={card.result} accentColor={accentColor} />;
  if (card.type === 'estimate') return <EstimateCard estimate={card.estimate} accentColor={accentColor} />;
  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-600">
      {card.summary}
    </div>
  );
}

interface ActionHandlers {
  busy: boolean;
  accentColor: string;
  pinned: boolean;
  onFollowUp: (msg: string) => void;
  onInquiry: () => void;
  onDownload: (estimateId: string, estimateIds?: string[]) => void;
  onEstimator: () => void;
  onNavigate: (url: string) => void;
}

function ActionButton({ action, handlers: h }: { action: AssistantAction; handlers: ActionHandlers }) {
  if (action.type === 'QUICK_REPLY') {
    return (
      <button
        disabled={h.busy}
        onClick={() => h.onFollowUp(action.message)}
        className="group rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-px hover:border-slate-300 hover:shadow-md disabled:opacity-50"
      >
        <span className="block text-xs font-bold text-slate-900">{action.label}</span>
        {action.description && <span className="mt-0.5 block text-[10px] leading-snug text-slate-500">{action.description}</span>}
      </button>
    );
  }

  const base = 'inline-flex items-center justify-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition disabled:opacity-50';
  if (action.type === 'NAVIGATE_INTERNAL') {
    if (action.external) {
      return <a href={action.url} target="_blank" rel="noopener noreferrer" className={`${base} text-white hover:opacity-90`} style={{ backgroundColor: h.accentColor, borderColor: h.accentColor }}>{action.label} <span aria-hidden>→</span></a>;
    }
    return <button disabled={h.busy} onClick={() => h.onNavigate(action.url)} className={`${base} text-white hover:opacity-90`} style={{ backgroundColor: h.accentColor, borderColor: h.accentColor }}>{action.label} <span aria-hidden>→</span></button>;
  }
  if (action.type === 'OPEN_INQUIRY') {
    return <button disabled={h.busy} onClick={h.onInquiry} className={`${base} text-white hover:opacity-90`} style={{ backgroundColor: h.accentColor, borderColor: h.accentColor }}>{action.label}</button>;
  }
  if (action.type === 'ADD_ESTIMATE_OPTION') {
    return <button disabled={h.busy} onClick={() => h.onFollowUp(action.followUpMessage)} className={`${base} border-slate-300 bg-white text-slate-700 hover:bg-slate-50`}>{action.label}</button>;
  }
  if (action.type === 'START_GUIDED_ESTIMATE' || action.type === 'ADJUST_ESTIMATE') {
    return <button disabled={h.busy} onClick={h.onEstimator} className={`${base} text-white hover:opacity-90`} style={{ backgroundColor: h.accentColor, borderColor: h.accentColor }}>{action.label}</button>;
  }
  return (
    <button disabled={h.busy} onClick={() => h.onDownload(action.estimateId, action.estimateIds)} className={`${base} border-slate-300 bg-white text-slate-700 hover:bg-slate-50`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
      {action.label}
    </button>
  );
}

function ThinkingDots() {
  return <span className="inline-flex items-center gap-1 py-1"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" /></span>;
}

function OpeningScreen({ config, busy, onAction }: { config: PublicConfig; busy: boolean; onAction: (message: string) => void }) {
  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ backgroundColor: config.accentColor }}>
            <img src="/assets/demo-act-roofing/ApexLogoWhite---f166f5cd-ea1d-4d9c-86d4-f2e3dc127812.png" alt="Apex Roofing" width="18" height="18" className="h-[18px] w-[18px] object-contain" />
          </span>
          <div>
            <p className="text-sm font-bold text-slate-950">Ask me instead of searching</p>
            <p className="text-[10px] font-medium text-slate-400">Ask me like you&apos;d ask the team</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{config.openingIntro}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {OPENING_ACTIONS.map((action) => (
          <button key={action.title} disabled={busy} onClick={() => onAction(action.message)} className="rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition hover:-translate-y-px hover:border-slate-300 hover:shadow-md disabled:opacity-50">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100" style={{ color: config.accentColor }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">{action.icon}</svg></span>
            <span className="mt-2 block text-xs font-bold text-slate-900">{action.title}</span>
            <span className="mt-0.5 block text-[10px] leading-snug text-slate-500">{action.blurb}</span>
          </button>
        ))}
      </div>

      {config.starterPrompts.length > 0 && (
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Try a real question</p>
          <div className="mt-2 space-y-1.5">
            {config.starterPrompts.slice(0, 3).map((prompt) => (
              <button key={prompt} disabled={busy} onClick={() => onAction(prompt)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left text-xs text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50">
                <span>{prompt}</span><span className="shrink-0 text-slate-400">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SmartAssistantLauncher() {
  const router = useRouter();
  const [embeddedFrame, setEmbeddedFrame] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [config, setConfig] = useState<PublicConfig>(FALLBACK_CONFIG);
  const [error, setError] = useState<string | null>(null);
  const [enquiryActive, setEnquiryActive] = useState(false);
  const [estimatorActive, setEstimatorActive] = useState(false);
  const [estimatorDraft, setEstimatorDraft] = useState<EstimateDraft | null>(null);
  const [pinned, setPinned] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [siteHref, setSiteHref] = useState<string | null>(null);
  const [iframePath, setIframePath] = useState<string | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [dragging, setDragging] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setEmbeddedFrame(window.self !== window.top);
  }, []);

  useEffect(() => {
    const openFromPage = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('[data-open-smart-assistant]') : null;
      if (!target) return;
      event.preventDefault();
      setOpen(true);
    };
    document.addEventListener('click', openFromPage);
    return () => document.removeEventListener('click', openFromPage);
  }, []);

  useEffect(() => {
    fetch('/api/chat', { cache: 'no-store' })
      .then((r) => r.ok ? r.json() : null)
      .then((value: PublicConfig | null) => value && setConfig({ ...FALLBACK_CONFIG, ...value }))
      .catch(() => undefined);
  }, []);

  // Persisted drag position (V4 brief section 16)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(POS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { x: number; y: number };
        if (Number.isFinite(parsed.x) && Number.isFinite(parsed.y)) setPos(parsed);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }); }, [messages, enquiryActive, estimatorActive]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    if (window.innerWidth < 640 && !pinned) document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = previous; };
  }, [open, pinned]);

  useEffect(() => {
    if (!open || enquiryActive) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [open, enquiryActive]);

  // Header drag (desktop only): clamp inside the viewport, persist locally.
  useEffect(() => {
    if (!open) return;
    const clamp = (x: number, y: number) => {
      const panel = panelRef.current?.getBoundingClientRect();
      const w = panel?.width ?? 560;
      const h = panel?.height ?? 700;
      return {
        x: Math.min(Math.max(8, x), Math.max(8, window.innerWidth - w - 8)),
        y: Math.min(Math.max(8, y), Math.max(8, window.innerHeight - Math.min(h, 120) - 8)),
      };
    };
    const onMove = (e: PointerEvent) => {
      if (!dragOffset.current) return;
      e.preventDefault();
      setPos(clamp(e.clientX - dragOffset.current.dx, e.clientY - dragOffset.current.dy));
    };
    const onUp = () => {
      if (!dragOffset.current) return;
      dragOffset.current = null;
      setDragging(false);
      setPos((current) => {
        if (current) { try { window.localStorage.setItem(POS_STORAGE_KEY, JSON.stringify(current)); } catch { /* ignore */ } }
        return current;
      });
    };
    const onResize = () => setPos((current) => (current ? clamp(current.x, current.y) : current));
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const beginDrag = (e: ReactPointerEvent) => {
    if (e.target instanceof Element && e.target.closest('button, a, input')) return;
    if (window.innerWidth < 640 || pinned) return;
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragOffset.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    setDragging(true);
  };

  const resetPosition = () => {
    try { window.localStorage.removeItem(POS_STORAGE_KEY); } catch { /* ignore */ }
    setPos(null);
  };

  const currentPagePath = useCallback(() => {
    if (pinned) {
      if (iframePath) return iframePath;
      if (siteHref) { try { return new URL(siteHref).pathname; } catch { return null; } }
      return null;
    }
    return window.location.pathname;
  }, [pinned, iframePath, siteHref]);

  const runTurn = useCallback(async (userDisplayText: string, body: Record<string, unknown>) => {
    if (busy) return;
    setError(null);
    setEnquiryActive(false);
    setInput('');
    setBusy(true);
    const userMsg: ChatMessage = { id: uid(), role: 'user', text: userDisplayText };
    const assistantId = uid();
    setMessages((current) => [...current, userMsg, { id: assistantId, role: 'assistant', text: '', streaming: true }]);

    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? 'Something went wrong. Please try again.');
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() ?? '';
        for (const part of parts) {
          const line = part.split('\n').find((l) => l.startsWith('data: '));
          if (!line) continue;
          let event: { type: string; text?: string; turn?: AssistantTurn; error?: string };
          try { event = JSON.parse(line.slice(6)); } catch { continue; }
          if (event.type === 'token' && event.text) {
            setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, text: message.text + event.text } : message));
          } else if (event.type === 'turn' && event.turn) {
            setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, text: event.turn!.message, turn: event.turn, streaming: false } : message));
          } else if (event.type === 'error') {
            throw new Error(event.error ?? 'Something went wrong. Please try again.');
          }
        }
      }
      setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, streaming: false } : message));
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
      setError(message);
      setMessages((current) => current.filter((item) => item.id !== assistantId || item.text.length > 0));
    } finally {
      setBusy(false);
    }
  }, [busy]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setEstimatorActive(false);
    runTurn(trimmed, { message: trimmed, currentPagePath: currentPagePath() });
  }, [runTurn, currentPagePath]);

  const submitDraft = useCallback((draft: EstimateDraft) => {
    setEstimatorDraft(draft);
    setEstimatorActive(false);
    runTurn('Here are my estimate details from the guided form.', { clientAction: { type: 'ESTIMATE_DRAFT_SUBMIT', draft }, currentPagePath: currentPagePath() });
  }, [runTurn, currentPagePath]);

  const handleDownload = useCallback(async (estimateId: string, estimateIds?: string[]) => {
    setError(null);
    try {
      const create = await fetch('/api/outputs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estimateId, estimateIds }) });
      const created = (await create.json().catch(() => null)) as { outputId?: string; error?: string } | null;
      if (!create.ok || !created?.outputId) throw new Error(created?.error ?? 'Could not prepare the PDF.');
      const download = await fetch(`/api/outputs?id=${encodeURIComponent(created.outputId)}`, { cache: 'no-store' });
      if (!download.ok) {
        const data = (await download.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? 'Could not download the PDF.');
      }
      const blob = await download.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = estimateIds && estimateIds.length > 1 ? 'indicative-estimate-range.pdf' : `indicative-estimate-${estimateId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sorry, the PDF could not be generated. Please try again.');
    }
  }, []);

  const handleReset = useCallback(async () => {
    setResetConfirm(false);
    setError(null);
    try {
      await fetch('/api/session', { method: 'DELETE' });
    } catch { /* the session cookie will still be replaced on next request */ }
    setMessages([]);
    setEstimatorActive(false);
    setEstimatorDraft(null);
    setEnquiryActive(false);
    setInput('');
  }, []);

  const openEstimator = useCallback(async () => {
    setError(null);
    setEnquiryActive(false);
    try {
      const response = await fetch('/api/session', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json() as { draft?: EstimateDraft | null };
        setEstimatorDraft(data.draft ?? null);
      }
    } catch {
      // The estimator can still start blank if session prefill is unavailable.
    }
    setEstimatorActive(true);
  }, []);

  const navigateSite = useCallback((url: string) => {
    if (pinned) {
      const href = new URL(url, window.location.origin);
      setSiteHref(href.href);
      setIframePath(href.pathname);
    } else {
      router.push(url);
    }
  }, [pinned, router]);

  const handlePin = () => {
    if (window.innerWidth < 1024) return;
    if (!pinned) {
      setSiteHref(window.location.href);
      setIframePath(window.location.pathname);
      setPinned(true);
      return;
    }
    const destination = iframePath ?? (siteHref ? new URL(siteHref).pathname : null);
    setPinned(false);
    if (destination && destination !== window.location.pathname) router.push(destination);
  };

  const hasMessages = messages.length > 0;
  const actionHandlers: ActionHandlers = useMemo(() => ({
    busy,
    accentColor: config.accentColor,
    pinned,
    onFollowUp: sendMessage,
    onInquiry: () => setEnquiryActive(true),
    onDownload: handleDownload,
    onEstimator: openEstimator,
    onNavigate: navigateSite,
  }), [busy, config.accentColor, pinned, sendMessage, handleDownload, openEstimator, navigateSite]);

  const panelPositionStyle = pos && !pinned ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' } : undefined;

  const toggleListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setError('Voice input is not supported in this browser. Try Chrome or Edge.'); return; }
    if (listening) { recognitionRef.current?.stop(); return; }
    const rec = new SR();
    rec.lang = 'en-GB';
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = '';
    rec.onresult = (event: any) => {
      finalText = '';
      for (let i = 0; i < event.results.length; i++) finalText += event.results[i][0].transcript;
      setInput(finalText.slice(0, config.maxUserMessageChars));
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  };

  const header = (
    <header
      onPointerDown={beginDrag}
      className={`shrink-0 border-b border-white/10 px-4 py-3.5 text-white ${dragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
      style={{ background: `linear-gradient(135deg, ${SLATE}, ${config.accentColor})`, touchAction: pinned ? 'auto' : 'none' }}
      title="Drag to move"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15"><img src="/assets/demo-act-roofing/ApexLogoWhite---f166f5cd-ea1d-4d9c-86d4-f2e3dc127812.png" alt="Apex Roofing" width="20" height="20" className="h-5 w-5 object-contain" /></span>
          <div className="min-w-0"><p className="truncate text-sm font-black">{config.assistantLabel}</p><p className="truncate text-[10px] text-white/75">Ask me like you would ask the team</p></div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={handleResetRequest(setResetConfirm)} aria-label="Start new conversation" title="Start New Conversation" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
          </button>
          <button onClick={handlePin} aria-label={pinned ? 'Unpin assistant' : 'Pin assistant'} title={pinned ? 'Unpin Assistant' : 'Pin Assistant'} className="hidden h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 lg:flex">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.5s-6.5-5.6-6.5-10.6a6.5 6.5 0 1113 0c0 5-6.5 10.6-6.5 10.6z" /><circle cx="12" cy="10.5" r="2.4" /></svg>
          </button>
          {pos && !pinned && (
            <button onClick={resetPosition} aria-label="Reset panel position" title="Reset position" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v6h6M20 20v-6h-6" /><path d="M20 9A8 8 0 006.3 6.3L4 8m0 7a8 8 0 0013.7 2.7L20 16" /></svg>
            </button>
          )}
          <button onClick={() => setOpen(false)} aria-label="Close assistant" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
        </div>
      </div>
    </header>
  );

  const body = (
    <>
      {enquiryActive ? (
        <div className="min-h-0 flex-1"><EnquiryPanel onClose={() => setEnquiryActive(false)} accentColor={config.accentColor} /></div>
      ) : (
        <>
          <div ref={listRef} role="log" aria-live="polite" className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
            {!hasMessages && !estimatorActive && <OpeningScreen config={config} busy={busy} onAction={sendMessage} />}

            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.role === 'user' ? (
                    <div className="flex justify-end"><div className="max-w-[88%] rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm leading-relaxed text-white" style={{ backgroundColor: config.accentColor }}>{message.text}</div></div>
                  ) : (
                    <div>
                      {message.turn?.cards?.some((card) => card.type === 'estimate' || card.type === 'estimate_result') && !message.streaming && <p className="mb-1.5 text-[10px] font-black uppercase tracking-wider" style={{ color: config.accentColor }}>Estimate ready</p>}
                      <div className="text-sm leading-relaxed text-slate-800">{message.text || <ThinkingDots />}{message.streaming && message.text ? <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-slate-400 align-middle" /> : null}</div>
                      {message.turn?.cards?.map((card, i) => <CardRenderer key={i} card={card} accentColor={config.accentColor} />)}

                      {message.turn?.actions && message.turn.actions.some((a) => a.type !== 'QUICK_REPLY') && !message.streaming && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.turn.actions.filter((a) => a.type !== 'QUICK_REPLY').map((action, i) => <ActionButton key={i} action={action} handlers={actionHandlers} />)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {estimatorActive && config.estimator && (
              <GuidedEstimator
                config={config.estimator}
                accentColor={config.accentColor}
                busy={busy}
                initialDraft={estimatorDraft}
                onSubmit={submitDraft}
                onChat={sendMessage}
                onCancel={() => setEstimatorActive(false)}
              />
            )}

            {error && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-relaxed text-amber-800">{error}</div>}
          </div>

          <footer className="shrink-0 border-t border-slate-200 bg-white p-3 sm:p-4">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-white p-1.5 focus-within:border-slate-400 focus-within:shadow-sm">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, config.maxUserMessageChars))}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                rows={1}
                aria-label="Ask the Smart Assistant"
                placeholder={`Ask anything about ${config.brandName}...`}
                className="max-h-28 min-h-[42px] flex-1 resize-none border-0 bg-transparent px-2.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={toggleListening}
                aria-label={listening ? 'Stop voice input' : 'Start voice input'}
                title={listening ? 'Stop voice input' : 'Voice input'}
                className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl transition-colors ${listening ? 'text-white' : 'text-slate-400 hover:bg-slate-100'}`}
                style={listening ? { backgroundColor: config.accentColor } : undefined}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0014 0M12 17v4" /></svg>
              </button>
              <button type="submit" disabled={busy || !input.trim()} aria-label="Send message" className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl text-white hover:opacity-90 disabled:opacity-35" style={{ backgroundColor: config.accentColor }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
              </button>
            </form>
            <p className="mt-2 text-center text-[9px] font-medium text-slate-400">{config.demoFooter}</p>
          </footer>
        </>
      )}
    </>
  );

  if (embeddedFrame) return null;

  return (
    <>
      {!open && <SmartAssistantTeaser config={{ assistantLabel: config.assistantLabel, accentColor: config.accentColor, teaserTitle: config.teaserTitle, teaserText: config.teaserText, teaserExample: config.teaserExample }} onOpenAssistant={() => setOpen(true)} />}

      {!open && (
        <button
          aria-label={`Open ${config.assistantLabel}`}
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-2xl py-2.5 pl-3 pr-4 text-left text-white shadow-xl shadow-slate-900/25 transition hover:-translate-y-px hover:shadow-2xl active:translate-y-0 sm:bottom-5 sm:right-5"
          style={{ backgroundColor: config.accentColor }}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.2 5 5.3 1.8-3.8 3.8.9 5.4-4.6-2.5L7.4 18l.9-5.4-3.8-3.8L9.8 7 12 2z" /></svg></span>
          <span className="hidden sm:block"><span className="block text-sm font-black leading-tight">{config.assistantLabel}</span><span className="block text-[10px] leading-tight text-white/80">{config.launcherSubtitle}</span></span>
        </button>
      )}

      {/* Pinned workspace (desktop only, V4 brief section 17): ~70/30 website + assistant */}
      {open && pinned && (
        <div role="dialog" aria-label={`${config.assistantName} pinned workspace`} className="fixed inset-0 z-[60] hidden flex-row overflow-hidden bg-slate-200 lg:flex">
          <div className="h-full min-w-0 flex-1 bg-white">
            <iframe
              ref={iframeRef}
              src={siteHref ?? window.location.href}
              title="Website"
              className="h-full w-full border-0"
              onLoad={() => {
                try {
                  const path = iframeRef.current?.contentWindow?.location.pathname;
                  if (path) setIframePath(path);
                } catch { /* cross-origin: ignore */ }
              }}
            />
          </div>
          <div className="flex h-full w-[min(440px,32vw)] flex-col overflow-hidden bg-slate-50 shadow-2xl">
            {header}
            {body}
          </div>
        </div>
      )}

      {/* Floating panel (draggable on desktop, full-screen on mobile) */}
      {open && !pinned && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={config.assistantName}
          className="fixed inset-0 z-[60] flex flex-col overflow-hidden bg-slate-50 shadow-2xl sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(760px,calc(100dvh-2.5rem))] sm:w-[min(560px,calc(100vw-2.5rem))] sm:rounded-[22px] sm:border sm:border-slate-200"
          style={panelPositionStyle}
        >
          {header}
          {body}
        </div>
      )}

      {resetConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <p className="text-sm font-bold text-slate-900">Start a new conversation?</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">This will clear the assistant&apos;s memory of this chat, including your project details and estimate. The assistant will treat you as a new visitor.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setResetConfirm(false)} className="rounded-full border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
              <button onClick={handleReset} className="rounded-full px-4 py-2.5 text-xs font-semibold text-white hover:opacity-90" style={{ backgroundColor: config.accentColor }}>Start Fresh</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function handleResetRequest(setter: (value: boolean) => void) {
  return () => setter(true);
}
