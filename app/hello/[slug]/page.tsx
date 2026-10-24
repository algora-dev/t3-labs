import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OutreachLandingPage } from "@/components/outreach/outreach-landing-page";
import { getOutreachPage } from "@/lib/outreach/config";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getOutreachPage(slug);

  if (!page) {
    return {
      title: "Page not found | T3 Labs",
      robots: { index: false, follow: false },
    };
  }

  const title = page.businessName
    ? `A quick video for ${page.businessName} | T3 Labs`
    : "A quick video from T3 Labs";

  return {
    title,
    description: "A short private introduction from T3 Labs.",
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function OutreachPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getOutreachPage(slug);

  if (!page) notFound();

  return <OutreachLandingPage page={page} />;
}
