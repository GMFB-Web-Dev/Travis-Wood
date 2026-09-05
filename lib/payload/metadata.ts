import "server-only";

import type { Metadata } from "next";
import { getMediaUrl, getPage, getSiteSettings } from "./client";

export async function getSiteMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const favicon = getMediaUrl(settings.favicon);

  return {
    title: settings.defaultSEO.title || settings.businessName,
    description: settings.defaultSEO.description || undefined,
    icons: favicon ? { icon: [{ url: favicon }] } : undefined,
  };
}

export async function getPageMetadata(slug: string): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage(slug), getSiteSettings()]);
  const title = page.seo?.title || settings.defaultSEO.title || page.title;
  const description = page.seo?.description || settings.defaultSEO.description || undefined;
  const featuredImage = getMediaUrl(page.featuredImage, "hero");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: featuredImage ? [{ url: featuredImage }] : [],
    },
    twitter: {
      card: featuredImage ? "summary_large_image" : "summary",
      title,
      description,
      images: featuredImage ? [featuredImage] : [],
    },
  };
}
