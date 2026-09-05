import Image from "next/image";
import Link from "next/link";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { getMediaAlt, requireMediaUrl } from "@/lib/payload/client";
import type { ServiceDetailBlock } from "@/lib/payload/types";
import type { ServiceGalleryImage } from "./ServiceGallery";
import { ServiceGallery } from "./ServiceGallery";

type ServiceDetailSectionProps = {
  block: ServiceDetailBlock;
  arrowIcon: string;
  previousIcon: string;
  nextIcon: string;
};

export function ServiceDetailSection({
  block,
  arrowIcon,
  previousIcon,
  nextIcon,
}: ServiceDetailSectionProps) {
  const { anchor, eyebrow, heading, intro, includedHeading, bullets, body, theme, cta } = block;
  const isNavy = theme === "navy";
  const images: ServiceGalleryImage[] = block.images.map((image, index) => ({
    src: requireMediaUrl(image.image, `${eyebrow} gallery image ${index + 1}`, "card"),
    alt:
      image.alt ||
      getMediaAlt(
        image.image,
        `${eyebrow} project by Travis Wood Builder in Whangārei, image ${index + 1}`,
      ),
  }));

  return (
    <>
      <section
        id={anchor || undefined}
        className={`scroll-mt-20 py-16 lg:py-20 ${
          isNavy ? "rounded-tl-[100px] bg-brand-navy/65" : "bg-black"
        }`}
      >
        <SiteContainer className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <header>
            <p className="font-script text-[52px] leading-[0.75] text-brand-gold sm:text-[60px] lg:text-[64px]">
              {eyebrow}
            </p>
            <h2 className="mt-5 max-w-[580px] text-[clamp(2.35rem,4.5vw,4rem)] font-medium uppercase leading-[1.15] tracking-[0.05em] text-white">
              {heading}
            </h2>
          </header>

          <div className="text-base font-light leading-7 text-white sm:text-lg">
            <p>{intro}</p>
            <h3 className="mt-8 text-xl font-medium text-white sm:text-2xl">{includedHeading}</h3>
            <ul className="mt-4 flex flex-col gap-2">
              {bullets.map((bullet) => (
                <li key={bullet.text} className="flex gap-3">
                  <span className="mt-[11px] size-1.5 shrink-0 rounded-full bg-brand-gold" aria-hidden="true" />
                  <span>{bullet.text}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8">{body}</p>
            <Link
              href={cta.url}
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-br-[1000px] rounded-tl-[1000px] border border-brand-gold px-8 py-3 text-base font-normal uppercase text-white transition-colors hover:bg-brand-gold hover:text-black"
            >
              {cta.label}
              <Image src={arrowIcon} alt="" width={22} height={22} unoptimized />
            </Link>
          </div>
        </SiteContainer>
      </section>
      <ServiceGallery
        label={eyebrow}
        images={images}
        theme={theme}
        previousIcon={previousIcon}
        nextIcon={nextIcon}
      />
    </>
  );
}
