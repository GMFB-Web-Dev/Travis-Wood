# Payload CMS revalidation hook

The frontend endpoint is ready, but the Payload CMS repository is not part of this workspace. Install the module below in the Payload project (for example at `src/hooks/revalidateTravisWoodBuilder.ts`) and add the returned hooks to each of the `pages`, `navigation`, `tenant-site-settings`, and `media` collection configs.

## Frontend behavior

The route is `POST /api/revalidate/payload`. It accepts only tenant `travis-wood-builder` and requires an `x-revalidation-secret` header that exactly matches the server-only `REVALIDATION_SECRET`. The configured secret must be at least 32 characters. The comparison hashes both values before using a constant-time comparison. Invalid JSON, unsupported collection or operation values, malformed page paths, and missing page slugs or paths are rejected without returning the secret.

Payload reads keep their one-hour timed revalidation as a delivery-failure fallback. On a valid webhook, Next.js 16 expires the relevant data tag immediately and marks the affected route for regeneration on its next request:

| Content | Data cache tags | Path invalidation |
| --- | --- | --- |
| Page | `tenant:travis-wood-builder`, `tenant:travis-wood-builder:page:<slug>` | The supplied `pagePath` |
| Navigation, site settings, media | `tenant:travis-wood-builder`, `tenant:travis-wood-builder:shared` | `/` layout and all public routes beneath it |

Page metadata reads the same tagged published page data, so page-tag invalidation refreshes both content and SEO metadata. Public page queries always include `_status=published`; a draft webhook can invalidate cached public data but cannot switch the public query into draft mode.

## Environment variables

Set these server-only variables in Vercel Production (and Preview when webhook testing against previews):

```dotenv
PAYLOAD_URL=https://payload.vyomeshj.com
REVALIDATION_SECRET=the-same-long-random-secret-used-by-payload
```

Set these server-only variables in the Payload deployment:

```dotenv
FRONTEND_REVALIDATION_URL=https://gmfb-travis-wood-builder.vercel.app/api/revalidate/payload
REVALIDATION_SECRET=the-same-long-random-secret-used-by-the-frontend
```

Never prefix the secret with `NEXT_PUBLIC_` in either project.

Copy-paste module:

```ts
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'

type TargetCollection = 'pages' | 'navigation' | 'tenant-site-settings' | 'media'
type Relation = number | string | { id: number | string; slug?: string | null } | null | undefined

async function resolveTenantSlug(tenant: Relation, req: PayloadRequest) {
  if (tenant && typeof tenant === 'object' && tenant.slug) return tenant.slug
  const id = tenant && typeof tenant === 'object' ? tenant.id : tenant
  if (id === null || id === undefined) throw new Error('Revalidation event is missing its tenant relation.')

  const tenantDoc = await req.payload.findByID({
    collection: 'tenants',
    id,
    depth: 0,
    req,
  })

  if (!tenantDoc.slug) throw new Error(`Tenant ${String(id)} has no slug.`)
  return tenantDoc.slug
}

async function notifyFrontend(args: {
  collection: TargetCollection
  operation: 'create' | 'update' | 'delete'
  doc: Record<string, unknown>
  previousDoc?: Record<string, unknown>
  req: PayloadRequest
}) {
  const endpoint = process.env.FRONTEND_REVALIDATION_URL
  const secret = process.env.REVALIDATION_SECRET
  if (!endpoint || !secret) {
    args.req.payload.logger.warn('Skipping frontend revalidation: environment variables are missing.')
    return
  }

  const source = args.doc || args.previousDoc || {}
  const tenantSlug = await resolveTenantSlug(source.tenant as Relation, args.req)
  if (tenantSlug !== 'travis-wood-builder') return

  const pageSlug = args.collection === 'pages'
    ? String(source.slug ?? args.previousDoc?.slug ?? '') || null
    : null
  const pagePath = args.collection === 'pages'
    ? String(
        source.path ??
        args.previousDoc?.path ??
        (pageSlug === 'home' ? '/' : pageSlug ? `/${pageSlug}` : ''),
      ) || null
    : null
  const rawStatus = source._status ?? args.previousDoc?._status
  const publicationStatus = rawStatus === 'published' || rawStatus === 'draft' ? rawStatus : null

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-revalidation-secret': secret,
    },
    body: JSON.stringify({
      tenantSlug,
      collection: args.collection,
      operation: args.operation,
      pageSlug,
      pagePath,
      publicationStatus,
    }),
  })

  if (!response.ok) {
    throw new Error(`Frontend revalidation failed with HTTP ${response.status}: ${await response.text()}`)
  }
}

export function frontendRevalidationHooks(collection: TargetCollection) {
  const afterChange: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
    try {
      await notifyFrontend({ collection, operation, doc, previousDoc, req })
    } catch (error) {
      req.payload.logger.error({ err: error }, 'Frontend revalidation failed after change.')
    }
    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
    try {
      await notifyFrontend({ collection, operation: 'delete', doc, req })
    } catch (error) {
      req.payload.logger.error({ err: error }, 'Frontend revalidation failed after delete.')
    }
    return doc
  }

  return { afterChange, afterDelete }
}
```

In each collection config, merge the hooks without replacing existing hooks:

```ts
import { frontendRevalidationHooks } from '../hooks/revalidateTravisWoodBuilder'

const frontendHooks = frontendRevalidationHooks('pages') // change per collection

export const Pages: CollectionConfig = {
  slug: 'pages',
  // ...existing config
  hooks: {
    afterChange: [...(existingAfterChangeHooks ?? []), frontendHooks.afterChange],
    afterDelete: [...(existingAfterDeleteHooks ?? []), frontendHooks.afterDelete],
  },
}
```

Repeat with `navigation`, `tenant-site-settings`, and `media` as the factory argument. The hook intentionally logs delivery errors instead of rolling back a successful CMS save.

## Files in the frontend implementation

- `app/api/revalidate/payload/route.ts`: authenticated validation and Next.js cache/path invalidation.
- `lib/payload/client.ts`: published-only Payload reads, cache keys, cache tags, and the one-hour fallback.
- `.env.example`: server-only environment variable placeholders.
- `README.md` and this file: deployment and Payload hook configuration.
