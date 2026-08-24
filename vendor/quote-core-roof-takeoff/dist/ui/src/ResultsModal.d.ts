import type { ThemeConfig, ComponentSection, RoofComponentDef } from '@roof-takeoff/core';
interface ResultsModalProps {
    sections: Record<string, ComponentSection>;
    totals: Record<string, {
        rawTotal: number;
        withWaste: number;
        count: number;
        materialCost: number;
        labourCost: number;
        totalCost: number;
    }>;
    getComponentById: (id: string | null) => RoofComponentDef | null;
    grandTotal: number;
    unitSystem: 'metric' | 'imperial' | 'squares';
    allKeys: string[];
    currencySymbol: string;
    theme: ThemeConfig;
    supplierSlug?: string | null;
    onClose: () => void;
    onEdit: () => void;
}
export declare function ResultsModal({ sections, totals, getComponentById, grandTotal, unitSystem, allKeys, currencySymbol, theme, supplierSlug, onClose, onEdit }: ResultsModalProps): import("react").JSX.Element;
export {};
