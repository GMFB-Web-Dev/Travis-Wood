"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";

const CARD_GAP = 32;

type Paging = {
  cardsPerPage: number;
  pageCount: number;
  pageStep: number;
};

type WorkGalleryProps = {
  eyebrow: string;
  heading: string;
  projects: Array<{ src: string; alt: string }>;
  previousIcon: string;
  nextIcon: string;
};

export function WorkGallery({
  eyebrow,
  heading,
  projects,
  previousIcon,
  nextIcon,
}: WorkGalleryProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [paging, setPaging] = useState<Paging>({ cardsPerPage: 3, pageCount: 5, pageStep: 1344 });

  const measure = useCallback(() => {
    const target = viewport.current;
    const card = target?.querySelector<HTMLElement>("[data-gallery-card]");
    if (!target || !card) return;

    const cardsPerPage = Math.max(1, Math.round((target.clientWidth + CARD_GAP) / (card.offsetWidth + CARD_GAP)));
    const pageCount = Math.ceil(projects.length / cardsPerPage);
    const pageStep = cardsPerPage * (card.offsetWidth + CARD_GAP);
    setPaging({ cardsPerPage, pageCount, pageStep });
    setActivePage((current) => Math.min(current, pageCount - 1));
  }, [projects.length]);

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
    if (hovered) return;
    const timer = window.setInterval(() => goToPage(activePage + 1), 4500);
    return () => window.clearInterval(timer);
  }, [activePage, goToPage, hovered]);

  const syncActivePage = () => {
    const target = viewport.current;
    if (!target || !paging.pageStep) return;
    const page = Math.min(paging.pageCount - 1, Math.round(target.scrollLeft / paging.pageStep));
    setActivePage(page);
  };

  return (
    <section className="overflow-hidden bg-black py-16 lg:min-h-[713px] lg:py-[33px]">
      <SiteContainer>
        <SectionHeading eyebrow={eyebrow} title={heading} />
        <div
          ref={viewport}
          onScroll={syncActivePage}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="mt-8 flex snap-x snap-mandatory gap-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-2"
        >
          {projects.map((project) => (
            <div
              key={project.src}
              data-gallery-card
              className="relative aspect-square w-full shrink-0 snap-start overflow-hidden rounded-br-[80px] rounded-tl-[80px] sm:rounded-br-[100px] sm:rounded-tl-[100px] lg:w-[416px]"
            >
              <Image
                src={project.src}
                alt={project.alt}
                fill
                sizes="(max-width: 1023px) calc(100vw - 40px), 416px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center justify-between gap-3 sm:mt-12">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" aria-label={`Project gallery page ${activePage + 1} of ${paging.pageCount}`}>
            {Array.from({ length: paging.pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToPage(index)}
                aria-label={`Show project gallery page ${index + 1}`}
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
              aria-label="Previous projects"
              className="flex size-11 items-center justify-center rounded-full border border-brand-gold sm:size-12"
            >
              <Image src={previousIcon} alt="" width={26} height={26} unoptimized />
            </button>
            <button
              type="button"
              onClick={() => goToPage(activePage + 1)}
              aria-label="Next projects"
              className="flex size-11 items-center justify-center rounded-full border border-brand-gold sm:size-12"
            >
              <Image src={nextIcon} alt="" width={26} height={26} unoptimized />
            </button>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
