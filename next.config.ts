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
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
