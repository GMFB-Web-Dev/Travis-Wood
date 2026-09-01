import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  className?: string;
  variant?: "default" | "footer";
};

export function BrandLogo({ className = "", variant = "default" }: BrandLogoProps) {
  const isFooter = variant === "footer";

  return (
    <Link
      href="/"
      aria-label="Travis Wood Builder home"
      className={`relative block shrink-0 overflow-hidden ${
        isFooter ? "h-16 w-[270px]" : "h-11 w-[188px]"
      } ${className}`}
    >
      <Image
        src="/figma/logo-lockup.png"
        alt="Travis Wood Building and Renovations"
        width={isFooter ? 296 : 206}
        height={isFooter ? 296 : 206}
        className={`absolute max-w-none ${isFooter ? "-left-3 -top-[116px]" : "-left-2 -top-[81px]"}`}
        priority
      />
    </Link>
  );
}
