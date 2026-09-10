'use client';

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import type { AssistantAction, AssistantCard, AssistantTurn } from '@/lib/assistant/types';
import type { Estimate } from '@/lib/pricing/estimate-engine';
import { EnquiryPanel } from './EnquiryPanel';
import { SmartAssistantTeaser } from './SmartAssistantTeaser';

/**
 * "Ask Apex" Smart Assistant - premium workspace panel (UX brief).
 * Renders only structured turn payloads (cards/actions) from /api/chat SSE;
 * never parses assistant prose for UI. All API contracts unchanged.
 */

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  streaming?: boolean;
  turn?: AssistantTurn;
}

interface PublicConfig {
  assistantName: string;
  starterPrompts: string[];
  maxUserMessageChars: number;
}

const BLUE = '#1769E0';
const SLATE = '#1E293B';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/* ---------------- Opening action cards (brief section 3) ---------------- */

const OPENING_ACTIONS: { title: string; blurb: string; message: string; icon: ReactNode }[] = [
  {
    title: 'Get an estimate',
    blurb: 'Work out an indicative project price.',
    message: "I'd like an indicative estimate for a roof replacement.",
    icon: (
      <>
        <path d="M12 3v18M3 7.5L12 21l9-13.5" />
        <path d="M12 3l4 4.5M12 3L8 7.5" />
      </>
    ),
  },
  {
    title: 'Ask a roofing question',
    blurb: 'Materials, roof types, repairs, pitch, guarantees and more.',
    message: 'I have a question about roofing.',
    icon: (
      <>
        <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1-5.5a8.5 8.5 0 1 1 17-3z" />
        <path d="M8.5 10.5h7M8.5 13.5h4" />
      </>
    ),
  },
  {
    title: 'Find something on the site',
    blurb: "Tell me what you need and I'll take you there.",
    message: 'Can you help me find something on the website?',
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </>
    ),
  },
  {
    title: 'Start an enquiry',
    blurb: "I'll help prepare the details for the Apex team.",
    message: "I'd like to make an enquiry.",
    icon: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </>
    ),
  },
];

/* ---------------- Material option cards (brief section 5) ---------------- */

const MATERIAL_OPTIONS: { name: string; blurb: string; cta: string; message: string }[] = [
  { name: 'Concrete Tile', blurb: 'Good value · durable', cta: 'Select', message: 'Concrete tiles, please.' },
  { name: 'Clay', blurb: 'Classic look · long lifespan', cta: 'Select', message: 'Clay tiles, please.' },
  { name: 'Slate', blurb: 'Premium · longest lifespan', cta: 'Select', message: 'Slate, please.' },
  { name: 'Not Sure', blurb: 'Help me choose', cta: 'Help Me Decide', message: "I'm not sure which material - can you help me decide?" },
];

function asksAboutMaterial(text: string): boolean {
  return /(which|what)\s+(material|tile|slate)|material\s+(would|do|did)\s+you|choose.{0,20}material/i.test(text);
}

const ESTIMATE_INTENT = /estimat|quote|pricing|price|cost|how much|re-?roof|replac/i;

/* ---------------- Estimate card (brief section 5) ---------------- */

