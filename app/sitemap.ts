import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { FEATURED_ROOFING_GUIDES } from "@/lib/roofing-content";
import { CANONICAL_ORIGIN, ROOFING_SERVICE_SLUGS } from "@/lib/roofing-service-seo";

/**
 * Intentional, curated sitemap of priority public search pages only.
 * Removing an URL from the sitemap does NOT delete it or apply noindex.
 * Legacy pages are retired by exact redirects or 404, while direct-link
 * campaign and referral experiences remain live but intentionally noindex.
 * The full route policy is documented in docs/FINAL-URL-REGISTER.csv.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const primaryPaths = [
    "", "solutions", ...ROOFING_SERVICE_SLUGS, "custom-roofing-software",
    "case-studies/quotecore", "blog", "free-review", "contact",
  ] as const;
  const main = primaryPaths.map(path => ({
    url: `${CANONICAL_ORIGIN}/${path}`,
  }));
  const featuredSet = new Set<string>(FEATURED_ROOFING_GUIDES);
  const posts = getAllPosts()
    .filter(post => featuredSet.has(post.slug))
    .map(post => ({
      url: `${CANONICAL_ORIGIN}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.date),
    }));
  return [...main, ...posts];
}
