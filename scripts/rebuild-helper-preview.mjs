/** Rebuild the offline review from actual source, reusing only the seed's bundled React,
 *  utility CSS, embedded homepage assets and explicit unsupported-canvas shim.
 *  Usage: node scripts/rebuild-helper-preview.mjs seed.html output.html
 *  Needs the project's TypeScript dependency. Does not fetch a script, font or API.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
let ts;
try { ts = require('typescript'); } catch {
  // The authoring environment may expose its compiler outside project node_modules.
  if (!process.env.TYPESCRIPT_PATH) throw Error('Install TypeScript, or set TYPESCRIPT_PATH to its local module.');
  ts = require(process.env.TYPESCRIPT_PATH);
}
const [seedPath, outputPath] = process.argv.slice(2);
if (!seedPath || !outputPath) throw Error('Supply seed.html and output.html');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let seed = fs.readFileSync(seedPath, 'utf8');
const start = seed.indexOf('const mods={');
const end = seed.indexOf('};const cache={};', start);
if (start < 0 || end < 0) throw Error('Unrecognised seed module format');
const oldModules = new Map();
const moduleText = seed.slice(start + 'const mods={'.length, end);
const starts = [...moduleText.matchAll(/^"(\/[^"\n]+)":function\(module,exports,require\)\{\n/gm)];
for (let i = 0; i < starts.length; i++) {
  const begin = starts[i].index + starts[i][0].length;
  let body = moduleText.slice(begin, i + 1 < starts.length ? starts[i + 1].index : moduleText.length);
  body = body.replace(/\n\},?\s*$/, '');
  oldModules.set(starts[i][1], body);
}
const entryId = '/__preview-entry.tsx';
const modules = new Map();
const css = new Set();
const externals = new Set(['react','react-dom','react-dom/client','next/link','next/navigation','next/dynamic','next/image','pdfjs-dist']);
function resolve(spec, from) {
  if (externals.has(spec)) return spec;
  if (spec.endsWith('.css')) {
    const resolved = spec.startsWith('@/') ? spec.slice(1) : path.posix.resolve(path.posix.dirname(from), spec);
    css.add(resolved); return '__css';
  }
  if (!spec.startsWith('.') && !spec.startsWith('@/') && !spec.startsWith('/')) throw Error(`Unexpected preview dependency ${spec} from ${from}`);
  const base = spec.startsWith('@/') ? spec.slice(1) : path.posix.resolve(path.posix.dirname(from), spec);
  for (const ext of ['', '.ts','.tsx','.json','/index.ts','/index.tsx']) if (fs.existsSync(root + base + ext) && fs.statSync(root + base + ext).isFile()) return base + ext;
  throw Error(`Missing source: ${spec} from ${from}`);
}
function compile(id) {
  if (modules.has(id)) return;
  modules.set(id, '');
  if (id === '/app/supplier-pricing-tool/TakeoffWorkstation.tsx') {
    // Never substitute fabricated canvas results. Retain the explicit review-only notice.
    if (!oldModules.has(id)) throw Error('Seed is missing the explicit plan-workspace review shim.');
    modules.set(id, oldModules.get(id)); return;
  }
  const sourcePath = id === entryId ? '/scripts/preview/entry.jsx' : id;
  const source = fs.readFileSync(root + sourcePath, 'utf8');
  if (id.endsWith('.json')) { modules.set(id, `module.exports = ${JSON.stringify(JSON.parse(source))};`); return; }
  const out = ts.transpileModule(source, { fileName: sourcePath, reportDiagnostics: true, compilerOptions: {
    target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true, resolveJsonModule: true,
  }});
  if (out.diagnostics?.some(d=>d.category===ts.DiagnosticCategory.Error)) throw Error(`Syntax error in ${id}`);
  const logoPath = '/assets/t3-demo-guide/t3-logo-icon-glow-transparent.png';
  const sourceCode = out.outputText.replaceAll(logoPath, `data:image/png;base64,${fs.readFileSync(root + '/public' + logoPath).toString('base64')}`);
  const code = sourceCode.replaceAll('import.meta.url', JSON.stringify('https://preview.invalid/review.js')).replace(/require\(["']([^"']+)["']\)/g, (_all, spec) => {
    const dep = resolve(spec, sourcePath);
    if (dep !== '__css' && !externals.has(dep)) compile(dep);
    return `require(${JSON.stringify(dep)})`;
  });
  modules.set(id, code);
}
compile(entryId);
css.add('/app/demo/roofing-site/act.css');
css.add('/app/demo/roofing-site/quick-estimate/quick-estimate.css');
// Remove earlier source-style bundles so rebuilding the review is idempotent.
let before = seed.slice(0, start).replace(/<style>\/\* Current source:[\s\S]*?<\/style>/g, '');
// The earliest preview combined utility CSS and source CSS in one style tag.
// Retain the compiled utilities, but never carry obsolete guide/tool rules forward.
before = before.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/g, (_all, open, text, close) => {
  const marker = text.indexOf('/* Website-first helper.');
  return open + (marker < 0 ? text : text.slice(0, marker) + '\nbody{font-family:Arial,sans-serif;margin:0}') + close;
});
let after = seed.slice(end + 1); // starts ;const cache...
const cssText = [...css].filter(p=>fs.existsSync(root+p)).map(p=>`/* Current source: ${p} */\n${fs.readFileSync(root+p,'utf8')}`).join('\n');
before = before.replace('</head>', `<style>${cssText}\n#review-banner{background:#f2f5f9;color:#475467;font-size:11px;padding:6px 16px}#review-banner summary{cursor:pointer;min-height:24px;line-height:24px}#review-banner p{font-size:12px;margin:4px auto 8px;max-width:640px}.preview-fallback{max-width:440px;margin:12vh auto;padding:28px;background:#fff;border:1px solid #dbe4ef;border-radius:18px;font:15px/1.7 Arial,sans-serif}.preview-fallback h1{font-size:23px}.preview-fallback button{padding:12px 18px;background:#1769e0;color:#fff;border-radius:10px}</style></head>`);
before = before.replace(/<title>.*?<\/title>/, '<title>Apex Roofing | T3 Labs demo guide</title>');
before = before.replace(/<div id="review-banner">.*?<\/div>/, '<details id="review-banner"><summary>Offline preview · Live assistant answers need the running website.</summary><p>The helper and local estimates work here, including enquiry previews. Live AI, generated PDFs and the full uploaded-plan workspace require the application. No demo enquiry is sent.</p></details>');
before = before.replace('<div id="root"></div>', '<div id="root"><div class="preview-fallback"><h1>Welcome to the Apex demo</h1><p>Starting your interactive guide...</p><noscript><p>JavaScript is disabled in this viewer. Open this HTML in a browser with scripts enabled to use the guide and tools.</p></noscript></div></div>');
// Some offline frames prohibit clipboard and storage; product code handles these without a crash.
// The router keeps native route consumers in the real query when available.
const body = `const mods={${[...modules].map(([id,code])=>`${JSON.stringify(id)}:function(module,exports,require){\n${code}\n}`).join(',\n')}}`;
const html = before + body + after;
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`Wrote ${outputPath}: ${modules.size} source modules, ${css.size} styles, ${html.length} characters`);
