#!/usr/bin/env node
/**
 * Post-build smoke test for the FINAL roofing-first URL lifecycle release.
 * Usage: node scripts/check-deployed-urls.mjs http://localhost:3000
 * Or:    node scripts/check-deployed-urls.mjs https://staging.example.com
 * Optional: T3_HELLO_TEST_SLUG=... T3_PROPOSAL_TEST_SLUG=...
 *
 * Checks real server HTTP behavior; never modifies a live site.
 */
const origin = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const indexed = [
  '/', '/solutions', '/roofing-website-design', '/roofing-seo',
  '/roofing-website-estimators', '/roofing-quoting-software',
  '/roofing-ai-website-assistants', '/roofing-business-automation',
  '/custom-roofing-software', '/case-studies/quotecore', '/blog',
  '/free-review', '/contact',
  '/blog/custom-roofing-software',
  '/blog/building-quotecore-roofing-trade-software',
  '/blog/ai-roofing-estimation-what-ai-can-do',
  '/blog/can-ai-write-my-quotes',
  '/blog/branded-calculators-lead-generation-tools',
];
const retiredRedirects = new Map([
  ['/ai-automation', '/roofing-business-automation'],
  ['/custom-software', '/custom-roofing-software'],
  ['/our-solution', '/solutions'],
  ['/roofing-solutions', '/solutions'],
  ['/roofing-business-tools', '/solutions'],
]);
const retired404 = ['/ai-help', '/ai-consultancy', '/ai-implementation', '/ai-training'];
const hidden = [
  '/our-solution/referred', '/roofing-solutions/referred',
  '/roofing-business-tools/referred', '/pricing-calculator/referred',
  '/pricing-calculator', '/business-audit', '/qcp-careers',
  '/sales-hub', '/sales-resources', '/careers', '/custom-proposal',
  '/10-day-business-upgrade',
  '/privacy', '/cookies', '/terms', '/service-terms', '/website-package-terms',
  '/blog/ai-consultancy-cost-uk', '/blog/ai-consultancy-training-automation-or-build',
  '/blog/chatgpt-says-this-can-be-automated', '/blog/what-can-ai-actually-do-for-a-small-business',
  '/blog/i-have-an-ai-idea-but-cant-code', '/blog/does-ai-make-software-development-cheaper',
  '/blog/human-in-the-loop-ai-when-should-a-person-check', '/blog/custom-software-development-cost-uk',
];
if (process.env.T3_HELLO_TEST_SLUG) hidden.push(`/hello/${encodeURIComponent(process.env.T3_HELLO_TEST_SLUG)}`);
if (process.env.T3_PROPOSAL_TEST_SLUG) hidden.push(`/proposal/${encodeURIComponent(process.env.T3_PROPOSAL_TEST_SLUG)}`);

const errors = [];
const checks = [];
const fail = (path, description) => errors.push(`${path}: ${description}`);
const pass = (path, description) => checks.push(`${path}: ${description}`);
const get = (path) => fetch(origin + path, { redirect: 'manual', headers: { 'user-agent': 'T3Labs-SEO-Smoke/1.0' } });

for (const path of indexed) {
  try {
    const res = await get(path);
    if (res.status !== 200) { fail(path, `expected 200, got ${res.status}`); continue; }
    const html = await res.text();
    if (/noindex/i.test(res.headers.get('x-robots-tag') || '')) fail(path, 'unexpected noindex HTTP header');
    else if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) fail(path, 'unexpected noindex HTML meta');
    else pass(path, '200 and no noindex');
  } catch (error) { fail(path, String(error)); }
}
for (const [path, dest] of retiredRedirects) {
  try {
    const res = await get(path);
    const location = res.headers.get('location') || '';
    if (res.status !== 308 || new URL(location, origin).pathname !== dest) {
      fail(path, `expected 308 -> ${dest}, got ${res.status} -> ${location}`);
    } else pass(path, `308 -> ${dest}`);
  } catch (error) { fail(path, String(error)); }
}
for (const path of retired404) {
  try {
    const res = await get(path);
    if (res.status !== 404) fail(path, `expected 404, got ${res.status}`);
    else pass(path, '404');
  } catch (error) { fail(path, String(error)); }
}
for (const path of hidden) {
  try {
    const res = await get(path);
    // Confidential proposals may (and ideally should) require authentication.
    if (path.startsWith('/proposal/') && [401, 403].includes(res.status)) {
      pass(path, `access protected (${res.status})`);
      continue;
    }
    if (res.status !== 200) { fail(path, `expected live HTTP 200, got ${res.status}`); continue; }
    const html = await res.text();
    const robotsHeader = res.headers.get('x-robots-tag') || '';
    const robotsMeta = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
    if (!/noindex/i.test(robotsHeader) && !robotsMeta) {
      fail(path, 'missing noindex header AND meta');
    } else pass(path, 'live 200 + noindex');
  } catch (error) { fail(path, String(error)); }
}
try {
  const res = await get('/sitemap.xml');
  if (res.status !== 200) fail('/sitemap.xml', `expected 200, got ${res.status}`);
  else {
    const xml = await res.text();
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(x => x[1]);
    if (locs.length !== 18) fail('/sitemap.xml', `expected 18 URLs, got ${locs.length}`);
    else if (locs.some(url => ['/ai-consultancy', '/pricing-calculator', '/our-solution'].some(p => new URL(url).pathname === p))) fail('/sitemap.xml', 'retired or hidden URL in sitemap');
    else pass('/sitemap.xml', '18 curated URLs');
  }
} catch (error) { fail('/sitemap.xml', String(error)); }
try {
  const res = await get('/robots.txt');
  if (res.status !== 200) fail('/robots.txt', `expected 200, got ${res.status}`);
  else {
    const text = await res.text();
    if (/Disallow:\s*\/(hello\/|proposal\/|sales-resources)/i.test(text)) fail('/robots.txt', 'blocks intended noindex routes');
    else pass('/robots.txt', 'allows crawling of noindex pages');
  }
} catch (error) { fail('/robots.txt', String(error)); }

console.log(`\nT3 Labs URL smoke test against ${origin}`);
console.log(`${checks.length} checks passed; ${errors.length} failed.\n`);
for (const m of checks) console.log('PASS', m);
for (const m of errors) console.error('FAIL', m);
if (errors.length) {
  console.error('\nDO NOT DEPLOY until the failures above are resolved.');
  process.exitCode = 1;
} else console.log('\nSource routes passed. Continue testing business workflows, confidential proposal access, mobile layout and production integrations.');
