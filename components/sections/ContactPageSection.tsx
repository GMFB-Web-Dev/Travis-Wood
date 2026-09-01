import Image from "next/image";
import { ContactForm } from "@/components/forms/ContactForm";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";

const contactDetails = [
  {
    icon: "/figma/email.svg",
    title: "Email",
    value: "traviswoodbuilder@gmail.com",
    href: "mailto:traviswoodbuilder@gmail.com",
  },
  {
    icon: "/figma/phone.svg",
    title: "Phone",
    value: "021 221 9834",
    href: "tel:+64212219834",
  },
  {
    icon: "/figma/pin.svg",
    title: "Area",
    value: "Whangārei",
    href: "https://maps.app.goo.gl/jvwdSMkDjaRZmKyP6",
  },
];

export function ContactPageSection() {
  return (
    <section className="rounded-br-[100px] rounded-tl-[100px] bg-brand-navy py-16 lg:min-h-[1139px] lg:py-[33px]">
      <SiteContainer>
        <SectionHeading
          eyebrow="Contact Us"
          title="Start Your Build With Us"
          titleClassName="max-w-none!"
        />

        <address className="mt-12 grid gap-10 not-italic sm:grid-cols-3 lg:mt-[46px]">
          {contactDetails.map((detail) => {
            const external = detail.href.startsWith("http");
            return (
              <div key={detail.title} className="flex flex-col items-center text-center">
                <div className="flex size-14 items-center justify-center rounded-full border border-brand-gold">
                  <Image src={detail.icon} alt="" width={32} height={32} />
                </div>
                <h2 className="mt-6 text-2xl font-light uppercase leading-8 text-white lg:text-[28px]">
                  {detail.title}
                </h2>
                <a
                  href={detail.href}
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

        <ContactForm surface="navy" className="mt-20 lg:mt-[94px]" />
      </SiteContainer>
    </section>
  );
}
