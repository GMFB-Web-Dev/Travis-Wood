export type GalleryImage = {
  src: string;
  alt: string;
};

function createGallery(
  directory: string,
  filePrefix: string,
  count: number,
  description: string,
  excludedImageNumbers: number[] = [],
): GalleryImage[] {
  return Array.from({ length: count }, (_, index) => index + 1)
    .filter((imageNumber) => !excludedImageNumbers.includes(imageNumber))
    .map((imageNumber) => ({
      src: `/images/galleries/${directory}/${filePrefix}-${String(imageNumber).padStart(2, "0")}.jpg`,
      alt: `${description}, image ${imageNumber}`,
    }));
}

export const homeGalleryImages = createGallery(
  "home",
  "home",
  20,
  "Residential building project by Travis Wood Builder in Whangārei",
  [5],
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
    14,
    "Outdoor living project by Travis Wood Builder in Whangārei",
    [5, 13],
  ),
};
