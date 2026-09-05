import type { MetadataRoute } from "next";
import { absoluteUrl, publicPages } from "@/lib/seo/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(publicPages).map((page) => ({
    url: absoluteUrl(page.path),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
