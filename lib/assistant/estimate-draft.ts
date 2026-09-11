import { getItemById } from '../pricing/catalog';
import {
  HEURISTIC_COMPONENT_IDS,
  type EstimateDraft,
  type EstimateDraftComponent,
  type PitchBandId,
  type PricedDraft,
  type ProjectType,
  type SizeBandId,
} from '../pricing/estimate-engine';
import { getV4Rules } from '../pricing/rules';

/**
 * Server-side validation of client-submitted guided-estimator drafts (V4 brief section 8).
 * Only validated structured drafts ever reach the deterministic pricing engine.
 * This module must stay free of next/* imports so node tests can load it directly.
 */

export type DraftValidation = { ok: true; draft: EstimateDraft } | { ok: false; error: string };

const PROJECT_TYPES: ProjectType[] = ['new_roof', 'reroof'];
const MODES: EstimateDraft['mode'][] = ['unit_rate', 'quick_ballpark', 'guided'];
const SIZE_BANDS = Object.keys(getV4Rules().sizeBands) as SizeBandId[];
const PITCH_BANDS = Object.keys(getV4Rules().pitchBands) as PitchBandId[];

function num(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function validateComponents(value: unknown): { ok: true; components: EstimateDraftComponent[] } | { ok: false; error: string } {
  if (value == null) return { ok: true, components: [] };
  if (!Array.isArray(value)) return { ok: false, error: 'Invalid components.' };
  const out: EstimateDraftComponent[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== 'object') return { ok: false, error: 'Invalid component entry.' };
    const obj = raw as Record<string, unknown>;
    const componentId = typeof obj.componentId === 'string' ? obj.componentId : '';
    const item = getItemById(componentId);
    if (!item || item.category !== 'component') return { ok: false, error: `Unknown component "${componentId}".` };
    const selected = obj.selected === true;
    const quantity = num(obj.quantity);
    const quantitySource = obj.quantitySource === 'heuristic' ? 'heuristic' : obj.quantitySource === 'user' ? 'user' : undefined;

    if (selected) {
      if (quantity != null && quantity > 0) {
        if (quantity > 100000) return { ok: false, error: `${item.name} quantity looks too large.` };
        if (quantitySource === 'heuristic') {
          return { ok: false, error: `${item.name}: a user-supplied quantity cannot be marked as heuristic.` };
        }
      } else if (quantitySource !== 'heuristic') {
        // Heuristic quantities are only allowed after explicit user authorisation.
        return { ok: false, error: `${item.name}: enter a quantity or explicitly ask Apex to estimate it for you.` };
      } else if (!(HEURISTIC_COMPONENT_IDS as readonly string[]).includes(item.id)) {
        return { ok: false, error: `${item.name} cannot be safely estimated - enter an approximate length or remove it.` };
      }
    }

    const unit = typeof obj.unit === 'string' ? obj.unit : null;
    out.push({
      componentId: item.id,
      selected,
      quantity: quantity != null && quantity > 0 ? quantity : null,
      unit: unit ?? item.unit,
      quantitySource: selected ? (quantity != null && quantity > 0 ? 'user' : 'heuristic') : undefined,
    });
  }
  return { ok: true, components: out };
}

