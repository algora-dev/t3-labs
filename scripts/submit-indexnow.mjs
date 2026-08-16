#!/usr/bin/env node
/**
 * Submit T3 Labs URLs to IndexNow (Bing fast indexing).
 * Usage: node scripts/submit-indexnow.mjs
 *
 * Requires the key file at public/<KEY>.txt to be deployed.
 * Key: d42564ca45d2ca6a6c8d8fe891530b61
 * Keep this URL list in sync with app/sitemap.ts when new posts ship.
 */

const INDEXNOW_KEY = 'd42564ca45d2ca6a6c8d8fe891530b61';
const INDEXNOW_URL = 'https://api.indexnow.org/IndexNow';
const HOST = 'www.t3labs.tech';

const URLS = [
  'https://www.t3labs.tech/',
  'https://www.t3labs.tech/blog',
  'https://www.t3labs.tech/blog/ai-roofing-estimation-what-ai-can-do',
  'https://www.t3labs.tech/blog/branded-calculators-lead-generation-tools',
  'https://www.t3labs.tech/blog/building-quotecore-roofing-trade-software',
  'https://www.t3labs.tech/business-audit',
  'https://www.t3labs.tech/privacy',
  'https://www.t3labs.tech/cookies',
  'https://www.t3labs.tech/terms',
  'https://www.t3labs.tech/service-terms',
  'https://www.t3labs.tech/website-package-terms',
];

async function submit() {
  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: URLS,
  };

  console.log(`Submitting ${URLS.length} URLs to IndexNow for ${HOST}...`);

  try {
    const res = await fetch(INDEXNOW_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
    });

    console.log(`Response: ${res.status} ${res.statusText}`);
    if (res.status === 200) {
      console.log('URLs submitted successfully.');
    } else if (res.status === 202) {
      console.log('Submission accepted. URLs will be indexed soon.');
    } else if (res.status === 422) {
      console.log('Invalid submission. Check key file is accessible at the keyLocation URL.');
    } else {
      const text = await res.text().catch(() => '');
      console.log(`Unexpected response: ${text}`);
    }
  } catch (err) {
    console.error('Error submitting to IndexNow:', err.message);
  }
}

submit();
