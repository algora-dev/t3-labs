import Link from 'next/link';
import { ApexBreadcrumbs } from './ApexBreadcrumbs';
import type { ReactNode } from 'react';
import './tools.css';
export function ApexToolHeader({ title, children, section = 'tool' }: { title: string; children?: ReactNode; section?: 'tool' | 'chooser' | 'admin' }) {
  return <header className="at-header">
    <div className="at-header-inner"><Link className="at-brand" href="/demo/roofing-site" aria-label="Apex Roofing home">
      {/* Use the existing Apex asset, not a second demonstration brand. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/demo-act-roofing/ApexLogoBlack---ae397798-5fc2-4f9a-9c88-5c1e394f7e69.png" width="45" height="45" alt="" />
      <span>Apex<span> Roofing</span></span></Link>
      <nav aria-label="Apex roof tools"><Link href="/demo/roofing-site">Apex home</Link><Link href="/demo/roofing-site/estimate">All roof tools</Link>{children}</nav>
    </div><ApexBreadcrumbs items={section === 'chooser' ? [{ label: 'Roof tools' }] : section === 'admin' ? [{ label: 'Business controls' }] : [{ label: 'Roof tools', href: '/demo/roofing-site/estimate' }, { label: title }]} />
  </header>;
}
