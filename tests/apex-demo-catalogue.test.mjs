import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
register(new URL('./ts-resolve.mjs', import.meta.url));
const { calculateApexQuickEstimate, getApexQuickPricing } = await import('../lib/quick-estimate/server.ts');
const { parseQuickInput } = await import('../lib/quick-estimate/validation.ts');
const base = { shape: 'gable', size: 'medium', pitch: 'typical', storeys: 2, flatExtension: null, project: 'reroof', existingMaterial: 'tile', covering: 'tile', flatCovering: null };
const pitched = ['tile','slate','shingle','pressed_metal','longrun'];
const flat = ['epdm','grp'];
test('seven homeowner demo systems have material, labour and explicit exclusions', () => {
 const { catalog, profile } = getApexQuickPricing();
 assert.equal(profile.version, 'apex-uk-demo-2.0');
 for (const key of [...pitched,...flat]) {
  const sys = profile.systems[key]; assert.ok(sys, key);
  assert.ok(sys.areaProducts.length, key);
  for (const id of [...sys.areaProducts,...Object.values(sys.components)]) {
   const product = catalog.find(p=>p.id===id); assert.ok(product,`${key}: ${id}`);
   assert.ok(product.unitPrice >= 0 && product.defaultLabourRate >= 0);
  }
  assert.ok(sys.exclusions.length, key);
 }
});
test('five pitched systems calculate positive bounded subtotal on typical roofs',()=>{
 for(const covering of pitched){
  const r=calculateApexQuickEstimate({...base,covering});
  assert.ok(['priced','partial'].includes(r.price.status),`${covering}: ${r.price.status}`);
  assert.ok(r.price.low.total>0 && r.price.high.total>=r.price.low.total,covering);
  assert.ok(r.price.low.supplierOutput.material>0,covering);
  assert.ok(!r.price.low.supplierOutput.lines.some(x=>x.groupKey==='spouting'), 'No invented gutter purchase');
 }
});
test('two flat systems have prices and flat perimeter details',()=>{
 for(const covering of flat){
  const r=calculateApexQuickEstimate({...base,shape:'flat',pitch:null,covering});
  assert.ok(['priced','partial'].includes(r.price.status),`${covering}: ${r.price.status}`);
  assert.ok(r.price.low.total>0 && r.price.high.total>=r.price.low.total);
  assert.ok(r.price.low.materials>0);
 }
});
test('mixed roof uses separately priced flat extension without duplicating gutter',()=>{
 const r=calculateApexQuickEstimate({...base,flatExtension:'small',flatCovering:'epdm'});
 assert.ok(['priced','partial'].includes(r.price.status));
 assert.equal(r.price.low.sections.length,2);
 assert.ok(r.price.low.total>0);
});
test('unsupported slate pitch is never priced as though compatible',()=>{
 const r=calculateApexQuickEstimate({...base,pitch:'low',covering:'slate'});
 assert.equal(r.price.status,'incompatible');assert.equal(r.price.low,null);
});
test('new selections are accepted by the public parser',()=>{
 for(const covering of pitched) assert.equal(parseQuickInput({...base,covering}).covering,covering);
});
