import { emptyMeasurementSet } from '../../app/supplier-pricing-tool/types';
import type { GroupKey, MeasurementSet, SupplierProduct } from '../../app/supplier-pricing-tool/types';
import { apexPricingProfile } from '../quick-estimate/apex-profile';
import type { QuickEstimateInput } from '../quick-estimate/types';
export const QUICK_DEMO_INPUT: QuickEstimateInput = {
  shape: 'gable', size: 'small', pitch: 'typical', storeys: 1, flatExtension: null,
  project: 'reroof', existingMaterial: 'tile', covering: 'tile', flatCovering: null,
};
/** These are coordinates on the deliberately simple training drawing, not a survey. */
export const SAMPLE_CORNERS = [
  { x: 100, y: 90 }, { x: 600, y: 90 }, { x: 600, y: 490 }, { x: 100, y: 490 },
] as const;
export const SAMPLE_METRES_PER_PIXEL = 0.02;
export const SAMPLE_PITCH_DEGREES = 30;
export function tracedPlanArea(corners: readonly number[]): number {
  if (corners.length !== 4 || corners.some((id, i) => id !== i)) throw new Error('Select the four corners in order');
  const twiceArea = SAMPLE_CORNERS.reduce((sum, p, i) => {
    const next = SAMPLE_CORNERS[(i + 1) % SAMPLE_CORNERS.length];
    return sum + p.x * next.y - next.x * p.y;
  }, 0);
  return Math.abs(twiceArea / 2) * SAMPLE_METRES_PER_PIXEL ** 2;
}
/** Apply existing catalogue recipes, not a second price table. The detailed example
 *  intentionally prices selected components, not the Quick Estimate's access/removal scope. */
export function applyDemoRecipe(source: MeasurementSet, catalog: SupplierProduct[], covering: 'tile' | 'slate' = 'tile'): MeasurementSet {
  const set = structuredClone(source);
  const recipe = apexPricingProfile({ perM2: 22, disposalPerJob: 0 }, {}).systems[covering]!;
  const byId = new Map(catalog.map(product => [product.id, product]));
  const assignments: [GroupKey, string][] = [
    ...recipe.areaProducts.map(id => ['roofAreas', id] as [GroupKey, string]),
    ...Object.entries(recipe.components).map(([group, id]) => [group, id] as [GroupKey, string]),
  ];
  set.appliedProducts = assignments.filter(([group]) => set.groups[group]?.entries.length).map(([groupKey, productId]) => {
    const p = byId.get(productId);
    if (!p) throw new Error(`Demo recipe product missing: ${productId}`);
    return { id: `demo-${groupKey}-${productId}`, groupKey, productId, entryId: null,
      wastePct: p.defaultWastePct, wasteFlat: p.defaultWasteFlat ?? 0, wasteMode: p.defaultWasteMode ?? 'percent',
      labourRate: p.defaultLabourRate, qtyOverride: null, priceOverride: null };
  });
  return set;
}
export function createDemoMeasurements(catalog: SupplierProduct[], covering: 'tile' | 'slate' = 'tile'): MeasurementSet {
  const set = emptyMeasurementSet();
  set.entryPath = 'actual';
  set.groups.roofAreas.entries = [{ id: 'demo-roof', label: 'Example gable roof (actual surface)', value: 120, quantity: 1, pitchDegrees: 30 }];
  set.groups.ridges.entries = [{ id: 'demo-ridge', label: 'Example ridge', value: 10, quantity: 1, roofAreaId: 'demo-roof' }];
  set.groups.barges.entries = [{ id: 'demo-barges', label: 'Four example gable edges', value: 6, quantity: 4, roofAreaId: 'demo-roof' }];
  return applyDemoRecipe(set, catalog, covering);
}
export function createSamplePlanMeasurements(corners: readonly number[]): MeasurementSet {
  const set = emptyMeasurementSet();
  set.entryPath = 'plan';
  set.groups.roofAreas.pitchDegrees = SAMPLE_PITCH_DEGREES;
  set.groups.roofAreas.entries = [{ id: 'training-roof', label: 'Traced training plan', value: tracedPlanArea(corners), quantity: 1, pitchDegrees: SAMPLE_PITCH_DEGREES }];
  // Ridge and four barge runs are identified on the sample drawing, not AI-detected.
  set.groups.ridges.entries = [{ id: 'training-ridge', label: 'Sample ridge (pre-identified)', value: 10, quantity: 1, roofAreaId: 'training-roof' }];
  set.groups.barges.entries = [{ id: 'training-barges', label: 'Sample barge runs (pre-identified)', value: 4, quantity: 4, roofAreaId: 'training-roof' }];
  return set;
}
