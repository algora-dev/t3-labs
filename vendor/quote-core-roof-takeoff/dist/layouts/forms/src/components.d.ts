import type { ThemeConfig, MeasureMode, UnitSystem, Entry, ComponentSection, RoofComponentDef, TakeoffCapabilities } from '@roof-takeoff/core';
export declare function StepContainer({ title, subtitle, children, stepLabel }: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    stepLabel?: string;
}): import("react").JSX.Element;
export declare function StepNav({ theme, onBack, onNext, nextLabel, nextDisabled, onSkip }: {
    theme: ThemeConfig;
    onBack: () => void;
    onNext: () => void;
    nextLabel?: string;
    nextDisabled?: boolean;
    onSkip?: () => void;
}): import("react").JSX.Element;
export declare function BigChoiceCard({ theme, onClick, title, description, icon }: {
    theme: ThemeConfig;
    onClick: () => void;
    title: string;
    description: string;
    icon: 'check' | 'plan';
}): import("react").JSX.Element;
export declare function PitchInput({ theme, masterPitch, masterRatio, unitSystem, onUpdateDegrees, onUpdateRatio }: {
    theme: ThemeConfig;
    masterPitch: string;
    masterRatio: string;
    unitSystem: UnitSystem;
    onUpdateDegrees: (val: string) => void;
    onUpdateRatio: (val: string) => void;
}): import("react").JSX.Element;
export declare function ComponentStep({ theme, kind, section, measureMode, lenLbl, areaLbl, availableComponents, pitchDegrees, unitSystem, currencySymbol, total, roofAreaTotal, onAddEntry, onRemoveEntry, onUpdateWaste, stepNumber, totalSteps, onBack, onNext, nextLabel, capabilities }: {
    theme: ThemeConfig;
    kind: string;
    section: ComponentSection;
    measureMode: MeasureMode;
    lenLbl: string;
    areaLbl: string;
    availableComponents: RoofComponentDef[];
    pitchDegrees: number;
    unitSystem: UnitSystem;
    currencySymbol: string;
    total: {
        rawTotal: number;
        withWaste: number;
        count: number;
        totalCost: number;
    };
    roofAreaTotal?: number | null;
    onAddEntry: (entry: Entry) => void;
    onRemoveEntry: (entryId: string) => void;
    onUpdateWaste: (waste: number) => void;
    stepNumber: number;
    totalSteps: number;
    onBack: () => void;
    onNext: () => void;
    capabilities?: TakeoffCapabilities;
    nextLabel?: string;
}): import("react").JSX.Element;
export declare function ReviewStep({ theme, sections, totals, allKeys, lenLbl, areaLbl, cur, grandTotal, hasData, stepNumber, totalSteps, onBack, onGenerate, onRemoveEntry }: {
    theme: ThemeConfig;
    sections: Record<string, ComponentSection>;
    totals: Record<string, {
        rawTotal: number;
        withWaste: number;
        count: number;
        materialCost: number;
        labourCost: number;
        totalCost: number;
    }>;
    allKeys: string[];
    lenLbl: string;
    areaLbl: string;
    cur: string;
    grandTotal: number;
    hasData: boolean;
    stepNumber: number;
    totalSteps: number;
    onBack: () => void;
    onGenerate: () => void;
    onRemoveEntry: (key: string, entryId: string) => void;
}): import("react").JSX.Element;
