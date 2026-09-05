export type PayloadId = number | string;

export type MediaVariant = {
  url: string | null;
  width?: number | null;
  height?: number | null;
  mimeType?: string | null;
  filesize?: number | null;
  filename?: string | null;
};

export type Media = {
  id: PayloadId;
  alt?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  url: string;
  thumbnailURL?: string | null;
  sizes?: {
    thumbnail?: MediaVariant | null;
    card?: MediaVariant | null;
    hero?: MediaVariant | null;
  } | null;
  createdAt?: string;
  updatedAt?: string;
};

export type MediaRelation = PayloadId | Media;
export type MediaSize = "thumbnail" | "card" | "hero";

export type CmsLink = {
  label: string;
  url: string;
};

type BlockBase<T extends string> = {
  id?: PayloadId;
  blockName?: string | null;
  blockType: T;
};

export type HeroSectionBlock = BlockBase<"heroSection"> & {
  heading: string;
  description: string;
  backgroundImage: MediaRelation;
  backgroundAlt: string;
  buttons: CmsLink[];
};

export type AboutSectionBlock = BlockBase<"aboutSection"> & {
  anchor?: string | null;
  eyebrow: string;
  heading: string;
  paragraphs: Array<{ text: string }>;
  image: MediaRelation;
  imageAlt: string;
  cta: CmsLink;
};

export type ServicesGridBlock = BlockBase<"servicesGrid"> & {
  anchor?: string | null;
  eyebrow: string;
  heading: string;
  services: Array<{
    title: string;
    description: string;
    image: MediaRelation;
    alt: string;
    url: string;
    linkLabel: string;
  }>;
};

export type ValuesSectionBlock = BlockBase<"valuesSection"> & {
  eyebrow: string;
  heading: string;
  items: Array<{
    title: string;
    text: string;
  }>;
};

export type GallerySectionBlock = BlockBase<"gallerySection"> & {
  eyebrow: string;
  heading: string;
  images: Array<{
    image: MediaRelation;
    alt: string;
  }>;
};

export type AccreditationSectionBlock = BlockBase<"accreditationSection"> & {
  eyebrow: string;
  heading: string;
  description: string;
  image: MediaRelation;
  imageAlt: string;
};

export type TestimonialsSectionBlock = BlockBase<"testimonialsSection"> & {
  testimonials: Array<{
    quote: string;
    author: string;
  }>;
};

export type ContactSectionBlock = BlockBase<"contactSection"> & {
  anchor?: string | null;
  eyebrow: string;
  heading: string;
  details: Array<{
    title: string;
    value: string;
    url: string;
    icon: MediaRelation;
  }>;
  showForm: boolean;
};

export type ServiceDetailBlock = BlockBase<"serviceDetail"> & {
  anchor?: string | null;
  eyebrow: string;
  heading: string;
  intro: string;
  includedHeading: string;
  bullets: Array<{ text: string }>;
  body: string;
  images: Array<{
    image: MediaRelation;
    alt: string;
  }>;
  theme: "black" | "navy";
  cta: CmsLink;
};

export type MapSectionBlock = BlockBase<"mapSection"> & {
  title: string;
  embedURL: string;
};

export type PageBlock =
  | HeroSectionBlock
  | AboutSectionBlock
  | ServicesGridBlock
  | ValuesSectionBlock
  | GallerySectionBlock
  | AccreditationSectionBlock
  | TestimonialsSectionBlock
  | ContactSectionBlock
  | ServiceDetailBlock
  | MapSectionBlock;

export type PageBlockType = PageBlock["blockType"];
export type BlockOf<T extends PageBlockType> = Extract<PageBlock, { blockType: T }>;

export type Seo = {
  title?: string | null;
  description?: string | null;
};

export type CmsPage = {
  id: PayloadId;
  title: string;
  slug: string;
  path: string;
  sourceHash?: string | null;
  hero?: {
    heading?: string | null;
    description?: string | null;
  } | null;
  featuredImage?: MediaRelation | null;
  layout: PageBlock[];
  seo?: Seo | null;
  _status: "published" | "draft";
  createdAt?: string;
  updatedAt?: string;
};

export type Navigation = {
  id: PayloadId;
  title: string;
  sourceHash?: string | null;
  headerLinks: CmsLink[];
  headerCTA: CmsLink;
  footerLinks: CmsLink[];
};

export type ContactFormSettings = {
  serviceOptions: Array<{ label: string }>;
  agreementLabel: string;
  submitLabel: string;
  successMessage: string;
};

export type SiteSettings = {
  id: PayloadId;
  businessName: string;
  sourceHash?: string | null;
  logo: MediaRelation;
  favicon: MediaRelation;
  uiAssets: Array<{
    key: string;
    asset: MediaRelation;
  }>;
  contact: {
    email: string;
    phoneDisplay: string;
    phoneHref: string;
    area: string;
    mapLink: string;
    mapEmbedURL: string;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
    icon: MediaRelation;
  }>;
  defaultSEO: Seo;
  primaryCTA: CmsLink;
  contactForm: ContactFormSettings;
  footer: {
    copyright: string;
    legalLinks: CmsLink[];
  };
};

export type PayloadListResponse<T> = {
  docs: T[];
  totalDocs: number;
};
