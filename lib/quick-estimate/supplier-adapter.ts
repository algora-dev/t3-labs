import { emptyMeasurementSet } from '../../app/supplier-pricing-tool/types';
import type { GroupKey, MeasurementSet } from '../../app/supplier-pricing-tool/types';
import { edgeLength } from './engine';
import type { MeasurementScenario, RoofEdge } from './types';

const groupFor: Partial<Record<RoofEdge['kind'], GroupKey>> = { ridge: 'ridges', hip: 'hips', valley: 'valleys', verge: 'barges', eaves: 'spouting' };
/** Actual surface values prevent the existing estimator applying pitch twice.
 * Entries keep their roof section association. Nothing is silently priced.
 * High edges, flashings and flat perimeters have no native supplier group;
 * return these explicitly instead of mislabelling them as barges or gutters.
 */
export function toSupplierMeasurements(scenario: MeasurementScenario): { set: MeasurementSet; unmapped: { section: string; kind: RoofEdge['kind']; lengthM: number }[] } {
  const set = emptyMeasurementSet(); set.entryPath = 'actual';
  const unmapped: { section: string; kind: RoofEdge['kind']; lengthM: number }[] = [];
  for (const section of scenario.sections) {
    const roofAreaId = `quick-${section.id}`;
    set.groups.roofAreas.entries.push({ id: roofAreaId, label: `${section.id === 'main' ? 'Main roof' : 'Flat extension'} (${scenario.endpoint} estimate, not surveyed)`, value: section.quantities.roofAreaM2, quantity: 1, pitchDegrees: section.pitchDegrees });
    section.edges.forEach((edge, i) => {
      const group = groupFor[edge.kind]; const lengthM = edgeLength(edge.start, edge.end);
      if (group) set.groups[group].entries.push({ id: `${roofAreaId}-${edge.kind}-${i}`, label: `${section.id} ${edge.kind} ${i + 1} (estimated)`, value: lengthM, quantity: 1, roofAreaId });
      else unmapped.push({ section: section.id, kind: edge.kind, lengthM });
    });
  }
  return { set, unmapped };
}
