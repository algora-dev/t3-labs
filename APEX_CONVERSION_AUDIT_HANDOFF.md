# Apex Roofing Conversion Audit Handoff

## Purpose

This package is the latest full Apex Roofing / T3 Labs demo snapshot after the final conversion-focused audit. The feature set is intentionally frozen. The changes simplify the guided journey, strengthen the business-owner value story, keep self-guided exploration useful, and avoid adding more core tasks.

The demo should make a skeptical roofing or construction business owner compare the Apex experience with their own website. The intended progression is:

1. A customer arrives after hours and still gets useful answers.
2. The website can use business-approved pricing, including exact prices, starting prices, or ranges.
3. A visitor can get a useful ballpark without calling or even using chat.
4. Better-qualified enquiries can reach the team with less repetitive back-and-forth.
5. Optional trade, measurement, quoting, and dashboard tools demonstrate deeper operational value.
6. Only after value is earned does the demo ask what that might be worth, then reveal: "What if you could have solutions like this for $999?"
7. The only requested next step is a free 20-minute call.

## Approved guided flow

There are still only three core tasks.

### Task 1: Instant answer

Core completion is a useful Smart Assistant answer. Following a recommended page is optional.

Value prompt: Could your website answer this at 9pm?

Reflection: How many questions like this does your team answer every week?

### Task 2: Price through conversation

Core completion is the initial approved estimate/price. Refining the estimate and preparing an enquiry are optional.

The visible pricing message now explains that a live business can use its own products and rules with exact prices, starting prices, or ranges. The copy avoids claiming that AI inclusion is guaranteed. It simply explains that accessible pricing context gives customers, search, and AI something useful to work with.

Reflection: If you paid to get them here, what happens when they leave to find the answer elsewhere?

### Task 3: Quick Roof Estimate

Core completion is an actual estimate result. The visitor can either use the pre-filled FAST DEMO SHORTCUT or complete the full simple questionnaire. Either route counts once the calculation produces a result. Enquiry creation is optional.

Reflection: What if this handled just 5 routine price enquiries a week for you?

## Quick Roof Estimate material imagery

All five pitched covering choices now use photographic imagery.

The existing concrete tile, natural slate, and long-run metal photos are preserved. Asphalt shingles and pressed metal tile now use photographic Wikimedia sources rather than generic visual placeholders.

The attribution file is:

`docs/ROOF_MATERIAL_IMAGE_CREDITS.md`

The two new images are currently referenced as remote Wikimedia thumbnail URLs. The live integration agent must confirm they load under the deployed site's CSP/network configuration. If the project prefers local assets, download and serve local copies while preserving the attribution. Do not replace them with gradients, CSS swatches, or synthetic placeholders.

## Self-guided behavior and modals

The intro remains once per tab/session and must never resurrect after it has been dismissed or Explore has been selected.

A self-guided visitor is not shown the $999 close just because time passes. After roughly four minutes of self-guided exploration, one lightweight tour reminder can appear:

- "Finding your way around?"
- Guided tour takes about 3 minutes.
- Take the guided tour.
- Keep exploring.

The reminder is one-time only and defers while the visitor is typing, using an enquiry surface, dragging the helper, viewing another modal, or when the tab is hidden.

The final commercial invitation requires at least two distinct meaningful interactions. For self-guided visitors, the tour reminder must have been seen first, and if the reminder was actually shown, the visitor must meaningfully engage again after it before the final close can queue. This prevents stacked or back-to-back popups.

Manual Continue / Skip controls exist to prevent dead ends but do not count as earned commercial interactions.

A fully observed three-task guided completion can earn the final value invitation immediately when the visitor explicitly reaches the end of the guide.

The approved final offer sentence remains exactly:

**What if you could have solutions like this for $999?**

The main CTA remains a free 20-minute call with no obligation.

After the final invitation is dismissed, the helper becomes a quiet exploration hub rather than immediately repeating the booking pitch.

## Business Dashboard

The Business Dashboard remains optional.

Opening the dashboard is enough to complete the optional dashboard proof. The helper no longer forces the visitor to open Trade Pricing specifically.

The concise commercial idea is:

- What if local contractors used your website to price their own jobs?
- Trade pricing, quoting tools, and usage can live in one place.
- The same system can support the business's own team with different pricing and rules.

The Apex demo admin route remains:

`/supplier-pricing-tool/apex-roofing/admin?demo=helper`

The live agent should verify demo auto-auth, independent Back to Apex Roofing / Roof tools navigation, and helper state preservation on return.

## Smart Assistant behavior that must remain intact

Do not regress the previous exploration work:

- Known business/product/site questions answer naturally.
- Relevant page actions remain optional.
- A genuinely ambiguous non-estimate request gets at most one short generic clarification.
- Unknown or unsupported questions do not end at "I don't know"; they offer a useful human handoff.
- Human handoff provides Prepare an enquiry and Call the team routes.
- Enquiry context carries known conversation/project details so the visitor does not retype everything.
- Demo enquiry preview clearly states no email was sent.
- Unsupported material/system pricing must never invent a rate or substitute a different material. Route to Quotes & Surveys instead.

## Files changed in this pass

