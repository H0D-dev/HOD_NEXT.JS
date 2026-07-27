"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const privacySections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: [
      "We may collect the following information:",
      "Personal Information",
      "• Full name",
      "• Email address",
      "• Phone number",
      "• Company name",
      "• Billing and shipping address",
      "• Country and city",
      "• Project details and specifications",
      "• Information you provide through enquiry forms or emails",
      "Design & Project Information",
      "When using our custom rug or bespoke services, we may collect:",
      "• Design files",
      "• CAD drawings",
      "• Mood boards",
      "• Images",
      "• Colour references",
      "• Measurements",
      "• Material preferences",
      "Technical Information",
      "When you browse our website, we may automatically collect:",
      "• IP address",
      "• Browser type",
      "• Device information",
      "• Operating system",
      "• Website usage statistics",
      "• Cookies and similar technologies"
    ]
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: [
      "We use your information to:",
      "• Respond to enquiries and quotation requests",
      "• Process orders and payments",
      "• Manufacture custom products",
      "• Coordinate deliveries",
      "• Communicate project updates",
      "• Improve our website and customer experience",
      "• Send product updates or newsletters (only if you opt in)",
      "• Maintain internal business records",
      "• Comply with applicable legal obligations"
    ]
  },
  {
    id: "cookies",
    title: "3. Cookies",
    content: [
      "Our website may use cookies to:",
      "• Improve website functionality",
      "• Remember user preferences",
      "• Analyse website traffic",
      "• Enhance browsing experience",
      "You can disable cookies through your browser settings, although some website features may not function properly."
    ]
  },
  {
    id: "sharing",
    title: "4. Sharing Your Information",
    content: [
      "We do not sell, rent, or trade your personal information.",
      "We may share information only with trusted third parties when necessary, including:",
      "• Shipping and logistics partners",
      "• Payment service providers",
      "• Manufacturing and production partners",
      "• IT and website service providers",
      "• Government authorities where required by law",
      "All third parties are expected to protect your information appropriately."
    ]
  },
  {
    id: "data-security",
    title: "5. Data Security",
    content: [
      "We implement reasonable administrative, technical, and organisational measures to protect your information from unauthorised access, misuse, disclosure, alteration, or destruction.",
      "While we strive to protect your data, no method of online transmission or electronic storage is completely secure."
    ]
  },
  {
    id: "retention",
    title: "6. Retention of Information",
    content: [
      "We retain personal information only for as long as necessary to:",
      "• Complete your order",
      "• Provide after-sales support",
      "• Meet legal and accounting obligations",
      "• Resolve disputes",
      "• Enforce our agreements"
    ]
  },
  {
    id: "marketing",
    title: "7. Marketing Communications",
    content: [
      "If you subscribe to our newsletter or marketing communications, we may send updates about new collections, products, promotions, and company news.",
      "You may unsubscribe at any time using the unsubscribe link in our emails or by contacting us directly."
    ]
  },
  {
    id: "your-rights",
    title: "8. Your Rights",
    content: [
      "Subject to applicable laws, you may have the right to:",
      "• Request access to your personal information",
      "• Correct inaccurate information",
      "• Request deletion of your information where legally permissible",
      "• Withdraw consent for marketing communications",
      "• Request information about how your data is used",
      "To exercise these rights, please contact us using the details below."
    ]
  },
  {
    id: "third-party",
    title: "9. Third-Party Websites",
    content: [
      "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those external websites. We encourage you to review their privacy policies before providing any personal information."
    ]
  },
  {
    id: "children",
    title: "10. Children’s Privacy",
    content: [
      "Our website is intended for business and general users and is not directed towards children under the age of 18. We do not knowingly collect personal information from children."
    ]
  },
  {
    id: "international-transfers",
    title: "11. International Data Transfers",
    content: [
      "As we work with clients and suppliers internationally, your information may be transferred and processed in countries outside the UAE. We take reasonable steps to ensure appropriate safeguards are in place for such transfers."
    ]
  },
  {
    id: "changes",
    title: "12. Changes to This Privacy Policy",
    content: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with the revised effective date."
    ]
  },
  {
    id: "contact-us",
    title: "13. Contact Us",
    content: [
      "If you have any questions about this Privacy Policy or how we handle your information, please contact us:",
      "House of Decor LLC",
      "Website: www.houseofdecor.ae",
      "Email: connect@houseofdecor.ae",
      "Phone: +971 52 123 6888",
      "Dubai, United Arab Emirates"
    ]
  }
];

export default function PrivacyContent() {
  const [activeSection, setActiveSection] = useState(privacySections[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" } 
    );

    privacySections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -100;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setActiveSection(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <section className="w-full py-16 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* Mobile & Tablet Navigation Dropdown */}
        <div className="lg:hidden sticky top-4 z-40 bg-[var(--bg-secondary)] border border-[var(--border-secondary)]">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full px-6 py-4 flex items-center justify-between font-sans text-sm tracking-wider uppercase text-[var(--text-primary)]"
          >
            <span>Navigate Sections</span>
            <ChevronDown size={18} className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isMobileMenuOpen && (
            <div className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)] max-h-[60vh] overflow-y-auto z-50">
              <ul className="flex flex-col">
                {privacySections.map((section) => (
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
        <aside className="hidden lg:block w-64 lg:w-80 shrink-0">
          <div className="sticky top-32 flex flex-col gap-1">
            <h3 className="font-sans text-xs uppercase tracking-widest text-[var(--text-muted)] mb-6 px-4">
              Contents
            </h3>
            <ul className="flex flex-col border-l border-[var(--border-secondary)]">
              {privacySections.map((section) => (
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
          {privacySections.map((section) => (
            <motion.div
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
              className="scroll-mt-32"
            >
              <div className="border-b border-[var(--border-secondary)] pb-8 mb-8">
                <h2 className="font-sans text-xl md:text-2xl font-light text-[var(--text-primary)] leading-tight">
                  {section.title}
                </h2>
              </div>
              <div className="flex flex-col gap-4">
                {section.content.map((clause, index) => {
                  const isBullet = clause.trim().startsWith("•");
                  const isSubtitle = !isBullet && clause.length > 0 && clause.length < 35 && !clause.includes(".") && !clause.includes(","); 
                  
                  return (
                    <p 
                      key={index} 
                      className={`font-sans text-base md:text-lg text-[var(--text-secondary)] leading-relaxed ${isBullet ? "pl-6 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--text-secondary)]" : ""} ${isSubtitle ? "font-medium mt-4 text-[var(--text-primary)]" : ""}`}
                    >
                      {isBullet ? clause.replace("•", "").trim() : clause}
                    </p>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
