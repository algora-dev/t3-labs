> **FINAL RELEASE:** This is historical/background documentation. For approved live/retired/noindex URL decisions and agent instructions, see [`FINAL-SEO-RELEASE.md`](FINAL-SEO-RELEASE.md).

# T3 Labs marketing alignment, implementation handoff

**Base**: `394d718` (`origin/main`, 2026-11-16), marketing-only extraction from `README-HANDOFF.md`.  
**Phase**: 1, strengthen the pages intended for public search.  
**Status**: Code edited and static regression tests passed. **Not deployed.** Full Next build/typecheck still required in your agent's environment.

## Non-negotiables followed

- No marketing routes removed, renamed, redirected or deindexed.
- No changes to referral/proposal pages, user-specific URLs, pricing calculator, audit application, sales pages, legal pages or /10-day-business-upgrade.
- No API changes, new runtime dependencies or changes to form submission.
- Homepage is the V18 visual standard; the 10-day upgrade remains the second visual reference. New components use existing `t3-rebuild`, `t3s` and `rwd-v5` classes, Inter, lime `#d7ff00`, dark charcoal, bright white surfaces and the current radius/spacing conventions.
- No unverified lead-performance metrics, review scores, quotes won, customer testimonials or invented video transcript.
- No new public slugs. Public `/solutions` is the primary solutions hub.

## Modified and added files

- `app/layout.tsx`: Aligned default title, meta description, keywords and organisation/service structured data with roofing lead quality, quoting and admin outcomes. Preserved registered company/location facts.
- `app/page.tsx`: Aligned homepage Open Graph title with the existing roofing-first message, without changing the layout.
- `components/t3-rebuild/HomepageContent.tsx`: Focused the homepage eyebrow and introductory language on roofing-first business problems; left the existing team video and V18 composition intact.
- `components/t3-rebuild/solutions.ts`: Added one shared four-outcome taxonomy while preserving the seven existing canonical service routes.
- `app/solutions/page.tsx`: Rebuilt the hub around better-fit leads, conversion, quoting and admin; embedded the existing video; added relevant demos, deep links and a clear review CTA.
- `components/t3-rebuild/solutions-pages.css`: Added responsive outcome, grouping and video-support styles using the approved Inter, dark surfaces and #d7ff00 accent.
- `components/t3-phase3/problem-pages.json`: Added a unique, concrete scenario, improvement and measurement suggestion for each of the six specialist service pages. Kept the original demos, descriptions and facts.
- `components/t3-phase3/ProblemLanding.tsx`: Added structured data, unique practical examples, a self-check action and the existing proof statement to the reusable roofing page renderer.
- `components/t3-phase3/problem-landing.css`: Styled the new scenario and self-check sections in the established rooftop marketing visual system.
- `components/t3-rebuild/FreeReview.tsx`: Clarified the benefit of the review in the existing funnel hero; left form fields, API and submission behaviour unchanged.
- `app/free-review/page.tsx`: Improved roofing-first SEO metadata for the review page.
- `app/custom-roofing-software/page.tsx`: Added a concrete measurement-to-quote workflow and targeted links; fixed existing corrupted arrow text; removed generic custom software link from the related section.
- `app/blog/page.tsx`: Made a roofing-first guide hub with shared header/footer, featuring five relevant existing posts while preserving the other eight in a visible archive.
- `app/blog/[slug]/page.tsx`: Swapped the legacy mini header/footer for the shared brand chrome; added a roofing CTA and prioritised relevant related reading. Preserved article content and URLs.
- `app/case-studies/quotecore/page.tsx`: Added shared header/footer, changed the CTA to a roofing workflow problem, and linked to canonical custom roofing software. Kept claims and the intake mechanism.
- `tests/marketing-content.test.mjs`: Added dependency-free checks for six services, video, seven canonical slugs and preservation of legacy/referral routes.
- `CHANGES.md`: Recorded per-file changes, QA status, constraints and porting instructions.
- `URL-DECISIONS.csv`: Recorded route actions for current and later phases, including private and campaign URLs.
- `SEO-NEXT-PHASE.md`: Documented deferred indexing, redirects and removal plan, decision gates, GSC caveats and deployment checks.

