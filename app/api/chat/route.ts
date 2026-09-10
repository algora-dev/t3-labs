import { NextResponse } from 'next/server';
import { getAssistantConfig } from '@/lib/assistant/data';
import { getOrCreateSession, checkGuards } from '@/lib/assistant/session';
import { runAssistantTurn } from '@/lib/assistant/orchestrator';
import type { ChatStreamEvent } from '@/lib/assistant/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET: public client config for the chat UI (starter prompts etc. - no secrets). */
export async function GET() {
  const config = getAssistantConfig();
  return NextResponse.json({
    assistantName: config.assistantName,
    starterPrompts: config.starterPrompts,
    maxUserMessageChars: config.maxUserMessageChars,
  });
}

/** POST: streaming chat turn over SSE. */
export async function POST(req: Request) {
  let body: { message?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const message = typeof body.message === 'string' ? body.message : '';

  const session = await getOrCreateSession();

  const guard = checkGuards(session, message);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'The Smart Assistant demo is not fully configured right now (missing OPENAI_API_KEY). Please try again later.' },
      { status: 503 }
    );
  }

  const encoder = new TextEncoder();
  const sid = session.sessionId;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ChatStreamEvent) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };
      try {
        const turn = await runAssistantTurn(session, message, (t) => send({ type: 'token', text: t }));

        // Persist this turn in session state (per-session isolation)
        session.messages.push({ role: 'user', content: message });
        session.messages.push({ role: 'assistant', content: turn.message });
        session.turnCount += 1;

        send({ type: 'turn', turn });
      } catch (err) {
        console.error(`[assistant] session ${sid} turn failed:`, err instanceof Error ? err.message : err);
        send({
          type: 'error',
          error: "Sorry - something went wrong on our side. Please try again in a moment.",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
