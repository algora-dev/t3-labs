# Apex Roofing: guided sales-demo review build

Date: 8 October 2026  
Base: `t3labs-apex-flat-complexity-refinement.zip`  
Status: implemented and locally reviewed; **not deployed and not yet production-build verified**.

## Start here

The intended link to send prospects, once staging validation is complete, is:

`/demo/roofing-site/walkthrough`

The closing business-benefits page is `/demo/roofing-site/walkthrough/summary`.

`apex-guided-demo-preview.html`, delivered separately, is a self-contained review of the new guide and actual tool component source. Open it locally in a normal browser. It does not require an API key, installation or a network connection to run the sample measurements and estimates. It is **not a deployment of the Next.js application**.

## Build plan delivered

1. Validate the latest estimator baseline without extending roofing features.
2. Add a separate sales-demo layer with four core experiences and optional trade pricing.
3. Wire actions and completion signals into the existing tools; preserve visitors' work.
4. Give each experience a current-website reflection, a specific task and a business outcome.
5. Test the state machine, measurements, catalogue reuse and browser interactions.
6. Package a review build and document what still needs a staging check.

## The prospect's journey

| Experience | Specific task | Real completion condition | Business question |
| --- | --- | --- | --- |
| Smart Assistant | Prepare “Do you handle insurance work?”, then press Send | A successful live assistant answer arrives | How would a new customer find that answer today? |
| Quick Roof Estimate | Step through a small, typical-pitch, single-storey gable re-roof | The existing tool displays a calculated price result | Can someone without measurements get a useful starting point? |
| Detailed Estimator | Load 120 m², inspect Roof Areas and selected products, continue to output | The existing estimator produces priced output lines | How much pricing and product-comparison work does the team do manually? |
| Plan to Price | Select the four corners on a training drawing, then send measurements | The measured set is passed into the existing estimator | How often is the same drawing or quantity entered twice? |
| Trade and Repeat Business (optional) | Open the local demo trade account | Real public and trade material subtotals are displayed for the same job | Could contractors return to your catalogue to price their next job? |

Visitors can jump to any experience, skip it, minimise the guide or explore without it. Skipped and untried tasks remain labelled honestly. The summary does not say someone completed a task they skipped. There are no mandatory contact details and no automatic enquiry submission from the new guide.

The guide uses a desktop sidebar. On smaller screens it collapses while the visitor uses the tool. Expanding it returns to an ordinary in-flow guide, rather than covering the tool with a large overlay or trapping the visitor in a nested scrolling panel. Existing assistant and modal controls remain above the guide.

## What is real and what is a sample

### Assistant

The example question is already in Apex's approved assistant configuration, business information and site map. The guide only fills the message box; the visitor chooses when to send it. No scripted successful answer was added. An API failure remains a failure, with retry and skip available.

The assistant still uses its existing separate approved pricing source. This change does not unify the assistant and supplier catalogues. The first assistant task deliberately tests a business-information question rather than inviting a misleading comparison between unlike price scopes.

### Quick and detailed estimates

The original calculation functions, seven-system catalogue, flat-roof complexity rates and geometry are unchanged. Samples use the same catalogue IDs and recipes as the existing tool, not a separate price table.

The detailed sample covers 120 m² of actual sloping roof surface, a 10 m ridge and four 6 m barge edges. Its output is explicitly a selected-product estimate. It is not the same scope as the Quick Estimate's additional project allowances. Access, removal and unselected components must not be implied to be included in the detailed subtotal.

### Training drawing

The new exercise is intentionally simpler than the full PDF/image workstation. It uses a vector plan and actual corner coordinates, not a static screenshot followed by a hardcoded price.

- Plan coordinates: `(100,90), (600,90), (600,490), (100,490)`.
- Preset scale: 0.02 m per drawing unit, producing a 10 x 8 m footprint.
- Shoelace area: 80 m² in plan.
- Preset pitch: 30 degrees, producing approximately 92.376 m² of roof surface through the existing pitch calculation.
- The central 10 m ridge and four 4 m plan-view barge runs are explicitly pre-identified on this training drawing.
- The measurement set has `entryPath: 'plan'`, so slope conversion is applied once downstream. It is not falsely marked as surveyed or as AI-detected geometry.

The original upload, scale calibration and component-measurement workspace remains available. The guide links to it; no old calibration data is reused against a different plan. The standalone HTML does not bundle that large workspace or its PDF/Fabric dependencies. Its limitation is shown explicitly.

### Trade example

The optional task uses the existing browser-local `signInWithDemo` capability. It does not create a real account, send an email, store credentials or add a new authentication service. Where a job is already open, the task uses those measurements instead of replacing them. The comparison uses the actual public and trade catalogue rates; the guide does not introduce another discount formula.

## Draft protection and navigation

Tour progress is stored in `apex.demo.journey.v1` in session storage. Only task IDs, completion/skip state and guide UI flags are stored. There is no new remote analytics, contact storage or chat-content storage. Blocked storage falls back to in-memory progress within the mounted application.

