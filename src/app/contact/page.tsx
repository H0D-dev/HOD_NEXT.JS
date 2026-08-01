import ContactHero from "../../components/contact/ContactHero";
import ContactAssistanceSection from "../../components/contact/ContactAssistanceSection";
import ContactInfoSection from "../../components/contact/ContactInfoSection";
import ContactGlobalPresence from "../../components/contact/ContactGlobalPresence";
import ContactFAQ from "../../components/contact/ContactFAQ";

import { Suspense } from "react";

export const metadata = {
  title: "Contact Us — House of Decór",
  description: "Get in touch with House of Decór for bespoke interior solutions, luxury handmade rugs, and premium curtains.",
};

import { generateFaqSchema } from "@/src/lib/seo/schema";

const contactFaqs = [
  { question: "What is your lead time for bespoke rugs?", answer: "Our standard lead time for bespoke handmade rugs is typically 8 to 12 weeks, depending on the complexity of the design, size, and chosen materials." },
  { question: "Do you ship internationally?", answer: "Yes, we handle worldwide installation and shipping. Our global logistics team ensures your bespoke pieces arrive safely anywhere in the world." },
  { question: "Do you work with architects and interior designers?", answer: "Absolutely. We regularly collaborate with architects and interior designers to create custom solutions that perfectly integrate into their overall vision." },
  { question: "Can I request custom sizes and colours?", answer: "Yes, all our pieces can be fully customized. We offer an extensive palette of colors and can accommodate virtually any size or shape requirement." },
  { question: "Can you handle yacht and hospitality projects?", answer: "We have extensive experience in high-end commercial, yacht, and aviation projects, ensuring all materials meet strict international safety and durability standards." },
  { question: "What materials do you use in your rugs?", answer: "We source only the finest materials globally, including New Zealand wool, pure silk, bamboo silk, and natural viscose, hand-spun and dyed to perfection." }
];

export default function ContactPage() {
  const faqSchema = generateFaqSchema(contactFaqs);

  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
