import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  variant?: "default" | "footer";
  src: string;
  alt: string;
  businessName: string;
};

export function BrandLogo({
  className = "",
  variant = "default",
  src,
  alt,
  businessName,
}: BrandLogoProps) {
  const isFooter = variant === "footer";

  return (
    <Link
      href="/"
      aria-label={`${businessName} home`}
      className={`relative block shrink-0 overflow-hidden ${
        isFooter
          ? "aspect-[1756/394] w-[min(340px,100%)]"
          : "aspect-[1756/394] w-[220px]"
      } ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={isFooter ? 387 : 251}
        height={isFooter ? 387 : 251}
        className="absolute -left-[4.95%] -top-[218.27%] h-auto w-[113.9%] max-w-none"
        priority
      />
    </Link>
  );
}
