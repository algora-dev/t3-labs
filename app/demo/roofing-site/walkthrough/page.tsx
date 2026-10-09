import { redirect } from 'next/navigation';
export const metadata = { robots: { index: false, follow: false } };
/** Preserve shared links without retaining a separate demonstration website. */
export default function WalkthroughPage() { redirect('/demo/roofing-site'); }
