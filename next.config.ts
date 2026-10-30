import type { NextConfig } from "next";
import { isProductionDeployment } from "./lib/seo/config";

const nextConfig: NextConfig = {
  experimental: {
    // Same-origin is the default. Do not add allowedOrigins for this form.
    serverActions: {
      bodySizeLimit: "32kb",
    },
  },
  async headers() {
    if (isProductionDeployment()) return [];

    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.gmfb.co.nz",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
