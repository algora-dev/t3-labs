import Link from 'next/link';
import { ApexIcon } from './ApexIcon';
import './roofline-tools.css';

/** Roofline Canterbury pricing entry points. Organised by customer outcome, not software module. */

const QUICK_HOME = '/demo/roofline-site/quick-estimate';
const DETAIL_HOME = '/supplier-pricing-tool/roofline-roofing';
const PLAN_HOME = `${DETAIL_HOME}?entry=plan`;

export function ToolIcon({ kind }: { kind: 'quick' | 'detail' | 'plan' }) {
  return <ApexIcon name={kind} />;
}

const choices = [
  {
    kind: 'quick' as const,
    title: 'Planning a roofing project?',
    name: 'Instant homeowner estimate',
    body: 'Choose a roof shape and a few simple details, or enter exact area and pitch if you know them. Get a useful indicative NZD range without needing to call first.',
    href: QUICK_HOME,
    cta: 'Get an instant estimate',
    tag: 'FOR HOMEOWNERS',
  },
  {
    kind: 'detail' as const,
    title: 'Pricing a job for a customer?',
    name: 'Roofer & builder job pricing',
    body: 'Enter site measurements, choose Roofline products and build an itemised material and installation estimate. Logged-in trade customers can use their configured rates.',
    href: `${DETAIL_HOME}?entry=measurements`,
    cta: 'Price a job',
    tag: 'FOR ROOFERS & BUILDERS',
  },
];

export function RoofToolChoices({ compact = false }: { compact?: boolean }) {
  return <>
    <div className={`at-choices ${compact ? 'at-compact' : ''}`}>{choices.map(choice => <Link className={`at-choice ${choice.kind === 'quick' ? 'at-recommended' : ''}`} href={choice.href} key={choice.kind}>
      <span className="at-choice-icon"><ToolIcon kind={choice.kind} /></span><div className="at-choice-copy"><p className="at-tag">{choice.tag}</p><h2>{choice.title}</h2><p>{choice.body}</p><span className="at-choice-cta">{choice.cta} <span aria-hidden="true">→</span></span></div>
    </Link>)}</div>
    {!compact && <Link href={PLAN_HOME} className="at-plan-option"><span className="at-plan-option-icon"><ToolIcon kind="plan" /></span><span><b>Working from plans instead?</b> Measure a scaled plan, then carry the quantities straight into Roofline product pricing.</span><span aria-hidden="true">→</span></Link>}
  </>;
}
