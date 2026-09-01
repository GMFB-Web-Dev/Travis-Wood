import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const base =
  "inline-flex min-h-12 items-center justify-center rounded-br-[1000px] rounded-tl-[1000px] border border-brand-gold px-8 py-3 text-base font-normal uppercase leading-6 text-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-colors duration-200 hover:bg-brand-gold hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-gold";

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function LinkButton({ href, children, className = "" }: LinkButtonProps) {
  return (
    <Link href={href} className={`${base} ${className}`}>
      {children}
    </Link>
  );
}

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export function ActionButton({ children, className = "", ...props }: ActionButtonProps) {
  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}
