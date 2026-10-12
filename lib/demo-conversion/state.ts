/** Session-only presentation state, deliberately separate from tool data/progress. */
export type ClosingReason = 'complete' | 'tour-ended' | 'exit';
export interface ConversionState {
  version: 1; ready: boolean; introSeen: boolean; closerSeen: boolean;
  modal: 'intro' | 'closing' | null; pending: ClosingReason | null; reason: ClosingReason | null;
}
export const initialConversion = (): ConversionState => ({ version: 1, ready: false, introSeen: false, closerSeen: false, modal: null, pending: null, reason: null });
export function readConversion(raw: string | null): ConversionState {
  const initial = initialConversion();
  if (!raw || raw.length > 400) return initial;
  try {
    const v = JSON.parse(raw);
    if (!v || v.version !== 1 || typeof v.introSeen !== 'boolean' || typeof v.closerSeen !== 'boolean') return initial;
    // Transient open/queued state is never resurrected on a full page load.
    return { ...initial, introSeen: v.introSeen, closerSeen: v.closerSeen };
  } catch { return initial; }
}
export function savedConversion(s: ConversionState): string {
  return JSON.stringify({ version: 1, introSeen: s.introSeen, closerSeen: s.closerSeen });
}
export type ConversionAction =
  | { type: 'initialise'; resume: boolean }
  | { type: 'dismiss-intro' }
  | { type: 'queue'; reason: ClosingReason }
  | { type: 'show-closing'; reason: ClosingReason }
  | { type: 'dismiss-closing' }
  | { type: 'contact' };
export function reduceConversion(s: ConversionState, a: ConversionAction): ConversionState {
  switch (a.type) {
    case 'initialise': return s.ready ? s : { ...s, ready: true, introSeen: true, modal: !s.introSeen && !a.resume ? 'intro' : null };
    case 'dismiss-intro': return s.modal === 'intro' ? { ...s, modal: null } : s;
    case 'queue': return s.closerSeen || s.pending ? s : { ...s, pending: a.reason };
    case 'show-closing': return !s.ready || s.modal || s.closerSeen ? s : { ...s, closerSeen: true, modal: 'closing', reason: s.pending ?? a.reason, pending: null };
    case 'dismiss-closing': return s.modal === 'closing' ? { ...s, modal: null } : s;
    // A booking-link click is an intention, not a confirmed booking.
    case 'contact': return { ...s, closerSeen: true, modal: null, pending: null };
  }
}
export interface ExitContext {
  finePointer: boolean; enteredPage: boolean; elapsed: number; sinceIntro: number;
  visible: boolean; editing: boolean; dragging: boolean; busySurface: boolean; otherModal: boolean;
}
export function canOfferExit(s: ConversionState, c: ExitContext, minVisit = 8000, afterIntro = 1800): boolean {
  return s.ready && s.introSeen && !s.closerSeen && !s.modal && !s.pending
    && c.finePointer && c.enteredPage && c.elapsed >= minVisit && c.sinceIntro >= afterIntro
    && c.visible && !c.editing && !c.dragging && !c.busySurface && !c.otherModal;
}
