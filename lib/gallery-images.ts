export type GalleryImage = {
  src: string;
  alt: string;
};

function createGallery(
  directory: string,
  filePrefix: string,
  count: number,
  description: string,
  startNumber = 1,
): GalleryImage[] {
  return Array.from({ length: count }, (_, index) => {
    const imageNumber = index + startNumber;

    return {
      src: `/images/galleries/${directory}/${filePrefix}-${String(imageNumber).padStart(2, "0")}.jpg`,
      alt: `${description}, image ${imageNumber}`,
    };
  });
}

export const homeGalleryImages = createGallery(
  "home",
  "home",
  19,
  "Residential building project by Travis Wood Builder in Whangārei",
  2,
);

export const serviceGalleryImagesByAnchor: Record<string, GalleryImage[]> = {
  "new-builds": createGallery(
    "new-builds",
    "new-builds",
    12,
    "New build project by Travis Wood Builder in Whangārei",
  ),
  "renovations-extensions": createGallery(
    "renovations-extensions",
    "renovations-extensions",
    6,
    "Renovation and extension project by Travis Wood Builder in Whangārei",
  ),
  "outdoor-living": createGallery(
    "outdoor-living",
    "outdoor-living",
    13,
    "Outdoor living project by Travis Wood Builder in Whangārei",
    2,
  ),
};
