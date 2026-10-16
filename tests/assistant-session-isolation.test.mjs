import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { register } from 'node:module';

register(new URL('./ts-resolve.mjs', import.meta.url));
const { normaliseAssistantClientSessionKey, assistantScopedSessionId, ASSISTANT_SESSION_HEADER } = await import('../lib/assistant/session-scope.ts');
const src = p => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');

test('assistant tab keys are opaque, validated and map to isolated server session ids', () => {
  const a = 'tab_11111111-1111-4111-8111-111111111111';
  const b = 'tab_22222222-2222-4222-8222-222222222222';
  assert.equal(ASSISTANT_SESSION_HEADER, 'x-apex-assistant-session');
  assert.equal(normaliseAssistantClientSessionKey(a), a);
  assert.equal(normaliseAssistantClientSessionKey(`  ${a}  `), a);
  assert.equal(normaliseAssistantClientSessionKey('bad'), null);
  assert.notEqual(assistantScopedSessionId(a), assistantScopedSessionId(b));
  assert.equal(assistantScopedSessionId('bad'), null);
});

test('client assistant identity is sessionStorage scoped and attached to every stateful assistant request', () => {
  const client = src('lib/assistant/client-session.ts');
  const launcher = src('components/assistant/SmartAssistantLauncher.tsx');
  const enquiry = src('components/assistant/EnquiryPanel.tsx');
  assert.match(client, /sessionStorage\.getItem\(ASSISTANT_CLIENT_SESSION_STORAGE_KEY\)/);
  assert.match(client, /sessionStorage\.setItem\(ASSISTANT_CLIENT_SESSION_STORAGE_KEY/);
  assert.doesNotMatch(client, /localStorage/);
  assert.match(client, /headers\.set\(ASSISTANT_SESSION_HEADER, key\)/);
  for (const endpoint of ["'/api/chat'", "'/api/outputs'", "'/api/session'"]) {
    assert.match(launcher, new RegExp(`assistantSessionFetch\\(${endpoint.replaceAll('/', '\\/')}`));
  }
  assert.match(launcher, /assistantSessionFetch\(`\/api\/outputs\?id=/);
  assert.match(enquiry, /assistantSessionFetch\('\/api\/session'/);
});

test('all server routes that touch assistant state resolve the per-tab scope before reading session data', () => {
  for (const file of ['app/api/chat/route.ts', 'app/api/session/route.ts', 'app/api/outputs/route.ts', 'app/api/inquiry/route.ts']) {
    const source = src(file);
    assert.match(source, /assistantClientSessionKeyFromRequest\(req\)/, file);
  }
  const session = src('lib/assistant/session.ts');
  assert.match(session, /valid per-tab client key takes/);
  assert.match(session, /assistantScopedSessionId\(scopedKey\)/);
  assert.match(session, /export async function resetSession\(clientSessionKey\?: string \| null\)/);
});

test('preparing a guided pricing prompt only fills the composer and does not submit it', () => {
  const launcher = src('components/assistant/SmartAssistantLauncher.tsx');
  const start = launcher.indexOf('const onCommand = () => {');
  const end = launcher.indexOf('window.addEventListener(HELPER_COMMAND_EVENT, onCommand);', start);
  assert.ok(start >= 0 && end > start);
  const commandHandler = launcher.slice(start, end);
  assert.match(commandHandler, /setInput\(prompt\)/);
  assert.doesNotMatch(commandHandler, /sendMessage\(/);
  assert.doesNotMatch(commandHandler, /runTurn\(/);
});

test('assistant session isolation code follows the no-em-dash and UTF-8 safety rule', () => {
  for (const file of [
    'lib/assistant/session-scope.ts',
    'lib/assistant/client-session.ts',
    'lib/assistant/session.ts',
    'components/assistant/SmartAssistantLauncher.tsx',
    'components/assistant/EnquiryPanel.tsx',
  ]) {
    assert.doesNotMatch(src(file), /\u2014|\uFFFD/);
  }
});
