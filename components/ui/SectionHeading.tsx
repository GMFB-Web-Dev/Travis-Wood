type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  className?: string;
  titleClassName?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  className = "",
  titleClassName = "",
}: SectionHeadingProps) {
  return (
    <header className={className}>
      <p className="font-script text-[52px] leading-[0.6] text-brand-gold sm:text-[58px] lg:text-[64px]">
        {eyebrow}
      </p>
      <h2
        className={`mt-4 max-w-[1042px] text-[clamp(2.35rem,5vw,4rem)] font-medium uppercase leading-[1.2] tracking-[0.05em] text-white ${titleClassName}`}
      >
        {title}
      </h2>
    </header>
  );
}
