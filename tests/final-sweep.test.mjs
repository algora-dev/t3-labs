import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import fs from 'node:fs';
register(new URL('./conversion-resolve.mjs',import.meta.url));
const { isAdminPath, CORE_TASKS } = await import('../lib/demo-helper/config.ts');
const { initialHelper, reduceHelper } = await import('../lib/demo-helper/state.ts');
const { taskGuidance } = await import('../lib/demo-helper/guidance.ts');
const { readQuickDraft } = await import('../lib/quick-estimate/draft.ts');
const { lockBodyScroll } = await import('../lib/demo-helper/scroll-lock.ts');
const { setHelperSurface, surfaceSnapshot } = await import('../lib/demo-helper/store.ts');
const source = f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
for(const path of ['/supplier-pricing-tool/apex-roofing/admin','/supplier-pricing-tool/apex-roofing/admin/','/supplier-pricing-tool/apex-roofing/admin?demo=helper','/supplier-pricing-tool/apex-roofing/admin/trade']) {
 test(`admin destination is recognised: ${path}`,()=>assert.ok(isAdminPath(path)));
}
for(const path of [null,'/demo/roofing-site','/supplier-pricing-tool/apex-roofing/administrator','/supplier-pricing-tool/other/admin']) {
 test(`non-admin destination is excluded: ${path}`,()=>assert.equal(isAdminPath(path),false));
}
test('admin guidance has no second open action at destination',()=>{
 const s=reduceHelper(initialHelper(),{type:'select',task:'admin'});
 assert.equal(taskGuidance(s,null,'website','/supplier-pricing-tool/apex-roofing/admin/').button,null);
 assert.ok(taskGuidance(s,null,'website','/demo/roofing-site').button);
});
test('returning from optional admin resumes the first unfinished core experience',()=>{
 let s=initialHelper();s={...s,current:'admin',view:'task',status:{...s.status,answers:'observed'},collapsed:true};
 const next=reduceHelper(s,{type:'return-from-admin'});
 assert.equal(next.current,'assistant-price');assert.equal(next.view,'task');assert.equal(next.collapsed,true);
 assert.deepEqual(next.status,s.status);assert.equal(next.started,false);
});
test('returning from admin after the tour shows finish without resetting progress',()=>{
 let s={...initialHelper(),current:'admin',view:'task',collapsed:true};
 for(const id of CORE_TASKS)s.status[id]='observed';
 const next=reduceHelper(s,{type:'return-from-admin'});
 assert.equal(next.view,'finish');assert.equal(next.collapsed,true);assert.deepEqual(next.status,s.status);
});
test('admin return on a different task does not discard a conversation milestone',()=>{
 const s=reduceHelper(initialHelper(),{type:'start'});
 assert.equal(reduceHelper(s,{type:'return-from-admin'}),s);
});
test('example marker persists with roof choices without touching price or enquiry data',()=>{
 const d=readQuickDraft(JSON.stringify({step:5,answers:{shape:'gable',size:'small'},demo:false,example:true}));
 assert.equal(d.example,true);assert.equal(d.answers.shape,'gable');assert.equal(d.step,5);
 assert.equal(readQuickDraft(JSON.stringify({...d,example:'true'})).example,undefined);
});
test('overlapping scroll locks restore the original style only after the last release',()=>{
 const prior=globalThis.document;globalThis.document={body:{style:{overflow:'auto'}}};
 const one=lockBodyScroll(),two=lockBodyScroll();assert.equal(document.body.style.overflow,'hidden');
 one();one();assert.equal(document.body.style.overflow,'hidden');two();assert.equal(document.body.style.overflow,'auto');
 globalThis.document=prior;
});
test('closing chat cannot clear an enquiry owned by the Quick Estimate',()=>{
 setHelperSurface('quick-enquiry','test-quick');setHelperSurface('assistant','test-chat');
 assert.equal(surfaceSnapshot(),'assistant+quick-enquiry');
 setHelperSurface('website','test-chat');assert.equal(surfaceSnapshot(),'quick-enquiry');
 setHelperSurface('website','test-quick');assert.equal(surfaceSnapshot(),'website');
});
test('both enquiry surfaces can release independently',()=>{
 setHelperSurface('quick-enquiry','test-quick');setHelperSurface('assistant-enquiry','test-chat');
 assert.equal(surfaceSnapshot(),'assistant-enquiry+quick-enquiry');
 setHelperSurface('website','test-quick');assert.equal(surfaceSnapshot(),'assistant-enquiry');
 setHelperSurface('website','test-chat');assert.equal(surfaceSnapshot(),'website');
});
test('enquiry component survives closing and reopening the same result, without storage',()=>{
 const quick=source('components/quick-estimate/QuickRoofEstimate.tsx');const enquiry=source('components/quick-estimate/QuickQuoteEnquiry.tsx');
 assert.match(quick,/key=\{JSON.stringify\(result.input\)\} open=\{enquiryOpen\}/);
 assert.match(enquiry,/hidden=\{!open\}/);assert.match(enquiry,/if \(!open\) return/);
 assert.doesNotMatch(enquiry,/sessionStorage\.setItem|localStorage\.setItem|fetch\(/);
});
test('small viewport rules preserve an instruction region rather than just the header',()=>{
 const css=source('components/demo-helper/helper.css');assert.match(css,/dh-short \.dh-top/);
 assert.match(css,/dh-panel\.dh-docked/);assert.match(css,/data-t3-guide-short/);
});
test('admin return navigation is outside the hideable helper in the shared shell',()=>{
 const s=source('components/demo-journey/ApexDemoShell.tsx');assert.match(s,/aria-label="Business dashboard navigation"/);assert.match(s,/Back to Apex Roofing/);assert.match(s,/return-from-admin/);
});
