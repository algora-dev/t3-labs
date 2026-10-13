/** Session-only presentation state, deliberately separate from tool data/progress. */
export type ClosingReason = 'complete' | 'tour-ended' | 'explored';
export interface ConversionState {
  version: 1; ready: boolean; introSeen: boolean; closerSeen: boolean;
  modal: 'intro' | 'closing' | null; pending: ClosingReason | null; reason: ClosingReason | null;
  exploredAt: number | null;
}
export const initialConversion = (): ConversionState => ({ version: 1, ready: false, introSeen: false, closerSeen: false, modal: null, pending: null, reason: null, exploredAt: null });
export function readConversion(raw: string | null): ConversionState {
  const initial = initialConversion();
  if (!raw || raw.length > 400) return initial;
  try {
    const v = JSON.parse(raw);
    if (!v || v.version !== 1 || typeof v.introSeen !== 'boolean' || typeof v.closerSeen !== 'boolean') return initial;
    // Transient open/queued state is never resurrected on a full page load.
    // The self-guided dwell origin survives a reload so its timer keeps counting.
    const exploredAt = typeof v.exploredAt === 'number' && Number.isFinite(v.exploredAt) && v.exploredAt > 0 ? v.exploredAt : null;
    return { ...initial, introSeen: v.introSeen, closerSeen: v.closerSeen, exploredAt };
  } catch { return initial; }
}
export function savedConversion(s: ConversionState): string {
  return JSON.stringify({ version: 1, introSeen: s.introSeen, closerSeen: s.closerSeen, ...(s.exploredAt != null ? { exploredAt: s.exploredAt } : {}) });
}
export type ConversionAction =
  | { type: 'initialise'; resume: boolean }
  | { type: 'dismiss-intro' }
  | { type: 'explore'; at: number }
  | { type: 'queue'; reason: ClosingReason }
  | { type: 'show-closing'; reason: ClosingReason }
  | { type: 'dismiss-closing' }
  | { type: 'contact' };
export function reduceConversion(s: ConversionState, a: ConversionAction): ConversionState {
  switch (a.type) {
    case 'initialise': return s.ready ? s : { ...s, ready: true, introSeen: true, modal: !s.introSeen && !a.resume ? 'intro' : null };
    case 'dismiss-intro': return s.modal === 'intro' ? { ...s, modal: null } : s;
    // Exploring without the guide starts the one self-guided dwell invitation.
    case 'explore': return s.exploredAt != null || s.closerSeen || !Number.isFinite(a.at) || a.at <= 0 ? s : { ...s, exploredAt: a.at };
    case 'queue': return s.closerSeen || s.pending ? s : { ...s, pending: a.reason };
    case 'show-closing': return !s.ready || s.modal || s.closerSeen ? s : { ...s, closerSeen: true, modal: 'closing', reason: s.pending ?? a.reason, pending: null };
    case 'dismiss-closing': return s.modal === 'closing' ? { ...s, modal: null } : s;
    // A booking-link click is an intention, not a confirmed booking.
    case 'contact': return { ...s, closerSeen: true, modal: null, pending: null };
  }
}
// There is no pointer-exit intent: the invitation comes from finishing the tour
// or from the four-minute self-guided dwell, and never from mouse tracking.
