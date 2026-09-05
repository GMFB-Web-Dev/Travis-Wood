import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS, TENANT_SLUG } from "@/lib/payload/client";

const COLLECTIONS = ["pages", "navigation", "tenant-site-settings", "media"] as const;
const OPERATIONS = ["create", "update", "delete"] as const;
const STATUSES = ["published", "draft"] as const;
const MINIMUM_SECRET_LENGTH = 32;

type RevalidationEventBase = {
  tenantSlug: string;
  operation: (typeof OPERATIONS)[number];
  publicationStatus: (typeof STATUSES)[number] | null;
};

type RevalidationEvent = RevalidationEventBase &
  (
    | {
        collection: "pages";
        pageSlug: string;
        pagePath: string;
      }
    | {
        collection: Exclude<(typeof COLLECTIONS)[number], "pages">;
        pageSlug: null;
        pagePath: null;
      }
  );

function constantTimeEqual(left: string, right: string) {
  const leftDigest = createHash("sha256").update(left).digest();
  const rightDigest = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

function getConfiguredSecret() {
  const secret = process.env.REVALIDATION_SECRET;

  if (!secret || secret.length < MINIMUM_SECRET_LENGTH) {
    return null;
  }

  return secret;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isPageSlug(value: string) {
  return value.length <= 100 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value);
}

function isPagePath(value: string) {
  return (
    value.length <= 1024 &&
    value === value.trim() &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !/[?#\u0000-\u001f\u007f]/.test(value)
  );
}

function isRevalidationEvent(value: unknown): value is RevalidationEvent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const event = value as Record<string, unknown>;

  if (
    typeof event.tenantSlug !== "string" ||
    !COLLECTIONS.includes(event.collection as RevalidationEvent["collection"]) ||
    !OPERATIONS.includes(event.operation as RevalidationEvent["operation"]) ||
    !isNullableString(event.pageSlug) ||
    !isNullableString(event.pagePath) ||
    !(event.publicationStatus === null || STATUSES.includes(event.publicationStatus as "published" | "draft"))
  ) {
    return false;
  }

  if (event.collection === "pages") {
    return Boolean(
      event.pageSlug &&
        event.pagePath &&
        isPageSlug(event.pageSlug) &&
        isPagePath(event.pagePath),
    );
  }

  return event.pageSlug === null && event.pagePath === null;
}

export async function POST(request: Request) {
  const expectedSecret = getConfiguredSecret();
  if (!expectedSecret) {
    return Response.json({ error: "Revalidation is not configured." }, { status: 503 });
  }

  const providedSecret = request.headers.get("x-revalidation-secret") || "";
  if (!providedSecret || !constantTimeEqual(providedSecret, expectedSecret)) {
    return Response.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!isRevalidationEvent(body)) {
    return Response.json({ error: "Invalid Payload revalidation event." }, { status: 400 });
  }

  if (body.tenantSlug !== TENANT_SLUG) {
    return Response.json({ error: "This endpoint does not accept events for that tenant." }, { status: 403 });
  }

  const tags: string[] = [];
  const paths: string[] = [];

  if (body.collection === "pages") {
    const pageTag = CACHE_TAGS.page(body.pageSlug);
    tags.push(pageTag);
    paths.push(body.pagePath);

    // The page data and generateMetadata call share this tag. Expiring it before
    // the path ensures that the next visit reads the current published document.
    revalidateTag(pageTag, { expire: 0 });
    revalidatePath(body.pagePath);
  } else {
    tags.push(CACHE_TAGS.shared);
    paths.push("/");

    revalidateTag(CACHE_TAGS.shared, { expire: 0 });
    revalidatePath("/", "layout");
  }

  return Response.json({
    revalidated: true,
    tenantSlug: TENANT_SLUG,
    collection: body.collection,
    operation: body.operation,
    publicationStatus: body.publicationStatus,
    tags,
    paths,
  });
}
