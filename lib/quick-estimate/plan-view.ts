import { SIZE_BANDS } from './config';
import { getRoofMesh } from './geometry';
import type { EdgeKind, Point2, Point3, ShapeId, SizeId } from './types';

export const PLAN_VIEWBOX = { width: 160, height: 112 } as const;
export interface RoofPlanView {
  shape: ShapeId;
  size: SizeId;
  /** Visual area is proportional to the midpoint of the footprint band. */
  relativeScale: number;
  faces: { path: string; tone: 'light' | 'mid' | 'dark' }[];
  edges: { kind: EdgeKind; start: Point2; end: Point2 }[];
  slopeArrow: [Point2, Point2] | null;
}

/** Presentation only: top-down x/y projection of the existing roof mesh.
 * The illustration never feeds back into measurement or pricing calculations.
 * Coplanar cells share a path, so technical partition seams aren't drawn.
 */
export function getRoofPlanView(shape: ShapeId, size: SizeId): RoofPlanView {
  if (!Object.hasOwn(SIZE_BANDS, size)) throw new Error('Unknown footprint size');
  const mesh = getRoofMesh(shape);
  const points = mesh.faces.flatMap(f => f.points);
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = Math.min(...ys), y1 = Math.max(...ys);
  const centre: Point2 = [(x0 + x1) / 2, (y0 + y1) / 2];
  const band = SIZE_BANDS[size];
  const maxMidpoint = Math.max(...Object.values(SIZE_BANDS).map(b => (b.min + b.max) / 2));
  const relativeScale = Math.sqrt(((band.min + band.max) / 2) / maxMidpoint);
  const scale = Math.min(136 / (x1 - x0), 88 / (y1 - y0)) * relativeScale;
  const project = (p: Point2 | Point3): Point2 => [
    PLAN_VIEWBOX.width / 2 + (p[0] - centre[0]) * scale,
    PLAN_VIEWBOX.height / 2 + (p[1] - centre[1]) * scale,
  ];
  const xy = (p: Point2 | Point3) => project(p).map(v => v.toFixed(3)).join(',');
  const planes = new Map<string, RoofPlanView['faces'][number]>();
  for (const f of mesh.faces) {
    const p = f.points[0];
    const offset = p[2] - f.gradient[0] * p[0] - f.gradient[1] * p[1];
    const key = `${f.gradient.join(',')}:${offset.toFixed(6)}`;
    const tone = shape === 'flat' ? 'mid' : f.gradient[0] > 0 || f.gradient[1] < 0 ? 'light' : f.gradient[0] < 0 ? 'dark' : 'mid';
    const face = planes.get(key) ?? { path: '', tone };
    face.path += `M${f.points.map(xy).join('L')}Z`;
    planes.set(key, face);
  }
  return {
    shape, size, relativeScale, faces: [...planes.values()],
    edges: mesh.edges.map(e => ({ kind: e.kind, start: project(e.start), end: project(e.end) })),
    // Direction cue for a single-slope roof; flat roofs have no invented features.
    slopeArrow: shape === 'mono' ? [project([centre[0], y1 - (y1 - y0) * .28]), project([centre[0], y0 + (y1 - y0) * .28])] : null,
  };
}
