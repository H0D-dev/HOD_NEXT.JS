"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const materials = [
  {
    id: "wool",
    title: "Wool",
    description: "Wool is naturally resilient, highly durable, and possesses a natural lanolin coating that resists dirt and stains. It is the gold standard for premium handmade rugs.",
    careTips: [
      "Blot spills immediately with a clean, undyed cloth. Do not rub.",
      "Use club soda for tough stains, working from the outside in.",
      "Rotate the rug every 6 months to ensure even wear."
    ],
    image: "/images/care/care_wool_1782566454512.png"
  },
  {
    id: "cashmere",
    title: "Cashmere",
    description: "Exquisitely soft and incredibly luxurious. Cashmere fibers are delicate and require a gentle touch to maintain their cloud-like texture.",
    careTips: [
      "Vacuum using suction only; never use a beater bar.",
      "Professional dry cleaning is highly recommended for major spills.",
      "Keep away from high-traffic areas and heavy furniture."
    ],
    image: "/images/care/care_cashmere_1782566466289.png"
  },
  {
    id: "silk",
    title: "Silk",
    description: "Known for its luminous sheen and intricate detailing capabilities. Silk is sensitive to moisture and requires meticulous care.",
    careTips: [
      "Never use water on silk rugs as it can cause permanent color bleeding.",
      "Address spills by pressing firmly with a dry white towel.",
      "Seek professional cleaning exclusively."
    ],
    image: "/images/care/care_wool_1782566454512.png" // reused due to quota
  },
  {
    id: "bamboo-silk",
    title: "Bamboo Silk",
    description: "An eco-friendly alternative offering a brilliant luster similar to traditional silk, but slightly more robust. It requires specialized maintenance.",
    careTips: [
      "Use only approved pH-neutral cleaning solutions.",
      "Avoid excess moisture; dry quickly if a spill occurs.",
      "Brush the pile gently with a soft bristle brush to restore sheen."
    ],
    image: "/images/care/care_cashmere_1782566466289.png" // reused due to quota
  }
];

export default function MaterialCare() {
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopInnerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>(materials[0].id);

  const handleAccordionClick = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  useGSAP(() => {
    // Only pin on desktop
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: ".desktop-material-wrapper",
        start: "top top",
        end: "+=300%", // 300vh for scrolling
        pin: desktopInnerRef.current,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Determine which tab should be active based on progress (0 to 1)
          // Progress 0-0.25 (idx 0), 0.25-0.5 (idx 1), 0.5-0.75 (idx 2), 0.75-1.0 (idx 3)
          let newIndex = Math.floor(self.progress * materials.length);
          if (newIndex >= materials.length) newIndex = materials.length - 1;
          setActiveIndex(newIndex);
        }
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full bg-[var(--bg-primary)]">
      
      {/* Mobile Layout */}
      <div className="md:hidden w-full flex flex-col py-8 px-6 border-t border-[var(--border-secondary)]">
        <h2 className="font-serif text-xl md:text-2xl lg:text-3xl leading-[1.2] tracking-tight text-[var(--text-primary)] mb-6">Material Care</h2>
        {materials.map((material) => (
          <div key={`mobile-${material.id}`} className="border-b border-[var(--border-secondary)]">
            <button
              onClick={() => handleAccordionClick(material.id)}
              className="w-full py-6 flex items-center justify-between font-sans text-base md:text-lg font-medium text-[var(--text-primary)]"
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
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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

      {/* Desktop Layout (Pinned) */}
      <div className="desktop-material-wrapper hidden md:block">
        <div ref={desktopInnerRef} className="h-screen w-full flex items-center px-8 lg:px-24">
          <div className="w-full max-w-[var(--container-lg)] mx-auto flex gap-12 lg:gap-24">
            
            {/* Sidebar */}
            <aside className="w-64 lg:w-80 shrink-0 border-l border-[var(--border-secondary)] flex flex-col justify-center h-full py-12">
              <h3 className="font-sans text-xs uppercase tracking-widest text-[var(--text-muted)] mb-8 px-6">
                Materials
              </h3>
              <ul className="flex flex-col">
                {materials.map((material, idx) => (
                  <li key={`desktop-${material.id}`}>
                    <button
                      className={`w-full text-left px-6 py-4 font-sans text-base transition-all duration-500 border-l-2 -ml-[1px] ${
                        activeIndex === idx
                          ? "text-[var(--text-primary)] border-[var(--border-primary)] bg-[var(--surface-secondary)]"
                          : "text-[var(--text-muted)] border-transparent"
                      }`}
                    >
                      {material.title}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Stuck Content */}
            <div className="flex-1 relative h-[600px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${materials[activeIndex].id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col xl:flex-row gap-12 items-center w-full"
                >
                  <div className="flex-1 flex flex-col gap-8">
                    <h2 className="font-serif text-xl md:text-2xl lg:text-3xl leading-[1.2] tracking-tight text-[var(--text-primary)]">
                      {materials[activeIndex].title}
                    </h2>
                    <p className="font-sans text-[var(--text-secondary)] text-sm md:text-base leading-relaxed max-w-xl">
                      {materials[activeIndex].description}
                    </p>
                    
                    <div className="bg-[var(--surface-secondary)] p-8 border border-[var(--border-secondary)] mt-4">
                      <h4 className="font-sans text-sm font-medium tracking-widest uppercase text-[var(--text-primary)] mb-6">
                        Essential Care Tips
                      </h4>
                      <ul className="flex flex-col gap-4">
                        {materials[activeIndex].careTips.map((tip, idx) => (
                          <li key={idx} className="font-sans text-sm text-[var(--text-secondary)] flex items-start gap-3">
                            <span className="text-[var(--text-muted)] mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
