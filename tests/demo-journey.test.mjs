import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import fs from 'node:fs';
register(new URL('./ts-resolve.mjs', import.meta.url));
const { initialJourney, readJourney, reduceJourney } = await import('../lib/demo-journey/state.ts');
const { DEMO_TASKS, TASK_IDS, getTask, isTaskId, nextTask, ASSISTANT_QUESTION } = await import('../lib/demo-journey/config.ts');
const { createDemoMeasurements, applyDemoRecipe, createSamplePlanMeasurements, tracedPlanArea, QUICK_DEMO_INPUT } = await import('../lib/demo-journey/samples.ts');
const { getApexQuickPricing, calculateApexQuickEstimate } = await import('../lib/quick-estimate/server.ts');
const { groupPitchedTotal } = await import('../app/supplier-pricing-tool/types.ts');
const { priceOutput } = await import('../app/supplier-pricing-tool/pricing.ts');
const { catalog } = getApexQuickPricing();
const attempt = (id) => reduceJourney(reduceJourney(initialJourney(), { type: 'start', task: id }), { type: 'attempt' });
const close = (a,b) => assert.ok(Math.abs(a-b)<1e-7, `${a} != ${b}`);

test('journey has four core experiences and one genuinely optional trade task', () => {
  assert.equal(DEMO_TASKS.filter(t=>!t.optional).length,4);
  assert.equal(DEMO_TASKS.filter(t=>t.optional).length,1);
  assert.equal(getTask('trade').optional,true);
  assert.equal(ASSISTANT_QUESTION,'Do you handle insurance work?');
  assert.equal(new Set(DEMO_TASKS.map(t=>t.signal)).size,5);
  assert.ok(DEMO_TASKS.every(t=>t.route.startsWith('/')));
});
test('initial journey is inactive and never claims completed experiences', () => {
  const s=initialJourney(); assert.equal(s.active,false); assert.equal(s.attempted,null);
  assert.ok(Object.values(s.status).every(v=>v==='untried'));
});
test('malformed, stale, oversized or forged progress is rejected safely', () => {
  for (const raw of [null,'bad','null','[]',JSON.stringify({...initialJourney(),version:2}),JSON.stringify({...initialJourney(),current:'__proto__'}),JSON.stringify({...initialJourney(),status:{quick:'completed'}}),JSON.stringify({...initialJourney(),attempted:'wat'}),' '.repeat(5000)]) assert.deepEqual(readJourney(raw),initialJourney());
  assert.equal(isTaskId('__proto__'),false); assert.equal(isTaskId(['quick']),false);
});
test('valid progress survives refresh without retaining arbitrary extra fields', () => {
  const s=reduceJourney(attempt('quick'),{type:'signal',signal:'quick-result'});
  assert.deepEqual(readJourney(JSON.stringify({...s,totalPrice:1,customerEmail:'not-stored'})),s);
});
test('visiting a task or receiving an unrelated result does not complete it', () => {
  const s=reduceJourney(initialJourney(),{type:'start',task:'quick'});
  assert.equal(reduceJourney(s,{type:'signal',signal:'quick-result'}),s);
  const a=attempt('quick');assert.equal(reduceJourney(a,{type:'signal',signal:'assistant-answer'}),a);
});
test('each task completes only through its matching result signal', () => {
  for(const t of DEMO_TASKS) {
    const s=reduceJourney(attempt(t.id),{type:'signal',signal:t.signal});
    assert.equal(s.status[t.id],'completed'); assert.equal(s.current,t.id);
    assert.equal(Object.values(s.status).filter(v=>v==='completed').length,1);
    assert.equal(reduceJourney(s,{type:'signal',signal:t.signal}),s);
  }
});
test('failed assistant requests remain incomplete, and a successful retry can complete', () => {
  const failed=reduceJourney(attempt('assistant'),{type:'failure',task:'assistant'});
  assert.equal(failed.error,true);assert.equal(failed.status.assistant,'untried');
  const success=reduceJourney(reduceJourney(failed,{type:'attempt'}),{type:'signal',signal:'assistant-answer'});
  assert.equal(success.error,false);assert.equal(success.status.assistant,'completed');
});
test('declining a sample import cancels the attempt, so an old output cannot count', () => {
  const cancelled=reduceJourney(attempt('detailed'),{type:'cancel'});
  assert.equal(cancelled.attempted,null);
  assert.equal(reduceJourney(cancelled,{type:'signal',signal:'detailed-output'}),cancelled);
});
test('pausing ignores result signals but preserves progress for resuming', () => {
  const s=reduceJourney(attempt('quick'),{type:'pause'});
  assert.equal(reduceJourney(s,{type:'signal',signal:'quick-result'}),s);
  assert.equal(reduceJourney(s,{type:'resume'}).active,true);
});
test('skipped tasks stay distinct from completed tasks, including the final optional step', () => {
  const s=reduceJourney(attempt('assistant'),{type:'skip'});assert.equal(s.current,'quick');assert.equal(s.status.assistant,'skipped');
  const last=reduceJourney(attempt('trade'),{type:'skip'});assert.equal(last.active,false);assert.equal(last.status.trade,'skipped');
  assert.equal(nextTask('trade'),null);
});
test('next and direct selection do not silently complete other tasks', () => {
  const s=reduceJourney(attempt('assistant'),{type:'next'});assert.equal(s.status.assistant,'untried');
  const direct=reduceJourney(s,{type:'select',task:'trade'});assert.equal(direct.current,'trade');assert.equal(direct.attempted,null);
});
test('restarting clears only tour state and keeps it ready to begin', () => {
  const s=reduceJourney(reduceJourney(attempt('quick'),{type:'signal',signal:'quick-result'}),{type:'restart'});
  assert.deepEqual(s,{...initialJourney(),active:true});
});
test('quick demo inputs are valid and calculate a real ordered price range', () => {
  const r=calculateApexQuickEstimate(QUICK_DEMO_INPUT);assert.ok(r.price.low.total>0);assert.ok(r.price.high.total>r.price.low.total);
});
test('manual sample quantities are actual roof values, not footprint values converted twice', () => {
  const set=createDemoMeasurements(catalog);assert.equal(set.entryPath,'actual');
  close(groupPitchedTotal(set,'roofAreas'),120);close(groupPitchedTotal(set,'ridges'),10);close(groupPitchedTotal(set,'barges'),24);
  assert.equal(set.groups.hips.entries.length,0);assert.equal(set.groups.valleys.entries.length,0);
});
test('sample plan requires four ordered corners and computes the calibrated footprint', () => {
  close(tracedPlanArea([0,1,2,3]),80);
  for(const points of [[],[0,1,2],[0,2,1,3],[0,1,2,2],[0,1,2,3,4],[0,1,2,NaN]])assert.throws(()=>tracedPlanArea(points));
});
test('plan transfer retains plan-area provenance and existing pitch rules apply once', () => {
  const set=createSamplePlanMeasurements([0,1,2,3]);assert.equal(set.entryPath,'plan');
  close(set.groups.roofAreas.entries[0].value,80);
  close(groupPitchedTotal(set,'roofAreas'),80/Math.cos(Math.PI/6));
  close(groupPitchedTotal(set,'ridges'),10);
  close(groupPitchedTotal(set,'barges'),16/Math.cos(Math.PI/6));
});
test('demo recipes reuse current products and do not mutate the catalogue or source measurements', () => {
  const before=structuredClone(catalog),source=createSamplePlanMeasurements([0,1,2,3]),original=structuredClone(source);
  const job=applyDemoRecipe(source,catalog);assert.deepEqual(source,original);assert.deepEqual(catalog,before);
  const output=priceOutput(job,catalog,true);
  assert.ok(output.lines.length>=6);assert.ok(output.material>0&&output.labour>0);
  for(const line of output.lines)assert.equal(line.unitPrice,catalog.find(p=>p.id===line.productId).unitPrice);
});
test('changing the sample covering changes product prices but not its measured quantities', () => {
  const tile=createDemoMeasurements(catalog,'tile'),slate=createDemoMeasurements(catalog,'slate');
  assert.deepEqual(tile.groups,slate.groups);assert.ok(priceOutput(slate,catalog).material>priceOutput(tile,catalog).material);
  assert.ok(slate.appliedProducts.some(p=>p.productId==='cupa-r18'));
});
test('trade comparison uses the same quantities and labour with discounted material rates', () => {
  const set=createDemoMeasurements(catalog),retail=priceOutput(set,catalog,true);
  const tradeCatalog=catalog.map(p=>({...p,unitPrice:Math.round(p.unitPrice*.88*100)/100}));
  const trade=priceOutput(set,tradeCatalog,true);assert.ok(trade.material<retail.material);assert.equal(trade.labour,retail.labour);
  assert.deepEqual(trade.lines.map(l=>l.purchaseQty),retail.lines.map(l=>l.purchaseQty));
});
test('missing sample recipe products fail rather than returning misleading incomplete totals', () => {
  assert.throws(()=>createDemoMeasurements(catalog.filter(p=>p.id!=='marley-edgemere')),/product missing/);
});
test('guided routes exist and keep noindex metadata', () => {
  for(const file of ['app/demo/roofing-site/walkthrough/page.tsx','app/demo/roofing-site/walkthrough/summary/page.tsx']) {
    const source=fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');assert.match(source,/index: false/);
  }
});