function EstimateCard({ estimate }: { estimate: Estimate }) {
  return (
    <section className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-4 py-3 text-white" style={{ backgroundColor: SLATE }}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">Indicative Estimate</span>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] uppercase tracking-wide">
            {estimate.status}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-300">
          {estimate.project.roofArea.toLocaleString()} m² · {estimate.project.roofShape.replace('_', ' ')} ·{' '}
          {estimate.project.pitchDegrees}° pitch · {estimate.project.materialLabel} · ref {estimate.id}
        </div>
      </div>

      <div className="px-4 py-3.5">
        <dl className="w-full text-xs">
          {estimate.lineItems.map((li, i) => (
            <div
              key={li.catalogItemId + li.quantity + i}
              className="flex items-baseline justify-between gap-3 border-b border-slate-100 py-1.5 last:border-0"
            >
              <dt className="text-slate-700">{li.label}</dt>
              <dd className="flex items-baseline gap-3 whitespace-nowrap">
                <span className="hidden text-[11px] text-slate-400 sm:inline">
                  {li.quantity.toLocaleString()} {li.unit} × {estimate.symbol}
                  {li.rate}
                </span>
                <span className="font-medium text-slate-900">
                  {estimate.symbol}
                  {li.subtotal.toLocaleString()}
                </span>
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-3 flex items-center justify-between border-t-2 border-slate-900/80 pt-2.5">
          <span className="text-sm font-bold text-slate-900">Estimated total</span>
          <span className="text-lg font-bold" style={{ color: BLUE }}>
            {estimate.symbol}
            {estimate.total.toLocaleString()} {estimate.currency}
          </span>
        </div>

        <details className="mt-2.5 group">
          <summary className="cursor-pointer select-none text-[11px] text-slate-500 hover:text-slate-700">
            Assumptions &amp; disclaimer
          </summary>
          <ul className="mt-1.5 space-y-1">
            {estimate.assumptions.map((a, i) => (
              <li key={i} className="flex gap-1.5 text-[11px] text-slate-500">
                <span className="shrink-0 text-amber-500">•</span>
                {a}
              </li>
            ))}
          </ul>
          {estimate.exclusions.length > 0 && (
            <p className="mt-1.5 text-[11px] text-slate-400">Excludes: {estimate.exclusions.join('; ')}.</p>
          )}
          <p className="mt-1.5 text-[11px] italic text-slate-400">{estimate.disclaimer}</p>
        </details>
      </div>
    </section>
  );
}

/* ---------------- Action buttons ---------------- */

function ActionButton({ action, onFollowUp, onInquiry, onDownload }: {
  action: AssistantAction;
  onFollowUp: (msg: string) => void;
  onInquiry: () => void;
  onDownload: (estimateId: string) => void;
}) {
  const base =
    'rounded-full px-3.5 py-2 text-xs font-semibold border transition-colors inline-flex items-center gap-1.5';

  if (action.type === 'NAVIGATE_INTERNAL') {
    return (
      <a
        href={action.url}
        target={action.external ? '_blank' : undefined}
        rel={action.external ? 'noopener noreferrer' : undefined}
        className={`${base} text-white hover:opacity-90`}
        style={{ backgroundColor: BLUE, borderColor: BLUE }}
      >
        {action.label} →
      </a>
    );
  }
  if (action.type === 'OPEN_INQUIRY') {
    return (
      <button onClick={onInquiry} className={`${base} text-white hover:opacity-90`} style={{ backgroundColor: BLUE, borderColor: BLUE }}>
        {action.label}
      </button>
    );
  }
  if (action.type === 'ADD_ESTIMATE_OPTION') {
    return (
      <button onClick={() => onFollowUp(action.followUpMessage)} className={`${base} border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50`}>
        {action.label}
      </button>
    );
  }
  if (action.type === 'DOWNLOAD_OUTPUT') {
    return (
      <button
        onClick={() => onDownload(action.estimateId)}
        className={`${base} border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50`}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
        </svg>
        {action.label}
      </button>
    );
  }
  return null;
}

/* ---------------- Main component ---------------- */

export function SmartAssistantLauncher() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [enquiryActive, setEnquiryActive] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  /** ids of assistant messages for which material option cards were already used */
  const materialCardsUsed = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/chat')
      .then((r) => (r.ok ? r.json() : null))
      .then((c: PublicConfig | null) => c && setConfig(c))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, enquiryActive]);

  // Escape closes the panel (a11y)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Move focus into the chat when opened
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [open]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;
      setError(null);
      setEnquiryActive(false);
      setInput('');
      setBusy(true);

      const userMsg: ChatMessage = { id: uid(), role: 'user', text: trimmed };
      const assistantId = uid();
      setMessages((m) => [...m, userMsg, { id: assistantId, role: 'assistant', text: '', streaming: true }]);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed }),
        });

        if (!res.ok || !res.body) {
          const data = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(data?.error ?? 'Something went wrong. Please try again.');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        const applyToken = (t: string) =>
          setMessages((m) => m.map((msg) => (msg.id === assistantId ? { ...msg, text: msg.text + t } : msg)));

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() ?? '';
          for (const part of parts) {
            const line = part.split('\n').find((l) => l.startsWith('data: '));
            if (!line) continue;
            let evt: { type: string; text?: string; turn?: AssistantTurn; error?: string };
            try {
              evt = JSON.parse(line.slice(6));
            } catch {
              continue;
            }
            if (evt.type === 'token' && evt.text) {
              applyToken(evt.text);
            } else if (evt.type === 'turn' && evt.turn) {
              setMessages((m) =>
                m.map((msg) => (msg.id === assistantId ? { ...msg, text: evt.turn!.message, turn: evt.turn, streaming: false } : msg))
              );
            } else if (evt.type === 'error') {
              throw new Error(evt.error ?? 'Something went wrong. Please try again.');
            }
          }
        }
        setMessages((m) => m.map((msg) => (msg.id === assistantId ? { ...msg, streaming: false } : msg)));
      } catch (e) {
        const msgText = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
        setError(msgText);
        setMessages((m) => m.filter((msg) => msg.id !== assistantId || msg.text.length > 0));
      } finally {
        setBusy(false);
      }
    },
    [busy]
  );

  const handleInquiry = useCallback(() => {
    setEnquiryActive(true);
  }, []);

  const handleDownload = useCallback(async (estimateId: string) => {
    try {
      const res = await fetch('/api/outputs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estimateId }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { outputId?: string };
      if (!data.outputId) throw new Error();
      window.location.href = `/api/outputs?id=${encodeURIComponent(data.outputId)}`;
    } catch {
      setError('Sorry - the PDF could not be generated. Please try again.');
    }
  }, []);

  const hasMessages = messages.length > 0;
  const lastMsg = messages[messages.length - 1];
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const awaitingEstimate = busy && lastMsg?.role === 'assistant' && !lastMsg.text && !!lastUser && ESTIMATE_INTENT.test(lastUser.text);
  const showMaterialOptions =
    !busy &&
    lastMsg?.role === 'assistant' &&
    lastMsg.turn &&
    !lastMsg.turn.cards?.length &&
    !lastMsg.streaming &&
    !materialCardsUsed.current.has(lastMsg.id) &&
    lastMsg.text.length < 400 &&
    asksAboutMaterial(lastMsg.text);

  return (
    <>
      {/* Teaser (once per session) + branded launcher */}
      {!open && <SmartAssistantTeaser onOpenAssistant={() => setOpen(true)} />}

      <button
        aria-label={open ? 'Close Ask Apex' : 'Open Ask Apex - instant roofing advice and pricing'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="group fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-2xl py-2.5 pl-3 pr-4 text-left text-white shadow-xl shadow-slate-900/25 transition-all hover:shadow-2xl hover:shadow-slate-900/30 active:scale-[0.98] sm:bottom-5 sm:right-5"
        style={{ backgroundColor: open ? SLATE : BLUE }}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
          {open ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.4 5.4L20 9.3l-4 4 .9 5.9L12 16.6 7.1 19.2l.9-5.9-4-4 5.6-1.9L12 2z" />
            </svg>
          )}
        </span>
        <span className="hidden sm:block">
          <span className="block text-sm font-bold leading-tight tracking-tight">{open ? 'Close' : 'Ask Apex'}</span>
          <span className="block text-[10px] leading-tight text-white/80">Instant roofing advice &amp; pricing</span>
        </span>
      </button>

      {/* Workspace panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Ask Apex - Smart Assistant"
          className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-slate-50 shadow-2xl shadow-black/25 sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(680px,calc(100dvh-8rem))] sm:w-[min(520px,calc(100vw-2.5rem))] sm:rounded-2xl sm:border sm:border-slate-200"
        >
          {/* Sticky header */}
          <div className="shrink-0 px-4 py-3.5 text-white" style={{ backgroundColor: BLUE }}>
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-base font-bold leading-tight tracking-tight">Ask Apex</div>
                <div className="mt-0.5 truncate text-[11px] text-white/85">
                  Ask me like you&apos;d ask a member of the Apex team.
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Online
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/15 sm:hidden"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Enquiry flow replaces the conversation area */}
          {enquiryActive ? (
            <div className="flex-1 bg-slate-50">
              <EnquiryPanel onClose={() => setEnquiryActive(false)} />
            </div>
          ) : (
            <div
              ref={listRef}
              role="log"
              aria-live="polite"
              aria-label="Conversation messages"
              className="flex-1 overflow-y-auto px-4 py-4"
            >
              {!hasMessages && <OpeningScreen onAction={sendMessage} starters={config?.starterPrompts ?? []} busy={busy} />}

              {messages.map((m) => (
                <div key={m.id}>
                  {m.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm text-white" style={{ backgroundColor: BLUE }}>
                        {m.text}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 first:mt-0">
                      {/* Estimate-ready moment (brief section 7) */}
                      {m.turn?.cards?.some((c) => c.type === 'estimate') && !m.streaming && (
                        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: BLUE }}>
                          ✓ Your estimate is ready
                        </p>
                      )}
                      <div className="text-sm leading-relaxed text-slate-800">
                        {m.text || (awaitingEstimate && m.id === lastMsg?.id ? <PreparingEstimate /> : <ThinkingDots />)}
                        {m.streaming && m.text ? (
                          <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-slate-400 align-middle" />
                        ) : null}
                      </div>

                      {m.turn?.cards?.map((card, i) => (
                        <CardRenderer key={i} card={card} />
                      ))}

                      {m.turn?.actions && m.turn.actions.length > 0 && !m.streaming && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {m.turn.actions.map((a, i) => (
                            <ActionButton key={i} action={a} onFollowUp={sendMessage} onInquiry={handleInquiry} onDownload={handleDownload} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {showMaterialOptions && lastMsg && (
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {MATERIAL_OPTIONS.map((opt) => (
                    <div key={opt.name} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                      <p className="text-sm font-semibold text-slate-900">{opt.name}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{opt.blurb}</p>
                      <button
                        onClick={() => {
                          materialCardsUsed.current.add(lastMsg.id);
                          sendMessage(opt.message);
                        }}
                        disabled={busy}
                        className="mt-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors disabled:opacity-50"
                        style={{ borderColor: BLUE, color: BLUE }}
                      >
                        {opt.cta}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{error}</div>
              )}
            </div>
          )}

          {/* Composer (sticky, hidden during enquiry) */}
          {!enquiryActive && (
            <div className="shrink-0 border-t border-slate-200 bg-white p-3">
              {!hasMessages && (
                <p className="mb-2 text-center text-[11px] font-medium text-slate-400">Or just ask me anything…</p>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-end gap-2"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, config?.maxUserMessageChars ?? 1000))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  rows={1}
                  aria-label="Type your message"
                  placeholder="Ask about services, pricing, or an estimate…"
                  className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1769E0] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send message"
                  className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{ backgroundColor: BLUE }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </button>
              </form>
              <p className="mt-1.5 text-center text-[10px] text-slate-400">
                Apex Roofing is a fictional business · Interactive demo by T3 Labs
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

/* ---------------- Opening screen (brief section 3) ---------------- */

function OpeningScreen({ onAction, starters, busy }: {
  onAction: (msg: string) => void;
  starters: string[];
  busy: boolean;
}) {
  return (
    <div>
      <p className="text-sm leading-relaxed text-slate-600">
        I know Apex Roofing&apos;s services, roofing information and pricing. I can answer questions, estimate
        projects, find pages on the website and help prepare an enquiry.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {OPENING_ACTIONS.map((a) => (
          <button
            key={a.title}
            onClick={() => onAction(a.message)}
            disabled={busy}
            className="rounded-2xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition-all hover:border-[#1769E0] hover:shadow-md disabled:opacity-50"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50" style={{ color: BLUE }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                {a.icon}
              </svg>
            </span>
            <p className="mt-2 text-sm font-semibold text-slate-900">{a.title}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{a.blurb}</p>
          </button>
        ))}
      </div>

      {starters.length > 0 && (
        <div className="mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Try asking</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {starters.slice(0, 3).map((s) => (
              <button
                key={s}
                onClick={() => onAction(s)}
                disabled={busy}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- helpers ---------------- */

function CardRenderer({ card }: { card: AssistantCard }) {
  if (card.type === 'estimate') return <EstimateCard estimate={card.estimate} />;
  return (
    <div className="mt-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-600 shadow-sm">
      <span className="font-medium text-slate-800">Handoff: </span>
      {card.summary}
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

function PreparingEstimate() {
  return (
    <span className="inline-flex items-center gap-2 py-1 text-slate-500">
      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-[#1769E0]" />
      Preparing your estimate…
    </span>
  );
}
