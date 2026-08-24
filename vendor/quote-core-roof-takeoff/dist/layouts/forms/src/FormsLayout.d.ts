import type { ThemeConfig, MeasureMode, RoofComponentDef, PricingMode, LayoutChoice, TakeoffCapabilities, TakeoffPrefill } from '@roof-takeoff/core';
interface FormsLayoutProps {
    theme: ThemeConfig;
    components: RoofComponentDef[];
    initialMeasureMode?: MeasureMode | null;
    pricingMode?: PricingMode | null;
    onSwitchLayout?: (choice: LayoutChoice) => void;
    capabilities?: TakeoffCapabilities;
    prefill?: TakeoffPrefill | null;
}
export declare function FormsLayout({ theme, components, initialMeasureMode, pricingMode, onSwitchLayout, capabilities, prefill }: FormsLayoutProps): import("react").JSX.Element;
export {};
