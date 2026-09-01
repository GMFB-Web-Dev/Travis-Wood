"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteContainer } from "@/components/layout/SiteContainer";

const CARD_GAP = 32;

export type ServiceGalleryImage = {
  src: string;
  alt: string;
};

type ServiceGalleryProps = {
  label: string;
  images: ServiceGalleryImage[];
  theme?: "black" | "navy";
};

type Paging = {
  cardsPerPage: number;
  pageCount: number;
  pageStep: number;
};

export function ServiceGallery({ label, images, theme = "black" }: ServiceGalleryProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [paging, setPaging] = useState<Paging>({ cardsPerPage: 3, pageCount: 2, pageStep: 1344 });

  const measure = useCallback(() => {
    const target = viewport.current;
    const card = target?.querySelector<HTMLElement>("[data-service-gallery-card]");
    if (!target || !card) return;

    const cardsPerPage = Math.max(1, Math.round((target.clientWidth + CARD_GAP) / (card.offsetWidth + CARD_GAP)));
    const pageCount = Math.ceil(images.length / cardsPerPage);
    const pageStep = cardsPerPage * (card.offsetWidth + CARD_GAP);
    setPaging({ cardsPerPage, pageCount, pageStep });
    setActivePage((current) => Math.min(current, pageCount - 1));
  }, [images.length]);

  const goToPage = useCallback(
    (page: number) => {
      const target = viewport.current;
      if (!target) return;
      const nextPage = (page + paging.pageCount) % paging.pageCount;
      const maxScroll = target.scrollWidth - target.clientWidth;
      target.scrollTo({ left: Math.min(nextPage * paging.pageStep, maxScroll), behavior: "smooth" });
      setActivePage(nextPage);
    },
    [paging],
  );

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => goToPage(activePage + 1), 5000);
    return () => window.clearInterval(timer);
  }, [activePage, goToPage, paused]);

  const syncActivePage = () => {
    const target = viewport.current;
    if (!target || !paging.pageStep) return;
    setActivePage(Math.min(paging.pageCount - 1, Math.round(target.scrollLeft / paging.pageStep)));
  };

  return (
    <section className={theme === "navy" ? "bg-brand-navy/65 pb-14" : "bg-black pb-14"} aria-label={`${label} project gallery`}>
      <SiteContainer>
        <div
          ref={viewport}
          onScroll={syncActivePage}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          className="flex snap-x snap-mandatory gap-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <div
              key={`${image.src}-${index}`}
              data-service-gallery-card
              className={`relative aspect-square w-full shrink-0 snap-start overflow-hidden lg:w-[416px] ${
                index % 2 === 0
                  ? "rounded-tl-[80px] sm:rounded-tl-[100px]"
                  : "rounded-br-[80px] sm:rounded-br-[100px]"
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1023px) calc(100vw - 40px), 416px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2" aria-label={`${label} gallery page ${activePage + 1} of ${paging.pageCount}`}>
            {Array.from({ length: paging.pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToPage(index)}
                aria-label={`Show ${label} gallery page ${index + 1}`}
                aria-current={activePage === index ? "true" : undefined}
                className={`size-2 rounded-full transition-colors ${
                  activePage === index ? "bg-brand-gold" : "bg-brand-gold/40 hover:bg-brand-gold/70"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => goToPage(activePage - 1)}
              aria-label={`Previous ${label} projects`}
              className="flex size-11 items-center justify-center rounded-full border border-brand-gold transition-colors hover:bg-brand-gold/15 sm:size-12"
            >
              <Image src="/figma/chevron-left.svg" alt="" width={26} height={26} />
            </button>
            <button
              type="button"
              onClick={() => goToPage(activePage + 1)}
              aria-label={`Next ${label} projects`}
              className="flex size-11 items-center justify-center rounded-full border border-brand-gold transition-colors hover:bg-brand-gold/15 sm:size-12"
            >
              <Image src="/figma/chevron-right.svg" alt="" width={26} height={26} />
            </button>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
