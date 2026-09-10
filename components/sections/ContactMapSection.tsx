import { siteConfig } from "@/lib/seo/config";

export function ContactMapSection() {
  return (
    <section className="bg-black py-8 lg:min-h-[766px] lg:py-[33px]">
      <div className="mx-5 md:mx-8 lg:mx-auto lg:max-w-[1312px]">
        <h2 className="sr-only">Travis Wood Builder service area in Whangārei</h2>
        <div className="aspect-[1311/700] min-h-[360px] w-full overflow-hidden rounded-br-[100px] rounded-tl-[100px] bg-brand-navy/65">
          <iframe
            title="Travis Wood Builder service area in Whangārei"
            src={siteConfig.business.mapEmbedUrl}
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
