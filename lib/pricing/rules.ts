import fs from 'fs';
import path from 'path';
import { BUSINESS_SLUG } from '../assistant/data';

/** Server-side loader for estimate-rules.json (deterministic estimate rules). */

export interface EstimateRules {
  version: string;
  defaultPitchDegrees: number;
  pitchPresets: Record<string, number>;
  wasteFactorPct: number;
  perimeterHeuristics: {
    comment: string;
    gable: PerimeterRatios;
    hip: PerimeterRatios;
    valley_complex: PerimeterRatios;
    flat: PerimeterRatios;
  };
  defaultDownpipesPerGutterLm: number;
  defaultMaterial: string;
  rounding: {
    rule: string;
    perLine: number;
    quantityStepArea: number;
    quantityStepLinear: number;
  };
  disclaimer: string;
  standardAssumptions: string[];
  v4?: V4Rules;
}

export interface PerimeterRatios {
  ridgeLmPerSqm: number;
  valleyLmPerSqm: number;
  hipLmPerSqm: number;
  gutterLmPerSqm: number;
}

export type SizeBandId = 'small' | 'medium' | 'large';
export type PitchBandId = 'flat' | 'medium' | 'steep';

export interface SizeBand {
  label: string;
  minM2: number;
  maxM2: number;
}

export interface PitchBand {
  label: string;
  minDegrees: number;
  maxDegrees: number;
  representativeDegrees: number;
}

export interface V4Rules {
  comment: string;
  reroofAllowances: {
    stripRatePerM2: number;
    stripLabel: string;
    disposalAllowancePerJob: number;
    disposalLabel: string;
    assumptionNote: string;
  };
  sizeBands: Record<SizeBandId, SizeBand>;
  pitchBands: Record<PitchBandId, PitchBand>;
}

export function getV4Rules(): V4Rules {
  const rules = getEstimateRules();
  if (!rules.v4) throw new Error('estimate-rules.json is missing the v4 guided-estimator configuration');
  return rules.v4;
}

let cached: EstimateRules | null = null;

export function getEstimateRules(): EstimateRules {
  if (!cached) {
    const raw = fs.readFileSync(
      path.join(process.cwd(), 'data', BUSINESS_SLUG, 'estimate-rules.json'),
      'utf-8'
    );
    cached = JSON.parse(raw) as EstimateRules;
  }
  return cached;
}
