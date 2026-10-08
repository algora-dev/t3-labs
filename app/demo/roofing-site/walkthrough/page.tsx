import type { Metadata } from 'next';
import { DemoLanding } from '../../../../components/demo-journey/DemoLanding';
export const metadata: Metadata = {
  title: { absolute: 'Try a Smarter Roofing Website | T3 Labs Demo' },
  description: 'Try the Apex Roofing assistant and three estimating experiences. See what a useful website could do for your customers and your team.',
  robots: { index: false, follow: false },
};
export default function WalkthroughPage() { return <DemoLanding />; }
