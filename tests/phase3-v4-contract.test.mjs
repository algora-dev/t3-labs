import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const pages=JSON.parse(fs.readFileSync(path.join(root,'components/t3-phase3/problem-pages.json'),'utf8'));
const allowedTopics=new Set([
 'Get better enquiries and more customers','Build or improve a website',
 'Get found on Google and AI search','Quote and estimate faster',
 'Cut admin and connect systems','Answer customer questions automatically',
 'Something custom or not sure yet'
]);
test('exactly six distinct buyer-problem pages exist with native routes',()=>{
 assert.equal(Object.keys(pages).length,6);
 for(const slug of Object.keys(pages))assert.ok(fs.existsSync(path.join(root,`app/${slug}/page.tsx`)),slug);
});
test('each has an answer, decision, DIY action, actual example, limitation and grounded research link',()=>{
 for(const [slug,p] of Object.entries(pages)){
  assert.ok(p.h1.join(' ').length>18,slug);
  assert.ok(p.answer.split(/\s+/).length>=30,slug);
  assert.equal(p.diagnoses.length,3,slug);
  assert.equal(p.choices.length,3,slug);
  assert.equal(p.faqs.length,3,slug);
  assert.ok(p.diy.length>30 && p.limitations.length>30,slug);
  assert.ok(p.demoUrl.startsWith('https://'),slug);
  assert.ok(p.research.url.startsWith('https://'),slug);
  assert.ok(fs.existsSync(path.join(root,`public${p.image}`)),slug);
  assert.ok(allowedTopics.has(p.focus),`${slug} wrong Free Review topic: ${p.focus}`);
  assert.equal(p.video.embedUrl,undefined,'No video may be faked or embedded before recording');
 }
});
test('SEO metadata and T3Labs route target correspond',()=>{
 const seoLib=fs.readFileSync(path.join(root,'lib/roofing-service-seo.ts'),'utf8');
 assert.ok(seoLib.includes('https://www.t3labs.tech'),'canonical origin lib');
 for(const [slug,p] of Object.entries(pages)){
  const source=fs.readFileSync(path.join(root,`app/${slug}/page.tsx`),'utf8');
  assert.ok(source.includes(`roofingServiceMetadata("${slug}")`),slug);
  assert.ok(source.includes('ProblemLanding'));
  assert.ok(!p.answer.includes('—'),slug);
 }
});
