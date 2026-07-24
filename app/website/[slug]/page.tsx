import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProspectSite } from "@/components/templates/prospect-site";
import { getSite, siteSlugs } from "@/sites";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return siteSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = getSite((await params).slug);
  if (!site) return {};
  return {
    title: site.seo.title,
    description: site.seo.description,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
  };
}

export default async function WebsiteRoute({ params }: Props) {
  const site = getSite((await params).slug);
  if (!site) notFound();
  return <ProspectSite site={site} />;
}
