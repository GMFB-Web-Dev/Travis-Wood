import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContactSection } from "@/components/sections/ContactSection";
import { ServiceDetailSection } from "@/components/sections/ServiceDetailSection";
import { ServicesPageHero } from "@/components/sections/ServicesPageHero";
import {
  getBlock,
  getBlocks,
  getNavigation,
  getPage,
  getSiteSettings,
  requireUiAsset,
} from "@/lib/payload/client";
import { getPageMetadata } from "@/lib/payload/metadata";
import { publicPages } from "@/lib/seo/config";
import { getBreadcrumbJsonLd, getServicesJsonLd } from "@/lib/seo/structured-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("services");
}

export default async function ServicesPage() {
  const [page, navigation, settings] = await Promise.all([
    getPage("services"),
    getNavigation(),
    getSiteSettings(),
  ]);
  const hero = getBlock(page, "heroSection");
  const services = getBlocks(page, "serviceDetail");
  const contact = getBlock(page, "contactSection");
  const previousIcon = requireUiAsset(settings, "previous");
  const nextIcon = requireUiAsset(settings, "next");

  if (services.length === 0) {
    throw new Error('Payload page "services" does not contain any serviceDetail blocks.');
  }

  return (
    <>
      <JsonLd data={getBreadcrumbJsonLd({ name: "Services", path: "/services" })} />
      <JsonLd data={getServicesJsonLd(services)} />
      <main className="overflow-hidden bg-black">
        <ServicesPageHero
          block={hero}
          navigation={navigation}
          settings={settings}
          imageTitle={publicPages.services.featureImage.title}
          imageAlt={publicPages.services.featureImage.alt}
        />
        {services.map((service) => (
          <ServiceDetailSection
            key={service.id || service.anchor || service.heading}
            block={service}
            previousIcon={previousIcon}
            nextIcon={nextIcon}
          />
        ))}
        <ContactSection block={contact} settings={settings} />
      </main>
      <Footer activePath="/services" navigation={navigation} settings={settings} />
    </>
  );
}
