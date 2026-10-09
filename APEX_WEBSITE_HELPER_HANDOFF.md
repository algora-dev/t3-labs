# Apex Roofing: website-first Demo Helper

**Build:** 9 October 2026. **Status:** review build, not deployed.
**Supersedes for the Apex user journey:** the older guided-demo and homeowner-enquiry handoffs. Their pricing/geometry history remains useful, but their sidebar and send-flow descriptions are no longer current.

## Start on the real website

Start the application at `/demo/roofing-site`.

There is no new marketing homepage, split-screen container, mandatory sidebar or separate demonstration dashboard. The existing Apex hero, navigation, service pages, imagery and branding remain. A small example-site strip and floating helper are the guidance layer.

Old `/demo/roofing-site/walkthrough` links redirect to the Apex homepage. Old summary links redirect to that homepage with the helper recap open. The T3 Labs main site and other supplier identities have not been redesigned.

The source archive retains its existing `apex-flat-refinement/` root. Merge its contents into the application root; do not accidentally create a second nested application directory.

## The agreed journey

| Experience | Visitor action | Reliable completion |
| --- | --- | --- |
| 1. An instant answer | Prepare a question about insurance work, send it, then follow the assistant's offered Apex page link. | A structured answer with a usable page action, followed by the visitor clicking that action. |
| 2. A price through conversation | Prepare the defined roof request, send it, review the estimate and continue through the enquiry form. | A typed estimate result, loaded enquiry details, then a valid local enquiry preview. |
| 3. A price without chatting | Open the real free-tool chooser, select no measurements, complete Quick Roof Estimate, then preview a quote enquiry. | A configured quick result, its enquiry form, then a valid enquiry preview. |
| Optional: Business controls | Open the demo admin and look at Trade pricing. | The actual trade-management panel is shown after the optional task starts. |

Only three tasks are counted as the core journey. No one must complete a detailed takeoff, upload a plan, register a trade account or change a price.

After the Quick Estimate, two short cards explain the optional advanced routes: use measurements you already have, or set a known scale on a plan/satellite image and carry the traced quantities into the same estimator. Copy explains professional/team use, customer-quote output, business-supplied rates and configurable public/private pricing without presenting the ballpark as a formal quote. A known scale is required; the demo does not claim automatic satellite measurement.

The closing helper connects self-service answers, fewer repetitive enquiries, useful lead context and trade repeat use. Its CTA goes to the existing T3 Labs contact section. Customisation and AI visibility are brief disclosures, not another task or a claim that MCP/discovery is already deployed.

## Helper behaviour

- Desktop: floating, draggable by its labelled header, keyboard movable with arrow keys (Shift for a larger step), Home to reset position, clamped after resizing. No page-width reduction.
- Mobile: compact collapsible bottom panel, not a tiny desktop drag window. It minimises when the visitor enters form fields and reserves a clear place above the open assistant.
- The helper minimises when sending visitors into the tool chooser, so it does not cover a card or the main form action.
- Progress and desktop position are tab-local. No contact details, prices, conversation text or files are saved in helper state. Storage errors have an in-memory fallback.
- Real milestones update instructions. Completion does not navigate away from the result the person is reading. The visitor chooses when to proceed.
- Skipped, manually marked as tried, and observed completions are distinct. Late assistant replies from an earlier task/run are ignored. No page opening alone counts as completing a price or enquiry task.
- Prepared assistant text is editable and never automatically sent. Replacing unsent text asks first. No synthetic successful assistant response is shipped in the site or preview.

## Homeowner and advanced-tool UX

The actual homepage now has three linked tool choices. The chooser, quick tool and advanced estimator share an Apex header, clear labels and consistent blue/white controls. Advanced entry describes plans/images and known scale. Trade sign-in is secondary rather than a required first step.

The Quick Estimate no longer has a competing demo-information sidebar. Its result shows the range first, a prominent proper-quote CTA, six plain-language selections and a short disclaimer. Calculated quantities, scope exclusions, export and detailed-estimator transfer remain under optional details. No measurement or pricing rules were changed.

Both assistant and quick enquiries retain the original result and allow extra contact/project information and file selections. Assistant range estimates retain both endpoints in the review and receipt. Changing enquiry notes does not silently recalculate a price; the interface sends the visitor back to chat for repricing.

The optional advanced estimator enquiry is now explicitly local for the fictional Apex slug too. It returns before external file uploads or enquiry submission, displays its included estimate information, and represents selected files by name. Other suppliers keep their existing send path.

## Submission safety

The guided assistant and Quick Estimate forms never POST the entered contact details or files. They show a local receipt of what the business would receive. Example contact details are available. Leaving/unmounting the form removes those in-memory details; the existing assistant conversation has its own session lifecycle.

As defence in depth, `/api/inquiry` also checks the active business's `demo` flag before sending or saving. The canonical payload builder runs on a cloned demo session, so a preview cannot mutate its contact facts. Tests exercise this with a placeholder email API key and a network trap.

