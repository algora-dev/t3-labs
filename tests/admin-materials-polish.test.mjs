import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const read = p => readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('all five pitched demo choices use recognisable photographic material images',()=>{
 const component=read('components/quick-estimate/QuickRoofEstimate.tsx');
 for (const [key,name] of [['tile','concrete-tile'],['slate','natural-slate'],['longrun','long-run-metal']]) {
  assert.match(component,new RegExp(`${key}: \\{ src: '/assets/apex-roof-materials/${name}\\.webp' \\}`));
  assert.ok(existsSync(new URL(`../public/assets/apex-roof-materials/${name}.webp`,import.meta.url)));
 }
 assert.match(component,/shingle: \{ src: 'https:\/\/thumb\.wikimedia\.org\/.*Asphalt_Shingles/);
 assert.match(component,/pressed_metal: \{ src: 'https:\/\/thumb\.wikimedia\.org\/.*Red_metal_tile/);
 assert.match(component,/MaterialThumbnail id=\{id\}/);
 assert.doesNotMatch(component,/onError=\{e => \{ e\.currentTarget\.style\.display = 'none'/);
 assert.match(read('docs/ROOF_MATERIAL_IMAGE_CREDITS.md'),/Asphalt shingles[\s\S]*Pressed metal tile/);
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
