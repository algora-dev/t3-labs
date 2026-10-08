import type { Plane, RoofBlock, RoofTemplate, ShapeId } from './types';

type Bounds = RoofBlock['bounds'];
function block(bounds: Bounds, axis: 'x' | 'y' | 'hip' | 'mono' | 'flat', caps: Plane[] = [], lift = 0): RoofBlock {
  const [x0, y0, x1, y1] = bounds;
  const x = [{ a: 1, b: 0, c: -x0 + lift }, { a: -1, b: 0, c: x1 + lift }];
  const y = [{ a: 0, b: 1, c: -y0 + lift }, { a: 0, b: -1, c: y1 + lift }];
  const planes = axis === 'flat' ? [{ a: 0, b: 0, c: 0 }]
    : axis === 'mono' ? [y[0]] : axis === 'hip' ? [...x, ...y] : axis === 'x' ? x : y;
  return { bounds, planes: [...planes, ...caps] };
}

/** Representative, dimensionally coherent roofs. Not a survey of the visitor's house.
 * Capped intersecting volumes produce actual hips and valleys rather than decorative lines.
 * The same plane definitions drive the selectable illustrations and the quantity engine.
 */
export const ROOF_TEMPLATES: Record<ShapeId, RoofTemplate> = {
  mono: {
    id: 'mono', label: 'Single slope', description: 'One roof surface, sloping in one direction', complexity: 'simple', dormerCount: 0,
    blocks: [block([0, 0, 10, 6], 'mono')],
    note: 'A pitched single-slope roof, not a flat membrane roof. High-edge detailing is separate.',
  },
  gable: {
    id: 'gable', label: 'Simple gable', description: 'Two slopes meeting along one ridge', complexity: 'simple', dormerCount: 0,
    blocks: [block([0, 0, 10, 6], 'y')],
  },
  hip: {
    id: 'hip', label: 'Hipped roof', description: 'Slopes on all four sides', complexity: 'moderate', dormerCount: 0,
    blocks: [block([0, 0, 10, 6], 'hip')],
  },
  l_gable: {
    id: 'l_gable', label: 'L-shaped roof', description: 'Two wings meeting around a corner', complexity: 'moderate', dormerCount: 0,
    blocks: [block([0, 0, 10, 6], 'y', [{ a: -1, b: 0, c: 10 }]), block([4, 0, 10, 10], 'x', [{ a: 0, b: 1, c: 0 }])],
  },
  t_gable: {
    id: 't_gable', label: 'T-shaped roof', description: 'A main roof with a projecting gable', complexity: 'moderate', dormerCount: 0,
    blocks: [block([0, 0, 12, 6], 'y'), block([3, 0, 9, 10], 'x', [{ a: 0, b: 1, c: 0 }])],
  },
  l_hip: {
    id: 'l_hip', label: 'Hip and valley', description: 'Joined wings with sloping ends', complexity: 'complex', dormerCount: 0,
    blocks: [block([0, 0, 10, 6], 'hip'), block([4, 0, 10, 10], 'hip')],
  },
  u_gable: {
    id: 'u_gable', label: 'U-shaped roof', description: 'Two wings and a recessed centre', complexity: 'complex', dormerCount: 0,
    blocks: [block([0, 0, 14, 6], 'hip'), block([0, 0, 6, 12], 'x', [{ a: 0, b: 1, c: 0 }]), block([8, 0, 14, 12], 'x', [{ a: 0, b: 1, c: 0 }])],
  },
  dormer: {
    id: 'dormer', label: 'Roof with dormers', description: 'Windows projecting out of the roof', complexity: 'complex', dormerCount: 2,
    blocks: [block([0, 0, 12, 8], 'y'), block([2, 4, 4, 7], 'x', [], 2), block([8, 4, 10, 7], 'x', [], 2)],
    note: 'Two representative dormers are included. Dormer windows, cheek cladding and structural alterations are not measured.',
  },
  complex: {
    id: 'complex', label: 'Multiple roof sections', description: 'Several ridges, hips and valleys', complexity: 'complex', dormerCount: 0,
    blocks: [block([0, 0, 14, 8], 'hip'), block([8, 0, 14, 13], 'hip'), block([2, -4, 6, 4], 'x', [{ a: 0, b: -1, c: 4 }])],
    note: 'One representative multi-section layout. Unusual junctions and different pitches need a measured estimate.',
  },
  flat: {
    id: 'flat', label: 'Flat membrane roof', description: 'A nearly level roof with a waterproof covering', complexity: 'simple', dormerCount: 0,
    blocks: [block([0, 0, 10, 6], 'flat')],
    note: 'Plan area used for the membrane surface. Falls, upstands, outlets, insulation and decking require specification.',
  },
};
export const PITCHED_SHAPES = Object.values(ROOF_TEMPLATES).filter(t => t.id !== 'flat');
