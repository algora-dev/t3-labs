import { getAssistantConfig, resolveSiteTopic } from './data';
import { buildSystemPrompt } from './prompts';
import type { AssistantSession } from './session';
import { recentMessages } from './session';
import type { AssistantAction, AssistantCard, AssistantTurn } from './types';
import { createEstimate, type AreaType, type RoofShape } from '../pricing/estimate-engine';
import { findItem, getCatalog } from '../pricing/catalog';

/**
 * Orchestrated pipeline (spec 10.1): model classifies/extracts via tool calls,
 * server executes all retrieval/calculation deterministically, model composes
 * prose only. UI cards/actions are derived server-side from validated tool
 * results - the frontend never parses prose and the model never sets prices.
 */

type ChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string | null;
  tool_calls?: { id: string; type: 'function'; function: { name: string; arguments: string } }[];
  tool_call_id?: string;
  name?: string;
};

type ToolHandler = (args: Record<string, unknown>, session: AssistantSession, turn: TurnState) => unknown;

interface TurnState {
  cards: AssistantCard[];
  actions: AssistantAction[];
  factsUpdated: boolean;
  latestEstimateId: string | null;
}

const AREA_TYPES: AreaType[] = ['actual_roof_area', 'plan_area', 'unknown'];
const ROOF_SHAPES: RoofShape[] = ['gable', 'hip', 'valley_complex', 'flat', 'unknown'];

function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}
function num(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}
function bool(v: unknown): boolean {
  return v === true;
}

/* ---------- tool definitions (OpenAI function calling) ---------- */

