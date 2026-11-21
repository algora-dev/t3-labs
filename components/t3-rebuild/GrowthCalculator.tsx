"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Inputs = {
  quotesWeekly: number; weeksYear: number; moreQuotes: number; minutesBefore: number; timeSaved: number;
  hourlyCost: number; winRate: number; betterWinRate: number; profitPerJob: number; currency: string;
};
const initial: Inputs = {
  quotesWeekly: 10, weeksYear: 46, moreQuotes: 10, minutesBefore: 90, timeSaved: 50,
  hourlyCost: 50, winRate: 30, betterWinRate: 10, profitPerJob: 2000, currency: "USD",
};
const steps = ["Your business", "More opportunities", "Quote faster", "Win more", "Your results"];
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

export function calculateGrowth(v: Inputs) {
  const baseQuotes = v.quotesWeekly * v.weeksYear;
  const possibleQuotes = baseQuotes * (1 + v.moreQuotes / 100);
  const extraQuotes = possibleQuotes - baseQuotes;
  const fasterMinutes = v.minutesBefore * (1 - v.timeSaved / 100);
  // Compare same future quote volume with/without the time improvement.
  const timeReclaimed = (possibleQuotes * (v.minutesBefore - fasterMinutes)) / 60;
  const baselineWins = baseQuotes * (v.winRate / 100);
  const improvedRate = Math.min(100, v.winRate * (1 + v.betterWinRate / 100));
  const potentialWins = possibleQuotes * (improvedRate / 100);
  const extraJobs = potentialWins - baselineWins;
  return { baseQuotes, possibleQuotes, extraQuotes, fasterMinutes, timeReclaimed, timeValue: timeReclaimed * v.hourlyCost, improvedRate, extraJobs, extraGrossProfit: extraJobs * v.profitPerJob };
}

function Field({ label, value, onChange, min = 0, max = 1_000_000, unit, help }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number; unit?: string; help?: string }) {
  return <label className="t3-calc-field"><span className="t3-calc-field-label">{label} {help && <button className="t3-calc-help" type="button" title={help} data-tip={help} aria-label={`What does ${label} mean?`}>i</button>}</span><span className="t3-calc-input-wrap"><input inputMode="decimal" type="number" min={min} max={max} step="any" value={value} onChange={event => onChange(clamp(Number(event.target.value), min, max))} />{unit && <span>{unit}</span>}</span></label>;
}

