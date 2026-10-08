# Quick Roof Estimate: implementation handoff

Built from t3labs-apex-demo-handoff.zip. This is a review build, not a deployed or production-validated release.

## Open the implementation

- UI: /demo/roofing-site/quick-estimate
- Public deterministic API: POST /api/quick-roof-estimate
- Detailed estimator: /supplier-pricing-tool/apex-roofing?from=quick-roof
- Design and build plan: docs/QUICK_ROOF_ESTIMATE_BUILD_PLAN.md
- Unpriced calibration matrix: docs/quick-roof-reference.json

The Apex homepage estimate CTA now opens the quick tool, with an additional link to the existing detailed estimator and plan measurement. The assistant site-map data includes the new page. Its existing chat logic, bundled pricing and tools were not rewritten.

## Included

Nine pitched-roof cards plus a separate flat-membrane category; five footprint bands; three pitch bands; one/two-storey selection; optional additional flat extension; new/replacement work; existing/new coverings; coherent low/high quantities; shared mesh-based SVG illustrations; component and area-rate pricing adapters; material-pitch safeguards; explicit unpriced scope; printable results and JSON export; session draft with disabled-storage fallback; optional business demo task; explicit, non-destructive measurement handoff.

The detailed-estimator import asks before replacing an existing draft. It transfers one selected geometric endpoint only, not a hidden midpoint, fabricated measurements, product pricing, customer data or trade discounts. Estimated provenance remains visible. The handoff expires after 24 hours and is recalculated from validated selections.

## Existing code changed

- components/demo-sites/act-roofing/site-config.ts: quick-tool CTA and accompanying copy.
- components/demo-sites/act-roofing/site-sections.tsx: keeps direct access to detailed tools.
- app/supplier-pricing-tool/PortalFlow.tsx: confirmed quick-measurement import.
- data/apex-roofing/site-map.json: assistant navigation entry.

The package manifest and lockfile, existing supplier pricing engine and catalogue, assistant pricing implementation and takeoff vendor library are unchanged. No new npm dependency is required.

## Configuration locations

- lib/quick-estimate/config.ts: footprint/pitch bands and provisional flat extension/access metadata.
- lib/quick-estimate/templates.ts: reference roof volumes and labels. Illustrations and measurements share these.
- lib/quick-estimate/engine.ts: dimensional scaling and endpoint quantities.
- lib/quick-estimate/apex-profile.ts: product recipes and business pricing mode.
- lib/quick-estimate/server.ts: loads the existing public supplier catalogue and assistant demo removal/pitch rules.
- lib/quick-estimate/pricing.ts: configuration validation, supplier adapter, optional square-metre rates and missing-scope reporting.
- components/quick-estimate/: interface, illustrations and detailed-estimator import.

A component recipe maps a covering to area products and edge products. Area mode requires an areaRates entry with materialPerM2, labourPerM2, includes and optional exclusions. Both modes also need material pitch eligibility. Rates belong to each business; the initial profile supplies no guessed flat, metal or all-in rates. No blanket complexity uplift is enabled in the Apex profile.

## Important pricing and modelling limitations

Apex's existing supplier catalogue currently supports tile and slate recipes, not flat systems or metal covering. Those selections return quantities and clearly state that rates are missing. An unpriced extension suppresses the combined price rather than displaying a misleading main-roof-only total.

The displayed priced examples are configured-work subtotals, not all-inclusive roof quotes. Separate scaffolding/site access, battens and some accessories are not configured. The tile dry-verge mapping uses the existing left-hand rate as a provisional linear pricing allowance, not a validated left/right bill of materials; the result explicitly flags handed quantities for review. The current assistant and supplier models have different bundle scopes, so their totals should not be expected to match yet.

High edges, dormer junction flashings and flat perimeter have no native supplier measurement group. They remain explicit unpriced/unmapped detail rather than being mislabeled as gutters or barges. Dormer windows, cheek cladding, structural work, gutters and hazardous-material work are not automatically priced. Gross main eaves are not reduced at an added flat extension junction.

