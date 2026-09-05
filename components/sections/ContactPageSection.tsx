import Image from "next/image";
import { ContactForm } from "@/components/forms/ContactForm";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ContactSectionBlock, SiteSettings } from "@/lib/payload/types";
import { getContactIcon } from "@/lib/site-assets";

export function ContactPageSection({ block, settings }: { block: ContactSectionBlock; settings: SiteSettings }) {
  return (
    <section id={block.anchor || undefined} className="rounded-br-[100px] rounded-tl-[100px] bg-brand-navy py-16 lg:min-h-[1139px] lg:py-[33px]">
      <SiteContainer>
        <SectionHeading
          eyebrow={block.eyebrow}
          title={block.heading}
          titleClassName="max-w-none!"
        />

        <address className="mt-12 grid gap-10 not-italic sm:grid-cols-3 lg:mt-[46px]">
          {block.details.map((detail, index) => {
            const external = detail.url.startsWith("http");
            return (
              <div key={detail.title} className="flex flex-col items-center text-center">
                <div className="flex size-14 items-center justify-center rounded-full border border-brand-gold">
                  <Image src={getContactIcon(detail.title, index)} alt="" width={32} height={32} />
                </div>
                <h2 className="mt-6 text-2xl font-light uppercase leading-8 text-white lg:text-[28px]">
                  {detail.title}
                </h2>
                <a
                  href={detail.url}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="mt-5 text-base font-light text-white underline underline-offset-4 hover:text-brand-gold sm:text-lg"
                >
                  {detail.value}
                </a>
              </div>
            );
          })}
        </address>

        {block.showForm && (
          <ContactForm
            surface="navy"
            className="mt-20 lg:mt-[94px]"
            settings={settings.contactForm}
            phonePlaceholder={settings.contact.phoneDisplay}
          />
        )}
      </SiteContainer>
    </section>
  );
}
