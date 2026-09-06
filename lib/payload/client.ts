import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import type {
  BlockOf,
  CmsPage,
  Media,
  MediaRelation,
  MediaSize,
  Navigation,
  PageBlockType,
  SiteSettings,
} from "./types";
import { isCmsPage, isMedia, isNavigation, isSiteSettings, parseListResponse } from "./validation";

export const TENANT_SLUG = "travis-wood-builder";
export const PAYLOAD_REVALIDATE_SECONDS = 3600;

export const CACHE_TAGS = {
  tenant: `tenant:${TENANT_SLUG}`,
  shared: `tenant:${TENANT_SLUG}:shared`,
  sitemap: `tenant:${TENANT_SLUG}:sitemap`,
  page: (slug: string) => `tenant:${TENANT_SLUG}:page:${slug}`,
} as const;

const DEFAULT_PAYLOAD_URL = "https://payload.vyomeshj.com";

type QueryValue = string | number | boolean;

function getPayloadBaseUrl() {
  return (process.env.PAYLOAD_URL || DEFAULT_PAYLOAD_URL).replace(/\/$/, "");
}

export function buildPayloadUrl(collection: string, query: Record<string, QueryValue>) {
  const url = new URL(`/api/${collection}`, getPayloadBaseUrl());

  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, String(value));
  }

  return url;
}

