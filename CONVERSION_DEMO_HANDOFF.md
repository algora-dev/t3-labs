# T3 Labs / Apex Roofing: conversion journey handoff

> Historical implementation notes. The current flow and verification are documented in **FLOW_REFINEMENT_HANDOFF.md**. In particular, the final benefit now waits for explicit acknowledgement, and the example/enquiry shortcuts and assistant guidance have been refined. Use the latest manifest for current hashes.

Date: 11 October 2026  
Base: `8e921255d92da45d880cd205dee1603d1ba7eec5`  
Entry: `/demo/roofing-site`  
Status: implemented and checked in the supplied demo subtree; full application integration and live assistant testing remain outstanding. Nothing deployed.

## Start here

This is an update to the **latest lean export supplied by the owner**, not a replacement for the full T3 Labs application. Preserve all other work in the agent's repository. Use the base commit above for a three-way merge. Do not delete files simply because they are absent from this package.

The original README describes the export and its earlier integration gates. The checks below describe this change set. `CONVERSION_CHANGE_MANIFEST.json` lists modified, added and preserved files with checksums.

The standalone HTML preview is for reviewing the new introduction, guide, sample calculation and closing invitation. It is not the deployed application and must not be used as the production landing page.

## What changed

### A short introduction, before the guide

The real Apex Roofing homepage remains the landing page. On a fresh tab visit, a centred, T3 Labs-branded modal establishes that Apex is fictional and the solutions are real. It introduces three examples rather than a list of features.

**Headline:** What if your website did more of the work?

**Body:** This is Apex Roofing, a fictional business with real working solutions. Try three quick examples of customers getting answers and prices, then preparing an enquiry, without calling the team.

**Question:** On your website, would they find the answer, or have to call or email?

**Primary action:** Try the 3 quick examples

The alternative is **Explore on my own**. Closing with X or Escape has the same non-blocking behaviour. No required qualification form, personal details or sign-up before starting.

While a sales modal is visible, the helper is suspended so there are not two instructions competing for attention. Starting the demo reveals task one. Dismissing the introduction leaves the guide hidden and available through its existing launcher. There is no second legacy helper welcome. Returning tab-session progress is respected.

### Three shorter tasks

1. **An answer, without a phone call.** Send the prepared insurance-work question and use the assistant's page action. Reflect on repeat questions staff answer.
2. **From a question to an enquiry.** Send the existing, scoped roofing request, see the configured price and preview an enquiry with the details attached. Reflect on visitors needing a price before they are ready to contact staff.
3. **No measurements? No problem.** Open Quick Roof Estimate. Use the new optional sample shortcut or the unchanged homeowner questionnaire, then preview the attached enquiry. Reflect on useful self-service prices and better enquiry context.

The helper retains its explicit Hide/Show, dragging, keyboard move and mobile behaviour. Preparing a suggested assistant message does not automatically send it. Ordered, explicit tool signals are still required for observed completion. Opening a tool alone does not count; manual confirmation and skips remain distinguishable.

The advanced tools remain accessible but optional. Their shortened explanations cover known measurements, measuring a plan or satellite image at a known scale, itemised estimates, customer quotes, and the business's own public or private trade rates. Business controls are optional, not a prerequisite for the call invitation.

### A faster route through the real Quick Roof Estimate

The guide can queue `quick-example`, which displays a clearly labelled sample-choice card. The visitor reviews it before selecting **Calculate this example**. The current calculator computes the result; there is no hardcoded price or altered calculation engine.

The sample is a small gable, 60-100 square metre horizontal footprint, one storey, typical 15-30 degree pitch, replacing concrete tiles with concrete tiles, without a flat extension. Those choices are displayed, not silently assumed for the visitor's property. The current enquiry's existing example-contact shortcut is retained.

Existing answers are protected by a replacement confirmation. Cancelling preserves them. **Choose my own roof instead** leaves the normal questionnaire available. A valid result already on screen is recognised rather than reset.

The aim is to remove typing and long explanations, not promise a stopwatch time. A real assistant exchange, follow-ups and both enquiry previews may exceed two minutes. Do not advertise a guaranteed sub-two-minute completion until measured in the configured app with first-time users.

### One closing invitation

**Headline:** What could this give back to your business?

**Question:** If one solution saved your team a few hours a week, or helped you win five extra customers over a year, what would that be worth?

**Offer:** **What if you could have solutions like this for $999?**

**Clarification:** No package-specific claims are made in the question.

**Primary CTA:** Book a free 20-minute call.

This asks the visitor to consider a hypothetical benefit. It does not claim measured time savings, promised customer gains, or that a specific package is included for $999. Confirm the intended dollar currency and the actual starting-price scope/terms before paid traffic. The implementation deliberately does not invent a currency code or recurring-cost promise.

