import Image from "next/image";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getMediaAlt, requireMediaUrl } from "@/lib/payload/client";
import type { AccreditationSectionBlock } from "@/lib/payload/types";

export function AccreditationSection({ block }: { block: AccreditationSectionBlock }) {
  return (
    <section className="bg-black py-16 lg:min-h-[378px] lg:py-[33px]">
      <SiteContainer className="relative">
        <SectionHeading eyebrow={block.eyebrow} title={block.heading} />
        <div className="mt-8 lg:mt-10">
          <p className="max-w-[890px] text-base font-light leading-6 text-white">
            {block.description}
          </p>
        </div>
        <div className="relative mx-auto mt-10 size-[194px] lg:absolute lg:right-[78px] lg:top-[38px] lg:mt-0">
          <Image
            src={requireMediaUrl(block.image, "accreditation image", "thumbnail")}
            alt={
              block.imageAlt ||
              getMediaAlt(block.image, "Travis Wood Builder trade accreditation")
            }
            fill
            sizes="194px"
            className="object-contain"
          />
        </div>
      </SiteContainer>
    </section>
  );
}
