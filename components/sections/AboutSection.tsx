import Image from "next/image";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AboutSection() {
  return (
    <>
      <section id="about" className="bg-black py-20 lg:min-h-[480px] lg:py-16">
        <SiteContainer className="grid items-start gap-10 lg:grid-cols-[451px_1fr] lg:gap-10 lg:px-[90px]">
          <SectionHeading eyebrow="About Us" title="Built With Purpose" />
          <div className="max-w-[830px] text-base font-light leading-6 text-white">
            <p>
              Travis Wood Builder was founded in Whangārei in 2021, built on more than 20 years of hands-on
              building experience. Travis began his career around the age of 25, leaving his job to take on an
              apprenticeship before working with small building companies across Auckland and Whangārei.
              Starting his own business was the natural next step, giving him the freedom to focus on the kind
              of work he enjoys most.
            </p>
            <p className="mt-6">
              Today, Travis works alongside an apprentice and trusted subcontractors to deliver high-quality
              residential building with a strong focus on architectural new builds. From the first stages
              through to the final finish, the team values quality workmanship, reliable timeframes and
              creating homes that feel considered, individual and built to stand apart across Northland too.
            </p>
            <LinkButton href="#contact" className="mt-7 px-5">Contact Us</LinkButton>
          </div>
        </SiteContainer>
      </section>
      <div className="relative h-[260px] overflow-hidden rounded-br-[1000px] rounded-tl-[1000px] sm:h-[320px] lg:h-[368px]">
        <Image
          src="/figma/about-divider.png"
          alt="Residential construction project in progress near Whangārei"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </>
  );
}
