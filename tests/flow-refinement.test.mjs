import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { register } from 'node:module';
register(new URL('./conversion-resolve.mjs', import.meta.url));
const { initialHelper, reduceHelper } = await import('../lib/demo-helper/state.ts');
const { taskGuidance } = await import('../lib/demo-helper/guidance.ts');
const { nextAssistantActivity, activityForRun } = await import('../lib/demo-helper/assistant-activity.ts');
const { TASKS, QUICK_HOME } = await import('../lib/demo-helper/config.ts');
const source = f => fs.readFileSync(new URL('../'+f,import.meta.url),'utf8');
const select = id => reduceHelper(initialHelper(), {type:'select',task:id});
const prepare = id => reduceHelper(select(id),{type:'prepare'});
const activity = (s, phase) => ({phase,runId:s.runId,task:s.current});
const signal = (s, name) => reduceHelper(s,{type:'signal',signal:name});

for(const id of ['answers','assistant-price']) {
 test(`${id}: one prepare action opens and fills, never sends`,()=>{
  const s=select(id),g=taskGuidance(s,null,'website','/demo/roofing-site');
  assert.equal(g.button,'Open assistant + add example');assert.equal(g.command,id==='answers'?'question':'price-prompt');
 });
 test(`${id}: prepared prompt points to Send, without a second prepare action`,()=>{
  const s=prepare(id),g=taskGuidance(s,activity(s,'prepared'),'assistant',null);
  assert.equal(g.button,null);assert.match(g.text,/Edit it or press Send/);
  const hidden=taskGuidance(s,activity(s,'prepared'),'website',null);
  assert.equal(hidden.command,'assistant-open');assert.equal(hidden.button,'Open assistant');
 });
 test(`${id}: own question remains valid, no exact-string checks`,()=>{
  const s=prepare(id),g=taskGuidance(s,activity(s,'editing'),'assistant',null);
  assert.match(g.text,/Your question, your choice/);assert.equal(g.button,null);
 });
 test(`${id}: busy request has feedback, not another example button`,()=>{
  const s=prepare(id),g=taskGuidance(s,activity(s,'sending'),'assistant',null);
  assert.equal(g.waiting,true);assert.equal(g.button,null);assert.equal(g.text,'Getting your answer…');
 });
 test(`${id}: non-milestone answer offers follow-up/manual progress, not fake success`,()=>{
  const s=prepare(id),g=taskGuidance(s,activity(s,'answered'),'assistant',null);
  assert.equal(g.freeResponse,true);assert.equal(s.view,'task');assert.equal(s.status[id],'untried');
 });
}
test('knowledge response requires an actual page action before the benefit',()=>{
 let s=prepare('answers');s=signal(s,'knowledge-answer');
 assert.equal(taskGuidance(s,activity(s,'answered'),'assistant',null).text,'Open the page the assistant recommends.');
 assert.equal(s.view,'task');s=signal(s,'knowledge-link');assert.equal(s.view,'benefit');
});
test('price guidance handles estimate and enquiry phases explicitly',()=>{
 let s=prepare('assistant-price');s=signal(s,'assistant-estimate');
 assert.match(taskGuidance(s,activity(s,'answered'),'assistant',null).text,/Review the price/);
 s=signal(s,'assistant-enquiry-open');assert.equal(taskGuidance(s,null,'assistant-enquiry',null).button,null);
 s=signal(s,'assistant-enquiry-ready');assert.equal(s.view,'benefit');
});
test('failed request keeps live failure honest and retries clear the error',()=>{
 let s=prepare('answers');s=reduceHelper(s,{type:'error',runId:s.runId});
 assert.match(taskGuidance(s,activity(s,'error'),'assistant',null).text,/couldn’t finish/);
 s=reduceHelper(s,{type:'prepare'});assert.equal(s.error,false);
 assert.equal(taskGuidance(s,activity(s,'sending'),'assistant',null).waiting,true);
});
test('activity rejects prior task and prior run feedback',()=>{
 const s=prepare('answers'),old=activity(s,'prepared');
 assert.equal(nextAssistantActivity(old,{...old,runId:s.runId+1,phase:'answered'},s),old);
 assert.equal(nextAssistantActivity(old,{...old,task:'assistant-price'},s),old);
 assert.equal(activityForRun(old,reduceHelper(s,{type:'select',task:'assistant-price'})),null);
});
test('late response cannot replace feedback for a later network request',()=>{
 const s=prepare('answers'),newer={...activity(s,'sending'),requestId:'new'};
 assert.equal(nextAssistantActivity(newer,{...activity(s,'answered'),requestId:'old'},s),newer);
 assert.equal(nextAssistantActivity(newer,{...activity(s,'answered'),requestId:'new'},s).phase,'answered');
});
test('activity whitelist discards request contents',()=>{
 const s=prepare('answers');const next=nextAssistantActivity(null,{...activity(s,'prepared'),prompt:'private',email:'private',requestId:'abc'},s);
 assert.deepEqual(next,{...activity(s,'prepared'),requestId:'abc'});
 assert.equal(nextAssistantActivity(null,activity(prepare('quick-price'),'prepared'),prepare('quick-price')),null);
});
test('quick task has one entry, then directs attention to the page',()=>{
 const s=select('quick-price');assert.equal(taskGuidance(s,null,'website',null).command,'quick-example');
 const started=reduceHelper(s,{type:'prepare'});assert.equal(taskGuidance(started,null,'website',QUICK_HOME).button,null);
 assert.match(taskGuidance(signal(started,'quick-result'),null,'website',QUICK_HOME).text,/Request a quote/);
});
test('closing waits for final benefit acknowledgement, not a reading timer',()=>{
 const s=source('components/demo-conversion/DemoConversion.tsx');
 assert.match(s,/if \(h.view === 'finish'\) updateConversion/);
 assert.doesNotMatch(s,/finalExperience|setTimeout|1200/);
 assert.match(s,/surface.includes\('enquiry'\)/);
});
test('enquiry preview does not hide guide or compete with final benefit',()=>{
 const s=source('components/demo-helper/DemoHelper.tsx');
 assert.match(s,/readingEnquiry = s.view === 'benefit' && surface.includes\('enquiry'\)/);
 assert.match(s,/s.view === 'benefit' && !readingEnquiry/);
 assert.match(s,/quickTransition.current !== s.runId/);
});
test('example enquiry uses the same validation and current result, with no transport',()=>{
 const s=source('components/quick-estimate/QuickQuoteEnquiry.tsx');
 assert.match(s,/preparePreview\(exampleDetails\(\)\)/);assert.match(s,/validateDemoContact\(next\)/);
 assert.match(s,/makeQuickEnquirySummary\(result\)/);assert.match(s,/Replace these contact details/);
 assert.doesNotMatch(s,/fetch\(|sendBeacon|localStorage|sessionStorage/);
});
test('tool sample and full questionnaire are mutually exclusive',()=>{
 const s=source('components/quick-estimate/QuickRoofEstimate.tsx');
 assert.match(s,/showExample && current !== 'Result' \? <section/);
 assert.match(s,/covering: sampleCovering/);assert.match(s,/Try the full tool instead/);
 assert.match(s,/window.confirm\('Use the sample roof/);
});
test('mobile layout reserves space, retains brand, Hide and accessibility fallbacks',()=>{
 const css=source('components/demo-helper/helper.css');
 assert.match(css,/--t3-guide-dock-height/);assert.match(css,/--t3-guide-page-space/);
 assert.match(css,/--t3-visual-height/);assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/rgba\(10,11,16,\.65\)/);
});
test('assistant accepts independent questions and does not require the prepared prompt',()=>{
 const s=source('components/assistant/SmartAssistantLauncher.tsx');
 assert.match(s,/runTurn\(trimmed, \{ message: trimmed/);
 assert.match(s,/isAssistantTask\(h.current\)\) updateHelper\(\{ type: 'prepare' \}\)/);
 assert.match(s,/phase: 'sending'/);assert.match(s,/phase: 'answered'/);
 assert.match(s,/phase: 'error'/);assert.match(s,/Replace the unsent message/);
});
