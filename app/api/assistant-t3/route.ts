import { NextResponse } from 'next/server';
import { T3_CONFIG, buildT3SystemPrompt } from '@/lib/assistant-t3/prompt';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

/** Simple in-memory per-IP rate limit (public marketing site, cheap guard). */
const WINDOW_MIN_MS = 60_000;
const WINDOW_HOUR_MS = 60 * 60_000;
const ipHits = new Map<string, number[]>();

function checkRateLimit(ip: string): { ok: true } | { ok: false; error: string; retryAfter: number } {
  const now = Date.now();
  if (ipHits.size > 5000) ipHits.clear();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < WINDOW_HOUR_MS);
  const perMin = hits.filter((t) => now - t < WINDOW_MIN_MS).length;
  if (perMin >= T3_CONFIG.rateLimit.maxPerMinute) {
    return { ok: false, error: 'Too many messages. Give it a minute and try again.', retryAfter: 60 };
  }
  if (hits.length >= T3_CONFIG.rateLimit.maxPerHour) {
    return { ok: false, error: 'You have reached the hourly limit for this assistant. Please try again later.', retryAfter: 3600 };
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return { ok: true };
}

function clientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}

/** GET: public config for the launcher UI. */
export async function GET() {
  return NextResponse.json({
    assistantName: T3_CONFIG.assistantName,
    maxUserMessageChars: T3_CONFIG.maxUserMessageChars,
  });
}

/** Hard guarantee: no em dashes ever reach the visitor, prompt rules aside. */
function stripEmDashes(text: string): string {
  // \u2014 escape = em dash. Literal character deliberately not used so repo-wide
  // no-em-dash sweeps cannot corrupt this sanitizer.
  return text.replace(/ ?\u2014 ?/g, ', ');
}

/** POST: streaming chat turn (SSE with token events, then a final done event). */
export async function POST(req: Request) {
  let body: { message?: unknown; history?: unknown; currentPagePath?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message) return NextResponse.json({ error: 'Message is empty.' }, { status: 400 });
  if (message.length > T3_CONFIG.maxUserMessageChars) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
  }

  const guard = checkRateLimit(clientIp(req.headers));
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: 429, headers: { 'Retry-After': String(guard.retryAfter) } });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'The assistant is not configured right now. Please try again later.' }, { status: 503 });
  }

  // Bounded client-supplied history (sanitised below via the OpenAI call structure)
  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const history: HistoryMessage[] = rawHistory
    .filter(
      (m): m is HistoryMessage =>
        !!m &&
        typeof m === 'object' &&
        (m as HistoryMessage).role !== undefined &&
        typeof (m as HistoryMessage).content === 'string'
    )
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({ role: m.role, content: m.content.slice(0, T3_CONFIG.maxUserMessageChars) }))
    .slice(-T3_CONFIG.maxHistoryMessages);

  const currentPagePath = typeof body.currentPagePath === 'string' ? body.currentPagePath.slice(0, 200) : undefined;

  const messages = [
    { role: 'system', content: buildT3SystemPrompt(currentPagePath) },
    ...history,
    { role: 'user', content: message },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (obj: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: T3_CONFIG.model,
            messages,
            stream: true,
            temperature: 0.6,
            max_tokens: 500,
          }),
          signal: AbortSignal.timeout(45_000),
        });

        if (!res.ok || !res.body) {
          console.error(`[assistant-t3] upstream ${res.status}`);
          send({ type: 'error', error: 'The assistant is temporarily unavailable. Please try again shortly.' });
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === '[DONE]') continue;
            try {
              const json = JSON.parse(payload);
              const delta = json.choices?.[0]?.delta?.content;
              if (typeof delta === 'string' && delta) send({ type: 'token', text: stripEmDashes(delta) });
            } catch {
              // ignore malformed keep-alive chunks
            }
          }
        }
        send({ type: 'done' });
      } catch (err) {
        console.error('[assistant-t3] turn failed:', err instanceof Error ? err.message : err);
        send({ type: 'error', error: 'Something went wrong on our side. Please try again in a moment.' });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform' },
  });
}
