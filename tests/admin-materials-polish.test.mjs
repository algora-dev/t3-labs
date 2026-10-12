import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read = p => readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('photographic assets replace abstract swatches for three demo choices',()=>{
 const component=read('components/quick-estimate/QuickRoofEstimate.tsx');
 for (const [key,name] of [['tile','concrete-tile'],['slate','natural-slate'],['longrun','long-run-metal']]) {
  assert.match(component,new RegExp(`${key}: '/assets/apex-roof-materials/${name}\\.webp'`));
  assert.ok(existsSync(new URL(`../public/assets/apex-roof-materials/${name}.webp`,import.meta.url)));
 }
 assert.match(component,/MaterialThumbnail id=\{id\}/);
});
test('business dashboard button is dark and routes directly to admin',()=>{
 const helper=read('components/demo-helper/DemoHelper.tsx');
 const css=read('components/demo-helper/helper.css');
 const cfg=read('lib/demo-helper/config.ts');
 assert.match(helper,/onClick=\{openAdminDashboard\}>Explore the business dashboard/);
 assert.match(helper,/function openAdminDashboard\(\)/);
 assert.match(helper,/router\.push\(ADMIN_HOME\)/);
 assert.match(cfg,/ADMIN_HOME = `\$\{DETAIL_HOME\}\/admin\?demo=helper`/);
 assert.match(css,/\.dh-panel \.dh-secondary-strong \{ background:#050607/);
 assert.match(helper,/Return to Apex Roofing/);
});
