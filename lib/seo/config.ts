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
    url: "https://media.gmfb.co.nz/media/gallery-3%20copy-1600x900.png",
    width: 1600,
    height: 900,
    alt: "Architectural home built by Travis Wood Builder in Whangārei",
  },
  logoUrl: "https://media.gmfb.co.nz/media/logo-lockup.png",
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
      addressLocality: "Whangārei",
      addressRegion: "Northland",
      addressCountry: "NZ",
    },
    displayLocation: "Whangārei",
    facebookUrl: "https://www.facebook.com/profile.php?id=61566712083135",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Whang%C4%81rei%2C%20New%20Zealand",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Whang%C4%81rei%2C%20New%20Zealand&output=embed",
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
    featureImage: {
      title: "Residential building project by Travis Wood Builder in Whangārei",
      alt: "Residential building project by Travis Wood Builder in Whangārei, showcasing new builds, renovations, extensions and outdoor living work",
    },
  },
  services: {
    path: "/services",
    title: "Building Services Whangārei | Travis Wood Builder",
    description:
      "Explore residential building services from Travis Wood Builder, including new builds, renovations, extensions and outdoor living across Whangārei.",
    featureImage: {
      title: "Residential building services by Travis Wood Builder in Whangārei",
      alt: "Residential building services by Travis Wood Builder in Whangārei, including new builds, renovations, extensions and outdoor living",
    },
  },
  contact: {
    path: "/contact",
    title: "Contact Travis Wood Builder | Whangārei Builder",
    description:
      "Get in touch with Travis Wood Builder to discuss new builds, renovations, extensions or outdoor living projects across Whangārei and surrounding areas.",
    featureImage: {
      title: "Contact Travis Wood Builder for residential building projects in Whangārei",
      alt: "Contact Travis Wood Builder in Whangārei to discuss new builds, renovations, extensions and outdoor living projects",
    },
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
  return publicPages[slug].title;
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
        value: siteConfig.business.displayLocation,
        url: siteConfig.business.mapUrl,
      };
    default:
      return { value: fallbackValue, url: fallbackUrl };
  }
}
