# Roofing Business Upgrade availability

**The one value to change is `spotsAvailable` in `config/roofing-upgrade-cohort.json`.**

- 10 spots left: `"spotsAvailable": 10`
- 9 spots left: `"spotsAvailable": 9`
- 0 spots left: `"spotsAvailable": 0`

Commit, build and deploy after each manual update. `GET /api/roofing-upgrade/availability` reads this configuration and the page updates **all** `[data-spots-remaining]` elements (hero, package-detail modal, footer). No copy/paste into HTML is needed. Only reduce the count after a place is **confirmed and paid**, not when somebody requests it. Do not let the displayed count become stale.

The SQL `confirmed_count` column can be used for back-office reporting, but **is not the display source** in V13. Never change only that field and expect the site to update.

`node scripts/roofing-upgrade/generate-preview.mjs` regenerates a standalone HTML preview from the **identical deployed HTML and this configuration**, replacing only the live APIs with mock responses. The preview is not deployed and sends no real requests.

For a future cohort change the cohort ID, introductory/later pricing phase and page copy together, and create its corresponding cohort record in Supabase. New cohort prices must be approved before publishing.
