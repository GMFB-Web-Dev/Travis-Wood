import { SiteContainer } from "@/components/layout/SiteContainer";

export function ContactMapSection() {
  return (
    <section className="bg-black py-8 lg:min-h-[766px] lg:py-[33px]">
      <SiteContainer>
        <div className="aspect-[1311/700] min-h-[360px] overflow-hidden rounded-br-[100px] rounded-tl-[100px] bg-brand-navy/65">
          <iframe
            title="Google Map of the Travis Wood Builder service area around Whangārei"
            src="https://www.google.com/maps?q=Whangarei%2C%20New%20Zealand&z=12&output=embed"
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
