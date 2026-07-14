import ContactHero from "../../components/contact/ContactHero";
import ContactAssistanceSection from "../../components/contact/ContactAssistanceSection";
import ContactInfoSection from "../../components/contact/ContactInfoSection";
import ContactGlobalPresence from "../../components/contact/ContactGlobalPresence";
import ContactFAQ from "../../components/contact/ContactFAQ";

import { Suspense } from "react";

export const metadata = {
  title: "Contact Us — House of Décor",
  description: "Get in touch with House of Décor for bespoke interior solutions, luxury handmade rugs, and premium curtains.",
};

export default function ContactPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <ContactHero />
      <ContactAssistanceSection />
      <Suspense fallback={<div></div>}>
        <ContactInfoSection />
      </Suspense>
      <ContactGlobalPresence />
      <ContactFAQ />
    </main>
  );
}
