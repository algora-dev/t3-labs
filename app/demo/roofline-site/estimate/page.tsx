import Link from 'next/link';
import { RooflineToolHeader } from '../../../../components/demo-helper/RooflineToolHeader';
import { RoofToolChoices } from '../../../../components/demo-helper/RooflineToolChoices';

export const metadata = { title: 'Free roof estimate tools | Roofline Canterbury' };

export default function EstimateChoicePage() {
  return <><RooflineToolHeader title="Free roof estimate tools" section="chooser" /><main className="at-choice-page"><div className="at-choice-inner">
    <div className="at-choice-intro"><p>START WITH WHAT YOU KNOW</p><h1>Get a useful roof price<br />without leaving Roofline.</h1><p>Homeowners can get an indicative range with simple inputs. Roofers and builders can use measured quantities and Roofline products to price a job in more detail.</p></div>
    <RoofToolChoices />
    <p className="at-choice-note"><b>One pricing system, different levels of detail.</b> Public visitors can see a useful indicative range without exposing private trade rates. Logged-in trade customers can use configured pricing, while measured jobs and plans can carry more detail into the final estimate. Final measurements, scope and supplier pricing still need confirmation.</p>
    <Link href="/demo/roofline-site" className="at-back-link">&larr; Back to Roofline Canterbury</Link>
  </div></main></>;
}
