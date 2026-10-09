# Apex Roofing - helper visibility and final preview fixes

Date: 9 October 2026
Base: `t3labs-apex-website-helper.zip`
Start route: `/demo/roofing-site`
Status: fixed source and tested standalone preview. Not deployed. Full Next.js validation remains required.

## What was wrong

Both the Demo Helper and Smart Assistant treated every embedded page (`window.self !== window.top`) as the assistant's pinned website workspace. An HTML preview is also an embedded page, so both companions disappeared. A top-level browser check did not reproduce the problem. This release tests the actual embedded case, including an iframe with an opaque origin and unavailable storage.

## Changes

### Helper appears immediately

- A first visit opens a centred welcome on desktop and mobile. No starter button or deployment is required.
- The helper renders through a body portal so page layout containers cannot clip or reposition it.
- Only the assistant's explicitly named `apex-assistant-website` iframe suppresses duplicate companions. This flag controls UI visibility only, not authentication or access.
- After starting, the same helper becomes the normal floating task panel. Desktop dragging, keyboard arrow positioning, Home to reset and Escape to minimise are retained.
- Intentional minimising and task progress survive navigation. The bottom launcher and the top **Open demo helper** action restore it. The top action also recovers an off-screen saved position.
- Narrow screens keep the panel within the viewport; opening chat or focusing a form makes space. The welcome is non-modal: no blocking backdrop or focus trap.

### Icons and header

- Replaced the malformed phone graphic with a clean phone SVG; the adjacent email icon matches it.
- Replaced all three tool graphics with a coordinated house, calculator and plan-outline icon set.
- Simplified contact-button decoration and spacing while retaining large touch targets.
- SVG source paths are credited in `docs/ICON_CREDITS.md`. No image generation, icon runtime dependency, remote image fetch or font file is required.

### Consistent navigation

- Added a shared wrapping breadcrumb component for the estimate chooser, Quick Estimate, detailed estimator, business controls, product list, service/content pages and Apex-origin quote output.
- Removed a duplicated Quick Estimate navigation row.
- Apex plan and quote return links now lead back to Apex's tools, not the unrelated generic supplier start screen.
- Other suppliers keep their existing destinations.
- Content links in the HTML preview now display actual Apex content pages, rather than the old placeholder page.

### Additional issues found during browser testing

- Fixed homepage contact-section overflow at 320 px by allowing grid columns and fields to shrink, rather than hiding the overflow.
- Some embedded viewers permit scripts but forbid native form submission. The Quick enquiry's **Preview my enquiry** action now runs locally without requesting a form navigation. It still enforces required fields, valid email and existing contact validation. Enter also works.
- The assistant's send button likewise calls the existing send method directly. Enter preserves normal typing/composition behaviour. The preview still returns an explicit live-service-unavailable message, not a fabricated answer.
- Admin demo routing and quote handoff read the framework's query state; the admin query hook has a Suspense boundary.

## Preserved behaviour and scope

The existing Apex website is still the landing experience. There is no new walkthrough website or fixed sidebar. Existing roof geometry, measurement bands, product catalogue, prices, pricing engines, assistant pricing/business rules, API routes and package/lockfiles are unchanged.

Quick and assistant demo-enquiry previews remain simulated. The uploaded filename can appear in the preview; the file is not uploaded. The site's separate general-contact/backend functionality is unchanged and must be treated according to its existing deployment configuration.

The HTML is a self-contained review harness with bundled React 18.2 and the current component source. The application uses React 19 / Next.js. This distinction matters: passing the preview is not a substitute for a Next.js production build. The HTML deliberately does not implement live assistant responses, server PDFs or the full Fabric uploaded-plan workspace. It clearly labels those limitations.

## Verification performed

| Check | Result |
| --- | --- |
| Node automated suite | 133 passed, 0 failed, including all 119 baseline tests |
| Chromium / Playwright preview checks | 111 assertions passed, 0 failed scenarios, 0 JavaScript page errors |
| TS/TSX syntax transpilation | 305 files, 0 syntax errors; excludes declarations, vendor and dependencies |
| Strict standalone helper typecheck | Passed for embed, config, state and store |
| Full project typecheck | Could not pass without installed dependency/type packages |
| Full lint | Could not run: local ESLint executable unavailable |
| Full production build | Could not run: local Next executable unavailable |

Browser cases include top-level HTML, ordinary iframe, sandbox `allow-scripts` with storage unavailable, intentional assistant-frame suppression, centred first arrival, pointer/keyboard movement, minimising/reopening, resize recovery, narrow 320 px layout, 390 px mobile, tablet, desktop, actual tool navigation, breadcrumbs, real pitched and flat Quick calculations, invalid form inputs, local enquiry confirmation and observed task completion. Live successful AI conversations were not substituted with fixtures in this release's delivered preview or tests.

Evidence is in `docs/verification/helper-fix/`. Installation was attempted using `npm ci --ignore-scripts --no-audit --no-fund` and stopped after 110 seconds while dependency network access was unavailable. Partial dependencies and build output are not included.

## Reproduce and integrate

Use the existing paths under `apex-flat-refinement/`. Do not replace the actual homepage with the standalone HTML. The HTML is for reviewing the components; integrate the source into the application.

In an environment with dependency access, from the repository root:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Additional scoped checks:

```sh
npx tsc -p scripts/tsconfig.helper-check.json
node scripts/check-review-syntax.mjs
```

To rebuild a standalone review, use the delivered HTML as a seed containing the bundled runtime, static assets and explicit unsupported-workspace notice:

```sh
node scripts/rebuild-helper-preview.mjs /path/to/apex-demo-final-preview.html /path/to/rebuilt-preview.html
python scripts/verify-helper-preview.py /path/to/rebuilt-preview.html /path/to/qa-artifacts
```

The browser script needs Python Playwright and Chromium (`/usr/bin/chromium` in this authoring environment). It loads the HTML with `set_content` / `srcdoc`, including sandboxed frames. It does not require an HTTP server or a live assistant.

### Application acceptance before deployment

1. Open `/demo/roofing-site` in a fresh session: the welcome should be centred immediately. Start, minimise, reopen, drag, resize and navigate; progress must remain intact.
2. Repeat inside an ordinary iframe. Then open a page in the assistant's own named frame: it must not render another assistant or helper.
3. On desktop and mobile, complete Quick Estimate -> request a quote -> use example details -> preview. Check the attached price and demo-only confirmation.
4. Use the real configured assistant to test its knowledge link, priced scenario, enquiry and pinned-page navigation. Offline review cannot verify these API calls.
5. Test a real uploaded plan, quote export and back links; verify header and breadcrumbs in the actual app. Verify existing unrelated supplier routes are unaffected.
6. Review the complete production build and all test output before approving deployment. No deployment is included in this delivery.

The machine-readable changes manifest records modified/added paths and source hashes. No measurements or rates were recalibrated in this release.
