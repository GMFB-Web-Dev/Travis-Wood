import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { ContactMapSection } from "@/components/sections/ContactMapSection";
import { ContactPageHero } from "@/components/sections/ContactPageHero";
import { ContactPageSection } from "@/components/sections/ContactPageSection";
import { getBlock, getNavigation, getPage, getSiteSettings } from "@/lib/payload/client";
import { getPageMetadata } from "@/lib/payload/metadata";

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
      <main className="overflow-hidden bg-black">
        <ContactPageHero block={hero} navigation={navigation} settings={settings} />
        <ContactPageSection block={contact} settings={settings} />
        <ContactMapSection block={map} />
      </main>
      <Footer navigation={navigation} settings={settings} />
    </>
  );
}
