export const SITE_ASSETS = {
  logo: "/figma/logo-lockup.png",
  arrow: "/figma/arrow.svg",
  previous: "/figma/chevron-left.svg",
  next: "/figma/chevron-right.svg",
  email: "/figma/email.svg",
  phone: "/figma/phone.svg",
  pin: "/figma/pin.svg",
  facebook: "/figma/facebook.svg",
  hero: {
    home: "/figma/hero.png",
    services: "/figma/about-divider.png",
    contact: "/figma/gallery-2.png",
  },
  about: "/figma/about-divider.png",
  accreditation: "/figma/accreditation.png",
  serviceCards: [
    "/figma/service-new-builds.png",
    "/figma/service-outdoor-living.png",
    "/figma/service-renovations.jpg",
  ],
  homeGallery: [
    "/figma/gallery-1.png",
    "/figma/gallery-2.png",
    "/figma/gallery-3.png",
    "/figma/gallery-4.png",
    "/figma/gallery-5.jpg",
    "/figma/gallery-6.jpg",
    "/figma/gallery-7.jpg",
    "/figma/gallery-8.jpg",
    "/figma/gallery-9.jpg",
    "/figma/gallery-10.png",
    "/figma/gallery-11.jpg",
    "/figma/gallery-12.jpg",
    "/figma/gallery-13.jpg",
    "/figma/gallery-14.jpg",
    "/figma/gallery-15.jpg",
  ],
  serviceGalleries: {
    "new-builds": [
      "/figma/service-new-builds.png",
      "/figma/gallery-2.png",
      "/figma/gallery-1.png",
      "/figma/gallery-5.jpg",
      "/figma/gallery-6.jpg",
      "/figma/gallery-7.jpg",
    ],
    "renovations-extensions": [
      "/figma/gallery-8.jpg",
      "/figma/service-renovations.jpg",
      "/figma/gallery-7.jpg",
      "/figma/gallery-9.jpg",
      "/figma/gallery-10.png",
      "/figma/gallery-11.jpg",
    ],
    "outdoor-living": [
      "/figma/service-outdoor-living.png",
      "/figma/gallery-12.jpg",
      "/figma/gallery-8.jpg",
      "/figma/gallery-13.jpg",
      "/figma/gallery-14.jpg",
      "/figma/gallery-15.jpg",
    ],
  },
} as const;

export function getContactIcon(title: string, index: number) {
  const normalizedTitle = title.toLowerCase();
  if (normalizedTitle.includes("email")) return SITE_ASSETS.email;
  if (normalizedTitle.includes("phone")) return SITE_ASSETS.phone;
  if (normalizedTitle.includes("area") || normalizedTitle.includes("location")) return SITE_ASSETS.pin;
  return [SITE_ASSETS.email, SITE_ASSETS.phone, SITE_ASSETS.pin][index % 3];
}

export function getServiceGalleryImages(anchor: string | null | undefined, index: number) {
  if (anchor && anchor in SITE_ASSETS.serviceGalleries) {
    return SITE_ASSETS.serviceGalleries[anchor as keyof typeof SITE_ASSETS.serviceGalleries];
  }

  return Object.values(SITE_ASSETS.serviceGalleries)[index] || SITE_ASSETS.serviceGalleries["new-builds"];
}
