import { findItem, getCatalog, getItemById, type CatalogItem } from './catalog';
import { getEstimateRules, getV4Rules, type PerimeterRatios, type PitchBandId, type SizeBandId } from './rules';

/**
 * Deterministic estimate engine.
 * The LLM interprets intent but never performs pricing maths.
 */

export type AreaType = 'actual_roof_area' | 'plan_area' | 'unknown';
export type RoofShape = 'gable' | 'hip' | 'valley_complex' | 'flat' | 'unknown';
export type EstimateScope = 'covering_only' | 'specified_components' | 'estimated_components';
export type ProjectType = 'new_roof' | 'reroof';

/** Component ids the engine can safely estimate from geometry when the customer explicitly authorises it. */
export const HEURISTIC_COMPONENT_IDS = ['ridge_hip_system', 'valley_trough', 'gutter_replacement', 'downpipe', 'insulation_upgrade'];

export type { PitchBandId, SizeBandId, SizeBand, PitchBand } from './rules';

export interface EstimateComponentSelection {
  catalogItemId: string;
  quantity?: number | null;
}

export interface EstimateInput {
  roofArea: number;
  areaType: AreaType;
  roofShape: RoofShape;
  pitchDegrees?: number | null;
  material: string;
  componentScope: EstimateScope;
  components?: EstimateComponentSelection[];
  extras?: string[];
  projectType?: ProjectType | null;
}

export interface EstimateLineItem {
  catalogItemId: string;
  label: string;
  quantity: number;
  unit: CatalogItem['unit'];
  rate: number;
  subtotal: number;
  quantitySource: 'area' | 'user' | 'heuristic' | 'fixed';
}

export interface Estimate {
  id: string;
  catalogVersion: string;
  currency: string;
  symbol: string;
  status: 'indicative';
  project: {
    projectType: ProjectType | null;
    roofArea: number;
    areaType: AreaType;
    roofShape: RoofShape;
    pitchDegrees: number;
    material: string;
    materialLabel: string;
    componentScope: EstimateScope;
    components: EstimateComponentSelection[];
  };
  lineItems: EstimateLineItem[];
  subtotal: number;
  tax: number | null;
  total: number;
  assumptions: string[];
  exclusions: string[];
  disclaimer: string;
}

function roundUpToStep(qty: number, step: number): number {
  if (qty <= 0) return 0;
  return Math.ceil(qty / step) * step;
}

function roundUpTo(value: number, nearest: number): number {
  if (value <= 0) return 0;
  return Math.ceil(value / nearest) * nearest;
}

export function slopeFactor(pitchDegrees: number): number {
  const rules = getEstimateRules();
  const preset = rules.pitchPresets[String(Math.round(pitchDegrees))];
  if (preset !== undefined) return preset;
  return 1 / Math.cos((pitchDegrees * Math.PI) / 180);
}

function resolveMaterial(material: string): CatalogItem {
  const item = findItem(material);
  if (item && item.category === 'reroofing') return item;
  throw new Error(`Unknown approved roofing material: ${material}`);
}

function ratiosFor(shape: RoofShape): { ratios: PerimeterRatios; assumed: boolean } {
  const h = getEstimateRules().perimeterHeuristics;
  if (shape === 'hip') return { ratios: h.hip, assumed: false };
  if (shape === 'valley_complex') return { ratios: h.valley_complex, assumed: false };
  if (shape === 'flat') return { ratios: h.flat, assumed: false };
  if (shape === 'gable') return { ratios: h.gable, assumed: false };
  return { ratios: h.gable, assumed: true };
}

function makeEstimateId(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `est_${Date.now().toString(36)}${rand}`;
}

