import { cookies } from 'next/headers';
import { getAssistantConfig } from './data';
import type { Estimate, EstimateComponentSelection, EstimateDraft, EstimateScope } from '../pricing/estimate-engine';

/**
 * Per-session assistant state.
 *
 * Development defaults to a process-local Map. Hosted deployments can use any
 * Upstash/Vercel Redis REST endpoint by setting KV_REST_API_URL +
 * KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).
 * This prevents serverless requests from losing estimates, outputs or enquiry
 * context when consecutive requests land on different instances.
 */

export const SESSION_COOKIE = 't3_sa_sid';
const REDIS_PREFIX = 't3:smart-assistant:session:';

export interface SessionFacts {
  projectType: string | null;
  roofArea: number | null;
  areaType: string | null;
  roofShape: string | null;
  pitchDegrees: number | null;
  material: string | null;
  location: string | null;
  estimateScope: EstimateScope | null;
  components: EstimateComponentSelection[];
  extras: string[];
}

export interface EstimateFlow {
  active: boolean;
  clarificationCount: number;
  latestEstimateId: string | null;
}

export interface SessionLead {
  name: string | null;
  email: string | null;
  phone: string | null;
}

export type EstimateStore = Record<string, Estimate>;

export interface SessionOutputRef {
  id: string;
  estimateId: string;
  createdAt: string;
}

export interface InquiryRecord {
  id: string;
  createdAt: string;
  payload: Record<string, unknown>;
}

export interface AssistantSession {
  sessionId: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: number;
  messages: { role: 'user' | 'assistant'; content: string }[];
  facts: SessionFacts;
  estimateFlow: EstimateFlow;
  lead: SessionLead;
  estimates: EstimateStore;
  outputs: SessionOutputRef[];
  inquiries: InquiryRecord[];
  draft: EstimateDraft | null;
  currentPagePath: string | null;
  turnCount: number;
  messageTimestamps: number[];
}

const sessions = new Map<string, AssistantSession>();

function redisConfig() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

