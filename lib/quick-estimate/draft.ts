import { EXTENSION_BANDS, PITCH_BANDS, SIZE_BANDS } from './config';
import { ROOF_TEMPLATES } from './templates';
import type { QuickEstimateInput } from './types';

export interface QuickDraft { step: number; answers: Partial<QuickEstimateInput>; demo: boolean; example?: boolean }
export const INITIAL_DRAFT: QuickDraft = { step: 0, answers: { project: 'reroof', storeys: 1, flatExtension: null, flatCovering: null }, demo: false };
/** Storage is untrusted. Invalid or old drafts reset instead of crashing render. */
export function readQuickDraft(raw: string | null): QuickDraft {
  try {
    if (!raw) return INITIAL_DRAFT;
    const d = JSON.parse(raw) as QuickDraft;
    if (!d || !Number.isInteger(d.step) || d.step < 0 || d.step > 5 || !d.answers || typeof d.answers !== 'object' || Array.isArray(d.answers)) return INITIAL_DRAFT;
    const a = d.answers;
    const optional = (v: unknown, values: readonly unknown[]) => v === undefined || values.includes(v);
    if (!optional(a.shape, Object.keys(ROOF_TEMPLATES)) || !optional(a.size, Object.keys(SIZE_BANDS)) || !optional(a.pitch, [null, ...Object.keys(PITCH_BANDS)]) || !optional(a.storeys, [1, 2]) || !optional(a.flatExtension, [null, ...Object.keys(EXTENSION_BANDS)]) || !optional(a.project, ['new_roof', 'reroof']) || !optional(a.existingMaterial, [null, 'tile', 'slate', 'metal', 'membrane', 'unknown']) || !optional(a.covering, ['tile', 'slate', 'metal', 'shingle', 'pressed_metal', 'longrun', 'epdm', 'grp', 'felt', 'everest_tray']) || !optional(a.flatCovering, [null, 'epdm', 'grp', 'felt']) || !optional(a.flatComplexity, ['simple', 'typical', 'complex'])) return INITIAL_DRAFT;
    // Exact area/pitch are optional refinements typed by the visitor mid-keystroke
    // (e.g. the "1" of "160" fails the 20 m2 floor). An invalid in-progress value
    // is dropped from the draft, never a reason to reset the whole flow.
    const exactAreaOk = typeof a.exactRoofAreaM2 === 'number' && Number.isFinite(a.exactRoofAreaM2) && a.exactRoofAreaM2 >= 20 && a.exactRoofAreaM2 <= 1200;
    const exactPitchOk = typeof a.exactPitchDegrees === 'number' && Number.isFinite(a.exactPitchDegrees) && a.exactPitchDegrees >= 0 && a.exactPitchDegrees <= 50;
    const { exactRoofAreaM2: _ea, exactPitchDegrees: _ep, ...rest } = a;
    return { step: d.step, answers: { ...INITIAL_DRAFT.answers, ...rest, ...(exactAreaOk ? { exactRoofAreaM2: a.exactRoofAreaM2 } : {}), ...(exactPitchOk ? { exactPitchDegrees: a.exactPitchDegrees } : {}) }, demo: d.demo === true, ...(d.example === true ? { example: true } : {}) };
  } catch { return INITIAL_DRAFT; }
}
