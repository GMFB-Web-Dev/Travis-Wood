import type { ReactNode } from "react";

type SiteContainerProps = {
  children: ReactNode;
  className?: string;
};

export function SiteContainer({ children, className = "" }: SiteContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-16 ${className}`}>
      {children}
    </div>
  );
}
