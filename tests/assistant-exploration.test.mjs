import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const src = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('assistant prompt answers known questions, offers pages and limits general ambiguity to one clarification', () => {
  const prompt = src('lib/assistant/prompts.ts');
  assert.match(prompt, /answer the visitor's question first and call navigate in the SAME turn/i);
  assert.match(prompt, /ask at most ONE generic clarification/i);
  assert.match(prompt, /do not ask another generic question/i);
  assert.match(prompt, /assistant must never end at "I don't know"/i);
  assert.match(prompt, /use handoff_to_team/i);
});

test('unsupported pricing is handed to the team rather than substituted', () => {
  const prompt = src('lib/assistant/prompts.ts');
  assert.match(prompt, /missing from the approved pricing catalogue/i);
  assert.match(prompt, /Do not substitute another material/i);
  assert.match(prompt, /handoff_to_team/i);
});

test('human handoff exposes enquiry and call routes and stores a concise handoff draft', () => {
  const orchestrator = src('lib/assistant/orchestrator.ts');
  const session = src('lib/assistant/session.ts');
  const types = src('lib/assistant/types.ts');
  assert.match(orchestrator, /name: 'handoff_to_team'/);
  assert.match(orchestrator, /type: 'OPEN_INQUIRY', label: 'Prepare an enquiry'/);
  assert.match(orchestrator, /type: 'SHOW_CONTACT_OPTIONS', label: 'Call the team'/);
  assert.match(orchestrator, /session\.handoff = \{/);
  assert.match(orchestrator, /sourceUserMessages\(session, turn\.currentUserMessage\)/);
  assert.match(session, /generalClarificationPending: boolean/);
  assert.match(session, /handoff: HandoffDraft \| null/);
  assert.match(types, /type: 'SHOW_CONTACT_OPTIONS'/);
});

test('assistant call handoff renders department numbers as explicit demo contact choices', () => {
  const launcher = src('components/assistant/SmartAssistantLauncher.tsx');
  assert.match(launcher, /action\.type === 'SHOW_CONTACT_OPTIONS'/);
  assert.match(launcher, /Fictional demo contact lines/);
  assert.match(launcher, /href=\{contact\.phoneHref\}/);
});

test('general enquiry visibly carries conversation context into the preview', () => {
  const panel = src('components/assistant/EnquiryPanel.tsx');
  const sessionRoute = src('app/api/session/route.ts');
  assert.match(sessionRoute, /handoff: session\.handoff/);
  assert.match(sessionRoute, /recentUserMessages/);
  assert.match(panel, /Enquiry carried from chat/);
  assert.match(panel, /new Set\(\[\.\.\.handoffMessages, \.\.\.recent\]\)/);
  assert.match(panel, /setNotes\(carriedSummary\)/);
  assert.match(panel, /Preview what Apex receives/);
  assert.match(panel, /This is a demo, so no email was sent/);
  assert.match(panel, /live site this would go straight to the business team/i);
});

test('new exploration code follows the no-em-dash repository rule', () => {
  for (const file of [
    'lib/assistant/prompts.ts',
    'lib/assistant/orchestrator.ts',
    'lib/assistant/session.ts',
    'components/assistant/SmartAssistantLauncher.tsx',
    'components/assistant/EnquiryPanel.tsx',
    'data/apex-roofing/roofing-knowledge.md',
  ]) {
    assert.doesNotMatch(src(file), /\u2014|\uFFFD/);
  }
});
