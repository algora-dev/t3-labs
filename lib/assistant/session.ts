import { cookies } from 'next/headers';
import { getAssistantConfig } from './data';

/**
 * In-memory per-session store (demo-grade, spec section 9).
 * Module-level Map keyed by opaque random session id from an httpOnly cookie.
 * Two simultaneous visitors never share state.
 */

export const SESSION_COOKIE = 'apex_sid';

export interface SessionFacts {
  projectType: string | null;
  roofArea: number | null;
  areaType: string | null;
  roofShape: string | null;
  pitchDegrees: number | null;
  material: string | null;
  location: string | null;
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

export interface StoredEstimateRef {
  id: string;
  createdAt: string;
}

export interface AssistantSession {
  sessionId: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: number; // epoch ms
  messages: { role: 'user' | 'assistant'; content: string }[];
  facts: SessionFacts;
  estimateFlow: EstimateFlow;
  lead: SessionLead;
  outputs: StoredEstimateRef[];
  inquiries: string[];
  turnCount: number;
  messageTimestamps: number[];
}

const sessions = new Map<string, AssistantSession>();

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
      extras: [],
    },
    estimateFlow: { active: false, clarificationCount: 0, latestEstimateId: null },
    lead: { name: null, email: null, phone: null },
    outputs: [],
    inquiries: [],
    turnCount: 0,
    messageTimestamps: [],
  };
}

/** Periodically purge expired sessions (cheap lazy sweep on each access). */
function sweep() {
  if (sessions.size < 200) return;
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (s.expiresAt < now) sessions.delete(id);
  }
}

export function getSession(sessionId: string): AssistantSession | null {
  sweep();
  const s = sessions.get(sessionId);
  if (!s) return null;
  if (s.expiresAt < Date.now()) {
    sessions.delete(sessionId);
    return null;
  }
  return s;
}

export function touchSession(session: AssistantSession): void {
  const now = Date.now();
  session.lastActiveAt = new Date(now).toISOString();
  session.expiresAt = now + getAssistantConfig().sessionTtlMinutes * 60_000;
}

/** Get-or-create the session for the current request, using the httpOnly cookie. */
export async function getOrCreateSession(): Promise<AssistantSession> {
  const config = getAssistantConfig();
  const cookieStore = await cookies();
  let sid = cookieStore.get(SESSION_COOKIE)?.value;
  let session = sid ? getSession(sid) : null;

  if (!session) {
    sid = `s_${crypto.randomUUID()}`;
    session = newSession(sid);
    sessions.set(sid, session);
  }
  touchSession(session);

  cookieStore.set(SESSION_COOKIE, session.sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: config.sessionTtlMinutes * 60,
  });
  return session;
}

/* ---------- guardrails (spec 15.5) ---------- */

export type GuardResult = { ok: true } | { ok: false; error: string; status: number };

export function checkGuards(session: AssistantSession, message: string): GuardResult {
  const config = getAssistantConfig();

  if (!message.trim()) {
    return { ok: false, error: 'Please type a message.', status: 400 };
  }
  if (message.length > config.maxUserMessageChars) {
    return {
      ok: false,
      error: `That message is too long - please keep it under ${config.maxUserMessageChars} characters.`,
      status: 400,
    };
  }
  if (session.turnCount >= config.maxTurnsPerSession) {
    return {
      ok: false,
      error: 'This demo session has reached its conversation limit. Please start a fresh session.',
      status: 429,
    };
  }

  // Rate limiting (in-memory, per session)
  const now = Date.now();
  session.messageTimestamps = session.messageTimestamps.filter(
    (t) => now - t < 60 * 60_000
  );
  const lastMinute = session.messageTimestamps.filter((t) => now - t < 60_000).length;
  if (lastMinute >= config.rateLimit.maxMessagesPerMinute) {
    return {
      ok: false,
      error: "You're sending messages a bit quickly - please wait a moment and try again.",
      status: 429,
    };
  }
  if (session.messageTimestamps.length >= config.rateLimit.maxMessagesPerHour) {
    return {
      ok: false,
      error: 'This demo session has hit its hourly message limit. Please try again later.',
      status: 429,
    };
  }
  session.messageTimestamps.push(now);
  return { ok: true };
}

/** Keep only recent messages in the model context to bound cost. */
export function recentMessages(session: AssistantSession, max = 24) {
  return session.messages.slice(-max);
}
