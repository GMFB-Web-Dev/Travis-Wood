import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
