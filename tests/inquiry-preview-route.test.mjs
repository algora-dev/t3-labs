import test from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
register(new URL('./inquiry-preview-loader.mjs', import.meta.url));
// Pin the demo business regardless of the host developer environment.
process.env.T3_ASSISTANT_BUSINESS_SLUG = 'apex-roofing';
const { POST } = await import('../app/api/inquiry/route.ts');
const { fixtureSession } = await import('./inquiry-preview-fixtures.mjs');
const request = body => new Request('https://demo.invalid/api/inquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

test('demo endpoint never emails or persists contact facts, even with an email API key configured', async () => {
  const before = structuredClone(fixtureSession);
  const oldKey = process.env.RESEND_API_KEY;
  const oldFetch = globalThis.fetch;
  let sends = 0;
  process.env.RESEND_API_KEY = 'unit-test-placeholder-not-a-key';
  globalThis.fetch = async () => { sends += 1; throw new Error('No network permitted by this test'); };
  try {
    const response = await POST(request({ name: 'Demo Person', email: 'demo@example.com', question: 'Please review my roof.', attachments: [{ name: 'roof.pdf', contentType: 'application/pdf', sizeBytes: 1024 }] }));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.mode, 'preview'); assert.equal(body.emailed, false); assert.equal(body.ok, true);
    assert.equal(body.payload.contact.email, 'demo@example.com');
    assert.equal(body.payload.estimate.id, 'test-estimate');
    assert.deepEqual(body.payload.attachments, [{ name: 'roof.pdf', contentType: 'application/pdf', sizeBytes: 1024 }]);
    assert.deepEqual(fixtureSession, before); assert.equal(sends, 0);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldKey === undefined) delete process.env.RESEND_API_KEY; else process.env.RESEND_API_KEY = oldKey;
  }
});
test('enquiry endpoint rejects malformed and invalid contact submissions without a session write', async () => {
  for (const body of [null, [], {}, { name: 'Demo', email: 'invalid' }]) {
    const response = await POST(request(body)); assert.equal(response.status, 400); assert.ok((await response.json()).error);
  }
  assert.equal((await POST(new Request('https://demo.invalid/api/inquiry', { method: 'POST', body: '{' }))).status, 400);
});
