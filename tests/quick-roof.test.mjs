import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
register(new URL('./ts-resolve.mjs', import.meta.url));
const { measureRoof, measureSection } = await import('../lib/quick-estimate/engine.ts');
const { getRoofMesh } = await import('../lib/quick-estimate/geometry.ts');
const { SIZE_BANDS, PITCH_BANDS } = await import('../lib/quick-estimate/config.ts');
const { ROOF_TEMPLATES, PITCHED_SHAPES } = await import('../lib/quick-estimate/templates.ts');
const { parseQuickInput } = await import('../lib/quick-estimate/validation.ts');
const { createQuickResult, validatePricingProfile } = await import('../lib/quick-estimate/pricing.ts');
const { toSupplierMeasurements } = await import('../lib/quick-estimate/supplier-adapter.ts');
const { getApexQuickPricing, calculateApexQuickEstimate } = await import('../lib/quick-estimate/server.ts');
const { resolveHandoff, createHandoff } = await import('../lib/quick-estimate/handoff.ts');
const { POST } = await import('../app/api/quick-roof-estimate/route.ts');
const { groupPitchedTotal } = await import('../app/supplier-pricing-tool/types.ts');
const { priceOutput } = await import('../app/supplier-pricing-tool/pricing.ts');

const BASE = { shape: 'gable', size: 'small', pitch: 'typical', storeys: 1, flatExtension: null, project: 'reroof', existingMaterial: 'tile', covering: 'tile', flatCovering: null };
const FLAT = { ...BASE, shape: 'flat', pitch: null, covering: 'epdm' };
const { catalog, profile } = getApexQuickPricing();
const close = (actual, expected, epsilon = 1e-6) => assert.ok(Math.abs(actual - expected) < epsilon, `${actual} should equal ${expected}`);
const calculate = (patch = {}, p = profile, c = catalog) => createQuickResult({ ...BASE, ...patch }, c, p);

