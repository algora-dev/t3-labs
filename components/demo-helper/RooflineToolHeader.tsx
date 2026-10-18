import Link from 'next/link';
import { RooflineBreadcrumbs } from './RooflineBreadcrumbs';
import type { ReactNode } from 'react';
import './roofline-tools.css';

/** Roofline Canterbury tool header: branding + tool navigation + breadcrumbs. */

export function RooflineToolHeader({ title, children, section = 'tool' }: { title: string; children?: ReactNode; section?: 'tool' | 'chooser' | 'admin' }) {
  return <header className="at-header">
    <div className="at-header-inner"><Link className="at-brand" href="/demo/roofline-site" aria-label="Roofline Canterbury home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/demo-roofline/branding.png" alt="Roofline Canterbury" className="max-h-9 w-auto object-contain" />
    </Link>
      <nav aria-label="Roofline pricing navigation"><Link href="/demo/roofline-site">Roofline home</Link><Link href="/demo/roofline-site/estimate">Roof pricing</Link>{children}</nav>
    </div><RooflineBreadcrumbs items={section === 'chooser' ? [{ label: 'Roof tools' }] : section === 'admin' ? [{ label: 'Business controls' }] : [{ label: 'Roof tools', href: '/demo/roofline-site/estimate' }, { label: title }]} />
  </header>;
}
