import type { Metadata } from 'next';
import { DemoSummary } from '../../../../../components/demo-journey/DemoSummary';
export const metadata: Metadata = {
  title: { absolute: 'What Could This Do for Your Business? | T3 Labs Demo' },
  robots: { index: false, follow: false },
};
export default function DemoSummaryPage() { return <DemoSummary />; }
