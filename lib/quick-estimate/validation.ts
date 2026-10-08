import { EXTENSION_BANDS, FLAT_COVERINGS, PITCH_BANDS, PITCHED_COVERINGS, SIZE_BANDS } from './config';
import { ROOF_TEMPLATES } from './templates';
import type { QuickEstimateInput } from './types';

export class InputError extends Error {}
export function parseQuickInput(value: unknown): QuickEstimateInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InputError('Expected roof selections');
  const v = value as Record<string, unknown>;
  const keys = ['shape', 'size', 'pitch', 'storeys', 'flatExtension', 'project', 'existingMaterial', 'covering', 'flatCovering', 'flatComplexity'];
  if (Object.keys(v).some(k => !keys.includes(k))) throw new InputError('Only roof selections are accepted, not quantities or prices');
  const has = (o: object, x: unknown) => typeof x === 'string' && Object.hasOwn(o, x);
  if (!has(ROOF_TEMPLATES, v.shape) || !has(SIZE_BANDS, v.size)) throw new InputError('Choose a valid roof shape and property size');
  if (v.storeys !== 1 && v.storeys !== 2) throw new InputError('Choose one or two storeys');
  if (v.project !== 'reroof' && v.project !== 'new_roof') throw new InputError('Choose a replacement roof or a new roof');
  if (v.project === 'reroof' && !(['tile', 'slate', 'metal', 'membrane', 'unknown'] as readonly unknown[]).includes(v.existingMaterial)) throw new InputError('Choose the existing covering or not sure');
  if (v.project === 'new_roof' && v.existingMaterial !== null) throw new InputError('A new roof has no existing covering');
  if (v.flatComplexity !== undefined && !(['simple', 'typical', 'complex'] as readonly unknown[]).includes(v.flatComplexity)) throw new InputError('Choose a valid flat-roof complexity');
  if (v.shape !== 'flat' && v.flatExtension === null && v.flatComplexity !== undefined) throw new InputError('Flat-roof complexity requires a flat roof or extension');
  if (v.shape === 'flat') {
    if (v.pitch !== null || v.flatExtension !== null || v.flatCovering !== null) throw new InputError('A flat main roof does not also need a pitch or flat extension');
    if (!(FLAT_COVERINGS as readonly unknown[]).includes(v.covering)) throw new InputError('Choose a flat-roof covering');
  } else {
    if (!has(PITCH_BANDS, v.pitch)) throw new InputError('Choose a pitch band');
    if (!(PITCHED_COVERINGS as readonly unknown[]).includes(v.covering)) throw new InputError('Choose a pitched-roof covering');
    if (v.flatExtension !== null && !has(EXTENSION_BANDS, v.flatExtension)) throw new InputError('Choose a valid extension size');
    if (v.flatExtension && !(FLAT_COVERINGS as readonly unknown[]).includes(v.flatCovering)) throw new InputError('Choose a covering for the flat extension');
    if (v.flatExtension === null && v.flatCovering !== null) throw new InputError('No flat covering is needed without an extension');
  }
  return { shape: v.shape, size: v.size, pitch: v.pitch, storeys: v.storeys, flatExtension: v.flatExtension, project: v.project, existingMaterial: v.existingMaterial, covering: v.covering, flatCovering: v.flatCovering, ...((v.shape === 'flat' || v.flatExtension) ? { flatComplexity: v.flatComplexity ?? 'typical' } : {}) } as QuickEstimateInput;
}
