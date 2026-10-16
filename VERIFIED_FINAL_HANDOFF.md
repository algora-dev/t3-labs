# Apex Roofing / T3 Labs - independently re-run final sweep

Date: 11 October 2026. Nothing deployed.

## Use this release

This release supersedes `t3labs-apex-final-mobile-sweep.zip`. The input was extracted afresh and kept unchanged for comparison; the preview was rebuilt from this release's actual source, not merely relabelled.

**This remains a lean application export, not the full Next.js repository.** Its original integration base is commit `8e921255d92da45d880cd205dee1603d1ba7eec5`. Merge into the agent's current complete repository and preserve unrelated newer work. Do not delete missing files or replace the repository with this export. The full ZIP contains all files in the supplied lean export plus the new fixes. The changes-only ZIP is incremental **against the preceding final-mobile-sweep ZIP**, not against the agent's original application. Use the full lean export when earlier changes have not been merged.

Start at `/demo/roofing-site`. The offline HTML is only a review harness, never the production landing page.

## Actual issues reproduced and fixed

### Mobile, tablet, landscape and keyboard-sized layouts

The previous baseline had overlapping helper/assistant panels at 768px and 844px widths. At a 390×320 visible viewport, the helper's decorative header consumed its available height and the next instruction was outside the visible panel.

- Below 980px, open chat and the helper now occupy separate measured regions. This includes tablets and phone landscape, not just narrow portrait phones.
- In short viewports, decorative helper rows give way to the instruction and the full-width **Hide guide** control. The guide is not automatically hidden.
- The current instruction is scrolled into view when the task/assistant phase changes. A previously clicked button cannot leave the new instruction above the scroll position.
- Chat closes/reset/send/voice controls have 44px touch targets on these layouts. Mobile no longer presents redundant position/reset/minimise controls beside Close. Desktop dragging is retained.
- Preparing a suggested question does not force the mobile keyboard open. The visitor taps the input to edit, or presses Send. Actual OS keyboard behaviour still needs physical-device checks.
- Dragging the assistant on desktop keeps the whole panel inside the window, not just its header.

The approved 65% glass helper, lime effects, solid black Business Dashboard button, manual Hide/Show and no-outside-click-dismiss behaviour remain intact.

### Enquiry continuity

- Closing and reopening an enquiry for the **same estimate** preserves typed contact fields, notes, selected file metadata and the preview confirmation.
- Data remains in component memory only: no new local/session storage of contact details, no uploads or email sends. Navigating away/unmounting still ends this temporary draft.
- Changing the roof inputs resets that enquiry so a previous contact/confirmation is not attached to a different estimate.
- Long email addresses, notes and file names wrap on narrow screens.
- Returning from an enquiry focuses and scrolls to the estimate result.
- The shortcut's result explicitly identifies the pre-filled example and offers **Review every roof choice**. The sample's replacement and flat-extension assumptions are visible. Duplicate shortcut wording is removed.

### Dashboard return and the closing invitation

- A visible **Back to Apex Roofing** and **Roof tools** navigation strip now belongs to `ApexDemoShell`, outside the hideable guide. Hiding the helper cannot hide the return route.
- Visiting the optional dashboard early and returning resumes the first untried core task. Returning after the core tour shows its finish state; existing completion statuses and manual visibility are preserved.
- Exact admin paths, trailing slashes and child routes are recognised. Unrelated `administrator`/other-supplier paths are not.
- The dashboard opens directly from its CTA or task-menu item. No second “open dashboard” action is shown at the destination.
- The once-per-tab closing invitation policy is unchanged. An already-dismissed invitation does not reappear after the dashboard. Early dashboard exploration does not consume or lose the eventual invitation.

**The real admin implementation is still absent from the latest export.** The established integration destination is `/supplier-pricing-tool/apex-roofing/admin?demo=helper`; verify it in the agent's current full repository. The offline preview deliberately shows a “needs the running website” screen, not a fake admin panel. This sweep verifies the route transition, navigation shell and state behaviour, not the admin's authentication/data controls. Do not restore old admin code blindly or disable authentication to make a demo work.

### Overlay and microphone lifecycle

- Intro, closing invitation, chat and chat-reset confirmation use a shared reference-counted scroll lock. Dismissing one surface no longer unlocks the page beneath another.
- Chat reset is a native modal above the helper. Escape closes only that confirmation or invitation, not the assistant beneath it. Focus is restored.
- Chat and Quick Estimate enquiry surfaces have separate owners. Closing chat cannot make an open quote enquiry disappear from the conversion coordinator's state and trigger the invitation too early.
- Closing/unmounting voice-enabled chat explicitly stops recognition and prevents its `onend` handler restarting listening in the background. This was tested with a recognition mock, not a real microphone permission session.
- Reduced-motion mode now disables launcher enlargement, not just its transition. Increased-contrast mode retains opaque backgrounds.

## What did not change

- Exact offer: **What if you could have solutions like this for $999?**
- Intro/closing positioning, three-task strategy, freeform chat, prepared-but-not-sent examples, booking destination and deliberate final-benefit acknowledgement.
- Roof geometry, all physical quantity calculations, agreed size/pitch bands, pricing algorithms, supplier catalogue and product rates. Hash checks against the input archive verify those files were preserved.
- The three locally bundled roofing-material images. These are generated photographic-style visual examples, not photographs of specific merchant products. No new abstract replacement swatches were introduced.
- No dependency/lockfile updates, new analytics provider, backend route implementation or deployment.

