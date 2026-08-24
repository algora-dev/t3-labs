import type { ComponentSection, RoofComponentDef, TakeoffCalculation } from './types';
export declare function calculateTakeoffSections(sections: Record<string, ComponentSection>, keys: string[], getComponentById: (id: string | null) => RoofComponentDef | null, includeLabour?: boolean): TakeoffCalculation;
