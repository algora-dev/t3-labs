import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';
register(new URL('./ts-resolve.mjs', import.meta.url));

const ROOT = process.cwd();
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');
const { calculateRooflineQuickEstimate } = await import('../lib/quick-estimate/server.ts');
const { withBusinessContext } = await import('../lib/assistant/business-context.ts');
const { priceDraft, withIndicativePricePresentation } = await import('../lib/pricing/estimate-engine.ts');

test('Roofline homeowner exact area and pitch produce a tight NZD public range', async () => {
  const result = await calculateRooflineQuickEstimate({
    shape: 'gable', size: 'medium', exactRoofAreaM2: 160,
    pitch: 'typical', exactPitchDegrees: 20, storeys: 1,
    flatExtension: null, project: 'reroof', existingMaterial: 'metal',
    covering: 'pressed_metal', flatCovering: null,
  });
  assert.equal(result.price.currency, 'NZD');
  assert.equal(result.price.presentation?.confidence, 'high');
  assert.ok(result.price.presentation);
  assert.ok(result.price.presentation.high / result.price.presentation.low < 1.2);
  assert.ok(result.price.presentation.low >= 18000 && result.price.presentation.high <= 27000);
  assert.ok(Math.abs(result.measurements.low.totals.roofAreaM2 - 160) < 0.001);
  assert.ok(Math.abs(result.measurements.high.totals.roofAreaM2 - 160) < 0.001);
});

test('Roofline assistant exact estimate keeps deterministic math but presents a tight public range', async () => {
  await withBusinessContext('roofline-roofing', async () => {
    const raw = priceDraft({
      projectType: 'reroof', mode: 'quick_ballpark',
      area: { exactM2: 160, source: 'user_exact', areaType: 'actual_roof_area' },
      pitch: { degrees: 20, source: 'user_exact' }, roofShape: 'gable',
      materialId: 'reroof_roofdeck_040', components: [],
    });
    const result = withIndicativePricePresentation(raw);
    assert.equal(result.mode, 'single');
    assert.equal(result.estimate.currency, 'NZD');
    assert.equal(result.presentation?.confidence, 'high');
    assert.ok(result.presentation);
    assert.ok(result.presentation.low < result.estimate.total);
    assert.ok(result.presentation.high > result.estimate.total);
    assert.ok(result.presentation.high / result.presentation.low < 1.2);
  });
});

test('Roofline-facing estimate and enquiry files contain no UK currency or visible Apex copy', () => {
  const files = [
    'components/quick-estimate-roofline/QuickRoofEstimate.tsx',
    'components/quick-estimate-roofline/QuickQuoteEnquiry.tsx',
    'components/assistant/RooflineEnquiryPanel.tsx',
    'components/demo-sites/roofline/site-sections.tsx',
    'data/roofline-roofing/assistant-config.json',
    'data/roofline-roofing/business.json',
  ];
  const joined = files.map(read).join('\n');
  for (const forbidden of ['£', 'GBP', 'excluding VAT', 'LS1 1AA', 'Based on Apex', "Here's what Apex", 'Here’s what Apex', 'ask Apex', 'secret fix', 'Secret-fix', 'Secret clips']) {
    assert.ok(!joined.includes(forbidden), `Roofline-facing source contains forbidden legacy copy: ${forbidden}`);
  }
  assert.match(joined, /NZD|en-NZ|Roofline/);
});

test('Roofline demo assistant starters cover recommendation, compatibility, exact pricing and trade', () => {
  const cfg = JSON.parse(read('data/roofline-roofing/assistant-config.json'));
  assert.equal(cfg.starterPrompts.length, 4);
  assert.match(cfg.starterPrompts[0], /coast/i);
  assert.match(cfg.starterPrompts[1], /4 degree/i);
  assert.match(cfg.starterPrompts[2], /160 m².*20°.*Roofdeck 0\.40g/i);
  assert.match(cfg.starterPrompts[3], /roofer.*price a job/i);
});

