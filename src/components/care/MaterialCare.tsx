"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const materials = [
  {
    id: "wool",
    title: "Wool",
    description: "Wool is naturally resilient, highly durable, and possesses a natural lanolin coating that resists dirt and stains. It is the gold standard for premium handmade rugs.",
    careTips: [
      "Blot spills immediately with a clean, undyed cloth. Do not rub.",
      "Use club soda for tough stains, working from the outside in.",
      "Rotate the rug every 6 months to ensure even wear."
    ]
  },
  {
    id: "cashmere",
    title: "Cashmere",
    description: "Exquisitely soft and incredibly luxurious. Cashmere fibers are delicate and require a gentle touch to maintain their cloud-like texture.",
    careTips: [
      "Vacuum using suction only; never use a beater bar.",
      "Professional dry cleaning is highly recommended for major spills.",
      "Keep away from high-traffic areas and heavy furniture."
    ]
  },
  {
    id: "silk",
    title: "Silk",
    description: "Known for its luminous sheen and intricate detailing capabilities. Silk is sensitive to moisture and requires meticulous care.",
    careTips: [
      "Never use water on silk rugs as it can cause permanent color bleeding.",
      "Address spills by pressing firmly with a dry white towel.",
      "Seek professional cleaning exclusively."
    ]
  },
  {
    id: "bamboo-silk",
    title: "Bamboo Silk",
    description: "An eco-friendly alternative offering a brilliant luster similar to traditional silk, but slightly more robust. It requires specialized maintenance.",
    careTips: [
      "Use only approved pH-neutral cleaning solutions.",
      "Avoid excess moisture; dry quickly if a spill occurs.",
      "Brush the pile gently with a soft bristle brush to restore sheen."
    ]
  }
];

export default function MaterialCare() {
  const [activeTab, setActiveTab] = useState(materials[0].id);
  const [openAccordion, setOpenAccordion] = useState<string | null>(materials[0].id);

  const handleAccordionClick = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col md:flex-row gap-12 lg:gap-24">
        
        {/* Mobile Accordion */}
        <div className="md:hidden w-full flex flex-col border-t border-[var(--border-secondary)]">
          <h2 className="font-serif text-3xl text-[var(--text-primary)] mb-8 pt-8">Material Care</h2>
          {materials.map((material) => (
            <div key={`mobile-${material.id}`} className="border-b border-[var(--border-secondary)]">
              <button
                onClick={() => handleAccordionClick(material.id)}
                className="w-full py-6 flex items-center justify-between font-serif text-2xl text-[var(--text-primary)]"
              >
                {material.title}
                <ChevronDown 
                  className={`transition-transform duration-300 ${openAccordion === material.id ? 'rotate-180' : ''}`} 
                  size={24} 
                  strokeWidth={1}
                />
              </button>
              <AnimatePresence>
                {openAccordion === material.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 flex flex-col gap-6">
                      <p className="font-sans text-[var(--text-secondary)] text-base leading-relaxed">
                        {material.description}
                      </p>
                      <div className="bg-[var(--surface-secondary)] p-6 border border-[var(--border-secondary)]">
                        <h4 className="font-sans text-xs uppercase tracking-widest text-[var(--text-primary)] mb-4">Care Tips</h4>
                        <ul className="flex flex-col gap-3">
                          {material.careTips.map((tip, idx) => (
                            <li key={idx} className="font-sans text-sm text-[var(--text-secondary)] flex items-start gap-2">
                              <span className="text-[var(--text-muted)] block mt-1">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Desktop Sidebar & Content */}
        <aside className="hidden md:block w-64 lg:w-80 shrink-0">
          <div className="sticky top-32 flex flex-col gap-1 border-l border-[var(--border-secondary)]">
            <h3 className="font-sans text-xs uppercase tracking-widest text-[var(--text-muted)] mb-8 px-6">
              Materials
            </h3>
            <ul className="flex flex-col">
              {materials.map((material) => (
                <li key={`desktop-${material.id}`}>
                  <button
                    onClick={() => setActiveTab(material.id)}
                    className={`w-full text-left px-6 py-4 font-sans text-base transition-all duration-300 border-l-2 -ml-[1px] ${
                      activeTab === material.id
                        ? "text-[var(--text-primary)] border-[var(--border-primary)] bg-[var(--surface-secondary)]"
                        : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]"
                    }`}
                  >
                    {material.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="hidden md:block flex-1">
          <AnimatePresence mode="wait">
            {materials.map((material) => {
              if (material.id !== activeTab) return null;
              return (
                <motion.div
                  key={`content-${material.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
                  className="flex flex-col gap-8"
                >
                  <h2 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)]">
                    {material.title}
                  </h2>
                  <p className="font-sans text-[var(--text-secondary)] text-lg lg:text-xl leading-relaxed max-w-2xl">
                    {material.description}
                  </p>
                  
                  <div className="bg-[var(--surface-secondary)] p-8 lg:p-12 border border-[var(--border-secondary)] mt-4 max-w-2xl">
                    <h4 className="font-sans text-sm font-medium tracking-widest uppercase text-[var(--text-primary)] mb-6">
                      Essential Care Tips
                    </h4>
                    <ul className="flex flex-col gap-4">
                      {material.careTips.map((tip, idx) => (
                        <li key={idx} className="font-sans text-base text-[var(--text-secondary)] flex items-start gap-3">
                          <span className="text-[var(--text-muted)] mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
