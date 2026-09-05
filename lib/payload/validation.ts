import type {
  CmsLink,
  CmsPage,
  ContactFormSettings,
  Navigation,
  PageBlock,
  PayloadId,
  PayloadListResponse,
  Seo,
  SiteSettings,
} from "./types";

type UnknownRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === "string";
const isNullableString = (value: unknown): value is string | null => value === null || isString(value);
const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";
const isId = (value: unknown): value is PayloadId => typeof value === "number" || isString(value);
const isArrayOf = <T>(value: unknown, guard: (item: unknown) => item is T): value is T[] =>
  Array.isArray(value) && value.every(guard);

const isOptionalString = (value: unknown): value is string | null | undefined =>
  value === undefined || isNullableString(value);

const hasBaseBlockShape = (value: UnknownRecord, blockType: string) => value.blockType === blockType;

function isLink(value: unknown): value is CmsLink {
  return isRecord(value) && isString(value.label) && isString(value.url);
}

function isSeo(value: unknown): value is Seo {
  return (
    isRecord(value) &&
    isOptionalString(value.title) &&
    isOptionalString(value.description)
  );
}

function isTextItem(value: unknown): value is { text: string } {
  return isRecord(value) && isString(value.text);
}

function isPageBlock(value: unknown): value is PageBlock {
  if (!isRecord(value) || !isString(value.blockType)) return false;

  switch (value.blockType) {
    case "heroSection":
      return (
        hasBaseBlockShape(value, "heroSection") &&
        isString(value.heading) &&
        isString(value.description) &&
        isString(value.backgroundAlt) &&
        isArrayOf(value.buttons, isLink)
      );
    case "aboutSection":
      return (
        isString(value.eyebrow) &&
        isString(value.heading) &&
        isArrayOf(value.paragraphs, isTextItem) &&
        isString(value.imageAlt) &&
        isLink(value.cta) &&
        isOptionalString(value.anchor)
      );
    case "servicesGrid":
      return (
        isString(value.eyebrow) &&
        isString(value.heading) &&
        isOptionalString(value.anchor) &&
        isArrayOf(
          value.services,
          (service): service is Extract<PageBlock, { blockType: "servicesGrid" }>["services"][number] =>
            isRecord(service) &&
            isString(service.title) &&
            isString(service.description) &&
            isString(service.alt) &&
            isString(service.url) &&
            isString(service.linkLabel),
        )
      );
    case "valuesSection":
      return (
        isString(value.eyebrow) &&
        isString(value.heading) &&
        isArrayOf(
          value.items,
          (item): item is { title: string; text: string } =>
            isRecord(item) && isString(item.title) && isString(item.text),
        )
      );
    case "gallerySection":
      return (
        isString(value.eyebrow) &&
        isString(value.heading) &&
        isArrayOf(
          value.images,
          (item): item is { alt: string } => isRecord(item) && isString(item.alt),
        ) &&
        value.images.length > 0
      );
    case "accreditationSection":
      return (
        isString(value.eyebrow) &&
        isString(value.heading) &&
        isString(value.description) &&
        isString(value.imageAlt)
      );
    case "testimonialsSection":
      return (
        isArrayOf(
          value.testimonials,
          (item): item is { quote: string; author: string } =>
            isRecord(item) && isString(item.quote) && isString(item.author),
        ) &&
        value.testimonials.length > 0
      );
    case "contactSection":
      return (
        isOptionalString(value.anchor) &&
        isString(value.eyebrow) &&
        isString(value.heading) &&
        isBoolean(value.showForm) &&
        isArrayOf(
          value.details,
          (item): item is Extract<PageBlock, { blockType: "contactSection" }>["details"][number] =>
            isRecord(item) &&
            isString(item.title) &&
            isString(item.value) &&
            isString(item.url),
        )
      );
    case "serviceDetail":
      return (
        isOptionalString(value.anchor) &&
        isString(value.eyebrow) &&
        isString(value.heading) &&
        isString(value.intro) &&
        isString(value.includedHeading) &&
        isArrayOf(value.bullets, isTextItem) &&
        isString(value.body) &&
        isArrayOf(
          value.images,
          (item): item is { alt: string } => isRecord(item) && isString(item.alt),
        ) &&
        value.images.length > 0 &&
        (value.theme === "black" || value.theme === "navy") &&
        isLink(value.cta)
      );
    case "mapSection":
      return isString(value.title) && isString(value.embedURL);
    default:
      return false;
  }
}

export function isCmsPage(value: unknown): value is CmsPage {
  return (
    isRecord(value) &&
    isId(value.id) &&
    isString(value.title) &&
    isString(value.slug) &&
    isString(value.path) &&
    isArrayOf(value.layout, isPageBlock) &&
    (value.seo === undefined || value.seo === null || isSeo(value.seo)) &&
    (value._status === "published" || value._status === "draft")
  );
}

export function isNavigation(value: unknown): value is Navigation {
  return (
    isRecord(value) &&
    isId(value.id) &&
    isString(value.title) &&
    isArrayOf(value.headerLinks, isLink) &&
    isLink(value.headerCTA) &&
    isArrayOf(value.footerLinks, isLink)
  );
}

function isContactFormSettings(value: unknown): value is ContactFormSettings {
  return (
    isRecord(value) &&
    isArrayOf(
      value.serviceOptions,
      (option): option is { label: string } => isRecord(option) && isString(option.label),
    ) &&
    isString(value.agreementLabel) &&
    isString(value.submitLabel) &&
    isString(value.successMessage)
  );
}

export function isSiteSettings(value: unknown): value is SiteSettings {
  return (
    isRecord(value) &&
    isId(value.id) &&
    isString(value.businessName) &&
    isRecord(value.contact) &&
    isString(value.contact.email) &&
    isString(value.contact.phoneDisplay) &&
    isString(value.contact.phoneHref) &&
    isString(value.contact.area) &&
    isString(value.contact.mapLink) &&
    isString(value.contact.mapEmbedURL) &&
    isArrayOf(
      value.socialLinks,
      (item): item is SiteSettings["socialLinks"][number] =>
        isRecord(item) &&
        isString(item.platform) &&
        isString(item.url),
    ) &&
    isSeo(value.defaultSEO) &&
    isLink(value.primaryCTA) &&
    isContactFormSettings(value.contactForm) &&
    isRecord(value.footer) &&
    isString(value.footer.copyright) &&
    isArrayOf(value.footer.legalLinks, isLink)
  );
}

export function parseListResponse<T>(
  value: unknown,
  guard: (item: unknown) => item is T,
  collection: string,
): PayloadListResponse<T> {
  if (
    !isRecord(value) ||
    !Array.isArray(value.docs) ||
    typeof value.totalDocs !== "number" ||
    !value.docs.every(guard)
  ) {
    throw new Error(`Payload returned an invalid ${collection} response.`);
  }

  return { docs: value.docs, totalDocs: value.totalDocs };
}
