/**
 * @quote-core/roof-takeoff - Compiled facade package
 *
 * Single entry point that re-exports the shared calculation core,
 * flow orchestration, layouts (Guided + Fast), and shared UI.
 *
 * React and Next.js are peer dependencies - never bundled.
 */
export type { ComponentKind, InputMode, PitchType, CustomComponentDef, RoofComponentDef, Entry, ComponentSection, MeasureMode, UnitSystem, PricingMode, LayoutChoice, RoofType, ThemeConfig, ComponentConfigEntry, SectionTotal, TakeoffCalculation, TakeoffCapabilities, SupplierContext, SupplierSummary, SupplierSearchInput, SupplierCatalogue, SupplierAdapter, SharedSupplierEnquiry, EnquiryAdapter, ResultAdapter, SharedTakeoffSnapshot, TakeoffPrefill, } from '@roof-takeoff/core';
export { DEFAULT_CAPABILITIES, COMPONENT_DEFS, BUILT_IN_ORDER, rafterPitchFactor, hipValleyPitchFactor, pitchFactor, areaValueForUnit, computeEntry, registerCustomKind, isCustomFixed, computeMaterialCost, computeKnownPriceCost, computeLabourCost, entriesFromPrefillValues, makeId, makeCustomId, makeEntry, makeInitialSections, makeCustomSection, loadComponentsFromConfig, filterComponentsForRoofType, calculateTakeoffSections, unitLabel, areaUnitLabel, resolvePricingModes, ratioToDegrees, degreesToRatio, componentLabel, componentDescription, } from '@roof-takeoff/core';
export { TakeoffFlow } from '@roof-takeoff/flow';
export { FormsLayout } from '@roof-takeoff/layout-forms';
export { ClassicLayout } from '@roof-takeoff/layout-classic';
export { ChoiceIcon } from '@roof-takeoff/ui';
export type { ChoiceIconName } from '@roof-takeoff/ui';
export { ComponentGuideBox } from '@roof-takeoff/ui';
export { ResultsModal } from '@roof-takeoff/ui';
export { SupplierEnquiryModal } from '@roof-takeoff/ui';
