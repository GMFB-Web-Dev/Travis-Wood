import type { Metadata } from "next";
import { Allura, Montserrat } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Travis Wood Builder | Whangārei Residential Builders",
  description:
    "Travis Wood Builder provides new builds, renovations, extensions and outdoor living projects across Whangārei and surrounding areas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} ${allura.variable}`}>
      <body>{children}</body>
    </html>
  );
}
