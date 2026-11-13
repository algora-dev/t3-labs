import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const code = readFileSync(new URL("../app/api/free-business-review/route.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
const values = [
  "Get better enquiries and more customers", "Build or improve a website", "Get found on Google and AI search",
  "Quote and estimate faster", "Cut admin and connect systems", "Answer customer questions automatically",
  "Something custom or not sure yet",
];
function route(fetchMock, env = { RESEND_API_KEY: "test-key" }) {
  const exports = {};
  const context = {
    exports, console: { log() {}, error() {}, warn() {} }, URL, Date, Map, Set, AbortController, setTimeout, clearTimeout,
    process: { env },
    fetch: fetchMock,
    require(name) {
      if (name === "next/server") return { NextResponse: { json: (body, opts = {}) => ({ body, status: opts.status || 200 }) } };
      if (name === "@/components/t3-rebuild/review-topics") return { REVIEW_TOPICS: values.map(value => ({ value })) };
      throw Error("unexpected import: " + name);
    },
  };
  vm.runInNewContext(compiled, context, { filename: "route.js" });
  return exports.POST;
}
function request(body, client = "198.51.100.1") {
  return {
    headers: new Map([ ["origin", "https://www.t3labs.tech"], ["host", "www.t3labs.tech"], ["x-forwarded-for", client] ]),
    text: async () => JSON.stringify(body),
  };
}
const valid = { email: "owner@example.org", topics: [values[0]], details: "More commercial leads", website: "example.org", name: "Pat", packageInterest: "Website and leads", submissionId: "dd02ec40-abd7-4cbc-a629-d4d3ba63f540" };

test("Real enquiry sends to .tech and never claims success before Resend confirmation", async () => {
  const sent = [];
  const POST = route(async (_, init) => { sent.push(init); return { ok: true, status: 200 }; });
  const res = await POST(request(valid));
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  const payload = JSON.parse(sent[0].body);
  assert.equal(payload.to[0], "insights@t3labs.tech");
  assert.equal(payload.reply_to, valid.email);
  assert.match(payload.text, /More commercial leads/);
  assert.ok(sent[0].headers["Idempotency-Key"].startsWith("review-"));
});

test("Failed delivery returns error, never success", async () => {
  const POST = route(async () => ({ ok: false, status: 403 }));
  const res = await POST(request(valid,"198.51.100.2"));
  assert.equal(res.status, 502);
  assert.ok(!res.body.success);
});

test("No configured API key returns unavailable rather than faking a send", async () => {
  const POST = route(async () => { throw Error("should not call email service"); }, {});
  const res = await POST(request(valid,"198.51.100.3"));
  assert.equal(res.status, 503);
});

test("Reject invalid email, invalid topics, empty topic and message", async () => {
  const POST = route(async () => ({ ok: true }));
  const variations = [
    { ...valid, email:"nope" },
    { ...valid, topics:["Fake topic"] },
    { ...valid, topics:[], details:"" },
  ];
  for (const [i, body] of variations.entries()) {
    const res = await POST(request(body,`198.51.100.${i+10}`));
    assert.equal(res.status, 400);
  }
});
