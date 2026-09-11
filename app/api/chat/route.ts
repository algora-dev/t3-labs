import { NextResponse } from 'next/server';
import { getAssistantConfig } from '@/lib/assistant/data';
import { getOrCreateSession, checkGuards, saveSession } from '@/lib/assistant/session';
import { runAssistantTurn, TurnError } from '@/lib/assistant/orchestrator';
import { checkIpRateLimit, clientIpFromHeaders } from '@/lib/assistant/rate-limit';
import { describePricedDraft, validateEstimateDraftInput } from '@/lib/assistant/estimate-draft';
import { priceDraft, HEURISTIC_COMPONENT_IDS, type EstimateDraft } from '@/lib/pricing/estimate-engine';
import { getActiveItems, getCatalog } from '@/lib/pricing/catalog';
import { getEstimateRules, getV4Rules } from '@/lib/pricing/rules';
import type { ChatStreamEvent, AssistantTurn } from '@/lib/assistant/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** GET: public client config for the chat UI (starter prompts etc. - no secrets). */
export async function GET() {
  const config = getAssistantConfig();
  return NextResponse.json({
    assistantName: config.assistantName,
    assistantLabel: config.assistantLabel ?? config.assistantName,
    brandName: config.brandName ?? 'the business',
    accentColor: config.accentColor ?? '#1769E0',
    launcherSubtitle: config.launcherSubtitle ?? 'Smart business assistant',
    teaserTitle: config.teaserTitle ?? 'This is a Smart Website',
    teaserText: config.teaserText ?? 'Instead of searching through pages, just ask.',
    teaserExample: config.teaserExample ?? config.starterPrompts[0] ?? '',
    openingIntro: config.openingIntro ?? 'Ask me anything about this business.',
    demoFooter: config.demoFooter ?? 'Interactive demo by T3 Labs',
    starterPrompts: config.starterPrompts,
    maxUserMessageChars: config.maxUserMessageChars,
    estimator: buildEstimatorConfig(),
  });
}

/** Structured guided-estimator config for the client UI (V4). Built from data files only. */
function buildEstimatorConfig() {
  const catalog = getActiveItems();
  const v4 = getV4Rules();
  return {
    coverings: catalog
      .filter((i) => i.category === 'reroofing')
      .map((i) => ({ id: i.id, name: i.name, blurb: i.description, minPitchDegrees: getEstimateRules().materialPitchRules?.[i.id]?.minPitchDegrees })),
    components: catalog
      .filter((i) => i.category === 'component')
      .map((i) => ({ id: i.id, name: i.name, unit: i.unit, estimable: (HEURISTIC_COMPONENT_IDS as readonly string[]).includes(i.id) })),
    sizeBands: Object.entries(v4.sizeBands).map(([id, band]) => ({ id, ...band })),
    pitchBands: Object.entries(v4.pitchBands).map(([id, band]) => ({ id, label: band.label, minDegrees: band.minDegrees, maxDegrees: band.maxDegrees, representativeDegrees: band.representativeDegrees })),
    removal: v4.reroofAllowances,
    currencySymbol: getCatalog().symbol,
  };
}