export function GrowthCalculator() {
  const [values, setValues] = useState<Inputs>(initial);
  const [step, setStep] = useState(0);
  const update = (field: keyof Inputs, value: number | string) => setValues(previous => ({ ...previous, [field]: value }));
  const results = useMemo(() => calculateGrowth(values), [values]);
  const number = (n: number, decimals = 0) => new Intl.NumberFormat("en", {maximumFractionDigits: decimals}).format(n);
  const money = (n: number) => new Intl.NumberFormat("en", {style:"currency", currency:values.currency, maximumFractionDigits:0}).format(n);
  const next = () => setStep(s => Math.min(4, s + 1));
  const prev = () => setStep(s => Math.max(0, s - 1));
  return (
    <section className="section t3-growth-calculator" id="growth-calculator" aria-labelledby="growth-calculator-heading">
      <div className="container">
        <div className="t3-calc-intro"><div><div className="eyebrow">YOUR NUMBERS. YOUR OPPORTUNITY.</div><h2 id="growth-calculator-heading">What could a better process <span className="gradient-accent">be worth to you?</span></h2><p>Explore the potential of more quote-worthy enquiries, less time quoting and more jobs won. Four quick steps using your own figures.</p></div><p className="t3-calc-disclaimer">A what-if calculator, not a projection. Every improvement is an assumption you can change; actual results depend on your business, demand and capacity.</p></div>
        <div className="t3-calc-shell"><div className="t3-calc-top"><div><span className="t3-calc-kicker">ROOFING BUSINESS GROWTH CALCULATOR</span><strong>See what your improvements could add up to.</strong></div><button type="button" onClick={() => {setValues(initial); setStep(0);}} className="t3-calc-reset">Reset example ↺</button></div>
          <div className="t3-calc-steps" aria-label="Calculator progress">{steps.map((name,i) => <button key={name} type="button" aria-current={step === i ? "step" : undefined} className={step === i ? "active" : ""} disabled={i > step} onClick={() => setStep(i)}><span>{i < 4 ? i+1 : "✓"}</span><em>{name}</em></button>)}</div>
          <div className="t3-calc-progress" aria-hidden="true"><span style={{width:`${(step+1)*20}%`}} /></div>
          <div className="t3-calc-content" aria-live="polite">
            {step === 0 && <><span className="t3-calc-count">STEP 1 OF 4</span><h3>Tell us about your roofing business.</h3><p className="t3-calc-description">Rough estimates are fine - use numbers typical of your business.</p><div className="t3-calc-fields"><Field label="Quotes you send per week" value={values.quotesWeekly} onChange={v => update("quotesWeekly",v)} min={0} max={10000} help="Count the jobs you would actually want to quote."/><Field label="Working weeks per year" value={values.weeksYear} onChange={v=>update("weeksYear",v)} min={1} max={52} /><Field label="Average gross profit per job" value={values.profitPerJob} onChange={v=>update("profitPerJob",v)} unit={values.currency} help="Revenue minus direct job costs, before fixed overheads and tax."/><label className="t3-calc-field"><span className="t3-calc-field-label">Currency</span><span className="t3-calc-input-wrap"><select value={values.currency} onChange={e=>update("currency", e.target.value)}>{["USD","AUD","NZD","GBP","CAD","EUR"].map(c=><option key={c} value={c}>{c}</option>)}</select></span></label></div></>}
            {step === 1 && <><span className="t3-calc-count">STEP 2 OF 4</span><h3>What if more of the right enquiries came in?</h3><p className="t3-calc-description">Increase quote-worthy opportunities, not just total traffic or low-quality leads.</p><div className="t3-calc-fields"><Field label="Potential increase in quotes" value={values.moreQuotes} onChange={v=>update("moreQuotes",v)} max={200} unit="%" help="A relative percentage increase: 10% on 10 quotes per week means 11 quotes per week."/></div><p className="t3-calc-note">At these settings, that is about <strong>{number(results.extraQuotes,1)} extra quotes per year</strong> - assuming those enquiries are relevant and you have capacity to quote them.</p></>}
            {step === 2 && <><span className="t3-calc-count">STEP 3 OF 4</span><h3>How much quoting time could you save?</h3><p className="t3-calc-description">Think of all the measuring, pricing, document preparation and sending you do per quote.</p><div className="t3-calc-fields"><Field label="Current minutes per quote" value={values.minutesBefore} onChange={v=>update("minutesBefore",v)} max={10000} unit="min"/><Field label="Potential reduction in quoting time" value={values.timeSaved} onChange={v=>update("timeSaved",v)} max={95} unit="%" help="A hypothetical 50% reduction means a 90-minute quote would take 45 minutes. Your results will depend on your process; no fixed saving is guaranteed."/><Field label="Value of one hour of your time" value={values.hourlyCost} onChange={v=>update("hourlyCost",v)} unit={values.currency} help="Use a realistic hourly cost or value. Recovered capacity is not necessarily cash saved."/></div><p className="t3-calc-note">Potential new time: <strong>{number(results.fasterMinutes,1)} minutes per quote</strong>. This models saved time on your projected annual quote volume.</p></>}
            {step === 3 && <><span className="t3-calc-count">STEP 4 OF 4</span><h3>What if you won a little more work?</h3><p className="t3-calc-description">Estimate the value of better quotes and consistent follow-up.</p><div className="t3-calc-fields"><Field label="Current quote win rate" value={values.winRate} onChange={v=>update("winRate",v)} max={100} unit="%" help="Of the quotes you send, approximately what percentage become jobs?"/><Field label="Potential improvement in win rate" value={values.betterWinRate} onChange={v=>update("betterWinRate",v)} max={200} unit="%" help="Relative increase only: improving a 30% win rate by 10% gives 33%, not 40%."/></div><p className="t3-calc-note">Your hypothetical win rate becomes <strong>{number(results.improvedRate,1)}%</strong> (a relative improvement, capped at 100%).</p></>}
            {step === 4 && <><span className="t3-calc-count">YOUR ANNUAL WHAT-IF SCENARIO</span><h3>Here's what the changes could add up to.</h3><p className="t3-calc-description">Illustrative calculations based on your assumptions, not guaranteed results.</p><div className="t3-calc-results"><div><span>Additional quotes per year</span><strong>+{number(results.extraQuotes,1)}</strong></div><div><span>Quoting hours recovered</span><strong>{number(results.timeReclaimed,1)} hrs</strong></div><div><span>Potential additional jobs won</span><strong>+{number(results.extraJobs,1)}</strong></div><div><span>Potential additional annual gross profit</span><strong>{money(results.extraGrossProfit)}</strong></div></div><p className="t3-calc-note">The potential value of recovered quoting time is <strong>{money(results.timeValue)}</strong>. This represents time capacity valued at your chosen hourly rate - <strong>not necessarily an expense saving</strong>. It is separate from the additional gross-profit scenario above.</p><div className="t3-calc-cta"><Link className="btn btn-lime" href="/free-review?focus=Improve+leads+quoting+and+win+rate">Talk through the opportunity ↗</Link></div></>}
          </div>
          <div className="t3-calc-footer"><button type="button" className="t3-calc-back" onClick={prev} disabled={step===0}>← Back</button><span>{step===4?"Results":"Step " + (step+1) + " of 4"}</span>{step<4 ? <button type="button" className="t3-calc-next" onClick={next}>{step===3 ? "See my results" : "Next step"} →</button> : <button type="button" className="t3-calc-next" onClick={()=>setStep(0)}>Start again ↻</button>}</div>
        </div>
      </div>
    </section>
  );
}
