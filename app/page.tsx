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
import { homeGalleryImages } from "@/lib/gallery-images";
import {
  getBlock,
  getNavigation,
  getPage,
  getSiteSettings,
  requireUiAsset,
} from "@/lib/payload/client";
import { getPageMetadata } from "@/lib/payload/metadata";
import { publicPages } from "@/lib/seo/config";

export const revalidate = 3600;

// Keep the section ready to restore without deleting its Payload content or component.
const SHOW_TESTIMONIALS = false;

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
        <HeroSection
          block={hero}
          navigation={navigation}
          settings={settings}
          imageTitle={publicPages.home.featureImage.title}
          imageAlt={publicPages.home.featureImage.alt}
        />
        <AboutSection block={about} />
        <ServicesSection block={services} />
        <ValuesSection block={values} />
        <WorkGallery
          eyebrow={gallery.eyebrow}
          heading={gallery.heading}
          projects={homeGalleryImages}
          previousIcon={previousIcon}
          nextIcon={nextIcon}
        />
        <AccreditationSection block={accreditation} />
        {SHOW_TESTIMONIALS ? (
          <TestimonialsSection
            testimonials={testimonials.testimonials}
            previousIcon={previousIcon}
            nextIcon={nextIcon}
          />
        ) : null}
        <ContactSection block={contact} settings={settings} />
      </main>
      <Footer activePath="/" navigation={navigation} settings={settings} />
    </>
  );
}
