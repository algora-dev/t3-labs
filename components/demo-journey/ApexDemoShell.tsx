'use client';
import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APEX_HOME, ESTIMATE_HOME, isAdminPath } from '../../lib/demo-helper/config';
import { DemoHelper } from '../demo-helper/DemoHelper';
import { DemoConversion } from '../demo-conversion/DemoConversion';
import { useConversion } from '../demo-conversion/useConversion';
import { getHelper, updateHelper, revealHelper } from '../../lib/demo-helper/store';
import { isAssistantWebsiteFrame, subscribeFrame } from '../../lib/demo-helper/embed';
import '../demo-helper/helper.css';
/** The site is never framed or resized. The helper is a separate floating companion. */
export function ApexDemoShell({ children }: { children: ReactNode }) {
  const conversion = useConversion();
  const admin = isAdminPath(usePathname());
  const embedded = useSyncExternalStore(subscribeFrame, isAssistantWebsiteFrame, () => false);
  useEffect(() => {
    if (embedded) return;
    // Old summary links now open a recap over the real website.
    if (new URLSearchParams(window.location.search).get('demo') === 'recap') updateHelper({ type: 'finish' });
  }, [embedded]);
  useEffect(() => {
    if (!embedded && !admin && getHelper().current === 'admin') updateHelper({ type: 'return-from-admin' });
  }, [admin, embedded]);
  if (embedded) return <>{children}</>;
  return <>
    <div className="dh-demo-strip"><span><b>Apex Roofing</b> · Example website <span className="dh-strip-detail">by T3 Labs. Imagine your business here.</span></span><button type="button" onClick={revealHelper}>Open demo helper ↗</button></div>
    {admin && <nav className="dh-admin-return" aria-label="Business dashboard navigation">
      <Link href={APEX_HOME} onClick={() => updateHelper({ type: 'return-from-admin' })}>← Back to Apex Roofing</Link>
      <Link href={ESTIMATE_HOME} onClick={() => updateHelper({ type: 'return-from-admin' })}>Roof tools →</Link>
    </nav>}
    {children}
    <DemoConversion />
    <DemoHelper suspended={!conversion.ready || conversion.modal !== null} />
  </>;
}
