import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const readJson = (path) => JSON.parse(fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));

const business = readJson('data/apex-roofing/business.json');
const pricing = readJson('data/apex-roofing/pricing.json');
const pages = readJson('data/apex-roofing/website-pages.json');
const siteMap = readJson('data/apex-roofing/site-map.json');
const config = readJson('data/apex-roofing/assistant-config.json');

test('Apex demo has one Leeds / GBP identity across structured business data', () => {
  assert.equal(pricing.currency, 'GBP');
  assert.equal(pricing.symbol, '£');
  assert.ok(business.business.serviceAreas.includes('Leeds'));
  const corpus = JSON.stringify({ business, pricing, pages, siteMap });
  assert.doesNotMatch(corpus, /Portland|Oregon|\bUSD\b/);
});

test('every shared Apex content page has an assistant navigation destination', () => {
  assert.equal(pages.length, 16);
  const internalPaths = new Set(siteMap.filter((entry) => entry.path?.startsWith('/demo/roofing-site/')).map((entry) => entry.path));
  for (const page of pages) {
    assert.ok(internalPaths.has(`/demo/roofing-site/${page.slug}`), `Missing site-map path for ${page.slug}`);
  }
});

test('configured roof-system rates keep re-roof removal as separate allowances', () => {
  const roofSystems = pricing.items.filter((item) => item.category === 'reroofing');
  assert.ok(roofSystems.length >= 3);
  for (const item of roofSystems) {
    assert.match(item.description, /separate/i);
    assert.ok(item.excludes.some((value) => /strip|removal|existing roof/i.test(value)), `${item.id} should exclude old-roof removal from its base rate`);
  }
});

test('complex estimate clarification budget supports the full guided conversation', () => {
  assert.ok(config.maxClarificationQuestions >= 7);
});
