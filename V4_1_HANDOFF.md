# T3 Labs Smart Assistant V4.1 - Handoff

## Status

This package is the current V4.1 cleanup of the Apex Roofing Smart Assistant and demo website.

The deterministic and demo-data test suite passes **22/22** with `npm test` in this package.

A full dependency-backed `typecheck`, `lint`, and production `build` were **not verified in this environment** because `npm ci` timed out and left only a partial `node_modules`. The package intentionally excludes `node_modules`.

The receiving agent should therefore begin with a clean dependency install and validation before merging or deploying.

## What V4.1 changes

### 1. One coherent Apex demo identity
- Standardises the Apex Smart Assistant data around **Leeds, UK and GBP**.
- Removes the earlier Portland/USD split in the assistant demo data.
- Updates business copy, pricing copy, website-page data and navigation data to align.

### 2. Re-roof vs new-roof pricing semantics
- Base roof-system prices are materials + installation and exclude removal of the existing roof.
- Re-roofs add separate configurable allowances:
  - strip existing roof: configured per m2
  - removal/disposal: configured per job
- New roofs do not receive strip/disposal lines.
- These are deterministic pricing-engine lines, not LLM arithmetic.

### 3. Pitch has a real function
- Guided estimates require either an exact pitch or a configured pitch band.
- Configured material minimum pitches are enforced.
- If the user supplies plan/footprint area, pitch is used to convert it to sloped roof area.
- If the user supplies actual roof-surface area, pitch does not inflate the area again.

### 4. Safer roof-component pricing
- Optional roof components are not silently added.
- User-selected components retain explicit quantities when supplied.
- Geometry heuristics are used only when explicitly authorised.
- Simple gable geometry does not invent valleys.
- Component quantity provenance is retained (`user`, `heuristic`, `area`, etc.).

### 5. Guided-estimator cleanup
- Fixes component selection so only chosen components are included.
- Supports project type, size/area, area basis, pitch, roof covering, roof shape where needed, and optional components.
- Draft validation requires the information needed for the selected pricing path.
- Size bands produce estimate ranges rather than false single-point precision.

### 6. Complex-estimate clarification rules
- Complex roofing estimates are allowed more clarification turns than ordinary questions.
- Simple business questions and simple unit-price questions should remain concise.
- Free-chat estimate logic is aligned more closely with the guided estimator.

### 7. Website knowledge and navigation
- Apex content-page data is centralised so the rendered pages and assistant website knowledge can use the same source.
- All shared Apex content pages are represented in the assistant navigation map.
- Homepage/service navigation is improved so the additional pages are meaningful demo destinations.

### 8. Pinned assistant / website workspace cleanup
- Pinned mode is intended to keep the website visible beside the assistant.
- Embedded site mode suppresses nested demo/assistant UI so the workspace does not show an assistant inside an assistant.
- Internal navigation is intended to preserve the conversation while the user browses Apex pages.

### 9. Enquiry/session improvements
- Estimate/session state is retained per visitor.
- Guided estimate facts flow into the session for enquiry handoff.
- Attachment handling was reduced toward metadata/reference-based session state rather than large inline payloads.

### 10. Range estimate downloads
- Size-band results are stored as both low and high estimate records.
- `DOWNLOAD_OUTPUT` actions can carry `estimateIds` for both range endpoints.
- `/api/outputs` stores and validates both estimate IDs against the current session.
- `renderEstimateRangePdf()` renders a range output rather than downloading only the high estimate.

## Tests included

`tests/pricing.test.mjs` and `tests/demo-data.test.mjs` cover, among other things:
- one Leeds/GBP demo identity
- all shared Apex pages represented in assistant navigation
- re-roof removal kept separate from roof-system pricing
- increased clarification budget for complex estimates
- no unrequested roof components
- no fake gable valleys
- exact user component quantities
- pitch/plan-area conversion
- unknown material rejection
- re-roof vs new-roof removal behaviour
- size-band estimate ranges
- pitch compatibility
- quantity-source labels
- rejection of unauthorised heuristics
- pitch required for guided drafts

## First commands for the receiving agent

Run from a clean working copy:

```bash
rm -rf node_modules .next
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Do not merge/deploy until all assistant-related build errors are resolved.

## Manual smoke-test sequence

1. Open the Apex demo as a new visitor.
2. Ask a simple business question. Confirm no unnecessary estimator flow.
3. Ask for a concrete-tile per-m2 price. Confirm direct catalogue answer.
4. Start a guided re-roof estimate.
5. Select a size band. Confirm final result is a price range.
6. Select medium pitch and a compatible covering.
7. Select `roof covering only`. Confirm no ridge/hip/valley/gutter lines appear.
8. Repeat with selected components and user-supplied lengths.
9. Repeat with explicit permission to estimate missing selected component quantities.
10. Confirm an incompatible covering/pitch combination is blocked or redirected.
11. Download an exact-area estimate PDF.
12. Download a size-band estimate PDF and confirm it shows a range, not only the high end.
13. Request an official quote and confirm project facts are prefilled.
14. Navigate to an Apex website page from an assistant action and confirm chat state remains.
15. Pin the assistant and confirm the website pane does not contain a duplicate assistant launcher.
16. Reset the conversation and confirm old project facts are no longer available.
17. Open a second browser/incognito session and confirm its memory is isolated.

## Do not regress these principles

- The LLM interprets. The deterministic engine calculates prices.
- Never silently add optional components.
- Never silently substitute unknown materials.
- Never present a size-band result as an exact single price.
- Website content, assistant knowledge and navigation should not drift into separate contradictory data sets.
- Reset conversation and Back to Chat are different actions.
- Every public visitor must have isolated session state.
