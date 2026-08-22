import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/ai-services";
import ServicePage from "@/components/ai-services/service-page";
import IntakeModalMount from "@/components/intake/intake-modal-mount";

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  title: "AI Implementation Services UK",
  description:
    "AI implementation services for UK businesses. We turn AI recommendations into working systems — integrations, APIs, data, workflow design, testing, deployment and handover. Tell us what you're trying to build.",
  alternates: { canonical: `${BASE_URL}/ai-implementation` },
  openGraph: {
    title: "AI Implementation Services UK | T3 Labs",
    description:
      "We turn AI recommendations into working systems — integrations, APIs, data, workflow design, testing, deployment and handover.",
    url: `${BASE_URL}/ai-implementation`,
    siteName: "T3 Labs",
    type: "website",
  },
};

export default function Page() {
  const data = getServiceBySlug("ai-implementation");
  if (!data) notFound();
  return (
    <>
      <ServicePage data={data} />
      <IntakeModalMount />
    </>
  );
}
