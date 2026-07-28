"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface PolicySection {
  id: string;
  title: string;
  content: string[];
}

interface PolicyContentProps {
  sections: PolicySection[];
}

export default function PolicyContent({ sections }: PolicyContentProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || "");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle intersection observer to update active sidebar link on scroll
  useEffect(() => {
    if (!sections || sections.length === 0) return;
    
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

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

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

  if (!sections || sections.length === 0) return null;

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
                {sections.map((section) => (
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
              {sections.map((section) => (
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
          {sections.map((section) => (
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
                {section.content.map((clause, index) => (
                  <p 
                    key={index} 
                    className="font-sans text-base md:text-lg text-[var(--text-secondary)] leading-relaxed"
                  >
                    {clause}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
