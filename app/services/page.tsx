import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { ContactSection } from "@/components/sections/ContactSection";
import { ServiceDetailSection } from "@/components/sections/ServiceDetailSection";
import { ServicesPageHero } from "@/components/sections/ServicesPageHero";

export const metadata: Metadata = {
  title: "Building Services | Travis Wood Builder Whangārei",
  description:
    "Explore new builds, renovations, extensions and outdoor living services from Travis Wood Builder in Whangārei.",
};

const newBuildImages = [
  { src: "/figma/service-new-builds.png", alt: "Completed architectural new home" },
  { src: "/figma/gallery-2.png", alt: "Architectural new home during construction" },
  { src: "/figma/gallery-1.png", alt: "Finished timber-lined entrance hallway" },
  { src: "/figma/gallery-5.jpg", alt: "New home slab being prepared" },
  { src: "/figma/gallery-6.jpg", alt: "Timber roof framing in progress" },
  { src: "/figma/gallery-7.jpg", alt: "New residential build wrapped in scaffolding" },
];

const outdoorImages = [
  { src: "/figma/service-outdoor-living.png", alt: "Pool and timber outdoor living area" },
  { src: "/figma/gallery-12.jpg", alt: "Completed covered deck and pergola" },
  { src: "/figma/gallery-8.jpg", alt: "Completed black-clad garden building" },
  { src: "/figma/gallery-13.jpg", alt: "Waterside timber screen and glass balustrade" },
  { src: "/figma/gallery-14.jpg", alt: "Detailed timber retaining wall" },
  { src: "/figma/gallery-15.jpg", alt: "Finished timber landscaping work" },
];

const renovationImages = [
  { src: "/figma/gallery-8.jpg", alt: "Completed black-clad home addition" },
  { src: "/figma/service-renovations.jpg", alt: "Residential extension under construction" },
  { src: "/figma/gallery-7.jpg", alt: "Home renovation surrounded by scaffolding" },
  { src: "/figma/gallery-9.jpg", alt: "Deck and entrance being renovated" },
  { src: "/figma/gallery-10.png", alt: "Custom fitted cabinetry in a renovated interior" },
  { src: "/figma/gallery-11.jpg", alt: "Timber extension framing in progress" },
];

export default function ServicesPage() {
  return (
    <>
      <main className="overflow-hidden bg-black">
        <ServicesPageHero />
        <ServiceDetailSection
          id="new-builds"
          eyebrow="New Builds"
          title="Homes Built From the Ground Up"
          intro="Whether you already have plans ready or are still shaping the details, Travis Wood Builder can take your new home from the early stages through to completion. The focus is on residential and architectural builds, with each stage organised to keep the process clear and manageable."
          bullets={[
            "Architectural and residential new homes",
            "Working from client-supplied plans",
            "Framing and structural building work",
            "Exterior cladding and finishing",
            "Interior fit-out and finishing work",
            "Coordination of trusted subcontractors",
          ]}
          body="From the first stages on site through to the final handover, the build is managed with one clear point of contact and a practical approach to scheduling, trades and day-to-day progress, helping make the experience easier for homeowners throughout the entire build."
          images={newBuildImages}
        />
        <ServiceDetailSection
          id="renovations-extensions"
          eyebrow="Renovations & Extensions"
          title="Making More of Your Home"
          intro="Renovations and extensions are about making an existing home work better for the way you live. Travis Wood Builder handles everything from internal upgrades and layout changes to larger additions that create more space, improve functionality and update the overall feel of the property."
          bullets={[
            "Home extensions and additions",
            "Kitchen and bathroom renovations",
            "Internal alterations and layout changes",
            "Structural modifications and upgrades",
            "New rooms and living spaces",
            "Interior and exterior renovation work",
          ]}
          body="Careful planning helps new work blend naturally with the existing home while keeping disruption as manageable as possible. Trades, materials and construction stages are coordinated throughout the project so the renovation can progress smoothly while maintaining access and practicality where possible."
          images={renovationImages}
          theme="navy"
        />
        <ServiceDetailSection
          id="outdoor-living"
          eyebrow="Outdoor Living"
          title="Shape Your Outdoor Space"
          intro="Outdoor living projects can add usable space, privacy and structure to your property while making the most of the section around your home. Travis Wood Builder works across a range of exterior projects, from entertaining areas through to practical boundary and landscaping structures."
          bullets={[
            "Timber decking and outdoor platforms",
            "Fencing and privacy screens",
            "Pergolas and covered areas",
            "Timber retaining walls",
            "Outdoor stairs and accessways",
            "Custom exterior timber features",
          ]}
          body="Each project can be completed as a standalone upgrade or incorporated into wider work around the property. Materials, dimensions and finishes are selected to suit the home, site conditions and intended use, creating outdoor areas that are practical, well integrated and ready for everyday use."
          images={outdoorImages}
        />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
