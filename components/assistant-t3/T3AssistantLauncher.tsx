'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * T3 Labs Smart Assistant launcher.
 * Dark, techy T3 Labs skin (black / lime green / slate blue / white, glow effects).
 * Dismissable: X collapses the orb into a discreet lime-green edge tab.
 * Hidden on demo/tool sub-sites that have their own assistants or dedicated UX.
 */

const EXCLUDED_PREFIXES = [
  '/demo',
  '/supplier-pricing-tool',
  '/3a-roofing',
  '/apex-roofing',
  '/falcon-contracting',
  '/contractor-template',
  '/roofing-solutions',
  '/dashboard',
  '/proposal',
];

const STARTER_PROMPTS = [
  'What can you build for my business?',
  'Show me the roofing demo tools',
  'How does an AI assistant help me get more customers?',
  'I want a quote for custom software',
];

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  streaming?: boolean;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

/** Render a tiny subset of markdown: [label](url) links and **bold**, plus line breaks. */
function renderInline(text: string) {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      const url = m[2];
      parts.push(
        <a
          key={`l${i}`}
          href={url}
          target={url.startsWith('/') ? undefined : '_blank'}
          rel={url.startsWith('/') ? undefined : 'noreferrer'}
          className="font-semibold text-[#d7ff00] underline decoration-[#d7ff00]/50 underline-offset-2 transition hover:text-[#e9ff66] hover:decoration-[#d7ff00]"
        >
          {m[1]}
        </a>
      );
    } else {
      parts.push(<strong key={`b${i}`} className="font-semibold text-white">{m[3]}</strong>);
    }
    last = m.index + m[0].length;
    i += 1;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function T3AssistantLauncher() {
  const pathname = usePathname() ?? '/';
  const excluded = EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const [visible, setVisible] = useState(true); // orb visible (not dismissed)
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const historyRef = useRef<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('t3_assistant_dismissed');
      if (dismissed === '1') setVisible(false);
    } catch {
      // private mode etc.
    }
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setOpen(false);
    try {
      sessionStorage.setItem('t3_assistant_dismissed', '1');
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      setShowIntro(false);
      const userMsg: ChatMessage = { id: uid(), role: 'user', text };
      const assistantId = uid();
      setMessages((prev) => [...prev, userMsg, { id: assistantId, role: 'assistant', text: '', streaming: true }]);
      setInput('');
      setBusy(true);

      const history = historyRef.current.slice(-12);
      try {
        const res = await fetch('/api/assistant-t3', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history, currentPagePath: pathname }),
        });
        if (!res.ok || !res.body) {
          const data = res.status !== 429 ? null : await res.json().catch(() => null);
          throw new Error(data?.error ?? 'The assistant is unavailable right now.');
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let full = '';
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            try {
              const json = JSON.parse(trimmed.slice(5).trim());
              if (json.type === 'token' && typeof json.text === 'string') {
                full += json.text;
                setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, text: full } : m)));
              } else if (json.type === 'error') {
                throw new Error(json.error ?? 'Something went wrong.');
              }
            } catch (e) {
              if (e instanceof Error && e.message !== 'Unexpected end of JSON input' && !(e instanceof SyntaxError)) throw e;
            }
          }
        }
        historyRef.current.push({ role: 'user', content: text }, { role: 'assistant', content: full || '(no reply)' });
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, text: full || 'Sorry, empty reply - try again.', streaming: false } : m)));
      } catch (err) {
        const msgText = err instanceof Error ? err.message : 'Something went wrong.';
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, text: msgText, streaming: false } : m)));
      } finally {
        setBusy(false);
      }
    },
    [busy, pathname]
  );

  if (excluded) return null;

  /* ---------- Collapsed: discreet lime tab on the right edge ---------- */
  if (!visible) {
    return (
      <button
        type="button"
        aria-label="Open the T3 Labs assistant"
        onClick={() => {
          setVisible(true);
          setOpen(true);
          try {
            sessionStorage.removeItem('t3_assistant_dismissed');
          } catch {
            // ignore
          }
        }}
        className="group fixed right-0 top-1/2 z-[60] -translate-y-1/2 rounded-l-xl border border-[#d7ff00]/30 border-r-0 bg-black/85 py-3 pl-2.5 pr-1.5 text-[10px] font-bold uppercase tracking-widest text-[#d7ff00] shadow-[0_0_18px_rgba(215,255,0,0.25)] backdrop-blur transition-all duration-300 hover:pl-4 hover:shadow-[0_0_26px_rgba(215,255,0,0.5)]"
      >
        <span className="[writing-mode:vertical-rl]">T3 · Ask</span>
      </button>
    );
  }

  return (
    <>
      {/* ---------- Launcher orb ---------- */}
      {!open ? (
        <button
          type="button"
          aria-label="Open the T3 Labs assistant"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[60] group"
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-[#d7ff00]/20" aria-hidden />
          <span className="relative grid h-14 w-14 place-items-center rounded-full border border-[#d7ff00]/40 bg-gradient-to-br from-slate-950 to-black shadow-[0_0_28px_rgba(215,255,0,0.35)] transition duration-300 group-hover:shadow-[0_0_40px_rgba(215,255,0,0.6)] group-hover:scale-105">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
            </svg>
          </span>
        </button>
      ) : null}

      {/* ---------- Panel ---------- */}
      {open ? (
        <div
          role="dialog"
          aria-label="T3 Labs Smart Assistant"
          className="fixed bottom-4 right-4 z-[70] flex h-[min(600px,calc(100dvh-2rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-950 via-black to-slate-950 text-slate-100 shadow-[0_0_60px_rgba(0,0,0,0.7),0_0_30px_rgba(215,255,0,0.12)]"
        >
          {/* Header */}
          <div className="relative flex items-center gap-3 border-b border-slate-800 bg-black/60 px-4 py-3">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d7ff00]/70 to-transparent" aria-hidden />
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#d7ff00]/40 bg-slate-950 shadow-[0_0_14px_rgba(215,255,0,0.3)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A3E635" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold tracking-tight text-white">
                T3 Assistant <span className="text-[#d7ff00]">·</span> <span className="text-slate-400 font-medium">online</span>
              </p>
              <p className="truncate text-[11px] text-slate-500">Built by T3 Labs — ask it anything, it IS the product</p>
            </div>
            <button
              type="button"
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Hide assistant"
              title="Hide to a small tab"
              onClick={dismiss}
              className="grid h-8 w-8 place-items-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {showIntro && messages.length === 0 ? (
              <div className="pt-2">
                <p className="text-sm leading-relaxed text-slate-300">
                  <span className="font-bold text-[#d7ff00]">Hey.</span> I&apos;m the T3 Labs Smart Assistant — an example of what we build for businesses. Ask me
                  what we do, what we&apos;ve built, or how we&apos;d solve a problem in your business.
                </p>
                <div className="mt-4 grid gap-2">
                  {STARTER_PROMPTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => send(p)}
                      className="rounded-xl border border-slate-700 bg-slate-900/60 px-3.5 py-2.5 text-left text-xs font-medium text-slate-300 transition hover:border-[#d7ff00]/50 hover:bg-slate-800/80 hover:text-white hover:shadow-[0_0_14px_rgba(215,255,0,0.12)]"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m) => (
              <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] rounded-2xl rounded-br-md bg-[#d7ff00] px-3.5 py-2.5 text-[13px] font-medium leading-relaxed text-black shadow-[0_0_18px_rgba(215,255,0,0.25)]'
                      : 'max-w-[90%] rounded-2xl rounded-bl-md border border-slate-700/80 bg-slate-900/70 px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-200'
                  }
                >
                  {m.streaming && !m.text ? (
                    <span className="inline-flex gap-1 py-1" aria-label="Thinking">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d7ff00]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d7ff00] [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d7ff00] [animation-delay:300ms]" />
                    </span>
                  ) : (
                    renderInline(m.text)
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-slate-800 bg-black/60 p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                maxLength={1200}
                placeholder="Ask about our services, tools, pricing…"
                aria-label="Message the T3 Labs assistant"
                className="max-h-28 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-900/70 px-3.5 py-2.5 text-[13px] text-slate-100 placeholder:text-slate-500 focus:border-[#d7ff00]/60 focus:outline-none focus:shadow-[0_0_14px_rgba(215,255,0,0.15)]"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#d7ff00]/40 bg-[#d7ff00]/10 text-[#d7ff00] transition hover:bg-[#d7ff00] hover:text-black hover:shadow-[0_0_20px_rgba(215,255,0,0.45)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#d7ff00]/10 disabled:hover:text-[#d7ff00]"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </form>
            <p className="mt-2 text-center text-[10px] text-slate-600">
              Smart Assistant by <a href="/" className="text-slate-500 underline underline-offset-2 hover:text-[#d7ff00]">T3 Labs</a> — this could be on your website
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
