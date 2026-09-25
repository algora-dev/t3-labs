import path from "node:path";
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  async rewrites() {
    return [
      {
        source: "/proposal-assets/:path*",
        destination: "/assets/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/demo-sites/act-roofing-ltd",
        destination: "/demo/roofing-site",
        permanent: true,
      },
      {
        source: "/demo-sites/act-roofing-ltd/:path*",
        destination: "/demo/roofing-site/:path*",
        permanent: true,
      },
      // Retired proposal pages and demo micro-sites (2026-09-25)
      ...[
        "/proposal/3a-roofing-wp-000207",
        "/proposal/act-roofing-ltd",
        "/proposal/aspire-membranes-wp-000206",
        "/proposal/atkinson-building-services-wp-000208",
        "/proposal/blenheim-roofing-wp-000209",
        "/proposal/falcon-contracting-wp-000205",
        "/proposal/nzav",
        "/proposal/proposal-template-wp-000000",
        "/proposal/short-proposal-template-wp-000000",
        "/3a-roofing",
        "/3a-roofing/:path*",
        "/falcon-contracting",
      ].map((source) => ({ source, destination: "/", permanent: true })),
      {
        source: "/contractor-template-premium/services",
        destination: "/contractor-template-premium",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
