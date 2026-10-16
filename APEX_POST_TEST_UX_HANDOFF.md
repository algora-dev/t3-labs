# Apex post-test UX refinement handoff

## Purpose
This package is the conversion-audit codebase with three focused changes requested after live flow testing. Do not redesign the demo or expand the feature set.

## Implemented changes

### 1. Quick Roof Estimate now presents two real choices in the T3 guide
When Task 3 is reached, the visitor is already on the Quick Roof Estimate page. The guide now presents:

- **Full flow - 20 sec**: resets the estimator to the normal first step. The guide moves into its compact active-task state and tells the visitor to continue on the current page. Reaching a valid estimate result completes Task 3.
- **Quick flow - Instant**: loads the existing pre-filled demo roof directly into the real estimator result. It is explicitly labelled as a demo shortcut. The same calculation/catalogue is used and the valid result completes Task 3.

Both routes emit the existing `quick-result` completion signal. Neither route requires an enquiry.

New helper commands: `quick-full`, `quick-instant`.

### 2. The final value modal is explicitly requested after the completed tour
Completing all three core tasks no longer automatically opens the $999/value modal.

The Task 3 benefit screen now provides:

- **What could this mean for my business?** - explicitly opens the existing final value modal and moves the helper to its finish state.
- **Explore the business dashboard** - optional deeper proof before the sales close.

The finish/exploration state also retains the value button until the closing invitation has already been shown.

The existing four-minute rule remains for partial/self-guided journeys: two meaningful observed interactions can still earn the sales invitation after the dwell rules. A fully verified three-step tour is excluded from the automatic timed close so the visitor's final button click remains intentional.

### 3. Business Dashboard gets a T3 Labs introduction modal
Entering `/supplier-pricing-tool/apex-roofing/admin?demo=helper` now opens a T3-themed dashboard introduction once per tab/session. It explains, briefly, that the business can:

- give local contractors quoting tools they can return to with trade pricing/rules;
- let its own team use the same tools with internal pricing;
- manage products, customers and pricing in one place;
- track quotes, activity and usage.

The modal uses the existing T3 conversion-overlay visual system and suspends the helper while open. Dismissing it reveals the normal dashboard and does not consume the separate final sales invitation.

The old low-visibility dashboard explainer card was removed to avoid duplicate messaging.

## Session-state change
`lib/demo-conversion/state.ts` presentation state is now version 3 and adds `dashboardIntroSeen`. Version 1 and version 2 state are migrated safely. Open overlays are still never persisted.

## Verification completed here

- `npm test`: **263/263 passed**.
- Changed TS/TSX files were syntax-transpiled with TypeScript: **9/9 passed**.
- No literal em dash was introduced into changed application source.
- Full dependency-backed typecheck/lint/build could not be completed in this sandbox because `npm ci` stalled. The package was cleaned of the partial `node_modules` before packaging.

## Required live-agent verification
Run on the actual integration/deployment branch:

1. `npm ci`
2. `npm test`
3. `npm run typecheck`
4. `npm run lint`
5. `npm run build`
6. Browser smoke test on desktop and mobile.

### Browser smoke scenarios

1. Complete Tasks 1 and 2, then advance to Task 3. Confirm the page is Quick Roof Estimate and the helper visibly offers **Full flow - 20 sec** and **Quick flow - Instant**.
2. Choose Full flow. Confirm the estimator starts at its normal first step, the guide becomes compact and says to continue on the current page, and a valid result completes Task 3.
3. Restart/reselect Task 3 and choose Quick flow. Confirm it goes directly to a real pre-filled estimate result, clearly marked as a demo example, and completes Task 3.
4. Confirm neither Quick Estimate route requires an enquiry to complete.
5. Complete all three tasks. Confirm the final sales modal does **not** appear merely because Task 3 completed.
6. Click **What could this mean for my business?** Confirm the existing value/$999/20-minute-call modal opens.
7. Repeat in a fresh tab and choose **Explore the business dashboard** from the Task 3 benefit. Confirm the admin route loads and the T3 dashboard-introduction modal appears once.
8. Confirm the dashboard modal contains the four concise trade/internal/tracking benefits, can be dismissed, and does not repeat in that tab.
9. Confirm the helper resumes behind/after the dashboard modal, admin exploration works, and Back to Apex preserves demo progress.
10. Confirm a partial guided journey with two observed meaningful interactions can still earn the final invitation after the existing four-minute rule.
11. Confirm the four-minute self-guided reminder remains a tour invitation first, not an immediate price pitch.
12. Confirm mobile helper/dashboard modal do not cover essential controls or create an unscrollable state.

## Scope guard
Do not alter estimator mathematics, pricing catalogues, Smart Assistant behaviour, intro copy, $999 wording, booking destination, three-task structure, or unrelated Apex pages unless required to resolve a merge/build defect. Merge these changes into the latest live branch rather than overwriting newer live work.
