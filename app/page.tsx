import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/sections/AboutSection";
import { AccreditationSection } from "@/components/sections/AccreditationSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { WorkGallery } from "@/components/sections/WorkGallery";

export default function Home() {
  return (
    <>
      <main className="overflow-hidden bg-black">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <ValuesSection />
        <WorkGallery />
        <AccreditationSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
