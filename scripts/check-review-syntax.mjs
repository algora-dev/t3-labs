/** Syntax-only check. This deliberately does not claim to be a project typecheck. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
let ts;
try { ts = require('typescript'); }
catch { if (!process.env.TYPESCRIPT_PATH) throw Error('Install dependencies or set TYPESCRIPT_PATH.'); ts = require(process.env.TYPESCRIPT_PATH); }
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let files = 0;
const errors = [];
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git', 'vendor'].includes(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { scan(file); continue; }
    if (!/\.tsx?$/.test(file) || /\.d\.ts$/.test(file)) continue;
    files++;
    const result = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      fileName: file, reportDiagnostics: true,
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
    });
    for (const diagnostic of result.diagnostics ?? []) {
      if (diagnostic.category === ts.DiagnosticCategory.Error) errors.push({
        file: path.relative(root, file), message: ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '),
      });
    }
  }
}
scan(root);
console.log(JSON.stringify({ files, errors }, null, 2));
process.exitCode = errors.length ? 1 : 0;
