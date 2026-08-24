import type { ThemeConfig, MeasureMode, RoofComponentDef, PricingMode, LayoutChoice, TakeoffCapabilities, TakeoffPrefill } from '@roof-takeoff/core';
interface ClassicLayoutProps {
    theme: ThemeConfig;
    components: RoofComponentDef[];
    initialMeasureMode?: MeasureMode | null;
    pricingMode?: PricingMode | null;
    capabilities?: TakeoffCapabilities;
    prefill?: TakeoffPrefill | null;
    onSwitchLayout?: (choice: LayoutChoice) => void;
}
export declare function ClassicLayout({ theme, components, initialMeasureMode, pricingMode, capabilities, prefill, onSwitchLayout }: ClassicLayoutProps): import("react").JSX.Element;
export {};
