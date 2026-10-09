# T3 Labs demo guide polish

Date: 9 October 2026
Base archive: `t3labs-apex-helper-fixed-final.zip`
Application starting route: `/demo/roofing-site`
Status: updated source and verified offline component preview. Not deployed.

This handoff supersedes the automatic-minimising behaviour described in earlier helper handoffs. The Apex website remains the main experience. Do not replace the application's homepage with the standalone HTML.

## Delivered scope

### T3 identity, not an Apex restyle

The floating guide and its Show launcher now use the supplied T3 Labs dark identity: near-black `#0a0b10`, white, neutral greys and the single lime accent `#d7ff00`. The existing Apex site, Smart Assistant and roofing tools retain their existing branding.

The exact supplied `t3-logo-icon-glow-transparent.png` is included under `public/assets/t3-demo-guide/`. It has not been recoloured, cropped, regenerated or stripped of its original transparency. The preview embeds the same bytes so the logo works offline. The live application already loads Inter in its root layout. The guide uses Inter with the brand's system-font fallback; the offline preview does not redistribute fonts or depend on a remote font request.

The glass effect uses a 95%-opaque background with subtle backdrop blur, not opacity on the entire widget. Text and controls stay fully opaque. There is a solid dark fallback for browsers without backdrop filtering and for reduced-transparency / higher-contrast preferences. The primary button has a restrained hover glint, disabled for reduced-motion preferences. No flashing or continuous attention animation is added.

### Visibility is the visitor's decision

The full-width **Hide guide** bar is pinned above the scrollable content. Its target is at least 44 px high on desktop and 46 px on mobile. It is not a drag surface. The separate **Move** handle is available on desktop, including arrow-key movement, Shift for larger movement and Home to reset. Mobile does not present an inactive drag control.

The guide no longer hides when:

- Starting, changing, completing or skipping a task.
- Opening the Smart Assistant or focusing a mobile input.
- Entering the Quick Roof Estimate or opening a quote enquiry.
- Following either advanced-tool link.
- Clicking outside it or pressing Escape inside it.

The same automatic-hide call was removed from the optional detailed-estimator enquiry. This does not change that modal's own close behaviour or submission safety.

Only the top Hide button collapses the guide. **Show demo guide** restores the same task. Progress, deliberate hiding and saved desktop position survive route changes. A hidden guide remains hidden when a workflow completes; an open guide updates its instruction without closing. The existing top-of-page recovery action remains available.

The first welcome is still centred, including ordinary and opaque-origin embedded HTML previews. Duplicate helpers are still suppressed only in the assistant's explicitly named internal website frame. There is no blocking backdrop or outside-click dismissal. A mobile visual-viewport adjustment keeps the Hide bar reachable when the visible viewport shrinks, rather than hiding the guide to make space.

### Selected-roof size illustrations

The five generic size rectangles have been replaced by top-down SVG plan views of the shape selected on the previous step. All nine pitched templates and the separate flat-membrane template are supported.

`lib/quick-estimate/plan-view.ts` projects the existing mesh's x/y coordinates. It draws its actual perimeter and ridge/hip/valley/dormer junction lines, without displaying the mesh's coplanar partition seams. The single-slope illustration includes a small direction cue; the flat roof does not acquire invented pitched components.

Within a selected roof type, illustration area scales with each footprint band's midpoint. Linear scale uses the square root of the area ratio, so drawings grow consistently rather than being stretched. All five cards share the same drawing canvas and preserve aspect ratio. On mobile, the final large-size card is centred at the same width as the other cards.

The SVG is decorative within the existing accessible radio label. The selected name and footprint range remain text. Keyboard selection, saved answers and existing calculation behaviour are unchanged. The drawing is representative, not a measured plan of the visitor's property.

## Architecture and files

