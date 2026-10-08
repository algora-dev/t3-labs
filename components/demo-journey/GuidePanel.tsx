'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DEMO_HOME, DEMO_SUMMARY, DEMO_TASKS, getTask, nextTask } from '../../lib/demo-journey/config';
import type { TaskId } from '../../lib/demo-journey/config';
import { requestDemoAction, updateJourney } from '../../lib/demo-journey/store';
import { useDemoJourney } from './useDemoJourney';
export function GuidePanel() {
  const state = useDemoJourney();
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!state.collapsed && window.innerWidth < 1000) panel.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, [state.collapsed, state.current]);
  const task = getTask(state.current);
  const router = useRouter();
  const path = usePathname();
  const complete = state.status[task.id] === 'completed';
  const onTaskPage = path === task.route;
  const tried = DEMO_TASKS.filter(t => !t.optional && state.status[t.id] === 'completed').length;
  function select(id: TaskId) {
    requestDemoAction('assistant-close');
    updateJourney({ type: 'select', task: id });
    router.push(getTask(id).route);
  }
  function advance(skip: boolean) {
    const next = nextTask(task.id);
    requestDemoAction('assistant-close');
    updateJourney({ type: skip ? 'skip' : 'next' });
    router.push(next ? getTask(next).route : DEMO_SUMMARY);
  }
  function tryTask() {
    if (!onTaskPage) { router.push(task.route); return; }
    updateJourney({ type: 'attempt' });
    requestDemoAction(task.action);
    if (window.innerWidth < 1000) updateJourney({ type: 'collapse', value: true });
  }
  if (state.collapsed) return <aside className="ag-guide-collapsed" aria-label="Demo guide">
    <div><span className="ag-dot" /><strong>{task.name}</strong><span className="ag-compact-status" role="status">{complete ? 'Task completed' : state.error ? 'Try again or skip' : 'Your demo guide'}</span></div>
    <button className="ag-button ag-small" type="button" onClick={() => updateJourney({ type: 'collapse', value: false })}>{complete ? 'See the benefit' : 'Show guide'} <span aria-hidden="true">↑</span></button>
  </aside>;
  return <aside ref={panel} className="ag-guide" aria-label="Demo guide">
    <div className="ag-guide-card">
      <div className="ag-guide-top"><span className="ag-eyebrow">YOUR DEMO GUIDE</span><button type="button" className="ag-icon-button" aria-label="Minimise demo guide" onClick={() => updateJourney({ type: 'collapse', value: true })}>−</button></div>
      <nav className="ag-task-nav" aria-label="Demo tasks">{DEMO_TASKS.map(t => <button type="button" key={t.id} title={t.name} aria-label={`${t.name}${t.optional ? ' (optional)' : ''}: ${state.status[t.id]}`} aria-current={t.id === task.id ? 'step' : undefined} className={`${t.id === task.id ? 'is-current' : ''} ${state.status[t.id] === 'completed' ? 'is-complete' : ''}`} onClick={() => select(t.id)}>{state.status[t.id] === 'completed' ? '✓' : t.number}</button>)}</nav>
      <p className="ag-guide-progress">{tried} of 4 experiences tried <span>+ optional trade demo</span></p>
      <div className="ag-guide-body">
        <p className="ag-eyebrow ag-blue">{task.optional ? 'OPTIONAL EXTRA' : `EXPERIENCE ${task.number}`}</p>
        <h2>{task.title}</h2>
        {!complete ? <>
          <div className="ag-reflection"><span>THINK ABOUT YOUR WEBSITE</span><p>{task.before}</p></div>
          <h3>Try this</h3><p>{task.instruction}</p>
          {task.id === 'assistant' && <div className="ag-prompt">“Do you handle insurance work?”</div>}
          <button className="ag-button ag-wide" type="button" onClick={tryTask}>{onTaskPage ? task.actionLabel : 'Return to this task'} <span aria-hidden="true">→</span></button>
          {task.id === 'assistant' && <small>We fill the message box. You choose when to send.</small>}
          {(task.id === 'detailed' || task.id === 'quick' || task.id === 'plan') && <small>Loading an example asks before replacing an existing draft.</small>}
          {state.error && <p className="ag-error" role="alert">This task could not finish. Retry, or skip it and try another tool. No successful result has been recorded.</p>}
          {state.attempted === task.id && !state.error && <p className="ag-waiting" role="status">Use the tool to finish this task. The guide will acknowledge the result here.</p>}
        </> : <>
          <div className="ag-success" role="status"><span aria-hidden="true">✓</span><p>{task.outcome}</p></div>
          <h3>What this could mean for you</h3><p>{task.benefit}</p>
          <details className="ag-extra"><summary>Explore a little further</summary><p>{task.extra}</p><button className="ag-text-button" type="button" onClick={tryTask}>Try this example again</button></details>
          <button type="button" className="ag-button ag-wide" onClick={() => advance(false)}>{nextTask(task.id) ? 'Next experience' : 'See the bigger picture'} <span aria-hidden="true">→</span></button>
        </>}
      </div>
      <div className="ag-guide-footer">
        {!complete && <button type="button" className="ag-text-button" onClick={() => advance(true)}>{task.optional ? 'Not relevant to my business' : 'Skip this task'}</button>}
        <button type="button" className="ag-text-button" onClick={() => updateJourney({ type: 'pause' })}>Explore without the guide</button>
        <Link href={DEMO_SUMMARY}>View the business benefits</Link>
        <Link href={DEMO_HOME}>Back to demo overview</Link>
      </div>
    </div>
  </aside>;
}
