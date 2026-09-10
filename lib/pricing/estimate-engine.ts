import { findItem, getCatalog, getItemById, type CatalogItem } from './catalog';
import { getEstimateRules, type PerimeterRatios } from './rules';

/**
 * Deterministic estimate engine (spec section 8).
 * The model NEVER computes prices - it only submits structured inputs.
 * All maths happens here from pricing.json + estimate-rules.json.
 */

export type AreaType = 'actual_roof_area' | 'plan_area' | 'unknown';
export type RoofShape = 'gable' | 'hip' | 'valley_complex' | 'flat' | 'unknown';

export interface EstimateInput {
  roofArea: number;
  areaType: AreaType;
  roofShape: RoofShape;
  pitchDegrees?: number | null;
  material?: string | null;
  includeGutters?: boolean;
  includeInsulation?: boolean;
  includeFlashings?: boolean;
  extras?: string[];
}

export interface EstimateLineItem {
  catalogItemId: string;
  label: string;
  quantity: number;
  unit: CatalogItem['unit'];
  rate: number;
  subtotal: number;
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
  };
  lineItems: EstimateLineItem[];
  subtotal: number;
  tax: number | null;
  total: number;
  assumptions: string[];
  exclusions: string[];
  disclaimer: string;
}

/* ---------- helpers ---------- */

function roundUpToStep(qty: number, step: number): number {
  if (qty <= 0) return 0;
  return Math.ceil(qty / step) * step;
}

function roundUpTo(value: number, nearest: number): number {
  if (value <= 0) return 0;
  return Math.ceil(value / nearest) * nearest;
}

/** Slope factor from pitchPresets when available, otherwise 1/cos. */
export function slopeFactor(pitchDegrees: number): number {
  const rules = getEstimateRules();
  const preset = rules.pitchPresets[String(Math.round(pitchDegrees))];
  if (preset !== undefined) return preset;
  return 1 / Math.cos((pitchDegrees * Math.PI) / 180);
}

function resolveMaterial(material: string | null | undefined): CatalogItem {
  const rules = getEstimateRules();
  if (material) {
    const item = findItem(material);
    if (item && item.category === 'reroofing') return item;
  }
  return getItemById(rules.defaultMaterial) ?? findItem('concrete tile')!;
}

function ratiosFor(shape: RoofShape): { ratios: PerimeterRatios; assumed: boolean } {
  const h = getEstimateRules().perimeterHeuristics;
  if (shape === 'hip') return { ratios: h.hip, assumed: false };
  if (shape === 'valley_complex') return { ratios: h.valley_complex, assumed: false };
  if (shape === 'flat') return { ratios: h.flat, assumed: false };
  if (shape === 'gable') return { ratios: h.gable, assumed: false };
  // unknown -> conservative gable ratios, stated as an assumption
  return { ratios: h.gable, assumed: true };
}

function makeEstimateId(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `est_${Date.now().toString(36)}${rand}`;
}

/* ---------- main entry ---------- */

