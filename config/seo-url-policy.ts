/**
 * Authoritative public URL lifecycle for the November 2026 roofing-first release.
 *
 * The five redirects below match ONLY the exact old public path. Next.js
 * redirects are checked before filesystem routes and do NOT match /referred.
 * Never replace them with a broad /roofing-solutions/:path* redirect.
 *
 * Changes must also be reflected in docs/FINAL-URL-REGISTER.csv and tests.
 */
export const RETIRED_PERMANENT_REDIRECTS = [
  { source: "/ai-automation", destination: "/roofing-business-automation", permanent: true },
  { source: "/custom-software", destination: "/custom-roofing-software", permanent: true },
  { source: "/our-solution", destination: "/solutions", permanent: true },
  { source: "/roofing-solutions", destination: "/solutions", permanent: true },
  { source: "/roofing-business-tools", destination: "/solutions", permanent: true },
] as const;

/** No close replacement. These four route stubs deliberately return HTTP 404. */
export const RETIRED_NOT_FOUND = [
  "/ai-help",
  "/ai-consultancy",
  "/ai-implementation",
  "/ai-training",
] as const;

/**
 * These are intentional direct-link, administrative, recruiting, campaign and
 * legal experiences, not organic-search landing pages. HTTP X-Robots-Tag
 * covers the standalone HTML campaign and backstops route metadata.
 * A noindex directive is NOT authentication or a confidentiality control.
 */
export const NOINDEX_HEADER_ROUTES = [
  "/pricing-calculator",
  "/pricing-calculator/referred",
  "/business-audit",
  "/business-audit/:path*",
  "/our-solution/referred",
  "/roofing-solutions/referred",
  "/roofing-business-tools/referred",
  "/hello/:path*",
  "/custom-proposal",
  "/proposal/:path*",
  "/sales-hub",
  "/sales-resources",
  "/qcp-careers",
  "/careers",
  "/10-day-business-upgrade",
  "/roofing-upgrade/landing",
  "/roofing-upgrade/landing.html",
  "/dashboard",
  "/dashboard/:path*",
  "/privacy",
  "/cookies",
  "/terms",
  "/service-terms",
  "/website-package-terms",
] as const;
