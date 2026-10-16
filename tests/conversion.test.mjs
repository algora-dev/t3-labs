import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import fs from 'node:fs';
register(new URL('./conversion-resolve.mjs', import.meta.url));
const { initialConversion, readConversion, reduceConversion: reduce, savedConversion } = await import('../lib/demo-conversion/state.ts');
const { INTRO_COPY, TOUR_REMINDER_COPY, CLOSING_COPY, CONVERSION_OFFER, EXPLORE_DELAY_MS, EARNED_INTERACTIONS_REQUIRED } = await import('../lib/demo-conversion/config.ts');
const { metricPayload } = await import('../lib/demo-conversion/metrics.ts');
const { initialHelper, reduceHelper, readHelper } = await import('../lib/demo-helper/state.ts');
const { TASKS, CORE_TASKS, HELPER_PRICE_PROMPT, ADVANCED_TOOLS, ADVANCED_PRICING_NOTE } = await import('../lib/demo-helper/config.ts');
const { measureRoof } = await import('../lib/quick-estimate/engine.ts');
const { SIZE_BANDS, PITCH_BANDS } = await import('../lib/quick-estimate/config.ts');
const { PITCHED_SHAPES } = await import('../lib/quick-estimate/templates.ts');
const src = path => fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
const fresh = () => reduce(initialConversion(), {type:'initialise',resume:false,at:1700000000000});
const openVisit = () => reduce(fresh(),{type:'dismiss-intro'});
const explore = at => reduce(openVisit(),{type:'explore',at});
const closing = reason => reduce(openVisit(),{type:'show-closing',reason});

