# T3 Labs multi-site proposal builder

This private repository is the source for `t3labs.tech`. It hosts the T3 Labs homepage at `/` and private speculative proposal websites at `/proposal/<slug>`.

## Architecture

- `app/page.tsx` renders the existing T3 Labs homepage from `index.html` and loads `public/styles.css` plus `public/script.js`.
- `app/proposal/[slug]/page.tsx` resolves registered proposal sites, generates metadata and returns a 404 for unknown slugs.
- `sites/index.ts` is the central proposal registry.
- `sites/types.ts` defines the required proposal configuration.
- `sites/<slug>/site-config.ts` contains all prospect-specific copy, branding, contact details and image references.
- `components/templates/` and `app/components.tsx` are shared proposal presentation code. Change shared proposal code cautiously because it affects every proposal.
- T3 Labs homepage assets live in `public/assets/`.
- Proposal image references should use `/proposal-assets/<slug>/<filename>`, backed by files in `public/assets/<slug>/`.

## Add a proposal safely

1. Create a branch named `codex/<proposal-slug>` and submit the work through a pull request. Never add a proposal directly on the default branch.
2. Choose a lowercase, descriptive kebab-case slug that matches the intended proposal URL, for example `ayles-scaffolding-wp-000206`.
3. Create `sites/<slug>/site-config.ts` satisfying `ProspectSiteConfig`. Keep all company-specific content in that folder.
4. Put images in `public/assets/<slug>/`, reference them as `/proposal-assets/<slug>/<filename>`, and provide accurate alt text in the configuration.
5. Register the configuration in `sites/index.ts`. Do not edit another proposal's configuration or assets.
6. Keep `robots.index` and `robots.follow` false for every speculative proposal page.
7. Run `npm ci`, `npm run typecheck`, `npm run lint`, and `npm run build`. Verify the new `/proposal/<slug>` URL, an existing proposal, an unknown-slug 404, and robots metadata.

See `docs/ADDING_A_PROSPECT_SITE.md` for a practical example. Never commit `.env*`, credentials, API keys, build output or local-only files.
