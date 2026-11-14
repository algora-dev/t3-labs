# IMPORTANT: Compact delivery format

This package contains the **complete supplied Next.js source-code tree** and **all new V18 and Phase 3 V5 visual assets**, with only unchanged legacy `public/` media excluded to keep the download small. The excluded media already belongs to the user's existing GitHub repository and must be preserved there. The omitted paths are listed in `LEGACY-PUBLIC-ASSETS-RETAIN-IN-GITHUB.txt`.

**DO NOT deploy this archive as a replacement repository.** Pull current GitHub `main`, make a branch, and merge the approved files. Existing images/media must remain in place. This is an alternative to the previous 39 MB delivery, which the user could not download. The new pages' images, code, styles, API, and tests are all included; no HTML design previews are included.

# T3Labs: Unified production implementation handoff (V18 + Phase 3 V5)

**Read this file first.** This ZIP is a **single consolidated Next.js source project**, not an HTML prototype. It combines the approved **V18 homepage and Free Business Review** with the final **Phase 3 V5 six roofing acquisition pages**. Source is from the originally supplied November 11, 2026 repository snapshot, with the two approved code updates merged. This archive is **not** a clone of current GitHub HEAD and must not be deployed by replacing the live repository wholesale.

## 1. What to deliver

Implement all seven public page surfaces and the written-review form together:

| Route | Implementation | Approved baseline |
|---|---|---|
| `/` | `app/page.tsx`, `components/t3-rebuild/` | V18 homepage |
| `/free-review` | `app/free-review/page.tsx`, `components/t3-rebuild/FreeReview.tsx` | V18 review form |
| `/roofing-website-design` | `app/roofing-website-design/page.tsx` | Phase 3 V5 |
| `/roofing-seo` | `app/roofing-seo/page.tsx` | Phase 3 V5 |
| `/roofing-website-estimators` | `app/roofing-website-estimators/page.tsx` | Phase 3 V5 |
| `/roofing-quoting-software` | `app/roofing-quoting-software/page.tsx` | Phase 3 V5 |
| `/roofing-ai-website-assistants` | `app/roofing-ai-website-assistants/page.tsx` | Phase 3 V5 |
| `/roofing-business-automation` | `app/roofing-business-automation/page.tsx` | Phase 3 V5 |

The shared Phase 3 implementation is `components/t3-phase3/ProblemLanding.tsx`, `problem-pages.json`, `phase3-base.css`, `problem-landing.css`, and `public/assets/t3-phase3/`. The V18 homepage styles are `app/t3-rebuild.css` and local assets in `public/assets/t3-rebuild/`. The six Phase 3 pages use the same approved header and visual system.

## 2. Merge into current GitHub safely

1. Pull the latest GitHub `main` and create a feature branch. Compare the current app to this supplied snapshot. **Do not replace the live repo with this ZIP or delete newer code.**
2. Merge the V18 homepage, review form and email endpoint first, then the six Phase 3 routes, shared components and assets. This package already contains the two sets together; do not reapply old patches on top of it.
3. Merge `app/sitemap.ts`: this unified package includes `/free-review` and **all six** new roofing routes. Preserve all other current sitemap routes.
4. Preserve existing demo routes, quoting software, marketing pages, legal pages, blog, customer sites and unrelated integrations. Check collisions with `/roofing-solutions`, `/roofing-business-tools`, `/custom-software`, and older redirects. The new six URLs must each resolve to one canonical page.
5. Compare rendered screenshots at 1440, 768, 390 and 320 pixels to the approved V18 homepage and Phase 3 V5 visual baselines; **do not redesign**. Design standard: Inter, ink `#0A0B10`, dark `#111318`, paper `#FBFCFF`, lime `#D7FF00`, accessible lime ink `#5F7000`; no bright-blue accents. Keep the hero and tools visuals, expandable About, pricing, FAQs and video-ready proof panels.
6. Verify navigation, anchors, package/tool expanders, FAQ disclosures, all demo links, CTA preselection, and form/call routes. Check keyboard navigation, no horizontal overflow, meaningful image alt text and mobile header.

## 3. Real enquiry delivery

