import type { PricingMode, UnitSystem } from './types';
import type { CustomComponentDef } from './types';
export declare function unitLabel(unit: UnitSystem): string;
export declare function areaUnitLabel(unit: UnitSystem): string;
export declare function resolvePricingModes(pricingModes?: PricingMode[] | null): {
    modes: PricingMode[];
    defaultMode: PricingMode | null;
    hasChoice: boolean;
};
export declare function ratioToDegrees(ratio: string): number;
export declare function degreesToRatio(deg: number, unit: UnitSystem): string;
export declare function componentLabel(kind: string, customDef?: CustomComponentDef): string;
export declare function componentDescription(kind: string, customDef?: CustomComponentDef): string;
