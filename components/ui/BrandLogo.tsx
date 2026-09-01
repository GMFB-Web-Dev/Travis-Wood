import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <Link
      href="#top"
      aria-label="Travis Wood Builder home"
      className={`relative block h-11 w-[188px] shrink-0 overflow-hidden ${className}`}
    >
      <Image
        src="/figma/logo-lockup.png"
        alt="Travis Wood Building and Renovations"
        width={206}
        height={206}
        className="absolute -left-2 -top-[81px] max-w-none"
        priority
      />
    </Link>
  );
}
