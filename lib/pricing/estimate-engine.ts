import { findItem, getCatalog, getItemById, type CatalogItem } from './catalog';
import { getEstimateRules, type PerimeterRatios } from './rules';

/**
 * Deterministic estimate engine.
 * The LLM interprets intent but never performs pricing maths.
 */

export type AreaType = 'actual_roof_area' | 'plan_area' | 'unknown';
export type RoofShape = 'gable' | 'hip' | 'valley_complex' | 'flat' | 'unknown';
export type EstimateScope = 'covering_only' | 'specified_components' | 'estimated_components';

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
      roofArea: input.roofArea,
      areaType: input.areaType,
      roofShape: input.roofShape,
      pitchDegrees: pitch,
      material,
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