async function redisCommand(args: Array<string | number>): Promise<unknown> {
  const cfg = redisConfig();
  if (!cfg) throw new Error('Redis session store is not configured');
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Redis session store returned ${res.status}`);
  const payload = (await res.json()) as { result?: unknown; error?: string };
  if (payload.error) throw new Error(payload.error);
  return payload.result;
}

function newSession(sessionId: string): AssistantSession {
  const now = Date.now();
  const config = getAssistantConfig();
  return {
    sessionId,
    createdAt: new Date(now).toISOString(),
    lastActiveAt: new Date(now).toISOString(),
    expiresAt: now + config.sessionTtlMinutes * 60_000,
    messages: [],
    facts: {
      projectType: null,
      roofArea: null,
      areaType: null,
      roofShape: null,
      pitchDegrees: null,
      material: null,
      location: null,
      estimateScope: null,
      components: [],
      extras: [],
    },
    estimateFlow: { active: false, clarificationCount: 0, latestEstimateId: null },
    lead: { name: null, email: null, phone: null },
    estimates: {},
    outputs: [],
    inquiries: [],
    draft: null,
    currentPagePath: null,
    turnCount: 0,
    messageTimestamps: [],
  };
}

function normaliseSession(session: AssistantSession): AssistantSession {
  // Backward-compatible defaults for sessions created by an older build.
  session.facts.estimateScope ??= null;
  session.facts.components ??= [];
  session.facts.extras ??= [];
  session.estimates ??= {};
  session.outputs ??= [];
  session.inquiries ??= [];
  session.draft ??= null;
  session.currentPagePath ??= null;
  session.messageTimestamps ??= [];
  return session;
}

function sweepMemory() {
  if (sessions.size < 200) return;
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (s.expiresAt < now) sessions.delete(id);
  }
}

export async function getSession(sessionId: string): Promise<AssistantSession | null> {
  const cfg = redisConfig();
  if (cfg) {
    try {
      const raw = await redisCommand(['GET', `${REDIS_PREFIX}${sessionId}`]);
      if (typeof raw !== 'string' || !raw) return null;
      const session = normaliseSession(JSON.parse(raw) as AssistantSession);
      if (session.expiresAt < Date.now()) {
        await redisCommand(['DEL', `${REDIS_PREFIX}${sessionId}`]);
        return null;
      }
      return session;
    } catch (error) {
      console.error('[assistant] Redis session read failed, falling back to local memory:', error instanceof Error ? error.message : error);
    }
  }

  sweepMemory();
  const session = sessions.get(sessionId);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }
  return normaliseSession(session);
}

export async function saveSession(session: AssistantSession): Promise<void> {
  const ttlSeconds = Math.max(60, Math.ceil((session.expiresAt - Date.now()) / 1000));
  const cfg = redisConfig();
  if (cfg) {
    try {
      await redisCommand(['SET', `${REDIS_PREFIX}${session.sessionId}`, JSON.stringify(session), 'EX', ttlSeconds]);
      return;
    } catch (error) {
      console.error('[assistant] Redis session write failed, falling back to local memory:', error instanceof Error ? error.message : error);
    }
  }
  sessions.set(session.sessionId, session);
}

export function touchSession(session: AssistantSession): void {
  const now = Date.now();
  session.lastActiveAt = new Date(now).toISOString();
  session.expiresAt = now + getAssistantConfig().sessionTtlMinutes * 60_000;
}

export async function peekSession(): Promise<AssistantSession | null> {
  const cookieStore = await cookies();
  const sid = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sid) return null;
  return getSession(sid);
}

export async function getOrCreateSession(): Promise<AssistantSession> {
  const config = getAssistantConfig();
  const cookieStore = await cookies();
  let sid = cookieStore.get(SESSION_COOKIE)?.value;
  let session = sid ? await getSession(sid) : null;

  if (!session) {
    sid = `s_${crypto.randomUUID()}`;
    session = newSession(sid);
  }
  touchSession(session);
  await saveSession(session);

  cookieStore.set(SESSION_COOKIE, session.sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: config.sessionTtlMinutes * 60,
  });
  return session;
}

/**
 * Start New Conversation (V4 brief section 14): clears conversation history,
 * facts, estimates, outputs, enquiries, draft and page context, and issues a
 * brand-new session id so no hidden context survives the reset.
 */
export async function resetSession(): Promise<AssistantSession> {
  const config = getAssistantConfig();
  const old = await peekSession();
  if (old) {
    // Drop the previous server-side state entirely (best effort for Redis).
    try {
      const cfg = redisConfig();
      if (cfg) await redisCommand(['DEL', `${REDIS_PREFIX}${old.sessionId}`]);
      else sessions.delete(old.sessionId);
    } catch {
      // Expiry will clean up if the delete fails.
    }
  }
  const session = newSession(`s_${crypto.randomUUID()}`);
  touchSession(session);
  await saveSession(session);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: config.sessionTtlMinutes * 60,
  });
  return session;
}

export type GuardResult = { ok: true } | { ok: false; error: string; status: number };

export function checkGuards(session: AssistantSession, message: string): GuardResult {
  const config = getAssistantConfig();

  if (!message.trim()) return { ok: false, error: 'Please type a message.', status: 400 };
  if (message.length > config.maxUserMessageChars) {
    return { ok: false, error: `That message is too long - please keep it under ${config.maxUserMessageChars} characters.`, status: 400 };
  }
  if (session.turnCount >= config.maxTurnsPerSession) {
    return { ok: false, error: 'This demo session has reached its conversation limit. Please start a fresh session.', status: 429 };
  }

  const now = Date.now();
  session.messageTimestamps = session.messageTimestamps.filter((t) => now - t < 60 * 60_000);
  const lastMinute = session.messageTimestamps.filter((t) => now - t < 60_000).length;
  if (lastMinute >= config.rateLimit.maxMessagesPerMinute) {
    return { ok: false, error: "You're sending messages a bit quickly - please wait a moment and try again.", status: 429 };
  }
  if (session.messageTimestamps.length >= config.rateLimit.maxMessagesPerHour) {
    return { ok: false, error: 'This demo session has hit its hourly message limit. Please try again later.', status: 429 };
  }
  session.messageTimestamps.push(now);
  return { ok: true };
}

export function recentMessages(session: AssistantSession, max = 24) {
  return session.messages.slice(-max);
}
