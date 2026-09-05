const FALLBACK_SITE_URL = "https://gmfb-travis-wood-builder.vercel.app";

function resolveSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configuredUrl) return FALLBACK_SITE_URL;

  try {
    const url = new URL(configuredUrl);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return FALLBACK_SITE_URL;
    }

    return url.origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const siteConfig = {
  name: "Travis Wood Builder",
  alternateName: "Ensure Build",
  applicationName: "Travis Wood Builder",
  url: resolveSiteUrl(),
  defaultTitle: "Travis Wood Builder | Whangārei Residential Builders",
  titleTemplate: "%s | Travis Wood Builder",
  defaultDescription:
    "Travis Wood Builder provides new builds, renovations, extensions and outdoor living projects across Whangārei and surrounding areas.",
  locale: "en_NZ",
  language: "en-NZ",
  socialImage: {
    url: "https://media.vyomeshj.com/media/gallery-3%20copy-1600x900.png",
    width: 1600,
    height: 900,
    alt: "Architectural home built by Travis Wood Builder in Whangārei",
  },
  logoUrl: "https://media.vyomeshj.com/media/logo-lockup.png",
  business: {
    schemaType: "GeneralContractor",
    description:
      "Residential builder providing new builds, renovations, extensions and outdoor living projects across Whangārei and surrounding areas.",
    telephone: "+64 21 221 9834",
    phoneDisplay: "021 221 9834",
    phoneHref: "tel:+64212219834",
    email: "traviswoodbuild@gmail.com",
    emailHref: "mailto:traviswoodbuild@gmail.com",
    address: {
      streetAddress: "386A Pataua North Road, Whareora",
      addressLocality: "Whangārei",
      postalCode: "0175",
      addressCountry: "NZ",
    },
    displayAddress:
      "386A Pataua North Road, Whareora, Whangārei 0175, New Zealand",
    facebookUrl: "https://www.facebook.com/profile.php?id=61566712083135",
    // The lowercase short link supplied for this project returns 404. This is the
    // working, case-sensitive URL already published in the website CMS.
    mapUrl: "https://maps.app.goo.gl/jvwdSMkDjaRZmKyP6",
    areaServed: "Whangārei and surrounding areas",
    openingHours: [
      {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "07:30",
        closes: "17:00",
      },
      { days: ["Friday"], opens: "07:30", closes: "15:30" },
      {
        days: ["Saturday", "Sunday"],
        opens: "00:00",
        closes: "00:00",
      },
    ],
  },
} as const;

export const publicPages = {
  home: {
    path: "/",
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    changeFrequency: "monthly",
    priority: 1,
  },
  services: {
    path: "/services",
    title: "Residential Building Services in Whangārei",
    description:
      "Explore new builds, renovations, extensions and outdoor living services from Travis Wood Builder across Whangārei and surrounding areas.",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  contact: {
    path: "/contact",
    title: "Contact Our Whangārei Building Team",
    description:
      "Contact Travis Wood Builder to discuss a new build, renovation, extension or outdoor living project in Whangārei and surrounding areas.",
    changeFrequency: "yearly",
    priority: 0.8,
  },
} as const;

export type PublicPageSlug = keyof typeof publicPages;

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.url}/`).toString();
}

export function isProductionDeployment() {
  const vercelEnvironment = process.env.VERCEL_ENV;

  if (vercelEnvironment) {
    return vercelEnvironment === "production";
  }

  return process.env.NODE_ENV === "production";
}

export function getFullPageTitle(slug: PublicPageSlug) {
  const page = publicPages[slug];
  return slug === "home" ? page.title : `${page.title} | ${siteConfig.name}`;
}

export function getBusinessContactDetail(
  title: string,
  fallbackValue: string,
  fallbackUrl: string,
) {
  switch (title.toLowerCase()) {
    case "email":
      return {
        value: siteConfig.business.email,
        url: siteConfig.business.emailHref,
      };
    case "phone":
      return {
        value: siteConfig.business.phoneDisplay,
        url: siteConfig.business.phoneHref,
      };
    case "area":
    case "address":
      return {
        value: siteConfig.business.displayAddress,
        url: siteConfig.business.mapUrl,
      };
    default:
      return { value: fallbackValue, url: fallbackUrl };
  }
}