function normaliseComponents(input: EstimateComponentSelection[] | undefined): EstimateComponentSelection[] {
  const seen = new Set<string>();
  const out: EstimateComponentSelection[] = [];
  for (const component of input ?? []) {
    if (!component || typeof component.catalogItemId !== 'string') continue;
    const item = getItemById(component.catalogItemId);
    if (!item || item.category !== 'component' || seen.has(item.id)) continue;
    const quantity = typeof component.quantity === 'number' && Number.isFinite(component.quantity) && component.quantity > 0
      ? component.quantity
      : null;
    seen.add(item.id);
    out.push({ catalogItemId: item.id, quantity });
  }
  return out;
}

export function createEstimate(input: EstimateInput): Estimate {
  if (!['covering_only', 'specified_components', 'estimated_components'].includes(input.componentScope)) {
    throw new Error('A valid componentScope is required for every estimate.');
  }
  const rules = getEstimateRules();
  const catalog = getCatalog();
  const assumptions: string[] = [];
  const exclusions = new Set<string>();

  const pitch = input.pitchDegrees ?? rules.defaultPitchDegrees;
  if (input.pitchDegrees == null) {
    assumptions.push(`Pitch not supplied - ${rules.defaultPitchDegrees} degrees used where a pitch value was required`);
  }

  const materialItem = resolveMaterial(input.material);
  const material = materialItem.id;
  materialItem.excludes.forEach((e) => exclusions.add(e));

  let actualArea: number;
  if (input.areaType === 'plan_area') {
    const sf = slopeFactor(pitch);
    actualArea = roundUpToStep(input.roofArea * sf, rules.rounding.quantityStepArea);
    assumptions.push(
      `Plan area ${input.roofArea} m² converted to ${actualArea} m² sloped area using a ${sf.toFixed(3)} slope factor at ${pitch} degrees`
    );
  } else {
    actualArea = roundUpToStep(input.roofArea, rules.rounding.quantityStepArea);
    if (input.areaType === 'unknown') {
      assumptions.push(`Area type was not specified - ${input.roofArea} m² treated as actual roof surface area`);
    }
  }

  const wasteMultiplier = 1 + rules.wasteFactorPct / 100;
  const coveringQty = roundUpToStep(actualArea * wasteMultiplier, rules.rounding.quantityStepArea);
  const { ratios, assumed: shapeAssumed } = ratiosFor(input.roofShape);

  const ridgeHipLm = roundUpToStep(
    (ratios.ridgeLmPerSqm + ratios.hipLmPerSqm) * actualArea,
    rules.rounding.quantityStepLinear
  );
  const valleyLm = roundUpToStep(ratios.valleyLmPerSqm * actualArea, rules.rounding.quantityStepLinear);
  const gutterLm = roundUpToStep(ratios.gutterLmPerSqm * actualArea, rules.rounding.quantityStepLinear);

  const lineItems: EstimateLineItem[] = [];

  function addLine(item: CatalogItem, qty: number, quantitySource: EstimateLineItem['quantitySource'], unitOverride?: CatalogItem['unit']) {
    if (qty <= 0) return;
    const unit = unitOverride ?? item.unit;
    let subtotal = qty * item.rate;
    if (item.minimumCharge > 0 && subtotal < item.minimumCharge) {
      subtotal = item.minimumCharge;
      assumptions.push(`${item.name}: minimum charge of ${catalog.symbol}${item.minimumCharge.toLocaleString()} applied`);
    }
    subtotal = roundUpTo(subtotal, rules.rounding.perLine);
    lineItems.push({ catalogItemId: item.id, label: item.name, quantity: qty, unit, rate: item.rate, subtotal, quantitySource });
    item.excludes.forEach((e) => exclusions.add(e));
  }

  addLine(materialItem, coveringQty, 'area');

  // Re-roof removal allowances (V4): configured in estimate-rules.json, never hardcoded.
  if (input.projectType === 'reroof') {
    const v4 = getV4Rules();
    const allowance = v4.reroofAllowances;
    const stripQty = roundUpToStep(actualArea, rules.rounding.quantityStepArea);
    addRawLine('reroof_strip_allowance', allowance.stripLabel, stripQty, 'm2', allowance.stripRatePerM2, 'area');
    addRawLine('reroof_disposal_allowance', allowance.disposalLabel, 1, 'fixed', allowance.disposalAllowancePerJob, 'fixed');
    assumptions.push(allowance.assumptionNote);
  }

  function addRawLine(id: string, label: string, qty: number, unit: CatalogItem['unit'], rate: number, quantitySource: EstimateLineItem['quantitySource']) {
    if (qty <= 0) return;
    const subtotal = roundUpTo(qty * rate, rules.rounding.perLine);
    lineItems.push({ catalogItemId: id, label, quantity: qty, unit, rate, subtotal, quantitySource });
  }

  const components = normaliseComponents(input.components);

  if (input.componentScope === 'covering_only') {
    assumptions.push('Estimate scope is the main roof covering only - no separate ridge, hip, valley, flashing, gutter or insulation line items added');
  }

  if (input.componentScope === 'specified_components') {
    assumptions.push('Additional components included only where the customer supplied or selected them');
    for (const selection of components) {
      const item = getItemById(selection.catalogItemId);
      if (!item) continue;
      let qty = selection.quantity ?? 0;
      let source: EstimateLineItem['quantitySource'] = 'user';
      if (!qty && item.unit === 'm2') {
        qty = actualArea;
        source = 'area';
        assumptions.push(`${item.name}: quantity matched to the calculated roof area`);
      }
      if (!qty && item.unit === 'fixed') {
        qty = 1;
        source = 'fixed';
      }
      if (!qty) continue;
      addLine(item, roundUpToStep(qty, item.unit === 'm2' ? rules.rounding.quantityStepArea : rules.rounding.quantityStepLinear), source);
    }
  }

  if (input.componentScope === 'estimated_components') {
    if (shapeAssumed) assumptions.push('Roof shape not supplied - simple gable proportions used only for requested component estimates');
    assumptions.push('Selected roof component quantities are geometry-based allowances, not measured takeoff quantities');

    // With no explicit list, estimate only roof-system components implied by shape.
    const requested = components.length
      ? components.map((c) => c.catalogItemId)
      : ['ridge_hip_system', 'valley_trough'];

    for (const id of requested) {
      const item = getItemById(id);
      if (!item) continue;
      const supplied = components.find((c) => c.catalogItemId === id)?.quantity;
      if (supplied && supplied > 0) {
        addLine(item, roundUpToStep(supplied, rules.rounding.quantityStepLinear), 'user');
        continue;
      }

      if (id === 'ridge_hip_system') addLine(item, ridgeHipLm, 'heuristic');
      else if (id === 'valley_trough') addLine(item, valleyLm, 'heuristic');
      else if (id === 'gutter_replacement') addLine(item, gutterLm, 'heuristic');
      else if (id === 'downpipe') {
        const count = Math.max(1, Math.round(gutterLm * rules.defaultDownpipesPerGutterLm));
        addLine(item, count, 'heuristic', 'count');
      } else if (id === 'insulation_upgrade') addLine(item, actualArea, 'area');
      // Flashings and other linear details are deliberately not guessed.
    }
  }

  // Backward-compatible extras are explicit catalogue additions. Never infer quantities for unknown linear items.
  for (const extraId of input.extras ?? []) {
    const item = getItemById(extraId);
    if (!item || lineItems.some((li) => li.catalogItemId === item.id)) continue;
    if (item.unit === 'm2') addLine(item, actualArea, 'area');
    else if (item.unit === 'fixed') addLine(item, 1, 'fixed');
  }

  const subtotal = roundUpTo(lineItems.reduce((sum, li) => sum + li.subtotal, 0), rules.rounding.perLine);
  const allAssumptions = [...assumptions, ...rules.standardAssumptions];

  return {
    id: makeEstimateId(),
    catalogVersion: catalog.catalogVersion,
    currency: catalog.currency,
    symbol: catalog.symbol,
    status: 'indicative',
    project: {
      projectType: input.projectType ?? null,
      roofArea: input.roofArea,
      areaType: input.areaType,
      roofShape: input.roofShape,
      pitchDegrees: pitch,
      material: materialItem.id,
      materialLabel: materialItem.name,
      componentScope: input.componentScope,
      components,
    },
    lineItems,
    subtotal,
    tax: catalog.taxLabel ? 0 : null,
    total: subtotal,
    assumptions: allAssumptions,
    exclusions: [...exclusions],
    disclaimer: rules.disclaimer,
  };
}

