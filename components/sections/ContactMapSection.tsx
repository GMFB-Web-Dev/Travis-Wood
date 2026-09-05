import { SiteContainer } from "@/components/layout/SiteContainer";
import type { MapSectionBlock } from "@/lib/payload/types";

export function ContactMapSection({ block }: { block: MapSectionBlock }) {
  return (
    <section className="bg-black py-8 lg:min-h-[766px] lg:py-[33px]">
      <SiteContainer>
        <h2 className="sr-only">{block.title}</h2>
        <div className="aspect-[1311/700] min-h-[360px] overflow-hidden rounded-br-[100px] rounded-tl-[100px] bg-brand-navy/65">
          <iframe
            title={block.title}
            src={block.embedURL}
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        </div>
      </SiteContainer>
    </section>
  );
}
