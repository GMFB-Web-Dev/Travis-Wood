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
        hostname: "s3.vyomeshj.com",
        pathname: "/payload-media/**",
      },
      {
        protocol: "https",
        hostname: "media.vyomeshj.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
