import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const text = readFileSync(new URL("../components/t3-rebuild/GrowthCalculator.tsx", import.meta.url), "utf8");
const start = text.indexOf("export function calculateGrowth(v: Inputs)");
const end = text.indexOf("\nfunction Field(", start);
assert.ok(start >= 0 && end > start, "calculation source must exist");
const source = text.slice(start, end).replace("export function calculateGrowth(v: Inputs)", "function calculateGrowth(v)");
const calculate = runInNewContext(`${source}\ncalculateGrowth`, { Math, Number });

const baseline = {
  quotesWeekly: 10, weeksYear: 46, moreQuotes: 10,
  minutesBefore: 90, timeSaved: 50, hourlyCost: 50,
  winRate: 30, betterWinRate: 10, profitPerJob: 2000, currency: "USD",
};

test("annual opportunities, time and gross profit use internally consistent inputs", () => {
  const actual = calculate(baseline);
  assert.equal(actual.baseQuotes, 460);
  assert.ok(Math.abs(actual.possibleQuotes - 506) < 1e-8);
  assert.ok(Math.abs(actual.extraQuotes - 46) < 1e-8);
  assert.equal(actual.fasterMinutes, 45);
  assert.ok(Math.abs(actual.timeReclaimed - 379.5) < 1e-8);
  assert.ok(Math.abs(actual.timeValue - 18975) < 1e-8);
  assert.ok(Math.abs(actual.improvedRate - 33) < 1e-8);
  assert.ok(Math.abs(actual.extraJobs - 28.98) < 1e-8);
  assert.ok(Math.abs(actual.extraGrossProfit - 57960) < 1e-6);
});

test("a relative improvement never produces a win rate greater than 100%", () => {
  assert.equal(calculate({...baseline, winRate: 80, betterWinRate: 50}).improvedRate, 100);
});

test("a zero-volume business produces zero jobs, time and profit uplift", () => {
  const actual = calculate({...baseline, quotesWeekly: 0});
  assert.equal(actual.extraQuotes, 0);
  assert.equal(actual.timeReclaimed, 0);
  assert.equal(actual.extraJobs, 0);
});
