import Link from 'next/link';
import { ApexIcon } from './ApexIcon';
import './roofline-tools.css';

/** Roofline Canterbury variant of the roof tool chooser. Same cards, roofline paths. */

const QUICK_HOME = '/demo/roofline-site/quick-estimate';
const DETAIL_HOME = '/supplier-pricing-tool/roofline-roofing';
const PLAN_HOME = `${DETAIL_HOME}?entry=plan`;

export function ToolIcon({ kind }: { kind: 'quick' | 'detail' | 'plan' }) {
  return <ApexIcon name={kind} />;
}

const choices = [
  { kind: 'quick' as const, title: "I don't have measurements", name: 'Quick Roof Estimate', body: 'Pick a roof shape and a few simple details. Get a useful ballpark range without measuring anything.', href: QUICK_HOME, cta: 'Get a quick estimate', tag: 'EASIEST START' },
  { kind: 'detail' as const, title: 'I have roof measurements', name: 'Detailed Estimator', body: 'Use your dimensions and choose products for an itemised estimate, with a quote output for your own customer.', href: `${DETAIL_HOME}?entry=measurements`, cta: 'Use my measurements', tag: 'MORE DETAIL' },
  { kind: 'plan' as const, title: 'I have a plan or image', name: 'Plan & Image Measure', body: 'Set a known scale on a plan or satellite image, trace the roof, then carry the measurements straight into pricing.', href: PLAN_HOME, cta: 'Measure my plan', tag: 'MEASURE ON SCREEN' },
];

export function RoofToolChoices({ compact = false }: { compact?: boolean }) {
  return <div className={`at-choices ${compact ? 'at-compact' : ''}`}>{choices.map(choice => <Link className={`at-choice ${choice.kind === 'quick' ? 'at-recommended' : ''}`} href={choice.href} key={choice.kind}>
    <span className="at-choice-icon"><ToolIcon kind={choice.kind} /></span><div className="at-choice-copy"><p className="at-tag">{choice.tag}</p><h2>{choice.title}</h2><p>{choice.body}</p><span className="at-choice-cta">{choice.cta} <span aria-hidden="true">→</span></span></div>
  </Link>)}</div>;
}