export function validateEstimateDraftInput(value: unknown): DraftValidation {
  if (!value || typeof value !== 'object') return { ok: false, error: 'Invalid estimate draft.' };
  const obj = value as Record<string, unknown>;

  if (!PROJECT_TYPES.includes(obj.projectType as ProjectType)) {
    return { ok: false, error: 'Choose whether this is a new roof or a re-roof.' };
  }
  const mode = MODES.includes(obj.mode as EstimateDraft['mode']) ? (obj.mode as EstimateDraft['mode']) : 'guided';

  const areaRaw = obj.area;
  if (!areaRaw || typeof areaRaw !== 'object') return { ok: false, error: 'Invalid roof size.' };
  const area = areaRaw as Record<string, unknown>;
  const exactM2 = num(area.exactM2);
  const band = typeof area.band === 'string' ? (area.band as SizeBandId) : undefined;
  const source = area.source === 'configured_band' ? 'configured_band' : 'user_exact';

  let draftArea: EstimateDraft['area'];
  if (exactM2 != null && exactM2 > 0 && exactM2 <= 100000) {
    draftArea = { exactM2, source: 'user_exact' };
  } else if (band && SIZE_BANDS.includes(band)) {
    draftArea = { band, source: 'configured_band' };
  } else {
    return { ok: false, error: 'Enter an exact roof area or choose a size band.' };
  }

  const pitchRaw = obj.pitch;
  let draftPitch: EstimateDraft['pitch'] = { source: 'user_band' };
  if (pitchRaw && typeof pitchRaw === 'object') {
    const pitch = pitchRaw as Record<string, unknown>;
    const degrees = num(pitch.degrees);
    const pitchBand = typeof pitch.band === 'string' ? (pitch.band as PitchBandId) : undefined;
    if (degrees != null && degrees >= 0 && degrees <= 85) {
      draftPitch = { degrees, source: 'user_exact' };
    } else if (pitchBand && PITCH_BANDS.includes(pitchBand)) {
      draftPitch = { band: pitchBand, source: 'user_band' };
    }
  }

  const materialId = typeof obj.materialId === 'string' ? obj.materialId : '';
  const materialItem = getItemById(materialId);
  if (!materialItem || materialItem.category !== 'reroofing') {
    return { ok: false, error: 'Choose a roof covering from the approved catalogue.' };
  }

  const componentsResult = validateComponents(obj.components);
  if (!componentsResult.ok) return componentsResult;

  return {
    ok: true,
    draft: {
      projectType: obj.projectType as ProjectType,
      mode,
      area: draftArea,
      pitch: draftPitch,
      materialId: materialItem.id,
      components: componentsResult.components,
    },
  };
}

/** Deterministic customer-facing summary for a priced draft (no LLM arithmetic or prose needed). */
export function describePricedDraft(result: PricedDraft): string {
  const estimate = result.mode === 'single' ? result.estimate : result.high;
  const { symbol, currency } = estimate;
  const v4 = getV4Rules();
  const parts: string[] = [];
  parts.push(estimate.project.projectType === 'reroof' ? 're-roof' : 'new roof');
  if (result.mode === 'range' && result.band) {
    const band = v4.sizeBands[result.band];
    parts.push(`${band.minM2}-${band.maxM2} m2 (${band.label})`);
  } else {
    parts.push(`${estimate.project.roofArea.toLocaleString()} m2`);
  }
  parts.push(estimate.project.materialLabel.toLowerCase());

  const total =
    result.mode === 'single'
      ? `${symbol}${estimate.total.toLocaleString()} ${currency}`
      : `${symbol}${result.low.total.toLocaleString()} - ${symbol}${result.high.total.toLocaleString()} ${currency}`;

  const scope =
    estimate.project.componentScope === 'covering_only'
      ? 'the roof covering only'
      : 'the roof covering plus the components you chose';

  const prefix =
    result.mode === 'range'
      ? `Because you picked a size band rather than an exact measurement, I've shown a price range instead of a single figure.`
      : result.indicative
        ? `Some quantities below are estimated allowances, so treat the figures as indicative.`
        : `Here is your indicative estimate.`;

  return `Here is your indicative estimate for a ${parts.join(', ')} - ${scope}. ${prefix} Ballpark total: ${total}. This is an indicative ballpark estimate based on the information provided, not a formal quotation.`;
}

/** Compact draft summary for the system prompt / enquiry review. */
export function draftSummaryLines(draft: EstimateDraft): string[] {
  const v4 = getV4Rules();
  const lines: string[] = [];
  lines.push(draft.projectType === 'reroof' ? 'Re-roof / roof replacement' : 'New roof');
  if (draft.area.exactM2 != null) lines.push(`${draft.area.exactM2.toLocaleString()} m2`);
  else if (draft.area.band) {
    const band = v4.sizeBands[draft.area.band];
    lines.push(`${band.label} size band (${band.minM2}-${band.maxM2} m2, indicative)`);
  }
  if (draft.pitch.degrees != null) lines.push(`Pitch ${draft.pitch.degrees} degrees`);
  else if (draft.pitch.band) lines.push(`Pitch band: ${v4.pitchBands[draft.pitch.band].label}`);
  const material = draft.materialId ? getItemById(draft.materialId) : null;
  if (material) lines.push(material.name);
  const selected = draft.components.filter((c) => c.selected);
  if (selected.length) {
    lines.push(
      selected
        .map((c) => {
          const item = getItemById(c.componentId);
          const qty = c.quantity != null ? ` - ${c.quantity.toLocaleString()}${c.quantitySource === 'user' ? '' : ' (estimated)'} ${c.unit ?? ''}` : '';
          return `${item?.name ?? c.componentId}${qty}`;
        })
        .join(', ')
    );
  }
  return lines;
}
