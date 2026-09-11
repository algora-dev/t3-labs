import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register(new URL('./ts-resolve.mjs', import.meta.url));

const { createEstimate, slopeFactor, priceDraft } = await import('../lib/pricing/estimate-engine.ts');
const { validateEstimateDraftInput } = await import('../lib/assistant/estimate-draft.ts');

const BASE = {
  roofArea: 200,
  areaType: 'actual_roof_area',
  roofShape: 'gable',
  pitchDegrees: 30,
  material: 'reroof_concrete_tile',
  componentScope: 'covering_only',
};

test('catalogue version and currency are preserved', () => {
  const est = createEstimate(BASE);
  assert.equal(est.catalogVersion, '2026-09-demo-1');
  assert.equal(est.currency, 'GBP');
  assert.equal(est.status, 'indicative');
});

test('covering-only estimate never adds unrequested roof components', () => {
  const est = createEstimate(BASE);
  assert.equal(est.lineItems.length, 1);
  assert.equal(est.lineItems[0].catalogItemId, 'reroof_concrete_tile');
  assert.equal(est.lineItems[0].quantity, 215);
  assert.equal(est.lineItems[0].rate, 62);
  assert.equal(est.total, 13330);
  assert.ok(est.assumptions.some((a) => a.toLowerCase().includes('covering only')));
});

test('simple gable geometry has no automatic valley allowance', () => {
  const est = createEstimate({ ...BASE, componentScope: 'estimated_components' });
  const ids = est.lineItems.map((line) => line.catalogItemId);
  assert.ok(ids.includes('ridge_hip_system'));
  assert.ok(!ids.includes('valley_trough'));
  assert.equal(est.total, 13810); // 13,330 covering + 20 lm ridge @ 24 = 480
});

test('user-specified component quantities are priced exactly from approved rates', () => {
  const est = createEstimate({
    ...BASE,
    componentScope: 'specified_components',
    components: [
      { catalogItemId: 'ridge_hip_system', quantity: 12.5 },
      { catalogItemId: 'valley_trough', quantity: 8 },
    ],
  });
  const ridge = est.lineItems.find((line) => line.catalogItemId === 'ridge_hip_system');
  const valley = est.lineItems.find((line) => line.catalogItemId === 'valley_trough');
  assert.equal(ridge?.quantity, 12.5);
  assert.equal(ridge?.quantitySource, 'user');
  assert.equal(valley?.quantity, 8);
  assert.equal(valley?.quantitySource, 'user');
});

test('plan-vs-actual slope conversion applies the 30 degree preset factor', () => {
  assert.equal(slopeFactor(30), 1.155);
  const actual = createEstimate(BASE);
  const plan = createEstimate({ ...BASE, areaType: 'plan_area' });
  const ratio = plan.lineItems[0].quantity / actual.lineItems[0].quantity;
  assert.ok(Math.abs(ratio - 1.155) < 0.01, `covering ratio ${ratio} should be ~1.155`);
  assert.ok(plan.total > actual.total);
  assert.ok(plan.assumptions.some((a) => a.toLowerCase().includes('slope factor')));
});

test('explicit estimated gutter selection changes the total without inventing downpipes', () => {
  const without = createEstimate(BASE);
  const withGutters = createEstimate({
    ...BASE,
    componentScope: 'estimated_components',
    components: [{ catalogItemId: 'gutter_replacement' }],
  });
  const ids = withGutters.lineItems.map((line) => line.catalogItemId);
  assert.ok(ids.includes('gutter_replacement'));
  assert.ok(!ids.includes('downpipe'));
  assert.equal(withGutters.total - without.total, 1620);
});

test('commercial rounding remains stable', () => {
  const est = createEstimate({ ...BASE, roofShape: 'hip', componentScope: 'estimated_components' });
  for (const line of est.lineItems) assert.equal(line.subtotal % 10, 0);
  assert.equal(est.total % 10, 0);
});

test('arithmetic is stable across repeated runs', () => {
  const first = createEstimate(BASE);
  for (let i = 0; i < 5; i++) {
    const again = createEstimate(BASE);
    assert.equal(again.total, first.total);
    assert.deepEqual(
      again.lineItems.map((line) => [line.catalogItemId, line.quantity, line.subtotal]),
      first.lineItems.map((line) => [line.catalogItemId, line.quantity, line.subtotal])
    );
  }
  assert.notEqual(createEstimate(BASE).id, first.id);
});

