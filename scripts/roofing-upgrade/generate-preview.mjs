/**
 * Generate a standalone, self-contained visual preview from the exact production
 * HTML plus a simulated API. DO NOT use this file for actual customer requests.
 * Run from the repo root: node scripts/roofing-upgrade/generate-preview.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const config = JSON.parse(fs.readFileSync(path.join(projectRoot,'config/roofing-upgrade-cohort.json'),'utf8'));
const htmlFile = path.join(projectRoot,'public/roofing-upgrade/landing.html');
const output = path.join(projectRoot,'t3-roofing-business-upgrade-v13-preview.html');
let html = fs.readFileSync(htmlFile, 'utf8');
if (!html.includes('<script>')) throw new Error('Production HTML has no script.');
const data = JSON.stringify({
  ok:true,
  cohortId:config.cohortId,
  capacity:config.capacity,
  confirmed:config.capacity-config.spotsAvailable,
  available:config.spotsAvailable,
  pricingPhase:config.pricingPhase,
});
const mockScript = `<!-- Standalone preview only: API calls are simulated. No emails or bookings are sent. -->
<script>
(function(){
  const realFetch=window.fetch.bind(window);
  window.fetch=function(input,options){
    const url=String(input);
    if(url.includes('/api/roofing-upgrade/availability'))
      return Promise.resolve(new Response(${JSON.stringify(data)}, {status:200,headers:{'Content-Type':'application/json'}}));
    if(url.includes('/api/roofing-upgrade/request'))
      return Promise.resolve(new Response('{"ok":true}',{status:200,headers:{'Content-Type':'application/json'}}));
    return realFetch(input,options);
  };
})();
</script>
`;
html = html.replace('<script>', mockScript+'<script>');
html = html.replace('Thanks, Shaun has your request.','Preview complete, no request sent.');
fs.writeFileSync(output,html);
console.log(`Generated ${output} from the exact deployed HTML and config (${config.spotsAvailable}/${config.capacity})`);
