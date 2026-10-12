'use client';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent, type KeyboardEvent } from 'react';
import { APEX_HOME, ADMIN_HOME, isAdminPath, QUICK_HOME, CORE_TASKS, TASKS, HELPER_TASKS, HELPER_QUESTION, HELPER_PRICE_PROMPT, ADVANCED_TOOLS, ADVANCED_PRICING_NOTE } from '../../lib/demo-helper/config';
import type { HelperTaskId } from '../../lib/demo-helper/config';
import { taskGuidance } from '../../lib/demo-helper/guidance';
import { isAssistantTask } from '../../lib/demo-helper/assistant-activity';
import { updateHelper, sendHelperCommand, HELPER_POSITION_KEY, HELPER_REVEAL_EVENT } from '../../lib/demo-helper/store';
import { clampPosition, readPosition, type HelperPosition } from '../../lib/demo-helper/state';
import { useDemoHelper, useHelperSurface, useAssistantActivity } from './useDemoHelper';
import { CONVERSION_OFFER } from '../../lib/demo-conversion/config';
import { trackDemo } from '../../lib/demo-conversion/metrics';
import { updateConversion } from '../../lib/demo-conversion/store';
import './helper.css';
const noSubscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const listenResize = (fn: () => void) => { window.addEventListener('resize', fn); window.visualViewport?.addEventListener('resize', fn); window.visualViewport?.addEventListener('scroll', fn); return () => { window.removeEventListener('resize', fn); window.visualViewport?.removeEventListener('resize', fn); window.visualViewport?.removeEventListener('scroll', fn); }; };
const viewportSnapshot = () => `${window.innerWidth},${window.visualViewport?.height ?? window.innerHeight},${window.visualViewport?.offsetTop ?? 0},${window.innerHeight}`;
function Arrow() { return <span aria-hidden="true">→</span>; }
function Check() { return <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

function T3Mark() {
  // Supplied brand asset, unchanged. The preview bundles these same image bytes.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="dh-logo" src="/assets/t3-demo-guide/t3-logo-icon-glow-transparent.png" width="56" height="56" alt="" draggable={false} />;
}

export function DemoHelper({ suspended = false }: { suspended?: boolean }) {
  const mounted = useSyncExternalStore(noSubscribe, clientSnapshot, serverSnapshot);
  const s = useDemoHelper();
  const welcome = s.view === 'welcome';
  const [welcomeMoved, setWelcomeMoved] = useState(false);
  const surface = useHelperSurface();
  const activity = useAssistantActivity();
  const path = usePathname();
  const router = useRouter();
  const [width, height, visibleTop, layoutHeight] = useSyncExternalStore(listenResize, viewportSnapshot, () => '1280,800,0,800').split(',').map(Number);
  const mobile = width < 760;
  const [position, setPosition] = useState<HelperPosition | null>(null);
  const [dragging, setDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [taskMenu, setTaskMenu] = useState(false);
  const [manual, setManual] = useState(false);
  const quickTransition = useRef<number | null>(null);
  const panel = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const initiallyFocused = useRef(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const offset = useRef<{ x: number; y: number } | null>(null);
  const task = TASKS[s.current];
  const assistantOpen = surface.startsWith('assistant');
  const collapsed = s.collapsed;
  const dockAssistant = width < 980 && assistantOpen;
  const shortViewport = (mobile || dockAssistant) && height < 500;

  // A guided transition into the non-chat tool closes chat, not its conversation.
  // This runs once per task entry. A visitor may reopen chat afterwards.
  useEffect(() => {
    if (s.current === 'quick-price' && s.view === 'task' && quickTransition.current !== s.runId) {
      quickTransition.current = s.runId;
      sendHelperCommand('assistant-close');
    }
  }, [s.current, s.runId, s.view]);

  // Reserve real space above the mobile guide for the assistant, rather than
  // hiding either panel or placing instructions over the answer/input.
  useEffect(() => {
    const root = document.documentElement;
    const measure = () => {
      const node = collapsed ? launcher.current : panel.current;
      const rect = node?.getBoundingClientRect();
      const space = dockAssistant && !suspended && rect ? Math.ceil(visibleTop + height - rect.top) + 8 : 0;
      const pageSpace = !assistantOpen && !suspended && !collapsed && rect ? Math.ceil(height - (rect.top - visibleTop)) + 16 : 0;
      root.style.setProperty('--t3-guide-page-space', `${pageSpace}px`);
      root.dataset.t3GuideTool = path === QUICK_HOME ? 'quick' : '';
      root.dataset.t3GuideDocked = dockAssistant ? 'true' : '';
      root.dataset.t3GuideShort = shortViewport ? 'true' : '';
      root.style.setProperty('--t3-guide-dock-height', `${space}px`);
      root.style.setProperty('--t3-visual-height', `${height}px`);
      root.style.setProperty('--t3-visible-top', `${visibleTop}px`);
    };
    measure();
    const node = collapsed ? launcher.current : panel.current;
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (node) observer?.observe(node);
    return () => { observer?.disconnect(); root.style.removeProperty('--t3-guide-dock-height'); root.style.removeProperty('--t3-visual-height'); root.style.removeProperty('--t3-visible-top'); root.style.removeProperty('--t3-guide-page-space'); delete root.dataset.t3GuideTool; delete root.dataset.t3GuideDocked; delete root.dataset.t3GuideShort; };
  }, [mobile, dockAssistant, shortViewport, assistantOpen, collapsed, suspended, mounted, height, visibleTop, s.view, path, position]);

  useEffect(() => {
    if (!mounted) return;
    const reveal = () => {
      setPosition(null); setWelcomeMoved(false);
      try { sessionStorage.removeItem(HELPER_POSITION_KEY); } catch { /* Optional storage. */ }
      requestAnimationFrame(() => panel.current?.focus({ preventScroll: true }));
    };
    window.addEventListener(HELPER_REVEAL_EVENT, reveal);
    return () => window.removeEventListener(HELPER_REVEAL_EVENT, reveal);
  }, [mounted]);
  useEffect(() => {
    // New visitors see a centred welcome; subsequent navigation respects their choice.
    if (mounted && !suspended && welcome && !collapsed && !initiallyFocused.current) {
      initiallyFocused.current = true;
      panel.current?.focus({ preventScroll: true });
    }
  }, [mounted, welcome, collapsed, suspended]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => content.current?.scrollTo({ top: 0 }));
    return () => cancelAnimationFrame(frame);
  }, [s.view, s.current, s.started, s.milestones.length, activity?.phase]);
  useEffect(() => {
    // Synchronise the optional saved desktop position once after hydration.
    // sessionStorage is unreadable during SSR, so the restore sets state here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    try { setPosition(readPosition(sessionStorage.getItem(HELPER_POSITION_KEY))); } catch { /* Storage is optional. */ }
  }, []);
  useEffect(() => {
    if (mobile || !mounted) return;
    const clamp = () => {
      if (!panel.current) return;
      const rect = panel.current.getBoundingClientRect();
      setPosition(p => {
        if (!p) return null;
        const next = clampPosition(p, { width, height }, rect);
        return next.x === p.x && next.y === p.y ? p : next;
      });
    };
    clamp();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(clamp);
    if (panel.current) observer.observe(panel.current);
    return () => observer.disconnect();
  }, [width, height, mobile, collapsed, mounted]);
  useEffect(() => {
    if (position) { try { sessionStorage.setItem(HELPER_POSITION_KEY, JSON.stringify(position)); } catch { /* Optional. */ } }
  }, [position]);

  function hideGuide() {
    updateHelper({ type: 'collapse', value: true });
    requestAnimationFrame(() => launcher.current?.focus({ preventScroll: true }));
  }
  function select(id: HelperTaskId) { if (id === 'admin') { openAdminDashboard(); return; } sendHelperCommand('assistant-close'); setTaskMenu(false); setManual(false); updateHelper({ type: 'select', task: id }); }
  function openAdminDashboard() {
    sendHelperCommand('assistant-close');
    setTaskMenu(false);
    setManual(false);
    updateHelper({ type: 'select', task: 'admin' });
    updateHelper({ type: 'prepare' });
    if (isAdminPath(path)) sendHelperCommand('admin-trade');
    else router.push(ADMIN_HOME);
  }
  function startDrag(e: PointerEvent<HTMLButtonElement>) {
    if (mobile || e.button !== 0 || !panel.current) return;
    const rect = panel.current.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setPosition({ x: rect.left, y: rect.top });
    if (welcome) setWelcomeMoved(true);
    e.currentTarget.setPointerCapture(e.pointerId); setDragging(true);
  }
  function move(e: PointerEvent<HTMLButtonElement>) {
    if (!offset.current || !panel.current) return;
    setPosition(clampPosition({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y }, { width, height }, panel.current.getBoundingClientRect()));
  }
  function endDrag(e: PointerEvent<HTMLButtonElement>) {
    offset.current = null; setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }
  function keyboardMove(e: KeyboardEvent<HTMLButtonElement>) {
    if (mobile || !panel.current) return;
    const rect = panel.current.getBoundingClientRect();
    const step = e.shiftKey ? 50 : 20;
    const deltas: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (e.key === 'Home') { e.preventDefault(); setPosition(null); setWelcomeMoved(false); try { sessionStorage.removeItem(HELPER_POSITION_KEY); } catch {} return; }
    if (!deltas[e.key]) return;
    e.preventDefault(); if (welcome) setWelcomeMoved(true); const [x, y] = deltas[e.key];
    setPosition(clampPosition({ x: rect.x + x, y: rect.y + y }, { width, height }, rect));
  }
  function tryTask() {
    setManual(false);
    if (!s.started) updateHelper({ type: 'prepare' });
    if (isAssistantTask(s.current)) {
      if ((!path?.startsWith(APEX_HOME) && !path?.startsWith('/supplier-pricing-tool/apex-roofing')) || isAdminPath(path)) router.push(APEX_HOME);
      sendHelperCommand(guidance.command ?? 'assistant-open');
    } else if (s.current === 'quick-price') {
      sendHelperCommand('assistant-close');
      sendHelperCommand(guidance.command ?? 'quick-example');
      if (path !== QUICK_HOME) router.push(QUICK_HOME);
    } else if (isAdminPath(path)) sendHelperCommand('admin-trade');
    else router.push(ADMIN_HOME);
  }
  const prompt = s.current === 'answers' ? HELPER_QUESTION : HELPER_PRICE_PROMPT;
  async function copy() {
    try { await navigator.clipboard.writeText(prompt); setCopied(true); } catch { setCopied(false); }
  }
  const guidance = taskGuidance(s, activity, surface, path);
  const adminAtDestination = s.current === 'admin' && isAdminPath(path);
  const instruction = guidance.text;
  const readingEnquiry = s.view === 'benefit' && surface.includes('enquiry');
  const activeTask = (s.view === 'task' && s.started) || readingEnquiry;
  const collapsedText = s.view === 'welcome' ? 'Show me around' : s.view === 'finish' ? 'Keep exploring' : s.view === 'benefit' ? 'See what this means' : task.label;
  const centred = welcome && (mobile || !welcomeMoved);
  const style: CSSProperties | undefined = !mobile && !dockAssistant && position && !collapsed && !centred ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto', transform: 'none' } : undefined;

  // Only the explicit Hide control changes visibility. Background interactions
  // and workflow signals must never dismiss the guide.
  const viewportStyle = { '--dh-viewport-height': `${height}px`, '--dh-centre-y': `${visibleTop + height / 2}px`, '--dh-bottom-inset': `${Math.max(0, layoutHeight - height - visibleTop)}px` } as CSSProperties;
  if (!mounted || suspended) return null;
  return createPortal(<>
    <p className="dh-sr" aria-live="polite" aria-atomic="true">{s.view === 'benefit' ? (collapsed ? 'Experience finished. Show the demo guide to see the benefit.' : 'Experience finished. Your demo guide now shows the benefit.') : s.started ? `Task ${task.number}. ${instruction}` : ''}</p>
    {collapsed ? <button ref={launcher} type="button" style={viewportStyle} className={`dh-launcher ${assistantOpen ? 'dh-over-assistant' : ''}`} aria-label={`Show demo guide: ${collapsedText}`} aria-controls="t3-demo-guide" aria-expanded="false" onClick={() => { updateHelper({ type: 'collapse', value: false }); requestAnimationFrame(() => panel.current?.focus({ preventScroll: true })); }}>
      <T3Mark /><span><b>Show demo guide</b><small>{collapsedText}</small></span><span className="dh-launcher-step">{s.view === 'task' || s.view === 'benefit' ? task.optional ? '+' : `${task.number}/3` : '↑'}</span>
    </button> : <aside id="t3-demo-guide" ref={panel} role="dialog" tabIndex={-1} style={{ ...viewportStyle, ...style }} className={`dh-panel ${welcome ? 'dh-welcome' : ''} ${activeTask ? 'dh-active' : ''} ${assistantOpen ? 'dh-assistant-mode' : ''} ${dockAssistant ? 'dh-docked' : ''} ${shortViewport ? 'dh-short' : ''} ${dragging ? 'is-dragging' : ''}`} aria-label="T3 Labs demo guide">
      <button type="button" className="dh-hide-bar" onClick={hideGuide} aria-label="Hide guide" aria-expanded="true" aria-controls="t3-demo-guide">
        <span>Hide guide</span><svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true"><path d="m5 12 5-5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <div className="dh-top">
        <div className="dh-brand"><T3Mark /><span><b>T3 LABS</b><span>Demo guide</span></span></div>
        {!mobile && !dockAssistant && <button type="button" className="dh-drag" onPointerDown={startDrag} onPointerMove={move} onPointerUp={endDrag} onPointerCancel={endDrag} onKeyDown={keyboardMove} aria-label="Move demo helper. Use arrow keys to move; Home to reset position." title="Drag to move. Keyboard: arrow keys; Home resets.">
          <svg width="22" height="26" viewBox="0 0 22 26" fill="currentColor" aria-hidden="true">{[4,10,16,22].map(y => <g key={y}><circle cx="5" cy={y} r="1.8"/><circle cx="11" cy={y} r="1.8"/><circle cx="17" cy={y} r="1.8"/></g>)}</svg><span>Move</span>
        </button>}
      </div>
      {(s.view === 'task' || s.view === 'benefit') && <div className="dh-progress-row"><div className="dh-progress" aria-label={`Task ${task.number}${task.optional ? ', optional' : ' of 3'}`}>{CORE_TASKS.map(id => <span key={id} className={`${id === s.current ? 'current' : ''} ${s.status[id] === 'observed' ? 'done' : ''}`} />)}</div><button type="button" onClick={() => setTaskMenu(v => !v)} aria-expanded={taskMenu} className="dh-text">{task.optional ? 'Optional' : `${task.number} of 3`} ▾</button></div>}

      <div className="dh-content" ref={content}>
      {taskMenu && <nav className="dh-task-menu" aria-label="Choose a demo task">{HELPER_TASKS.map(id => <button key={id} type="button" onClick={() => select(id)}><span>{TASKS[id].number}</span>{TASKS[id].label}{id === 'admin' && <small>optional</small>}<small>{s.status[id] === 'observed' ? '✓' : s.status[id] === 'skipped' ? 'skipped' : s.status[id] === 'self-reported' ? 'tried' : ''}</small></button>)}</nav>}
        {s.view === 'welcome' && <>
          <p className="dh-eyebrow">A WEBSITE THAT DOES MORE</p><h2>See what your website<br />could do for you.</h2>
          <p>Welcome to Apex Roofing, an example business. Try three short experiences using the real tools on this website.</p>
          <div className="dh-welcome-preview"><span aria-hidden="true">3</span><p>Get an answer. Get a price.<br /><b>See how it becomes an enquiry.</b></p></div>
          <p className="dh-small">Your products. Your pricing. Your branding. Imagine this working for your customers.</p>
          <button type="button" className="dh-primary" onClick={() => updateHelper({ type: 'start' })}>Show me around <Arrow /></button>
          <p className="dh-small dh-centre dh-hint">{mobile ? 'Hide the guide whenever you need more space.' : 'Move it out of your way, or hide it at any time.'}</p>
        </>}
        {s.view === 'task' && <>
          {!s.started && <><p className="dh-eyebrow">{task.optional ? 'OPTIONAL · ' : ''}{task.label}</p><h2>{task.title}</h2><p className="dh-question">{task.question}</p></>}
          <div className={`dh-instruction ${guidance.waiting ? 'dh-is-waiting' : ''}`} role="status"><span className="dh-action-number" aria-hidden="true">{guidance.waiting ? '…' : '→'}</span><p>{instruction}</p></div>
          {!s.started && isAssistantTask(s.current) && <p className="dh-example-summary">{s.current === 'answers' ? 'Example: “Do you handle insurance work?”' : 'Example: 120 m² gable roof · concrete tiles · 25° pitch.'}</p>}
          {guidance.button && !adminAtDestination && <button type="button" className="dh-primary" onClick={tryTask}>{guidance.button} <Arrow /></button>}
          {s.current === 'admin' && <Link href={APEX_HOME} className="dh-secondary" onClick={() => updateHelper({ type: 'return-from-admin' })}>← Return to Apex Roofing</Link>}
          {!s.started && isAssistantTask(s.current) && <p className="dh-small dh-centre">An example, not a script. You choose what to send.</p>}
          {guidance.freeResponse && <button type="button" className="dh-text" onClick={() => setManual(v => !v)} aria-expanded={manual}>Ready to move on?</button>}
          <details className="dh-more-guidance" key={`${s.current}-${s.runId}`}>
            <summary>More guidance</summary>
            {isAssistantTask(s.current) && <>
              <p>Ask your own questions about Apex’s services, products or prices at any time. The examples are suggestions, not fixed replies.</p>
              <p>If it needs more information, follow its questions or enquiry option. A different request may need manual continuation in the guide.</p>
              <details className="dh-prompt"><summary>View suggested message</summary><textarea readOnly aria-label="Suggested assistant prompt" value={prompt} rows={s.current === 'answers' ? 2 : 5} onFocus={e => e.currentTarget.select()} /><button type="button" onClick={copy} className="dh-text">{copied ? 'Copied ✓' : 'Copy text'}</button></details>
            </>}
            {s.current === 'assistant-price' && <p>Your business chooses the rates: public ranges, detailed prices or private trade rates. Demo enquiries aren’t sent.</p>}
            {s.current === 'quick-price' && <p>Try the sample for speed, or choose your own roof. The same calculator uses Apex’s demo products and rates. Enquiries are previews, not sent.</p>}
            {s.current === 'admin' && <p>Local demo changes only. Activity includes sample data. No invites or emails are sent.</p>}
            <button type="button" className="dh-text" onClick={() => setManual(v => !v)} aria-expanded={manual}>Continue manually</button>
          </details>
          {manual && <div className="dh-manual"><p>Continue without automatic confirmation. Marked as tried, not verified.</p><button type="button" className="dh-secondary" onClick={() => { setManual(false); updateHelper({ type: 'manual' }); }}>I’ve tried it. Continue.</button></div>}
          <div className="dh-task-footer"><button type="button" className="dh-text" onClick={() => { setManual(false); updateHelper({ type: 'skip' }); }}>Skip task</button><button type="button" className="dh-text" onClick={() => updateHelper({ type: 'finish' })}>Finish tour</button></div>
        </>}
        {readingEnquiry && <><div className="dh-instruction"><span className="dh-action-number" aria-hidden="true">✓</span><p>Your enquiry preview is ready. Read what the business receives, then return to your estimate.</p></div></>}
        {s.view === 'benefit' && !readingEnquiry && <>
          <div className="dh-success-icon"><Check /></div><p className="dh-eyebrow">{s.status[s.current] === 'observed' ? 'EXPERIENCE COMPLETE' : 'MARKED AS TRIED'}</p>
          <h2>{s.status[s.current] === 'observed' ? task.outcome : 'What this could mean for you.'}</h2><p>{task.benefit}</p>
          {s.current === 'quick-price' && <div className="dh-advanced"><p className="dh-eyebrow">NEED MORE DETAIL?</p>{ADVANCED_TOOLS.map(tool => <Link key={tool.href} href={tool.href}><b>{tool.title} <Arrow /></b><span>{tool.text}</span></Link>)}<p>{ADVANCED_PRICING_NOTE}</p></div>}
          <button type="button" className="dh-primary" onClick={() => { sendHelperCommand('assistant-close'); updateHelper({ type: 'next' }); }}>{s.current === 'answers' ? 'Next: a price through chat' : s.current === 'assistant-price' ? 'Next: a price without chat' : 'What could this do for my business?'} <Arrow /></button>
          
        </>}
        {s.view === 'finish' && <>
          <p className="dh-eyebrow">YOUR NEXT STEP</p><h2>Keep exploring.</h2>
          <p>The tools are still here. Try your own questions, explore an estimate, or talk to T3 Labs.</p>
          <a href={CONVERSION_OFFER.bookingUrl} target="_blank" rel="noopener noreferrer" className="dh-primary" onClick={() => { trackDemo('booking_clicked'); updateConversion({ type: 'contact' }); }}>{CONVERSION_OFFER.bookingLabel} <Arrow /></a>
          <button type="button" className="dh-secondary dh-secondary-strong" onClick={openAdminDashboard}>Explore the business dashboard <span>optional ↗</span></button>
          <details className="dh-finish-details"><summary>More estimating options</summary>{ADVANCED_TOOLS.map(tool => <p key={tool.href}><Link href={tool.href}>{tool.title} →</Link><br />{tool.text}</p>)}<p>{ADVANCED_PRICING_NOTE}</p></details>
          <div className="dh-task-footer"><Link href={APEX_HOME} className="dh-text">Explore Apex</Link><button type="button" className="dh-text" onClick={() => { if (window.confirm('Restart the helper? Your estimates and enquiries will not be changed.')) updateHelper({ type: 'restart' }); }}>Restart guide</button></div>
        </>}
      </div>
      <div className="dh-bottom">One example. Built your way.</div>
    </aside>}
  </>, document.body);
}
