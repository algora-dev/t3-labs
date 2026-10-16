export const ASSISTANT_SESSION_HEADER = 'x-apex-assistant-session';

const CLIENT_KEY_PATTERN = /^tab_[A-Za-z0-9-]{20,80}$/;

/**
 * Accept only the opaque per-tab identifier created by the Apex demo client.
 * Invalid values are ignored rather than used as storage keys.
 */
export function normaliseAssistantClientSessionKey(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return CLIENT_KEY_PATTERN.test(trimmed) ? trimmed : null;
}

export function assistantScopedSessionId(clientSessionKey: string): string | null {
  const key = normaliseAssistantClientSessionKey(clientSessionKey);
  return key ? `tab_${key.slice(4)}` : null;
}

export function assistantClientSessionKeyFromRequest(req: Request): string | null {
  return normaliseAssistantClientSessionKey(req.headers.get(ASSISTANT_SESSION_HEADER));
}
