import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { LinkButton } from "@/components/ui/Button";
import { getMediaAlt, requireMediaUrl, requireUiAsset } from "@/lib/payload/client";
import type { HeroSectionBlock, Navigation, SiteSettings } from "@/lib/payload/types";

type ServicesPageHeroProps = {
  block: HeroSectionBlock;
  navigation: Navigation;
  settings: SiteSettings;
  imageTitle: string;
  imageAlt: string;
};

export function ServicesPageHero({
  block,
  navigation,
  settings,
  imageTitle,
  imageAlt,
}: ServicesPageHeroProps) {
  const buttons = block.buttons.length ? block.buttons : [settings.primaryCTA];

  return (
    <section id="top" className="relative min-h-[620px] overflow-hidden lg:h-[634px] lg:min-h-0">
      <Image
        src={requireMediaUrl(block.backgroundImage, "services hero", "hero")}
        alt={imageAlt}
        title={imageTitle}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      <Navbar
        activePath="/services"
        links={navigation.headerLinks}
        cta={navigation.headerCTA}
        logo={{
          src: requireMediaUrl(settings.logo, "site logo"),
          alt: getMediaAlt(settings.logo, settings.businessName),
          businessName: settings.businessName,
        }}
        phoneIcon={requireUiAsset(settings, "phone")}
      />
      <SiteContainer className="relative z-10 flex min-h-[620px] items-end pb-12 pt-36 lg:h-[634px] lg:min-h-0">
        <div className="max-w-[1040px]">
          <h1 className="text-[clamp(3rem,6vw,5rem)] font-medium uppercase leading-[1.15] tracking-[0.05em] text-white">
            {block.heading}
          </h1>
          <p className="mt-7 max-w-[950px] text-base font-normal leading-7 text-white sm:text-lg">
            {block.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {buttons.map((button) => (
              <LinkButton key={`${button.url}-${button.label}`} href={button.url}>
                {button.label}
              </LinkButton>
            ))}
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