function toolDefinitions() {
  return [
    {
      type: 'function',
      function: {
        name: 'retrieve_price',
        description:
          'Look up an exact price/rate from the approved pricing catalogue. Use for any direct pricing question.',
        parameters: {
          type: 'object',
          properties: {
            catalogItemIdOrQuery: { type: 'string', description: 'Catalogue item id or natural-language query, e.g. "concrete tile"' },
          },
          required: ['catalogItemIdOrQuery'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'create_estimate',
        description:
          'Create a deterministic indicative estimate. Server code performs ALL pricing maths from the approved catalogue and rules. Provide every field you know.',
        parameters: {
          type: 'object',
          properties: {
            roofArea: { type: 'number', description: 'Roof area in m2' },
            areaType: { type: 'string', enum: AREA_TYPES, description: 'Is roofArea the actual sloped roof area or the plan/footprint area?' },
            roofShape: { type: 'string', enum: ROOF_SHAPES },
            pitchDegrees: { type: 'number' },
            material: { type: 'string', description: 'Material name or catalogue id' },
            includeGutters: { type: 'boolean' },
            includeInsulation: { type: 'boolean' },
            includeFlashings: { type: 'boolean' },
            extras: { type: 'array', items: { type: 'string' }, description: 'Extra catalogue item ids to add' },
          },
          required: ['roofArea', 'areaType', 'roofShape'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'ask_clarification',
        description: 'Ask the user ONE clarification question for the current estimate flow. Server enforces a hard limit of 2.',
        parameters: {
          type: 'object',
          properties: { question: { type: 'string' } },
          required: ['question'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'navigate',
        description: 'Send the user to a website page/section. topicId must be one of the valid ids listed in the system prompt.',
        parameters: {
          type: 'object',
          properties: { topicId: { type: 'string' } },
          required: ['topicId'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'open_inquiry',
        description: 'Hand off to the human Apex team with the conversation context. Use for buying intent or RED-zone questions.',
        parameters: { type: 'object', properties: {} },
      },
    },
    {
      type: 'function',
      function: {
        name: 'update_facts',
        description: 'Store project details the user volunteered (location, roof shape, size, material, etc.). Only include fields actually provided.',
        parameters: {
          type: 'object',
          properties: {
            projectType: { type: 'string' },
            roofArea: { type: 'number' },
            areaType: { type: 'string', enum: AREA_TYPES },
            roofShape: { type: 'string', enum: ROOF_SHAPES },
            pitchDegrees: { type: 'number' },
            material: { type: 'string' },
            location: { type: 'string' },
            extras: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  ];
}

/* ---------- server-side tool execution (validated, deterministic) ---------- */

const handlers: Record<string, ToolHandler> = {
  retrieve_price(args) {
    const query = str(args.catalogItemIdOrQuery) ?? '';
    const item = findItem(query);
    if (!item) {
      return {
        found: false,
        message: `No catalogue item matches "${query}". Tell the user you don't have an approved price for that and offer an enquiry (open_inquiry) if appropriate.`,
      };
    }
    const cat = getCatalog();
    return {
      found: true,
      item,
      currency: cat.currency,
      symbol: cat.symbol,
      note: 'Quote this rate exactly. It is supply-and-installed unless stated otherwise.',
    };
  },

  create_estimate(args, session, turn) {
    const roofArea = num(args.roofArea);
    if (roofArea == null || roofArea <= 0 || roofArea > 100000) {
      return { error: 'Invalid or missing roofArea (m2). Ask the user for the approximate roof area.' };
    }
    const areaType = AREA_TYPES.includes(args.areaType as AreaType) ? (args.areaType as AreaType) : 'unknown';
    const roofShape = ROOF_SHAPES.includes(args.roofShape as RoofShape) ? (args.roofShape as RoofShape) : 'unknown';
    const extras = Array.isArray(args.extras)
      ? args.extras.filter((e): e is string => typeof e === 'string' && !!findItem(e))
      : [];

    const estimate = createEstimate({
      roofArea,
      areaType,
      roofShape,
      pitchDegrees: num(args.pitchDegrees),
      material: str(args.material),
      includeGutters: bool(args.includeGutters),
      includeInsulation: bool(args.includeInsulation),
      includeFlashings: bool(args.includeFlashings),
      extras,
    });

    // Update session facts from validated estimate inputs
    const f = session.facts;
    f.roofArea = roofArea;
    f.areaType = areaType;
    f.roofShape = roofShape;
    if (args.pitchDegrees != null) f.pitchDegrees = num(args.pitchDegrees);
    if (str(args.material)) f.material = str(args.material);
    if (extras.length) f.extras = [...new Set([...f.extras, ...extras])];
    session.estimateFlow = { active: false, clarificationCount: session.estimateFlow.clarificationCount, latestEstimateId: estimate.id };
    // Keep the canonical estimate server-side so the PDF is rendered from
    // validated data only (spec 14.2) and outputs can be session-validated.
    session.estimates[estimate.id] = estimate;

    turn.cards.push({ type: 'estimate', estimate });
    turn.latestEstimateId = estimate.id;
    turn.factsUpdated = true;
    return { estimate, message: 'Summarise this estimate in plain English. Mention the total and key assumptions only - the UI shows the full card.' };
  },

  ask_clarification(args, session) {
    const config = getAssistantConfig();
    const question = str(args.question);
    if (!question) return { error: 'Missing question.' };
    const flow = session.estimateFlow;
    if (!flow.active) {
      flow.active = true;
      flow.clarificationCount = 0;
    }
    if (flow.clarificationCount >= config.maxClarificationQuestions) {
      return {
        status: 'limit_reached',
        instruction: `CLARIFICATION LIMIT REACHED (${config.maxClarificationQuestions} questions already asked). Do NOT ask anything more. Call create_estimate now with your best assumptions - the engine records all assumptions on the estimate.`,
      };
    }
    flow.clarificationCount += 1;
    return { status: 'ok', askedSoFar: flow.clarificationCount, max: config.maxClarificationQuestions, question };
  },

  navigate(args, _session, turn) {
    const topicId = str(args.topicId) ?? '';
    const entry = resolveSiteTopic(topicId);
    if (!entry) {
      return { error: `Unknown topicId "${topicId}". Use only the valid ids from the system prompt.` };
    }
    turn.actions.push({
      type: 'NAVIGATE_INTERNAL',
      label: entry.external ? `Open ${entry.title}` : `View: ${entry.title}`,
      url: entry.path,
      external: entry.external === true,
    });
    return { ok: true, title: entry.title, path: entry.path };
  },

  open_inquiry(_args, _session, turn) {
    turn.actions.push({ type: 'OPEN_INQUIRY', label: 'Make an enquiry' });
    turn.cards.push({ type: 'handoff', summary: 'Your conversation details will be attached to the enquiry.' });
    return { ok: true, message: 'The UI will show an enquiry button with conversation context attached.' };
  },

  update_facts(args, session, turn) {
    const f = session.facts;
    let changed = false;
    const p = str(args.projectType);
    if (p) { f.projectType = p; changed = true; }
    const a = num(args.roofArea);
    if (a && a > 0 && a <= 100000) { f.roofArea = a; changed = true; }
    if (AREA_TYPES.includes(args.areaType as AreaType)) { f.areaType = args.areaType as string; changed = true; }
    if (ROOF_SHAPES.includes(args.roofShape as RoofShape)) { f.roofShape = args.roofShape as string; changed = true; }
    const pd = num(args.pitchDegrees);
    if (pd != null && pd >= 0 && pd <= 85) { f.pitchDegrees = pd; changed = true; }
    const m = str(args.material);
    if (m) { f.material = m; changed = true; }
    const l = str(args.location);
    if (l) { f.location = l; changed = true; }
    if (Array.isArray(args.extras)) {
      const ex = args.extras.filter((e): e is string => typeof e === 'string');
      if (ex.length) { f.extras = [...new Set([...f.extras, ...ex])]; changed = true; }
    }
    if (changed) turn.factsUpdated = true;
    return { ok: true, facts: f };
  },
};

/* ---------- error kinds (spec 15.5: never leak provider dumps) ---------- */

export type TurnErrorKind = 'timeout' | 'upstream' | 'unknown';

export class TurnError extends Error {
  constructor(public readonly kind: TurnErrorKind) {
    super(`assistant turn failed: ${kind}`);
  }
}

/* ---------- OpenAI streaming client (plain fetch, key never leaves server) ---------- */

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

interface StreamOutcome {
  content: string;
  toolCalls: { id: string; name: string; arguments: string }[];
}

async function streamCompletion(
  apiKey: string,
  messages: ChatMessage[],
  onToken: (t: string) => void,
  timeoutMs: number
): Promise<StreamOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: getAssistantConfig().model, messages, tools: toolDefinitions(), stream: true }),
      signal: controller.signal,
    });
    if (!res.ok || !res.body) {
      throw new TurnError('upstream');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let content = '';
    const toolCalls: { id: string; name: string; arguments: string }[] = [];

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const chunks = buffer.split('\n\n');
      buffer = chunks.pop() ?? '';
      for (const chunk of chunks) {
        const line = chunk.split('\n').find((l) => l.startsWith('data: '));
        if (!line) continue;
        const payload = line.slice(6).trim();
        if (payload === '[DONE]') return { content, toolCalls };
        let delta: {
          content?: string | null;
          tool_calls?: { index: number; id?: string; function?: { name?: string; arguments?: string } }[];
        };
        try {
          delta = JSON.parse(payload).choices?.[0]?.delta ?? {};
        } catch {
          continue;
        }
        if (typeof delta.content === 'string' && delta.content) {
          content += delta.content;
          onToken(delta.content);
        }
        for (const tc of delta.tool_calls ?? []) {
          const idx = tc.index ?? 0;
          toolCalls[idx] ??= { id: tc.id ?? `call_${idx}`, name: '', arguments: '' };
          if (tc.id) toolCalls[idx].id = tc.id;
          if (tc.function?.name) toolCalls[idx].name += tc.function.name;
          if (tc.function?.arguments) toolCalls[idx].arguments += tc.function.arguments;
        }
      }
    }
    return { content, toolCalls };
  } catch (err) {
    if (err instanceof TurnError) throw err;
    if (err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError')) {
      throw new TurnError('timeout');
    }
    throw new TurnError('unknown');
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- public orchestrator ---------- */

export async function runAssistantTurn(
  session: AssistantSession,
  userMessage: string,
  onToken: (t: string) => void
): Promise<AssistantTurn> {
  const apiKey = process.env.OPENAI_API_KEY;
  const config = getAssistantConfig();

  const messages: ChatMessage[] = [
    { role: 'system', content: buildSystemPrompt(session) },
    ...recentMessages(session).map((m) => ({ role: m.role, content: m.content }) as ChatMessage),
    { role: 'user', content: userMessage },
  ];

  const turnState: TurnState = { cards: [], actions: [], factsUpdated: false, latestEstimateId: null };
  let finalContent = '';
  const turnStartedAt = Date.now();
  const maxTurnDurationMs = config.turnTimeoutMs * 2; // overall cap across tool hops

  if (!apiKey) {
    return {
      message: "Sorry - the assistant is temporarily unavailable. Please try again later. (Demo note: OPENAI_API_KEY is not configured on the server.)",
    };
  }

  // Up to 4 model round-trips per turn (tool loop), with an overall duration cap
  for (let hop = 0; hop < 4; hop++) {
    if (Date.now() - turnStartedAt > maxTurnDurationMs) {
      throw new TurnError('timeout');
    }
    const outcome = await streamCompletion(apiKey, messages, onToken, config.turnTimeoutMs);
    finalContent = outcome.content || finalContent;

    const validCalls = outcome.toolCalls.filter((tc) => tc.name && handlers[tc.name]);
    if (validCalls.length === 0) break;

    messages.push({
      role: 'assistant',
      content: outcome.content || null,
      tool_calls: validCalls.map((tc) => ({ id: tc.id, type: 'function', function: { name: tc.name, arguments: tc.arguments || '{}' } })),
    });
    for (const tc of validCalls) {
      let args: Record<string, unknown> = {};
      try {
        args = tc.arguments ? JSON.parse(tc.arguments) : {};
      } catch {
        args = {};
      }
      let result: unknown;
      try {
        result = handlers[tc.name](args, session, turnState);
      } catch {
        result = { error: 'Tool execution failed.' };
      }
      messages.push({ role: 'tool', tool_call_id: tc.id, name: tc.name, content: JSON.stringify(result) });
    }
  }

  // Attach standard follow-up actions when an estimate was produced
  if (turnState.latestEstimateId) {
    turnState.actions.push({ type: 'DOWNLOAD_OUTPUT', label: 'Download PDF', estimateId: turnState.latestEstimateId });
    turnState.actions.push({ type: 'OPEN_INQUIRY', label: 'Make an enquiry from this estimate' });
    turnState.actions.push({
      type: 'ADD_ESTIMATE_OPTION',
      label: 'Add gutter replacement',
      followUpMessage: 'Can you add gutter replacement to the estimate?',
    });
  }

  const turn: AssistantTurn = {
    message: finalContent.trim() || 'Here you go.',
  };
  if (turnState.cards.length) turn.cards = turnState.cards;
  if (turnState.actions.length) turn.actions = dedupeActions(turnState.actions);
  if (turnState.factsUpdated) turn.sessionFactsUpdated = true;
  return turn;
}

function dedupeActions(actions: AssistantAction[]): AssistantAction[] {
  const seen = new Set<string>();
  const out: AssistantAction[] = [];
  for (const a of actions) {
    const key = a.type + ('url' in a ? a.url : '') + ('label' in a ? a.label : '');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(a);
  }
  return out;
}