## Key UX changes

1. `/solutions`: four outcome pathways, seven canonical services, the existing YouTube overview (`FIqNbi3bG7A`) embedded without autoplay, practical links, a clear free-review CTA.
2. Six roofing specialist routes: each retains its approved service content but now offers a unique roofing scenario, an actionable self-check, how to assess improvement, and source-backed evidence where the original page provided it.
3. `/blog`: five roofing-relevant guides featured first; all remaining archive posts remain accessible at their existing URLs. Article pages now have consistent site navigation and a roofing next-step CTA.
4. QuoteCore+ case study: branded navigation, canonical links and a roofing-specific action.
5. Free review: clarified outcome, preserved input and API contracts.
6. Global metadata: roofing-first with construction as an additional audience.

## Verification in this environment

- `node --test tests/marketing-content.test.mjs`: **5/5 passed**.
- Syntax-transpilation of 12 modified TypeScript/TSX modules using TypeScript 5.8.3: **0 diagnostics**.
- JSON parsing of the six specialist pages: **passed**.
- `npm ci --offline --ignore-scripts --no-audit --no-fund`: **cannot complete**, npm cache lacks the `zwitch@2.0.4` archive (`ENOTCACHED`). The regular dependency install stalled on registry access and was stopped.
- `npm run build`, `npm run typecheck`, responsive screenshot comparisons and live interaction smoke tests: **not run**, because dependencies were not installable in this environment. These are required before deployment. Do not claim production-ready build validation from the checks above.

## Agent port and validation steps

1. Start from the full live repository, back up the current branch and reconcile against extraction base `394d718` before applying changed files; do not overwrite newer full-repository changes without review.
2. Apply the modified/new files preserving the same relative paths. The patch ZIP is designed for this. Original excluded `/proposal/*`, `/demo/*`, apps and dashboard internals are not supplied.
3. Run `npm ci`, `npm run typecheck`, `npm run build`, `npm test` (if original full repo contains other tests, keep and run those too).
4. Run the built application and inspect at mobile (375px), tablet (768px) and desktop (1440px). Compare site header, white/dark section rhythm, buttons, text scale and media cards with `/` and `/10-day-business-upgrade`.
5. Verify `/solutions` YouTube embed and source video **editorially** against the new copy, and check its permission/availability in target markets. Do not publish a fabricated transcript.
6. Smoke test review form preselection, email/API delivery with real configured secrets, external demos, related links, all referred variants, the campaign page, and existing proposal-specific links in the full repo.
7. Confirm canonicals, the desired organisation data, schema, meta descriptions, and accessibility/focus behaviour in deployed HTML. Check that no title/H1 is truncated on mobile.
8. Do not run route deletion, 301/410 redirects, slug renames, or broad `noindex` decisions until phase 2/3 has been approved. See `SEO-NEXT-PHASE.md` and `URL-DECISIONS.csv`.

## Decisions reserved for the owner

- Confirm the primary commercial geographies and currency presentation before globally changing USD/UK/US/Australia copy or pricing promises.
- Approve the edited story around video `FIqNbi3bG7A` after watching it. Existing code references this exact ID, but video content was not playable in the offline audit environment.
- Approve public versus genuinely confidential referral/proposal access rules. `noindex` is not privacy protection.
- Supply GSC indexed URL inventory and page-level performance/backlinks before deleting, noindexing or redirecting any existing marketed URL.

## Note on affected JSON data

The six service entries in `components/t3-phase3/problem-pages.json` were expanded by one `example` object each. The file was reserialised with the same data, order and page keys. No existing service copy, links or API configuration was removed.
