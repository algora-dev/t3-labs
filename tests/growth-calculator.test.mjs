import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';

// Lightweight source assertions; production calculation logic is in GrowthCalculator.tsx.
const source = readFileSync(new URL('../components/t3-rebuild/GrowthCalculator.tsx', import.meta.url), 'utf8');
test('percentage increase is relative, not percentage points', () => {
  assert.match(source, /v\.winRate \* \(1 \+ v\.betterWinRate \/ 100\)/);
});
test('hours are computed from projected quote volume', () => {
  assert.match(source, /possibleQuotes \* \(v\.minutesBefore - fasterMinutes\)/);
});
test('recovered time value is separate from gross-profit scenario', () => {
  assert.match(source, /timeValue: timeReclaimed \* v\.hourlyCost/);
  assert.match(source, /extraGrossProfit: extraJobs \* v\.profitPerJob/);
});
