/** Price-independent roof geometry. All lengths are metres and areas square metres. */
export type SizeId = 'small' | 'small_medium' | 'medium' | 'medium_large' | 'large';
export type PitchId = 'low' | 'typical' | 'steep';
export type ShapeId = 'mono' | 'gable' | 'hip' | 'l_gable' | 't_gable' | 'l_hip' | 'u_gable' | 'dormer' | 'complex' | 'flat';
export type ExistingMaterial = 'tile' | 'slate' | 'metal' | 'membrane' | 'unknown';
export type CoveringId = 'tile' | 'slate' | 'metal' | 'shingle' | 'pressed_metal' | 'longrun' | 'epdm' | 'grp' | 'felt';
export type ExtensionSizeId = 'small' | 'medium' | 'large';
export type FlatComplexity = 'simple' | 'typical' | 'complex';
export type Point2 = readonly [number, number];
export type Point3 = readonly [number, number, number];
/** h(x,y) = a*x + b*y + c, expressed in horizontal rise-run units. */
export interface Plane { a: number; b: number; c: number }
export interface RoofBlock { bounds: readonly [number, number, number, number]; planes: Plane[] }
export type EdgeKind = 'ridge' | 'hip' | 'valley' | 'verge' | 'eaves' | 'high_edge' | 'flashing' | 'flat_edge';
export interface RoofFace { points: Point3[]; gradient: Point2; planArea: number }
export interface RoofEdge { kind: EdgeKind; start: Point3; end: Point3 }
export interface RoofMesh { faces: RoofFace[]; edges: RoofEdge[]; walls: Point3[][]; footprintM2: number }
export interface RoofTemplate {
  id: ShapeId; label: string; description: string; complexity: 'simple' | 'moderate' | 'complex';
  blocks: RoofBlock[]; dormerCount: number; note?: string;
}
export interface MeasurementInput {
  shape: ShapeId; size: SizeId; pitch: PitchId | null; storeys: 1 | 2;
  flatExtension: ExtensionSizeId | null;
  /** Optional measured sloped roof area. When supplied it replaces the size band for pricing geometry. */
  exactRoofAreaM2?: number;
  /** Optional measured roof pitch. When supplied it replaces the pitch band. */
  exactPitchDegrees?: number;
}
export interface QuickEstimateInput extends MeasurementInput {
  project: 'reroof' | 'new_roof'; existingMaterial: ExistingMaterial | null;
  covering: CoveringId; flatCovering: CoveringId | null;
  /** Defaults to typical for older saved drafts and API callers. */
  flatComplexity?: FlatComplexity;
}
export interface Quantities {
  footprintM2: number; roofAreaM2: number; ridgeM: number; hipM: number; valleyM: number;
  vergeM: number; eavesM: number; highEdgeM: number; flashingM: number; flatEdgeM: number;
  dormerCount: number;
}
export interface RoofSection {
  id: 'main' | 'extension'; shape: ShapeId; pitchDegrees: number; scale: number;
  dimensions: { lengthM: number; widthM: number }; quantities: Quantities;
  edges: RoofEdge[];
}
export interface MeasurementScenario {
  endpoint: 'low' | 'high'; sections: RoofSection[]; totals: Quantities;
  access: { mainStoreys: 1 | 2; extensionStoreys: 1 | null; referenceHeightM: number };
}
export interface MeasurementRange {
  schemaVersion: 'quick-roof/v1'; modelVersion: string; source: 'estimated_geometry';
  input: MeasurementInput; low: MeasurementScenario; high: MeasurementScenario;
  assumptions: string[]; exclusions: string[];
}