test('first arrival opens only the intro, then records that it was seen',()=>{
 const s=fresh(); assert.equal(s.ready,true);assert.equal(s.modal,'intro');assert.equal(s.introSeen,true);assert.equal(s.closerSeen,false);
});
test('duplicate initialisation is idempotent (React Strict Mode)',()=>{
 const s=fresh();assert.equal(reduce(s,{type:'initialise',resume:false}),s);
});
test('existing active visitors are not forced to restart the tour',()=>{
 const s=reduce(initialConversion(),{type:'initialise',resume:true});assert.equal(s.modal,null);assert.equal(s.introSeen,true);
});
test('intro dismissal does not spend the one closing invitation',()=>{const s=openVisit();assert.equal(s.modal,null);assert.equal(s.closerSeen,false);});
test('closing cannot stack on top of an intro',()=>{const s=fresh();assert.equal(reduce(s,{type:'show-closing',reason:'explored'}),s);});
for(const reason of ['explored','complete','tour-ended']) test(`closing once per visit: ${reason}`,()=>{
 const s=closing(reason);assert.equal(s.modal,'closing');assert.equal(s.reason,reason);assert.equal(s.closerSeen,true);
 const hidden=reduce(s,{type:'dismiss-closing'});assert.equal(hidden.modal,null);
 for(const later of ['explored','complete','tour-ended']) assert.equal(reduce(hidden,{type:'show-closing',reason:later}),hidden);
});
test('completion is queued, not forced over an open form or the intro',()=>{
 const s=reduce(fresh(),{type:'queue',reason:'complete'});assert.equal(s.modal,'intro');assert.equal(s.pending,'complete');
 const next=reduce(reduce(s,{type:'dismiss-intro'}),{type:'show-closing',reason:'explored'});assert.equal(next.reason,'complete');assert.equal(next.pending,null);
});
test('booking clicks suppress later invitations without claiming a booking',()=>{
 const s=reduce(openVisit(),{type:'contact'});assert.equal(s.closerSeen,true);assert.equal(s.modal,null);assert.equal(s.pending,null);
 assert.equal(reduce(s,{type:'show-closing',reason:'explored'}),s);assert.equal(metricPayload('booking_clicked').name,'booking_clicked');
});
test('persistence stores only non-sensitive presentation state, never open overlays or arbitrary data',()=>{
 const saved=savedConversion({...closing('explored'),email:'private@example.com',price:6000});
 const parsed=JSON.parse(saved);assert.equal(parsed.version,3);assert.equal(parsed.dashboardIntroSeen,false);assert.equal(parsed.introSeen,true);assert.equal(parsed.closerSeen,true);assert.deepEqual(parsed.interactions,[]);assert.equal(parsed.email,undefined);assert.equal(parsed.price,undefined);
 const at=Date.now()-1000;const dwell=savedConversion(explore(at));
 const restored=readConversion(dwell);assert.equal(restored.exploredAt,at);assert.equal(restored.ready,false);assert.equal(restored.modal,null);assert.equal(restored.pending,null);
});
test('reload after a shown closer never shows another closer',()=>{
 const s=reduce(readConversion(savedConversion(closing('explored'))),{type:'initialise',resume:true});
 assert.equal(reduce(s,{type:'show-closing',reason:'complete'}),s);
});
test('reload after introduction does not show another introduction',()=>{
 const s=reduce(readConversion(savedConversion(fresh())),{type:'initialise',resume:false});assert.equal(s.modal,null);
});
test('intro has an independent once-per-session sentinel so helper navigation cannot resurrect it',()=>{
 const store=src('lib/demo-conversion/store.ts');
 assert.match(store,/INTRO_SEEN_KEY = 'apex\.demo\.intro\.seen\.v1'/);
 assert.match(store,/sessionStorage\.getItem\(INTRO_SEEN_KEY\) === '1'/);
 assert.match(store,/sessionStorage\.setItem\(INTRO_SEEN_KEY, '1'\)/);
});
test('bad or tampered session data is ignored',()=>{
 for(const raw of [null,'null','bad','[]',' '.repeat(1501),'{"version":2}',JSON.stringify({version:1,introSeen:'yes',closerSeen:true})]) assert.deepEqual(readConversion(raw),initialConversion());
 assert.equal(readConversion(JSON.stringify({version:1,introSeen:true,closerSeen:false,modal:'closing'})).modal,null);
});
test('explore choice is stamped once and never after the closer',()=>{
 const at=Date.now()-1000;const s=explore(at);
 assert.equal(s.exploredAt,at);
 assert.equal(reduce(s,{type:'explore',at:at+9999}).exploredAt,at);
 assert.equal(reduce(closing('explored'),{type:'explore',at:at+9999}).exploredAt,null);
 assert.equal(reduce(s,{type:'explore',at:0}).exploredAt,at);
});
test('self-guided dwell shows one tour reminder before any sales close',()=>{
 let s=explore(Date.now()-EXPLORE_DELAY_MS-1);
 s=reduce(s,{type:'show-tour-reminder',at:Date.now()});assert.equal(s.modal,'tour-reminder');assert.equal(s.tourReminderSeen,true);assert.equal(s.closerSeen,false);
 const hidden=reduce(s,{type:'dismiss-tour-reminder'});assert.equal(hidden.modal,null);
 assert.equal(reduce(hidden,{type:'show-tour-reminder',at:Date.now()+1000}),hidden);
});
test('dashboard introduction is session-scoped and does not spend the sales invitation',()=>{
 let s=openVisit();s=reduce(s,{type:'show-dashboard-intro'});assert.equal(s.modal,'dashboard-intro');assert.equal(s.dashboardIntroSeen,true);assert.equal(s.closerSeen,false);
 s=reduce(s,{type:'dismiss-dashboard-intro'});assert.equal(s.modal,null);assert.equal(reduce(s,{type:'show-dashboard-intro'}),s);
 const restored=readConversion(savedConversion(s));assert.equal(restored.dashboardIntroSeen,true);assert.equal(restored.modal,null);
});
test('the dwell origin survives a reload but tampered values do not',()=>{
 const at=Date.now()-1000;
 assert.equal(readConversion(savedConversion(explore(at))).exploredAt,at);
 for(const raw of ['{"version":1,"introSeen":true,"closerSeen":false,"exploredAt":"x"}','{"version":1,"introSeen":true,"closerSeen":false,"exploredAt":-5}','{"version":1,"introSeen":true,"closerSeen":false,"exploredAt":null}']) assert.equal(readConversion(raw).exploredAt,null);
});
test('pointer-exit tracking is gone: the four-minute self-guided event is a tour reminder, not an exit popup',()=>{
 const s=src('components/demo-conversion/DemoConversion.tsx');
 assert.doesNotMatch(s,/mouseout|mousemove/);assert.doesNotMatch(s,/canOfferExit/);
 assert.match(s,/EXPLORE_DELAY_MS/);assert.match(s,/\{ type: 'explore', at: Date\.now\(\) \}/);
 assert.match(src('lib/demo-conversion/config.ts'),/EXPLORE_DELAY_MS = 4 \* 60 \* 1000/);
 assert.equal(EXPLORE_DELAY_MS,240000);
});
test('the dwell invitation still waits for typing, drag, enquiry and other overlays',()=>{
 const s=src('components/demo-conversion/DemoConversion.tsx');
 assert.match(s,/editing\(\)/);assert.match(s,/otherModal\(\)/);assert.match(s,/\.dh-panel\.is-dragging/);assert.match(s,/surface\.includes\('enquiry'\)/);
});
test('metric payloads explicitly discard personal details and arbitrary properties',()=>{
 const e=metricPayload('task_completed',{task:'quick-price',verification:'observed',email:'private@example.com',notes:'private',price:10,url:'https://private.example'});
 assert.deepEqual(e,{name:'task_completed',task:'quick-price',verification:'observed'});
 assert.deepEqual(metricPayload('task_started',{task:'not-a-task',reason:'private-message',verification:'fake'}),{name:'task_started'});
});
test('an early invitation never marks a helper task complete',()=>{const h=initialHelper();closing('explored');assert.ok(Object.values(h.status).every(x=>x==='untried'));});
test('three core tasks still require real tool milestones, not page visits',()=>{
 assert.equal(CORE_TASKS.length,3);assert.equal(TASKS.admin.optional,true);
 for(const id of CORE_TASKS){let h=reduceHelper(initialHelper(),{type:'select',task:id});
  assert.equal(reduceHelper(h,{type:'signal',signal:TASKS[id].requirements[0]}),h);
  h=reduceHelper(h,{type:'prepare'});
  if(TASKS[id].requirements.length>1) assert.equal(reduceHelper(h,{type:'signal',signal:TASKS[id].requirements.at(-1)}),h);
  for(const signal of TASKS[id].requirements) h=reduceHelper(h,{type:'signal',signal});
  assert.equal(h.status[id],'observed');assert.equal(h.view,'benefit');
 }
});
test('manual and skipped paths remain honest and do not reset the closer',()=>{
 const c=reduce(closing('explored'),{type:'dismiss-closing'});
 let h=reduceHelper(initialHelper(),{type:'start'});h=reduceHelper(h,{type:'manual'});assert.equal(h.status.answers,'self-reported');
 h=reduceHelper(h,{type:'next'});h=reduceHelper(h,{type:'skip'});assert.equal(h.status['assistant-price'],'skipped');
 h=reduceHelper(h,{type:'restart'});assert.equal(h.view,'task');assert.equal(c.closerSeen,true);
});
test('guide stays manually controlled on tasks, signals and next actions',()=>{
 let h=reduceHelper(initialHelper(),{type:'start'});h=reduceHelper(h,{type:'prepare'});
 for(const signal of TASKS.answers.requirements) h=reduceHelper(h,{type:'signal',signal});
 assert.equal(h.collapsed,false);h=reduceHelper(h,{type:'next'});assert.equal(h.collapsed,false);
 h=reduceHelper(h,{type:'collapse',value:true});assert.equal(h.collapsed,true);assert.equal(readHelper(JSON.stringify(h)).collapsed,true);
});
test('intro copy is brief, explicitly fictional, and makes no guaranteed speed claim',()=>{
 const text=Object.values(INTRO_COPY).join(' ');assert.ok(text.split(/\s+/).length<110);assert.match(text,/fictional/);assert.match(text,/9pm/);assert.match(text,/without waiting for your team/);assert.match(text,/ask your own questions/);assert.doesNotMatch(text,/guaranteed|under two|less than two|60 seconds/i);
});
test('closing uses hypothetical value and the agreed open-ended price question',()=>{
 assert.match(CLOSING_COPY.question,/If this/);assert.match(CLOSING_COPY.question,/5 routine enquiries a week/);assert.match(CLOSING_COPY.question,/over a year/);
 assert.equal(CONVERSION_OFFER.startingPrice,'$999');assert.equal(`${CONVERSION_OFFER.priceLabel} ${CONVERSION_OFFER.startingPrice}?`,'What if you could have solutions like this for $999?');assert.equal(CONVERSION_OFFER.priceNote,'');
});
test('the real 20-minute booking destination is reserved for the earned closing modal',()=>{
 assert.equal(CONVERSION_OFFER.bookingUrl,'https://calendly.com/insights-t3labs/20-minute-meeting');
 assert.match(src('components/demo-conversion/DemoConversion.tsx'),/CONVERSION_OFFER.bookingUrl/);
 assert.doesNotMatch(src('components/demo-helper/DemoHelper.tsx'),/CONVERSION_OFFER.bookingUrl/);
 assert.match(src('components/demo-helper/DemoHelper.tsx'),/Talk to T3 Labs/);
});
test('advanced tools and professional uses remain discoverable without forced exercises',()=>{
 assert.equal(ADVANCED_TOOLS.length,2);assert.match(ADVANCED_TOOLS.map(t=>t.title+' '+t.text).join(' '),/satellite image/);assert.match(ADVANCED_PRICING_NOTE,/exact prices, starting prices or ranges/);assert.match(ADVANCED_PRICING_NOTE,/search and AI/);assert.match(ADVANCED_PRICING_NOTE,/private trade pricing/);
});
test('prepared assistant scenario remains specific rather than fabricated or auto-sent',()=>{
 assert.match(HELPER_PRICE_PROMPT,/120 m² of actual sloping roof area/);assert.match(HELPER_PRICE_PROMPT,/12 metres/);
 assert.match(src('components/assistant/SmartAssistantLauncher.tsx'),/setInput\(prompt\)/);
});
test('sample shortcut reviews the input, protects drafts and uses the existing calculator',()=>{
 const s=src('components/quick-estimate/QuickRoofEstimate.tsx');assert.match(s,/FAST DEMO SHORTCUT/);assert.match(s,/Calculate this example/);assert.match(s,/window.confirm\('Use the sample roof/);assert.match(s,/writeDraft\(\{ step: 5, answers: \{ \.\.\.sample, covering: sampleCovering \}/);assert.match(s,/createQuickResult\(parseQuickInput\(a\), catalog, profile\)/);
});
test('core pricing tasks complete on the useful price while enquiry previews remain optional',()=>{
 assert.deepEqual(TASKS['assistant-price'].requirements,['assistant-estimate']);
 assert.deepEqual(TASKS['quick-price'].requirements,['quick-result']);
 assert.match(src('components/quick-estimate/QuickQuoteEnquiry.tsx'),/Use example contact details/);
 assert.match(src('components/assistant/SmartAssistantLauncher.tsx'),/OPEN_INQUIRY/);
});
test('modals have native focus containment, Escape support and explicit dismissal',()=>{
 const s=src('components/demo-conversion/DemoConversion.tsx');assert.match(s,/node.showModal\(\)/);assert.match(s,/onCancel=/);assert.match(s,/aria-labelledby="t3-conversion-title"/);assert.match(s,/previous\?\.isConnected/);assert.match(s,/lockBodyScroll/);assert.match(s,/releaseScroll\(\)/);
});
test('no trapping of tab close, browser back, or idle mobile visitors',()=>{
 const s=src('components/demo-conversion/DemoConversion.tsx');assert.doesNotMatch(s,/addEventListener\(['"](?:beforeunload|popstate|unload)['"]/);assert.doesNotMatch(s,/history\.(?:pushState|replaceState)/);assert.doesNotMatch(s,/setInterval/);
});
test('T3 modal uses approved glass plus reduced-motion and solid fallbacks',()=>{
 const css=src('components/demo-conversion/conversion.css');assert.match(css,/rgba\(10,11,16,\.65\)/);assert.match(css,/blur\(20px\)/);assert.match(css,/#d7ff00/);assert.match(css,/prefers-reduced-motion/);assert.match(css,/prefers-reduced-transparency/);assert.match(css,/forced-colors/);assert.doesNotMatch(css,/\.t3-cv-dialog\s*\{[^}]*\bopacity\s*:/);
});
test('new conversion layer contains no contact-form transmission or third-party tracker',()=>{
 const all=['lib/demo-conversion/store.ts','lib/demo-conversion/metrics.ts','components/demo-conversion/DemoConversion.tsx'].map(src).join('\n');assert.doesNotMatch(all,/\bfetch\s*\(|sendBeacon|gtag\s*\(|document.cookie|localStorage/);
});
test('new code respects UTF-8 branding and the no-em-dash handoff rule',()=>{
 for(const file of ['lib/demo-conversion/config.ts','lib/demo-conversion/state.ts','lib/demo-conversion/store.ts','lib/demo-conversion/metrics.ts','components/demo-conversion/DemoConversion.tsx','components/demo-conversion/conversion.css']) assert.doesNotMatch(src(file),/\u2014|\uFFFD/);
});
test('the tour reminder is concise and the earned close requires two distinct meaningful examples',()=>{
 const text=Object.values(TOUR_REMINDER_COPY).join(' ');assert.match(text,/3 minutes/);assert.match(text,/guided tour/i);assert.equal(EARNED_INTERACTIONS_REQUIRED,2);
 let s=openVisit();s=reduce(s,{type:'interact',key:'assistant-answer',at:100});assert.deepEqual(s.interactions,['assistant-answer']);
 s=reduce(s,{type:'interact',key:'assistant-answer',at:200});assert.deepEqual(s.interactions,['assistant-answer']);assert.equal(s.lastInteractionAt,200);
 s=reduce(s,{type:'interact',key:'quick-price',at:300});assert.equal(s.interactions.length,2);
});
test('starting the guide suppresses the one-time self-guided reminder',()=>{
 let s=explore(100);s=reduce(s,{type:'tour-engaged'});assert.equal(s.tourEngaged,true);assert.equal(s.tourReminderSeen,true);
 assert.equal(reduce(s,{type:'show-tour-reminder',at:1000}),s);
});
test('all 135 existing geometry combinations retain agreed footprint and pitch behaviour',()=>{
 let count=0;for(const shape of PITCHED_SHAPES)for(const size of Object.keys(SIZE_BANDS))for(const pitch of Object.keys(PITCH_BANDS)){
  const a={shape:shape.id,size,pitch,storeys:1,flatExtension:null};const m=measureRoof(a);
  assert.ok(Math.abs(m.low.totals.footprintM2-SIZE_BANDS[size].min)<1e-6);
  assert.ok(Math.abs(m.high.totals.roofAreaM2-SIZE_BANDS[size].max/Math.cos(PITCH_BANDS[pitch].max*Math.PI/180))<1e-6);
  assert.deepEqual(m.low.totals,measureRoof({...a,storeys:2}).low.totals);count++;
 }assert.equal(count,135);
});
