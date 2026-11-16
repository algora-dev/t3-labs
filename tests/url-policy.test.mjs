// Source-level URL-policy regression tests do not require a Next.js install.
// The deployment agent must ALSO test actual HTTP responses on a running build.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  RETIRED_NOT_FOUND, RETIRED_PERMANENT_REDIRECTS, NOINDEX_HEADER_ROUTES,
} from '../config/seo-url-policy.ts';

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const redirects = new Map(RETIRED_PERMANENT_REDIRECTS.map(({source, destination}) => [source, destination]));
const noindex = new Set(NOINDEX_HEADER_ROUTES);

test('exact retirement redirects resolve to distinct canonical roofing destinations', () => {
  assert.equal(redirects.size, 5);
  assert.equal(redirects.get('/ai-automation'), '/roofing-business-automation');
  assert.equal(redirects.get('/custom-software'), '/custom-roofing-software');
  for (const p of ['/our-solution', '/roofing-solutions', '/roofing-business-tools']) {
    assert.equal(redirects.get(p), '/solutions');
  }
  for (const r of RETIRED_PERMANENT_REDIRECTS) {
    assert.equal(r.permanent, true);
    assert.ok(!r.source.includes(':'), `wildcard would catch referred pages: ${r.source}`);
  }
});

test('generic AI pages without a close semantic replacement are real 404s', () => {
  assert.deepEqual([...RETIRED_NOT_FOUND].sort(), [
    '/ai-help', '/ai-consultancy', '/ai-implementation', '/ai-training',
  ].sort());
  for (const route of RETIRED_NOT_FOUND) {
    assert.match(read(`app${route}/page.tsx`), /notFound\(\)/);
  }
});

test('referral and sales links are retained as crawlable noindex pages', () => {
  for (const path of [
    '/our-solution/referred', '/roofing-solutions/referred',
    '/roofing-business-tools/referred', '/pricing-calculator/referred',
    '/pricing-calculator', '/business-audit', '/hello/:path*',
    '/proposal/:path*', '/custom-proposal', '/sales-hub', '/sales-resources',
    '/qcp-careers', '/careers', '/10-day-business-upgrade',
  ]) assert.ok(noindex.has(path), `missing noindex header: ${path}`);
  for (const r of RETIRED_PERMANENT_REDIRECTS) {
    assert.ok(!noindex.has(r.source), `do not mix redirect with noindex: ${r.source}`);
  }
  const robots = read('app/robots.ts');
  assert.ok(!robots.includes('"/hello/"'));
  assert.ok(!robots.includes('"/proposal/"'));
  assert.ok(!robots.includes('"/sales-resources"'));
});

test('the Next config applies noindex response headers and exact permanent redirects', () => {
  const next = read('next.config.ts');
  assert.match(next, /RETIRED_PERMANENT_REDIRECTS/);
  assert.match(next, /NOINDEX_HEADER_ROUTES/);
  assert.match(next, /X-Robots-Tag/);
  assert.match(next, /noindex, nofollow/);
  // Check original campaign + old known proposal redirects remain intact.
  assert.match(next, /source: "\/roofing-business-upgrade"/);
  assert.match(next, /"\/proposal\/3a-roofing-wp-000207"/);
});

test('non-core AI blog posts are direct-link only, not in the visible index', () => {
  const article = read('app/blog/[slug]/page.tsx');
  const index = read('app/blog/page.tsx');
  assert.match(article, /FEATURED_ROOFING_GUIDES/);
  assert.match(article, /robots: \{ index: \(FEATURED_ROOFING_GUIDES/);
  assert.ok(!index.includes('otherPosts'));
  assert.ok(!index.includes('Older AI and software articles'));
});

test('SEO-only pages and the static campaign opt out of search indexing', () => {
  for (const file of [
    'app/business-audit/layout.tsx', 'app/pricing-calculator/layout.tsx',
    'app/qcp-careers/page.tsx', 'app/careers/page.tsx',
    'app/roofing-business-tools/layout.tsx', 'app/roofing-solutions/layout.tsx',
    'app/our-solution/layout.tsx', 'app/privacy/page.tsx',
    'app/terms/page.tsx', 'app/cookies/page.tsx',
    'app/service-terms/page.tsx', 'app/website-package-terms/page.tsx',
  ]) assert.match(read(file), /robots: \{ index: false/, file);
  assert.match(read('public/roofing-upgrade/landing.html'), /name="robots" content="noindex/);
});

test('public assistant knowledge no longer offers retired marketing URLs', () => {
  const prompt = read('lib/assistant-t3/prompt.ts');
  for (const r of [...RETIRED_PERMANENT_REDIRECTS, ...RETIRED_NOT_FOUND]) {
    const path = typeof r === 'string' ? r : r.source;
    assert.ok(!prompt.includes(`path: '${path}'`), path);
  }
  assert.match(prompt, /Roofing Website Design/);
  assert.match(prompt, /Free Business Review/);
  assert.ok(!prompt.includes('(/path${p.path'), 'assistant links must not use old /path prefix');
});