Offer copy and destinations are centralised in `lib/demo-conversion/config.ts`. The booking link is the 20-minute destination published from T3 Labs' own site:

- https://calendly.com/insights-t3labs/20-minute-meeting
- Alternative contact: https://www.t3labs.tech/#contact

The CTA opens a new tab and does not book a meeting automatically. Check the event is available to external visitors, its current timezone display and confirmation experience before launch. No meeting or enquiry was sent during this work.

### Appearance

The modals use the existing T3 logo unchanged, near-black at **65% opacity** where backdrop blur is supported, 20px blur, lime `#d7ff00`, readable opaque text, and restrained button sheen/glow. A subtle full-screen backdrop distinguishes a sales modal from the movable helper. The main Apex site and Smart Assistant were not restyled.

Native dialogs include labelled headings, explicit initial focus, Tab/Shift+Tab containment, Escape and X dismissal, body-scroll restoration, and focus restoration. Small screens can scroll the modal. Reduced-motion, increased-contrast/reduced-transparency, unsupported-blur and print fallbacks are included. No backdrop click dismisses the modal; an obvious dismissal control is always present.

## Trigger policy

| Situation | Behaviour |
| --- | --- |
| Fresh visit, no existing helper progress | Show the introduction, keep helper hidden behind it |
| Start introduction | Reveal task one |
| Dismiss introduction | Keep the guide available but hidden |
| Existing tab-session progress / navigation | Keep progress and manual visibility; no duplicate welcome |
| All three core tasks handled | Queue the closing invitation, including out-of-order exploration |
| Final enquiry is still open | Wait, so the visitor can read its preview; show after returning to the result |
| Explicit **Finish tour** | Queue closing without requiring the remaining tasks |
| Desktop top-edge exit signal | May show closing after at least 8 seconds on the page and 1.8 seconds after the intro closes |
| Typing, dragging, an enquiry, another modal, hidden tab | Suppress exit invitation |
| Mobile / coarse pointer | No invented exit or idle popup; normal completion and explicit Finish tour remain available |
| Closing shown, dismissed or CTA clicked | Do not automatically show it again in that tab visit, including replay |

Completion is labelled internally `complete` only when all three tasks were observed. Manual/skip endings use `tour-ended`. The closing copy works for early exits without pretending the visitor finished the demo.

Session storage contains only the two shown flags for conversion and the existing non-personal helper state. A memory fallback supports restricted previews. On full page reload, open/queued dialogs are not resurrected. A new tab/session can show the introduction again; this is not permanent user tracking.

Exit intent is a heuristic, not an interception of an actual browser close. There is no `beforeunload`, back-button trap, custom leave warning or mobile idle timer. Relevant browser references:

- https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog

## File map

Existing implementation files changed:

- `components/demo-journey/ApexDemoShell.tsx`: mount the conversion coordinator and suspend helper while sales overlays are active.
- `components/demo-helper/DemoHelper.tsx`: shorter stage copy, Finish tour, booking CTA, optional sample action.
- `lib/demo-helper/config.ts`: concise task copy, advanced explanation, sample command type.
- `lib/demo-helper/store.ts`: allow sample command and emit non-personal metrics.
- `components/quick-estimate/QuickRoofEstimate.tsx`: reviewed sample shortcut; same calculation and enquiry.
- `app/demo/roofing-site/quick-estimate/quick-estimate.css`: scoped sample-card styling.

New implementation files:

- `components/demo-conversion/{DemoConversion.tsx,useConversion.ts,conversion.css}`
- `lib/demo-conversion/{config.ts,state.ts,store.ts,metrics.ts}`

New tests:

- `tests/conversion.test.mjs`
- `tests/conversion-resolve.mjs`

The README has a pointer to this handoff. No dependencies, API contracts, roof quantities, prices, supplier catalogue, QuickQuoteEnquiry, assistant implementation, website content data or existing helper CSS were changed. No omitted full-app implementations were reintroduced from older ZIPs.

## Optional analytics integration

`lib/demo-conversion/metrics.ts` emits a local `window` custom event, **`t3-demo-metric`**. It does not initialise an analytics provider, send requests, write cookies or collect form content.

Names: `intro_viewed`, `intro_started`, `intro_dismissed`, `task_started`, `task_completed`, `task_skipped`, `sample_selected`, `closing_viewed`, `closing_dismissed`, `booking_clicked`, `contact_clicked`.

Payload fields are explicitly whitelisted: event name, task ID, closing reason, completion verification. No names, emails, addresses, notes, file names, prices or conversation text.

Attach a listener through the site's existing consent-gated analytics integration. Deduplicate any pre-existing equivalent events. `booking_clicked` is not a booked call; actual booking attribution requires a separately configured Calendly completion integration. A welcome dismissal can still start task one later; evaluate task events as well as the initial CTA.

