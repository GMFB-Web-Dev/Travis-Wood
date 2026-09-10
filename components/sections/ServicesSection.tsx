import Image from "next/image";
import Link from "next/link";
import { SiteContainer } from "@/components/layout/SiteContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { requireMediaUrl } from "@/lib/payload/client";
import type { ServicesGridBlock } from "@/lib/payload/types";

type ServiceCardProps = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  linkLabel: string;
  layout: "new-builds" | "outdoor" | "renovations";
};

function ServiceCard({
  title,
  description,
  image,
  imageAlt,
  href,
  linkLabel,
  layout,
}: ServiceCardProps) {
  const outerCorners = {
    "new-builds": "rounded-bl-[80px] lg:rounded-bl-[100px]",
    outdoor: "rounded-bl-[80px] rounded-tl-[80px] lg:rounded-bl-none lg:rounded-br-[100px] lg:rounded-tl-[100px]",
    renovations: "rounded-bl-[80px] rounded-tl-[80px] lg:col-span-2 lg:grid-cols-[1fr_1.056fr] lg:rounded-bl-none lg:rounded-br-[100px] lg:rounded-tl-[100px]",
  }[layout];
  const contentCorners =
    layout === "new-builds"
      ? "rounded-bl-[80px] rounded-br-[80px] lg:rounded-bl-none lg:rounded-br-none lg:rounded-tr-[100px]"
      : "rounded-bl-[80px] rounded-br-[80px] lg:rounded-bl-none lg:rounded-br-[100px]";

  return (
    <article className={`group grid overflow-hidden bg-black lg:grid-cols-2 ${outerCorners}`}>
      <div className="relative min-h-[270px] lg:min-h-[368px]">
        <Image src={image} alt={imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
      <div
        className={`flex flex-col justify-center gap-4 border border-brand-gold p-6 lg:min-h-[368px] lg:border-[0.5px] lg:border-l-0 ${contentCorners}`}
      >
        <h3 className="text-[clamp(2rem,3.2vw,2.5rem)] font-medium uppercase leading-[1.2] tracking-[0.05em] text-white">
          {title}
        </h3>
        <p className="text-base font-light leading-6 text-white">{description}</p>
        <Link
          href={href}
          className="mt-2 inline-flex items-center gap-2 self-start text-base uppercase text-white transition-colors hover:text-brand-gold focus-visible:text-brand-gold"
        >
          {linkLabel}
          <svg
            viewBox="0 0 22 22"
            className="size-[22px] shrink-0"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M5 11h12M11 5l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}

export function ServicesSection({ block }: { block: ServicesGridBlock }) {
  const layouts = ["new-builds", "outdoor", "renovations"] as const;

  return (
    <section id={block.anchor || undefined} className="bg-black py-16 lg:min-h-[1109px] lg:py-[33px]">
      <SiteContainer>
        <SectionHeading eyebrow={block.eyebrow} title={block.heading} titleClassName="max-w-[800px]!" />
        <div className="mt-12 grid gap-8 lg:mt-[30px] lg:grid-cols-2">
          {block.services.map((service, index) => (
            <ServiceCard
              key={`${service.url}-${service.title}`}
              title={service.title}
              description={service.description}
              image={requireMediaUrl(service.image, `service card "${service.title}"`, "card")}
              imageAlt={
                service.alt ||
                `${service.title} project by Travis Wood Builder in Whangārei`
              }
              href={service.url}
              linkLabel={service.linkLabel}
              layout={layouts[index] || "renovations"}
            />
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}
