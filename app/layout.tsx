import type { Metadata } from "next";
import { GoogleTagManager } from "@next/third-parties/google";
import { Allura, Montserrat } from "next/font/google";
import { getSiteMetadata } from "@/lib/payload/metadata";
import "./globals.css";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: "400",
});

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata();
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} ${allura.variable}`}>
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