The optional closer detail explains search/AI visibility separately. The existing private-demo `noindex` metadata remains unchanged, and no indexing, MCP discovery or search ranking results are claimed.

## Verification completed

Environment: Node 22.16.0, global TypeScript, Chromium via Playwright. The production dependency installation was unavailable; the lean export also lacks required full-app modules.

| Check | Result |
| --- | --- |
| New standalone Node tests | **38 passed, 0 failed** |
| Strict TypeScript on changed framework-independent conversion/helper logic | **Passed** |
| Preview source-module syntax transpilation | **54 modules, 0 diagnostics** |
| Browser assertions in the current-source review harness | **86 passed, 0 JavaScript page errors** |
| Existing full supplied test command | **Blocked: seven existing suites fail during imports due to omitted export files** |
| Full application typecheck / lint / production build | **Not verified** |
| Live assistant/backend and real devices | **Not verified** |

The 38 tests cover reducer behaviour, once-per-visit logic, exit guardrails, safe metrics payloads, copy/offer constraints, ordered helper signals, draft safeguards and all 135 existing pitched shape/size/pitch combinations. They do not substitute for the original project's full suite.

Browser checks cover 1440px desktop, 390x844, 320x568, 768x1024 and 844x390 layouts; intro sequencing and focus; manual Hide/Show and dragging; sample-to-enquiry; safe delayed completion; out-of-order task completion; early exit; typing/enquiry suppression; storage fallback and rehydration; ordinary embedded preview versus named assistant iframe; contrast/motion fallbacks; and non-repetition. The 86 count is **assertions**, not 86 separate user studies or live assistant conversations.

The supplied original tests refer to `tests/ts-resolve.mjs`, which the lean export omits. The supplied data test also references omitted `data/apex-roofing/business.json`. These were not patched with fictitious production data or presented as passing. Restore/use them from the complete agent repository.

Run the new isolated suite from this subtree with:

```sh
node --experimental-strip-types --test tests/conversion.test.mjs
```

A structured check report is included at `verification/conversion-checks.json`.

### Standalone preview boundaries

The preview bundles the actual current Apex homepage, helper, new modal and Quick Estimate component sources. It is not a redesigned mock landing page. It uses an offline **React 18.2 review harness**, not the full project's React 19/Next 16 environment.

Because the lean export omits runtime pricing-rule data and the pitch helper used by the supplier engine, the review harness contains explicit sample runtime allowances (22 GBP per square metre stripping, zero separate disposal) and a test-only pitch-helper fixture. The latest actual quantities, calculator source and catalogue run locally around those review fixtures. These fixture prices are **not calibration approval** and are not copied into production source.

Successful assistant milestones in browser tests are explicitly injected orchestration fixtures. The preview does not fabricate customer-visible assistant answers. Live assistant requests report that they need the running app. Detailed/admin/full-plan workspaces are labelled as requiring the app; server PDFs and actual assistant pricing/enquiry sequences must be checked there. The review runtime's internal test hooks are not part of the returned application source.

## Agent integration and release checklist

1. Merge against the stated commit in the complete app, preserving newer unrelated changes. The changes-only ZIP has repository-relative paths. Do not replace the entire repository with this lean subtree.
2. Restore full dependencies using the app's existing lockfile and normal setup. No package or lockfile updates are required by this patch.
3. Run the normal automated suites, full TypeScript, lint and production build. Run the new conversion tests too. Resolve genuine integration conflicts without rewriting working pricing or geometry.
4. Open `/demo/roofing-site` in a fresh browser tab. Check intro, dismiss/start, guide navigation, returning state and the approved glass styling in the real shell.
5. Run the insurance question with a live assistant and check the actual page action. Run the exact price prompt in `lib/demo-helper/config.ts`, verify configured prices, follow-ups and the pre-filled enquiry. Use fictional details and verify no actual demo send.
6. Run both the sample shortcut and a homeowner-selected roof through Quick Estimate. Compare results before/after the patch and verify all existing enquiry data carries through. Check replacement confirmation and cancellations.
7. Verify the final invitation waits while the enquiry is being read, displays once after return, and does not repeat after dismissal/replay. Try out-of-order tasks, skips, manual progress, explicit Finish tour and a desktop top-edge exit.
8. Test Safari/iPhone and Android as well as desktop Chromium. Check keyboard opening/closing, small landscape layouts, zoom, scroll restoration and assistant/helper interactions. The browser harness here is not a substitute for real devices.
9. Confirm the $999 currency and commercial wording and active 20-minute booking event. Test contact and booking manually; do not count CTA clicks as bookings. Attach analytics only through the existing consent policy.
10. Time the fast path with unfamiliar users in the configured app before claiming a two-minute duration in ads. Review at least one ordinary path without the sample shortcut.
11. Report results and any remaining limitations to the owner. **Do not deploy without approval.**
