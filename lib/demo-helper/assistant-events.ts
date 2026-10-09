import type { AssistantTurn } from '../assistant/types';
import type { HelperSignal } from './config';
/** Only structured, usable results count. Never infer success from the assistant's prose. */
export function signalsForAssistantTurn(turn: AssistantTurn): HelperSignal[] {
  const out: HelperSignal[] = [];
  const valid = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0;
  const hasEstimate = turn.cards?.some(card => {
    if (card.type === 'estimate') return valid(card.estimate?.total) && Array.isArray(card.estimate.lineItems) && card.estimate.lineItems.length > 0;
    if (card.type === 'estimate_result') {
      const r = card.result;
      return r.mode === 'range' ? valid(r.low?.total) && valid(r.high?.total) : valid(r.estimate?.total);
    }
    return false;
  });
  if (hasEstimate) out.push('assistant-estimate');
  if (turn.message?.trim() && turn.actions?.some(action => action.type === 'NAVIGATE_INTERNAL' && !action.external && isApexPage(action.url))) out.push('knowledge-answer');
  return out;
}
export function isApexPage(url: string): boolean {
  return url === '/demo/roofing-site' || url.startsWith('/demo/roofing-site/') || url.startsWith('/demo/roofing-site#');
}