- `components/demo-helper/DemoHelper.tsx`: T3 mark, explicit Hide/Show, separate drag control, visual-viewport sizing, removed automatic dismissal.
- `components/demo-helper/helper.css`: isolated guide identity, restrained glass effect, accessibility fallbacks and responsive controls. Existing Apex strip/assistant rules preserved.
- `components/quick-estimate/RoofPlanIllustration.tsx`: selected-roof decorative SVG renderer.
- `lib/quick-estimate/plan-view.ts`: presentation-only projection and relative-size layout.
- `components/quick-estimate/QuickRoofEstimate.tsx`: new size artwork and removal of the mount-time hide call.
- `components/quick-estimate/QuickQuoteEnquiry.tsx` and `app/supplier-pricing-tool/SupplierEnquiryModal.tsx`: remove guide-hide side effects only.
- `app/demo/roofing-site/quick-estimate/quick-estimate.css`: size-card illustration styling.
- `scripts/rebuild-helper-preview.mjs`: embed the supplied mark and remove old source CSS when rebuilding. Rebuilding the new preview produces a byte-identical HTML file, rather than accumulating outdated styles.
- `tests/helper-polish.test.mjs`: projection, scaling, immutability, brand asset and visibility regressions.
- `scripts/verify-helper-preview.py`: existing regression suite updated for manual hiding, plus the new desktop/mobile checks.

No measurement bands, roof templates, geometry calculations, pricing rates, product catalogue, pricing engines, assistant API logic, package manifest or dependency lockfile were changed. The change manifest identifies every modified and added file.

## Verification

| Check | Result |
| --- | --- |
| Node automated tests | 152 passed, 0 failed, including all 133 baseline tests |
| Chromium browser assertions | 335 passed, 0 failed scenarios, 0 JavaScript page errors |
| Roof illustrations | All 10 shapes x 5 sizes, checked at desktop and mobile dimensions |
| Scoped strict TypeScript | Passed for helper state/store/config/embed and new plan-view model |
| TS/TSX syntax transpilation | 307 source files, 0 syntax errors |
| Preview rebuild | Byte-identical on a second rebuild from the new seed |
| Full application typecheck, lint, production build | Not verified; dependency installation unavailable |
| Deployment and live AI | Not performed |

Browser coverage includes centred arrival, ordinary/sandboxed iframes, no-storage fallback, suppression of the assistant's own iframe, desktop dragging and keyboard movement, resizing, Hide/Show, background clicks, Next/Skip/manual continuation, dark branding, logo loading, progress across routes, mobile input focus, local enquiry validation and confirmation, all 50 shape/size combinations on both desktop and mobile, reduced motion, print, and a simulated smaller visual viewport.

The live estimate/enquiry checks use the real component calculations and simulated local enquiry preview, not pre-priced screenshots. Successful assistant replies are not faked. The delivered offline assistant clearly states that the running website is needed.

The browser harness bundles React 18.2; the application uses Next.js 16 and React 19. Passing the harness is not a claim that the full application build passed. A simulated visual viewport is also not a substitute for testing an actual iOS or Android keyboard.

Dependency installation was attempted. The registry was unreachable and the local npm cache was incomplete (`ENOTCACHED`). The full typecheck therefore could not resolve application dependency types, and local Next/ESLint executables were unavailable. Full application typecheck, lint, production build, live assistant conversation, actual device and deployed-app integration checks remain outstanding. Nothing was deployed.

## Reproduce

In the application environment, from the repository root:

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
node scripts/rebuild-helper-preview.mjs /path/to/apex-t3-guide-preview.html /path/to/rebuilt-preview.html
python scripts/verify-helper-preview.py /path/to/rebuilt-preview.html /path/to/evidence
```

The browser script requires Python Playwright and Chromium. In the authoring environment Chromium is `/usr/bin/chromium`; adjust the executable path for a different environment. The preview build script accepts `TYPESCRIPT_PATH` when TypeScript is installed globally rather than locally. Neither script needs to fabricate successful assistant results.

## Agent acceptance before deployment

1. Open `/demo/roofing-site` in a fresh session. Check the centred T3 welcome, exact brand mark, full-width Hide bar and desktop Move control.
2. Start a task, open the assistant, navigate, focus a form and finish an enquiry. The guide must remain open unless deliberately hidden. Hide it, navigate again and reopen it; the task and progress must be preserved.
3. Choose each roof shape, continue to Size and compare the five plan views. Return to Roof, choose another shape and confirm the drawings change without resetting unrelated answers.
4. Test on real desktop, iOS and Android browsers, including the soft keyboard, landscape orientation, scrolling the guide, and Hide/Show while an enquiry or the assistant is open.
5. Verify actual Inter loading, the static logo URL, production CSS, real assistant APIs, plans and quote outputs in the complete application. Run the normal build checks and obtain deployment approval.

Use the full repository ZIP for integration, or apply the changed-files ZIP over the exact base archive named above. Keep the existing `apex-flat-refinement/` relative paths. Do not use the HTML preview as the Next.js application entry point.
