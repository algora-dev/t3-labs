import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // noindex pages must be crawlable for Google to see the directive.
        // Private proposals require authentication in the complete production app.
        disallow: ["/business-audit/api/", "/dashboard", "/api/"],
      },
    ],
    sitemap: "https://www.t3labs.tech/sitemap.xml",
  };
}
