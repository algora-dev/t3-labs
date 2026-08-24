import type { ThemeConfig, RoofComponentDef, TakeoffCapabilities, SupplierAdapter, EnquiryAdapter, ResultAdapter, TakeoffPrefill } from '@roof-takeoff/core';
interface TakeoffFlowProps {
    theme: ThemeConfig;
    components: RoofComponentDef[];
    capabilities?: TakeoffCapabilities;
    supplierAdapter?: SupplierAdapter;
    enquiryAdapter?: EnquiryAdapter;
    resultAdapter?: ResultAdapter;
    initialSupplierSlug?: string;
    prefill?: TakeoffPrefill | null;
    hideHeader?: boolean;
}
export declare function TakeoffFlow({ theme, components: staticComponents, capabilities, supplierAdapter, enquiryAdapter, resultAdapter, initialSupplierSlug, prefill, hideHeader, }: TakeoffFlowProps): import("react").JSX.Element;
export {};
