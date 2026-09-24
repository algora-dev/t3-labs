import test from 'node:test';
import assert from 'node:assert/strict';

const { calculateInternalPrice, createDefaultPricingSelection } = await import('../lib/internal-pricing.ts');

test('default measurement-to-price estimate starts at $999 setup and $99 monthly', () => {
  const estimate = calculateInternalPrice(createDefaultPricingSelection());
  assert.equal(estimate.setup, 999);
  assert.equal(estimate.monthly, 99);
});

test('digital takeoff adds $500 setup and $50 monthly and forces measurement tool', () => {
  const selection = createDefaultPricingSelection();
  selection.core.measurement = false;
  selection.core.takeoff = true;
  const estimate = calculateInternalPrice(selection);
  assert.equal(estimate.normalisedSelection.core.measurement, true);
  assert.equal(estimate.setup, 1499);
  assert.equal(estimate.monthly, 149);
});

test('smart assistant base can be priced independently', () => {
  const selection = createDefaultPricingSelection();
  selection.core.measurement = false;
  selection.core.assistant = true;
  const estimate = calculateInternalPrice(selection);
  assert.equal(estimate.setup, 999);
  assert.equal(estimate.monthly, 198); // $99 platform + $99 assistant module
  assert.ok(estimate.notes.some((note) => note.includes('model costs')));
});

test('large catalogues increase both setup and monthly support allowance', () => {
  const selection = createDefaultPricingSelection();
  selection.catalogueSize = '1001-5000';
  const estimate = calculateInternalPrice(selection);
  assert.equal(estimate.setup, 2499);
  assert.equal(estimate.monthly, 274); // 99 platform + 175 catalogue
});

test('manual adjustments apply to final ballpark and never allow negative totals', () => {
  const selection = createDefaultPricingSelection();
  selection.manualSetupAdjustment = -1500;
  selection.manualMonthlyAdjustment = -200;
  const estimate = calculateInternalPrice(selection);
  assert.equal(estimate.setup, 0);
  assert.equal(estimate.monthly, 0);
});

test('fuller supplier configuration produces stable deterministic pricing', () => {
  const selection = createDefaultPricingSelection();
  selection.core.takeoff = true;
  selection.core.assistant = true;
  selection.catalogueSize = '251-500';
  selection.dataReadiness = 'mixed';
  selection.pricingLogic = 'advanced';
  selection.takeoffComplexity = 'extended';
  selection.assistantScope = 'pricing';
  selection.tradeAccess = 'tiers';
  selection.adminLevel = 'advanced';
  selection.analyticsLevel = 'advanced';
  selection.outputLevel = 'quote-pack';
  selection.integrationLevel = 'standard';
  selection.customisationLevel = 'moderate';
  selection.supportLevel = 'managed';
  const estimate = calculateInternalPrice(selection);
  assert.equal(estimate.setup, 9898);
  assert.equal(estimate.monthly, 1022);
  assert.ok(estimate.mainFeatures.includes('Digital takeoff'));
  assert.ok(estimate.mainFeatures.includes('Smart Assistant'));
  assert.ok(estimate.mainFeatures.includes('Trade tiers + saved jobs'));
});
