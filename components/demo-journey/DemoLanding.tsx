'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { APEX_HOME, DEMO_TASKS, getTask } from '../../lib/demo-journey/config';
import type { TaskId } from '../../lib/demo-journey/config';
import { updateJourney } from '../../lib/demo-journey/store';
import { useDemoJourney } from './useDemoJourney';
import { DemoGlyph } from './DemoGlyph';
export function DemoLanding() {
  const router = useRouter();
  const state = useDemoJourney();
  const started = state.active || Object.values(state.status).some(s => s !== 'untried');
  function start(task: TaskId = 'assistant') { updateJourney({ type: 'start', task }); router.push(getTask(task).route); }
  return <main className="ag-landing">
    <section className="ag-hero ag-container">
      <div className="ag-hero-copy">
        <p className="ag-eyebrow ag-blue"><span className="ag-dot" /> INTERACTIVE WEBSITE DEMO</p>
        <h1>What if your website<br />could <em>answer that?</em></h1>
        <p className="ag-lead">Step into your customer’s shoes. Ask a question, get a roof estimate or price a job. Then imagine the same experience on your own website.</p>
        <div className="ag-actions"><button className="ag-button" type="button" onClick={() => start(started ? state.current : 'assistant')}>{started ? 'Continue the guided demo' : 'Start the guided demo'} <span aria-hidden="true">→</span></button><Link className="ag-secondary" href={APEX_HOME} onClick={() => updateJourney({ type: 'pause' })}>Explore the example website ↗</Link></div>
        <div className="ag-reassurance"><span>✓ No sign-up</span><span>✓ Examples ready to use</span><span>✓ Go at your own pace</span></div>
      </div>
      <div className="ag-question-card">
        <div className="ag-mini-browser"><span /><span /><span /><p>YOUR CUSTOMER, RIGHT NOW</p></div>
        <div className="ag-question-inner"><p className="ag-eyebrow">BEFORE YOU TRY IT</p><h2>“How much would<br />my new roof cost?”</h2><p>How does someone who has never used your website get this answer today?</p><div className="ag-answer-paths"><span>Search the website?</span><span>Call or email?</span><span>Try somewhere else?</span></div><div className="ag-question-bottom"><span className="ag-check">↗</span><p>Try a different route.<br /><strong>Let the website do the first bit of work.</strong></p></div></div>
      </div>
    </section>
    <section className="ag-outcome-strip"><div className="ag-container"><p><strong>Less routine admin.</strong> More time for useful conversations.</p><p><strong>Clearer answers.</strong> A reason for visitors to stay.</p><p><strong>Your products.</strong> Your prices. Your workflow.</p></div></section>
    <section className="ag-container ag-experiences" id="experiences">
      <div className="ag-section-heading"><div><p className="ag-eyebrow ag-blue">CHOOSE YOUR STARTING POINT</p><h2>Four ways to get to an answer.</h2></div><p>Follow the guide, or jump to the part that matters most to your business. Prefer not to chat? Start with the quick estimate.</p></div>
      <div className="ag-experience-grid">{DEMO_TASKS.filter(t => !t.optional).map(task => <button type="button" className="ag-experience-card" key={task.id} onClick={() => start(task.id)}>
        <div className="ag-card-top"><span className="ag-glyph"><DemoGlyph kind={task.id} /></span><span className="ag-card-number">{state.status[task.id] === 'completed' ? '✓ TRIED' : task.number}</span></div>
        <p className="ag-card-audience">{task.audience}</p><h3>{task.name}</h3><p>{task.description}</p><span className="ag-card-link">Try this experience <span aria-hidden="true">→</span></span>
      </button>)}</div>
      <div className="ag-trade-callout"><span className="ag-glyph"><DemoGlyph kind="trade" /></span><div><p className="ag-eyebrow">SELLING TO THE TRADE?</p><h3>Give customers a reason to return for the next job.</h3><p>Explore an example trade account and see how quoting with your catalogue could support repeat business.</p></div><button className="ag-button ag-outline" type="button" onClick={() => start('trade')}>Try trade pricing <span aria-hidden="true">→</span></button></div>
    </section>
    <section className="ag-bespoke ag-container"><div><p className="ag-eyebrow ag-blue">AN EXAMPLE, NOT A FIXED TEMPLATE</p><h2>Apex today.<br />Your business, your way.</h2></div><div><p>The roof shapes and prices here tell an example story. Your version can use your own catalogue, branding, questions, rates and workflow, with the tools your customers actually need.</p><p>It can be a simple estimator, a richer trade workflow, an assistant, or a combination. The point is a better route from a visitor’s question to a useful next step.</p></div></section>
    <footer className="ag-landing-footer ag-container"><span>Built by T3 Labs · Fictional UK roofing demo · Not a quotation</span><Link href="/#contact">Talk about your website ↗</Link></footer>
  </main>;
}
