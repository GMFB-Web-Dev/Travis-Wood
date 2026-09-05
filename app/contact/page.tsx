import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { ContactMapSection } from "@/components/sections/ContactMapSection";
import { ContactPageHero } from "@/components/sections/ContactPageHero";
import { ContactPageSection } from "@/components/sections/ContactPageSection";
import { getBlock, getNavigation, getPage, getSiteSettings } from "@/lib/payload/client";
import { getPageMetadata } from "@/lib/payload/metadata";
import { getBreadcrumbJsonLd } from "@/lib/seo/structured-data";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("contact");
}

export default async function ContactPage() {
  const [page, navigation, settings] = await Promise.all([
    getPage("contact"),
    getNavigation(),
    getSiteSettings(),
  ]);
  const hero = getBlock(page, "heroSection");
  const contact = getBlock(page, "contactSection");
  const map = getBlock(page, "mapSection");

  return (
    <>
      <JsonLd data={getBreadcrumbJsonLd({ name: "Contact", path: "/contact" })} />
      <main className="overflow-hidden bg-black">
        <ContactPageHero block={hero} navigation={navigation} settings={settings} />
        <ContactPageSection block={contact} settings={settings} />
        <ContactMapSection block={map} />
      </main>
      <Footer navigation={navigation} settings={settings} />
    </>
  );
}
