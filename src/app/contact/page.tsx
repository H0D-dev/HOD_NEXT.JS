import ContactHero from "../../components/contact/ContactHero";
import ContactInfoSection from "../../components/contact/ContactInfoSection";
import ContactFormSection from "../../components/contact/ContactFormSection";

export const metadata = {
  title: "Contact Us — House of Décor",
  description: "Get in touch with House of Décor for bespoke interior solutions, luxury handmade rugs, and premium curtains.",
};

export default function ContactPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <ContactHero />
      <ContactInfoSection />
      <ContactFormSection />
    </main>
  );
}