/**
 * V4 guided-estimator draft state (SMART_ASSISTANT_V4_BRIEF section 8).
 * Only validated structured drafts are priced here - the LLM never computes money.
 */

export interface EstimateDraftArea {
  exactM2?: number;
  band?: SizeBandId;
  source: 'user_exact' | 'configured_band';
}

export interface EstimateDraftPitch {
  degrees?: number;
  band?: PitchBandId;
  source: 'user_exact' | 'user_band';
}

export interface EstimateDraftComponent {
  componentId: string;
  selected: boolean;
  quantity?: number | null;
  unit?: string | null;
  quantitySource?: 'user' | 'heuristic';
}

export interface EstimateDraft {
  projectType: ProjectType;
  mode: 'unit_rate' | 'quick_ballpark' | 'guided';
  area: EstimateDraftArea;
  pitch: EstimateDraftPitch;
  materialId?: string;
  components: EstimateDraftComponent[];
}

export type PricedDraft =
  | { mode: 'single'; estimate: Estimate; indicative: boolean }
  | { mode: 'range'; low: Estimate; high: Estimate; indicative: true; band: SizeBandId };

export function resolvePitchDegrees(pitch: EstimateDraftPitch): number | undefined {
  if (typeof pitch.degrees === 'number' && Number.isFinite(pitch.degrees)) return pitch.degrees;
  if (pitch.band) return getV4Rules().pitchBands[pitch.band].representativeDegrees;
  return undefined;
}

