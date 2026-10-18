import { priceOutput, type OutputTotals } from '../../app/supplier-pricing-tool/pricing';
import type { GroupKey, SupplierProduct } from '../../app/supplier-pricing-tool/types';
import { measureRoof, measureSection } from './engine';
import { ROOF_TEMPLATES } from './templates';
import { toSupplierMeasurements } from './supplier-adapter';
import type { CoveringId, MeasurementRange, MeasurementScenario, QuickEstimateInput, RoofSection, ShapeId } from './types';

export interface SystemRecipe {
  label: string;
  minPitch: number; maxPitch: number;
  areaProducts: string[];
  components: Partial<Record<GroupKey, string>>;
  exclusions: string[];
  /** Demo accessory pricing per measured linear metre; kept outside supplier group mapping. */
  eavesRate?: { material: number; labour: number };
  flatPerimeterRate?: { material: number; labour: number };
}
export interface AreaRate {
  materialPerM2: number; labourPerM2: number;
  /** Full system rates already include components. No component lines in this mode. */
  includes: string[];
  exclusions?: string[];
}
export interface PricingProfile {
  version: string; currency: string; mode: 'components' | 'area';
  systems: Partial<Record<CoveringId, SystemRecipe>>;
  areaRates: Partial<Record<CoveringId, AreaRate>>;
  /** Optional business-approved factors. Never applied to component material totals. */
  labourFactors: Partial<Record<ShapeId, number>>;
  areaComplexityFactors: Partial<Record<ShapeId, number>>;
  access: { 1: number | null; 2: number | null };
  removal: { perM2: number; disposalPerJob: number } | null;
  removalByMaterial: Partial<Record<string, { perM2: number; disposalPerJob: number }>>;
  taxNote: string;
  /** Flat-only labour and uncertainty allowances. Never change physical measurements. */
  flatComplexity?: Record<'simple' | 'typical' | 'complex', { low: number; high: number }>;
}
export interface PricedEndpoint {
  endpoint: 'low' | 'high'; sections: RoofSection[];
  materials: number; labour: number; removal: number; access: number; total: number;
  supplierOutput: OutputTotals | null;
}
export interface PublicPriceRange {
  low: number; high: number;
  confidence: 'high' | 'medium' | 'early';
  label: string;
  reasons: string[];
}
export interface QuickPrice {
  status: 'priced' | 'partial' | 'unavailable' | 'incompatible';
  currency: string; mode: PricingProfile['mode']; profileVersion: string;
  low: PricedEndpoint | null; high: PricedEndpoint | null;
  /** Customer-facing range centred on the configured estimate, with uncertainty based on input precision. */
  presentation: PublicPriceRange | null;
  missing: string[]; notes: string[]; taxNote: string;
}

export interface QuickResult { input: QuickEstimateInput; measurements: MeasurementRange; price: QuickPrice }
const round = (n: number) => Math.round(n * 100) / 100;
export const DEFAULT_FLAT_COMPLEXITY = { simple: { low: 1, high: 1.1 }, typical: { low: 1.08, high: 1.25 }, complex: { low: 1.2, high: 1.55 } } as const;

export function createQuickResult(input: QuickEstimateInput, catalog: SupplierProduct[], profile: PricingProfile): QuickResult {
  validatePricingProfile(profile);
  const measurements = measureRoof(input);
  return { input, measurements, price: priceQuickRange(input, measurements, catalog, profile) };
}

