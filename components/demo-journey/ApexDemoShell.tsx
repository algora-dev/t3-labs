'use client';
import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { DemoHelper } from '../demo-helper/DemoHelper';
import { updateHelper, revealHelper } from '../../lib/demo-helper/store';
import { isAssistantWebsiteFrame, subscribeFrame } from '../../lib/demo-helper/embed';
import '../demo-helper/helper.css';
/** The site is never framed or resized. The helper is a separate floating companion. */
export function ApexDemoShell({ children }: { children: ReactNode }) {
  const embedded = useSyncExternalStore(subscribeFrame, isAssistantWebsiteFrame, () => false);
  useEffect(() => {
    if (embedded) return;
    // Old summary links now open a recap over the real website.
    if (new URLSearchParams(window.location.search).get('demo') === 'recap') updateHelper({ type: 'finish' });
  }, [embedded]);
  if (embedded) return <>{children}</>;
  return <>
    <div className="dh-demo-strip"><span><b>Apex Roofing</b> · Example website <span className="dh-strip-detail">by T3 Labs. Imagine your business here.</span></span><button type="button" onClick={revealHelper}>Open demo helper ↗</button></div>
    {children}
    <DemoHelper />
  </>;
}
