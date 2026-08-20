import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProspectSite } from "@/components/templates/prospect-site";
import { GrowthProposalPage } from "@/components/templates/growth-proposal-page";
import { getAnySite, getGrowthSite, getSite, siteSlugs } from "@/sites";
import { validateProposalForProduction } from "@/sites/types";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() { return siteSlugs.map((slug) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = getAnySite((await params).slug);
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

export default async function ProspectPage({ params }: Props) {
  const slug = (await params).slug;
  const growth = getGrowthSite(slug);
  if (growth) {
    return <GrowthProposalPage proposal={growth} />;
  }
  const site = getSite(slug);
  if (!site) notFound();
  validateProposalForProduction(site);
  return <ProspectSite site={site} />;
}
