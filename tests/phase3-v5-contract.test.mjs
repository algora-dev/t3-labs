import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname,'..');
const data = JSON.parse(fs.readFileSync(path.join(root,'components/t3-phase3/problem-pages.json'),'utf8'));
const component = fs.readFileSync(path.join(root,'components/t3-phase3/ProblemLanding.tsx'),'utf8');
const css = fs.readFileSync(path.join(root,'components/t3-phase3/problem-landing.css'),'utf8');
const base = fs.readFileSync(path.join(root,'components/t3-phase3/phase3-base.css'),'utf8');
const allowed = new Set(['Get better enquiries and more customers','Build or improve a website','Get found on Google and AI search','Quote and estimate faster','Cut admin and connect systems','Answer customer questions automatically','Something custom or not sure yet']);
test('six differentiated routes each answer one roofing business problem',()=>{
 assert.equal(Object.keys(data).length,6);
 for(const [slug,p] of Object.entries(data)){
  assert.ok(fs.existsSync(path.join(root,'app',slug,'page.tsx')),slug);
  assert.ok(p.h1.join(' ').length>20 && p.answer.split(/\s+/).length>=30,slug);
  assert.ok(p.answer.split(/\s+/).length<=90,`${slug} answer is too long`);
  assert.equal(p.diagnoses.length,3,slug);assert.equal(p.choices.length,3,slug);
  assert.equal(p.faqs.length,3,slug);assert.ok(p.faqTitle,slug);
  assert.ok(allowed.has(p.focus),`${slug} form topic mismatch`);
  assert.ok(p.demoUrl.startsWith('https://'),slug);
  assert.ok(p.research.url.startsWith('https://'),slug);
  assert.ok(fs.existsSync(path.join(root,'public',p.image.slice(1))),slug);
  assert.ok(!p.video.embedUrl,`Don't manufacture a video for ${slug}`);
  assert.ok(!JSON.stringify(p).includes('—'),`${slug} includes an em dash`);
 }
});
test('video is beside the first real example, immediately following answer hero',()=>{
 const hero=component.indexOf('<section className="rwd-v5-hero">');
 const demo=component.indexOf('<section className="rwd-v5-demo-band"');
 const diagnosis=component.indexOf('<section className="rwd-v5-section" id="diagnose"');
 assert.ok(hero>0 && demo>hero && diagnosis>demo);
 assert.ok(component.includes('hasRealVideo ?'));
 assert.ok(component.includes('page.video.embedUrl'));
 assert.ok(component.includes('Read the video transcript'));
 assert.equal((component.match(/<Image /g)||[]).length,1,'One authenticated image, not duplicated proof imagery');
});
test('only T3Labs sanctioned accent colours in new styles',()=>{
 for(const banned of ['#4464bd','#203e7a','#172131','#101722','#0a111b','#496000']){
  assert.ok(!base.includes(banned) && !css.includes(banned),`unapproved colour ${banned}`);
 }
 assert.ok(base.includes('#d7ff00')&&base.includes('#5f7000')&&base.includes('#0a0b10'));
 assert.ok(base.includes('Inter'));
 assert.ok(css.includes('scroll-margin-top:112px'));
});
