"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const termsSections = [
  {
    id: "price-payment",
    title: "1. Price & Payment",
    content: [
      "All prices are listed in local currency and are subject to change without prior notice.",
      "A non-refundable deposit of 50% is required to commence any bespoke or made-to-order production.",
      "The remaining balance must be cleared in full prior to the dispatch and scheduling of delivery or installation.",
      "We accept major credit cards, bank transfers, and certified cheques. Goods remain the property of House of Décor until full payment is received."
    ]
  },
  {
    id: "exchanges-returns",
    title: "2. Exchanges & Returns",
    content: [
      "Due to the highly customized and bespoke nature of our products, all sales are considered final.",
      "Returns or exchanges are only permitted in the event of a manufacturing defect identified upon delivery.",
      "In the rare case a return is authorized by management, items must be in their original packaging, unused, and completely free of damage.",
      "A restocking fee of 20% may apply to authorized returns of non-customized inventory items."
    ]
  },
  {
    id: "cancellation",
    title: "3. Cancellation",
    content: [
      "Standard orders may be cancelled within 24 hours of placement for a full refund.",
      "Bespoke and made-to-measure orders cannot be cancelled once production has commenced. Any deposits paid will be forfeited.",
      "House of Décor reserves the right to cancel any order if materials become unavailable, in which case a full refund of the deposit will be issued."
    ]
  },
  {
    id: "credit-notes",
    title: "4. Credit Notes",
    content: [
      "Credit notes issued by House of Décor are valid for a period of 12 months from the date of issue.",
      "Credit notes are strictly non-transferable and cannot be exchanged for cash.",
      "Original credit note documentation must be presented at the time of redemption."
    ]
  },
  {
    id: "reservation-storage",
    title: "5. Reservation & Storage",
    content: [
      "Upon notification of order completion, clients must accept delivery within 14 days.",
      "If the client is unable to receive the goods, House of Décor will provide complimentary storage for up to 30 days.",
      "Beyond 30 days, a storage fee of 2% of the total invoice value per month will be charged, payable prior to eventual delivery."
    ]
  },
  {
    id: "customization-modifications",
    title: "6. Customization & Modifications",
    content: [
      "Any modifications to bespoke orders must be requested in writing within 48 hours of initial order placement.",
      "Changes requested after this period are subject to approval and may incur additional material and labor costs, as well as extended lead times.",
      "Slight variations in color, texture, and weave are inherent to handmade products and do not constitute a defect."
    ]
  },
  {
    id: "shipping-delivery",
    title: "7. Shipping, Delivery & Installation",
    content: [
      "Delivery and installation dates are estimates and provided in good faith. We are not liable for reasonable delays.",
      "It is the client's responsibility to ensure the site is clear, accessible, and ready for installation. White-glove service includes placing the item and removing packaging.",
      "Any structural modifications required at the delivery site are the sole responsibility of the client."
    ]
  },
  {
    id: "acceptance-goods",
    title: "8. Acceptance of Goods",
    content: [
      "The client or an authorized representative must be present to inspect and sign for the goods upon delivery.",
      "Any claims for transit damage or discrepancies must be noted on the delivery receipt and reported to us in writing within 24 hours.",
      "Failure to notify us within this timeframe constitutes full acceptance of the goods in perfect condition."
    ]
  },
  {
    id: "delays-beyond-control",
    title: "9. Delays Beyond Control",
    content: [
      "House of Décor shall not be held liable for any failure or delay in performance arising out of circumstances beyond our reasonable control.",
      "This includes, but is not limited to, acts of God, natural disasters, strikes, material shortages, or customs clearance delays (Force Majeure)."
    ]
  },
  {
    id: "intellectual-property",
    title: "10. Intellectual Property",
    content: [
      "All designs, sketches, 3D renderings, and physical samples remain the exclusive intellectual property of House of Décor.",
      "Reproduction, distribution, or unauthorized use of our designs by the client or third parties is strictly prohibited."
    ]
  },
  {
    id: "warranty",
    title: "11. Warranty",
    content: [
      "We provide a 2-year limited warranty against manufacturing defects on all handmade rugs and customized curtains.",
      "This warranty does not cover normal wear and tear, fading due to direct sunlight, inappropriate cleaning methods, or accidental damage.",
      "Any third-party alterations or repairs void this warranty entirely."
    ]
  },
  {
    id: "legal-framework",
    title: "12. Legal Framework",
    content: [
      "These Terms & Conditions shall be governed by and construed in accordance with the laws of the United States and the United Arab Emirates.",
      "Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in our operating regions."
    ]
  }
];

export default function TermsContent() {
  const [activeSection, setActiveSection] = useState(termsSections[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle intersection observer to update active sidebar link on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" } // Adjust to trigger when section is near top
    );

    termsSections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100; // Account for fixed headers if any
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setActiveSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <section className="w-full py-16 md:py-24 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col md:flex-row gap-12 lg:gap-24">
        
        {/* Mobile Navigation Dropdown */}
        <div className="md:hidden sticky top-4 z-40 bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full px-6 py-4 flex items-center justify-between font-sans text-sm tracking-wider uppercase text-[var(--text-primary)]"
          >
            <span>Navigate Sections</span>
            <ChevronDown size={18} className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 w-full bg-[var(--bg-secondary)] border-b border-l border-r border-[var(--border-secondary)] max-h-[60vh] overflow-y-auto z-50">
              <ul className="flex flex-col">
                {termsSections.map((section) => (
                  <li key={`mobile-${section.id}`}>
                    <button
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-6 py-4 border-t border-[var(--border-secondary)] font-sans text-sm ${
                        activeSection === section.id
                          ? "text-[var(--text-primary)] bg-[var(--bg-tertiary)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-primary)]"
                      } transition-colors duration-300`}
                    >
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 lg:w-80 shrink-0">
          <div className="sticky top-32 flex flex-col gap-1">
            <h3 className="font-sans text-xs uppercase tracking-widest text-[var(--text-muted)] mb-6 px-4">
              Contents
            </h3>
            <ul className="flex flex-col border-l border-[var(--border-secondary)]">
              {termsSections.map((section) => (
                <li key={`desktop-${section.id}`}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-6 py-3 font-sans text-sm transition-all duration-300 border-l-2 -ml-[1px] ${
                      activeSection === section.id
                        ? "text-[var(--text-primary)] border-[var(--border-primary)] bg-[var(--surface-secondary)]"
                        : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]"
                    }`}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col gap-20">
          {termsSections.map((section) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
              className="scroll-mt-32"
            >
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-8 pb-4 border-b border-[var(--border-secondary)]">
                {section.title}
              </h2>
              <ol className="list-decimal list-outside ml-5 space-y-6">
                {section.content.map((clause, index) => (
                  <li 
                    key={index} 
                    className="font-sans text-base md:text-lg text-[var(--text-secondary)] leading-relaxed pl-4"
                  >
                    {clause}
                  </li>
                ))}
              </ol>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
