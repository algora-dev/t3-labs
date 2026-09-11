import { getAssistantConfig, resolveSiteTopic } from './data';
import { buildSystemPrompt } from './prompts';
import type { AssistantSession } from './session';
import { recentMessages } from './session';
import type { AssistantAction, AssistantCard, AssistantTurn } from './types';
import {
  createEstimate,
  type AreaType,
  type EstimateComponentSelection,
  type EstimateScope,
  type RoofShape,
} from '../pricing/estimate-engine';
import { findItem, getCatalog, getItemById } from '../pricing/catalog';

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
const ESTIMATE_SCOPES: EstimateScope[] = ['covering_only', 'specified_components', 'estimated_components'];

function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}
function num(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function toolDefinitions() {
  return [
    {
      type: 'function',
      function: {
        name: 'retrieve_price',
        description: 'Look up an exact price/rate from the approved pricing catalogue. Use for direct pricing questions.',
        parameters: {
          type: 'object',
          properties: {
            catalogItemIdOrQuery: { type: 'string', description: 'Catalogue item id or natural-language query.' },
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
          'Create a deterministic indicative estimate. The server performs all maths. IMPORTANT: componentScope must reflect an explicit customer choice. Never choose a broader scope on the customer\'s behalf.',
        parameters: {
          type: 'object',
          properties: {
            roofArea: { type: 'number', description: 'Roof area in m2.' },
            areaType: { type: 'string', enum: AREA_TYPES },
            roofShape: { type: 'string', enum: ROOF_SHAPES },
            pitchDegrees: { type: 'number' },
            material: { type: 'string', description: 'Material name or catalogue id.' },
            componentScope: {
              type: 'string',
              enum: ESTIMATE_SCOPES,
              description: 'covering_only, specified_components, or estimated_components. Must come from an explicit customer choice.',
            },
            components: {
              type: 'array',
              description: 'Explicitly selected component catalogue ids and optional user-supplied quantities. Linear quantities are in lm.',
              items: {
                type: 'object',
                properties: {
                  catalogItemId: { type: 'string' },
                  quantity: { type: 'number' },
                },
                required: ['catalogItemId'],
              },
            },
            extras: { type: 'array', items: { type: 'string' } },
          },
          required: ['roofArea', 'componentScope'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'ask_clarification',
        description: 'Ask one short estimate clarification. Use a structured kind when available so the UI can show useful choices.',
        parameters: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            kind: {
              type: 'string',
              enum: ['material', 'estimate_scope', 'roof_shape', 'area_type', 'components', 'generic'],
            },
          },
          required: ['question'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'navigate',
        description: 'Send the user to an approved website page or section.',
        parameters: { type: 'object', properties: { topicId: { type: 'string' } }, required: ['topicId'] },
      },
    },
    {
      type: 'function',
      function: {
        name: 'open_inquiry',
        description: 'Hand off to the human team with the conversation context.',
        parameters: { type: 'object', properties: {} },
      },
    },
    {
      type: 'function',
      function: {
        name: 'update_facts',
        description: 'Store project details the user volunteered. Only include fields actually provided or explicitly selected.',
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
            estimateScope: { type: 'string', enum: ESTIMATE_SCOPES },
            components: {
              type: 'array',
              items: { type: 'object', properties: { catalogItemId: { type: 'string' }, quantity: { type: 'number' } }, required: ['catalogItemId'] },
            },
            extras: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  ];
}

function parseComponents(value: unknown): EstimateComponentSelection[] {
  if (!Array.isArray(value)) return [];
  const out: EstimateComponentSelection[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') continue;
    const obj = raw as Record<string, unknown>;
    const query = str(obj.catalogItemId);
    if (!query) continue;
    const item = getItemById(query) ?? findItem(query);
    if (!item || item.category !== 'component') continue;
    const quantity = num(obj.quantity);
    out.push({ catalogItemId: item.id, quantity: quantity && quantity > 0 ? quantity : null });
  }
  return out;
}

function mergeComponents(existing: EstimateComponentSelection[], incoming: EstimateComponentSelection[]) {
  const merged = new Map<string, EstimateComponentSelection>();
  for (const item of existing) merged.set(item.catalogItemId, item);
  for (const item of incoming) merged.set(item.catalogItemId, item);
  return [...merged.values()];
}

function addClarificationActions(kind: string | null, turn: TurnState) {
  if (kind === 'material') {
    turn.actions.push(
      { type: 'QUICK_REPLY', label: 'Concrete tile', description: 'Good value and durable', message: 'Use concrete tile for the estimate.', emphasis: 'primary' },
      { type: 'QUICK_REPLY', label: 'Clay tile', description: 'Classic appearance', message: 'Use clay tile for the estimate.' },
      { type: 'QUICK_REPLY', label: 'Natural slate', description: 'Premium option', message: 'Use natural slate for the estimate.' },
      { type: 'QUICK_REPLY', label: 'Help me choose', description: 'Compare the options first', message: "I'm not sure which material. Help me choose before pricing." },
    );
  }
  if (kind === 'estimate_scope') {
    turn.actions.push(
      {
        type: 'QUICK_REPLY',
        label: 'Roof covering only',
        description: 'Price the main roof area only',
        message: 'Price the main roof covering only. Do not add separate ridge, hip, valley, flashing, gutter or insulation items.',
        emphasis: 'primary',
      },
      {
        type: 'QUICK_REPLY',
        label: 'Add components I know',
        description: 'I can give approximate lengths',
        message: 'I want to include extra roof components and can give you rough lengths. Ask me for the components and quantities.',
      },
      {
        type: 'QUICK_REPLY',
        label: 'Estimate roof components',
        description: 'Use roof shape for indicative allowances',
        message: 'Estimate the typical ridge, hip and valley components from the roof shape. Keep them clearly marked as indicative allowances.',
      },
    );
  }
  if (kind === 'roof_shape') {
    turn.actions.push(
      { type: 'QUICK_REPLY', label: 'Gable', message: 'It is a gable roof.' },
      { type: 'QUICK_REPLY', label: 'Hip', message: 'It is a hip roof.' },
      { type: 'QUICK_REPLY', label: 'Hip and valley', message: 'It is a hip and valley / complex roof.' },
      { type: 'QUICK_REPLY', label: 'Not sure', message: "I'm not sure of the roof shape. Use a clearly stated assumption if you can." },
    );
  }
  if (kind === 'area_type') {
    turn.actions.push(
      { type: 'QUICK_REPLY', label: 'Actual roof area', message: 'That is the actual sloped roof surface area.' },
      { type: 'QUICK_REPLY', label: 'Footprint / plan area', message: 'That is the plan or footprint area, not the sloped surface area.' },
      { type: 'QUICK_REPLY', label: 'Not sure', message: "I'm not sure which area type it is. Treat it as actual roof area and state that assumption." },
    );
  }
}

const handlers: Record<string, ToolHandler> = {
  retrieve_price(args) {
    const query = str(args.catalogItemIdOrQuery) ?? '';
    const item = findItem(query);
    if (!item) return { found: false, message: 'No approved catalogue price matched. Do not invent one.' };
    const cat = getCatalog();
    return { found: true, item, currency: cat.currency, symbol: cat.symbol, note: 'Quote this rate exactly.' };
  },

  create_estimate(args, session, turn) {
    const roofArea = num(args.roofArea) ?? session.facts.roofArea;
    if (roofArea == null || roofArea <= 0 || roofArea > 100000) {
      return { error: 'MISSING_ROOF_AREA', instruction: 'Ask for the approximate roof area before estimating.' };
    }

    const materialQuery = str(args.material) ?? session.facts.material;
    if (!materialQuery) {
      return { error: 'MISSING_MATERIAL', instruction: 'Ask which roofing material they want. Use ask_clarification with kind material.' };
    }
    const materialItem = findItem(materialQuery);
    if (!materialItem || materialItem.category !== 'reroofing') {
      return {
        error: 'UNKNOWN_MATERIAL',
        instruction: 'That material is not an approved re-roofing item in the price catalogue. Do not substitute another material. Ask the customer to choose an approved material using ask_clarification with kind material.',
      };
    }
    const material = materialItem.id;

    const requestedScope = ESTIMATE_SCOPES.includes(args.componentScope as EstimateScope)
      ? (args.componentScope as EstimateScope)
      : session.facts.estimateScope;
    if (!requestedScope) {
      return {
        error: 'MISSING_ESTIMATE_SCOPE',
        instruction: 'Do not guess roof components. Ask whether they want roof covering only, specified components, or explicitly estimated components. Use ask_clarification with kind estimate_scope.',
      };
    }

    const areaType = AREA_TYPES.includes(args.areaType as AreaType)
      ? (args.areaType as AreaType)
      : AREA_TYPES.includes(session.facts.areaType as AreaType)
        ? (session.facts.areaType as AreaType)
        : 'unknown';
    const roofShape = ROOF_SHAPES.includes(args.roofShape as RoofShape)
      ? (args.roofShape as RoofShape)
      : ROOF_SHAPES.includes(session.facts.roofShape as RoofShape)
        ? (session.facts.roofShape as RoofShape)
        : 'unknown';
    const incomingComponents = parseComponents(args.components);
    const components = incomingComponents.length
      ? requestedScope === session.facts.estimateScope
        ? mergeComponents(session.facts.components, incomingComponents)
        : incomingComponents
      : session.facts.components;

    if (requestedScope === 'specified_components' && components.length === 0) {
      return {
        error: 'MISSING_COMPONENTS',
        instruction: 'Ask which extra components they want and any rough lengths they know. Use ask_clarification with kind components. If they do not know, offer covering only or estimated components instead.',
      };
    }

    if (requestedScope === 'specified_components') {
      const missingQuantities = components.filter((selection) => {
        const item = getItemById(selection.catalogItemId);
        return !!item && (item.unit === 'lm' || item.unit === 'count') && !(selection.quantity && selection.quantity > 0);
      });
      if (missingQuantities.length) {
        return {
          error: 'MISSING_COMPONENT_QUANTITY',
          items: missingQuantities.map((selection) => getItemById(selection.catalogItemId)?.name ?? selection.catalogItemId),
          instruction: 'Ask for an approximate length or count for the selected components. If the customer does not know, offer to leave those components out or switch to estimated components where a safe geometry heuristic exists.',
        };
      }
    }

    if (requestedScope === 'estimated_components') {
      const supportedHeuristics = new Set(['ridge_hip_system', 'valley_trough', 'gutter_replacement', 'downpipe', 'insulation_upgrade']);
      const unsupported = components.filter((selection) => {
        const item = getItemById(selection.catalogItemId);
        return !!item && !selection.quantity && !supportedHeuristics.has(item.id);
      });
      if (unsupported.length) {
        return {
          error: 'CANNOT_SAFELY_ESTIMATE_COMPONENT',
          items: unsupported.map((selection) => getItemById(selection.catalogItemId)?.name ?? selection.catalogItemId),
          instruction: 'Do not guess these component quantities. Ask the customer for an approximate length/count or offer to omit them from the indicative estimate.',
        };
      }
    }

    if (requestedScope === 'estimated_components' && roofShape === 'unknown' && session.estimateFlow.clarificationCount < getAssistantConfig().maxClarificationQuestions) {
      return { error: 'MISSING_ROOF_SHAPE', instruction: 'Ask for roof shape using ask_clarification with kind roof_shape.' };
    }

    const extras = Array.isArray(args.extras)
      ? args.extras.filter((e): e is string => typeof e === 'string' && !!findItem(e))
      : [];

    const estimate = createEstimate({
      roofArea,
      areaType,
      roofShape,
      pitchDegrees: num(args.pitchDegrees) ?? session.facts.pitchDegrees,
      material,
      componentScope: requestedScope,
      components,
      extras,
    });

    const f = session.facts;
    f.roofArea = roofArea;
    f.areaType = areaType;
    f.roofShape = roofShape;
    const pd = num(args.pitchDegrees);
    if (pd != null) f.pitchDegrees = pd;
    f.material = material;
    f.estimateScope = requestedScope;
    f.components = estimate.lineItems
      .filter((line) => line.catalogItemId !== estimate.project.material)
      .map((line) => ({
        catalogItemId: line.catalogItemId,
        quantity: line.quantitySource === 'user' ? line.quantity : null,
      }));
    if (extras.length) f.extras = [...new Set([...f.extras, ...extras])];

    session.estimateFlow = { active: false, clarificationCount: session.estimateFlow.clarificationCount, latestEstimateId: estimate.id };
    session.estimates[estimate.id] = estimate;
    turn.cards.push({ type: 'estimate', estimate });
    turn.latestEstimateId = estimate.id;
    turn.factsUpdated = true;
    return {
      estimate,
      message: 'Summarise the indicative total and scope in one or two short sentences. The UI shows the full breakdown.',
    };
  },

  ask_clarification(args, session, turn) {
    const config = getAssistantConfig();
    const question = str(args.question);
    const kind = str(args.kind);
    if (!question) return { error: 'Missing question.' };
    const flow = session.estimateFlow;
    if (!flow.active) {
      flow.active = true;
      flow.clarificationCount = 0;
    }
    if (flow.clarificationCount >= config.maxClarificationQuestions) {
      return {
        status: 'limit_reached',
        instruction: `Clarification limit reached. Do not add unrequested components. If material or scope is still unknown, give a helpful explanation and offer an enquiry instead of fabricating an estimate.`,
      };
    }
    flow.clarificationCount += 1;
    addClarificationActions(kind, turn);
    return { status: 'ok', askedSoFar: flow.clarificationCount, max: config.maxClarificationQuestions, question, kind };
  },

  navigate(args, _session, turn) {
    const topicId = str(args.topicId) ?? '';
    const entry = resolveSiteTopic(topicId);
    if (!entry) return { error: `Unknown topicId "${topicId}". Use only approved ids.` };
    turn.actions.push({ type: 'NAVIGATE_INTERNAL', label: entry.external ? `Open ${entry.title}` : `View ${entry.title}`, url: entry.path, external: entry.external === true });
    return { ok: true, title: entry.title, path: entry.path };
  },

  open_inquiry(_args, _session, turn) {
    turn.actions.push({ type: 'OPEN_INQUIRY', label: 'Prepare an enquiry' });
    turn.cards.push({ type: 'handoff', summary: 'I can carry the project details from this conversation into the enquiry for you.' });
    return { ok: true };
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
    if (ESTIMATE_SCOPES.includes(args.estimateScope as EstimateScope)) { f.estimateScope = args.estimateScope as EstimateScope; changed = true; }
    const components = parseComponents(args.components);
    if (components.length) { f.components = components; changed = true; }
    if (Array.isArray(args.extras)) {
      const ex = args.extras.filter((e): e is string => typeof e === 'string');
      if (ex.length) { f.extras = [...new Set([...f.extras, ...ex])]; changed = true; }
    }
    if (changed) turn.factsUpdated = true;
    return { ok: true, facts: f };
  },
};

export type TurnErrorKind = 'timeout' | 'upstream' | 'unknown';
export class TurnError extends Error {
  constructor(public readonly kind: TurnErrorKind) {
    super(`assistant turn failed: ${kind}`);
  }
}

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
interface StreamOutcome { content: string; toolCalls: { id: string; name: string; arguments: string }[]; }

async function streamCompletion(apiKey: string, messages: ChatMessage[], onToken: (t: string) => void, timeoutMs: number): Promise<StreamOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: getAssistantConfig().model, messages, tools: toolDefinitions(), stream: true }),
      signal: controller.signal,
    });
    if (!res.ok || !res.body) throw new TurnError('upstream');

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
        let delta: { content?: string | null; tool_calls?: { index: number; id?: string; function?: { name?: string; arguments?: string } }[] };
        try { delta = JSON.parse(payload).choices?.[0]?.delta ?? {}; } catch { continue; }
        if (typeof delta.content === 'string' && delta.content) { content += delta.content; onToken(delta.content); }
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
    if (err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError')) throw new TurnError('timeout');
    throw new TurnError('unknown');
  } finally {
    clearTimeout(timer);
  }
}

export async function runAssistantTurn(session: AssistantSession, userMessage: string, onToken: (t: string) => void): Promise<AssistantTurn> {
  const apiKey = process.env.OPENAI_API_KEY;
  const config = getAssistantConfig();
  const messages: ChatMessage[] = [
    { role: 'system', content: buildSystemPrompt(session) },
    ...recentMessages(session).map((m) => ({ role: m.role, content: m.content }) as ChatMessage),
    { role: 'user', content: userMessage },
  ];
  const turnState: TurnState = { cards: [], actions: [], factsUpdated: false, latestEstimateId: null };
  let finalContent = '';
  const started = Date.now();

  if (!apiKey) return { message: 'Sorry - the assistant is temporarily unavailable. The demo API key is not configured.' };

  for (let hop = 0; hop < 5; hop++) {
    if (Date.now() - started > config.turnTimeoutMs * 2) throw new TurnError('timeout');
    const outcome = await streamCompletion(apiKey, messages, onToken, config.turnTimeoutMs);
    finalContent = outcome.content || finalContent;
    const validCalls = outcome.toolCalls.filter((tc) => tc.name && handlers[tc.name]);
    if (!validCalls.length) break;

    messages.push({
      role: 'assistant',
      content: outcome.content || null,
      tool_calls: validCalls.map((tc) => ({ id: tc.id, type: 'function', function: { name: tc.name, arguments: tc.arguments || '{}' } })),
    });
    for (const tc of validCalls) {
      let args: Record<string, unknown> = {};
      try { args = tc.arguments ? JSON.parse(tc.arguments) : {}; } catch { args = {}; }
      let result: unknown;
      try { result = handlers[tc.name](args, session, turnState); } catch { result = { error: 'Tool execution failed.' }; }
      messages.push({ role: 'tool', tool_call_id: tc.id, name: tc.name, content: JSON.stringify(result) });
    }
  }

  if (turnState.latestEstimateId) {
    const estimate = session.estimates[turnState.latestEstimateId];
    turnState.actions.push({ type: 'DOWNLOAD_OUTPUT', label: 'Download estimate PDF', estimateId: turnState.latestEstimateId });
    turnState.actions.push({ type: 'OPEN_INQUIRY', label: 'Request a formal quote' });
    if (estimate && !estimate.lineItems.some((li) => li.catalogItemId === 'gutter_replacement')) {
      turnState.actions.push({
        type: 'ADD_ESTIMATE_OPTION',
        label: 'Add estimated gutters',
        followUpMessage: 'Please add gutter replacement to this estimate using the approved roof-shape allowance. Do not add downpipes unless I ask for them.',
      });
    }
    if (estimate?.project.componentScope === 'covering_only') {
      turnState.actions.push({
        type: 'ADD_ESTIMATE_OPTION',
        label: 'Add roof components',
        followUpMessage: 'I want to add roof components to this estimate. Ask me whether I want to provide lengths or have you estimate ridge, hip and valley allowances.',
      });
    }
  }

  const turn: AssistantTurn = { message: finalContent.trim() || 'Here you go.' };
  if (turnState.cards.length) turn.cards = turnState.cards;
  if (turnState.actions.length) turn.actions = dedupeActions(turnState.actions);
  if (turnState.factsUpdated) turn.sessionFactsUpdated = true;
  return turn;
}

function dedupeActions(actions: AssistantAction[]): AssistantAction[] {
  const seen = new Set<string>();
  const out: AssistantAction[] = [];
  for (const action of actions) {
    const key = `${action.type}:${'url' in action ? action.url : ''}:${action.label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(action);
  }
  return out;
}
