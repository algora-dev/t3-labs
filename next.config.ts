import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/proposal-assets/:path*",
        destination: "/assets/:path*",
      },
    ];
  },
};

export default nextConfig;
