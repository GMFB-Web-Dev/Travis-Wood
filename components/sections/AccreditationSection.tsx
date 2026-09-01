import Image from "next/image";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AccreditationSection() {
  return (
    <section className="bg-black py-16 lg:min-h-[378px] lg:py-[33px]">
      <SiteContainer className="relative">
        <SectionHeading eyebrow="Licensed & Experienced." title="Experience You Can Build On" />
        <div className="mt-8 lg:mt-10">
          <p className="max-w-[890px] text-base font-light leading-6 text-white">
            Licensed Building Practitioner (LBP) accredited, Travis Wood Builder brings over 20 years of
            building experience to residential projects across Whangārei, with a strong focus on quality
            workmanship and reliable delivery.
          </p>
        </div>
        <div className="relative mx-auto mt-10 size-[194px] lg:absolute lg:right-[78px] lg:top-[38px] lg:mt-0">
          <Image
            src="/figma/accreditation.png"
            alt="Licensed Building Practitioner accreditation"
            fill
            sizes="194px"
            className="object-contain"
          />
        </div>
      </SiteContainer>
    </section>
  );
}
