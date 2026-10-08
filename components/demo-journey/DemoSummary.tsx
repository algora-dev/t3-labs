'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { APEX_HOME, DEMO_HOME, DEMO_TASKS, getTask } from '../../lib/demo-journey/config';
import { QUICK_DEMO_INPUT } from '../../lib/demo-journey/samples';
import { updateJourney } from '../../lib/demo-journey/store';
import { useDemoJourney } from './useDemoJourney';
import { DemoGlyph } from './DemoGlyph';
function CalculationConnection() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  async function run() {
    if (busy) return;
    setBusy(true); setError(''); setResult(null);
    controller.current = new AbortController();
    const timer = window.setTimeout(() => controller.current?.abort(), 10000);
    try {
      const response = await fetch('/api/quick-roof-estimate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(QUICK_DEMO_INPUT), signal: controller.current.signal,
      });
      const value = await response.json();
      if (!response.ok || !Number.isFinite(value.price?.low?.total) || !Number.isFinite(value.price?.high?.total)) throw new Error('No complete response');
      setResult({ source: 'Apex demonstration pricing API', profile: value.price.profileVersion,
        roof: 'Small gable, typical pitch, one storey, replacement concrete tiles',
        currency: value.price.currency, lowerConfiguredSubtotal: value.price.low.total,
        upperConfiguredSubtotal: value.price.high.total, scope: value.price.status,
        tax: value.price.taxNote, exclusionsAndChecks: value.price.missing });
    } catch { setError('The live calculation endpoint could not be reached. This feature needs the running website; no example response has been substituted.'); }
    finally { window.clearTimeout(timer); setBusy(false); }
  }
  return <div className="ag-api-demo"><h3>A real calculation, outside the form</h3><p>This button sends the sample roof selections to the existing pricing API. It is not an AI search, an MCP connection or a claim about search rankings.</p><button className="ag-button ag-outline" type="button" disabled={busy} onClick={run}>{busy ? 'Running the calculation...' : 'Run the pricing API example'} <span aria-hidden="true">↗</span></button>{error && <p className="ag-error" role="alert">{error}</p>}{result && <div role="status"><p className="ag-small-copy">Actual response from this application. Configured-work subtotal only, not a whole-job quotation.</p><pre tabIndex={0}>{JSON.stringify(result, null, 2)}</pre></div>}</div>;
}
export function DemoSummary() {
  const state = useDemoJourney();
  const router = useRouter();
  const completed = DEMO_TASKS.filter(t => !t.optional && state.status[t.id] === 'completed').length;
  return <main className="ag-summary ag-container">
    <p className="ag-eyebrow ag-blue">FROM A WEBSITE VISIT TO A USEFUL NEXT STEP</p>
    <h1>What could your website<br /><em>take off your team’s hands?</em></h1>
    <p className="ag-lead">Think back to how your customers get these answers today. The opportunity is not another feature on a website. It is a simpler way to help them move forward.</p>
    <div className="ag-benefit-grid">
      <section><span>01</span><h2>Fewer repeated first questions.</h2><p>Give customers a way to find routine answers and explore a starting price before they call or email.</p></section>
      <section><span>02</span><h2>A reason to stay on your site.</h2><p>When you have paid to bring a visitor here, help them get somewhere useful rather than sending them back to search.</p></section>
      <section><span>03</span><h2>A workflow worth coming back to.</h2><p>For trade suppliers, let regular customers build jobs around your products and their configured prices.</p></section>
    </div>
    <section className="ag-recap"><div className="ag-section-heading"><div><p className="ag-eyebrow ag-blue">YOUR EXPLORATION</p><h2>{completed} of 4 core experiences tried.</h2></div><p>Skipped an experience? You can come back to any of them. Trying a tool is optional, not a gate to the conversation.</p></div>
      <div className="ag-recap-grid">{DEMO_TASKS.map(task => <button type="button" key={task.id} onClick={() => { updateJourney({ type: 'select', task: task.id }); router.push(task.route); }}><span className="ag-glyph"><DemoGlyph kind={task.id} /></span><span><strong>{task.name}</strong><small>{task.optional ? 'Optional · ' : ''}{state.status[task.id] === 'completed' ? 'Tried successfully' : state.status[task.id] === 'skipped' ? 'Skipped' : 'Not tried yet'}</small></span><span aria-hidden="true">↗</span></button>)}</div>
    </section>
    <details className="ag-discovery"><summary><span><span className="ag-eyebrow">BEFORE THE VISITOR ARRIVES</span><strong>Could these answers help people find your business?</strong></span><span aria-hidden="true">+</span></summary><div className="ag-discovery-body">
      <p>Useful public product and pricing information gives search systems something concrete to work with. Connected AI tools can also be configured to request a calculation, rather than guess a job price from individual product listings.</p>
      <div className="ag-two-notes"><section><h3>Discoverable information</h3><p>A client website can publish clear product information, pricing scope and accessible pages. Search eligibility and inclusion still depend on the search service; there is no guaranteed recommendation.</p><a href="https://developers.google.com/search/docs/appearance/ai-features" target="_blank" rel="noopener noreferrer">Google’s guidance on AI search features ↗</a></section><section><h3>Connected calculations</h3><p>MCP can expose approved tools to a compatible AI client once an integration is built and configured. It does not automatically advertise a business to every AI system.</p><a href="https://developers.openai.com/api/docs/guides/tools-connectors-mcp" target="_blank" rel="noopener noreferrer">How connected MCP tools work ↗</a></section></div>
      <div className="ag-scope-note"><strong>What is true of this build:</strong> the calculation API exists. An MCP server has not been added. This fictional demo intentionally remains noindex, so it is not a demonstration of live search discovery.</div>
      <CalculationConnection />
    </div></details>
    <section className="ag-customisation"><div><p className="ag-eyebrow ag-blue">BUILT AROUND YOUR BUSINESS</p><h2>Your catalogue.<br />Your customers.<br />Your way of working.</h2></div><div><p>Apex is an example, not a template you have to adopt. The visual design, questions, available tools and customer journey can be tailored to your business.</p><div className="ag-custom-tags"><span>Your products and rates</span><span>Your branding</span><span>Your trade terms</span><span>Your enquiry process</span></div><p>Keep it simple for homeowners. Go deeper for contractors. Use an assistant, forms, or both.</p></div></section>
    <section className="ag-final-cta"><p className="ag-eyebrow">THE QUESTION IS SIMPLE</p><h2>Would this make life easier<br />for your customers and your team?</h2><p>Let’s talk about the questions your website could answer, and the work it could help take off your team’s plate.</p><Link className="ag-button" href="/#contact">Talk to T3 Labs about your website <span aria-hidden="true">↗</span></Link><small>No estimate in this demonstration is a quotation or a promise of savings.</small></section>
    <details className="ag-technical-notes"><summary>Demo scope and technical notes</summary><p>Prices are fictional Apex rates, not a live supplier feed. Quick estimates and detailed estimates have different scopes: read their inclusions and exclusions before comparing totals. The assistant still has a separate approved pricing catalogue, so cross-tool price alignment remains a release check.</p><p>The guided drawing has a preset scale and pre-identified rooflines. The full upload workspace remains available. The trade login is a browser-local example, not real authentication. Live assistant answers require the server’s AI configuration. No real enquiry is sent by completing this tour.</p><p>Tour progress is kept in this browser tab. The guide adds no remote analytics and stores no contact details or chat content. Existing site services retain their own behaviour.</p></details>
    <footer className="ag-summary-footer"><Link href={DEMO_HOME}>← Demo overview</Link><Link href={APEX_HOME} onClick={() => updateJourney({ type: 'pause' })}>Explore freely</Link><button className="ag-text-button" type="button" onClick={() => { if (window.confirm('Restart the tour progress? Your roof estimates and trade login will not be cleared.')) { updateJourney({ type: 'restart' }); router.push(getTask('assistant').route); } }}>Restart the tour</button></footer>
  </main>;
}