test('agreed five footprint bands and three pitch bands are preserved', () => {
  assert.deepEqual(Object.values(SIZE_BANDS).map(b => [b.min, b.max]), [[60,100],[100,150],[150,190],[190,250],[250,300]]);
  assert.deepEqual(Object.values(PITCH_BANDS).map(b => [b.min,b.max]), [[5,15],[15,30],[30,50]]);
  assert.equal(PITCHED_SHAPES.length, 9);
});
test('simple gable has one ridge, four barge runs, two eaves and no hips or valleys', () => {
  const mesh = getRoofMesh('gable');
  assert.equal(mesh.edges.filter(e => e.kind === 'ridge').length, 1);
  assert.equal(mesh.edges.filter(e => e.kind === 'verge').length, 4);
  const q = measureSection('gable', 60, 30).quantities;
  close(q.roofAreaM2, 60 / Math.cos(Math.PI / 6));
  close(q.ridgeM, 10); close(q.eavesM, 20); close(q.vergeM, 12 / Math.cos(Math.PI / 6));
  assert.equal(q.hipM, 0); assert.equal(q.valleyM, 0);
});
test('mono-pitch has one slope, no ridge and an explicit high edge', () => {
  const q = measureSection('mono', 60, 30).quantities;
  close(q.eavesM, 10); close(q.highEdgeM, 10); close(q.vergeM, 12 / Math.cos(Math.PI / 6));
  assert.equal(q.ridgeM + q.hipM + q.valleyM, 0);
});
test('hip lengths use diagonal plan runs and vertical rise, not a naive slope factor', () => {
  const q = measureSection('hip',60,30).quantities;
  close(q.hipM, 4 * 3 * Math.sqrt(2 + Math.tan(Math.PI/6) ** 2));
  close(q.ridgeM,4); close(q.eavesM,32); assert.equal(q.vergeM,0);
});
test('intersecting footprints are unions, never sums of overlapping rectangles', () => {
  const expected = { mono:60, gable:60, hip:60, l_gable:84, t_gable:96, l_hip:84, u_gable:156, dormer:96, complex:158, flat:60 };
  for (const [shape, area] of Object.entries(expected)) close(getRoofMesh(shape).footprintM2,area);
});
test('all 135 pitched shape-size-pitch combinations have coherent finite ordered endpoints', () => {
  let combinations = 0;
  for (const shape of PITCHED_SHAPES.map(t => t.id)) for (const size of Object.keys(SIZE_BANDS)) for (const pitch of Object.keys(PITCH_BANDS)) {
    const r = measureRoof({ ...BASE, shape, size, pitch }); combinations++;
    close(r.low.totals.footprintM2, SIZE_BANDS[size].min);
    close(r.high.totals.footprintM2, SIZE_BANDS[size].max);
    close(r.low.totals.roofAreaM2, SIZE_BANDS[size].min / Math.cos(PITCH_BANDS[pitch].min * Math.PI/180));
    close(r.high.totals.roofAreaM2, SIZE_BANDS[size].max / Math.cos(PITCH_BANDS[pitch].max * Math.PI/180));
    for (const key of Object.keys(r.low.totals)) {
      assert.ok(Number.isFinite(r.low.totals[key]) && r.low.totals[key] >= 0, `${shape}/${key}`);
      assert.ok(r.high.totals[key] + 1e-7 >= r.low.totals[key], `${shape}/${key} not ordered`);
    }
  }
  assert.equal(combinations,135);
});
test('component lengths scale by square root of area, not area itself', () => {
  const a = measureSection('gable', 60, 30), b = measureSection('gable', 240, 30);
  close(b.quantities.roofAreaM2 / a.quantities.roofAreaM2,4);
  close(b.quantities.ridgeM / a.quantities.ridgeM,2);
  close(b.quantities.vergeM / a.quantities.vergeM,2);
});
test('storeys alter access only and preserve both complete quantity scenarios', () => {
  const one = measureRoof(BASE), two = measureRoof({ ...BASE, storeys:2 });
  assert.deepEqual(one.low.totals,two.low.totals); assert.deepEqual(one.high.totals,two.high.totals);
  assert.equal(two.high.access.mainStoreys,2); assert.ok(two.high.access.referenceHeightM > one.high.access.referenceHeightM);
});
test('flat roofs do not acquire pitch, ridges, hips, valleys or invented membrane upstands', () => {
  for (const size of Object.keys(SIZE_BANDS)) {
    const r = measureRoof({ ...FLAT,size });
    close(r.low.totals.roofAreaM2,SIZE_BANDS[size].min); close(r.high.totals.roofAreaM2,SIZE_BANDS[size].max);
    assert.equal(r.high.totals.ridgeM + r.high.totals.hipM + r.high.totals.valleyM,0);
    assert.ok(r.high.totals.flatEdgeM > 0);
  }
});
test('an optional flat extension is added separately with no pitched-area conversion', () => {
  const r = measureRoof({ ...BASE,pitch:'steep',flatExtension:'small' });
  close(r.low.totals.footprintM2,70); close(r.high.totals.footprintM2,120);
  close(r.low.sections[1].quantities.roofAreaM2,10); close(r.high.sections[1].quantities.roofAreaM2,20);
  assert.equal(r.high.access.extensionStoreys,1);
});
test('dormers have real junction geometry without counting their plan area twice', () => {
  const q = measureSection('dormer',96,30).quantities;
  close(q.roofAreaM2,96 / Math.cos(Math.PI/6)); assert.equal(q.dormerCount,2);
  assert.ok(q.valleyM > 0 && q.flashingM > 0);
});
test('roof illustrations and engine reference the same template meshes', () => {
  for (const id of Object.keys(ROOF_TEMPLATES)) {
    assert.equal(getRoofMesh(id),getRoofMesh(id));
    assert.ok(getRoofMesh(id).faces.length > 0);
    assert.ok(getRoofMesh(id).edges.every(e => e.start.length === 3 && e.end.length === 3));
  }
});
test('invalid dimensions, roof choices and contradictory flat inputs are rejected', () => {
  for (const bad of [NaN,Infinity,-1,0]) assert.throws(() => measureSection('gable',bad,30));
  assert.throws(() => measureSection('gable',60,85));
  for (const patch of [{shape:'__proto__'},{shape:'toString'},{size:'enormous'},{pitch:null},{storeys:3},{flatExtension:'huge'}]) assert.throws(() => measureRoof({...BASE,...patch}));
  assert.throws(() => measureRoof({...FLAT,pitch:'typical'}));
  assert.throws(() => measureRoof({...FLAT,flatExtension:'small'}));
});
test('public input accepts selections only and rejects client-supplied prices and quantities', () => {
  assert.deepEqual(parseQuickInput(BASE),BASE);
  for (const extra of [{total:1},{roofArea:1},{discountPct:99},{__unexpected:true}]) assert.throws(() => parseQuickInput({...BASE,...extra}));
  assert.throws(() => parseQuickInput(null)); assert.throws(() => parseQuickInput([]));
});
test('material category and project conditional fields are validated', () => {
  assert.throws(() => parseQuickInput({...BASE,covering:'epdm'}));
  assert.throws(() => parseQuickInput({...FLAT,covering:'slate'}));
  assert.throws(() => parseQuickInput({...BASE,project:'new_roof'}));
  assert.throws(() => parseQuickInput({...BASE,flatExtension:'small'}));
  assert.doesNotThrow(() => parseQuickInput({...BASE,project:'new_roof',existingMaterial:null}));
});
test('typical-band tile pricing uses its compatible subrange without changing the measurement band', () => {
  const r = calculate();
  assert.equal(r.measurements.low.sections[0].pitchDegrees,15);
  assert.equal(r.price.low.sections[0].pitchDegrees,15);
  assert.equal(r.price.high.sections[0].pitchDegrees,30);
  assert.equal(r.price.status,'partial');
});
test('low-pitch tile prices only the compatible end of the band', () => {
  const r = calculate({pitch:'low'});
  assert.equal(r.price.status,'partial'); assert.ok(r.price.low.total>0); assert.ok(r.price.notes.some(n=>n.includes('15-15')));
  assert.ok(r.measurements.high.totals.roofAreaM2 > 0);
});
test('flat and legacy metal demo rates produce subtotal with explicit exclusions', () => {
  for (const input of [FLAT,{...BASE,covering:'longrun'},{...BASE,flatExtension:'small',flatCovering:'epdm'}]) {
    const r = calculateApexQuickEstimate(input);
    assert.equal(r.price.status,'partial'); assert.ok(r.price.low.total>0); assert.ok(r.price.missing.length);
  }
});
test('price adapter actually reuses the existing supplier engine and public rates', () => {
  const r = calculate({pitch:'steep'});
  const {set} = toSupplierMeasurements({...r.measurements.low,sections:r.price.low.sections});
  const priced = r.price.low.supplierOutput;
  const m = new Map(catalog.map(p=>[p.id,p]));
  for (const line of priced.lines) {
    assert.equal(line.unitPrice,m.get(line.productId).unitPrice);
    assert.ok(line.calcQty>0);
    assert.ok(!['spouting','downpipes'].includes(line.groupKey));
    set.appliedProducts.push({id:line.productId+line.entryLabel,groupKey:line.groupKey,productId:line.productId,entryId:null,wastePct:line.wastePct,wasteFlat:line.wasteFlat,wasteMode:line.wasteMode,labourRate:0,qtyOverride:line.calcQty,priceOverride:null});
  }
  close(priceOutput(set,catalog,false).material,priced.material,0.02);
});
test('changes to supplier product prices flow through without changing geometry', () => {
  const original=calculate({pitch:'steep'});
  const changed=calculate({pitch:'steep'},profile,catalog.map(p=>p.id==='marley-edgemere'?{...p,unitPrice:p.unitPrice+10}:p));
  assert.deepEqual(original.measurements,changed.measurements);
  assert.ok(changed.price.low.total>original.price.low.total);
});
test('complex roof components increase configured cost without a blanket material surcharge', () => {
  const g=calculate({pitch:'steep'}),c=calculate({shape:'complex',pitch:'steep'});
  close(g.measurements.low.totals.roofAreaM2,c.measurements.low.totals.roofAreaM2);
  assert.ok(c.price.low.total>g.price.low.total);
  assert.ok(c.price.low.supplierOutput.lines.some(l=>l.groupKey==='valleys'));
});
test('new roofs omit removal while re-roofs use raw surface area without waste', () => {
  const old=calculate({pitch:'steep'}), fresh=calculate({pitch:'steep',project:'new_roof',existingMaterial:null});
  assert.equal(fresh.price.low.removal,0);
  close(old.price.low.removal,Math.round((old.price.low.sections[0].quantities.roofAreaM2*profile.removal.perM2+profile.removal.disposalPerJob)*100)/100);
});
test('material-specific removal configuration can override the generic business rate', () => {
  const p=structuredClone(profile);p.removalByMaterial.slate={perM2:20,disposalPerJob:1500};
  assert.ok(calculate({existingMaterial:'slate',pitch:'steep'},p).price.low.removal>calculate({existingMaterial:'slate',pitch:'steep'}).price.low.removal);
});
test('configured two-storey access changes price, never physical quantities', () => {
  const p=structuredClone(profile); p.access={1:300,2:900};
  const a=calculate({pitch:'steep'},p),b=calculate({pitch:'steep',storeys:2},p);
  close(b.price.low.total-a.price.low.total,600); assert.deepEqual(a.measurements.low.totals,b.measurements.low.totals);
});
test('configured scaffold and demo VAT exclusion are visible', () => {
  const r=calculate({storeys:2});
  assert.equal(r.price.low.access,1100);assert.ok(!r.price.missing.some(n=>n.includes('Two-storey')));
  assert.match(r.price.taxNote,/excluding VAT/);
});
test('area mode supports business rates and complexity without duplicated component charges', () => {
  const p=structuredClone(profile);p.mode='area';p.areaRates.tile={materialPerM2:50,labourPerM2:20,includes:['covering','ridges','hips','valleys']};p.areaComplexityFactors.complex=1.2;
  const r=calculate({shape:'complex',pitch:'steep',project:'new_roof',existingMaterial:null},p);
  close(r.price.low.materials,Math.round(r.price.low.sections[0].quantities.roofAreaM2*50*1.2*100)/100);
  assert.equal(r.price.low.supplierOutput,null);
});
test('configured labour complexity affects labour only in component mode', () => {
  const p=structuredClone(profile);p.labourFactors.complex=1.3;
  const a=calculate({shape:'complex',pitch:'steep'}),b=calculate({shape:'complex',pitch:'steep'},p);
  close(a.price.low.materials,b.price.low.materials);assert.ok(b.price.low.labour>a.price.low.labour);
});
test('area-mode flat extension uses its own system and only one disposal charge', () => {
  const p=structuredClone(profile);p.mode='area';
  p.systems.epdm={label:'Test membrane',minPitch:0,maxPitch:5,areaProducts:[],components:{},exclusions:[]};
  p.areaRates.tile={materialPerM2:50,labourPerM2:20,includes:['tile system']};p.areaRates.epdm={materialPerM2:20,labourPerM2:10,includes:['membrane system']};
  const r=calculate({pitch:'steep',flatExtension:'small',flatCovering:'epdm'},p);
  const area=r.price.low.sections.reduce((s,x)=>s+x.quantities.roofAreaM2,0);
  close(r.price.low.removal,Math.round((r.price.low.sections[0].quantities.roofAreaM2*profile.removalByMaterial.tile.perM2+r.price.low.sections[1].quantities.roofAreaM2*profile.removalByMaterial.membrane.perM2)*100)/100);
});
test('nonfinite and negative business rates fail configuration validation', () => {
  for (const value of [-1,NaN,Infinity]) { const p=structuredClone(profile);p.access[2]=value;assert.throws(()=>validatePricingProfile(p)); }
});
test('measurement adapter retains section ownership and never re-applies roof pitch', () => {
  const r=measureRoof({...BASE,pitch:'steep',flatExtension:'small'});
  const {set,unmapped}=toSupplierMeasurements(r.high);
  assert.equal(set.entryPath,'actual');
  close(groupPitchedTotal(set,'roofAreas'),r.high.totals.roofAreaM2);
  assert.ok(set.groups.roofAreas.entries.length===2);
  assert.ok(set.groups.ridges.entries.every(e=>e.roofAreaId==='quick-main'));
  assert.ok(unmapped.some(e=>e.kind==='flat_edge'));
  assert.equal(set.appliedProducts.length,0);
});
test('handoff preserves estimated provenance, selects an explicit endpoint and expires', () => {
  const p=createHandoff(BASE,'high'); const r=resolveHandoff(p);
  close(groupPitchedTotal(r.set,'roofAreas'),measureRoof(BASE).high.totals.roofAreaM2);
  assert.match(r.set.groups.roofAreas.entries[0].label,/not surveyed/);
  assert.throws(()=>resolveHandoff({...p,createdAt:Date.now()-86400001}));
  assert.throws(()=>resolveHandoff({...p,endpoint:'middle'}));
});
test('API recalculates a valid request and returns a non-cacheable, noindex response', async () => {
  const response=await POST(new Request('http://localhost/api/quick-roof-estimate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(BASE)}));
  assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');
  assert.match(response.headers.get('x-robots-tag'),/noindex/);
  const body=await response.json();close(body.measurements.low.totals.footprintM2,60);
});
test('API rejects malformed JSON, forged prices, wrong media types and oversized bodies', async () => {
  for(const [body,type,status] of [['{','application/json',400],[JSON.stringify({...BASE,total:1}),'application/json',400],[JSON.stringify(BASE),'text/plain',415],[' '.repeat(8193),'application/json',413]]) {
    const r=await POST(new Request('http://localhost/api/quick-roof-estimate',{method:'POST',headers:{'content-type':type},body}));assert.equal(r.status,status);
  }
});

test('corrupt, old or unsupported saved selections reset safely', async () => {
  const { readQuickDraft, INITIAL_DRAFT } = await import('../lib/quick-estimate/draft.ts');
  for (const raw of [null, '{', 'null', '{}', JSON.stringify({step:99,answers:{}}), JSON.stringify({step:0,answers:{shape:'unknown'}}), JSON.stringify({step:0,answers:{size:'toString'}})]) assert.deepEqual(readQuickDraft(raw),INITIAL_DRAFT);
  const restored=readQuickDraft(JSON.stringify({step:3,answers:BASE,demo:true}));
  assert.equal(restored.step,3);assert.equal(restored.answers.shape,'gable');assert.equal(restored.demo,true);
});


test('mixed roof removal uses membrane rates for the flat section, not tile removal rates', () => {
  const p=structuredClone(profile);p.mode='area';
  p.systems.epdm={label:'Test membrane',minPitch:0,maxPitch:5,areaProducts:[],components:{},exclusions:[]};
  p.areaRates.tile={materialPerM2:50,labourPerM2:20,includes:['tile system']};
  p.areaRates.epdm={materialPerM2:20,labourPerM2:10,includes:['membrane system']};
  p.removalByMaterial.tile={perM2:30,disposalPerJob:1000};
  p.removalByMaterial.membrane={perM2:5,disposalPerJob:1000};
  const r=calculate({pitch:'steep',flatExtension:'small',flatCovering:'epdm'},p);
  const [main,extension]=r.price.low.sections;
  close(r.price.low.removal,Math.round((main.quantities.roofAreaM2*30+extension.quantities.roofAreaM2*5+1000)*100)/100);
  assert.ok(r.price.notes.some(note=>note.includes('existing membrane covering')));
});


test('material enums do not accept arrays or coerced objects', () => {
  for (const existingMaterial of [['tile'], {toString:()=> 'tile'}, 1, true]) assert.throws(()=>parseQuickInput({...BASE,existingMaterial}));
});
test('invalid catalogue prices and labour cannot produce a plausible-looking subtotal', () => {
  for (const patch of [{unitPrice:NaN},{unitPrice:-1},{defaultLabourRate:Infinity},{defaultWastePct:-5}]) {
    assert.throws(()=>calculate({},profile,catalog.map(p=>p.id==='marley-edgemere'?{...p,...patch}:p)));
  }
});

test('flat complexity changes price allowance but never roof measurements', () => {
  const simple = calculate({ ...FLAT, flatComplexity: 'simple' });
  const typical = calculate({ ...FLAT, flatComplexity: 'typical' });
  const complex = calculate({ ...FLAT, flatComplexity: 'complex' });
  assert.deepEqual(simple.measurements.low.totals, complex.measurements.low.totals);
  assert.deepEqual(simple.measurements.high.totals, complex.measurements.high.totals);
  for (const r of [simple, typical, complex]) assert.ok(r.price.low && r.price.high);
  assert.ok(simple.price.low.total < typical.price.low.total);
  assert.ok(typical.price.low.total < complex.price.low.total);
  assert.ok(simple.price.high.total < typical.price.high.total);
  assert.ok(typical.price.high.total < complex.price.high.total);
});

test('flat extension complexity does not change a pitched-only estimate', () => {
  const base = calculate();
  const extension = calculate({ flatExtension: 'small', flatCovering: 'epdm', flatComplexity: 'complex' });
  assert.ok(extension.price.low.total > base.price.low.total);
  assert.deepEqual(extension.measurements.low.sections[0].quantities, base.measurements.low.sections[0].quantities);
  assert.equal(parseQuickInput({ ...FLAT, flatComplexity: 'typical' }).flatComplexity, 'typical');
  assert.throws(() => parseQuickInput({ ...FLAT, flatComplexity: 'impossible' }));
});
