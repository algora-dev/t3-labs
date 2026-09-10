/**
 * Deterministic estimate-engine tests (spec 19.2).
 * Run: node --test tests/   (from the repo root - data files are read from cwd)
 *
 * Uses Node's built-in test runner with type stripping. The resolve hook in
 * ts-resolve.mjs handles the lib's extensionless relative imports.
 */
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
};

test('catalogue version is preserved on every estimate', () => {
  const est = createEstimate(BASE);
  assert.equal(est.catalogVersion, '2026-09-demo-1');
  assert.equal(est.currency, 'USD');
  assert.equal(est.status, 'indicative');
});

test('deterministic 200m2 gable 30deg concrete estimate total', () => {
  const est = createEstimate(BASE);

  // Covering: 200m2 * 1.075 waste = 215.0 m2 @ $62 = $13,330
  // Gable ridge: 0.10 * 200 = 20 lm dry-fix @ $24 = $480
  // Valley: 0.05 * 200 = 10 lm GRP trough @ $32 = $320
  // Subtotal = $14,130
  assert.equal(est.lineItems.length, 3);
  assert.equal(est.lineItems[0].catalogItemId, 'reroof_concrete_tile');
  assert.equal(est.lineItems[0].quantity, 215);
  assert.equal(est.lineItems[0].rate, 62);
  assert.equal(est.total, 14130);
  assert.equal(est.subtotal, 14130);
});

test('plan-vs-actual slope conversion applies the 30 degree preset factor', () => {
  assert.equal(slopeFactor(30), 1.155); // from estimate-rules.json pitchPresets

  const actual = createEstimate(BASE);
  const plan = createEstimate({ ...BASE, areaType: 'plan_area' });

  // Plan area 200m2 -> actual ~231m2 sloped area; covering quantity scales by the slope factor
  const ratio = plan.lineItems[0].quantity / actual.lineItems[0].quantity;
  assert.ok(Math.abs(ratio - 1.155) < 0.01, `covering ratio ${ratio} should be ~1.155`);
  assert.ok(plan.total > actual.total, 'plan-area estimate must cost more than actual-area estimate');

  // The conversion is stated as an assumption on the estimate
  assert.ok(
    plan.assumptions.some((a) => a.toLowerCase().includes('slope factor')),
    'plan->actual conversion assumption is disclosed'
  );
});

test('commercial rounding: every line and total rounds UP to nearest $10', () => {
  for (const shape of ['gable', 'hip', 'valley_complex']) {
    const est = createEstimate({ ...BASE, roofShape: shape, includeGutters: true, includeInsulation: true });
    for (const li of est.lineItems) {
      assert.equal(li.subtotal % 10, 0, `${shape}: line ${li.label} subtotal ${li.subtotal} not rounded to $10`);
    }
    assert.equal(est.total % 10, 0);
    const sum = est.lineItems.reduce((s, li) => s + li.subtotal, 0);
    assert.ok(est.total >= sum && est.total - sum < 10, 'total must be the rounded sum of lines');
  }
});

test('optional guttering correctly changes the total', () => {
  const without = createEstimate(BASE);
  const withGutters = createEstimate({ ...BASE, includeGutters: true });

  // Gutter: 0.45 * 200 = 90 lm @ $18 = $1,620; downpipes: round(90*0.08)=7 @ $95 = $665 -> rounded $670
  assert.equal(withGutters.total - without.total, 2290);
  const ids = withGutters.lineItems.map((li) => li.catalogItemId);
  assert.ok(ids.includes('gutter_replacement') && ids.includes('downpipe'));
});

test('arithmetic is stable across repeated runs', () => {
  const first = createEstimate(BASE);
  for (let i = 0; i < 5; i++) {
    const again = createEstimate(BASE);
    assert.equal(again.total, first.total);
    assert.deepEqual(
      again.lineItems.map((li) => [li.catalogItemId, li.quantity, li.subtotal]),
      first.lineItems.map((li) => [li.catalogItemId, li.quantity, li.subtotal])
    );
  }
  // IDs are unique per estimate even when maths is identical
  const other = createEstimate(BASE);
  assert.notEqual(other.id, first.id);
});
