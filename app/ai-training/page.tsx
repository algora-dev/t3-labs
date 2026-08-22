import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/ai-services";
import ServicePage from "@/components/ai-services/service-page";
import IntakeModalMount from "@/components/intake/intake-modal-mount";

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  title: "Practical AI Training for Businesses | T3 Labs UK",
  description:
    "Practical AI training for UK business teams. We train around the work your people actually do — prompts, checking output, safe use of company data and repeatable workflows.",
  alternates: { canonical: `${BASE_URL}/ai-training` },
  openGraph: {
    title: "Practical AI Training for Businesses | T3 Labs UK",
    description:
      "Practical AI training for UK business teams. We train around the work your people actually do — prompts, checking output, safe use of company data and repeatable workflows.",
    url: `${BASE_URL}/ai-training`,
    siteName: "T3 Labs",
    type: "website",
  },
};

export default function Page() {
  const data = getServiceBySlug("ai-training");
  if (!data) notFound();
  return (
    <>
      <ServicePage data={data} />
      <IntakeModalMount />
    </>
  );
}
