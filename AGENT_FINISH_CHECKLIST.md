# Agent Finish Checklist - V4.1

Use this after receiving the V4.1 package. This is a verification/finalisation pass, not a redesign.

## Priority 1 - Clean build validation

1. Delete any inherited `node_modules` and `.next`.
2. Run `npm ci`.
3. Run:
   - `npm test`
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build`
4. Fix any compile/build issues introduced by the V4.1 assistant changes.
5. If unrelated pre-existing project errors exist elsewhere in the monorepo/app, document them separately rather than weakening assistant type safety.

## Priority 2 - Verify range PDF integration

The range-output code is already wired, but this was the last area changed and needs end-to-end verification.

Expected path:

- A Small/Medium/Large guided estimate returns `PricedDraft.mode === "range"`.
- Both `low` and `high` estimates are stored in `session.estimates`.
- The download action includes both IDs in `estimateIds`.
- `POST /api/outputs` stores both IDs on the output reference.
- `GET /api/outputs?id=...` loads both session-owned estimates.
- It calls `renderEstimateRangePdf(low, high)`.
- The PDF heading/body shows an indicative range.
- Line items show ranges where quantities/subtotals differ.
- The total shows `low - high`, not only the upper estimate.
- Exact-area estimates still use the normal single-estimate PDF.

Add an automated route/PDF test if practical.

## Priority 3 - Manual UX regression test

Test these flows on desktop and mobile:

### Guided estimate
- New Roof and Re-Roof.
- Exact area and Small/Medium/Large.
- Actual roof area vs plan/footprint area.
- Flat/Low, Medium, Steep, exact degrees.
- Covering-only estimate.
- Selected components with exact lengths.
- Selected components with explicitly authorised estimated quantities.
- Adjust Estimate should reuse the current project where expected.

### Website interaction
- Open at least three assistant-provided Apex page links.
- Pinned workspace keeps chat visible while browsing.
- No duplicate assistant appears inside the pinned website frame.
- Internal navigation does not unexpectedly destroy the session.

### Enquiry
- `Looks good` goes to minimal missing contact details.
- `Edit details` actually edits project details.
- Estimate/project context appears in the enquiry.
- Optional attachments do not block submission.

### Session controls
- Back to Chat preserves memory.
- Start New Conversation warns and then clears memory.
- Separate browser sessions remain isolated.

## Priority 4 - Content consistency

Check the live demo for any remaining references to:
- Portland
- Oregon
- USD / `$` in Apex Smart Assistant pricing
- US phone/address examples

Apex Smart Assistant/demo content should be Leeds/UK/GBP unless deliberately labelled as another unrelated tool/site in the larger T3 codebase.

## Priority 5 - Deploy and run the sales-demo script

After build success, deploy to staging and run the documented demo sequence from `DEMO_SCRIPT.md`.

The final acceptance standard is not merely "it works". A new visitor should be able to get from a vague roof-price question to a useful ballpark, downloadable output, relevant website page, and prefilled quote request without needing to understand how the system works internally.
