export type ComponentKind = 'roof_area' | 'ridge' | 'hip' | 'valley' | 'barge' | 'spouting' | 'custom' | (string & {});
export type InputMode = 'pitch_calculated' | 'actual';
export type PitchType = 'rafter' | 'hip_valley' | 'none';
export interface CustomComponentDef {
    id: string;
    name: string;
    measurementType: 'linear' | 'area' | 'fixed';
    pitchType: PitchType;
    wastePercent: number;
}
export interface RoofComponentDef {
    id: string;
    component_kind: ComponentKind;
    name: string;
    description: string | null;
    unit: string;
    price_per_unit: number;
    pricing_strategy: string;
    pack_size: number | null;
    pack_price: number | null;
    labour_rate: number;
    labour_unit: string;
    suggested_waste_percent: number;
    pitch_type: string;
    is_active: boolean;
    sort_order: number;
    roof_types: RoofType[] | null;
}
export interface Entry {
    id: string;
    label: string;
    inputMode: InputMode;
    planLength?: number;
    planWidth?: number;
    planLengthVal?: number;
    pitchDegrees: number;
    actualValue?: number;
    computedValue: number;
    selectedComponentId: string | null;
    quantity?: number;
    isTotalInput?: boolean;
    knownPrice?: number;
}
export interface ComponentSection {
    kind: ComponentKind;
    entries: Entry[];
    wastePercent: number;
    customDef?: CustomComponentDef;
}
export type MeasureMode = 'actual' | 'plan';
export type UnitSystem = 'metric' | 'imperial' | 'squares';
export type PricingMode = 'material' | 'material_install';
export type LayoutChoice = 'guided' | 'fast';
export type RoofType = 'new_roof' | 're_roof';
export interface ThemeConfig {
    primary: string;
    primaryHover: string;
    accent: string;
    logoUrl: string | null;
    logoUrlLight?: string | null;
    headingFont: string;
    bodyFont: string;
    currency: string;
    currencySymbol: string;
    defaultUnits: UnitSystem;
    supplierName: string | null;
    supplierEmail: string | null;
    supplierSlug?: string | null;
    features: {
        sendToSupplier: boolean;
        convertToQuote: boolean;
        saveToApp: boolean;
    };
    pricingModes?: PricingMode[] | null;
    roofTypeOptions?: RoofType[] | null;
    copy: {
        headerTitle: string;
        heroTitle: string;
        heroSubtitle: string;
        footerText: string;
        poweredBy: string | null;
    };
}
export interface TakeoffCapabilities {
    knownPriceEntries?: boolean;
    fixedQuantityComponents?: boolean;
    resultUrls?: boolean;
    draftPersistence?: boolean;
    leaveWarning?: boolean;
    supplierSelection?: boolean;
}
export declare const DEFAULT_CAPABILITIES: TakeoffCapabilities;
export interface SupplierContext {
    slug: string;
    name: string;
    currency: string;
    currencySymbol: string;
    unitSystem: UnitSystem;
    taxMode?: string;
    taxName?: string | null;
    taxRate?: number | null;
    catalogueVersion?: string | null;
    logoUrl?: string | null;
    branchCity?: string | null;
    branchRegion?: string | null;
    branchCountry?: string | null;
}
export interface SupplierSummary {
    slug: string;
    name: string;
    logoUrl?: string | null;
    branchCity?: string | null;
    branchRegion?: string | null;
    currency?: string | null;
}
export interface SupplierSearchInput {
    query?: string;
    limit?: number;
}
export interface SupplierCatalogue {
    slug: string;
    supplierName: string;
    supplierEmail?: string | null;
    currency: string;
    currencySymbol: string;
    unitSystem: UnitSystem;
    components: RoofComponentDef[];
    catalogueVersion?: string | null;
    pricingModes?: PricingMode[] | null;
    roofTypeOptions?: RoofType[] | null;
}
export interface SupplierAdapter {
    listSuppliers(input?: SupplierSearchInput): Promise<SupplierSummary[]>;
    loadCatalogue(slug: string): Promise<SupplierCatalogue>;
}
export interface SharedSupplierEnquiry {
    supplierSlug: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    message?: string;
    snapshot?: SharedTakeoffSnapshot;
}
export interface EnquiryAdapter {
    submit(input: SharedSupplierEnquiry): Promise<{
        ok: true;
        enquiryId?: string;
    }>;
}
export interface ResultAdapter {
    createResult(input: SharedTakeoffSnapshot): Promise<{
        id: string;
        url: string;
    }>;
}
export interface TakeoffPrefill {
    measureMode: MeasureMode;
    unitSystem?: UnitSystem;
    pitchDegrees?: number;
    pricingMode?: PricingMode | null;
    roofType?: RoofType | null;
    layout?: LayoutChoice | null;
    values: Record<string, number[]>;
    wastePercent?: Record<string, number>;
}
export interface SharedTakeoffSnapshot {
    version: string;
    measureMode: MeasureMode;
    unitSystem: UnitSystem;
    pricingMode: PricingMode | null;
    roofType: RoofType | null;
    supplierSlug: string | null;
    catalogueVersion: string | null;
    sections: Record<string, ComponentSection>;
    sectionOrder: string[];
    masterPitchDegrees: number;
    capabilities: TakeoffCapabilities;
    calculation: TakeoffCalculation;
}
export interface ComponentConfigEntry {
    name: string;
    kind: string;
    unit: string;
    price_per_unit: number;
    labour_rate: number;
    description?: string;
    pricing_strategy?: string;
    pack_size?: number | null;
    pack_price?: number | null;
    labour_unit?: string;
    suggested_waste_percent?: number;
    pitch_type?: string;
    roof_types?: RoofType[] | null;
}
export interface SectionTotal {
    rawTotal: number;
    withWaste: number;
    count: number;
    materialCost: number;
    labourCost: number;
    totalCost: number;
}
export interface TakeoffCalculation {
    sections: Record<string, SectionTotal>;
    totalEntries: number;
    grandTotal: number;
    materialTotal: number;
    labourTotal: number;
}
