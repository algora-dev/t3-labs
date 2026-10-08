'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSyncExternalStore, type ReactNode } from 'react';
import { DEMO_HOME, getTask } from '../../lib/demo-journey/config';
import { updateJourney } from '../../lib/demo-journey/store';
import { GuidePanel } from './GuidePanel';
import { useDemoJourney } from './useDemoJourney';
import './journey.css';
const noSubscribe = () => () => {};
const embeddedSnapshot = () => window.self !== window.top;
export function ApexDemoShell({ children }: { children: ReactNode }) {
  const state = useDemoJourney();
  const path = usePathname();
  const router = useRouter();
  const embedded = useSyncExternalStore(noSubscribe, embeddedSnapshot, () => false);
  const hub = path?.startsWith(DEMO_HOME);
  if (embedded) return <>{children}</>;
  const hasProgress = Object.values(state.status).some(value => value !== 'untried');
  return <div className={`ag-root ${state.active && !hub ? 'ag-tour-active' : ''}`}>
    <header className="ag-demo-bar">
      <Link className="ag-t3" href={DEMO_HOME} aria-label="T3 Labs demo overview">T3<span>LABS</span></Link>
      <p><strong>Apex Roofing</strong><span> is a fictional example. Imagine your business here.</span></p>
      <div className="ag-bar-actions">
        {state.active && !hub ? <Link href={DEMO_HOME}>Demo overview</Link> : <button type="button" onClick={() => {
          if (hasProgress) { updateJourney({ type: 'resume' }); router.push(getTask(state.current).route); }
          else router.push(DEMO_HOME);
        }}>{hasProgress ? 'Resume demo' : 'Explore the demo'} <span aria-hidden="true">↗</span></button>}
      </div>
    </header>
    <div className={`ag-frame ${state.active && !hub && !state.collapsed ? 'ag-with-guide' : ''}`}>
      {state.active && !hub && <GuidePanel />}
      <div className="ag-site">{children}</div>
    </div>
  </div>;
}
