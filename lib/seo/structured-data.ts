import type { ServiceDetailBlock } from "@/lib/payload/types";
import { absoluteUrl, siteConfig } from "./config";

export const businessId = `${siteConfig.url}/#business`;

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": siteConfig.business.schemaType,
    "@id": businessId,
    name: siteConfig.name,
    alternateName: siteConfig.alternateName,
    description: siteConfig.business.description,
    url: siteConfig.url,
    image: siteConfig.socialImage.url,
    logo: siteConfig.logoUrl,
    telephone: siteConfig.business.telephone,
    email: siteConfig.business.email,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.business.address,
    },
    areaServed: siteConfig.business.areaServed,
    openingHoursSpecification: siteConfig.business.openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.days.map((day) => `https://schema.org/${day}`),
      opens: hours.opens,
      closes: hours.closes,
    })),
    hasMap: siteConfig.business.mapUrl,
    sameAs: [siteConfig.business.facebookUrl],
  };
}

export function getBreadcrumbJsonLd(currentPage: { name: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: currentPage.name,
        item: absoluteUrl(currentPage.path),
      },
    ],
  };
}

export function getServicesJsonLd(services: ServiceDetailBlock[]) {
  return {
    "@context": "https://schema.org",
    "@graph": services.map((service) => ({
      "@type": "Service",
      "@id": `${absoluteUrl("/services")}#${service.anchor || "services"}`,
      name: service.eyebrow,
      serviceType: service.eyebrow,
      description: service.intro,
      url: `${absoluteUrl("/services")}#${service.anchor || "services"}`,
      provider: { "@id": businessId },
      areaServed: siteConfig.business.areaServed,
    })),
  };
}
