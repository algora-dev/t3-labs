import { AsyncLocalStorage } from 'node:async_hooks';

/**
 * Per-request business context for the Smart Assistant data layer.
 *
 * The Apex demo serves /api/chat, /api/session, /api/outputs, /api/inquiry with
 * data from data/<BUSINESS_SLUG>/ (process-wide default from env). To serve a
 * second business (Roofline Canterbury) from the same deployment, the roofline
 * API wrappers (app/api/roofline/*) run the shared handlers inside
 * withBusinessContext('roofline-roofing', ...) so every loader underneath
 * resolves that slug instead of the ambient default. No loader signatures
 * change; anything running outside a context keeps the historical env default.
 */

const storage = new AsyncLocalStorage<string>();

export const DEFAULT_BUSINESS_SLUG = process.env.T3_ASSISTANT_BUSINESS_SLUG || 'apex-roofing';

export function withBusinessContext<T>(slug: string, fn: () => Promise<T>): Promise<T> {
  return storage.run(slug, fn);
}

export function currentBusinessSlug(): string {
  return storage.getStore() ?? DEFAULT_BUSINESS_SLUG;
}
