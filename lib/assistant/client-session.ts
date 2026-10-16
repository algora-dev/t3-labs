'use client';

import { ASSISTANT_SESSION_HEADER, normaliseAssistantClientSessionKey } from './session-scope';

export const ASSISTANT_CLIENT_SESSION_STORAGE_KEY = 'apex.smart-assistant.tab-session.v1';
let memoryKey: string | null = null;

function createKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `tab_${crypto.randomUUID()}`;
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    return `tab_${Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('')}`;
  }
  return `tab_${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

/**
 * One opaque assistant identity per browser tab. sessionStorage keeps it across
 * same-tab navigation/reloads but a genuinely new tab receives a new identity.
 */
export function getAssistantClientSessionKey(): string {
  if (typeof window === 'undefined') return '';
  if (memoryKey) return memoryKey;
  try {
    const stored = normaliseAssistantClientSessionKey(window.sessionStorage.getItem(ASSISTANT_CLIENT_SESSION_STORAGE_KEY));
    if (stored) {
      memoryKey = stored;
      return stored;
    }
  } catch {
    // Restricted storage still gets an in-memory identity for this page lifecycle.
  }
  memoryKey = createKey();
  try { window.sessionStorage.setItem(ASSISTANT_CLIENT_SESSION_STORAGE_KEY, memoryKey); } catch { /* Optional storage. */ }
  return memoryKey;
}

/** Fetch an assistant/session API while binding the request to this tab. */
export function assistantSessionFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const key = getAssistantClientSessionKey();
  if (key) headers.set(ASSISTANT_SESSION_HEADER, key);
  return fetch(input, { ...init, headers });
}
