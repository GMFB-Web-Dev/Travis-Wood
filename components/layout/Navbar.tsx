"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FocusEvent, type MouseEvent } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import type { CmsLink } from "@/lib/payload/types";
import { SiteContainer } from "./SiteContainer";

const serviceLinks = [
  { label: "New Builds", url: "/services#new-builds" },
  { label: "Renovations & Extensions", url: "/services#renovations-extensions" },
  { label: "Outdoor Living", url: "/services#outdoor-living" },
] as const;

function ChevronDown({ open = false }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 10"
      className={`h-2.5 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      aria-hidden="true"
    >
      <path d="m1 1 7 7 7-7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

type NavbarProps = {
  activePath: "/" | "/contact" | "/services";
  links: CmsLink[];
  cta: CmsLink;
  logo: {
    src: string;
    alt: string;
    businessName: string;
  };
  phoneIcon: string;
};

export function Navbar({ activePath, links, cta, logo, phoneIcon }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateNavbar = () => setScrolled(window.scrollY > 24);
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setMobileServicesOpen(false);
      setDesktopServicesOpen(false);
    };

    updateNavbar();
    window.addEventListener("scroll", updateNavbar, { passive: true });
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("scroll", updateNavbar);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const closeMobileMenu = () => {
    setOpen(false);
    setMobileServicesOpen(false);
  };

  const handleServicesBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setDesktopServicesOpen(false);
    }
  };

  const handleNavigationClick = (
    event: MouseEvent<HTMLAnchorElement>,
    url: string,
    closeMenu = false,
  ) => {
    if (closeMenu) closeMobileMenu();

    const target = new URL(url, window.location.href);
    const isSamePageHash =
      target.origin === window.location.origin &&
      target.pathname === window.location.pathname &&
      Boolean(target.hash);

    if (!isSamePageHash) return;

    event.preventDefault();
    const targetId = decodeURIComponent(target.hash.slice(1));
    window.history.replaceState(
      window.history.state,
      "",
      `${target.pathname}${target.search}${target.hash}`,
    );
    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 isolate h-20 pointer-events-auto transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open || desktopServicesOpen
          ? "bg-brand-navy/95 shadow-lg shadow-black/20 backdrop-blur-md"
          : "bg-transparent"
      }`}
      aria-label="Primary navigation"
    >
      <SiteContainer className="flex h-full items-center justify-between">
        <BrandLogo {...logo} />

        <div className="hidden items-center gap-8 lg:flex">
          <div className="flex items-center gap-8">
            {links.map((link) => {
              const isActive = link.url === activePath;

              if (link.url === "/services") {
                return (
                  <div
                    key={`${link.url}-${link.label}`}
                    className="group/services relative"
                    onMouseEnter={() => setDesktopServicesOpen(true)}
                    onMouseLeave={() => setDesktopServicesOpen(false)}
                    onFocus={() => setDesktopServicesOpen(true)}
                    onBlur={handleServicesBlur}
                  >
                    <Link
                      href={link.url}
                      aria-haspopup="true"
                      className={`relative flex items-center gap-2 py-2 text-lg uppercase leading-6 transition-[color,font-weight] hover:font-normal hover:text-brand-gold ${
                        isActive ? "font-normal text-brand-gold" : "font-light text-white"
                      }`}
                    >
                      {link.label}
                      <ChevronDown open={desktopServicesOpen} />
                      <span
                        className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-brand-gold transition-transform ${
                          isActive || desktopServicesOpen
                            ? "scale-x-100"
                            : "scale-x-0"
                        }`}
                      />
                    </Link>

                    <div
                      className={`absolute left-1/2 top-full z-20 w-64 -translate-x-1/2 pt-5 transition-[opacity,transform,visibility] duration-200 ${
                        desktopServicesOpen
                          ? "visible translate-y-0 opacity-100"
                          : "invisible translate-y-1 opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden bg-brand-navy shadow-xl shadow-black/30">
                        {serviceLinks.map((service) => (
                          <Link
                            key={service.url}
                            href={service.url}
                            onClick={(event) => {
                              setDesktopServicesOpen(false);
                              event.currentTarget.blur();
                              handleNavigationClick(event, service.url);
                            }}
                            className="block border-b border-white/10 px-6 py-3.5 text-base font-light uppercase leading-6 text-white transition-[background-color,color,font-weight] last:border-b-0 hover:bg-white hover:font-normal hover:text-brand-navy focus-visible:bg-white focus-visible:font-normal focus-visible:text-brand-navy"
                          >
                            {service.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={`${link.url}-${link.label}`}
                  href={link.url}
                  onClick={(event) => handleNavigationClick(event, link.url)}
                  className={`group relative py-2 text-lg uppercase leading-6 transition-[color,font-weight] hover:font-normal hover:text-brand-gold ${
                    isActive ? "font-normal text-brand-gold" : "font-light text-white"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-brand-gold transition-transform ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
          <a
            href={cta.url}
            className="rounded-br-[1000px] rounded-tl-[1000px] border border-brand-gold px-[18px] py-2.5 text-lg font-light leading-[0.7] text-white transition-colors hover:bg-brand-gold hover:text-black"
          >
            {cta.label}
          </a>
        </div>

        <button
          type="button"
          className="flex size-11 touch-manipulation select-none items-center justify-center rounded-full border border-brand-gold bg-black/35 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => {
            if (open) setMobileServicesOpen(false);
            setOpen((value) => !value);
          }}
        >
          <span className="relative block h-4 w-5" aria-hidden="true">
            <span className={`absolute left-0 top-0 h-px w-5 bg-white transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-[7px] h-px w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-[14px] h-px w-5 bg-white transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </span>
        </button>
      </SiteContainer>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 top-20 z-50 max-h-[calc(100svh-5rem)] touch-manipulation overflow-y-auto overscroll-contain border-t border-brand-gold/40 bg-black/95 px-5 py-6 pointer-events-auto backdrop-blur-lg lg:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-1">
            {links.map((link) => {
              if (link.url === "/services") {
                return (
                  <div key={`${link.url}-${link.label}`} className="border-b border-white/10">
                    <button
                      type="button"
                      className={`flex min-h-12 w-full touch-manipulation select-none items-center justify-between py-3 text-left text-lg uppercase transition-colors hover:text-brand-gold ${
                        mobileServicesOpen || activePath === "/services"
                          ? "text-brand-gold underline decoration-brand-gold underline-offset-8"
                          : "text-white"
                      }`}
                      aria-expanded={mobileServicesOpen}
                      aria-controls="mobile-services-menu"
                      onClick={() => setMobileServicesOpen((value) => !value)}
                    >
                      {link.label}
                      <ChevronDown open={mobileServicesOpen} />
                    </button>

                    {mobileServicesOpen && (
                      <div id="mobile-services-menu" className="mb-2 overflow-hidden bg-brand-navy">
                        {serviceLinks.map((service) => (
                          <Link
                            key={service.url}
                            href={service.url}
                            onClick={(event) =>
                              handleNavigationClick(event, service.url, true)
                            }
                            className="flex min-h-12 touch-manipulation items-center border-b border-white/10 px-5 py-3 text-base font-light uppercase leading-6 text-white transition-colors last:border-b-0 hover:bg-white hover:text-brand-navy active:bg-white active:text-brand-navy"
                          >
                            {service.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={`${link.url}-${link.label}`}
                  href={link.url}
                  onClick={(event) => handleNavigationClick(event, link.url, true)}
                  className={`flex min-h-12 touch-manipulation items-center border-b border-white/10 py-3 text-lg uppercase hover:text-brand-gold ${
                    link.url === activePath
                      ? "text-brand-gold underline decoration-brand-gold underline-offset-8"
                      : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a href={cta.url} className="mt-4 inline-flex min-h-12 touch-manipulation items-center gap-3 text-brand-gold">
              <Image src={phoneIcon} alt="" width={28} height={28} unoptimized />
              {cta.label}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
