import type { MetadataRoute } from "next";
import { absoluteUrl, isProductionDeployment } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  const allowIndexing = isProductionDeployment();

  return {
    rules: allowIndexing
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
