import type { ThemeConfig, ComponentSection, RoofComponentDef } from '@roof-takeoff/core';
interface SupplierEnquiryModalProps {
    theme: ThemeConfig;
    supplierSlug?: string | null;
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
    allKeys: string[];
    unitSystem: 'metric' | 'imperial' | 'squares';
    currencySymbol: string;
    onClose: () => void;
}
export declare function SupplierEnquiryModal({ theme, supplierSlug, sections, totals, getComponentById, grandTotal, allKeys, unitSystem, currencySymbol, onClose, }: SupplierEnquiryModalProps): import("react").JSX.Element;
export {};