test('unknown roofing materials never silently fall back to a priced product', () => {
  assert.throws(
    () => createEstimate({ ...BASE, material: 'mystery membrane roof' }),
    /Unknown approved roofing material/
  );
});

test('re-roof adds the configured strip and disposal allowances on top of the roof system', () => {
  const est = createEstimate({ ...BASE, projectType: 'reroof' });
  const strip = est.lineItems.find((line) => line.catalogItemId === 'reroof_strip_allowance');
  const disposal = est.lineItems.find((line) => line.catalogItemId === 'reroof_disposal_allowance');
  assert.ok(strip, 'strip allowance line present');
  assert.ok(disposal, 'disposal allowance line present');
  assert.equal(strip.rate, 10); // from estimate-rules.json v4.reroofAllowances
  assert.equal(strip.quantity, 200); // actual area, no waste factor
  assert.equal(strip.subtotal, 2000);
  assert.equal(disposal.rate, 1000);
  assert.equal(disposal.quantity, 1);
  assert.equal(disposal.subtotal, 1000);
  assert.equal(est.total, 13330 + 2000 + 1000);
  assert.equal(est.project.projectType, 'reroof');
  assert.ok(est.assumptions.some((a) => a.toLowerCase().includes('indicative allowances')));
});

test('new roofs never include strip or disposal allowance lines', () => {
  const est = createEstimate({ ...BASE, projectType: 'new_roof' });
  assert.ok(!est.lineItems.some((line) => line.catalogItemId === 'reroof_strip_allowance'));
  assert.ok(!est.lineItems.some((line) => line.catalogItemId === 'reroof_disposal_allowance'));
  assert.equal(est.total, 13330);
});

test('size bands produce a price RANGE at the configured band min and max', () => {
  const result = priceDraft({
    projectType: 'reroof',
    mode: 'guided',
    area: { band: 'medium', source: 'configured_band', areaType: 'actual_roof_area' },
    pitch: { band: 'medium', source: 'user_band' },
    materialId: 'reroof_concrete_tile',
    components: [],
  });
  assert.equal(result.mode, 'range');
  assert.equal(result.indicative, true);
  assert.equal(result.low.project.roofArea, 100); // medium band min
  assert.equal(result.high.project.roofArea, 200); // medium band max
  assert.ok(result.low.total < result.high.total);
  assert.equal(result.low.total % 10, 0);
  assert.equal(result.high.total % 10, 0);
  // Both ends include the re-roof removal allowances from config.
  for (const est of [result.low, result.high]) {
    assert.ok(est.lineItems.some((line) => line.catalogItemId === 'reroof_disposal_allowance'));
  }
});

test('exact area gives a single figure, and pitch bands use the configured representative degrees', () => {
  const single = priceDraft({
    projectType: 'new_roof',
    mode: 'quick_ballpark',
    area: { exactM2: 185, source: 'user_exact', areaType: 'actual_roof_area' },
    pitch: { degrees: 27, source: 'user_exact' },
    materialId: 'reroof_slate',
    components: [],
  });
  assert.equal(single.mode, 'single');
  assert.equal(single.estimate.project.roofArea, 185);
  assert.equal(single.estimate.project.pitchDegrees, 27);

  const banded = priceDraft({
    projectType: 'new_roof',
    mode: 'guided',
    area: { exactM2: 185, source: 'user_exact', areaType: 'actual_roof_area' },
    pitch: { band: 'medium', source: 'user_band' },
    materialId: 'reroof_concrete_tile',
    components: [],
  });
  assert.equal(banded.mode, 'single');
  assert.equal(banded.estimate.project.pitchDegrees, 27); // medium band representative
});

test('configured pitch compatibility blocks unsuitable roof coverings', () => {
  assert.throws(
    () => priceDraft({
      projectType: 'new_roof',
      mode: 'guided',
      area: { exactM2: 185, source: 'user_exact', areaType: 'actual_roof_area' },
      pitch: { band: 'flat', source: 'user_band' },
      materialId: 'reroof_slate',
      components: [],
    }),
    /not configured for pitches below/
  );
});

