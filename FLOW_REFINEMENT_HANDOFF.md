# Apex / T3 Labs: final flow refinement

Date: 11 October 2026  
Status: implemented and reviewed in the supplied lean export; merge and full-application checks remain. Nothing deployed.

## Start here

The owner approved a focused usability pass, not a redesign. This release starts from `t3labs-apex-conversion-999.zip`, itself based on the owner's lean export at commit **8e921255d92da45d880cd205dee1603d1ba7eec5**. This is **not the complete T3 Labs application**. Merge at the existing repository-relative paths; preserve newer unrelated work and every file absent from this ZIP. Do not replace the full project with this subtree.

This document supersedes the earlier conversion handoff wherever the two differ. `FLOW_CHANGE_MANIFEST.json` records this patch against the latest $999 ZIP. The earlier `CONVERSION_CHANGE_MANIFEST.json` is historical.

Entry remains **`/demo/roofing-site`**. The standalone HTML is a review harness, **not a production landing page**.

## What changed

### 1. One suggested-message action; free questions remain real

Both assistant tasks now have one primary **Open assistant + add example** button. The instruction explains that it fills the input, not sends a message. The guide then changes to **Your example is ready. Edit it or press Send in the assistant.** There is no second prominent prepare button while chat is open.

The introduction explicitly invites visitors to use examples **or ask their own questions about Apex**. They can type without using an example, change a suggested request, or ask follow-ups. Prompt text is not matched to decide whether a message is allowed or whether a task is complete. A freeform request starts the applicable assistant activity automatically.

Preparing an example never auto-sends it. An unsent visitor message is protected by replacement confirmation. Copy and the full suggested prompt are fallbacks under **More guidance**, not a second main route. The original technical roofing prompt is unchanged.

New transient UI phases distinguish preparing/editing, sending, receiving a response and an error. They are driven by actual frontend request/structured-response handling, not a reading timer or interpretation of arbitrary reply prose. Stale run/request responses cannot update the new task's guidance. The activity store contains only phase/task/run/request identifiers; no prompt, contact or response text is stored there or emitted to analytics.

Observed task completion still requires the existing ordered events. A useful freestyle response may not satisfy the suggested task's milestones; **Ready to move on? / Continue manually** remains available and is labelled as tried, not verified. Failures are explicit and skippable. The assistant's backend capabilities have not been expanded or replaced with canned responses.

### 2. The website and tools get room to work

Entering the Quick Estimate task closes the Smart Assistant panel, **without clearing its conversation or unsent input**. Opening the guided Quick Estimate example also closes it. This is not a lock: the visitor can reopen chat whenever they choose.

The T3 helper **does not auto-hide** on this transition, navigation, Send, field focus or outside click. Manual Hide/Show, the wide hide bar, desktop drag and keyboard movement remain.

Active guidance is shorter: one current instruction, a single main action only when needed, progress, and optional help. On mobile the assistant's height is coordinated with the measured guide height, including visual-viewport changes; the input and guide no longer occupy the same space. The guide can scroll internally on small screens. Quick Estimate gets sufficient page scroll room to move controls above the floating guide, without shrinking the website into a sidebar layout.

While a completed enquiry is still being read, the helper shows a short acknowledgement instead of a large benefit panel over it. The return-to-estimate action is kept reachable on desktop too.

### 3. A focused, genuine Quick Estimate example

The guided sample displays one roof illustration, its explicit assumptions and a covering choice (concrete tile, natural slate or long-run metal). The choice goes through the **existing calculation engine**. It is not a hardcoded price card.

The normal questionnaire is no longer displayed underneath the sample as a competing workflow. **Choose my own roof** opens the existing questionnaire instead. Existing answers are still protected before replacement, and cancellations leave the draft intact.

Homeowner copy is shorter: one result title (**Your ballpark roof estimate**), a single explanation of footprint, clearer flat-roof wording and consistent **Request a quote** actions. Ballpark/higher-or-lower disclaimers, VAT treatment, genuine pricing gaps and product eligibility warnings remain.

### 4. Quicker enquiry preview, same result attached

In the guided Quick Estimate enquiry, **Preview with example details** explicitly uses fictional Sam Taylor / homeowner@example.com / LS1 1AA contact details with the current actual calculated result. It uses the same contact validation, estimate summary and completion events as the editable form. Nothing is emailed or uploaded.

