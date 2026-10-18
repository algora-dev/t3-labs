import type { ExtensionSizeId, PitchId, SizeId } from './types';

export const MODEL_VERSION = 'quick-roof-1.1';
/** Agreed horizontal roof footprint, including overhangs, NOT total internal floor area. */
export const SIZE_BANDS: Record<SizeId, { label: string; min: number; max: number }> = {
  small: { label: 'Small', min: 60, max: 100 },
  small_medium: { label: 'Small to medium', min: 100, max: 150 },
  medium: { label: 'Medium', min: 150, max: 190 },
  medium_large: { label: 'Medium to large', min: 190, max: 250 },
  large: { label: 'Large', min: 250, max: 300 },
};
export const PITCH_BANDS: Record<PitchId, { label: string; min: number; max: number; description: string }> = {
  low: { label: 'Low', min: 5, max: 15, description: 'A gentle slope' },
  typical: { label: 'Typical', min: 15, max: 30, description: 'A noticeable slope' },
  steep: { label: 'Steep', min: 30, max: 50, description: 'A tall, pronounced slope' },
};
/** Provisional demo assumptions, not user-approved housing benchmarks. */
export const EXTENSION_BANDS: Record<ExtensionSizeId, { label: string; min: number; max: number }> = {
  small: { label: 'Small extension', min: 10, max: 20 },
  medium: { label: 'Medium extension', min: 20, max: 35 },
  large: { label: 'Large extension', min: 35, max: 50 },
};
export const REFERENCE_ACCESS_HEIGHT_M = { 1: 3, 2: 6 } as const;
export const FLAT_COVERINGS = ['epdm', 'grp', 'felt'] as const;
export const PITCHED_COVERINGS = ['tile', 'slate', 'shingle', 'pressed_metal', 'longrun', 'everest_tray'] as const;
