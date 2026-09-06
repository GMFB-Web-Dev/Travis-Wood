import type { MetadataRoute } from "next";
import { getPublishedSitemapPages } from "@/lib/payload/client";
import {
  absoluteUrl,
  publicPages,
  type PublicPageSlug,
} from "@/lib/seo/config";

export const revalidate = 3600;

function isPublicPageSlug(slug: string): slug is PublicPageSlug {
  return Object.hasOwn(publicPages, slug);
}

function isSafeCanonicalPath(path: string) {
  return (
    path === path.trim() &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !/[?#\u0000-\u001f\u007f]/.test(path)
  );
}

function getLastModified(value: string | undefined) {
  if (!value) return undefined;

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? undefined : new Date(timestamp);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getPublishedSitemapPages();

  return pages.flatMap((page) => {
    if (!isPublicPageSlug(page.slug)) return [];

    const configuredPage = publicPages[page.slug];
    if (
      page.path !== configuredPage.path ||
      !isSafeCanonicalPath(page.path)
    ) {
      return [];
    }

    return [
      {
        url: absoluteUrl(page.path),
        lastModified: getLastModified(page.updatedAt),
      },
    ];
  });
}
