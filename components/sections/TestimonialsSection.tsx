"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteContainer } from "@/components/layout/SiteContainer";

type TestimonialsSectionProps = {
  testimonials: Array<{ quote: string; author: string }>;
  previousIcon: string;
  nextIcon: string;
};

export function TestimonialsSection({
  testimonials,
  previousIcon,
  nextIcon,
}: TestimonialsSectionProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const goToSlide = useCallback((slide: number) => {
    const next = (slide + testimonials.length) % testimonials.length;
    const target = viewport.current;
    target?.scrollTo({ left: next * target.clientWidth, behavior: "smooth" });
    setActiveSlide(next);
  }, [testimonials.length]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => goToSlide(activeSlide + 1), 5500);
    return () => window.clearInterval(timer);
  }, [activeSlide, goToSlide, paused]);

  const syncActiveSlide = () => {
    const target = viewport.current;
    if (!target?.clientWidth) return;
    setActiveSlide(Math.min(testimonials.length - 1, Math.round(target.scrollLeft / target.clientWidth)));
  };

  return (
    <section className="bg-black py-10 lg:min-h-[403px] lg:py-8">
      <SiteContainer>
        <div
          className="relative flex min-h-[430px] items-center rounded-br-[110px] rounded-tl-[110px] bg-brand-navy/65 py-14 sm:min-h-[360px] sm:rounded-br-[1000px] sm:rounded-tl-[1000px] sm:py-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => goToSlide(activeSlide - 1)}
            className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold bg-brand-navy/80 transition-colors hover:bg-brand-gold/15 sm:left-9 sm:size-12 lg:left-[70px]"
          >
            <Image src={previousIcon} alt="" width={26} height={26} unoptimized />
          </button>

          <div
            ref={viewport}
            onScroll={syncActiveSlide}
            className="flex w-full snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((testimonial, index) => (
              <figure
                key={testimonial.author}
                className="flex w-full shrink-0 snap-center flex-col justify-center px-[66px] text-center sm:px-28 lg:px-[190px]"
                aria-hidden={activeSlide !== index}
              >
                <blockquote className="mx-auto max-w-[830px] text-[15px] font-normal leading-6 tracking-[-0.02em] text-white sm:text-base sm:leading-7 lg:text-lg">
                  <p>{testimonial.quote}</p>
                </blockquote>
                <figcaption className="mt-7 text-base font-semibold leading-7 text-white sm:text-xl">
                  {testimonial.author}
                </figcaption>
              </figure>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => goToSlide(activeSlide + 1)}
            className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold bg-brand-navy/80 transition-colors hover:bg-brand-gold/15 sm:right-9 sm:size-12 lg:right-[70px]"
          >
            <Image src={nextIcon} alt="" width={26} height={26} unoptimized />
          </button>

          <div className="absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 gap-2" aria-label={`Testimonial ${activeSlide + 1} of ${testimonials.length}`}>
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.author}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Show testimonial ${index + 1}`}
                aria-current={activeSlide === index ? "true" : undefined}
                className={`size-2 rounded-full transition-colors ${
                  activeSlide === index ? "bg-brand-gold" : "bg-brand-gold/45 hover:bg-brand-gold/75"
                }`}
              />
            ))}
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
