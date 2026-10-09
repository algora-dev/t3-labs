import Link from 'next/link';
import { ApexToolHeader } from '../../../../components/demo-helper/ApexToolHeader';
import { RoofToolChoices } from '../../../../components/demo-helper/RoofToolChoices';
export const metadata = { title: 'Free roof estimate tools | Apex Roofing' };
export default function EstimateChoicePage() {
  return <><ApexToolHeader title="Free roof estimate tools" section="chooser"/><main className="at-choice-page"><div className="at-choice-inner">
    <div className="at-choice-intro"><p>THREE WAYS TO GET STARTED</p><h1>Let’s find the easiest way<br />to price your roof.</h1><p>No measurements? Start with a quick estimate. Have more detail? Choose a tool that can use it. You can explore all three without following the demo guide.</p></div>
    <RoofToolChoices />
    <p className="at-choice-note"><b>The same idea, at the right level of detail.</b> The advanced tools are straightforward for people familiar with roofing. Contractors or your own team can prepare itemised estimates and customer quote outputs using configured product prices. Public ranges, baseline rates and private trade prices can be tailored to the business. Final measurements and scope need checking.</p>
    <Link href="/demo/roofing-site" className="at-back-link">← Back to Apex Roofing</Link>
  </div></main></>;
}
