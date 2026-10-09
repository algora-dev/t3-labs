# Flat-roof complexity refinement - review build

Adds a **Simple / Typical / Complex** choice on the **Size** step for a flat main roof or optional flat extension. Typical is selected by default. The choice affects the *indicative installation labour and uncertainty allowance only*, not roof area, perimeter, pitched-roof geometry, material quantities, or scaffolding. This intentionally does not estimate outlets, penetrations or other site-specific details.

Demo factors (low scenario / high scenario):

- Simple: 1.00 / 1.10
- Typical: 1.08 / 1.25
- Complex: 1.20 / 1.55

The factors apply to the **flat-area proportion of installation labour**. On a mixed pitched/flat job, this is an approximate proportional allocation; it is not a line-item flat-section labour calculation. The exact factors are overridable in `PricingProfile.flatComplexity`. No arbitrary uplift is applied to materials or removal.

Backwards compatibility: API callers and old drafts without `flatComplexity` default to Typical when a flat roof is present. A pitched-only estimate cannot accept flat complexity in the API. No existing estimate input is required to provide the new field.

The displayed estimate remains an indicative configured-work subtotal. Structural work, hidden defects, outlets, specialist junctions and VAT remain outside the base estimate.

## Files changed

- `lib/quick-estimate/types.ts`
- `lib/quick-estimate/validation.ts`
- `lib/quick-estimate/draft.ts`
- `lib/quick-estimate/pricing.ts`
- `components/quick-estimate/QuickRoofEstimate.tsx`
- `tests/quick-roof.test.mjs`

## Verification

TypeScript/TSX transpilation syntax checks passed for all five changed source files. Automated tests were added for complexity ordering, unchanged geometry and input validation. **Automated tests were not executed successfully in this environment:** Node 22.16 cannot load this repository's `.ts` imports using its test harness and dependencies are not installed. Run `npm ci && npm test && npm run typecheck && npm run build` in the project environment before deploying.