async function requestPayload(url: URL, init?: RequestInit): Promise<unknown> {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Payload request to ${url.pathname} failed with ${response.status} ${response.statusText}.`,
    );
  }

  try {
    return (await response.json()) as unknown;
  } catch {
    throw new Error(`Payload request to ${url.pathname} returned invalid JSON.`);
  }
}

async function fetchPublishedPage(slug: string): Promise<CmsPage> {
  const url = buildPayloadUrl("pages", {
    "where[tenant.slug][equals]": TENANT_SLUG,
    "where[slug][equals]": slug,
    "where[_status][equals]": "published",
    depth: 3,
    limit: 1,
  });
  const response = parseListResponse(await requestPayload(url), isCmsPage, "pages");
  const page = response.docs[0];

  if (!page) {
    throw new Error(`No published Payload page was found for slug "${slug}" and tenant "${TENANT_SLUG}".`);
  }

  return page;
}

function getPersistentlyCachedPage(slug: string) {
  return unstable_cache(
    () => fetchPublishedPage(slug),
    [TENANT_SLUG, "published-page", slug],
    {
      revalidate: PAYLOAD_REVALIDATE_SECONDS,
      tags: [CACHE_TAGS.tenant, CACHE_TAGS.page(slug)],
    },
  )();
}

export const getPage = cache(async (slug: string) => getPersistentlyCachedPage(slug));

export type PublishedSitemapPage = Pick<CmsPage, "slug" | "path" | "updatedAt">;

async function fetchPublishedSitemapPages(): Promise<PublishedSitemapPage[]> {
  const pages: CmsPage[] = [];
  const limit = 100;
  let pageNumber = 1;
  let totalDocs = 0;

  do {
    const url = buildPayloadUrl("pages", {
      "where[tenant.slug][equals]": TENANT_SLUG,
      "where[_status][equals]": "published",
      depth: 0,
      limit,
      page: pageNumber,
      sort: "path",
    });
    const response = parseListResponse(
      await requestPayload(url),
      isCmsPage,
      "sitemap pages",
    );

    if (response.docs.length === 0) break;

    pages.push(...response.docs);
    totalDocs = response.totalDocs;
    pageNumber += 1;
  } while (pages.length < totalDocs);

  return pages.map(({ slug, path, updatedAt }) => ({ slug, path, updatedAt }));
}

const getCachedPublishedSitemapPages = unstable_cache(
  fetchPublishedSitemapPages,
  [TENANT_SLUG, "published-sitemap-pages"],
  {
    revalidate: PAYLOAD_REVALIDATE_SECONDS,
    tags: [CACHE_TAGS.tenant, CACHE_TAGS.sitemap],
  },
);

export const getPublishedSitemapPages = cache(
  async () => getCachedPublishedSitemapPages(),
);

async function fetchNavigation(): Promise<Navigation> {
  const url = buildPayloadUrl("navigation", {
    "where[tenant.slug][equals]": TENANT_SLUG,
    depth: 2,
    limit: 1,
  });
  const response = parseListResponse(await requestPayload(url), isNavigation, "navigation");
  const navigation = response.docs[0];

  if (!navigation) {
    throw new Error(`No Payload navigation was found for tenant "${TENANT_SLUG}".`);
  }

  return navigation;
}

async function fetchSiteSettings(): Promise<SiteSettings> {
  const url = buildPayloadUrl("tenant-site-settings", {
    "where[tenant.slug][equals]": TENANT_SLUG,
    depth: 2,
    limit: 1,
  });
  const response = parseListResponse(
    await requestPayload(url),
    isSiteSettings,
    "tenant-site-settings",
  );
  const settings = response.docs[0];

  if (!settings) {
    throw new Error(`No Payload site settings were found for tenant "${TENANT_SLUG}".`);
  }

  return settings;
}

const getCachedNavigation = unstable_cache(fetchNavigation, [TENANT_SLUG, "navigation"], {
  revalidate: PAYLOAD_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.tenant, CACHE_TAGS.shared],
});

const getCachedSiteSettings = unstable_cache(fetchSiteSettings, [TENANT_SLUG, "site-settings"], {
  revalidate: PAYLOAD_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.tenant, CACHE_TAGS.shared],
});

export const getNavigation = cache(async () => getCachedNavigation());
export const getSiteSettings = cache(async () => getCachedSiteSettings());

export async function getAuthenticatedDraftPage(slug: string): Promise<CmsPage> {
  const previewToken = process.env.PAYLOAD_PREVIEW_TOKEN;
  if (!previewToken) {
    throw new Error("PAYLOAD_PREVIEW_TOKEN is required to fetch a draft preview.");
  }

  const url = buildPayloadUrl("pages", {
    "where[tenant.slug][equals]": TENANT_SLUG,
    "where[slug][equals]": slug,
    draft: true,
    depth: 3,
    limit: 1,
  });
  const response = parseListResponse(
    await requestPayload(url, { headers: { Authorization: `Bearer ${previewToken}` } }),
    isCmsPage,
    "draft pages",
  );
  const page = response.docs[0];

  if (!page) {
    throw new Error(`No Payload draft page was found for slug "${slug}" and tenant "${TENANT_SLUG}".`);
  }

  return page;
}

export function getBlock<T extends PageBlockType>(
  page: CmsPage,
  blockType: T,
  index = 0,
): BlockOf<T> {
  const blocks = getBlocks(page, blockType);
  const block = blocks[index];

  if (!block) {
    throw new Error(
      `Payload page "${page.slug}" is missing ${blockType} block ${index + 1}.`,
    );
  }

  return block;
}

export function getBlocks<T extends PageBlockType>(page: CmsPage, blockType: T): BlockOf<T>[] {
  return page.layout.filter((block): block is BlockOf<T> => block.blockType === blockType);
}

export function getMedia(relation: MediaRelation | null | undefined): Media | null {
  return isMedia(relation) ? relation : null;
}

export function getMediaUrl(
  relation: MediaRelation | null | undefined,
  preferredSize?: MediaSize,
): string | null {
  const media = getMedia(relation);
  if (!media) return null;

  const variantUrl = preferredSize ? media.sizes?.[preferredSize]?.url : null;
  return variantUrl || media.url;
}

export function requireMediaUrl(
  relation: MediaRelation | null | undefined,
  label: string,
  preferredSize?: MediaSize,
) {
  const url = getMediaUrl(relation, preferredSize);
  if (!url) {
    throw new Error(
      `Payload media for ${label} was not populated. Increase the request depth or restore the media record.`,
    );
  }
  return url;
}

export function getMediaAlt(relation: MediaRelation | null | undefined, fallback = "") {
  return getMedia(relation)?.alt || fallback;
}

export function requireUiAsset(settings: SiteSettings, key: string) {
  const item = settings.uiAssets.find((asset) => asset.key === key);
  if (!item) {
    throw new Error(`Payload site settings are missing the "${key}" UI asset.`);
  }
  return requireMediaUrl(item.asset, `UI asset "${key}"`);
}
