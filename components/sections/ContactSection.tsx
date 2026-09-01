import Image from "next/image";
import { ContactForm } from "@/components/forms/ContactForm";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";

const details = [
  { icon: "/figma/email.svg", label: "traviswoodbuilder@gmail.com", href: "mailto:traviswoodbuilder@gmail.com" },
  { icon: "/figma/phone.svg", label: "021 221 9834", href: "tel:+64212219834" },
  { icon: "/figma/pin.svg", label: "Whangarei", href: "https://maps.app.goo.gl/jvwdSMkDjaRZmKyP6" },
];

export function ContactSection() {
  return (
    <section id="contact" className="bg-black py-16 lg:min-h-[733px] lg:py-[33px]">
      <SiteContainer>
        <p className="font-script text-[52px] leading-[0.6] text-brand-gold sm:text-[58px] lg:text-[64px]">Contact Us</p>
        <div className="mt-5 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading eyebrow="" title="Let’s Talk About Your Project" className="[&>p]:hidden" />
            <address className="mt-8 flex flex-col gap-4 not-italic">
              {details.map((detail) => (
                <a key={detail.label} href={detail.href} target={detail.href.startsWith("http") ? "_blank" : undefined} rel={detail.href.startsWith("http") ? "noreferrer" : undefined} className="flex items-center gap-4 text-base font-light leading-7 text-white hover:text-brand-gold sm:text-lg">
                  <Image src={detail.icon} alt="" width={32} height={32} />
                  {detail.label}
                </a>
              ))}
            </address>
          </div>
          <ContactForm />
        </div>
      </SiteContainer>
    </section>
  );
}
