# T3 Labs Marketing Site - External Audit Handoff

## What this is

A lean, build-verified extraction of the T3 Labs marketing website (https://www.t3labs.tech) for external review and improvement. Everything in this folder is the real production code, cut from the full repo at commit `394d718` (origin/main, 2026-11-16) with non-marketing surfaces removed. `npm run build` and a live render smoke test of all key pages passed on this exact folder before zipping.

## How to run

```
npm ci
npm run dev
```

Open http://localhost:3000. No env vars are needed for the marketing pages to render. Email-sending APIs (contact form, enquiries) will not deliver without provider keys; ignore that locally.

Before handing back: `npm run build` and `npm run typecheck` must both pass.

## In scope for review (public marketing pages)

- `/` homepage (V18: legacy index.html rendered via app/page.tsx + public/styles.css + public/script.js, hero video with native controls)
- `/solutions` solutions hub, `/custom-roofing-software`
- `/our-solution` (+ `/referred` variant)
- `/roofing-solutions` hub + six answer-first service pages: `/roofing-website-design`, `/roofing-seo`, `/roofing-website-estimators`, `/roofing-quoting-software`, `/roofing-ai-website-assistants`, `/roofing-business-automation` (each also has a `/referred` variant under roofing-solutions and roofing-business-tools)
- `/contact`, `/free-review` (free review funnel)
- `/pricing-calculator` (+ `/referred`), `/roofing-business-tools` (+ `/referred`)
- `/custom-software`, `/ai-automation`, `/ai-consultancy`, `/ai-help`, `/ai-implementation`, `/ai-training`
- `/blog` + `/blog/[slug]` posts, `/case-studies/quotecore`, `/careers`, `/qcp-careers`
- `/business-audit` product page + its flow (contact, success, legal sub-pages)
- `/sales-hub`, `/sales-resources`
- Legal: `/privacy`, `/terms`, `/cookies`, `/service-terms`, `/website-package-terms`
- Shared chrome: header, footer, T3 site assistant (T3AssistantLauncher), analytics, robots.ts, sitemap.ts

Present but NOT part of this audit (outreach personalization infrastructure, skip them): `/hello/[slug]`, `/custom-proposal`.

## Excluded on purpose (do not expect these)

- `/proposal/*` client proposal micro-sites
- `/demo/*` demo sites including the Apex roofing demo, plus the Apex and Roofline demo assistant stacks (components/assistant, components/demo-*, lib/assistant, lib/demo-*, lib/pdf, lib/pricing, quick-estimate)
- `/contractor-template` and `/contractor-template-premium`
- `/supplier-pricing-tool` (per-supplier tool instances + takeoff workstation)
- `/dashboard` and `/[workspaceSlug]` auth'd app internals
- Repo-local tests, docs, scripts folders

Some links may point at excluded routes and 404 locally. That is expected.

## Constraints for your changes

1. Do NOT restructure the repo, rename files, or move routes. Edit in place so changes port back cleanly.
2. Do NOT add new dependencies unless strictly necessary. Flag any you add in your changes summary.
3. Do NOT use em dashes in any user-facing copy. Use commas, full stops, or restructure the sentence. Hard brand rule.
4. `npm run build` and `npm run typecheck` must pass.
5. Keep the existing design language. The homepage is the type and spacing reference standard. T3 brand green is `#d7ff00` (accents, mostly on dark surfaces).

## How to hand back

Option A (preferred): zip this entire folder after your changes (exclude node_modules and .next) plus a `CHANGES.md` at the root listing every file you touched with a one-line reason per file.

Option B: zip only changed/new files, preserving their full relative paths from this folder root, plus the same `CHANGES.md`.

Either way we port your changes back into the full production repo and deploy. Your extraction base is commit `394d718`. Reference it in your summary.