- POST endpoint: `app/api/free-business-review/route.ts` (server-side, no `mailto:`).
- Recipient: **`insights@t3labs.tech`**. Set `REVIEW_NOTIFY_EMAIL=insights@t3labs.tech`.
- Use existing Resend integration and secret `RESEND_API_KEY`; set `REVIEW_FROM_EMAIL` to an approved **Resend-verified** sender domain. Do not put credentials in Git.
- The written review promises a **reply within 48 hours**, fulfilled by a real team member. No invented automated review.
- Verify success **and** failure paths: show success only when the email service accepts the message; preserve error and retry handling. Confirm reply-to address and topic/package context arrive correctly.
- Existing legacy routes may still send to `insights@t3labs.co.uk`; review carefully before changing them, without breaking demo/client-specific destinations.
- Production-grade distributed anti-abuse protection is still required. The provided honeypot and per-instance throttling are not sufficient by themselves across Vercel instances.
- Call option goes directly to **https://calendly.com/insights-t3labs/20-minute-meeting**; verify this remains the approved booking destination and works on mobile.

## 4. Search visibility and content integrity

- All six Phase 3 pages have unique metadata, canonical URLs, answer-first headings and server-rendered body content, real examples, and a proof/video position immediately after the opening answer.
- The current `app/sitemap.ts` has the six Phase 3 URLs added. Confirm production `robots` settings, indexing, canonical URLs, structured data only when truthful, and cross-links to pages from an appropriate discoverable site section. **Sitemap alone does not make a page discoverable to humans.**
- Keep the genuine images until real video is supplied. The shared `ProblemLanding` renders a video iframe only when a verified `page.video.embedUrl` is present. Never create fake play controls or claim a recording exists. Add accurate captions, transcript, thumbnails and any video structured data later.
- Check every statistic and source URL before launch; no unverified guarantees of AI citations, rankings, leads or conversion uplift. Confirm consent/rights to show any client examples.
- Owner approval required for from-US$299 / US$899 package scope, inclusions, exclusions, recurring costs, 10-day programme claims, team biographies, 35+ years combined and geographic coverage.

## 5. Quality gates before production

Run in the latest merged repository:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npm test
```

Then run browser end-to-end and visual regression checks at 1440, 768, 390 and 320 widths. Confirm all eight page routes, links and interactions, real form delivery, failed delivery, Calendly, images, metadata, sitemap, canonical tags, accessibility and production environment variables. Check existing routes have not regressed. Deploy to staging first, collect screenshots and a test report, and open a PR for approval. Only then deploy production and run live smoke tests. Set up Search Console, analytics and enquiry/booked-call event tracking.

**Validation performed on this archive:** 14 targeted Node tests passed (V18 source/email + Phase 3 V4/V5 contract tests). The repository's separate `tests/inquiry-preview-route.test.mjs` cannot run directly in this environment's Node 22.16 because it imports a `.ts` route without the project's required loader; this is an environment/test-runner issue and is **not a passed test**. Full `npm ci`, Next.js production build, actual email delivery, deployment and live-browser parity were **not performed** here. They are release blockers for the agent.

## 6. Source contents and boundaries

This ZIP contains the **full supplied Next.js source snapshot with both approved feature sets merged**, including original demos and vendor assets, rather than a small patch. It intentionally excludes separate standalone HTML previews; the legacy top-level `index.html` from the old snapshot was omitted because it is not part of the Next.js App Router implementation. The original archive was itself pruned of some production media and private files, so GitHub remains the source of truth for missing or newer assets. No `node_modules`, `.env` secrets or live credentials are included.

**No homepage or Phase 3 video is supplied yet.** Add the approved recordings later; don't hold the text/image pages back solely for video.

## 7. Final deliverables expected from the implementation agent

- PR against current GitHub HEAD with a readable change summary and any merge decisions.
- Passing production build, typecheck, lint, tests and browser QA report.
- Desktop/mobile screenshots showing parity with approved V18 and Phase 3 V5 designs.
- Evidence that an actual written enquiry reaches `insights@t3labs.tech` and that the Calendly link works.
- SEO/indexability audit and a list of any unverified commercial claims or permissions needing owner sign-off.
- Staging URL for approval, then production URL and post-launch smoke test results.

**Do not substitute an HTML preview, rewrite the design, or publish until these gates pass.**
