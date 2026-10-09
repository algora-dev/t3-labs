import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import fs from 'node:fs';
register(new URL('./ts-resolve.mjs', import.meta.url));
const { ASSISTANT_FRAME_NAME, shouldHideCompanions, isAssistantWebsiteFrame } = await import('../lib/demo-helper/embed.ts');
const { initialHelper, readHelper, reduceHelper } = await import('../lib/demo-helper/state.ts');
const source = path => fs.readFileSync(new URL('../' + path, import.meta.url), 'utf8');
test('ordinary iframe previews keep both companions available', () => {
  for (const name of ['', 'HTML preview', 'preview', 'sandbox', 'apex-site']) assert.equal(shouldHideCompanions(true, name), false);
});
test('only the named assistant workspace suppresses its duplicate companions', () => {
  assert.equal(shouldHideCompanions(true, ASSISTANT_FRAME_NAME), true);
  assert.equal(shouldHideCompanions(false, ASSISTANT_FRAME_NAME), false);
  assert.equal(shouldHideCompanions(true, 'apex-assistant-website-other'), false);
});
test('frame detection is safe during server rendering', () => {
  assert.equal(typeof window, 'undefined');
  assert.equal(isAssistantWebsiteFrame(), false);
});
test('shell and assistant share the same frame decision and iframe is explicitly named', () => {
  const shell = source('components/demo-journey/ApexDemoShell.tsx');
  const assistant = source('components/assistant/SmartAssistantLauncher.tsx');
  assert.match(shell, /isAssistantWebsiteFrame/);
  assert.match(assistant, /name=\{ASSISTANT_FRAME_NAME\}/);
  assert.match(assistant, /return embedded \? null : <SmartAssistantCompanion/);
  assert.doesNotMatch(shell + assistant, /window\.self\s*!==\s*window\.top/);
});
test('fresh or corrupt helper storage opens a welcome, without creating completed tasks', () => {
  for (const raw of [null, 'invalid', '{"collapsed":true}', JSON.stringify({...initialHelper(), view: 'missing'})]) {
    const s = readHelper(raw);
    assert.equal(s.view, 'welcome'); assert.equal(s.collapsed, false);
    assert.deepEqual(s.status, initialHelper().status);
  }
});
test('reopening a deliberately minimised helper keeps the visitor’s task and milestones', () => {
  let s = reduceHelper(initialHelper(), {type:'select', task:'quick-price'});
  s = reduceHelper(s, {type:'prepare'});
  s = reduceHelper(s, {type:'signal', signal:'quick-result'});
  const collapsed = reduceHelper(s, {type:'collapse', value:true});
  assert.deepEqual(reduceHelper(readHelper(JSON.stringify(collapsed)), {type:'collapse', value:false}), s);
});
test('helper has a recoverable launcher, central welcome and a body portal', () => {
  const helper = source('components/demo-helper/DemoHelper.tsx');
  assert.match(helper, /createPortal/); assert.match(helper, /document\.body/);
  assert.match(helper, /HELPER_REVEAL_EVENT/); assert.match(helper, /role="dialog"/);
  assert.match(source('components/demo-helper/helper.css'), /\.dh-panel\.dh-welcome\{left:50%;top:50%/);
  assert.match(source('components/demo-journey/ApexDemoShell.tsx'), /onClick=\{revealHelper\}/);
});
test('tool cards and contact actions use shared SVG assets, not emoji or stray drawing strokes', () => {
  const icons=source('components/demo-helper/ApexIcon.tsx');
  for (const name of ['phone','mail','quick','detail','plan']) assert.match(icons, new RegExp(`"${name}"`));
  assert.match(source('components/demo-helper/RoofToolChoices.tsx'), /<ApexIcon name=\{kind\}/);
  assert.doesNotMatch(source('components/demo-helper/RoofToolChoices.tsx'), /m23 5 3 2/);
  assert.match(source('components/demo-sites/act-roofing/site-sections.tsx'), /<ApexIcon name="phone"/);
  assert.match(source('docs/ICON_CREDITS.md'), /Creative Commons Attribution/);
});
test('inner Apex pages share labelled, semantic breadcrumb navigation', () => {
  const crumbs = source('components/demo-helper/ApexBreadcrumbs.tsx');
  assert.match(crumbs, /aria-label="Breadcrumb"/); assert.match(crumbs, /aria-current="page"/);
  for (const p of ['components/demo-helper/ApexToolHeader.tsx','components/demo-sites/apex-pages/ApexContentPage.tsx','components/demo-sites/act-roofing/PriceListPage.tsx','app/supplier-pricing-tool/quote/page.tsx']) assert.match(source(p), /ApexBreadcrumbs/);
  assert.match(source('components/quick-estimate/QuickRoofEstimate.tsx'), /ApexToolHeader/);
  assert.doesNotMatch(source('components/quick-estimate/QuickRoofEstimate.tsx'), /qr-intro-bar/);
});
test('Apex plan and quote return paths stay with Apex rather than the generic supplier tool', () => {
  assert.match(source('app/supplier-pricing-tool/TakeoffStation.tsx'), /backHref=\{config.slug === 'apex-roofing'/);
  assert.match(source('app/supplier-pricing-tool/TakeoffWorkstation.tsx'), /href=\{backHref \?\?/);
  assert.match(source('app/supplier-pricing-tool/OutputActions.tsx'), /supplier=apex-roofing/);
  assert.match(source('app/supplier-pricing-tool/quote/page.tsx'), /href=\{apex \? "\/supplier-pricing-tool\/apex-roofing"/);
});
test('admin demo entry reads the router query inside a Suspense boundary', () => {
  const s = source('app/supplier-pricing-tool/admin/AdminPanel.tsx');
  assert.match(s, /useSearchParams/); assert.match(s, /<Suspense/);
  assert.doesNotMatch(s, /new URLSearchParams\(window.location.search\)/);
});

test('local enquiry preview keeps native validation without requiring sandbox allow-forms', () => {
  const s = source('components/quick-estimate/QuickQuoteEnquiry.tsx');
  assert.match(s, /function preparePreview\(\)/);
  assert.match(s, /e\.currentTarget\.form\?\.reportValidity\(\)/);
  assert.match(s, /onKeyDown/);
  assert.match(s, /validateDemoContact\(details\)/);
  assert.doesNotMatch(s, /type="submit">Preview my enquiry/);
});
test('assistant send control works without native form submission and respects composition', () => {
  const s = source('components/assistant/SmartAssistantLauncher.tsx');
  assert.match(s, /type="button" onClick=\{\(\) => sendMessage\(input\)\} disabled=\{busy/);
  assert.match(s, /!e\.nativeEvent\.isComposing/);
});
test('small-screen contact layout shrinks its columns rather than hiding overflow', () => {
  const s = source('app/demo/roofing-site/act.css');
  assert.match(s, /#contact > \.site-shell\{grid-template-columns:minmax\(0,1fr\)\}/);
  assert.match(s, /#contact \.form-field\{width:100%;min-width:0\}/);
});
