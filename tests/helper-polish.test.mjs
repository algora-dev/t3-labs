import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
register(new URL('./ts-resolve.mjs', import.meta.url));
const { getRoofPlanView, PLAN_VIEWBOX } = await import('../lib/quick-estimate/plan-view.ts');
const { getRoofMesh } = await import('../lib/quick-estimate/geometry.ts');
const { ROOF_TEMPLATES } = await import('../lib/quick-estimate/templates.ts');
const { SIZE_BANDS } = await import('../lib/quick-estimate/config.ts');
const { initialHelper, reduceHelper, readHelper } = await import('../lib/demo-helper/state.ts');
const { TASKS } = await import('../lib/demo-helper/config.ts');
const src = p => fs.readFileSync(new URL('../'+p, import.meta.url), 'utf8');
const bounds = plan => {
  const points = plan.edges.flatMap(e => [e.start,e.end]);
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  return {x0:Math.min(...xs),x1:Math.max(...xs),y0:Math.min(...ys),y1:Math.max(...ys)};
};
const near = (a,b) => assert.ok(Math.abs(a-b)<1e-6, `${a} != ${b}`);

for (const shape of Object.keys(ROOF_TEMPLATES)) test(`${shape}: all five plan views retain the selected roof geometry and scale monotonically`, () => {
  const mesh = getRoofMesh(shape), before = JSON.stringify(mesh);
  let previous = null;
  for (const size of Object.keys(SIZE_BANDS)) {
    const plan = getRoofPlanView(shape,size), box = bounds(plan);
    assert.equal(plan.shape,shape); assert.equal(plan.size,size);
    assert.equal(plan.edges.length,mesh.edges.length);
    assert.deepEqual(plan.edges.map(e=>e.kind),mesh.edges.map(e=>e.kind));
    for (const f of plan.faces) { assert.ok(f.path.startsWith('M')); assert.doesNotMatch(f.path,/NaN|Infinity/); }
    for (const e of plan.edges) for (const [x,y] of [e.start,e.end]) {
      assert.ok(Number.isFinite(x)&&Number.isFinite(y));
      assert.ok(x>=10&&x<=PLAN_VIEWBOX.width-10);assert.ok(y>=10&&y<=PLAN_VIEWBOX.height-10);
    }
    near((box.x0+box.x1)/2,PLAN_VIEWBOX.width/2);
    near((box.y0+box.y1)/2,PLAN_VIEWBOX.height/2);
    if(previous) {
      assert.ok(plan.relativeScale>previous.plan.relativeScale);
      assert.ok(box.x1-box.x0>previous.box.x1-previous.box.x0);
      assert.ok(box.y1-box.y0>previous.box.y1-previous.box.y0);
      const a=SIZE_BANDS[size],b=SIZE_BANDS[previous.plan.size];
      near(((box.x1-box.x0)*(box.y1-box.y0))/((previous.box.x1-previous.box.x0)*(previous.box.y1-previous.box.y0)),(a.min+a.max)/(b.min+b.max));
    }
    previous={plan,box};
  }
  assert.equal(JSON.stringify(mesh),before,'drawing must not mutate the measurement mesh');
});
test('all nine pitched roof types have distinct plan details; flat does not acquire pitched components',()=>{
 const signatures=new Set();
 for(const shape of Object.keys(ROOF_TEMPLATES)) {
  const plan=getRoofPlanView(shape,'large');
  signatures.add(JSON.stringify([plan.faces,plan.edges,plan.slopeArrow]));
 }
 assert.equal(signatures.size,10);
 assert.ok(getRoofPlanView('flat','small').edges.every(e=>e.kind==='flat_edge'));
 assert.equal(getRoofPlanView('flat','small').slopeArrow,null);
 assert.ok(getRoofPlanView('mono','small').slopeArrow);
 assert.ok(getRoofPlanView('dormer','large').edges.some(e=>e.kind==='flashing'));
});
test('plan renderer rejects unsupported sizes or shapes rather than silently misrepresenting a roof',()=>{
 assert.throws(()=>getRoofPlanView('not-a-roof','small'),/Unknown roof shape/);
 assert.throws(()=>getRoofPlanView('gable','enormous'),/Unknown footprint size/);
 assert.throws(()=>getRoofPlanView('gable','__proto__'),/Unknown footprint size/);
});
test('selected size and roof illustrations are decoration inside accessible radio labels',()=>{
 assert.match(src('components/quick-estimate/QuickRoofEstimate.tsx'),/<RoofPlanIllustration shape=\{a.shape \?\? 'gable'\} size=\{id as SizeId\}/);
 assert.doesNotMatch(src('components/quick-estimate/QuickRoofEstimate.tsx'),/qr-size-icon/);
 const graphic=src('components/quick-estimate/RoofPlanIllustration.tsx');
 assert.match(graphic,/aria-hidden="true"/);assert.match(graphic,/focusable="false"/);
 assert.match(src('components/quick-estimate/QuickRoofEstimate.tsx'),/type="radio"/);
});
test('only the explicit Hide handler can collapse the current helper',()=>{
 const helper=src('components/demo-helper/DemoHelper.tsx');
 assert.equal([...helper.matchAll(/type: 'collapse', value: true/g)].length,1);
 assert.match(helper,/function hideGuide\(\)\s*\{\s*updateHelper\(\{ type: 'collapse', value: true/);
 assert.match(helper,/className="dh-hide-bar" onClick=\{hideGuide\}/);
 assert.equal([...helper.matchAll(/onClick=\{hideGuide\}/g)].length,1);
 assert.doesNotMatch(helper,/addEventListener\('focusin'|onClick=\{minimise\}|key === 'Escape'/);
 for(const file of ['components/quick-estimate/QuickRoofEstimate.tsx','components/quick-estimate/QuickQuoteEnquiry.tsx','app/supplier-pricing-tool/SupplierEnquiryModal.tsx']) assert.doesNotMatch(src(file),/type: 'collapse'/);
});
for(const hidden of [false,true]) test(`workflow milestones preserve ${hidden?'hidden':'visible'} guide through every task`,()=>{
 for(const task of Object.keys(TASKS)) {
  let s=reduceHelper(initialHelper(),{type:'select',task});
  s=reduceHelper(s,{type:'collapse',value:hidden});
  s=reduceHelper(s,{type:'prepare'});assert.equal(s.collapsed,hidden);
  s=reduceHelper(s,{type:'error'});assert.equal(s.collapsed,hidden);
  for(const signal of TASKS[task].requirements) {
   s=reduceHelper(s,{type:'signal',signal});assert.equal(s.collapsed,hidden);
  }
  assert.equal(s.view,'benefit');assert.equal(readHelper(JSON.stringify(s)).collapsed,hidden);
 }
});
test('next, skip and explicit task switches keep an open helper open',()=>{
 let s=reduceHelper(initialHelper(),{type:'start'});
 for(let i=0;i<3;i++) {
  assert.equal(s.collapsed,false);s=reduceHelper(s,{type:'manual'});
  s=reduceHelper(s,{type:'next'});assert.equal(s.collapsed,false);
 }
 assert.equal(s.view,'finish');
 assert.equal(reduceHelper(initialHelper(),{type:'skip'}).collapsed,false);
});
test('guide branding is isolated, text is opaque and transparency has a readable fallback',()=>{
 const css=src('components/demo-helper/helper.css');
 assert.match(css,/--dh-lime:#d7ff00/);assert.match(css,/--dh-ink:#0a0b10/);
 assert.match(css,/font-family:Inter,system-ui/);
 assert.match(css,/@supports.*backdrop-filter/);
 assert.match(css,/background:rgba\(10,11,16,\.65\)/);
 assert.match(css,/prefers-reduced-transparency/);assert.match(css,/prefers-reduced-motion/);
 assert.doesNotMatch(css,/\.dh-(?:panel|content|launcher)[^{]*\{[^}]*\bopacity\s*:/);
 assert.match(css,/\.dh-panel \.dh-hide-bar[\s\S]*?width:100%; min-height:44px/);
 assert.match(src('components/demo-helper/DemoHelper.tsx'),/Show demo guide/);
});
test('the supplied transparent logo is shipped without recolouring or regenerating it',()=>{
 const data=fs.readFileSync(new URL('../public/assets/t3-demo-guide/t3-logo-icon-glow-transparent.png',import.meta.url));
 const expected='1829caa5a09acd2cb1d352689d1d39766f439b0f35427823fd0d63888d6f3dc9';
 assert.equal(createHash('sha256').update(data).digest('hex'),expected);
 const helper=src('components/demo-helper/DemoHelper.tsx');
 assert.match(helper,/t3-logo-icon-glow-transparent.png/);
 assert.doesNotMatch(src('components/demo-helper/helper.css'),/\.dh-logo[^}]*filter:/);
});
