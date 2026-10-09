import { redirect } from 'next/navigation';
export const metadata = { robots: { index: false, follow: false } };
export default function WalkthroughSummaryPage() { redirect('/demo/roofing-site?demo=recap'); }
