import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/proposal/", "/business-audit/api/", "/dashboard", "/api/", "/sales-resources"],
      },
    ],
    sitemap: "https://www.t3labs.tech/sitemap.xml",
  };
}