export function createEstimate(input: EstimateInput): Estimate {
  const rules = getEstimateRules();
  const catalog = getCatalog();
  const assumptions: string[] = [];
  const exclusions = new Set<string>();

  const pitch = input.pitchDegrees ?? rules.defaultPitchDegrees;
  const pitchAssumed = input.pitchDegrees == null;
  if (pitchAssumed) assumptions.push(`Pitch assumed ${rules.defaultPitchDegrees} degrees as it was not supplied`);

  // Material
  const materialItem = resolveMaterial(input.material);
  const material = materialItem.id;
  materialItem.excludes.forEach((e) => exclusions.add(e));

  // Area: apply slope factor when the user gave a PLAN (footprint) area.
  let actualArea: number;
  let areaAssumedPlan = false;
  if (input.areaType === 'plan_area') {
    const sf = slopeFactor(pitch);
    actualArea = roundUpToStep(input.roofArea * sf, rules.rounding.quantityStepArea);
    assumptions.push(
      `Plan/footprint area of ${input.roofArea} m² converted to actual sloped area using slope factor ${sf.toFixed(3)} at ${pitch}° → ${actualArea} m²`
    );
  } else {
    actualArea = roundUpToStep(input.roofArea, rules.rounding.quantityStepArea);
    if (input.areaType === 'unknown') areaAssumedPlan = true;
  }
  if (areaAssumedPlan) {
    assumptions.push(`Roof area of ${input.roofArea} m² treated as the actual sloped roof area`);
  }

  // Covering quantity with waste allowance
  const wasteMultiplier = 1 + rules.wasteFactorPct / 100;
  const coveringQty = roundUpToStep(actualArea * wasteMultiplier, rules.rounding.quantityStepArea);

  const { ratios, assumed: shapeAssumed } = ratiosFor(input.roofShape);
  if (shapeAssumed) assumptions.push('Roof shape not specified - simple gable proportions assumed');
  const ridgeHipLm = roundUpToStep((ratios.ridgeLmPerSqm + ratios.hipLmPerSqm) * actualArea, rules.rounding.quantityStepLinear);
  const valleyLm = roundUpToStep(ratios.valleyLmPerSqm * actualArea, rules.rounding.quantityStepLinear);
  const gutterLm = roundUpToStep(ratios.gutterLmPerSqm * actualArea, rules.rounding.quantityStepLinear);

  const lineItems: EstimateLineItem[] = [];

  function addLine(item: CatalogItem, qty: number, unitOverride?: CatalogItem['unit']) {
    if (qty <= 0) return;
    const unit = unitOverride ?? item.unit;
    let subtotal = qty * item.rate;
    if (item.minimumCharge > 0 && subtotal < item.minimumCharge) {
      subtotal = item.minimumCharge;
      assumptions.push(`${item.name}: priced at the $${item.minimumCharge} minimum charge`);
    }
    subtotal = roundUpTo(subtotal, rules.rounding.perLine);
    lineItems.push({ catalogItemId: item.id, label: item.name, quantity: qty, unit, rate: item.rate, subtotal });
    item.excludes.forEach((e) => exclusions.add(e));
  }

  // Main covering
  addLine(materialItem, coveringQty);

  // Dry-fix ridge/hip system (not on flat roofs)
  if (ridgeHipLm > 0 && input.roofShape !== 'flat') {
    const ridgeItem = getItemById('ridge_hip_system');
    if (ridgeItem) addLine(ridgeItem, ridgeHipLm);
  }

  // Valleys
  if (valleyLm > 0) {
    const valleyItem = getItemById('valley_trough');
    if (valleyItem) addLine(valleyItem, valleyLm);
  }

  // Optional: flashings
  if (input.includeFlashings) {
    const flashItem = getItemById('flashings');
    if (flashItem) {
      const flashLm = roundUpToStep(Math.max(ridgeHipLm, gutterLm * 0.3), rules.rounding.quantityStepLinear);
      addLine(flashItem, flashLm);
      assumptions.push('Flashing length estimated from roof geometry');
    }
  }

  // Optional: gutters + downpipes
  if (input.includeGutters) {
    const gutterItem = getItemById('gutter_replacement');
    if (gutterItem) {
      addLine(gutterItem, gutterLm);
      assumptions.push(`Gutter length estimated at ${gutterLm} lm from roof area and shape`);
      const downpipeItem = getItemById('downpipe');
      if (downpipeItem) {
        const count = Math.max(1, Math.round(gutterLm * rules.defaultDownpipesPerGutterLm));
        addLine(downpipeItem, count, 'count');
        assumptions.push(`${count} downpipe${count === 1 ? '' : 's'} assumed (1 per ~12.5 lm of gutter)`);
      }
    }
  }

  // Optional: insulation
  if (input.includeInsulation) {
    const insItem = getItemById('insulation_upgrade');
    if (insItem) addLine(insItem, actualArea);
  }

  // Extras (validated catalogue ids only)
  for (const extraId of input.extras ?? []) {
    const item = getItemById(extraId);
    if (!item) continue;
    const qty = item.unit === 'm2' ? actualArea : item.unit === 'lm' ? gutterLm : 1;
    addLine(item, qty);
  }

  // Totals with consistent rounding
  const subtotal = roundUpTo(
    lineItems.reduce((sum, li) => sum + li.subtotal, 0),
    rules.rounding.perLine
  );

  // Standard assumptions (append the data-driven ones)
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
