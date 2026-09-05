import Image from "next/image";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { LinkButton } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { AboutSectionBlock } from "@/lib/payload/types";
import { SITE_ASSETS } from "@/lib/site-assets";

export function AboutSection({ block }: { block: AboutSectionBlock }) {
  return (
    <>
      <section id={block.anchor || undefined} className="scroll-mt-28 bg-black py-20 lg:min-h-[480px] lg:py-16">
        <SiteContainer className="grid items-start gap-10 lg:grid-cols-[451px_1fr] lg:gap-10 lg:px-[90px]">
          <SectionHeading eyebrow={block.eyebrow} title={block.heading} />
          <div className="max-w-[830px] text-base font-light leading-6 text-white">
            {block.paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.text.slice(0, 24)}`} className={index ? "mt-6" : undefined}>
                {paragraph.text}
              </p>
            ))}
            <LinkButton href={block.cta.url} className="mt-7 px-5">{block.cta.label}</LinkButton>
          </div>
        </SiteContainer>
      </section>
      <div className="relative h-[260px] overflow-hidden rounded-br-[1000px] rounded-tl-[1000px] sm:h-[320px] lg:h-[368px]">
        <Image
          src={SITE_ASSETS.about}
          alt={block.imageAlt}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </>
  );
}
