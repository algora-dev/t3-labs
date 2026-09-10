'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AssistantAction, AssistantCard, AssistantTurn } from '@/lib/assistant/types';
import type { Estimate } from '@/lib/pricing/estimate-engine';

/**
 * Apex Roofing Smart Assistant - floating launcher + chat panel (Phase B).
 * Renders only structured turn payloads (cards/actions) from /api/chat SSE;
 * never parses assistant prose for UI.
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

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/* ---------------- Estimate card ---------------- */

function EstimateCard({ estimate }: { estimate: Estimate }) {
  return (
    <div className="mt-2 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-slate-900 text-white">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">Indicative Roofing Estimate</span>
          <span className="text-[10px] uppercase tracking-wide bg-white/15 rounded-full px-2 py-0.5">
            {estimate.status}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-300">
          {estimate.project.roofArea} m² · {estimate.project.roofShape.replace('_', ' ')} ·{' '}
          {estimate.project.pitchDegrees}° pitch · {estimate.project.materialLabel} · ref {estimate.id}
        </div>
      </div>

      <div className="px-4 py-3">
        <table className="w-full text-xs">
          <tbody>
            {estimate.lineItems.map((li) => (
              <tr key={li.catalogItemId + li.quantity} className="border-b border-slate-100 last:border-0">
                <td className="py-1.5 pr-2 text-slate-700">{li.label}</td>
                <td className="py-1.5 pr-2 text-right whitespace-nowrap text-slate-500">
                  {li.quantity.toLocaleString()} {li.unit} × {estimate.symbol}
                  {li.rate}
                </td>
                <td className="py-1.5 text-right font-medium text-slate-900 whitespace-nowrap">
                  {estimate.symbol}
                  {li.subtotal.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2">
          <span className="text-xs font-semibold text-slate-900">Indicative total</span>
          <span className="text-base font-bold" style={{ color: BLUE }}>
            {estimate.symbol}
            {estimate.total.toLocaleString()} {estimate.currency}
          </span>
        </div>

        <details className="mt-2 group">
          <summary className="text-[11px] text-slate-500 cursor-pointer select-none hover:text-slate-700">
            Assumptions &amp; disclaimer
          </summary>
          <ul className="mt-1.5 space-y-1">
            {estimate.assumptions.map((a, i) => (
              <li key={i} className="text-[11px] text-slate-500 flex gap-1.5">
                <span className="text-amber-500 shrink-0">•</span>
                {a}
              </li>
            ))}
          </ul>
          {estimate.exclusions.length > 0 && (
            <p className="mt-1.5 text-[11px] text-slate-400">
              Excludes: {estimate.exclusions.join('; ')}.
            </p>
          )}
          <p className="mt-1.5 text-[11px] italic text-slate-400">{estimate.disclaimer}</p>
        </details>
      </div>
    </div>
  );
}

/* ---------------- Action buttons ---------------- */

function ActionButton({ action, onFollowUp, onInquiry }: {
  action: AssistantAction;
  onFollowUp: (msg: string) => void;
  onInquiry: () => void;
}) {
  const base =
    'text-xs font-medium rounded-full px-3.5 py-2 border transition-colors inline-flex items-center gap-1.5';

  if (action.type === 'NAVIGATE_INTERNAL') {
    return (
      <a
        href={action.url}
        target={action.external ? '_blank' : undefined}
        rel={action.external ? 'noopener noreferrer' : undefined}
        className={`${base} text-white hover:opacity-90`}
        style={{ backgroundColor: BLUE, borderColor: BLUE }}
      >
        {action.label}
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
  // DOWNLOAD_OUTPUT arrives in a later phase; render harmless link-styled button for now
  return (
    <button disabled className={`${base} border-slate-200 text-slate-400 cursor-not-allowed`}>
      {action.label}
    </button>
  );
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

  useEffect(() => {
    fetch('/api/chat')
      .then((r) => (r.ok ? r.json() : null))
      .then((c: PublicConfig | null) => c && setConfig(c))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, enquiryActive]);

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

  const hasMessages = messages.length > 0;
  const starters = config?.starterPrompts ?? [];

  return (
    <>
      {/* Launcher bubble */}
      <button
        aria-label={open ? 'Close Smart Assistant' : 'Open Smart Assistant'}
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full text-white shadow-lg shadow-black/25 flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: BLUE }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-4-1L3 20l1-5.5a8.5 8.5 0 1 1 17-3z" />
            <path d="M8.5 10.5h7M8.5 13.5h4" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[min(600px,calc(100dvh-8rem))] w-[min(400px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-black/20">
          {/* Header */}
          <div className="px-4 py-3 text-white" style={{ backgroundColor: BLUE }}>
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold leading-tight">
                  {config?.assistantName ?? 'Apex Roofing Smart Assistant'}
                </div>
                <div className="mt-0.5 text-[11px] text-white/80">Interactive demo · by T3 Labs</div>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] bg-white/15 rounded-full px-2 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Online
              </span>
            </div>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto bg-slate-50 px-3.5 py-4">
            {!hasMessages && !enquiryActive && (
              <div className="flex h-full flex-col items-center justify-center text-center px-4">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full text-white" style={{ backgroundColor: BLUE }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11.5l9-8 9 8M5 10v10h5v-6h4v6h5V10" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-800">Hi! I&apos;m the Apex Roofing Smart Assistant.</p>
                <p className="mt-1 text-xs text-slate-500">
                  Ask me anything about our services, roofing basics, or pricing - I can even build an indicative estimate.
                </p>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={m.role === 'user' ? 'max-w-[85%]' : 'w-full max-w-[95%]'}>
                  <div
                    className={
                      m.role === 'user'
                        ? 'rounded-2xl rounded-br-sm px-3.5 py-2 text-sm text-white'
                        : 'rounded-2xl rounded-bl-sm bg-white border border-slate-200 px-3.5 py-2 text-sm text-slate-800 shadow-sm'
                    }
                    style={m.role === 'user' ? { backgroundColor: BLUE } : undefined}
                  >
                    {m.text || (m.streaming ? <TypingDots /> : '')}
                    {m.streaming && m.text ? <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-slate-400 align-middle" /> : null}
                  </div>

                  {m.turn?.cards?.map((card, i) => (
                    <CardRenderer key={i} card={card} />
                  ))}

                  {m.turn?.actions && m.turn.actions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.turn.actions.map((a, i) => (
                        <ActionButton key={i} action={a} onFollowUp={sendMessage} onInquiry={handleInquiry} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {enquiryActive && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
                <p className="text-sm font-medium text-emerald-900">Enquiry started</p>
                <p className="mt-1 text-xs text-emerald-800">
                  Everything you&apos;ve told me in this chat is attached to your enquiry. In the full demo this opens a
                  pre-filled enquiry form - for now your intent has been saved to this session.
                </p>
                <button
                  onClick={() => sendMessage('I would like to make an enquiry about my roof.')}
                  className="mt-2.5 text-xs font-medium rounded-full px-3.5 py-2 text-white hover:opacity-90"
                  style={{ backgroundColor: BLUE }}
                >
                  Continue in chat
                </button>
              </div>
            )}

            {error && (
              <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">{error}</div>
            )}
          </div>

          {/* Starter chips */}
          {!hasMessages && starters.length > 0 && (
            <div className="border-t border-slate-200 bg-white px-3.5 py-2.5">
              <div className="flex flex-wrap gap-1.5">
                {starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    disabled={busy}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-[11px] text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Composer */}
          <div className="border-t border-slate-200 bg-white p-3">
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
                placeholder="Ask about services, pricing, or an estimate…"
                className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#1769E0] focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-40"
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
        </div>
      )}
    </>
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

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}