test('guided plan area uses pitch to convert footprint to sloped roof area', () => {
  const plan = priceDraft({
    projectType: 'new_roof',
    mode: 'guided',
    area: { exactM2: 100, source: 'user_exact', areaType: 'plan_area' },
    pitch: { degrees: 30, source: 'user_exact' },
    materialId: 'reroof_concrete_tile',
    components: [],
  });
  const actual = priceDraft({
    projectType: 'new_roof',
    mode: 'guided',
    area: { exactM2: 100, source: 'user_exact', areaType: 'actual_roof_area' },
    pitch: { degrees: 30, source: 'user_exact' },
    materialId: 'reroof_concrete_tile',
    components: [],
  });
  assert.equal(plan.mode, 'single');
  assert.equal(actual.mode, 'single');
  assert.ok(plan.estimate.total > actual.estimate.total);
  assert.ok(plan.estimate.assumptions.some((a) => a.toLowerCase().includes('plan area')));
});

test('component quantity sources: user quantities are user-sourced, authorised heuristics are labelled', () => {
  const withUserQty = priceDraft({
    projectType: 'new_roof',
    mode: 'guided',
    area: { exactM2: 200, source: 'user_exact', areaType: 'actual_roof_area' },
    pitch: { band: 'medium', source: 'user_band' },
    materialId: 'reroof_concrete_tile',
    components: [{ componentId: 'ridge_hip_system', selected: true, quantity: 12, unit: 'lm', quantitySource: 'user' }],
  });
  const ridge = withUserQty.estimate.lineItems.find((line) => line.catalogItemId === 'ridge_hip_system');
  assert.ok(ridge);
  assert.equal(ridge.quantitySource, 'user');
  assert.equal(ridge.quantity, 12);

  const withHeuristic = priceDraft({
    projectType: 'new_roof',
    mode: 'guided',
    area: { exactM2: 200, source: 'user_exact', areaType: 'actual_roof_area' },
    pitch: { band: 'medium', source: 'user_band' },
    materialId: 'reroof_concrete_tile',
    components: [{ componentId: 'gutter_replacement', selected: true, quantity: null, unit: 'lm', quantitySource: 'heuristic' }],
  });
  const gutter = withHeuristic.estimate.lineItems.find((line) => line.catalogItemId === 'gutter_replacement');
  assert.ok(gutter);
  assert.equal(gutter.quantitySource, 'heuristic');
  assert.equal(withHeuristic.indicative, true);
});

test('draft validation refuses unauthorised heuristic component quantities', () => {
  const draftBase = {
    projectType: 'reroof',
    mode: 'guided',
    area: { exactM2: 185, source: 'user_exact', areaType: 'actual_roof_area' },
    pitch: { band: 'medium', source: 'user_band' },
    materialId: 'reroof_concrete_tile',
  };
  // Selected component with no quantity and no explicit heuristic authorisation.
  const unauthorised = validateEstimateDraftInput({
    ...draftBase,
    components: [{ componentId: 'ridge_hip_system', selected: true, quantity: null }],
  });
  assert.equal(unauthorised.ok, false);

  // Explicit authorisation unlocks the heuristic path.
  const authorised = validateEstimateDraftInput({
    ...draftBase,
    components: [{ componentId: 'ridge_hip_system', selected: true, quantity: null, quantitySource: 'heuristic' }],
  });
  assert.equal(authorised.ok, true);

  // Components the engine cannot safely estimate stay rejected even with authorisation.
  const unsafe = validateEstimateDraftInput({
    ...draftBase,
    components: [{ componentId: 'flashings', selected: true, quantity: null, quantitySource: 'heuristic' }],
  });
  assert.equal(unsafe.ok, false);

  // Unknown material ids never pass validation.
  const badMaterial = validateEstimateDraftInput({ ...draftBase, materialId: 'gold_plated_titanium' });
  assert.equal(badMaterial.ok, false);
});


test('guided draft validation requires a pitch range or exact pitch', () => {
  const result = validateEstimateDraftInput({
    projectType: 'reroof',
    mode: 'guided',
    area: { exactM2: 185, source: 'user_exact', areaType: 'actual_roof_area' },
    pitch: { source: 'user_band' },
    materialId: 'reroof_concrete_tile',
    components: [],
  });
  assert.equal(result.ok, false);
  if (!result.ok) assert.match(result.error, /pitch/i);
});