- `app/supplier-pricing-tool/PortalFlow.tsx`
- `app/supplier-pricing-tool/admin/AdminPanel.tsx`
- `components/assistant/SmartAssistantLauncher.tsx`
- `components/demo-conversion/DemoConversion.tsx`
- `components/demo-helper/DemoHelper.tsx`
- `components/demo-helper/helper.css`
- `components/quick-estimate/QuickRoofEstimate.tsx`
- `docs/ROOF_MATERIAL_IMAGE_CREDITS.md` (new)
- `lib/demo-conversion/config.ts`
- `lib/demo-conversion/metrics.ts`
- `lib/demo-conversion/state.ts`
- `lib/demo-conversion/store.ts`
- `lib/demo-helper/assistant-events.ts`
- `lib/demo-helper/config.ts`
- `lib/demo-helper/guidance.ts`
- `tests/admin-materials-polish.test.mjs`
- `tests/conversion.test.mjs`
- `tests/demo-helper.test.mjs`
- `tests/final-conversion-audit.test.mjs` (new)
- `tests/flow-refinement.test.mjs`
- `tests/skip-progression.test.mjs`

## Verification completed in this environment

- `npm test`: **262 / 262 tests passed**.
- All 13 changed TS/TSX source files were syntactically transpiled with the available global TypeScript compiler: **13 / 13 clean**.
- Changed text files were scanned for literal em dash, replacement characters, and common mojibake: clean.
- Changed application source was scanned for the removed QA-style helper wording and old forced completion patterns.

## Verification not completed here

Dependency installation was attempted with `npm ci --ignore-scripts --prefer-offline --no-audit --no-fund`, but the sandbox process hung and timed out. Therefore the following dependency-backed commands have **not** been completed in this environment:

- `npm run typecheck`
- `npm run lint`
- `npm run build`

The live OpenAI assistant/model API was not exercised here. A live browser deployment was not performed here. The remote roofing material photos were not production-CSP tested here.

These are mandatory integration-agent checks before the user treats the deployment as verified.

## Required live smoke test

### Intro and helper

1. Fresh tab: intro appears exactly once.
2. Intro clearly frames the 9pm visitor scenario.
3. Start guide works.
4. Explore on my own works and leaves the helper available.
5. After about four minutes of self-guided exploration, the one-time tour reminder appears, not the sales close.
6. Dismiss reminder: no immediate $999 modal.
7. Open/start the helper later without losing existing progress.
8. Navigate around and return home: intro never reappears in the same tab/session.

### Task 1

1. Example is prefilled but not auto-sent.
2. Visitor can edit it or ask their own question.
3. A useful non-empty assistant answer completes the task.
4. Any recommended page action is optional.
5. Helper reaches the benefit/reflection screen and can continue.

### Task 2

1. Example is prefilled but not auto-sent.
2. Initial approved catalogue estimate completes the core task.
3. Refinement questions are optional.
4. Prepare an enquiry is optional and still works if selected.
5. The visible pricing note explains own products/rules plus exact prices, starting prices, or ranges.
6. Asking for an unsupported material price never invents or substitutes a price.

### Task 3

1. FAST DEMO SHORTCUT produces a real calculated result.
2. Full questionnaire route also produces a real result.
3. Either route completes the task only after the actual result exists.
4. Asphalt shingles and pressed metal tile show recognisable photographic images consistent with the other three options.
5. No broken/generic material placeholders appear.
6. Enquiry remains optional.
7. Flexible exact/starting/range pricing explanation is visible.

### Closing logic

1. Manual Continue/Skip alone cannot qualify the final sales modal.
2. Two distinct real interactions plus the four-minute rule can qualify a partial/self-guided journey at a natural checkpoint.
3. Self-guided visitors see the tour reminder first and must engage again after it before the sales close can appear.
4. Active typing, an open enquiry, helper dragging, hidden tab, or an active guided task are not interrupted.
5. Completing all three observed guided tasks can show the closing invitation immediately at the explicit end-of-tour value step.
6. Exact visible offer is: `What if you could have solutions like this for $999?`
7. Free 20-minute booking opens correctly.
8. Dismissing the closing invitation prevents it from reappearing in that tab/session.
9. Helper finish is an exploration hub, not a second hard booking pitch.

### Dashboard

1. Explore the Business Dashboard opens in one click.
2. Demo auto-auth works.
3. Opening the dashboard completes the optional dashboard proof.
4. No specific Trade Pricing tab is required.
5. The contractor/trade/internal-use value card is visible.
6. Back to Apex Roofing and Roof tools work without the helper.
7. Returning preserves guide/progress/conversion state.

### Mobile

1. Helper and Smart Assistant do not overlap badly.
2. Helper can be manually hidden/reopened.
3. Reminder/final modal remain usable in keyboard-sized viewports.
4. No focus trap or body-scroll dead end.

### Live assistant regression

Test at least:

- `Do you install EPDM flat roofs?` -> useful answer, optional relevant page.
- `What underlay do you use?` -> useful answer.
- Ambiguous request -> at most one general clarification, then answer or handoff.
- Unsupported manufacturer/site-specific question -> Prepare an enquiry + Call the team.
- `How much is long-run metal per square metre?` -> if not present in the approved pricing catalogue, no invented/substitute price; hand off to Quotes & Surveys.
- Handoff enquiry already contains the known request/context and says the demo did not send an email.

## Integration instruction

Merge this intent into the current live branch rather than blindly overwriting any newer work. Preserve any newer compatible changes that landed after this snapshot. Do not broaden scope or add new features during integration.

Once merged, run dependency install, tests, typecheck, lint, and build. Fix integration issues without changing the approved conversion behavior. Then deploy to the user's normal test/preview environment for live browser testing.