This is not a global shutdown of all T3 Labs enquiry/contact endpoints. Normal T3 contact links are still live application features. Do not enable real sending for fictional Apex demo forms.

## Admin: what is and is not live

The optional link is `/supplier-pricing-tool/apex-roofing/admin?demo=helper`. This explicitly enters the existing demonstration admin without a login chore. It is not an authentication bypass for real business data: these controls use browser-local demonstration records.

Product edits, trade tiers, customer records and activity views are existing admin capabilities. The UI now labels sample activity and avoids claiming a real invite or reset email was sent. Local changes cannot affect another visitor's catalogue or accounts.

**Important existing integration boundary:** admin overrides affect the detailed supplier estimator in that browser. The Quick Estimate profile and assistant's server business catalogue are still separately configured. This build does not pretend that editing a local admin product automatically reprices every channel. A live client deployment needs its intended shared source/authentication/integration; that is configuration/backend work, not a feature secretly provided by this widget.

## Prepared assistant scenario and live acceptance

The example prompt is in `lib/demo-helper/config.ts`: replacement concrete tiles, 120 m² actual sloping roof area, 25° pitch, simple gable, 12 m dry-fix ridge, no hips/valleys, configured strip/disposal allowances.

The unit-level specified-scope calculation produces **£10,490 excluding VAT** from the retained Apex assistant catalogue. This is an engine test fixture and scoped indicative estimate, not a verified complete roof quotation or proof of a live AI response. Do not hardcode this amount into chat.

With the normal server credentials configured, verify the actual model understands the request, uses the pricing tool, asks any necessary scope question, offers an enquiry and transfers the canonical result. Task 1's registered service page is `/demo/roofing-site/services/insurance-work`. Variations in wording must not break the helper; it listens to structured actions and cards rather than matching answer prose.

## Verification completed

- **119 automated tests passed**, including all 94 baseline tests and 25 new tests.
- **58 Chromium browser assertions passed**, covering actual-source desktop/mobile components, dragging, keyboard position, helper minimising, price/enquiry milestones, local submission safety, admin, three tool links and range presentation.
- **302 TypeScript/TSX source files passed syntax transpilation checks.** This is not a semantic project-wide typecheck.
- A scoped strict TypeScript check passed for the new framework-independent helper configuration/state/store/event/validation modules.
- Engine, catalogue and dependency files were compared against the supplied ZIP. No calculation, rate, dependency or lockfile changes.
- Changed/new text is UTF-8 and has no literal em dashes or replacement-character corruption. Nine inherited em dashes in three historical Markdown handoffs were changed to hyphens solely to satisfy the repository archive rule; no prices were altered.

Exact results, limitations and individual browser assertions: `docs/verification/website-helper/results.json`. Node test output: `docs/verification/website-helper/unit-tests.tap`.

## Still required before release

`npm ci` failed here during registry/network access. Consequently the full Next.js application was not production-built, linted or semantically typechecked. Browser checks used actual source components in a React 18.2 review harness; the application pins React 19.2.1. They are not a full Next.js/SSR/hydration test.

Assistant success/SSE/session responses in automation were explicitly labelled fixtures. No live language-model response was verified. The standalone preview deliberately reports live chat as unavailable rather than pretending to answer. The full calibrated drawing canvas, server PDFs, pinned assistant/iframe workspace and physical mobile devices still need integration regression testing.

Use the repository's normal environment and run:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Then run the actual website on desktop and mobile:
1. Start at the Apex homepage; move/minimise the helper and use normal navigation.
2. Complete the insurance question/link and real assistant price-to-enquiry journey. Check a follow-up, a changed price input, and an API failure/retry. Confirm that the enquiry never sends.
3. Complete a pitched, a flat and a mixed Quick Estimate; preview an enquiry with a file selected. Confirm the price and chosen roof carry through without retyping.
4. Open each optional advanced route, preserve any existing draft, verify the real calibrated drawing/PDF workflows and preview a supplier enquiry.
5. Explore the optional admin, inspect a trade tier and sample activity, and verify the local-only disclaimer. Check another supplier and the main T3 site have not regressed.

Fix integration failures without replacing the real site, reintroducing a walkthrough sidebar, modifying calculation engines or inventing successful assistant responses. **Do not deploy without approval.**

## Standalone HTML review

The accompanying `apex-website-helper-preview.html` compiles the actual Apex homepage and component sources, not a redesigned mock website. It is for reviewing layout and local tool interactions without installing the application.

It includes real local quick calculations and the current admin/tool-entry components. Live chat/session enquiries, full individual service-page rendering, server PDFs and the uploaded-plan workspace need the running app. The preview states these limits on screen. It contains no credentials, bundled font files or successful assistant fixtures. The real website does not include that preview-only amber banner, React 18 runtime or navigation/API shims.
