import { EXTENSION_BANDS, MODEL_VERSION, PITCH_BANDS, REFERENCE_ACCESS_HEIGHT_M, SIZE_BANDS } from './config';
import { getRoofMesh } from './geometry';
import { ROOF_TEMPLATES } from './templates';
import type { EdgeKind, MeasurementInput, MeasurementRange, MeasurementScenario, Point3, Quantities, RoofSection, ShapeId } from './types';

const quantityKeys = ['footprintM2', 'roofAreaM2', 'ridgeM', 'hipM', 'valleyM', 'vergeM', 'eavesM', 'highEdgeM', 'flashingM', 'flatEdgeM', 'dormerCount'] as const;
const edgeQuantity: Record<EdgeKind, keyof Quantities> = { ridge: 'ridgeM', hip: 'hipM', valley: 'valleyM', verge: 'vergeM', eaves: 'eavesM', high_edge: 'highEdgeM', flashing: 'flashingM', flat_edge: 'flatEdgeM' };
export const emptyQuantities = (): Quantities => Object.fromEntries(quantityKeys.map(k => [k, 0])) as unknown as Quantities;
export function edgeLength(start: Point3, end: Point3): number { return Math.hypot(...start.map((v, i) => v - end[i])); }

export function measureSection(shape: ShapeId, footprintM2: number, pitchDegrees: number, id: RoofSection['id'] = 'main'): RoofSection {
  if (!Number.isFinite(footprintM2) || footprintM2 <= 0) throw new Error('Footprint must be positive and finite');
  if (!Number.isFinite(pitchDegrees) || pitchDegrees < 0 || pitchDegrees > 50) throw new Error('Pitch is outside this model');
  if (shape === 'flat' && pitchDegrees !== 0) throw new Error('Flat roofs use plan area without pitched conversion');
  const mesh = getRoofMesh(shape);
  const scale = Math.sqrt(footprintM2 / mesh.footprintM2);
  const tan = Math.tan(pitchDegrees * Math.PI / 180);
  const convert = (p: Point3): Point3 => [p[0] * scale, p[1] * scale, p[2] * scale * tan];
  const edges = mesh.edges.map(e => ({ kind: e.kind, start: convert(e.start), end: convert(e.end) }));
  const q = emptyQuantities(); q.footprintM2 = footprintM2;
  q.roofAreaM2 = mesh.faces.reduce((s, f) => s + f.planArea * scale * scale * Math.sqrt(1 + tan * tan * (f.gradient[0] ** 2 + f.gradient[1] ** 2)), 0);
  for (const e of edges) q[edgeQuantity[e.kind]] += edgeLength(e.start, e.end);
  q.dormerCount = ROOF_TEMPLATES[shape].dormerCount;
  const points = mesh.faces.flatMap(f => f.points);
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  return { id, shape, pitchDegrees, scale, dimensions: { lengthM: (Math.max(...xs) - Math.min(...xs)) * scale, widthM: (Math.max(...ys) - Math.min(...ys)) * scale }, quantities: q, edges };
}

