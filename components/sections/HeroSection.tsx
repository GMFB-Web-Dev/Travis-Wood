import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { LinkButton } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section id="top" className="relative min-h-[760px] overflow-hidden lg:min-h-[900px]">
      <Image
        src="/figma/hero.png"
        alt="Architectural home built by Travis Wood Builder in Whangārei"
        fill
        priority
        sizes="100vw"
        className="object-cover [transform:scaleX(-1)]"
      />
      <div className="absolute inset-0 bg-black/35" />
      <Navbar />
      <SiteContainer className="relative z-10 pt-[230px] sm:pt-[280px] lg:pt-[340px]">
        <div className="max-w-[1100px]">
          <h1 className="text-[clamp(3rem,6.2vw,5rem)] font-medium uppercase leading-[1.2] tracking-[0.05em] text-white">
            Built for the Way You Want to Live
          </h1>
          <p className="mt-6 max-w-[902px] text-base font-normal leading-7 text-white sm:text-lg">
            From new homes and renovations to extensions, decks, pergolas, fences and retaining walls,
            we deliver quality residential building across Whangārei.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <LinkButton href="/contact">Contact Us</LinkButton>
            <LinkButton href="#services">Services</LinkButton>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
