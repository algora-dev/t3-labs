import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { AI_SERVICE_SLUGS } from "@/lib/ai-services";

const BASE_URL = "https://www.t3labs.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  // Keep lastmod only where the underlying content has a trustworthy publication/update date.
  // An always-current timestamp for static pages would inaccurately signal daily changes.
  const posts = getAllPosts();

  const staticRoutes = [
    {
      url: `${BASE_URL}/`,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/solutions`,
      changeFrequency: "monthly" as const,
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/custom-roofing-software`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/free-review`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/custom-software`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/qcp-careers`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/case-studies/quotecore`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/business-audit`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/roofing-business-tools`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/roofing-solutions`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/pricing-calculator`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/service-terms`,
      changeFrequency: "monthly" as const,
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/website-package-terms`,
      changeFrequency: "monthly" as const,
      priority: 0.2,
    },
  ];

  // Existing six answer-first roofing service pages. Custom roofing software is a separate new route.
  const roofingAcquisitionRoutes = [
    "roofing-website-design",
    "roofing-seo",
    "roofing-website-estimators",
    "roofing-quoting-software",
    "roofing-ai-website-assistants",
    "roofing-business-automation",
  ].map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  const serviceRoutes = [
    ...AI_SERVICE_SLUGS.map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${BASE_URL}/ai-help`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  const postRoutes = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...roofingAcquisitionRoutes, ...serviceRoutes, ...postRoutes];
}
