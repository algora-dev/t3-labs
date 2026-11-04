import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const root=process.cwd();
const html=readFileSync(`${root}/public/roofing-upgrade/landing.html`,'utf8');
const conf=readFileSync(`${root}/next.config.ts`,'utf8');
const request=readFileSync(`${root}/app/api/roofing-upgrade/request/route.ts`,'utf8');
const availability=readFileSync(`${root}/app/api/roofing-upgrade/availability/route.ts`,'utf8');
const config=JSON.parse(readFileSync(`${root}/config/roofing-upgrade-cohort.json`,'utf8'));

test('public campaign route is a standalone HTML rewrite',()=>{
  assert.match(conf,/source: "\/10-day-business-upgrade"/);
  assert.match(conf,/destination: "\/roofing-upgrade\/landing"/);
});
test('V12 bottom section is exactly two CTAs and one equal-size availability element',()=>{
  const footer=html.match(/<section class="final-cta"[\s\S]*?<\/section>/)?.[0];
  assert.ok(footer);
  assert.match(footer,/class="cta-trio"/);
  assert.match(footer,/Request My Spot/);
  assert.match(footer,/Book a 20-minute Call/);
  assert.match(footer,/cta-availability/);
  assert.doesNotMatch(footer,/Ready to improve how your business works/);
  assert.equal((footer.match(/<button\b|<a\b/g)||[]).length,2);
});
test('every visible counter is marked for one updater, never manually populated',()=>{
  const remaining=html.match(/data-spots-remaining/g)||[];
  const capacities=html.match(/data-spots-capacity/g)||[];
  assert.equal(remaining.length,5); // 3 markup elements + 2 JS occurrences
  assert.equal(capacities.length,5);
  assert.match(html,/querySelectorAll\('\[data-spots-remaining\]'\)/);
  assert.match(html,/querySelectorAll\('\[data-spots-capacity\]'\)/);
  assert.doesNotMatch(html,/data-spots-remaining>\d+</);
});
test('canonical manual availability is the only backend count source',()=>{
  assert.equal(config.capacity,10);
  assert.equal(config.spotsAvailable,10);
  assert.match(availability,/import cohort from "@\/config\/roofing-upgrade-cohort.json"/);
  assert.match(availability,/available: spotsAvailable/);
  assert.doesNotMatch(availability,/confirmed_count|SUPABASE_URL/);
  assert.match(request,/import cohortConfig/);
  assert.match(request,/cohortConfig.spotsAvailable <= 0/);
});
test('submission remains real server-side email and database',()=>{
  assert.match(request,/RESEND_API_KEY/);
  assert.match(request,/SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(request,/reply_to:email/);
  assert.match(html,/\/api\/roofing-upgrade\/request/);
  assert.doesNotMatch(html,/class="preview-controls"/);
});