**Edit details / add notes or files** remains available before and after preview. The ordinary non-guided homeowner form is retained. Replacing filled contact details requires confirmation; notes and selected file descriptions are retained. No personal details are copied between unrelated forms or added to local/session storage. The preferred contact method is now visible in the preview.

The assistant's imported **EnquiryPanel implementation is absent from this lean export**. It was not reconstructed from older ZIPs, replaced, or claimed to have received the same form shortcut. The launcher and helper still integrate with its existing action/signal contract. Inspect that component and test it live in the full repository.

### 5. A deliberate final transition

The final task is still detected automatically. The business benefit and optional advanced tools remain visible until the visitor selects **What could this do for my business?**. That acknowledgement opens the closing invitation. The former 1.2-second reading timer is removed.

**Finish tour** and once-per-tab-visit desktop exit intent remain available. A pending closer waits for an open enquiry or another modal to close; it does not interrupt reading the enquiry. It never automatically repeats after dismissal in the same tab visit. Mobile does not intercept the back button or tab close.

After the closer, the helper has a compact exploration state rather than a second full sales pitch. Advanced estimating and admin remain optional. Their short explanation still covers measured dimensions, a plan or satellite image at a known scale, itemised estimates, customer quote preparation, and the business's public/trade pricing.

## Approved copy and presentation

Intro headline: **What if your website did more of the work?**

Intro: **Apex Roofing is fictional. The solutions work.** Three examples explain answers, prices and enquiries without calling the team. **Use our examples, or ask your own questions about Apex at any time.**

Framing question: **How would customers get these answers on your website?**

Closing question: **If this saved your team a few hours a week, or helped you win five more customers a year, what would that be worth?**

The offer is unchanged, exactly:

> What if you could have solutions like this for $999?

Do not add “from”, per-tool exclusions, an all-features promise, or pricing qualifications. The booking action remains **Book a free 20-minute call** and its existing URL remains `https://calendly.com/insights-t3labs/20-minute-meeting`. The alternative T3 contact link also remains. No booking was made while testing.

The approved T3 logo, lime accents, **65% opacity** dark-glass background, blur, hover effects, manual controls and accessibility fallbacks remain. Apex branding and the Smart Assistant visual identity are preserved. There is no new image set or dependency upgrade.

## Preserved engineering boundaries

All original `lib/quick-estimate/` physical measurement, geometry, pricing and profile files are byte-for-byte unchanged, as are the supplier catalogue, supplier pricing implementation, project package definition and supplied data. The Quick Estimate component only selects inputs and renders the existing result. `FLOW_CHANGE_MANIFEST.json` contains the preservation hashes.

No API route, backend model, product rate, tool calculation, quote sending backend, analytics vendor or payment configuration was changed. New assistant activity is transient local UI feedback, not a network analytics stream. Existing non-personal conversion metric hooks remain.

## Verification performed

| Check | Result |
| --- | --- |
| Isolated conversion + refinement tests | **61 passed, 0 failed** (38 existing/updated + 23 new) |
| Strict TypeScript for changed framework-independent helper/conversion logic | **Passed** |
| Current-source preview TypeScript/TSX transpilation | **50 source modules, 0 syntax diagnostics** |
| Chromium layout and local-flow batch | **215 assertions passed, no JavaScript page errors** |
| Chromium assistant/frontend and interaction batch | **36 assertions passed, no JavaScript page errors** |
| Combined browser assertions across those two batches | **251** |
| Full export `npm test` | **61 passed; seven original suites fail during imports because full-app files are omitted** |
| Full Next.js build, project-wide typecheck and lint | **Not verified in this lean export** |
| Live assistant/API, full assistant enquiry form, real iOS/Android devices | **Not verified** |

The layout checks cover 1440x1000, 1024x768, 768x1024, 390x844, 320x568 and 844x390. They exercise intro, one-button prefill, manual visibility, real local sample calculation, enquiry preview, preserved input/conversation, final benefit acknowledgement, exact offer, non-repetition and page overflow. The behavior batch covers independent prompts, frontend requests, sending/error/retry, stale/reset state, unsent replacement cancellation, notes/editing, draft protection, drag/keyboard/outside-click behavior and contrast/short-viewport handling.

