import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

/* eslint-disable @next/next/no-page-custom-font -- This is the existing T3 Labs Inter source. */

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "T3 Labs | Custom Software, AI & Growth Solutions",
    template: "%s | T3 Labs",
  },
  description:
    "Technology built around your business. T3 Labs creates custom software, practical AI integrations, and growth solutions for real business problems.",
  keywords: [
    "T3 Labs",
    "product studio",
    "custom software development",
    "software development",
    "automation",
    "AI",
    "custom software",
    "business solutions",
    "lead generation software",
    "workflow automation",
    "internal tools",
    "CRM systems",
    "API integration",
    "SEO tools",
    "QuoteCore+",
    "business audit",
    "T3 Play",
  ],
  authors: [{ name: "T3 Labs" }],
  creator: "T3 Labs",
  publisher: "T3 Labs",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: BASE_URL,
    siteName: "T3 Labs",
    title: "T3 Labs | Custom Software, AI & Growth Solutions",
    description:
      "Technology built around your business. Custom software, practical AI integrations, and growth solutions designed around real business problems.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "T3 Labs - Product Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "T3 Labs | Custom Software, AI & Growth Solutions",
    description:
      "Technology built around your business. Custom software, practical AI integrations, and growth solutions designed around real business problems.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/assets/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/assets/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/assets/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "T3 Labs",
  url: BASE_URL,
  description:
    "T3 Labs builds custom software, practical AI integrations, and growth solutions around real business problems.",
  foundingDate: "2025",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Christchurch",
    addressCountry: "NZ",
  },
  parentOrganization: {
    "@type": "Organization",
    name: "T3 Play Limited",
  },
  sameAs: ["https://github.com/algora-dev"],
  knowsAbout: [
    "Software Development",
    "Automation",
    "Artificial Intelligence",
    "Business Growth Solutions",
    "Game Technology",
    "Product Systems",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "T3 Labs",
  url: BASE_URL,
  description:
    "Technology built around your business through custom software, AI integrations, and growth solutions.",
  publisher: {
    "@type": "Organization",
    name: "T3 Labs",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Custom Software Solutions",
  serviceType: "Custom Software Development",
  provider: {
    "@type": "Organization",
    name: "T3 Labs",
    url: BASE_URL,
  },
  description:
    "T3 Labs builds tailored software solutions including lead generation tools, workflow automation, internal tools, CRM systems, dashboards, API integrations, and SEO platforms.",
  areaServed: "Worldwide",
  offers: {
    "@type": "Offer",
    description: "Custom software development - contact for pricing",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      </head>
      <body>{children}<Analytics /></body>
    </html>
  );
}