export function priceQuickRange(input: QuickEstimateInput, measurements: MeasurementRange, catalog: SupplierProduct[], profile: PricingProfile): QuickPrice {
  const missing = new Set<string>();
  const notes = new Set<string>(['Public demonstration rates are used, not authenticated customer or trade pricing.', 'This is an indicative range for the listed work, not a formal or all-inclusive quote.']);
  let incompatible = false, unavailable = false;
  const products = new Map(catalog.map(p => [p.id, p]));
  const coveringFor = (section: RoofSection) => section.id === 'extension' ? input.flatCovering! : input.covering;
  const pricedSections: { low: RoofSection[]; high: RoofSection[] } = { low: [], high: [] };
  for (let i = 0; i < measurements.low.sections.length; i++) {
    const low = measurements.low.sections[i], high = measurements.high.sections[i];
    const covering = coveringFor(low), system = profile.systems[covering];
    if (!system) { missing.add(`${covering.toUpperCase()} system products and installation rates`); unavailable = true; continue; }
    const minPitch = Math.max(low.pitchDegrees, system.minPitch), maxPitch = Math.min(high.pitchDegrees, system.maxPitch);
    if (minPitch > maxPitch) {
      notes.add(`${system.label} is not configured for the selected pitch range. Choose another covering or arrange a measured assessment.`);
      incompatible = true; continue;
    }
    if (minPitch !== low.pitchDegrees || maxPitch !== high.pitchDegrees) notes.add(`${system.label}: this price applies only at ${minPitch}-${maxPitch}°. The rest of your selected pitch band needs a different specification. The measurement table still shows the whole band.`);
    pricedSections.low.push(measureSection(low.shape, low.quantities.footprintM2, minPitch, low.id));
    pricedSections.high.push(measureSection(high.shape, high.quantities.footprintM2, maxPitch, high.id));
    (profile.mode === 'components' ? system.exclusions : profile.areaRates[covering]?.exclusions ?? []).forEach(x => missing.add(x));
    if (profile.mode === 'area' && !profile.areaRates[covering]) { missing.add(`${system.label} all-in square-metre rate`); unavailable = true; }
    if (profile.mode === 'components') for (const productId of [...system.areaProducts, ...Object.values(system.components)]) {
      const product = products.get(productId);
      if (!product) { missing.add(`Catalogue product ${productId}`); unavailable = true; }
      else if ([product.unitPrice, product.defaultLabourRate, product.defaultWastePct, product.defaultWasteFlat ?? 0].some(value => !Number.isFinite(value) || value < 0)) throw new Error(`Invalid catalogue rates for ${productId}`);
    }
  }
  if (input.existingMaterial === 'unknown' && input.project === 'reroof') notes.add('The existing covering is unknown. Any removal allowance is generic and excludes hazardous materials.');
  const removalFor = (section: RoofSection) => input.project === 'reroof'
    ? profile.removalByMaterial[section.id === 'extension' ? 'membrane' : input.existingMaterial!] ?? profile.removal : null;
  if (input.project === 'reroof' && measurements.low.sections.some(section => !removalFor(section))) missing.add('Existing-roof strip and disposal rates');
  if (input.project === 'reroof' && input.flatExtension) {
    notes.add('The additional flat section is assumed to have an existing membrane covering. Its removal rate is separate from the main roof covering.');
    const disposalRates = measurements.low.sections.map(section => removalFor(section)?.disposalPerJob).filter(rate => rate !== undefined);
    if (new Set(disposalRates).size > 1) missing.add('Mixed-covering disposal specification: the largest configured job allowance is included once');
  }
  if (profile.access[input.storeys] === null) missing.add(`${input.storeys === 2 ? 'Two-storey' : 'Single-storey'} scaffolding and site access`);
  if (input.flatExtension) missing.add('Shared extension junction, upstands and drainage specification');
  const base = { currency: profile.currency, mode: profile.mode, profileVersion: profile.version, notes: [...notes], taxNote: profile.taxNote };
  if (incompatible || unavailable) return { ...base, status: incompatible ? 'incompatible' : 'unavailable', low: null, high: null, presentation: null, missing: [...missing] };

  const flatLevel = input.flatComplexity ?? 'typical';
  const flatFactors = profile.flatComplexity ?? DEFAULT_FLAT_COMPLEXITY;
  const endpoint = (original: MeasurementScenario): PricedEndpoint => {
    const sections = pricedSections[original.endpoint];
    const { set, unmapped } = toSupplierMeasurements({ ...original, sections });
    let materialTotal = 0, labourTotal = 0;
    let supplierOutput: OutputTotals | null = null;
    if (profile.mode === 'components') {
      for (const section of sections) {
        const system = profile.systems[coveringFor(section)]!;
        const factor = profile.labourFactors[section.shape] ?? 1;
        function apply(productId: string, groupKey: GroupKey, entryId: string) {
          const p = products.get(productId)!;
          if (!p.groups.includes(groupKey)) throw new Error(`Invalid recipe: ${productId} cannot be applied to ${groupKey}`);
          set.appliedProducts.push({ id: `quick-${entryId}-${productId}`, groupKey, entryId, productId,
            wastePct: p.defaultWastePct, wasteFlat: p.defaultWasteFlat ?? 0, wasteMode: p.defaultWasteMode ?? 'percent',
            labourRate: p.defaultLabourRate * factor, qtyOverride: null, priceOverride: null });
        }
        for (const id of system.areaProducts) apply(id, 'roofAreas', `quick-${section.id}`);
        for (const [group, productId] of Object.entries(system.components)) {
          const groupKey = group as GroupKey;
          for (const entry of set.groups[groupKey].entries.filter(e => e.roofAreaId === `quick-${section.id}`)) apply(productId, groupKey, entry.id);
        }
        if (factor !== 1) notes.add(`${ROOF_TEMPLATES[section.shape].label}: configured labour factor ${factor} applied to labour only.`);
      }
      for (const edge of unmapped) {
        const section = sections.find(s => s.id === edge.section)!;
        const recipe = profile.systems[coveringFor(section)]!;
        if (edge.kind === 'flat_edge' && recipe.flatPerimeterRate) continue;
        missing.add(`${edge.kind.replaceAll('_', ' ')} detailing (${edge.section})`);
      }
      supplierOutput = priceOutput(set, catalog, true);
      materialTotal = supplierOutput.material; labourTotal = supplierOutput.labour;
      // Eaves are NOT gutters. The supplier spouting group is intentionally
      // excluded so a roof edge never automatically becomes a gutter purchase.
      for (const section of sections) {
        const recipe = profile.systems[coveringFor(section)]!;
        if (recipe.eavesRate) {
          materialTotal += section.quantities.eavesM * recipe.eavesRate.material * 1.05;
          labourTotal += section.quantities.eavesM * recipe.eavesRate.labour;
        }
        if (recipe.flatPerimeterRate) {
          materialTotal += section.quantities.flatEdgeM * recipe.flatPerimeterRate.material * 1.05;
          labourTotal += section.quantities.flatEdgeM * recipe.flatPerimeterRate.labour;
        }
      }
    } else {
      for (const section of sections) {
        const rate = profile.areaRates[coveringFor(section)]!;
        const factor = profile.areaComplexityFactors[section.shape] ?? 1;
        materialTotal += section.quantities.roofAreaM2 * rate.materialPerM2 * factor;
        labourTotal += section.quantities.roofAreaM2 * rate.labourPerM2 * factor;
        notes.add(`Area mode includes: ${rate.includes.join(', ')}. No extra ridge, hip or valley product lines are added.`);
      }
    }
    // Complexity is a flat-section installation/uncertainty allowance, not extra invented outlets.
    // Allocate it proportionally to the flat section's area, leaving pitched work untouched.
    const flatArea = sections.filter(s => s.shape === 'flat').reduce((sum, s) => sum + s.quantities.roofAreaM2, 0);
    const totalArea = sections.reduce((sum, s) => sum + s.quantities.roofAreaM2, 0);
    const flatShare = totalArea > 0 ? flatArea / totalArea : 0;
    const complexityFactor = flatFactors[flatLevel][original.endpoint];
    if (flatShare) {
      const allowance = labourTotal * flatShare * (complexityFactor - 1);
      labourTotal += allowance;
      notes.add(`Flat roof complexity: ${flatLevel}; ${Math.round((complexityFactor - 1) * 100)}% illustrative installation/uncertainty allowance on the flat-roof labour share (${original.endpoint} scenario).`);
    }
    const stripCost = sections.reduce((sum, section) => sum + section.quantities.roofAreaM2 * (removalFor(section)?.perM2 ?? 0), 0);
    const disposalCost = Math.max(0, ...sections.map(section => removalFor(section)?.disposalPerJob ?? 0));
    const removalCost = stripCost + disposalCost;
    const access = profile.access[input.storeys] ?? 0;
    return { endpoint: original.endpoint, sections, materials: round(materialTotal), labour: round(labourTotal), removal: round(removalCost), access, total: round(materialTotal + labourTotal + removalCost + access), supplierOutput };
  };
  const low = endpoint(measurements.low), high = endpoint(measurements.high);
  const presentation = buildPublicRange(input, low.total, high.total, missing.size > 0);
  return { ...base, notes: [...notes], status: missing.size ? 'partial' : 'priced', low, high, presentation, missing: [...missing] };
}


