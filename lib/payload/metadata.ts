import "server-only";

import type { Metadata } from "next";
import { getPage, getSiteSettings } from "./client";

export async function getSiteMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: settings.defaultSEO.title || settings.businessName,
    description: settings.defaultSEO.description || undefined,
  };
}

export async function getPageMetadata(slug: string): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPage(slug), getSiteSettings()]);
  const title = page.seo?.title || settings.defaultSEO.title || page.title;
  const description = page.seo?.description || settings.defaultSEO.description || undefined;

  return {
    title,
    description,
  };
}
