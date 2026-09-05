This is the Travis Wood Builder Next.js site. Published page content, navigation, settings, SEO, images, logos, and icons are supplied by the `travis-wood-builder` tenant in Payload CMS.

## Getting Started

Copy `.env.example` to `.env.local`, keep every value server-only, then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Published content is cached for one hour and can be invalidated by the protected Payload revalidation endpoint. Draft fetching is available only through the authenticated, server-only helper and is never stored in the published cache.

## Vercel environment variables

Add these variables to Preview and Production in Vercel. None may use a `NEXT_PUBLIC_` prefix.

- `PAYLOAD_URL`: `https://payload.vyomeshj.com`
- `PAYLOAD_PREVIEW_TOKEN`: a server-only Payload API token, only if an authenticated preview entry point is added
- `REVALIDATION_SECRET`: a random value of at least 32 characters, shared only with the Payload server hook
- `FORM_RESEND_API_KEY`: the server-only Resend API key used to deliver contact form enquiries
- `FORM_RESEND_FROM_EMAIL`: an optional verified Resend sender, such as `Travis Wood Builder <contact@example.com>`; if omitted, the Resend onboarding sender is used for testing

Redeploy after adding or rotating environment variables. Configure the Payload deployment with the same `REVALIDATION_SECRET` and set `FRONTEND_REVALIDATION_URL=https://gmfb-travis-wood-builder.vercel.app/api/revalidate/payload`. Never create `NEXT_PUBLIC_REVALIDATION_SECRET` or `NEXT_PUBLIC_FORM_RESEND_API_KEY`.

## Payload hook installation

The CMS repository is not included here, so its hook has not been installed. The exact module and collection wiring are documented in [docs/PAYLOAD_REVALIDATION_HOOK.md](docs/PAYLOAD_REVALIDATION_HOOK.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
