import { EXTENSION_BANDS, PITCH_BANDS, SIZE_BANDS } from './config';
import { ROOF_TEMPLATES } from './templates';
import type { QuickEstimateInput } from './types';

export interface QuickDraft { step: number; answers: Partial<QuickEstimateInput>; demo: boolean }
export const INITIAL_DRAFT: QuickDraft = { step: 0, answers: { project: 'reroof', storeys: 1, flatExtension: null, flatCovering: null }, demo: false };
/** Storage is untrusted. Invalid or old drafts reset instead of crashing render. */
export function readQuickDraft(raw: string | null): QuickDraft {
  try {
    if (!raw) return INITIAL_DRAFT;
    const d = JSON.parse(raw) as QuickDraft;
    if (!d || !Number.isInteger(d.step) || d.step < 0 || d.step > 5 || !d.answers || typeof d.answers !== 'object' || Array.isArray(d.answers)) return INITIAL_DRAFT;
    const a = d.answers;
    const optional = (v: unknown, values: readonly unknown[]) => v === undefined || values.includes(v);
    if (!optional(a.shape, Object.keys(ROOF_TEMPLATES)) || !optional(a.size, Object.keys(SIZE_BANDS)) || !optional(a.pitch, [null, ...Object.keys(PITCH_BANDS)]) || !optional(a.storeys, [1, 2]) || !optional(a.flatExtension, [null, ...Object.keys(EXTENSION_BANDS)]) || !optional(a.project, ['new_roof', 'reroof']) || !optional(a.existingMaterial, [null, 'tile', 'slate', 'metal', 'membrane', 'unknown']) || !optional(a.covering, ['tile', 'slate', 'metal', 'shingle', 'pressed_metal', 'longrun', 'epdm', 'grp', 'felt']) || !optional(a.flatCovering, [null, 'epdm', 'grp', 'felt']) || !optional(a.flatComplexity, ['simple', 'typical', 'complex'])) return INITIAL_DRAFT;
    return { step: d.step, answers: { ...INITIAL_DRAFT.answers, ...a }, demo: d.demo === true };
  } catch { return INITIAL_DRAFT; }
}