test('Roofline trade/admin demo uses NZ-localized sample identities and versioned storage', () => {
  const admin = read('app/supplier-pricing-tool/adminData.ts');
  assert.match(admin, /canterburyroofing\.example/);
  assert.match(admin, /southernbuild\.example/);
  assert.match(admin, /roofline-roofing'.*'admin-v3'/);
  assert.match(admin, /roofline-roofing'.*'events-v2'/);
  const quote = read('app/supplier-pricing-tool/quote/page.tsx');
  assert.match(quote, /roofline \? 'GST' : 'VAT'/);
  assert.match(quote, /roofline \? 'en-NZ' : 'en-GB'/);
});


test('Roofline website pricing links carry intent into the detailed tool', () => {
  const choices = read('components/demo-helper/RooflineToolChoices.tsx');
  const flow = read('app/supplier-pricing-tool/PortalFlow.tsx');
  assert.match(choices, /entry=measurements/);
  assert.match(choices, /entry=plan/);
  assert.match(flow, /requested === 'measurements'/);
  assert.match(flow, /config\.slug === 'roofline-roofing' \? 'actual' : null/);
  assert.match(flow, /roofline\.supplier\.flow\.v1/);
  assert.ok(!flow.includes("if (config.slug !== 'apex-roofing') return;\n    const requested = new URLSearchParams(window.location.search).get('entry')"));
});


test('Everest Tray prices above the through-fixed profiles and tolerates low pitches', async () => {
  const base = {
    shape: 'gable', size: 'medium', exactRoofAreaM2: 160,
    pitch: 'typical', exactPitchDegrees: 4, storeys: 1,
    flatExtension: null, project: 'reroof', existingMaterial: 'metal',
    flatCovering: null,
  };
  const everest = await calculateRooflineQuickEstimate({ ...base, covering: 'everest_tray' });
  assert.equal(everest.price.currency, 'NZD');
  assert.equal(everest.price.status, 'priced');
  assert.ok(everest.price.presentation);
  const deck = await calculateRooflineQuickEstimate({ ...base, covering: 'pressed_metal' });
  assert.ok(everest.price.presentation.low > deck.price.presentation.low * 1.4, 'Everest should carry a clear premium over Roofdeck at the same measurements');
});

test('A mid-keystroke exact area value never resets the quick estimate flow', async () => {
  const { readQuickDraft } = await import('../lib/quick-estimate/draft.ts');
  const surviving = readQuickDraft(JSON.stringify({
    step: 2,
    answers: { shape: 'gable', size: 'medium', exactRoofAreaM2: 1, storeys: 1, project: 'reroof', existingMaterial: 'metal', covering: 'everest_tray', flatCovering: null },
    demo: false,
  }));
  assert.equal(surviving.step, 2);
  assert.equal(surviving.answers.exactRoofAreaM2, undefined);
  assert.equal(surviving.answers.covering, 'everest_tray');
});

test('Everest Tray is wired across the trade catalogue, assistant pricing and pitch rules', async () => {
  const { ROOFLINE_ROOFING } = await import('../app/supplier-pricing-tool/supplierDefs/roofline-roofing.ts');
  const ids = ROOFLINE_ROOFING.products.map(p => p.id);
  for (const id of ['rf-ev-055', 'rf-ev-clips', 'rf-ridge-ev', 'rf-hip-ev', 'rf-valley-ev', 'rf-barge-ev']) {
    assert.ok(ids.includes(id), `missing trade product ${id}`);
  }
  const pricing = JSON.parse(read('data/roofline-roofing/pricing.json'));
  const everest = pricing.items.find(i => i.id === 'reroof_everest_055');
  assert.ok(everest && everest.rate === 200);
  const rules = JSON.parse(read('data/roofline-roofing/estimate-rules.json'));
  assert.equal(rules.materialPitchRules.reroof_everest_055.minPitchDegrees, 3);
  const ridgeRd = ROOFLINE_ROOFING.products.find(p => p.id === 'rf-ridge-rd');
  const ridgeEv = ROOFLINE_ROOFING.products.find(p => p.id === 'rf-ridge-ev');
  assert.ok(ridgeEv && ridgeRd && ridgeEv.defaultLabourRate === ridgeRd.defaultLabourRate * 2, 'Everest ridge flashing labour should be double the through-fixed rate');
  const toolshell = read('app/supplier-pricing-tool/ToolShell.tsx');
  assert.match(toolshell, /hover\\\\:bg-blue-700:hover/, 'theme layer must emit CSS-valid escaped hover selectors');
});

test('Exact area and pitch alone unlock the estimate without band cards', async () => {
  const result = await calculateRooflineQuickEstimate({
    shape: 'gable', size: undefined, exactRoofAreaM2: 160,
    pitch: null, exactPitchDegrees: 20, storeys: 1,
    flatExtension: null, project: 'reroof', existingMaterial: 'metal',
    covering: 'everest_tray', flatCovering: null,
  });
  assert.equal(result.price.status, 'priced');
  assert.equal(result.price.presentation?.confidence, 'high');
  assert.ok(Math.abs(result.measurements.low.totals.roofAreaM2 - 160) < 0.001);
  assert.ok(Math.abs(result.measurements.high.totals.roofAreaM2 - 160) < 0.001);
});