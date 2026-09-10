import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { LinkButton } from "@/components/ui/Button";
import { getMediaAlt, requireMediaUrl, requireUiAsset } from "@/lib/payload/client";
import type { HeroSectionBlock, Navigation, SiteSettings } from "@/lib/payload/types";

type HeroSectionProps = {
  block: HeroSectionBlock;
  navigation: Navigation;
  settings: SiteSettings;
  imageTitle: string;
  imageAlt: string;
};

export function HeroSection({
  block,
  navigation,
  settings,
  imageTitle,
  imageAlt,
}: HeroSectionProps) {
  const buttons = block.buttons.length ? block.buttons : [settings.primaryCTA];

  return (
    <section id="top" className="relative min-h-[760px] overflow-hidden lg:min-h-[900px]">
      <Image
        src={requireMediaUrl(block.backgroundImage, "home hero", "hero")}
        alt={imageAlt}
        title={imageTitle}
        fill
        priority
        sizes="100vw"
        className="object-cover [transform:scaleX(-1)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/35" />
      <Navbar
        activePath="/"
        links={navigation.headerLinks}
        cta={navigation.headerCTA}
        logo={{
          src: requireMediaUrl(settings.logo, "site logo"),
          alt: getMediaAlt(settings.logo, settings.businessName),
          businessName: settings.businessName,
        }}
        phoneIcon={requireUiAsset(settings, "phone")}
      />
      <SiteContainer className="relative z-10 pt-[230px] sm:pt-[280px] lg:pt-[340px]">
        <div className="max-w-[1100px]">
          <h1 className="text-[clamp(3rem,6.2vw,5rem)] font-medium uppercase leading-[1.2] tracking-[0.05em] text-white">
            {block.heading}
          </h1>
          <p className="mt-6 max-w-[902px] text-base font-normal leading-7 text-white sm:text-lg">
            {block.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {buttons.map((button) => (
              <LinkButton
                key={`${button.url}-${button.label}`}
                href={button.label.trim().toLowerCase() === "services" ? "/services" : button.url}
              >
                {button.label}
              </LinkButton>
            ))}
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
