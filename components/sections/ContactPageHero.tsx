import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { LinkButton } from "@/components/ui/Button";

export function ContactPageHero() {
  return (
    <section id="top" className="relative min-h-[620px] overflow-hidden lg:h-[634px] lg:min-h-0">
      <Image
        src="/figma/gallery-2.png"
        alt="Architectural home under construction by Travis Wood Builder"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/30" />
      <Navbar activePage="contact" />
      <SiteContainer className="relative z-10 flex min-h-[620px] items-end pb-12 pt-36 lg:h-[634px] lg:min-h-0">
        <div className="max-w-[970px]">
          <h1 className="text-[clamp(3rem,6vw,5rem)] font-medium uppercase leading-[1.2] tracking-[0.05em] text-white">
            Let&apos;s Talk About Your Project
          </h1>
          <p className="mt-7 max-w-[900px] text-base font-normal leading-7 text-white sm:text-lg">
            Planning a new build, renovation or outdoor project? Get in touch to discuss your ideas and next
            steps.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <LinkButton href="/#about">About Us</LinkButton>
            <LinkButton href="/services">Services</LinkButton>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
