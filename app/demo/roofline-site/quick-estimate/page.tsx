import type { Metadata } from 'next';
import { QuickRoofEstimate } from '../../../../components/quick-estimate-roofline/QuickRoofEstimate';
import { getRooflineQuickPricing } from '../../../../lib/quick-estimate/server';
import './quick-estimate.css';

export const metadata: Metadata = {
  title: { absolute: 'Quick Roof Estimate | Roofline Canterbury Demo' },
  description: 'Choose a roof shape, approximate size and pitch. Explore a transparent, indicative roof estimate without measurements or sign-up.',
  robots: { index: false, follow: false },
};

export default async function QuickEstimatePage() {
  const { catalog, profile } = await getRooflineQuickPricing();
  return <QuickRoofEstimate catalog={catalog} profile={profile} />;
}
