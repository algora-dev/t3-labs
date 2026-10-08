# Apex Roofing UK demo catalogue - implementation handoff

Date: 2026-10-08. Fictional demonstration rates, GBP excluding VAT. No live merchant price feed. No production deployment.

## Implemented

- Seven homeowner-selectable covering systems: concrete tile, natural slate, asphalt shingle, pressed metal tile, long-run metal, EPDM and GRP.
- 36 additional editable supplier catalogue rows (five main coverings, six area accessories and 25 edge-detail rows) alongside the original Apex entries.
- Pitched-system recipes use the existing supplier pricing engine for roof area, ridge, hip, valley and verge quantities. Eaves support is priced separately from gutters to avoid misleading spouting products.
- Flat membranes use area-based covering and deck, with flat perimeter measured and priced separately. Upstands, outlets, insulation and falls remain explicit exclusions.
- Demo access allowances: GBP 550 for one storey and GBP 1,100 for two storeys. Existing covering-specific strip rates are now configured.
- The old generic `metal` recipe is retained for legacy saved inputs, but the homeowner UI offers the more meaningful pressed-metal and long-run choices.
- A six-test catalogue suite covers all seven systems, a mixed roof, pitch compatibility and input validation. The original tests were updated where their assumptions referred to intentionally missing rates.

## Not yet complete / important limitations

- These are provisional rounded rates, not verified current trade quotations or manufacturer-approved specifications.
- No live merchant lookup, branded SKU validation or guarantee of material-pitch compatibility. Shingle, metal and tile restrictions need product-specific verification.
- The generic 'demo battens' area equivalent is an approximation and must be replaced with a batten gauge/product quantity calculation for a detailed trade bill of materials.
- Flat roof outlets, abutments, insulation, falls, complex high-edge details, specialist flashing and junctions are not fully quantified. They remain explicit exclusions. Mixed pitched/flat junctions need further treatment.
- Supplier detailed estimator supports the additional rows, but its roof-type tags remain broad and the AI assistant's separate business-facing pricing JSON has not been migrated to this catalogue. Consistency across the smart assistant is a subsequent integration task.
- Existing roofing estimator test suite passes; a full Next.js production build and TypeScript check were not possible because node_modules were not installed in this runtime.
- The standalone preview from the previous handoff has not been regenerated; use the Next.js app for the new material-selection UI.

## Validation

`npm test`: 71 passing, 0 failing. Includes the six new catalogue tests.

## Suggested next QA

1. Open `/apex-roofing/quick-estimate` in the Next.js app and test all seven coverings.
2. Compare simple gable and complex roofs with the same footprint and pitch.
3. Test flat and mixed roofs, review displayed exclusions and check price subtotals.
4. Review source-backed assumptions in `APEX_UK_DEMO_PRICING_SCHEDULE.md` and calibrate rates.
5. Extend component measurement schema for flat upstands/outlets and specialist high-edge details before claiming all-in prices.
