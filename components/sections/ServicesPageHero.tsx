import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { LinkButton } from "@/components/ui/Button";

export function ServicesPageHero() {
  return (
    <section id="top" className="relative min-h-[620px] overflow-hidden lg:h-[634px] lg:min-h-0">
      <Image
        src="/figma/about-divider.png"
        alt="Residential construction project by Travis Wood Builder"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/40" />
      <Navbar activePage="services" />
      <SiteContainer className="relative z-10 flex min-h-[620px] items-end pb-12 pt-36 lg:h-[634px] lg:min-h-0">
        <div className="max-w-[1040px]">
          <h1 className="text-[clamp(3rem,6vw,5rem)] font-medium uppercase leading-[1.15] tracking-[0.05em] text-white">
            More Than One Way to Build
          </h1>
          <p className="mt-7 max-w-[950px] text-base font-normal leading-7 text-white sm:text-lg">
            New builds, renovations, extensions and outdoor living projects delivered across Whangārei and
            surrounding areas, with a focus on quality workmanship and reliable service.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <LinkButton href="/#about">About Us</LinkButton>
            <LinkButton href="/contact">Contact Us</LinkButton>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
