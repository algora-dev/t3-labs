# Agent integration checklist — Phase 2

## Apply

1. Use Phase 1/full repo as the baseline. Overlay the Phase 2 patch archive, keeping its paths exactly. Do not replace or delete any production-specific files missing from the marketing-only extraction.
2. No slug changes, redirects, route deletions or `noindex` changes are authorised by this patch.
3. Read `PHASE2-CHANGES.md`; cross-check the changed files listed in the patch.
4. Production environment may have runtime/server modules that were excluded from the extraction: do not overwrite or assume they are identical.

## Required commands (on a dependency-connected machine)

```sh
npm ci
npm run test
npm run typecheck
npm run lint
npm run build
```

Fix build, lint and TypeScript errors before releasing. Previous local dependency installation stalled; no green production build is claimed.

## URL / experience smoke checks

- `/`, `/solutions`, all six canonical `/roofing-*` pages, `/custom-roofing-software`, `/case-studies/quotecore`, `/blog`, `/free-review`, `/contact`.
- **Preserve** old `/ai-*`, `/our-solution`, `/roofing-solutions`, `/roofing-business-tools`, `/custom-software`, `/pricing-calculator`, `/business-audit`, staff and campaign routes.
- **Preserve** `/our-solution/referred`, `/roofing-solutions/referred`, `/roofing-business-tools/referred`, `/pricing-calculator/referred`, `/hello/[slug]`, private proposals and link-specific sales pages.
- Check the 10-day campaign public asset and its CTA flows.
- Confirm mobile layout and keyboard focus at 375px, 768px, 1440px, plus reduced-motion preference.
- Check live form submission `/api/free-business-review` and email/CRM delivery using safe test data; success is shown only for a successful HTTP result.
- Test the existing video ID `FIqNbi3bG7A`: no YouTube iframe until click; click opens correct video; verify spoken words match roofing focus.
- Open the service demos, QuoteCore+ website and external RoofHub example; confirm accuracy and permissions.

## Search / analytics QA

- `/sitemap.xml` should list **18 URLs** (13 main + 5 chosen articles), without the generic AI pages. Check the actual rendered sitemap, not just source.
- Compare `<link rel="canonical">` and index directives with the intended live routes. Sitemap omission does **not** mean `noindex`.
- Confirm root pages emit Organisation/WebSite structured data and specific service pages emit their own applicable Service markup, without duplicate sitewide Service markup.
- Check `/og-roofing.png` in link previews; ensure 1200 × 630.
- Check browser console/GA4 DebugView for `video_open`, `solutions_to_service_click`, `demo_click`, `service_to_review_click`, `book_call_click`, `review_form_submit_success`, and verify none sends PII or confidential identifiers.
- Check behaviour with consent preference `cookie_consent=essential`; custom events must be suppressed. Review default analytics consent handling separately before launch.
- Verify real OAI-SearchBot and Googlebot access at CDN/WAF level as appropriate, without exposing sensitive proposal pages.
- Recheck known GSC `/blog` and key roofing article statuses and re-submit after improvements if appropriate. Indexing/rankings are not guaranteed.

## Decisions still needed from site owner (not silently assumed)

- Primary market, pricing currencies and public offer/starting price policy.
- Approval of project screenshots, attribution/client references, video summary/captions.
- URL-level GSC performance/backlink review before noindex/delete/redirect actions.
- Confidential proposal access-control requirements (robots and noindex are not security).

## Rollback

Keep the Phase 1 patch or original commit as the rollback point. If metadata/sitemap issue is detected, restore the old `app/sitemap.ts` / relevant metadata and re-test; if form or proposal workflow fails, abort deployment and restore prior build. Do not delete legacy routes as part of rollback or this phase.
