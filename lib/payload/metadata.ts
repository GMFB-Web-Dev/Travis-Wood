import "server-only";

import type { Metadata } from "next";
import {
  getFullPageTitle,
  isProductionDeployment,
  publicPages,
  siteConfig,
  absoluteUrl,
  type PublicPageSlug,
} from "@/lib/seo/config";
import { getMedia, getMediaUrl, getPage, getSiteSettings } from "./client";

export async function getSiteMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const favicon = getMediaUrl(settings.favicon);
  const allowIndexing = isProductionDeployment();

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.defaultTitle,
      template: siteConfig.titleTemplate,
    },
    description: siteConfig.defaultDescription,
    applicationName: siteConfig.applicationName,
    alternates: { canonical: absoluteUrl("/") },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: absoluteUrl("/"),
      siteName: siteConfig.name,
      title: siteConfig.defaultTitle,
      description: siteConfig.defaultDescription,
      images: [siteConfig.socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.defaultTitle,
      description: siteConfig.defaultDescription,
      images: [siteConfig.socialImage],
    },
    robots: {
      index: allowIndexing,
      follow: allowIndexing,
      googleBot: {
        index: allowIndexing,
        follow: allowIndexing,
        "max-image-preview": allowIndexing ? "large" : "none",
        "max-snippet": allowIndexing ? -1 : 0,
        "max-video-preview": allowIndexing ? -1 : 0,
      },
    },
    icons: favicon ? { icon: [{ url: favicon }] } : undefined,
  };
}

export async function getPageMetadata(slug: PublicPageSlug): Promise<Metadata> {
  const page = await getPage(slug);
  const pageConfig = publicPages[slug];
  const canonical = absoluteUrl(pageConfig.path);
  const fullTitle = getFullPageTitle(slug);
  const media = getMedia(page.featuredImage);
  const heroImage = media?.sizes?.hero;
  const featuredImage = getMediaUrl(page.featuredImage, "hero");
  const image = featuredImage
    ? {
        url: featuredImage,
        width: heroImage?.width || media?.width || undefined,
        height: heroImage?.height || media?.height || undefined,
        alt: pageConfig.featureImage.alt,
      }
    : siteConfig.socialImage;

  return {
    title: { absolute: pageConfig.title },
    description: pageConfig.description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      siteName: siteConfig.name,
      title: fullTitle,
      description: pageConfig.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: pageConfig.description,
      images: [image],
    },
  };
}