These are browser **assertions**, not 251 separate user studies or full-stack conversations. Successful assistant stream responses in the checker are clearly identified **test-only fixtures**. Where the absent EnquiryPanel is involved, signals are explicit orchestration fixtures; that only checks the integration contract, not the missing form itself. No customer-visible fabricated assistant response is embedded in the shipped review HTML.

The seven existing import failures include missing `tests/ts-resolve.mjs` and missing original business data. They were not patched with invented full-app files to make the suite look green. No dependency installation or production build was attempted in this refinement; use the complete configured repository for those checks.

See `verification/flow-checks.json`, the two saved assertion reports, and `verification/check-flow-preview.py`.

### Re-run the isolated source tests

```sh
node --experimental-strip-types --test tests/conversion.test.mjs tests/flow-refinement.test.mjs
```

### Re-run the standalone preview browser checks

Requires Python Playwright and Chromium (the checker uses `/usr/bin/chromium`). Supply the standalone HTML supplied alongside this ZIP. Run as two batches on resource-constrained machines:

```sh
FLOW_LAYOUT_ONLY=1 FLOW_EVIDENCE=/tmp/apex-flow-review python verification/check-flow-preview.py /path/to/apex-flow-refined-preview.html
FLOW_FOCUS=1 FLOW_EVIDENCE=/tmp/apex-flow-review python verification/check-flow-preview.py /path/to/apex-flow-refined-preview.html
```

### Preview limitations

The HTML uses actual updated components in a self-contained **React 18.2 review harness**, not the complete Next.js/React 19 application. Live chat deliberately reports that it needs the running site. It can show real prefilled/editable input and the local estimating/enquiry sequence. Skip the two assistant tasks to inspect the Quick Estimate route without a backend.

As documented in the prior conversion handoff, the export lacks runtime pricing-rule data and a supplier pitch helper. The original review harness retains explicitly labelled runtime fixtures (22 GBP/m² strip allowance, zero separate disposal and a test-only pitch helper). These are not production source changes or approved pricing calibration. Detailed/admin/full-plan workspaces and server PDFs need the real app. Do not deploy the HTML preview.

## Agent merge and release checklist

1. Merge this refinement into the full repository at the existing paths. Do not delete omitted files. Preserve newer unrelated changes, the real enquiry components, data and lockfile. Use the base commit above plus the patch manifest to review conflicts.
2. Run the full app's tests, typecheck, lint and production build, plus the new isolated suite. Address genuine integration conflicts rather than replacing working backend or pricing code with preview stubs.
3. Test the **real assistant** with the original insurance and roofing prompts, with an edited example, and with an independent question typed before using the example button. Check actual answer/page action, estimate, follow-ups, failure/retry, prefilled enquiry and readiness events. Confirm a freestyle response can continue manually without being falsely labelled as verified.
4. Review the actual `EnquiryPanel` in the complete app; ensure safe demo details, clear preview actions, attachment/notes handling and the existing helper signals. Its UI shortcut was not changed here because its implementation was not provided.
5. Open chat, leave an unsent question, then enter Quick Estimate. Confirm chat closes, its conversation/input survive reopening, the guide stays open, and the desktop page/mobile input remain usable. Repeat after manual Hide and after dragging; test actual mobile keyboards and landscape.
6. Test the covering choice in the guided sample and the complete ordinary questionnaire. Confirm draft replacement cancellations, unchanged calculated prices for unchanged inputs, actual estimate attachment, example and edited-contact previews, selected notes/files, and return actions.
7. Confirm the final benefit and both advanced tool links can be read before acknowledging the closer. Test explicit Finish tour, skips/out-of-order tasks, intro dismissal/reopening, suppressed exit while typing/enquiring, and no repeat closing invitation after dismissal. Preserve the exact $999 sentence.
8. **Check `/api/site-enquiry` in the complete app.** The ordinary Apex homepage quote/contact handler still posts there; that endpoint is omitted from this export. Its actual sending/storage behavior is unknown here. Verify fictional Apex enquiries are demo-safe before paid traffic. Keep genuine T3 booking/contact actions distinct. Do not send unsolicited test messages.
9. Verify the real 20-minute booking destination manually without submitting a booking during technical checks. Existing click metrics are not completed-call attribution; integrate any booking completion tracking separately through the site's consent policy.
10. Time the route with first-time visitors and real assistant latency. This release shortens interactions; it does **not** substantiate a guaranteed under-two-minute claim.
11. Report integration differences, test results and any remaining limitations. **Do not deploy without owner approval.**
