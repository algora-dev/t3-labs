import fs from 'fs';
import path from 'path';

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
}

export interface PerimeterRatios {
  ridgeLmPerSqm: number;
  valleyLmPerSqm: number;
  hipLmPerSqm: number;
  gutterLmPerSqm: number;
}

let cached: EstimateRules | null = null;

export function getEstimateRules(): EstimateRules {
  if (!cached) {
    const raw = fs.readFileSync(
      path.join(process.cwd(), 'data', 'apex-roofing', 'estimate-rules.json'),
      'utf-8'
    );
    cached = JSON.parse(raw) as EstimateRules;
  }
  return cached;
}
