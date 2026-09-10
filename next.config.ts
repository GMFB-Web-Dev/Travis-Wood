import type { NextConfig } from "next";
import { isProductionDeployment } from "./lib/seo/config";

const nextConfig: NextConfig = {
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
        hostname: "payload.gmfb.co.nz",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
