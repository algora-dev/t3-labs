import type { MetadataRoute } from "next";

const BASE_URL = "https://t3labs.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/business-audit`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/service-terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/website-package-terms`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.2,
    },
  ];
}
