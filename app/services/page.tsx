import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
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
  const arrowIcon = requireUiAsset(settings, "arrow");
  const previousIcon = requireUiAsset(settings, "previous");
  const nextIcon = requireUiAsset(settings, "next");

  if (services.length === 0) {
    throw new Error('Payload page "services" does not contain any serviceDetail blocks.');
  }

  return (
    <>
      <main className="overflow-hidden bg-black">
        <ServicesPageHero block={hero} navigation={navigation} settings={settings} />
        {services.map((service) => (
          <ServiceDetailSection
            key={service.id || service.anchor || service.heading}
            block={service}
            arrowIcon={arrowIcon}
            previousIcon={previousIcon}
            nextIcon={nextIcon}
          />
        ))}
        <ContactSection block={contact} settings={settings} />
      </main>
      <Footer navigation={navigation} settings={settings} />
    </>
  );
}
