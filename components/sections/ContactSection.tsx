import Image from "next/image";
import { ContactForm } from "@/components/forms/ContactForm";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { requireMediaUrl } from "@/lib/payload/client";
import type { ContactSectionBlock, SiteSettings } from "@/lib/payload/types";
import { getBusinessContactDetail } from "@/lib/seo/config";

export function ContactSection({ block, settings }: { block: ContactSectionBlock; settings: SiteSettings }) {
  return (
    <section id={block.anchor || undefined} className="bg-black py-16 lg:min-h-[733px] lg:py-[33px]">
      <SiteContainer>
        <p className="font-script text-[52px] leading-[0.6] text-brand-gold sm:text-[58px] lg:text-[64px]">{block.eyebrow}</p>
        <div className="mt-5 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow="" title={block.heading} className="[&>p]:hidden" />
            <address className="mt-8 flex flex-col gap-4 not-italic">
              {block.details.map((detail) => {
                const { value, url } = getBusinessContactDetail(
                  detail.title,
                  detail.value,
                  detail.url,
                );

                return (
                  <a key={`${detail.title}-${value}`} href={url} target={url.startsWith("http") ? "_blank" : undefined} rel={url.startsWith("http") ? "noopener noreferrer" : undefined} className="flex items-center gap-4 text-base font-light leading-7 text-white hover:text-brand-gold sm:text-lg">
                    <Image src={requireMediaUrl(detail.icon, `${detail.title} icon`)} alt="" width={32} height={32} unoptimized />
                    {value}
                  </a>
                );
              })}
            </address>
          </div>
          {block.showForm && (
            <ContactForm
              settings={settings.contactForm}
              phonePlaceholder={settings.contact.phoneDisplay}
            />
          )}
        </div>
      </SiteContainer>
    </section>
  );
}
