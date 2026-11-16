# HANDOFF FIRST — T3 Labs roofing-first URL release

Read **`FINAL-SEO-RELEASE.md`** for the complete decisions and acceptance tests; **`docs/FINAL-URL-REGISTER.csv`** for every known URL classification.

- This build includes Phase 1, Phase 2 and the final URL lifecycle decisions.
- Do not overwrite the production repository with the marketing-only extraction. Merge the cumulative patch onto the full repository, respecting production-only proposal/demo/payment integrations.
- If production already contains Phase 2, use the final-over-Phase-2 patch instead.
- `npm run test` passes 17 source-level checks. Production build, typecheck, full runtime QA and customer-specific route verification are still required and must block launch on failure.
- Index eligibility is intentional for 18 public roofing routes. Noindex hidden pages remain live. Four retired general AI pages return 404 and five exact retired URLs redirect with 308.
- Keep the video `FIqNbi3bG7A` on `/solutions` and preserve all three `/referred` sales journeys.

To merge the cumulative patch, unzip it outside your repository and run `rsync -av --dry-run <unzipped>/t3-labs-marketing/ <actual-repository>/` before removing `--dry-run`. See `FINAL-SEO-RELEASE.md` for full commands.

Run after installing dependencies and starting the app:

```bash
npm ci && npm run test && npm run typecheck && npm run lint && npm run build
npm run start
# separate terminal:
node scripts/check-deployed-urls.mjs http://localhost:3000
```

See `FINAL-SEO-RELEASE.md` for the security and rollback cautions.
