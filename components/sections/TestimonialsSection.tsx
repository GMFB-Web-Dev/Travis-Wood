import Image from "next/image";
import { SiteContainer } from "@/components/layout/SiteContainer";

export function TestimonialsSection() {
  return (
    <section className="bg-black py-8 lg:min-h-[403px]">
      <SiteContainer>
        <div className="relative flex min-h-[336px] items-center rounded-br-[1000px] rounded-tl-[1000px] bg-brand-navy/65 px-12 py-12 sm:px-24 lg:px-[170px]">
          <button type="button" aria-label="Previous testimonial" className="absolute left-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold sm:left-10 lg:left-[70px]">
            <Image src="/figma/chevron-left.svg" alt="" width={26} height={26} />
          </button>
          <figure className="mx-auto w-full max-w-[800px] text-center">
              <blockquote className="text-base font-normal leading-[1.4] tracking-[-0.02em] text-white sm:text-lg">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ornare lacus hendrerit orci
                  porta, id lacinia sapien dapibus. Vestibulum ante ipsum primis in faucibus orci luctus et
                  ultrices posuere cubilia curae; Aenean volutpat sem vel elit elementum sollicitudin.
                </p>
              </blockquote>
              <figcaption className="mt-8 text-xl font-semibold leading-7 text-white">John Doe</figcaption>
              <Image src="/figma/carousel-dots.svg" alt="" width={96} height={28} className="mx-auto mt-4 h-auto w-24" />
          </figure>
          <button type="button" aria-label="Next testimonial" className="absolute right-3 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-brand-gold sm:right-10 lg:right-[70px]">
            <Image src="/figma/chevron-right.svg" alt="" width={26} height={26} />
          </button>
        </div>
      </SiteContainer>
    </section>
  );
}
