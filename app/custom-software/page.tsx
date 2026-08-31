import type { Metadata } from "next";
import Link from "next/link";
import ServicePage from "@/components/ai-services/service-page";
import IntakeModalMount from "@/components/intake/intake-modal-mount";
import type { ServicePageData } from "@/lib/ai-services";

const BASE_URL = "https://www.t3labs.tech";

/**
 * Asset 1 — T3 Labs custom software service page.
 * Two-brand custom software strategy (30 Aug 2026), brief §Asset 1.
 * Reuses the shared ServicePage renderer for markup consistency;
 * content lives here because this is not part of the AI services cluster.
 */
const data: ServicePageData = {
  slug: "custom-software",
  eyebrow: "Custom Software · Bespoke Builds · Integrations · Portals",
  title: "Custom Software Development for UK Businesses",
  h1: "Custom Software Built Around the Way Your Business Actually Works",
  intro: [
    "Estimating, pricing, quoting, portals, integrations, workflow systems and specialist business software — designed around the process you already use.",
    "Most businesses don't need a generic app. They need the workflow they already run — the spreadsheet, the rules, the steps people actually follow — turned into software that's fast, consistent and doesn't lose information between systems.",
  ],
  metaDescription:
    "Custom software development for UK businesses. Estimating, pricing, quoting, portals, integrations and workflow systems built around the way your business actually works. Tell us the problem.",
  intent: "Build something custom for my business",
  sections: [
    {
      id: "roofing-proof",
      heading: "Need custom roofing software?",
      body: "T3 Labs built QuoteCore+, a platform covering digital plan takeoff, AI-assisted scanning, reusable pricing logic, quoting, ordering, invoicing and supplier workflows. It's live, in production, and used by roofing contractors — proof that we can take a complex real-world trade workflow and turn it into working software. Read the full story: How We Built QuoteCore+.",
    },
    {
      id: "what-we-build",
      heading: "What we build",
      body: "The common thread is rules: measurement rules, pricing rules, workflow rules. If your team relies on spreadsheets, calculators, price books and manual steps to work out what something should cost or what should happen next, that logic can become software. Typical projects include:",
      bullets: [
        "Estimating and takeoff systems",
        "Pricing and quoting engines",
        "Customer and supplier portals",
        "Internal workflow and operations tools",
        "Integrations between systems that don't talk to each other",
        "Specialist business software for measured trades and manufacturing",
      ],
    },
    {
      id: "beyond-roofing",
      heading: "Roofing is proof, not the limit",
      body: "QuoteCore+ demonstrates we can model a complex trade — measurements, pitch, materials, labour, waste, suppliers — into a structured product. The same principles apply to fabrication pricing, cladding, flooring, service quoting, wholesale price books, or any business where the answer to “what does this cost?” lives in someone's head or a spreadsheet. We build for the process you have, not a template.",
    },
    {
      id: "how-we-work",
      heading: "How we work",
      body: "You don't need a technical brief. Send us your current workflow — spreadsheet, screenshots, process notes or a short video — and we'll help determine whether you need an existing configurable platform, an integration, or a genuine custom build. If off-the-shelf software solves 80% of your problem, we'll say so. Then we scope, build in working increments you can actually use, and hand over something your team runs.",
    },
  ],
  ctaHeadline: "Tell us the problem",
  ctaBody:
    "Send us your current workflow, spreadsheet, screenshots, process notes or a Loom. We'll help determine whether you need an existing configurable platform, an integration, or a genuine custom build.",
  ctaButtonText: "Tell us the problem",
  problemCategory: "custom-software",
  related: [
    { href: "/blog/custom-roofing-software", label: "Custom Roofing Software Guide" },
    { href: "/case-studies/quotecore", label: "QuoteCore+ Case Study" },
    { href: "/ai-implementation", label: "AI Implementation" },
  ],
  relatedHeading: "Proof and guides",
  faqs: [
    {
      q: "How much does custom software cost?",
      a: "It depends on scope, integrations and team structure — which is why we don't publish invented price bands. We scope each project from your actual workflow, then quote. For context on UK market ranges and why quotes vary so much, read our guide to custom software development costs.",
    },
    {
      q: "Do we need custom software, or will existing software do?",
      a: "That's the first question we answer — before any build. If a configurable platform solves most of your requirement, we'll tell you (for roofing estimating, that's often QuoteCore+). Custom development makes sense for unique integrations, portals, proprietary workflows, or software you need to own.",
    },
    {
      q: "Can you integrate custom software with systems we already use?",
      a: "Usually, yes. Integrations — CRMs, accounting systems, job-management tools, spreadsheets — are a core part of custom build work. If a system doesn't expose the access we need, we'll tell you honestly before anything is quoted.",
    },
    {
      q: "Do you work with businesses outside roofing?",
      a: "Yes. Roofing is our deepest domain because of QuoteCore+, but the underlying work — rules-based estimating, pricing logic, portals and workflow systems — applies across construction trades, manufacturing, fabrication, wholesale and service businesses.",
    },
  ],
};

export const metadata: Metadata = {
  title: "Custom Software Development for UK Businesses | T3 Labs",
  description:
    "Custom software development for UK businesses. Estimating, pricing, quoting, portals, integrations and workflow systems built around the way your business actually works.",
  alternates: { canonical: `${BASE_URL}/custom-software` },
  openGraph: {
    title: "Custom Software Development for UK Businesses | T3 Labs",
    description:
      "Estimating, pricing, quoting, portals, integrations and workflow systems built around the way your business actually works.",
    url: `${BASE_URL}/custom-software`,
    siteName: "T3 Labs",
    type: "website",
  },
};

export default function Page() {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Custom Software Development",
    description:
      "Custom estimating, pricing, quoting, portal, integration and workflow software built around the way your business actually works.",
    provider: {
      "@type": "Organization",
      name: "T3 Labs",
      url: BASE_URL,
    },
    areaServed: "GB",
    serviceType: "Custom software development",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Custom Software",
        item: `${BASE_URL}/custom-software`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ServicePage data={data} />
      <IntakeModalMount />
    </>
  );
}
