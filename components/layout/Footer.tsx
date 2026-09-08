import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { getMediaAlt, requireMediaUrl } from "@/lib/payload/client";
import type { CmsLink, Navigation, SiteSettings } from "@/lib/payload/types";
import { SiteContainer } from "./SiteContainer";

function FooterNavLink({ link, isActive }: { link: CmsLink; isActive: boolean }) {
  const className = `group relative text-lg uppercase leading-7 transition-[color,font-weight] hover:font-normal hover:text-brand-gold lg:text-xl ${
    isActive ? "font-normal text-brand-gold" : "font-light text-white"
  }`;
  const content = (
    <>
      {link.label}
      <span
        className={`absolute inset-x-0 -bottom-1 h-px origin-left bg-brand-gold transition-transform ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </>
  );

  if (link.url.includes("#")) {
    return (
      <a href={link.url} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={link.url} className={className}>
      {content}
    </Link>
  );
}

type FooterProps = {
  activePath: "/" | "/contact" | "/services";
  navigation: Navigation;
  settings: SiteSettings;
};

export function Footer({ activePath, navigation, settings }: FooterProps) {
  const logo = {
    src: requireMediaUrl(settings.logo, "site logo"),
    alt: getMediaAlt(settings.logo, settings.businessName),
  };
  const socialIcons = settings.socialLinks.map((social) => ({
    platform: social.platform,
    url: social.url,
    icon: requireMediaUrl(social.icon, `${social.platform} icon`),
  }));
  const legalLinks = settings.footer.legalLinks.filter(
    (link) => link.url.trim() && link.url !== "#",
  );

  return (
    <footer className="bg-brand-navy/65 py-12 lg:pb-12 lg:pt-16">
      <SiteContainer>
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <BrandLogo
            variant="footer"
            src={logo.src}
            alt={logo.alt}
            businessName={settings.businessName}
          />
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {navigation.footerLinks.map((link) => {
              const isActive = link.url === activePath;

              return (
                <FooterNavLink
                  key={`${link.url}-${link.label}`}
                  link={link}
                  isActive={isActive}
                />
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            {socialIcons.map((social) => (
              <a
                key={`${social.platform}-${social.url}`}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${settings.businessName} on ${social.platform}`}
                className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/10"
              >
                <Image src={social.icon} alt="" width={22} height={22} unoptimized />
              </a>
            ))}
          </div>
        </div>
        <div className="mt-14 border-t border-brand-gold pt-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center text-sm font-light leading-6 text-white md:flex-row md:gap-6 lg:text-base">
            <p>{settings.footer.copyright}</p>
            {legalLinks.length ? (
              <div className="flex flex-wrap justify-center gap-6">
                {legalLinks.map((link) => (
                  <Link
                    key={`${link.url}-${link.label}`}
                    href={link.url}
                    className="underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </SiteContainer>
    </footer>
  );
}
