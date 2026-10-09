import Link from 'next/link';
import './breadcrumbs.css';
export interface ApexCrumb { label: string; href?: string }
export function ApexBreadcrumbs({ items, className = '' }: { items: readonly ApexCrumb[]; className?: string }) {
  return <nav className={`apex-breadcrumbs ${className}`} aria-label="Breadcrumb">
    <ol><li><Link href="/demo/roofing-site">Apex Roofing</Link></li>
      {items.map((item, index) => <li key={`${item.label}-${index}`}>
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="m6 4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {item.href && index < items.length - 1 ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
      </li>)}
    </ol>
  </nav>;
}
