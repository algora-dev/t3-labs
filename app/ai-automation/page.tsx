import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/ai-services";
import ServicePage from "@/components/ai-services/service-page";
import IntakeModalMount from "@/components/intake/intake-modal-mount";

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  title: "AI Automation for UK Businesses",
  description:
    "AI automation for UK businesses. We automate repetitive workflows — enquiries, documents, data entry, reporting, follow-ups — with human review kept where it matters. Tell us what's taking too much time.",
  alternates: { canonical: `${BASE_URL}/ai-automation` },
  openGraph: {
    title: "AI Automation for UK Businesses | T3 Labs",
    description:
      "We automate repetitive workflows — enquiries, documents, data entry, reporting, follow-ups — with human review kept where it matters.",
    url: `${BASE_URL}/ai-automation`,
    siteName: "T3 Labs",
    type: "website",
  },
};

export default function Page() {
  const data = getServiceBySlug("ai-automation");
  if (!data) notFound();
  return (
    <>
      <ServicePage data={data} />
      <IntakeModalMount />
    </>
  );
}
