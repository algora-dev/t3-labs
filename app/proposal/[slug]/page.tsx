import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProposalPage } from "@/components/templates/proposal-page";
import { getProposal, proposalSlugs } from "@/sites/proposals";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return proposalSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const proposal = getProposal((await params).slug);
  if (!proposal) return {};
  return {
    title: proposal.seo.title,
    description: proposal.seo.description,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      googleBot: { index: false, follow: false, noimageindex: true },
    },
  };
}

export default async function ProposalRoute({ params }: Props) {
  const proposal = getProposal((await params).slug);
  if (!proposal) notFound();
  return <ProposalPage proposal={proposal} />;
}
