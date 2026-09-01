import Image from "next/image";
import Link from "next/link";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";

type ServiceCardProps = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  layout: "new-builds" | "outdoor" | "renovations";
};

function ServiceCard({
  title,
  description,
  image,
  imageAlt,
  layout,
}: ServiceCardProps) {
  const outerCorners = {
    "new-builds": "rounded-bl-[80px] lg:rounded-bl-[100px]",
    outdoor: "rounded-bl-[80px] rounded-tl-[80px] lg:rounded-bl-none lg:rounded-br-[100px] lg:rounded-tl-[100px]",
    renovations: "rounded-bl-[80px] rounded-tl-[80px] lg:col-span-2 lg:grid-cols-[1fr_1.056fr] lg:rounded-bl-none lg:rounded-br-[100px] lg:rounded-tl-[100px]",
  }[layout];
  const contentCorners =
    layout === "new-builds"
      ? "rounded-br-[80px] lg:rounded-br-none lg:rounded-tr-[100px]"
      : "rounded-br-[80px] lg:rounded-br-[100px]";

  return (
    <article className={`group grid overflow-hidden bg-black lg:grid-cols-2 ${outerCorners}`}>
      <div className="relative min-h-[270px] lg:min-h-[368px]">
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
      <div
        className={`flex flex-col justify-center gap-4 border-[0.5px] border-l-0 border-brand-gold p-6 lg:min-h-[368px] ${contentCorners}`}
      >
        <h3 className="text-[clamp(2rem,3.2vw,2.5rem)] font-medium uppercase leading-[1.2] tracking-[0.05em] text-white">
          {title}
        </h3>
        <p className="text-base font-light leading-6 text-white">{description}</p>
        <Link href="#contact" className="mt-2 inline-flex items-center gap-2 self-start text-base uppercase text-white hover:text-brand-gold">
          Learn more
          <Image src="/figma/arrow.svg" alt="" width={22} height={22} />
        </Link>
      </div>
    </article>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="bg-black py-16 lg:min-h-[1109px] lg:py-[33px]">
      <SiteContainer>
        <SectionHeading eyebrow="Our Services" title="For Every Part of Your Home" titleClassName="max-w-[800px]!" />
        <div className="mt-12 grid gap-8 lg:mt-[30px] lg:grid-cols-2">
          <ServiceCard
            title="New Builds"
            description="Architectural and residential new builds, delivered with quality workmanship, considered details and a clear focus on lasting quality and finishes."
            image="/figma/service-new-builds.png"
            imageAlt="Architectural new home by Travis Wood Builder"
            layout="new-builds"
          />
          <ServiceCard
            title="Outdoor Living"
            description="Decks, fences, pergolas and retaining walls built to create practical outdoor spaces that complement your home and make better use of your section."
            image="/figma/service-outdoor-living.png"
            imageAlt="Outdoor living and pool area built in Whangārei"
            layout="outdoor"
          />
          <ServiceCard
            title="Renovations & Extensions"
            description="Renovations and extensions that improve how your home looks, feels and functions with high-quality workmanship from planning through to completion."
            image="/figma/service-renovations.jpg"
            imageAlt="Residential extension under construction"
            layout="renovations"
          />
        </div>
      </SiteContainer>
    </section>
  );
}
