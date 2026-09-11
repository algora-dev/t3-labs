import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

register(new URL('./ts-resolve.mjs', import.meta.url));

const { createEstimate, slopeFactor } = await import('../lib/pricing/estimate-engine.ts');

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
  assert.equal(est.currency, 'USD');
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
