import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/sections/AboutSection";
import { AccreditationSection } from "@/components/sections/AccreditationSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { WorkGallery } from "@/components/sections/WorkGallery";
import {
  getBlock,
  getMediaAlt,
  getNavigation,
  getPage,
  getSiteSettings,
  requireMediaUrl,
  requireUiAsset,
} from "@/lib/payload/client";
import { getPageMetadata } from "@/lib/payload/metadata";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("home");
}

export default async function Home() {
  const [page, navigation, settings] = await Promise.all([
    getPage("home"),
    getNavigation(),
    getSiteSettings(),
  ]);
  const hero = getBlock(page, "heroSection");
  const about = getBlock(page, "aboutSection");
  const services = getBlock(page, "servicesGrid");
  const values = getBlock(page, "valuesSection");
  const gallery = getBlock(page, "gallerySection");
  const accreditation = getBlock(page, "accreditationSection");
  const testimonials = getBlock(page, "testimonialsSection");
  const contact = getBlock(page, "contactSection");
  const previousIcon = requireUiAsset(settings, "previous");
  const nextIcon = requireUiAsset(settings, "next");

  return (
    <>
      <main className="overflow-hidden bg-black">
        <HeroSection block={hero} navigation={navigation} settings={settings} />
        <AboutSection block={about} />
        <ServicesSection block={services} arrowIcon={requireUiAsset(settings, "arrow")} />
        <ValuesSection block={values} />
        <WorkGallery
          eyebrow={gallery.eyebrow}
          heading={gallery.heading}
          projects={gallery.images.map((item, index) => ({
            src: requireMediaUrl(item.image, `home gallery image ${index + 1}`, "card"),
            alt:
              item.alt ||
              getMediaAlt(
                item.image,
                `Residential building project by Travis Wood Builder in Whangārei, image ${index + 1}`,
              ),
          }))}
          previousIcon={previousIcon}
          nextIcon={nextIcon}
        />
        <AccreditationSection block={accreditation} />
        <TestimonialsSection
          testimonials={testimonials.testimonials}
          previousIcon={previousIcon}
          nextIcon={nextIcon}
        />
        <ContactSection block={contact} settings={settings} />
      </main>
      <Footer navigation={navigation} settings={settings} />
    </>
  );
}
