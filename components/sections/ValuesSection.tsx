import { SiteContainer } from "@/components/layout/SiteContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";

const values = [
  {
    title: "Quality Workmanship",
    text: "Every build is completed with care, solid workmanship and a strong focus on the finish, ensuring the result feels considered, well built and made to last.",
  },
  {
    title: "Reliable Timeframes",
    text: "Good planning and efficient progress help keep projects moving without unnecessary delays, while still allowing the right amount of time for each stage of the build.",
  },
  {
    title: "Built With Character",
    text: "Custom and architectural projects allow more room for creativity, individuality and thoughtful design, creating homes that feel different from standard builds.",
  },
  {
    title: "Clear Collaboration",
    text: "Strong communication and a flexible approach help keep clients involved throughout the process, making decisions easier and the overall building experience smoother.",
  },
];

export function ValuesSection() {
  return (
    <section className="overflow-hidden rounded-br-[100px] rounded-tl-[100px] bg-brand-navy/65 py-14 lg:min-h-[403px] lg:py-[33px]">
      <SiteContainer>
        <SectionHeading eyebrow="Our Values" title="What Drives Every Build" />
        <div className="mt-8 grid md:grid-cols-2 lg:mt-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <article
              key={value.title}
              className={`min-w-0 border-white/70 py-7 md:px-6 lg:min-h-[195px] lg:px-5 lg:py-0 xl:px-6 ${
                index < values.length - 1 ? "border-b lg:border-b-0 lg:border-r" : ""
              } ${index % 2 === 0 ? "md:pl-0 lg:pl-5" : ""} ${index === 0 ? "lg:pl-0" : ""}`}
            >
              <h3 className="text-[clamp(1.25rem,1.85vw,1.75rem)] font-light leading-[1.25] tracking-[-0.03em] text-white xl:whitespace-nowrap">
                {value.title}
              </h3>
              <p className="mt-6 text-base font-light leading-6 text-white lg:mt-5">{value.text}</p>
            </article>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}
