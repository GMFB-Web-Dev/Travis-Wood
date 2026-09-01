"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { SiteContainer } from "./SiteContainer";

const links = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact Us" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="absolute inset-x-0 top-0 z-30 h-20" aria-label="Primary navigation">
      <SiteContainer className="flex h-full items-center justify-between">
        <BrandLogo />

        <div className="hidden items-center gap-8 lg:flex">
          <div className="flex items-center gap-8">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative py-2 text-lg uppercase leading-6 transition-colors hover:text-brand-gold ${
                  index === 0 ? "text-brand-gold" : "font-light text-white"
                }`}
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-brand-gold transition-transform group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
          <a
            href="tel:+64212219834"
            className="rounded-br-[1000px] rounded-tl-[1000px] border border-brand-gold px-[18px] py-2.5 text-lg font-light leading-[0.7] text-white transition-colors hover:bg-brand-gold hover:text-black"
          >
            021 221 9834
          </a>
        </div>

        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-full border border-brand-gold bg-black/35 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative block h-4 w-5" aria-hidden="true">
            <span className={`absolute left-0 top-0 h-px w-5 bg-white transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-[7px] h-px w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-[14px] h-px w-5 bg-white transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </SiteContainer>

      {open && (
        <div id="mobile-menu" className="border-t border-brand-gold/40 bg-black/95 px-5 py-6 backdrop-blur-lg lg:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-3 text-lg uppercase text-white hover:text-brand-gold"
              >
                {link.label}
              </Link>
            ))}
            <a href="tel:+64212219834" className="mt-4 inline-flex items-center gap-3 text-brand-gold">
              <Image src="/figma/phone.svg" alt="" width={28} height={28} />
              021 221 9834
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