export function priceDraft(draft: EstimateDraft): PricedDraft {
  if (!draft.materialId) throw new Error('EstimateDraft needs a materialId from the approved catalogue');
  const v4 = getV4Rules();

  const pitchDegrees = resolvePitchDegrees(draft.pitch);
  const areas: number[] = [];
  let band: SizeBandId | undefined;
  if (typeof draft.area.exactM2 === 'number' && draft.area.exactM2 > 0) {
    areas.push(draft.area.exactM2);
  } else if (draft.area.band) {
    band = draft.area.band;
    areas.push(v4.sizeBands[band].minM2, v4.sizeBands[band].maxM2);
  }
  if (!areas.length) throw new Error('EstimateDraft needs an exact area or a configured size band');

  const selected = draft.components.filter((c) => c.selected);
  const anyHeuristic = selected.some((c) => c.quantitySource === 'heuristic');
  const componentScope: EstimateScope = selected.length === 0 ? 'covering_only' : anyHeuristic ? 'estimated_components' : 'specified_components';
  const selections: EstimateComponentSelection[] = selected.map((c) => ({ catalogItemId: c.componentId, quantity: c.quantity ?? null }));

  const build = (roofArea: number): Estimate =>
    createEstimate({ roofArea, areaType: 'actual_roof_area', roofShape: 'unknown', pitchDegrees, material: draft.materialId!, componentScope, components: selections, projectType: draft.projectType });

  const indicative = draft.area.source === 'configured_band' || anyHeuristic;
  if (areas.length === 1) return { mode: 'single', estimate: build(areas[0]), indicative };

  const low = build(areas[0]);
  const high = build(areas[1]);
  return { mode: 'range', low, high, indicative: true, band: band! };
}
