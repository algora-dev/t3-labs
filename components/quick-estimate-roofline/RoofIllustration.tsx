import { getRoofMesh } from '../../lib/quick-estimate/geometry';
import type { Point3, ShapeId } from '../../lib/quick-estimate/types';

/** A technical SVG projection of the actual measurement template, not a stock image. */
export function RoofIllustration({ shape, pitch = 30, className = '' }: { shape: ShapeId; pitch?: number; className?: string }) {
  const mesh = getRoofMesh(shape);
  const t = shape === 'flat' ? 0 : Math.tan(pitch * Math.PI / 180);
  const project = (p: Point3): [number, number] => [(p[0] - p[1]) * 0.86, (p[0] + p[1]) * 0.65 - (p[2] < 0 ? p[2] : p[2] * t) * 0.75];
  const all = [...mesh.faces.flatMap(f => f.points), ...mesh.walls.flat()];
  const projected = all.map(project);
  const x0 = Math.min(...projected.map(p => p[0])), x1 = Math.max(...projected.map(p => p[0]));
  const y0 = Math.min(...projected.map(p => p[1])), y1 = Math.max(...projected.map(p => p[1]));
  const scale = Math.min(182 / (x1 - x0), 116 / Math.max(y1 - y0, 1));
  const xy = (p: Point3) => { const q = project(p); return `${(100 + (q[0] - (x0 + x1) / 2) * scale).toFixed(2)},${(70 + (q[1] - (y0 + y1) / 2) * scale).toFixed(2)}`; };
  const depth = (points: Point3[]) => points.reduce((s, p) => s + p[0] + p[1], 0) / points.length;
  const walls = mesh.walls.map(points => ({ points, fill: '#eee1e4', wall: true }));
  const planes = new Map<string, { points: Point3[]; loops: Point3[][]; fill: string; wall: boolean; dormer: boolean }>();
  for (const f of mesh.faces) {
    const p = f.points[0];
    const offset = p[2] - f.gradient[0] * p[0] - f.gradient[1] * p[1];
    const key = `${f.gradient.join(',')}:${offset.toFixed(6)}`;
    const fill = shape === 'flat' ? '#a89da0' : f.gradient[0] > 0 ? '#c9576a' : f.gradient[0] < 0 ? '#7a1f28' : f.gradient[1] > 0 ? '#e3a8b0' : '#8a2530';
    const group = planes.get(key) ?? { points: [], loops: [], fill, wall: false, dormer: shape === 'dormer' && f.gradient[0] !== 0 };
    group.points.push(...f.points); group.loops.push(f.points); planes.set(key, group);
  }
  const orderedWalls = walls.map(w => ({ ...w, loops: [w.points] })).sort((a, b) => depth(a.points) - depth(b.points));
  const orderedFaces = [...planes.values()].sort((a, b) => depth(a.points) - depth(b.points));
  const exteriorWalls = orderedWalls.filter(w => w.points.some(p => p[2] < 0));
  const dormerWalls = orderedWalls.filter(w => w.points.every(p => p[2] >= 0));
  const isDormerFace = (f: typeof orderedFaces[number]) => f.dormer;
  const polygons = [...exteriorWalls, ...orderedFaces.filter(f => !isDormerFace(f)), ...dormerWalls, ...orderedFaces.filter(isDormerFace)];
  return <svg viewBox="0 0 200 145" className={`qr-roof-illustration ${className}`} aria-hidden="true" focusable="false">
    <ellipse cx="100" cy="130" rx="67" ry="8" fill="#eee1e4" opacity="0.35" />
    {polygons.map((p, i) => <path key={i} d={p.loops.map(loop => `M${loop.map(xy).join(' L')}Z`).join(' ')} fill={p.fill} stroke={p.fill} strokeWidth="0.6" strokeLinejoin="round" />)}
    {mesh.edges.map((e, i) => <line key={i} x1={xy(e.start).split(',')[0]} y1={xy(e.start).split(',')[1]} x2={xy(e.end).split(',')[0]} y2={xy(e.end).split(',')[1]} stroke={e.kind === 'valley' ? '#fdf5f6' : '#7a1f28'} strokeWidth={e.kind === 'valley' ? 1.6 : 1.05} strokeLinecap="round" />)}
    {shape === 'dormer' && [3, 9].map(x => <polygon key={x} points={([[x - 0.45, 7.01, 1.3], [x + 0.45, 7.01, 1.3], [x + 0.45, 7.01, 2.2], [x - 0.45, 7.01, 2.2]] as Point3[]).map(xy).join(' ')} fill="#fdf5f6" stroke="#8a2530" strokeWidth="0.8" />)}
  </svg>;
}

export function PitchIllustration({ degrees }: { degrees: number }) {
  const top = 88 - 60 * Math.tan(degrees * Math.PI / 180);
  return <svg viewBox="0 0 160 105" aria-hidden="true" className="qr-pitch-illustration">
    <path d={`M20 88 L80 ${top} L140 88 Z`} fill="#f8dde1" stroke="#c8102e" strokeWidth="3" strokeLinejoin="round" />
    <path d="M29 89V101H131V89" fill="none" stroke="#dbb8bd" strokeWidth="2" />
    <path d="M80 89V101" stroke="#dbb8bd" strokeWidth="2" />
  </svg>;
}
