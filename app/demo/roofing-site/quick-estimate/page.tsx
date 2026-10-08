import type { Metadata } from 'next';
import { QuickRoofEstimate } from '../../../../components/quick-estimate/QuickRoofEstimate';
import { getApexQuickPricing } from '../../../../lib/quick-estimate/server';
import './quick-estimate.css';

export const metadata: Metadata = {
  title: { absolute: 'Quick Roof Estimate | Apex Roofing Demo' },
  description: 'Choose a roof shape, approximate size and pitch. Explore a transparent, indicative roof estimate without measurements or sign-up.',
  robots: { index: false, follow: false },
};
export default function QuickEstimatePage() {
  const { catalog, profile } = getApexQuickPricing();
  return <QuickRoofEstimate catalog={catalog} profile={profile} />;
}
