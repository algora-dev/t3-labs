import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { register } from 'node:module';
register(new URL('./conversion-resolve.mjs', import.meta.url));

const { TASKS, ADVANCED_PRICING_NOTE } = await import('../lib/demo-helper/config.ts');
const { INTRO_COPY, TOUR_REMINDER_COPY, CLOSING_COPY, CONVERSION_OFFER, EXPLORE_DELAY_MS, EARNED_INTERACTIONS_REQUIRED } = await import('../lib/demo-conversion/config.ts');
const source = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');

test('the guided journey stays at three lightweight core proofs', () => {
  assert.deepEqual([...TASKS.answers.requirements], ['knowledge-answer']);
  assert.deepEqual([...TASKS['assistant-price'].requirements], ['assistant-estimate']);
  assert.deepEqual([...TASKS['quick-price'].requirements], ['quick-result']);
  assert.deepEqual([...TASKS.admin.requirements], ['admin-open']);
});

test('conversion copy plants after-hours, flexible pricing, paid-traffic and time-saving questions', () => {
  assert.match(INTRO_COPY.body, /9pm/i);
  assert.match(INTRO_COPY.question, /9pm/i);
  assert.match(TASKS['assistant-price'].note ?? '', /exact prices, starting prices or ranges/i);
  assert.match(TASKS['assistant-price'].note ?? '', /search and AI/i);
  assert.match(TASKS['assistant-price'].reflection, /paid to get them here/i);
  assert.match(TASKS['quick-price'].reflection, /5 routine price enquiries a week/i);
  assert.match(ADVANCED_PRICING_NOTE, /private trade pricing can stay gated/i);
});

test('the four-minute self-guided interruption is a tour invitation, not a time-only sales close', () => {
  assert.equal(EXPLORE_DELAY_MS, 4 * 60 * 1000);
  assert.equal(EARNED_INTERACTIONS_REQUIRED, 2);
  assert.match(TOUR_REMINDER_COPY.title, /Finding your way around/i);
  assert.match(TOUR_REMINDER_COPY.body, /3 minutes/i);
  const ui = source('components/demo-conversion/DemoConversion.tsx');
  assert.match(ui, /show-tour-reminder/);
  assert.match(ui, /if \(selfGuided && !c\.tourReminderSeen\) return/);
  assert.match(ui, /lastInteractionAt > c\.reminderShownAt/);
  assert.match(ui, /const taskEarned = \(status: string\) => status === 'observed'/);
  assert.match(ui, /!earnedClose/);
});

test('only the fully verified three-step tour can trigger an immediate earned close', () => {
  const ui = source('components/demo-conversion/DemoConversion.tsx');
  assert.match(ui, /!earnedClose \|\| !coreVerified/);
  assert.match(ui, /reason: 'complete'/);
  assert.match(ui, /h\.view === 'finish' \? 'tour-ended' : 'explored'/);
});

test('the closing keeps the agreed value-first offer and 20-minute low-friction next step', () => {
  assert.match(CLOSING_COPY.question, /5 routine enquiries a week/i);
  assert.equal(CONVERSION_OFFER.priceLabel, 'What if you could have solutions like this for');
  assert.equal(CONVERSION_OFFER.startingPrice, '$999');
  assert.equal(CONVERSION_OFFER.bookingLabel, 'Book a free 20-minute call');
  assert.match(CLOSING_COPY.callNote, /No obligation/i);
});

test('helper finish is an exploration hub, not a repeated hard booking pitch or QA screen', () => {
  const ui = source('components/demo-helper/DemoHelper.tsx');
  for (const phrase of ['EXPERIENCE COMPLETE', 'MARKED AS TRIED', 'not verified', 'I’m finished exploring. Next step']) assert.doesNotMatch(ui, new RegExp(phrase, 'i'));
  assert.doesNotMatch(ui, /CONVERSION_OFFER\.bookingLabel/);
  assert.match(ui, /KEEP EXPLORING/);
  assert.match(ui, /Explore the business dashboard/);
  assert.match(ui, /Talk to T3 Labs/);
  assert.match(ui, /Continue when ready/);
  assert.match(ui, /Skip task/);
});

test('Quick Roof Estimate supports fast and full routes and uses real photos for all five pitched materials', () => {
  const ui = source('components/quick-estimate/QuickRoofEstimate.tsx');
  assert.match(ui, /FAST DEMO SHORTCUT/);
  assert.match(ui, /Try the full tool instead/);
  assert.match(ui, /recordHelperSignal\('quick-result'\)/);
  assert.match(ui, /\['tile', 'slate', 'shingle', 'pressed_metal', 'longrun'\]/);
  assert.match(ui, /thumb\.wikimedia\.org[^'\"]+Asphalt_Shingles_Texture/);
  assert.match(ui, /thumb\.wikimedia\.org[^'\"]+Red_metal_tile_on_a_home/);
  assert.doesNotMatch(ui, /onError=.*display.*none/);
  const credits = source('docs/ROOF_MATERIAL_IMAGE_CREDITS.md');
  assert.match(credits, /Shadowmeld Photography/);
  assert.match(credits, /MetalJean/);
});

test('optional dashboard proves trade and internal-use value without forcing a trade tab', () => {
  const helper = source('components/demo-helper/DemoHelper.tsx');
  const admin = source('app/supplier-pricing-tool/admin/AdminPanel.tsx');
  assert.match(TASKS.admin.question, /local contractors used your website to price their own jobs/i);
  assert.match(helper, /recordHelperSignal\('admin-open'\)/);
  assert.match(admin, /recordHelperSignal\('admin-open'\)/);
  assert.match(admin, /Trade pricing, quoting tools and usage can live in one place/);
  assert.match(admin, /support your own team with different pricing and rules/);
});

test('changed conversion and helper sources contain no literal em dash', () => {
  for (const file of [
    'lib/demo-helper/config.ts',
    'lib/demo-helper/guidance.ts',
    'lib/demo-helper/assistant-events.ts',
    'components/demo-helper/DemoHelper.tsx',
    'lib/demo-conversion/config.ts',
    'lib/demo-conversion/state.ts',
    'lib/demo-conversion/store.ts',
    'lib/demo-conversion/metrics.ts',
    'components/demo-conversion/DemoConversion.tsx',
    'components/assistant/SmartAssistantLauncher.tsx',
    'components/quick-estimate/QuickRoofEstimate.tsx',
    'app/supplier-pricing-tool/admin/AdminPanel.tsx',
    'app/supplier-pricing-tool/PortalFlow.tsx',
  ]) assert.doesNotMatch(source(file), /\u2014/, `${file} contains an em dash`);
});
