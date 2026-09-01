import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { ContactMapSection } from "@/components/sections/ContactMapSection";
import { ContactPageHero } from "@/components/sections/ContactPageHero";
import { ContactPageSection } from "@/components/sections/ContactPageSection";

export const metadata: Metadata = {
  title: "Contact Travis Wood Builder | Whangārei",
  description:
    "Discuss your new build, renovation, extension or outdoor project with Travis Wood Builder in Whangārei.",
};

export default function ContactPage() {
  return (
    <>
      <main className="overflow-hidden bg-black">
        <ContactPageHero />
        <ContactPageSection />
        <ContactMapSection />
      </main>
      <Footer />
    </>
  );
}
