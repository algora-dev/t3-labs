import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import fs from 'node:fs';
register(new URL('./ts-resolve.mjs', import.meta.url));
const { CORE_TASKS, HELPER_TASKS, TASKS, ADVANCED_TOOLS, HELPER_PRICE_PROMPT, nextCoreTask } = await import('../lib/demo-helper/config.ts');
const { initialHelper, readHelper, reduceHelper, clampPosition, readPosition } = await import('../lib/demo-helper/state.ts');
const { signalsForAssistantTurn, isApexPage } = await import('../lib/demo-helper/assistant-events.ts');
const { validateDemoContact, describeDemoFile } = await import('../lib/demo-helper/enquiry-preview.ts');
const { createEstimate } = await import('../lib/pricing/estimate-engine.ts');
const attempt = id => reduceHelper(reduceHelper(initialHelper(), {type:'select',task:id}),{type:'prepare'});
const complete = id => TASKS[id].requirements.reduce((s,signal)=>reduceHelper(s,{type:'signal',signal}),attempt(id));
const src = p => fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('new helper has exactly three core tasks and optional admin, not mandatory advanced exercises',()=>{
 assert.equal(CORE_TASKS.length,3);assert.equal(HELPER_TASKS.length,4);assert.equal(TASKS.admin.optional,true);
 assert.deepEqual(CORE_TASKS,['answers','assistant-price','quick-price']);assert.equal(ADVANCED_TOOLS.length,2);
 assert.equal(nextCoreTask('quick-price'),null);assert.equal(nextCoreTask('admin'),null);
});
test('welcome is visible without claiming any task or estimate was completed',()=>{
 const s=initialHelper();assert.equal(s.view,'welcome');assert.equal(s.started,false);assert.equal(s.collapsed,false);
 assert.ok(Object.values(s.status).every(v=>v==='untried'));
});
test('invalid or stale saved helper progress is rejected',()=>{
 for(const raw of [null,'bad','null','[]',' '.repeat(3600),JSON.stringify({...initialHelper(),version:1}),JSON.stringify({...initialHelper(),current:'__proto__'}),JSON.stringify({...initialHelper(),runId:NaN}),JSON.stringify({...initialHelper(),milestones:['fake']})]) assert.deepEqual(readHelper(raw),initialHelper());
});
test('persisted state retains UI progress only and strips contact or file data',()=>{
 const s=complete('answers');assert.deepEqual(readHelper(JSON.stringify({...s,email:'private@example.com',files:['secret.pdf']})),s);
});
test('page visits, unopened tasks and unrelated events cannot complete a task',()=>{
 const s=reduceHelper(initialHelper(),{type:'select',task:'quick-price'});
 assert.equal(reduceHelper(s,{type:'signal',signal:'quick-result'}),s);
 const a=attempt('quick-price');assert.equal(reduceHelper(a,{type:'signal',signal:'assistant-estimate'}),a);
});
test('knowledge flow requires both a structured answer and the visitor following its link',()=>{
 let s=attempt('answers');assert.equal(reduceHelper(s,{type:'signal',signal:'knowledge-link'}),s);
 s=reduceHelper(s,{type:'signal',signal:'knowledge-answer'});assert.equal(s.view,'task');
 s=reduceHelper(s,{type:'signal',signal:'knowledge-link'});assert.equal(s.view,'benefit');assert.equal(s.status.answers,'observed');
});
test('both pricing tasks require price, enquiry opening, and actual preview completion in order',()=>{
 for(const id of ['assistant-price','quick-price']){
   let s=attempt(id);const signals=TASKS[id].requirements;
   assert.equal(reduceHelper(s,{type:'signal',signal:signals[2]}),s);
   for(const [i,signal] of signals.entries()){s=reduceHelper(s,{type:'signal',signal});assert.equal(s.view,i===2?'benefit':'task');}
   assert.equal(s.status[id],'observed');
 }
});
test('stale asynchronous answers from a previous run or other task are ignored',()=>{
 const s=attempt('assistant-price');
 assert.equal(reduceHelper(s,{type:'signal',signal:'assistant-estimate',runId:s.runId-1}),s);
 assert.equal(reduceHelper(s,{type:'signal',signal:'assistant-estimate',task:'answers'}),s);
 const restarted=reduceHelper(s,{type:'restart'});assert.equal(reduceHelper(restarted,{type:'error',runId:s.runId}),restarted);
});
test('automatic completion preserves current page/task and collapsed state for reading the result',()=>{
 let s=reduceHelper(attempt('quick-price'),{type:'collapse',value:true});
 for(const signal of TASKS['quick-price'].requirements)s=reduceHelper(s,{type:'signal',signal});
 assert.equal(s.current,'quick-price');assert.equal(s.collapsed,true);assert.equal(s.view,'benefit');
 assert.equal(reduceHelper(s,{type:'next'}).view,'finish');
});
test('manual continuation, skipping and observed completion remain distinguishable',()=>{
 const manual=reduceHelper(attempt('answers'),{type:'manual'});assert.equal(manual.status.answers,'self-reported');
 const skipped=reduceHelper(attempt('answers'),{type:'skip'});assert.equal(skipped.status.answers,'skipped');assert.equal(skipped.current,'assistant-price');
 assert.equal(reduceHelper(complete('answers'),{type:'skip'}).status.answers,'observed');
});
test('failure stays incomplete and a valid retry can succeed',()=>{
 let s=reduceHelper(attempt('answers'),{type:'error'});assert.equal(s.error,true);assert.equal(s.status.answers,'untried');
 for(const signal of TASKS.answers.requirements)s=reduceHelper(s,{type:'signal',signal});
 assert.equal(s.error,false);assert.equal(s.status.answers,'observed');
});
test('admin is completed only by the matching panel event after explicitly starting it',()=>{
 assert.equal(complete('admin').status.admin,'observed');assert.equal(reduceHelper(complete('admin'),{type:'next'}).view,'finish');
});
test('position storage is bounded and a resized desktop cannot strand the drag handle',()=>{
 assert.equal(readPosition('bad'),null);assert.equal(readPosition('{"x":null,"y":10}'),null);
 assert.deepEqual(readPosition('{"x":90,"y":20}'),{x:90,y:20});
 assert.deepEqual(clampPosition({x:3000,y:-8},{width:800,height:600},{width:364,height:400}),{x:424,y:12});
 assert.deepEqual(clampPosition({x:NaN,y:Infinity},{width:320,height:400},{width:364,height:500}),{x:12,y:12});
});
test('price prose or an empty/incomplete card never becomes a measured assistant success',()=>{
 assert.deepEqual(signalsForAssistantTurn({message:'Your roof will cost £10,000.'}),[]);
 assert.deepEqual(signalsForAssistantTurn({message:'Estimate',cards:[{type:'estimate',estimate:{total:100,lineItems:[]}}]}),[]);
 assert.deepEqual(signalsForAssistantTurn({message:'Estimate',cards:[{type:'estimate_result',result:{mode:'single',estimate:{total:NaN}}}]}),[]);
});
test('assistant knowledge completion requires a usable internal page action',()=>{
 assert.deepEqual(signalsForAssistantTurn({message:'Yes.',actions:[{type:'NAVIGATE_INTERNAL',url:'/demo/roofing-site/services/insurance-work'}]}),['knowledge-answer']);
 assert.deepEqual(signalsForAssistantTurn({message:'Yes.',actions:[{type:'NAVIGATE_INTERNAL',url:'https://external.example'}]}),[]);
 assert.equal(isApexPage('/demo/roofing-site-evil'),false);assert.equal(isApexPage('javascript:alert(1)'),false);
});
test('prepared assistant scenario uses the existing catalogue and user-specified components exactly once',()=>{
 assert.match(HELPER_PRICE_PROMPT,/120 m² of actual/);assert.match(HELPER_PRICE_PROMPT,/12 metres/);
 const e=createEstimate({projectType:'reroof',roofArea:120,areaType:'actual_roof_area',roofShape:'gable',pitchDegrees:25,material:'reroof_concrete_tile',componentScope:'specified_components',components:[{catalogItemId:'ridge_hip_system',quantity:12}]});
 assert.ok(e.lineItems.some(l=>l.catalogItemId==='reroof_strip_allowance'));assert.ok(e.lineItems.some(l=>l.catalogItemId==='reroof_disposal_allowance'));assert.ok(e.total>0);assert.equal(e.lineItems.filter(l=>l.catalogItemId==='ridge_hip_system').length,1);
 assert.ok(e.lineItems.every(l=>!['valley_trough','batten','underlay'].includes(l.catalogItemId)));
 assert.deepEqual(signalsForAssistantTurn({message:'Estimate',cards:[{type:'estimate',estimate:e}]}),['assistant-estimate']);
});
test('enquiry contacts allow phone or email but validate the provided contact',()=>{
 const c={name:'Demo Visitor',email:'demo@example.com',phone:''};assert.equal(validateDemoContact(c),null);
 assert.equal(validateDemoContact({...c,email:'',phone:'07700 900123'}),null);
 assert.ok(validateDemoContact({...c,email:'bad'}));assert.ok(validateDemoContact({...c,name:''}));
 assert.ok(validateDemoContact({...c,contactPreference:'call'}));
});
test('attachments use metadata only, with explicit file type and size limits',()=>{
 const f=describeDemoFile({name:'roof.pdf',type:'application/pdf',size:1200,contents:'not copied'});
 assert.deepEqual(f,{name:'roof.pdf',contentType:'application/pdf',sizeBytes:1200});
 for(const f of [{name:'run.exe',type:'application/octet-stream',size:100},{name:'large.pdf',type:'application/pdf',size:3000000},{name:'empty.pdf',type:'application/pdf',size:0}])assert.equal(describeDemoFile(f),null);
});
test('active site shell has a floating helper, not the legacy shrinking walkthrough wrapper',()=>{
 const s=src('components/demo-journey/ApexDemoShell.tsx');assert.match(s,/<DemoHelper/);assert.doesNotMatch(s,/GuidePanel|ag-frame|ag-body/);
 assert.match(src('app/demo/roofing-site/walkthrough/page.tsx'),/redirect\('\/demo\/roofing-site'\)/);
});
test('guided enquiry UI has no send request; server also guards against demo email delivery',()=>{
 const s=src('components/assistant/EnquiryPanel.tsx');assert.doesNotMatch(s,/fetch\(['"]\/api\/inquiry/);
 const api=src('app/api/inquiry/route.ts');assert.ok(api.indexOf('if (getBusiness().business.demo)')<api.indexOf('const emailed = await emailInquiry'));
 assert.match(src('components/quick-estimate/QuickQuoteEnquiry.tsx'),/quick-enquiry-ready/);
});
test('plan route uses the same integrated estimator without deleting an existing draft',()=>{
 assert.match(src('app/demo/roofing-site/takeoff/page.tsx'),/entry=plan/);
 assert.match(src('app/supplier-pricing-tool/PortalFlow.tsx'),/entry.*plan/);
 assert.match(src('lib/demo-helper/config.ts'),/known scale/);
});
test('admin has explicit local-only disclosure and trade milestone hook',()=>{
 const s=src('app/supplier-pricing-tool/admin/AdminPanel.tsx');assert.match(s,/admin-trade-view/);assert.match(s,/Changes stay in this browser/);
 assert.match(s,/separately configured demo catalogues/);assert.match(s,/including sample activity/);
});


test('optional Apex advanced enquiry returns locally before uploading files or posting the output', () => {
 const code=src('app/supplier-pricing-tool/SupplierEnquiryModal.tsx');
 assert.match(code,/const demoPreview = supplierSlug === 'apex-roofing'/);
 assert.ok(code.indexOf('if (demoPreview) { setSent(true);') < code.indexOf('await fetch(urls.enquiryApi'));
 assert.match(code,/no files or contact details were uploaded or saved/);
});
