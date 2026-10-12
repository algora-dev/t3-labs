# T3 Labs Apex Roofing Demo (lean handoff package)

Source: t3-labs repo, main tip, commit 8e921255d92da45d880cd205dee1603d1ba7eec5 (packaged 2026-10-11). This is the Apex Roofing demo exactly as integrated, including the T3 Demo Helper and guided tasks. This zip is the handoff base for the next round of external changes. The commit SHA above is the 3-way merge base for the return handoff.

## Current release: independently verified final sweep (11 October 2026)

Start with **[VERIFIED_FINAL_HANDOFF.md](VERIFIED_FINAL_HANDOFF.md)** and `VERIFIED_FINAL_CHANGE_MANIFEST.json`. This supersedes the previous mobile sweep. It fixes actual tablet/landscape/keyboard overlap, preserves same-estimate enquiry drafts, adds dashboard return navigation outside the guide, resumes the tour after admin exploration, and corrects modal/scroll/microphone lifecycle issues. No pricing or geometry changes.

Current verification: 82 isolated tests; 25 focused browser scenarios / 245 assertions; 251 existing browser regression assertions; scoped strict TypeScript and 51-module syntax rebuild. No JavaScript page errors. These are offline component-harness checks, not live backend/admin or full-app build verification. Seven original suites remain import-blocked in this lean export. See the handoff for exact boundaries and mandatory live integration checks. Older sections below are historical.

## Earlier: final flow refinement (11 October 2026)

Start with **[FLOW_REFINEMENT_HANDOFF.md](FLOW_REFINEMENT_HANDOFF.md)** and `FLOW_CHANGE_MANIFEST.json`. This adds one-button optional assistant examples, explicit send/reply guidance, mobile panel coordination, automatic chat closing when entering Quick Estimate (without clearing it), a focused sample and enquiry shortcut, and a deliberate final-benefit transition. The helper still only hides manually. The exact $999 offer, approved T3 styling, measurement engines and product prices are preserved.

Validation for this refinement: 61 isolated tests, scoped strict TypeScript, and 251 Chromium preview assertions across two batches pass. This is not a full application build or live assistant verification. See the latest handoff for the seven original import-blocked suites and missing full-app checks. Older gates below describe historical integrations, not this patch.

## Conversion journey update (11 October 2026)

See **[CONVERSION_DEMO_HANDOFF.md](CONVERSION_DEMO_HANDOFF.md)** for the new opening/closing modals, shorter tasks, optional calculated example and the exact verification boundaries. A fresh visitor now sees the introduction before the helper; the older helper-welcome description below describes the base export. The original integration gates below apply to that base, not proof of a full-app build for this update.

This is still a lean subtree. Merge it into the full application; do not delete omitted files or deploy the standalone review HTML.

## Apex site routes

- /demo/roofing-site - demo landing with the three estimating options and guided entry
- /demo/roofing-site/estimate - existing detailed estimate entry
- /demo/roofing-site/quick-estimate - Quick Roof Estimate (deterministic /api/quick-roof-estimate, SVG roof plan illustrations: 10 shapes x 5 size bands, simplified homeowner enquiry flow)
- /demo/roofing-site/price-list - Apex price list view
- /demo/roofing-site/takeoff - redirects to the plan entry flow (?entry=plan)
- /demo/roofing-site/walkthrough - redirects home (the Demo Helper supersedes it)
- /demo/roofing-site/[...slug] - content pages driven by data/apex-roofing/website-pages.json

## T3 Demo Helper

Floating T3-branded guide across all demo pages: 65 percent glass dark panel with backdrop blur and solid fallback, lime hover accents, draggable on desktop with keyboard move and reset, explicit Hide/Show only (never auto-dismisses), centred welcome auto-opens on landing, progress persists across routes via the demo store. Three guided tasks, advanced tool links, optional admin surface.

## API routes

- /api/quick-roof-estimate - deterministic quick estimate
- /api/ballpark-enquiry - deliberately NOT called by the demo (simulated pre-filled enquiry, no emails sent)
- /api/roofing-region - region data

## Layout of this package

- app/demo/roofing-site - routes, layouts, demo CSS
- app/api - the three demo API routes
- components/demo-helper - Demo Helper UI (launcher, panel, tasks)
- components/demo-journey - guided journey components
- components/quick-estimate - Quick Roof Estimate UI
- components/demo-sites - Apex site config and pages (act-roofing config, apex content pages, demo strip)
- lib/demo-helper, lib/demo-journey, lib/quick-estimate - demo stores, types, estimate logic (apex profile)
- data/apex-roofing/website-pages.json - content pages data
- Shared repo deps included for context: lib/pricing/rules, lib/assistant/types, app/supplier-pricing-tool types + pricing + supplierDefs/apex-roofing, components/assistant/SmartAssistantLauncher (mounted by the demo layout)
- tests - the seven demo test suites (node:test)
- public/assets - logos and helper imagery referenced by the demo
- package.json - dependency context

## Running notes

- This is the demo subtree extracted from the t3-labs Next.js repo, not a standalone app. To run it live, drop these files into a t3-labs checkout at the same paths, npm install, npm run dev, then open http://localhost:3000/demo/roofing-site
- OPENAI_API_KEY is needed for the walkthrough assistant task. Without it that task degrades.
- Seven covering systems have configured fictional demonstration rates, subject to the estimator’s visible scope exclusions. The offline preview also needs documented fixtures for omitted runtime modules; use the full application to validate its actual rates.
- Gates used on integration: node:test suites all green, typecheck clean, scoped eslint clean on demo files, production build passes, all demo routes 200 with the intended redirects.
