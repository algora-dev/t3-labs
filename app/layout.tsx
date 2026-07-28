import type { Metadata } from "next";
import "./globals.css";

/* eslint-disable @next/next/no-page-custom-font -- This is the existing T3 Labs Inter source. */

const BASE_URL = "https://t3labs.tech";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "T3 Labs | Product Studio",
    template: "%s | T3 Labs",
  },
  description:
    "T3 Labs builds future-ready solutions for everyday problems. We turn messy workflows, business bottlenecks, and rough ideas into useful products.",
  keywords: [
    "T3 Labs",
    "product studio",
    "software development",
    "automation",
    "AI",
    "custom software",
    "business solutions",
    "QuoteCore+",
    "business audit",
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
    title: "T3 Labs | Product Studio",
    description:
      "We build future-ready solutions for everyday problems. Software, automation, AI, game tech, and product systems.",
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
    title: "T3 Labs | Product Studio",
    description:
      "We build future-ready solutions for everyday problems. Software, automation, AI, game tech, and product systems.",
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
    "T3 Labs builds future-ready solutions for everyday problems. We turn messy workflows, business bottlenecks, and rough ideas into useful products.",
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
  knowsAbout: [
    "Software Development",
    "Automation",
    "Artificial Intelligence",
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
    "T3 Labs builds future-ready solutions for everyday problems.",
  publisher: {
    "@type": "Organization",
    name: "T3 Labs",
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
      </head>
      <body>{children}</body>
    </html>
  );
}