export function measureRoof(input: MeasurementInput): MeasurementRange {
  if (!Object.hasOwn(ROOF_TEMPLATES, input.shape)) throw new Error('Choose a valid roof shape');
  if (input.storeys !== 1 && input.storeys !== 2) throw new Error('Choose one or two storeys');
  if (input.shape !== 'flat' && input.exactPitchDegrees === undefined && (!input.pitch || !Object.hasOwn(PITCH_BANDS, input.pitch))) throw new Error('Choose a pitch band, or enter the actual pitch');
  if (input.shape === 'flat' && (input.pitch !== null || input.flatExtension !== null)) throw new Error('A flat roof has no pitched band or separate flat extension');
  if (input.flatExtension !== null && !Object.hasOwn(EXTENSION_BANDS, input.flatExtension)) throw new Error('Choose a valid extension size');
  const exactRoofArea = input.exactRoofAreaM2;
  const size = input.size != null && Object.hasOwn(SIZE_BANDS, input.size) ? SIZE_BANDS[input.size] : undefined;
  if (!size && exactRoofArea === undefined) throw new Error('Choose a property size, or enter the actual roof area');
  if (exactRoofArea !== undefined && (!Number.isFinite(exactRoofArea) || exactRoofArea < 20 || exactRoofArea > 1200)) throw new Error('Exact roof area is outside this model');
  const exactPitch = input.exactPitchDegrees;
  if (exactPitch !== undefined && (!Number.isFinite(exactPitch) || exactPitch < 0 || exactPitch > 50)) throw new Error('Exact pitch is outside this model');
  if (input.shape === 'flat' && exactPitch !== undefined && exactPitch !== 0) throw new Error('Flat roofs use a zero-degree pitch in this model');
  const pitch = input.shape === 'flat'
    ? { min: 0, max: 0 }
    : exactPitch !== undefined ? { min: exactPitch, max: exactPitch } : PITCH_BANDS[input.pitch!];
  const scenario = (endpoint: 'low' | 'high'): MeasurementScenario => {
    const key = endpoint === 'low' ? 'min' : 'max';
    const pitchDegrees = pitch[key];
    // When the visitor knows the actual sloped roof area, scale the selected
    // roof template so its modelled surface area equals that supplied area.
    // Using the template's own area ratio keeps this exact for hips/valleys and
    // other geometry rather than assuming every face has a simple cosine ratio.
    const roofAreaPerFootprint = exactRoofArea !== undefined && input.shape !== 'flat'
      ? measureSection(input.shape, 1, pitchDegrees).quantities.roofAreaM2
      : 1;
    const footprint = exactRoofArea !== undefined
      ? exactRoofArea / roofAreaPerFootprint
      : size![key];
    const sections = [measureSection(input.shape, footprint, pitchDegrees)];
    if (input.flatExtension) sections.push(measureSection('flat', EXTENSION_BANDS[input.flatExtension][key], 0, 'extension'));
    const totals = emptyQuantities();
    for (const section of sections) for (const k of quantityKeys) totals[k] += section.quantities[k];
    return { endpoint, sections, totals, access: { mainStoreys: input.storeys, extensionStoreys: input.flatExtension ? 1 : null, referenceHeightM: REFERENCE_ACCESS_HEIGHT_M[input.storeys] } };
  };
  return {
    schemaVersion: 'quick-roof/v1', modelVersion: MODEL_VERSION, source: 'estimated_geometry', input: { ...input },
    low: scenario('low'), high: scenario('high'),
    assumptions: [
      'Size means horizontal roof footprint, including overhangs, not combined upstairs and downstairs floor area.',
      exactRoofArea !== undefined
        ? `The main roof uses the supplied ${exactRoofArea} m² sloped roof area rather than the selected size band.`
        : 'Each endpoint is a complete roof: minimum footprint and pitch, or maximum footprint and pitch, at a fixed template aspect ratio.',
      exactPitch !== undefined
        ? `The main roof uses the supplied ${exactPitch}° pitch rather than the selected pitch band.`
        : 'The selected pitch band is used to model the lower and upper scenarios.',
      'Roof slope is applied exactly once. Lengths scale with dimensions, not in direct proportion to area.',
      'These are representative modelled quantities, not measured survey dimensions or statistically guaranteed bounds.',
      'The same selected pitch is used on all pitched faces, including representative dormers.',
      'Storeys change access information only. They do not increase roof material quantities.',
      ...(input.flatExtension ? ['The optional flat extension is extra to the main footprint and assumed single-storey. Its provisional size bands are 10-20, 20-35 and 35-50 m².', 'Main roof eaves remain gross: the shared extension junction has not been deducted or detailed.'] : []),
      ...(ROOF_TEMPLATES[input.shape].note ? [ROOF_TEMPLATES[input.shape].note!] : []),
    ],
    exclusions: ['Waste, laps and product packaging are pricing-layer allowances, not geometry.', 'No structural timber, rooflights, chimneys, drainage design, hazardous-material work or measured site access is inferred.'],
  };
}
