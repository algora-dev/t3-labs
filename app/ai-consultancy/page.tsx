import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug } from "@/lib/ai-services";
import ServicePage from "@/components/ai-services/service-page";
import IntakeModalMount from "@/components/intake/intake-modal-mount";

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  title: "AI Consultancy for UK Businesses",
  description:
    "Practical AI consultancy for UK small and mid-sized businesses. We identify where AI genuinely fits, what should stay human, and what's worth implementing. No technical brief needed.",
  alternates: { canonical: `${BASE_URL}/ai-consultancy` },
  openGraph: {
    title: "AI Consultancy for UK Businesses | T3 Labs",
    description:
      "Practical AI consultancy for UK small and mid-sized businesses. We identify where AI genuinely fits, what should stay human, and what's worth implementing.",
    url: `${BASE_URL}/ai-consultancy`,
    siteName: "T3 Labs",
    type: "website",
  },
};

export default function Page() {
  const data = getServiceBySlug("ai-consultancy");
  if (!data) notFound();
  return (
    <>
      <ServicePage data={data} />
      <IntakeModalMount />
    </>
  );
}
