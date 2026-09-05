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
  getNavigation,
  getPage,
  getSiteSettings,
} from "@/lib/payload/client";
import { getPageMetadata } from "@/lib/payload/metadata";
import { SITE_ASSETS } from "@/lib/site-assets";

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
  return (
    <>
      <main className="overflow-hidden bg-black">
        <HeroSection block={hero} navigation={navigation} settings={settings} />
        <AboutSection block={about} />
        <ServicesSection block={services} arrowIcon={SITE_ASSETS.arrow} />
        <ValuesSection block={values} />
        <WorkGallery
          eyebrow={gallery.eyebrow}
          heading={gallery.heading}
          projects={gallery.images.map((item, index) => ({
            src: SITE_ASSETS.homeGallery[index] || SITE_ASSETS.homeGallery[0],
            alt: item.alt,
          }))}
          previousIcon={SITE_ASSETS.previous}
          nextIcon={SITE_ASSETS.next}
        />
        <AccreditationSection block={accreditation} />
        <TestimonialsSection
          testimonials={testimonials.testimonials}
          previousIcon={SITE_ASSETS.previous}
          nextIcon={SITE_ASSETS.next}
        />
        <ContactSection block={contact} settings={settings} />
      </main>
      <Footer navigation={navigation} settings={settings} />
    </>
  );
}
