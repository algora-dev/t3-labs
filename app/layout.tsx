import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { LegacyAssistantGate } from "@/components/t3-rebuild/LegacyAssistantGate";
import GaConsentSync from "@/components/ga/GaConsentSync";
import "./globals.css";

/* eslint-disable @next/next/no-page-custom-font -- This is the existing T3 Labs Inter source. */

const BASE_URL = "https://www.t3labs.tech";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "T3 Labs | Better Roofing Leads, Faster Quotes & Less Admin",
    template: "%s | T3 Labs",
  },
  description:
    "T3 Labs helps roofing businesses get better enquiries, convert more website visitors, quote faster and reduce admin with practical websites, estimating tools and automation.",
  keywords: [
    "T3 Labs",
    "roofing websites",
    "roofing SEO",
    "roofing lead generation",
    "roofing website estimators",
    "roofing quoting software",
    "roofing business automation",
    "custom roofing software",
    "roofing website assistants",
    "QuoteCore+",
  ],
  authors: [{ name: "T3 Labs" }],
  creator: "T3 Labs",
  publisher: "T3 Labs",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: BASE_URL,
    siteName: "T3 Labs",
    title: "T3 Labs | Better Roofing Leads, Faster Quotes & Less Admin",
    description:
      "Practical websites, roofing estimators, quoting tools and automation to attract better enquiries and win more of the right jobs.",
    images: [
      {
        url: "/og-roofing.png",
        width: 1200,
        height: 630,
        alt: "T3 Labs - Roofing websites, quoting and automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "T3 Labs | Better Roofing Leads, Faster Quotes & Less Admin",
    description:
      "Practical websites, roofing estimators, quoting tools and automation to attract better enquiries and win more of the right jobs.",
    images: ["/og-roofing.png"],
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
    "T3 Labs helps roofing and construction businesses attract relevant leads, improve website enquiries, quote jobs and reduce repetitive administration with practical software and digital tools.",
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
    "Roofing website design",
    "Roofing SEO and qualified enquiries",
    "Roofing website estimators",
    "Roofing measurement and quoting software",
    "Roofing business workflow automation",
    "Custom roofing software",
  ],};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "T3 Labs",
  url: BASE_URL,
  description:
    "Websites, estimating tools, roofing quoting software and automation to help roofing businesses attract better enquiries and spend less time on admin.",
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
        {/* Google Consent Mode v2 defaults. Must run before the Google tag loads.
            Analytics follows the site's existing cookie consent choice (see GaConsentSync
            and the business-audit CookieBanner). Marketing signals stay denied by default
            until a site-wide consent UI exists. */}
        <Script
          id="ga4-consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});`,
          }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <LegacyAssistantGate />
        {/* GA4 web data stream for t3labs.tech (Enhanced Measurement on, SPA page views handled) */}
        <GoogleAnalytics gaId="G-0QKZ301HPQ" />
        <GaConsentSync />
        <Script
          id="ms-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "ympx925a97");`,
          }}
        />
      </body>
    </html>
  );
}
