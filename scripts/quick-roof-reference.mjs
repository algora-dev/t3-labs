/** Generate an unpriced reference matrix for review with the roofing business.
 * Run from the repo root with Node 22.16+:
 * node --experimental-strip-types scripts/quick-roof-reference.mjs
 * An optional first argument selects the output JSON file.
 */
import { register } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
register(new URL('../tests/ts-resolve.mjs', import.meta.url));
const { measureRoof } = await import('../lib/quick-estimate/engine.ts');
const { ROOF_TEMPLATES } = await import('../lib/quick-estimate/templates.ts');
const { SIZE_BANDS, PITCH_BANDS } = await import('../lib/quick-estimate/config.ts');
const rows = [];
for (const shape of Object.keys(ROOF_TEMPLATES)) {
  for (const size of Object.keys(SIZE_BANDS)) {
    for (const pitch of shape === 'flat' ? [null] : Object.keys(PITCH_BANDS)) {
      const input = { shape, size, pitch, storeys: 1, flatExtension: null };
      const result = measureRoof(input);
      rows.push({ input, lower: { dimensions: result.low.sections[0].dimensions, quantities: result.low.totals }, upper: { dimensions: result.high.sections[0].dimensions, quantities: result.high.totals } });
    }
  }
}
const output = resolve(process.argv[2] ?? 'docs/quick-roof-reference.json');
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, JSON.stringify({ note: 'Representative geometric scenarios, not surveyed roofs, market benchmarks or prices. Review template proportions with the roofing business.', combinations: rows.length, rows }, null, 2) + '\n', 'utf8');
console.log(`Wrote ${rows.length} reference combinations to ${output}`);
