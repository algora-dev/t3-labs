import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import fs from 'node:fs';
register(new URL('./conversion-resolve.mjs', import.meta.url));
const { TASKS } = await import('../lib/demo-helper/config.ts');
const { initialHelper, reduceHelper } = await import('../lib/demo-helper/state.ts');
const source = f => fs.readFileSync(new URL('../' + f, import.meta.url), 'utf8');

const tasking = (over = {}) => ({ ...initialHelper(), view: 'task', started: true, ...over });

test('skip marks the task skipped, not completed, and advances immediately', () => {
  const s0 = tasking({ current: 'assistant-price', milestones: ['assistant-estimate'] });
  const s1 = reduceHelper(s0, { type: 'skip' });
  assert.equal(s1.view, 'task');
  assert.equal(s1.current, 'quick-price');
  assert.equal(s1.status['assistant-price'], 'skipped');
});

test('skip never demotes an already observed task', () => {
  const s0 = tasking({ current: 'quick-price', status: { ...initialHelper().status, 'quick-price': 'observed' } });
  const s1 = reduceHelper(s0, { type: 'skip' });
  assert.equal(s1.view, 'finish');
  assert.equal(s1.status['quick-price'], 'observed');
});

test('finished-exploring path self-reports and advances straight to Task 3', () => {
  const s1 = reduceHelper(tasking({ current: 'assistant-price' }), { type: 'manual' });
  assert.equal(s1.view, 'benefit');
  assert.equal(s1.status['assistant-price'], 'self-reported');
  const s2 = reduceHelper(s1, { type: 'next' });
  assert.equal(s2.view, 'task');
  assert.equal(s2.current, 'quick-price');
});

test('Task 2 offers a persistent finished-exploring exit once exploring', () => {
  const ui = source('components/demo-helper/DemoHelper.tsx');
  assert.match(ui, /s\.current === 'assistant-price' && \(s\.started \|\| assistantOpen\)/);
  assert.match(ui, /I\u2019m finished exploring\. Next step/);
});

test('finished exploring closes the assistant and navigates to the Quick Estimate page', () => {
  const ui = source('components/demo-helper/DemoHelper.tsx');
  const at = ui.indexOf('function finishedExploring');
  assert.ok(at > 0, 'finishedExploring handler exists');
  const body = ui.slice(at, ui.indexOf('const prompt', at));
  assert.match(body, /type: 'manual'/);
  assert.match(body, /type: 'next'/);
  assert.match(body, /sendHelperCommand\('assistant-close'\)/);
  assert.match(body, /router\.push\(QUICK_HOME\)/);
});

test('every advancing control also navigates the site to the next task context', () => {
  const ui = source('components/demo-helper/DemoHelper.tsx');
  const at = ui.indexOf('function advanceTask');
  assert.ok(at > 0, 'advanceTask helper exists');
  const body = ui.slice(at, ui.indexOf('function finishedExploring', at));
  assert.match(body, /QUICK_HOME/);
  assert.match(body, /APEX_HOME/);
  assert.match(body, /router\.push/);
  assert.match(ui, /advanceTask\(\{ type: 'skip' \}\)/);
  assert.match(ui, /advanceTask\(\{ type: 'next' \}\)/);
});

test('advancing into an assistant task opens the assistant ready on the Apex site', () => {
  const ui = source('components/demo-helper/DemoHelper.tsx');
  const at = ui.indexOf('function advanceTask');
  const body = ui.slice(at, at + 2000);
  const close = body.indexOf("sendHelperCommand('assistant-close')");
  const open = body.indexOf("sendHelperCommand('assistant-open')");
  assert.ok(close > -1, 'closes assistant first');
  assert.ok(open > close, 'then opens it ready');
});

test('entering Quick Roof Estimate still closes the assistant without clearing its conversation', () => {
  const ui = source('components/demo-helper/DemoHelper.tsx');
  assert.match(ui, /quickTransition\.current !== s\.runId/);
});

test('the enquiry-reading stage keeps visible advance and skip controls', () => {
  const ui = source('components/demo-helper/DemoHelper.tsx');
  const at = ui.indexOf('{readingEnquiry && <>');
  const body = ui.slice(at, ui.indexOf('</>}', at));
  assert.match(body, /advanceTask\(\{ type: 'next' \}\)/);
  assert.match(body, /advanceTask\(\{ type: 'skip' \}\)/);
  assert.match(body, /Skip task/);
});

test('task copy, requirements and the closing offer are unchanged', () => {
  assert.deepEqual([...TASKS['assistant-price'].requirements], ['assistant-estimate', 'assistant-enquiry-open', 'assistant-enquiry-ready']);
  const ui = source('components/demo-helper/DemoHelper.tsx');
  assert.match(ui, /CONVERSION_OFFER\.bookingLabel/);
  assert.match(ui, /Next: a price without chat/);
});

test('mobile homepage width rules cannot shrink the Apex demo header or footers', () => {
  const css = source('app/globals.css');
  assert.doesNotMatch(css, /header\[class\*=.sticky.\]/, 'broad sticky-header matcher must not return');
  assert.doesNotMatch(css, /footer\[class\*=.w-.\]/, 'broad footer matcher must not return');
  assert.match(css, /width: min\(100% - 28px, 1180px\) !important/, 'homepage mobile insets stay for their exact page classes');
});
