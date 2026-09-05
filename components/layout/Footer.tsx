import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { Navigation, SiteSettings } from "@/lib/payload/types";
import { SITE_ASSETS } from "@/lib/site-assets";
import { SiteContainer } from "./SiteContainer";

type FooterProps = {
  navigation: Navigation;
  settings: SiteSettings;
};

export function Footer({ navigation, settings }: FooterProps) {
  const socialIcons = settings.socialLinks.map((social) => ({
    platform: social.platform,
    url: social.url,
    icon: SITE_ASSETS.facebook,
  }));

  return (
    <footer className="bg-brand-navy/65 py-12 lg:pb-12 lg:pt-16">
      <SiteContainer>
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <BrandLogo
            variant="footer"
            src={SITE_ASSETS.logo}
            alt={settings.businessName}
            businessName={settings.businessName}
          />
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {navigation.footerLinks.map((link, index) => (
              <Link
                key={`${link.url}-${link.label}`}
                href={link.url}
                className={`text-lg uppercase leading-7 hover:text-brand-gold lg:text-xl ${
                  index === 0 ? "text-brand-gold" : "font-light text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {socialIcons.map((social) => (
              <a
                key={`${social.platform}-${social.url}`}
                href={social.url}
                target="_blank"
                rel="noreferrer"
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
            <div className="flex flex-wrap justify-center gap-6">
              {settings.footer.legalLinks.map((link) => (
                <Link
                  key={`${link.url}-${link.label}`}
                  href={link.url}
                  className="underline underline-offset-4"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </SiteContainer>
    </footer>
  );
}