## Verification actually completed on this release

| Check | Result |
| --- | --- |
| Isolated Node suites: conversion, flow, admin/materials, final sweep | **82 passed, 0 failed** |
| Strict TypeScript on changed framework-independent helper/conversion/draft logic | **Passed** |
| Rebuilt preview source modules | **51 transpiled, 0 syntax diagnostics** |
| New focused browser suite | **25 named scenarios, 245 assertions passed, 0 page errors** |
| Updated pre-existing browser layout regression | **215 assertions passed, 0 page errors** |
| Updated pre-existing browser interaction regression | **36 assertions passed, 0 page errors** |
| Full supplied wildcard Node command | **82 pass, 7 suites fail at import because export dependencies are omitted** |
| Full production build | **Blocked: `next` is not installed in this lean export (`next: not found`)** |
| Project-wide TSX typecheck/lint, live assistant, actual admin, real devices | **Not verified** |

Environment: Node 22.16.0, TypeScript 5.8.3, headless Chromium 144.0.7559.96 through Playwright. Counts are checks, not independent users or live conversations. Results and runnable scripts are in `verification/verified-final/` and `verification/check-final-sweep.py`.

The nine panel viewports are 320×568, 360×640, 390×844, 430×932, 768×1024, 844×390, 1024×768, 1440×900 and 390×320. Four complete shortcut→enquiry→closing→admin-placeholder→return journeys passed. Additional full homeowner questionnaires passed for pitched, flat GRP and mixed pitched/EPDM roofs, including editable enquiries and resetting a draft after roof changes. Other scenarios cover overlap, explicit Hide/Show, native Escape/focus, mock speech stop, long text and reduced-motion/contrast.

### Important preview/test limits

The review harness is offline React 18.2, not the full React 19 / Next 16 application. It uses actual supplied homepage, guide, modal and estimator source around explicitly retained fixtures for missing assistant subcomponents, the pitch helper and sample runtime allowances. Successful assistant replies in the older interaction tests are injected TEST-ONLY stream fixtures. No live assistant response is fabricated in the customer-facing preview.

The host runtime blocks local HTTP/file navigation. Browser checks therefore use Playwright `set_content`; the new focused suite uses a labelled in-memory storage shim to test the tab-state contract. Hash-based Back/Forward is exercised, but **real-origin storage persistence/reload is not verified**. A shortened/offset `visualViewport` is simulated; this is not an iPhone keyboard. No real emails, uploads, invitations or bookings were made. The builder and reports disclose retained fixture modules. Do not use preview fixture rates as price-calibration evidence.

## Agent integration / release gates

1. Merge current files into the full repository, preserving newer agent work. Review `VERIFIED_FINAL_CHANGE_MANIFEST.json` and keep the new `lib/demo-helper/scroll-lock.ts` with its callers.
2. Ensure the actual Apex admin route uses the shared `ApexDemoShell` exactly once (never mount duplicate helper/conversion coordinators). The shell provides the return links. Confirm safe demo authentication, isolated pricing/trade edits and labelled example activity. A URL alone is not authentication.
3. Test late and early admin visits, direct entry, browser Back, both explicit return links, guide hidden, final invitation and reload on the real origin. Keep it once per visit; no back-button traps or repeat dismissals.
4. Run the full project's normal automated tests, typecheck, lint and production build. The export omits `tests/ts-resolve.mjs`, full-app data and components needed by seven original suites; use the complete repository's versions rather than fixture them into production.
5. Test both assistant tasks live with Apex's configured prices, freeform questions, errors/retries, unsent-draft protection and the real assistant enquiry. Confirm the current project's EnquiryPanel contract with the launcher.
6. Test an unfamiliar user's full questionnaire as well as the shortcut, including flat and mixed roofs, pitch warnings, contact validation, selected files and returning to results. All fictional Apex enquiry surfaces must stay demo-safe. **Inspect the omitted `/api/site-enquiry` endpoint**; do not assume it is simulated. Genuine T3 booking/contact destinations remain real.
7. On actual iPhone Safari and Android Chrome, test keyboard opening/closing, rotation, scroll/zoom, hidden/show guide and microphone permissions. Verify background listening ends when chat closes. Check desktop dragging and keyboard focus with the real app's global styles.
8. Confirm the approved $999 copy and active 20-minute booking destination. Measure actual completion time before advertising a guaranteed two-minute tour. Keep call-link clicks distinct from completed bookings in consent-managed analytics.
9. Report remaining issues. **Do not deploy without owner approval.**

### Commands for the isolated checks

```sh
node --experimental-strip-types --test tests/conversion.test.mjs tests/flow-refinement.test.mjs tests/admin-materials-polish.test.mjs tests/final-sweep.test.mjs
python verification/check-final-sweep.py /absolute/path/to/apex-verified-final-preview.html
FLOW_LAYOUT_ONLY=1 python verification/check-flow-preview.py /absolute/path/to/apex-verified-final-preview.html
FLOW_FOCUS=1 python verification/check-flow-preview.py /absolute/path/to/apex-verified-final-preview.html
```

Python checks require Playwright and a Chromium executable (override `CHROMIUM` when necessary); they are not part of the production application. Their output locations can be set with `FINAL_EVIDENCE` / `FLOW_EVIDENCE`.