function buildPublicRange(input: QuickEstimateInput, lowTotal: number, highTotal: number, hasMissingScope: boolean): PublicPriceRange {
  // The deterministic endpoints remain available for handoff and audit. Public
  // visitors see a useful indicative range centred on those calculations rather
  // than an artificially huge min/max created by broad size and pitch bands.
  const midpoint = (lowTotal + highTotal) / 2;
  const exactArea = input.exactRoofAreaM2 !== undefined;
  const exactPitch = input.shape === 'flat' || input.exactPitchDegrees !== undefined;
  const complexity = ROOF_TEMPLATES[input.shape].complexity;
  const unknownRemoval = input.project === 'reroof' && input.existingMaterial === 'unknown';

  let lowerPct: number; let upperPct: number; let confidence: PublicPriceRange['confidence'];
  if (exactArea && exactPitch) { lowerPct = 0.05; upperPct = 0.08; confidence = 'high'; }
  else if (exactArea || exactPitch) { lowerPct = 0.08; upperPct = 0.12; confidence = 'medium'; }
  else { lowerPct = 0.12; upperPct = 0.16; confidence = 'early'; }

  if (complexity === 'moderate') { lowerPct += 0.02; upperPct += 0.04; }
  if (complexity === 'complex') { lowerPct += 0.05; upperPct += 0.09; }
  if (unknownRemoval) upperPct += 0.05;
  if (input.storeys === 2) upperPct += 0.02;
  if (hasMissingScope) { lowerPct += 0.02; upperPct += 0.06; confidence = confidence === 'high' ? 'medium' : 'early'; }

  // Keep the public range meaningful. Even an early complex estimate should not
  // casually imply a 2x spread; genuinely unresolved projects are explained in UI.
  lowerPct = Math.min(lowerPct, 0.25);
  upperPct = Math.min(upperPct, 0.35);
  const round100 = (value: number) => Math.max(0, Math.round(value / 100) * 100);
  const low = round100(midpoint * (1 - lowerPct));
  const high = Math.max(low + 500, round100(midpoint * (1 + upperPct)));
  const reasons: string[] = [];
  if (!exactArea) reasons.push('roof area is approximate');
  if (!exactPitch && input.shape !== 'flat') reasons.push('roof pitch is approximate');
  if (complexity !== 'simple') reasons.push(`${complexity} roof geometry can change labour and flashing requirements`);
  if (unknownRemoval) reasons.push('the existing roof covering is not confirmed');
  if (hasMissingScope) reasons.push('some site-specific items still need confirmation');
  return {
    low, high, confidence,
    label: confidence === 'high' ? 'High-confidence indicative range' : confidence === 'medium' ? 'Indicative range' : 'Early indicative range',
    reasons,
  };
}