Apex uses its existing generic re-roof strip/disposal allowance. Material-specific rates are supported but not populated. Flat extensions assume an existing membrane for removal, disclosed in notes. Storeys have no price effect until business access allowances or suitable labour configuration are populated; they never change roof material quantities. VAT status is unknown in the source catalogue and is shown as requiring confirmation, not silently assumed included or excluded.

The template aspect ratios, dormer geometry, extension bands and reference access heights require roofing-expert review. Exact arithmetic has been tested; accuracy against real buildings has not been established. Do not interpret the low/high pair as guaranteed price limits.

## Verification in this environment

- Original baseline: 28 tests passed.
- Current suite: 65 tests passed, including 37 added tests. Coverage includes all 135 pitched combinations, flat geometry, storey invariance, true hip lengths, material eligibility, both pricing modes, missing rates, mixed removal, invalid inputs, native API handlers and handoff behaviour.
- Scoped strict TypeScript check: passed for lib/quick-estimate/*.ts and app/api/quick-roof-estimate/route.ts and their dependencies, using the installed global compiler and Node types.
- Browser checks: 11 passed using Chromium and the actual new component source in an offline standalone React 18.2 harness. Desktop 1440 px, mobile 390 px and small-screen 320 px were checked, alongside keyboard cards, back/reset, disabled storage, flat flow, price exclusions and incompatible pitch. Screenshots were visually reviewed.
- These browser checks are NOT a full Next.js 16 / React 19.2.1 integration test. The standalone preview does not include the site assistant, complete shared layout, authentication, deployed API or other site routes.
- npm ci failed with registry DNS/network EAI_AGAIN, leaving dependencies unavailable. npm run typecheck failed because dependency types were absent. npm run lint could not find eslint; npm run build could not find next. The full app build and lint have NOT passed here.

## Run on a machine with dependencies available

Use Node 22.16+ for the existing experimental type-stripping test command. Keep the supplied package-lock.json.

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run dev
```

A production build may also need the original project's environment configuration. Keep all real environment files outside this handoff.

Generate the unpriced review matrix:

```sh
node --experimental-strip-types scripts/quick-roof-reference.mjs
```

Sample API body, no client-generated prices or measurements accepted:

```json
{
  "shape": "gable",
  "size": "small",
  "pitch": "typical",
  "storeys": 1,
  "flatExtension": null,
  "project": "reroof",
  "existingMaterial": "tile",
  "covering": "tile",
  "flatCovering": null
}
```

The endpoint rejects malformed selections, wrong media type, oversized request bodies and client-supplied totals. It recalculates server-side, performs no writes, requires no AI key and returns no-store/noindex responses. The UI uses the same pure calculation code with server-supplied public catalogue data; it does not need an API round trip for every choice. The API has not been exposed as an MCP server in this build.

## Required integration checks before release

Run all dependency-backed checks above, then test the quick route inside the real shared layout, Smart Assistant availability, navigation to all existing tools, authenticated trade sessions and JSON/print behaviour. Test accepting and declining the detailed-estimator import when a previous draft and a plan image exist. Confirm no draft is replaced on arrival alone. Check existing proposals and site routes for regressions, and verify noindex metadata remains on this demo.

Then approve roof cards and calibration quantities, load missing business rates and scope, and only after that use the price ranges in an external sales demo. The next product phase is the guided business-owner journey, not another pricing engine rewrite.

## Standalone visual preview

The separately supplied quick-roof-preview.html is a self-contained review artifact built from the new component and measurement/pricing modules. It embeds a locally available React 18.2 runtime with its licence notices, not the repo's locked React 19 runtime. No font files are supplied. Open it in a browser to review the new flow. Links and handoff to the rest of the website require the full Next.js app; the preview is not a deployable replacement for the repository.
