import type { ThemeConfig, MeasureMode, UnitSystem, Entry, RoofComponentDef, CustomComponentDef, TakeoffCapabilities } from '@roof-takeoff/core';
export declare function InfoIcon({ text, color }: {
    text: string;
    color?: string;
}): import("react").JSX.Element;
export declare function ComponentSymbol({ kind, customDef, className, color }: {
    kind: string;
    customDef?: CustomComponentDef;
    className?: string;
    color?: string;
}): import("react").JSX.Element;
export declare function AddEntryForm({ theme, kind, customDef, measureMode, lenLabel, areaLabel, availableComponents, pitchDegrees, unitSystem, roofAreaTotal, onAdd, capabilities }: {
    theme: ThemeConfig;
    kind: string;
    customDef?: CustomComponentDef;
    measureMode: MeasureMode;
    lenLabel: string;
    areaLabel: string;
    availableComponents: RoofComponentDef[];
    pitchDegrees: number;
    unitSystem: UnitSystem;
    roofAreaTotal: number | null;
    onAdd: (entry: Entry) => void;
    capabilities?: TakeoffCapabilities;
}): import("react").JSX.Element;
export declare function EntryListItem({ entry, index, kind, customDef, measureMode, lenLabel, areaLabel, wastePercent, onRemove }: {
    entry: Entry;
    index: number;
    kind: string;
    customDef?: CustomComponentDef;
    measureMode: MeasureMode;
    lenLabel: string;
    areaLabel: string;
    wastePercent: number;
    onRemove: () => void;
}): import("react").JSX.Element;
export declare function CustomComponentCreator({ theme, onCreate }: {
    theme: ThemeConfig;
    onCreate: (def: CustomComponentDef) => void;
}): import("react").JSX.Element;
