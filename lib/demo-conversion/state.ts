/** Session-only presentation state, deliberately separate from tool data/progress. */
export type ClosingReason = 'complete' | 'tour-ended' | 'explored';
export type MeaningfulInteraction = 'assistant-answer' | 'assistant-price' | 'quick-price' | 'dashboard' | 'detailed' | 'plan';
export type ConversionModal = 'intro' | 'tour-reminder' | 'closing' | null;

const INTERACTIONS: readonly MeaningfulInteraction[] = ['assistant-answer', 'assistant-price', 'quick-price', 'dashboard', 'detailed', 'plan'];
export function isMeaningfulInteraction(value: unknown): value is MeaningfulInteraction {
  return INTERACTIONS.includes(value as MeaningfulInteraction);
}

export interface ConversionState {
  version: 2;
  ready: boolean;
  introSeen: boolean;
  closerSeen: boolean;
  tourReminderSeen: boolean;
  tourEngaged: boolean;
  modal: ConversionModal;
  pending: ClosingReason | null;
  reason: ClosingReason | null;
  startedAt: number | null;
  exploredAt: number | null;
  reminderShownAt: number | null;
  lastInteractionAt: number | null;
  interactions: MeaningfulInteraction[];
}

export const initialConversion = (): ConversionState => ({
  version: 2,
  ready: false,
  introSeen: false,
  closerSeen: false,
  tourReminderSeen: false,
  tourEngaged: false,
  modal: null,
  pending: null,
  reason: null,
  startedAt: null,
  exploredAt: null,
  reminderShownAt: null,
  lastInteractionAt: null,
  interactions: [],
});

const validTime = (value: unknown): number | null => typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null;

/** Restore only durable, non-sensitive presentation flags. Open overlays never resurrect. */
export function readConversion(raw: string | null): ConversionState {
  const initial = initialConversion();
  if (!raw || raw.length > 1400) return initial;
  try {
    const v = JSON.parse(raw);
    // Migrate the previous presentation-only state without bringing back transient overlays.
    if (v?.version === 1 && typeof v.introSeen === 'boolean' && typeof v.closerSeen === 'boolean') {
      return { ...initial, introSeen: v.introSeen, closerSeen: v.closerSeen, exploredAt: validTime(v.exploredAt) };
    }
    if (!v || v.version !== 2 || typeof v.introSeen !== 'boolean' || typeof v.closerSeen !== 'boolean'
      || typeof v.tourReminderSeen !== 'boolean' || typeof v.tourEngaged !== 'boolean'
      || !Array.isArray(v.interactions) || v.interactions.length > INTERACTIONS.length || !v.interactions.every(isMeaningfulInteraction)) return initial;
    return {
      ...initial,
      introSeen: v.introSeen,
      closerSeen: v.closerSeen,
      tourReminderSeen: v.tourReminderSeen,
      tourEngaged: v.tourEngaged,
      startedAt: validTime(v.startedAt),
      exploredAt: validTime(v.exploredAt),
      reminderShownAt: validTime(v.reminderShownAt),
      lastInteractionAt: validTime(v.lastInteractionAt),
      interactions: [...new Set(v.interactions as MeaningfulInteraction[])],
    };
  } catch { return initial; }
}

export function savedConversion(s: ConversionState): string {
  return JSON.stringify({
    version: 2,
    introSeen: s.introSeen,
    closerSeen: s.closerSeen,
    tourReminderSeen: s.tourReminderSeen,
    tourEngaged: s.tourEngaged,
    interactions: s.interactions,
    ...(s.startedAt != null ? { startedAt: s.startedAt } : {}),
    ...(s.exploredAt != null ? { exploredAt: s.exploredAt } : {}),
    ...(s.reminderShownAt != null ? { reminderShownAt: s.reminderShownAt } : {}),
    ...(s.lastInteractionAt != null ? { lastInteractionAt: s.lastInteractionAt } : {}),
  });
}

export type ConversionAction =
  | { type: 'initialise'; resume: boolean; at?: number }
  | { type: 'dismiss-intro' }
  | { type: 'explore'; at: number }
  | { type: 'tour-engaged' }
  | { type: 'show-tour-reminder'; at: number }
  | { type: 'dismiss-tour-reminder' }
  | { type: 'interact'; key: MeaningfulInteraction; at?: number }
  | { type: 'queue'; reason: ClosingReason }
  | { type: 'show-closing'; reason: ClosingReason }
  | { type: 'dismiss-closing' }
  | { type: 'contact' };

export function reduceConversion(s: ConversionState, a: ConversionAction): ConversionState {
  switch (a.type) {
    case 'initialise': {
      if (s.ready) return s;
      const at = validTime(a.at) ?? s.startedAt;
      return { ...s, ready: true, introSeen: true, startedAt: s.startedAt ?? at, modal: !s.introSeen && !a.resume ? 'intro' : null };
    }
    case 'dismiss-intro': return s.modal === 'intro' ? { ...s, modal: null } : s;
    case 'explore': {
      const at = validTime(a.at);
      return !at || s.exploredAt != null || s.closerSeen ? s : { ...s, exploredAt: at };
    }
    // Manually opening or starting the guide means a timed reminder is no longer useful.
    case 'tour-engaged': return s.tourEngaged && s.tourReminderSeen ? s : { ...s, tourEngaged: true, tourReminderSeen: true, modal: s.modal === 'tour-reminder' ? null : s.modal };
    case 'show-tour-reminder': {
      const at = validTime(a.at);
      if (!at || !s.ready || s.modal || s.closerSeen || s.tourReminderSeen || s.tourEngaged) return s;
      return { ...s, modal: 'tour-reminder', tourReminderSeen: true, reminderShownAt: at };
    }
    case 'dismiss-tour-reminder': return s.modal === 'tour-reminder' ? { ...s, modal: null } : s;
    case 'interact': {
      if (!isMeaningfulInteraction(a.key)) return s;
      const at = validTime(a.at);
      const has = s.interactions.includes(a.key);
      const nextAt = at ?? s.lastInteractionAt;
      if (has && nextAt === s.lastInteractionAt) return s;
      return { ...s, interactions: has ? s.interactions : [...s.interactions, a.key], lastInteractionAt: nextAt };
    }
    case 'queue': return s.closerSeen || s.pending ? s : { ...s, pending: a.reason };
    case 'show-closing': return !s.ready || s.modal || s.closerSeen ? s : { ...s, closerSeen: true, modal: 'closing', reason: s.pending ?? a.reason, pending: null };
    case 'dismiss-closing': return s.modal === 'closing' ? { ...s, modal: null } : s;
    // A booking-link click is an intention, not a confirmed booking.
    case 'contact': return { ...s, closerSeen: true, modal: null, pending: null };
  }
}
