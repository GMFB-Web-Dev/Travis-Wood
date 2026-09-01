import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { SiteContainer } from "./SiteContainer";

const footerLinks = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact Us" },
];

export function Footer() {
  return (
    <footer className="bg-brand-navy/65 py-12 lg:pb-12 lg:pt-16">
      <SiteContainer>
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <BrandLogo />
          <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {footerLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg uppercase leading-7 hover:text-brand-gold lg:text-xl ${
                  index === 0 ? "text-brand-gold" : "font-light text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <a
            href="https://www.facebook.com/profile.php?id=61566712083135"
            target="_blank"
            rel="noreferrer"
            aria-label="Travis Wood Builder on Facebook"
            className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <Image src="/figma/facebook.svg" alt="" width={22} height={22} />
          </a>
        </div>
        <div className="mt-14 border-t border-brand-gold pt-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center text-sm font-light leading-6 text-white md:flex-row md:gap-6 lg:text-base">
            <p>2026 Developed by GMFB Ltd. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="#" className="underline underline-offset-4">Privacy Policy</Link>
              <Link href="#" className="underline underline-offset-4">Terms of Service</Link>
              <Link href="#" className="underline underline-offset-4">Cookies Settings</Link>
            </div>
          </div>
        </div>
      </SiteContainer>
    </footer>
  );
}
