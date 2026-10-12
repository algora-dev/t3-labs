import { initialConversion, readConversion, reduceConversion, savedConversion } from './state';
import type { ConversionAction, ConversionState } from './state';
import { trackDemo } from './metrics';
export const CONVERSION_KEY = 'apex.demo.conversion.v1';
const CHANGE = 'apex-demo-conversion-change';
let live: ConversionState | null = null;
let cache: string | null = null;
export function getConversion(): ConversionState {
  if (typeof window === 'undefined') return initialConversion();
  if (!live) {
    try { live = readConversion(sessionStorage.getItem(CONVERSION_KEY)); } catch { live = initialConversion(); }
    cache = JSON.stringify(live);
  }
  return live;
}
export function conversionSnapshot(): string | null { getConversion(); return cache; }
export function subscribeConversion(fn: () => void) {
  window.addEventListener(CHANGE, fn);
  return () => window.removeEventListener(CHANGE, fn);
}
export function updateConversion(action: ConversionAction) {
  if (typeof window === 'undefined') return;
  const before = getConversion(), after = reduceConversion(before, action);
  if (after === before) return;
  live = after; cache = JSON.stringify(after);
  try { sessionStorage.setItem(CONVERSION_KEY, savedConversion(after)); } catch { /* Memory fallback in restricted previews. */ }
  window.dispatchEvent(new Event(CHANGE));
  if (after.modal === 'intro' && before.modal !== 'intro') trackDemo('intro_viewed');
  if (after.modal === 'closing' && before.modal !== 'closing') trackDemo('closing_viewed', { reason: after.reason ?? undefined });
}
