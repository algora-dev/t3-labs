import { measureRoof } from './engine';
import { toSupplierMeasurements } from './supplier-adapter';
import { parseQuickInput } from './validation';
import type { QuickEstimateInput } from './types';

export const HANDOFF_KEY = 'apex.quick-roof.handoff.v1';
export interface QuickHandoff { version: 1; input: QuickEstimateInput; endpoint: 'low' | 'high'; createdAt: number }
export function createHandoff(input: QuickEstimateInput, endpoint: 'low' | 'high'): QuickHandoff {
  return { version: 1, input: parseQuickInput(input), endpoint, createdAt: Date.now() };
}
export function resolveHandoff(value: unknown) {
  if (!value || typeof value !== 'object') throw new Error('Invalid handoff');
  const p = value as QuickHandoff;
  if (p.version !== 1 || !['low', 'high'].includes(p.endpoint) || !Number.isFinite(p.createdAt) || p.createdAt > Date.now() + 60000 || Date.now() - p.createdAt > 86400000) throw new Error('This estimate handoff has expired');
  const input = parseQuickInput(p.input);
  const measurement = measureRoof(input)[p.endpoint];
  return { input, endpoint: p.endpoint, ...toSupplierMeasurements(measurement) };
}