/** Validate business-supplied rate configuration, not just homeowner input. */
export function validatePricingProfile(profile: PricingProfile): void {
  const nonnegative = (n: number) => Number.isFinite(n) && n >= 0;
  if (!['components', 'area'].includes(profile.mode)) throw new Error('Unknown pricing mode');
  for (const value of Object.values(profile.access)) if (value !== null && !nonnegative(value)) throw new Error('Invalid access rate');
  for (const rate of [profile.removal, ...Object.values(profile.removalByMaterial)]) if (rate && (!nonnegative(rate.perM2) || !nonnegative(rate.disposalPerJob))) throw new Error('Invalid removal rate');
  for (const value of [...Object.values(profile.labourFactors), ...Object.values(profile.areaComplexityFactors)]) if (!Number.isFinite(value) || value < 1) throw new Error('Complexity factors must be at least one');
  for (const factors of Object.values(profile.flatComplexity ?? DEFAULT_FLAT_COMPLEXITY)) if (!Number.isFinite(factors.low) || !Number.isFinite(factors.high) || factors.low < 1 || factors.high < factors.low) throw new Error('Invalid flat complexity allowances');
  for (const rate of Object.values(profile.areaRates)) if (!nonnegative(rate.materialPerM2) || !nonnegative(rate.labourPerM2)) throw new Error('Invalid area rate');
  for (const system of Object.values(profile.systems)) {
    if (!nonnegative(system.minPitch) || !nonnegative(system.maxPitch) || system.maxPitch < system.minPitch) throw new Error('Invalid system pitch limits');
    if (profile.mode === 'components' && !system.areaProducts.length) throw new Error('A component recipe must include an area product');
  }
}

