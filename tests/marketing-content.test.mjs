// Dependency-free regression checks for the current (pre-deletion) marketing pass.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const pages = JSON.parse(read('components/t3-phase3/problem-pages.json'));

const serviceSlugs = [
  'roofing-website-design', 'roofing-seo', 'roofing-website-estimators',
  'roofing-quoting-software', 'roofing-ai-website-assistants',
  'roofing-business-automation',
];
const retiredLater = [
  'ai-help', 'ai-consultancy', 'ai-automation', 'ai-implementation', 'ai-training',
  'custom-software', 'our-solution', 'roofing-business-tools', 'roofing-solutions',
];

test('the six specialist pages still have their routes, concrete examples and canonical metadata', () => {
  for (const slug of serviceSlugs) {
    assert.ok(existsSync(new URL(`../app/${slug}/page.tsx`, import.meta.url)), `missing route ${slug}`);
    const page = pages[slug];
    assert.ok(page?.example?.scenario && page?.example?.improvement && page?.example?.signal, slug);
    assert.ok(read(`app/${slug}/page.tsx`).includes(`roofingServiceMetadata("${slug}")`), slug);
    assert.match(page.metaTitle, /Roofing|roofing/i);
    assert.match(page.metaDescription, /roofing/i);
  }
});

test('the solutions hub uses the existing video without autoplay or a fabricated transcript', () => {
  const hub = read('app/solutions/page.tsx');
  assert.match(hub, /FIqNbi3bG7A/);
  assert.match(hub, /ClickToPlayOverview/);
  const gate = read('components/marketing/ClickToPlayOverview.tsx');
  assert.match(gate, /youtube-nocookie\.com\/embed/);
  assert.match(gate, /if \(opened\)/);
  assert.match(gate, /setOpened\(true\)/);
  assert.doesNotMatch(hub, /<iframe/);
  assert.match(hub, /ROOFING_OUTCOMES/);
  assert.doesNotMatch(hub, /transcript has not/i);
});

test('the four outcome groups cover seven canonical services', () => {
  const source = read('components/t3-rebuild/solutions.ts');
  for (const slug of [...serviceSlugs, 'custom-roofing-software']) {
    assert.match(source, new RegExp(`"${slug}"`), `missing ${slug}`);
  }
  assert.match(source, /ROOFING_OUTCOMES/);
});

test('all legacy route stubs remain in source for safe rollback', () => {
  for (const slug of retiredLater) {
    assert.ok(existsSync(new URL(`../app/${slug}/page.tsx`, import.meta.url)), `route missing: ${slug}`);
  }
  for (const slug of ['ai-help', 'ai-consultancy', 'ai-implementation', 'ai-training']) {
    assert.match(read(`app/${slug}/page.tsx`), /notFound\(\)/, `404 missing for ${slug}`);
  }
});

test('the review funnel, existing 10-day campaign and referral links remain available', () => {
  for (const path of [
    'app/free-review/page.tsx', 'public/roofing-upgrade/landing.html',
    'app/our-solution/referred/page.tsx',
    'app/roofing-solutions/referred/page.tsx',
    'app/roofing-business-tools/referred/page.tsx',
    'app/pricing-calculator/referred/page.tsx',
  ]) {
    assert.ok(existsSync(new URL(`../${path}`, import.meta.url)), `missing ${path}`);
  }
  assert.match(read('components/t3-rebuild/FreeReview.tsx'), /\/api\/free-business-review/);
});

test('all six roofing pages contain a different practical guide with a decision and a measurable outcome', () => {
  const guides = read('components/t3-phase3/service-guides.ts');
  const headings = new Set();
  for (const slug of serviceSlugs) {
    const rx = new RegExp(`"${slug}": \\{[\\s\\S]*?headline: "([^"]+)"`);
    const match = guides.match(rx);
    assert.ok(match, `missing guide for ${slug}`);
    headings.add(match[1]);
  }
  assert.equal(headings.size, serviceSlugs.length);
  assert.match(read('components/t3-phase3/ProblemLanding.tsx'), /guide\.measurement/);
  assert.match(read('components/t3-phase3/ProblemLanding.tsx'), /guide\.inputs/);
});

test('sitemap advertises only core roofing content, not retired or hidden pages', () => {
  const sitemap = read('app/sitemap.ts');
  for (const slug of ['ai-consultancy', 'ai-automation', 'ai-training', 'qcp-careers', 'pricing-calculator']) {
    assert.ok(!sitemap.includes(`"${slug}"`), `legacy route in sitemap: ${slug}`);
    assert.ok(existsSync(new URL(`../app/${slug}/page.tsx`, import.meta.url)), `route lost: ${slug}`);
  }
  assert.match(sitemap, /FEATURED_ROOFING_GUIDES/);
  assert.match(sitemap, /ROOFING_SERVICE_SLUGS/);
});

test('sitewide structured data does not mark every page as a roofing service', () => {
  const layout = read('app/layout.tsx');
  assert.match(layout, /organizationJsonLd/);
  assert.match(layout, /websiteJsonLd/);
  assert.ok(!layout.includes('serviceJsonLd'));
  assert.match(layout, /og-roofing\.png/);
  assert.ok(existsSync(new URL('../public/og-roofing.png', import.meta.url)));
});

test('analytics events are on actual user actions and never include enquiry personal data', () => {
  const analytics = read('lib/marketing-analytics.ts');
  const review = read('components/t3-rebuild/FreeReview.tsx');
  assert.match(analytics, /cookie_consent/);
  assert.match(review, /trackMarketingEvent\("review_form_submit_success"/);
  assert.ok(review.indexOf('trackMarketingEvent("review_form_submit_success"') > review.indexOf('if (!result.ok)'));
  assert.ok(!analytics.includes('email:'));
  assert.ok(!analytics.includes('website:'));
});

test('QuoteCore case study includes previously bundled real-interface screenshots', () => {
  const content = read('app/case-studies/quotecore/page.tsx');
  for (const filename of ['takeoff-2.jpg', 'quotecore-components.png']) {
    assert.ok(existsSync(new URL(`../public/assets/t3-phase3/${filename}`, import.meta.url)));
    assert.ok(content.includes(filename));
  }
});
