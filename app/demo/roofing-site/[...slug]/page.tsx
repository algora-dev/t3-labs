import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { APEX_PAGES, findApexPage } from '@/components/demo-sites/apex-pages/apex-page-content';
import { ApexContentPage } from '@/components/demo-sites/apex-pages/ApexContentPage';

/**
 * Catch-all content route for the Apex Roofing demo pages (V4 brief section 19).
 * Static siblings like /price-list and /takeoff take precedence over this route.
 */

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams() {
  return APEX_PAGES.map((page) => ({ slug: page.slug.split('/') }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = findApexPage(slug ?? []);
  if (!page) return { title: 'Page not found | Apex Roofing' };
  return {
    title: `${page.title} | Apex Roofing`,
    description: page.metaDescription,
    robots: { index: false, follow: false },
  };
}

export default async function ApexDemoContentRoute({ params }: PageProps) {
  const { slug } = await params;
  const page = findApexPage(slug ?? []);
  if (!page) notFound();
  return <ApexContentPage page={page} />;
}
