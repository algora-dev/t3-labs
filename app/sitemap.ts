import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { AI_SERVICE_SLUGS } from "@/lib/ai-services";

const BASE_URL = "https://www.t3labs.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const posts = getAllPosts();

  const staticRoutes = [
    {
      url: `${BASE_URL}/`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/custom-software`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/careers`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/case-studies/quotecore`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/business-audit`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/service-terms`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/website-package-terms`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.2,
    },
  ];

  const serviceRoutes = [
    ...AI_SERVICE_SLUGS.map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${BASE_URL}/ai-help`,
      lastModified,
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

  return [...staticRoutes, ...serviceRoutes, ...postRoutes];
}