/** POST: streaming chat turn over SSE. */
export async function POST(req: Request) {
  let body: { message?: unknown; currentPagePath?: unknown; clientAction?: { type?: unknown; draft?: unknown } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const message = typeof body.message === 'string' ? body.message : '';
  const clientAction = body.clientAction;

  // Per-IP rate limit (spec 15.5) - applies before session work
  const ipGuard = checkIpRateLimit(clientIpFromHeaders(req.headers));
  if (!ipGuard.ok) {
    return NextResponse.json({ error: ipGuard.error }, { status: 429 });
  }

  const session = await getOrCreateSession();

  // Context awareness (V4 brief section 21): remember which page the visitor is viewing.
  if (typeof body.currentPagePath === 'string' && body.currentPagePath.length <= 200) {
    session.currentPagePath = body.currentPagePath;
  }

  // Structured client actions (V4 brief section 22): validated server-side, never regex-parsed prose.
  if (clientAction && typeof clientAction === 'object' && clientAction.type === 'ESTIMATE_DRAFT_SUBMIT') {
    const guard = checkGuards(session, 'estimate draft');
    if (!guard.ok) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }
    const validated = validateEstimateDraftInput(clientAction.draft);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }
    const draft: EstimateDraft = validated.draft;
    const result = priceDraft(draft);

    session.draft = draft;
    session.facts.projectType = draft.projectType;
    session.facts.material = draft.materialId ?? null;
    if (draft.area.exactM2 != null) session.facts.roofArea = draft.area.exactM2;
    session.facts.areaType = draft.area.areaType;
    session.facts.roofShape = draft.roofShape ?? 'unknown';
    if (draft.pitch.degrees != null) session.facts.pitchDegrees = draft.pitch.degrees;
    else if (draft.pitch.band) session.facts.pitchDegrees = getV4Rules().pitchBands[draft.pitch.band].representativeDegrees;
    session.facts.estimateScope = draft.components.some((c) => c.selected)
      ? draft.components.some((c) => c.selected && c.quantity == null)
        ? 'estimated_components'
        : 'specified_components'
      : 'covering_only';
    session.facts.components = draft.components
      .filter((c) => c.selected)
      .map((c) => ({ catalogItemId: c.componentId, quantity: c.quantity ?? null }));

    const estimates = result.mode === 'single' ? [result.estimate] : [result.low, result.high];
    for (const estimate of estimates) session.estimates[estimate.id] = estimate;
    const latest = estimates[estimates.length - 1];
    session.estimateFlow = {
      active: false,
      clarificationCount: session.estimateFlow.clarificationCount,
      latestEstimateId: latest.id,
      latestEstimateIds: estimates.map((estimate) => estimate.id),
    };
    session.messages.push({ role: 'user', content: '[Completed the guided estimate form]' });
    session.messages.push({ role: 'assistant', content: describePricedDraft(result) });
    session.turnCount += 1;
    await saveSession(session);

    const encoder0 = new TextEncoder();
    const turn: AssistantTurn = {
      message: describePricedDraft(result),
      cards: [{ type: 'estimate_result', result }],
      actions: [
        { type: 'OPEN_INQUIRY', label: 'Request Official Quote' },
        { type: 'ADJUST_ESTIMATE', label: 'Adjust Estimate' },
        { type: 'DOWNLOAD_OUTPUT', label: 'Download PDF', estimateId: latest.id, estimateIds: estimates.map((estimate) => estimate.id) },
      ],
      sessionFactsUpdated: true,
    };
    const actionStream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(encoder0.encode(`data: ${JSON.stringify({ type: 'turn', turn } satisfies ChatStreamEvent)}\n\n`));
        controller.close();
      },
    });
    return new Response(actionStream, {
      headers: { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-cache, no-transform' },
    });
  }

  const guard = checkGuards(session, message);
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  await saveSession(session);

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
        await saveSession(session);

        send({ type: 'turn', turn });
      } catch (err) {
        // Never leak provider error dumps to the visitor (spec 15.5)
        if (err instanceof TurnError) {
          console.error(`[assistant] session ${sid} turn failed (${err.kind})`);
          send({
            type: 'error',
            error:
              err.kind === 'timeout'
                ? 'Sorry - the assistant took too long to reply. Please try again in a moment.'
                : "Sorry - the assistant service is temporarily unavailable. Please try again shortly.",
          });
        } else {
          console.error(`[assistant] session ${sid} turn failed:`, err instanceof Error ? err.message : err);
          send({
            type: 'error',
            error: "Sorry - something went wrong on our side. Please try again in a moment.",
          });
        }
      } finally {
        try {
          await saveSession(session);
        } catch {
          // Best effort only. The response should still close cleanly.
        }
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
