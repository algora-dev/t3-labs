# Adding a prospect site

Example: **Example Roofing**, slug `example-roofing-wp-000206`, URL `/proposal/example-roofing-wp-000206`.

1. Create and switch to a branch such as `codex/example-roofing-wp-000206`.
2. Copy an existing site configuration into `sites/example-roofing-wp-000206/site-config.ts`, export `exampleRoofing`, and replace every field with verified Example Roofing content. The object must satisfy `ProspectSiteConfig`.
3. Add images under `public/assets/example-roofing-wp-000206/`. Reference them as `/assets/example-roofing-wp-000206/<filename>` and supply meaningful alt text.
4. Import `exampleRoofing` in `sites/index.ts` and add it to the `sites` registry. This automatically makes `/proposal/example-roofing-wp-000206` a statically generated route.
5. Do not change Falcon content, assets, or shared presentation unless the new requirement genuinely applies to every prospect.
6. Run:

   ```text
   npm ci
   npm run typecheck
   npm run lint
   npm run build
   ```

7. Check `/proposal/example-roofing-wp-000206`, `/proposal/falcon-contracting-wp-000205`, and an unknown URL. Confirm prospect metadata contains `noindex, nofollow`.
8. Commit, push, and open a pull request. Never add the example site merely to demonstrate the workflow.
