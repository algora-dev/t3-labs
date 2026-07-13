# Multi-site prospect website builder

This repository is one Next.js App Router application that hosts private speculative proposal websites at `/proposal/<slug>`. The root route is a simple T3 Labs page and must never list proposal slugs.

## Architecture

- `app/proposal/[slug]/page.tsx` resolves registered sites, generates metadata and returns a 404 for unknown slugs.
- `sites/index.ts` is the central registry.
- `sites/types.ts` defines the required prospect configuration.
- `sites/<slug>/site-config.ts` contains all prospect-specific copy, branding, contact details and image references. Slugs should match the public proposal URL, such as `falcon-contracting-wp-000205`.
- `components/templates/` and `app/components.tsx` are shared presentation code. Change shared code cautiously because it affects every prospect.
- `public/assets/<slug>/` contains that prospect's images. Never share prospect-specific asset folders or filenames across companies.

## Add a prospect safely

1. Create a branch named `codex/<prospect-slug>` and submit the work through a pull request. Never add a prospect directly on the default branch.
2. Choose a lowercase, descriptive kebab-case slug that matches the intended proposal URL (for example `example-roofing-wp-000206`). Do not rename an existing slug.
3. Create `sites/<slug>/site-config.ts` satisfying `ProspectSiteConfig`. Keep all company-specific content in that folder.
4. Put images in `public/assets/<slug>/`, use descriptive filenames and provide accurate alt text in the configuration.
5. Register the configuration in `sites/index.ts`. Do not edit another prospect's configuration or assets.
6. Keep `robots.index` and `robots.follow` false for every speculative page.
7. Run `npm ci`, `npm run typecheck`, `npm run lint`, and `npm run build`. Verify the new `/proposal/<slug>` URL, an existing prospect, an unknown-slug 404, and robots metadata.

See `docs/ADDING_A_PROSPECT_SITE.md` for a practical example. Never commit `.env*`, credentials, API keys, build output or local-only files.