Apex detailed-estimator drafts now write to `apex.supplier.flow.v1`, rather than sharing the legacy flow key with other suppliers. Existing Apex drafts can be read from the legacy key as a migration fallback. Other suppliers retain their existing storage key.

Loading a sample asks before replacing an existing quick-estimate draft, estimator job or drawing. Cancelling disarms the attempt, so an old output cannot be counted as completing the new sample task. Restarting the tour resets only the tour, not estimates or trade login.

The supplier flow now preserves query strings while updating its stage hash. This protects `?from=quick-roof` during the existing handoff. Its persisted client flow is mounted after hydration, avoiding server markup that disagrees with a restored client draft. Native refresh and Next hydration still require a staging regression test.

The full workstation width is contained only while the Apex guide is active. Other suppliers keep their previous width behaviour.

## Discovery and MCP

The closing page separates accessible product/pricing information from configured AI tool integrations. It links to Google's official AI-search guidance and OpenAI's MCP documentation, and does not claim guaranteed ranking, automatic AI recommendations or an already-built MCP server.

The demo remains noindex. The new overview and summary declare noindex metadata too.

An optional technical button on the summary calls the existing `/api/quick-roof-estimate` endpoint with the sample roof selections. It displays the actual response, including scope and exclusions, or a clear error. It does not substitute a successful example response when no server is available. This proves a deterministic API calculation when run in the application, not public AI discovery.

## Verification performed

**94 automated tests pass.** The input baseline had 73 tests with one failure. That failure came from returning an extra `flatComplexity: undefined` field for a pitched-only request. The validator now omits that inapplicable field, preserving its previous input contract. No roofing formula changed.

The 21 new journey tests cover task definitions, state validation, genuine completion signals, skip and error behaviour, draft-cancel handling, sample geometry, exactly-once pitch conversion, catalogue reuse, trade comparisons and noindex metadata.

**32 Chromium browser checks pass** in the standalone React 18.2 component harness. These cover desktop/mobile layouts, actual Quick Estimate results, existing detailed output, real-coordinate plan handoff, trade comparison, API failure messaging, mobile assistant controls, draft cancellation, keyboard-only tracing and free exploration. No uncaught JavaScript page errors were recorded in those checks.

The preview executes actual component source and calculation code, but uses lightweight substitutes for Next navigation. Live API requests are deliberately unavailable, never faked as successes. The managed browser does not permit normal page navigation or native storage origins, so in-memory fallbacks were exercised; native persisted reload was not browser-verified.

The new framework-independent journey logic passed a strict scoped TypeScript check using the available TypeScript 5.8.3 toolchain. All 20 new or modified TypeScript/TSX files passed syntax/transpilation checks. A source import walk found no unresolved local imports in the preview component graph.

**The full app has not passed production verification here.** `npm ci` failed because the npm registry could not be resolved. Consequently the full typecheck reported missing dependency definitions, and lint/build could not find ESLint/Next. No weakened type settings, fake dependency stubs or lockfile changes were committed to bypass this. The standalone preview uses React 18.2 and Tailwind 4.1.10; the actual repository still specifies its original React 19.2.1, Next 16.0.10, Tailwind 4.1.17 and TypeScript 5.9.3 dependencies.

Detailed machine-readable results: `docs/GUIDED_DEMO_VERIFICATION.json`.

## Staging release gate

In an environment with dependency access, from the extracted `apex-flat-refinement` directory:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm start
```

Use Node 22 with the repository's existing test setup. Configure the server-side AI key through the existing environment configuration, never through browser code or the preview.

Before sending a live link to prospects, verify:

1. Direct-load overview, summary, quick estimate and supplier routes. Refresh with a stored draft and progress. Confirm no hydration errors.
2. Send the live assistant task, follow its relevant page link, then check the pinned workspace and duplicate-assistant suppression.
3. Complete the four experiences and optional trade task on desktop and mobile. Skip/retry should remain honest.
4. Refine a Quick Estimate into the detailed tool, accept or decline the import, and confirm the query string survives.
5. Upload an actual plan in the full workstation, calibrate it, measure, and transfer. Exercise the existing PDF/print/export paths separately.
6. Inspect cross-tool price scope before choosing any pricing question for the assistant tour. Its approved catalogue is still a separate source.
7. Check the existing contact link resolves to the T3 Labs contact section. Do not use real customer contact details to test the demo.

Do not treat the missing full-app verification as a completed deployment check.

## Scope of this delivery

Seven existing source files changed; the rest of the guided layer is additive. Existing product prices, material recipes, measurement templates, flat-roof multipliers, API routes, supplier definitions, business data, package manifest and lockfile were preserved. No new roofing product categories, drainage models or estimator pricing features were added.

The ZIP keeps the original `apex-flat-refinement/` root and source-relative paths. It excludes dependencies, environment files, build output, caches and local browser harness scripts. The separate changes ZIP is an overlay against the flat-complexity-refinement input, not a standalone application.
