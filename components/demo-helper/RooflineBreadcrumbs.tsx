import Link from 'next/link';
import './roofline-breadcrumbs.css';

export interface RooflineCrumb { label: string; href?: string }

/** Roofline Canterbury breadcrumbs: root always returns to the roofline demo home. */
export function RooflineBreadcrumbs({ items, className = '' }: { items: readonly RooflineCrumb[]; className?: string }) {
  return <nav className={`rl-breadcrumbs ${className}`} aria-label="Breadcrumb">
    <ol><li><Link href="/demo/roofline-site">Roofline Canterbury</Link></li>
      {items.map((item, index) => <li key={`${item.label}-${index}`}>
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="m6 4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {item.href && index < items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
      </li>)}
    </ol>
  </nav>;
}
