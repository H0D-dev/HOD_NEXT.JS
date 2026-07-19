"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const selectionQuestions = [
  {
    question: "Where Will It Be Used?",
    points: [
      { bold: "Room Traffic", text: "High-traffic areas require more durable rugs." },
      { bold: "Indoor or Outdoor", text: "Some rugs are specifically designed to withstand the elements." }
    ]
  },
  {
    question: "Why Do I Need It?",
    points: [
      { bold: "Create a Focal Point", text: "Brighter colors and intricate designs draw attention." },
      { bold: "Protect the Floor", text: "Hard-wearing fibers offer greater protection." },
      { bold: "Insulate & Muffle Sound", text: "Certain fibers provide better insulation." },
      { bold: "Add Comfort", text: "Softer fibers offer more comfort underfoot compared to coarser ones." }
    ]
  },
  {
    question: "What Is My Budget?",
    points: [
      { bold: "Entry-level to Luxury", text: "Hand-knotted rugs tend to be more expensive, while flatweaves are more affordable." }
    ]
  },
  {
    question: "What Is My Current Décor Like?",
    points: [
      { bold: "Style", text: "Does the room’s décor call for a specific rug style?" },
      { bold: "Color Palette", text: "What colors already exist in the room, and how will the rug complement them?" }
    ]
  }
];

export default function GuideHero() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const handleAccordionClick = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <section className="relative w-full flex flex-col justify-center items-center pt-24 lg:pt-32 pb-16 lg:pb-24 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col items-center">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="text-center max-w-4xl mb-12 lg:mb-16"
        >
          <span className="block text-[var(--accent-primary)] font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6 md:mb-8 font-medium">
            Know Your Rug
          </span>
          <h1 className="font-sans text-[clamp(36px,6vw,72px)] font-light leading-none tracking-wide text-[var(--text-primary)]">
            Rug Guide
          </h1>
        </motion.div>

        {/* Selection Guide Section */}
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            className="mb-8 text-center"
          >
            <p className="font-sans text-[var(--text-secondary)] text-base md:text-lg font-light">
              When selecting the perfect rug, these key questions can guide your decision-making process:
            </p>
          </motion.div>

          <div className="flex flex-col border-t border-[var(--border-secondary)]">
            {selectionQuestions.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
                className="border-b border-[var(--border-secondary)]"
              >
                <button
                  onClick={() => handleAccordionClick(idx)}
                  className="w-full py-4 lg:py-6 flex items-center justify-between font-sans text-xl lg:text-2xl font-light text-[var(--text-primary)] text-left"
                >
                  {item.question}
                  <ChevronDown
                    className={`shrink-0 transition-transform duration-300 ${openAccordion === idx ? 'rotate-180' : ''}`}
                    size={28}
                    strokeWidth={1}
                  />
                </button>
                <AnimatePresence>
                  {openAccordion === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
                      className="overflow-hidden"
                    >
                      <div className="pb-0">
                        <ul className="flex flex-col gap-4 bg-[var(--surface-primary)] p-6 md:p-8 border-l-2 border-[var(--accent-primary)]">
                          {item.points.map((pt, i) => (
                            <li key={i} className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
                              <strong className="text-[var(--text-primary)] font-medium mr-2">
                                {pt.bold}:
                              </strong>
                              {pt.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Premium connecting line spanning the gap */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-16 lg:h-24 bg-[var(--accent-primary)] opacity-50 hidden sm:block"></div>
    </section>
  );
}
