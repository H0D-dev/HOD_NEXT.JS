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
    <section className="w-full pt-20 pb-16 md:pt-48 md:pb-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col items-center">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="text-center max-w-4xl mb-24"
        >
          <span className="block text-[var(--accent-primary)] font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6 md:mb-8 font-medium">
            Know Your Rug
          </span>
          <h1 className="font-serif text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] leading-[1.1] tracking-tight text-[var(--text-primary)] mb-8">
            Rug Guide
          </h1>
          <h2 className="font-sans text-[var(--text-secondary)] text-lg md:text-xl font-light tracking-wide">
            Discover the Art of Rug Selection: Your Guide to Finding the Ideal Piece!
          </h2>
        </motion.div>

        {/* Selection Guide Section */}
        <div className="w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            className="mb-12 text-center"
          >
            <h3 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-6">
              Guide to Choosing the Right Rug
            </h3>
            <p className="font-sans text-[var(--text-secondary)] text-lg">
              When selecting the perfect rug, these key questions can guide your decision-making process:
            </p>
          </motion.div>

          <div className="flex flex-col border-t border-[var(--border-secondary)] mt-16">
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
                  className="w-full py-8 flex items-center justify-between font-serif text-2xl md:text-3xl text-[var(--text-primary)] text-left"
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
                      <div className="pb-8">
                        <ul className="flex flex-col gap-6 bg-[var(--surface-primary)] p-6 md:p-8 border-l-2 border-[var(--accent-primary)]">
                          {item.points.map((pt, i) => (
                            <li key={i} className="font-sans text-base md:text-lg leading-relaxed text-[var(--text-secondary)]">
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
    </section>
  );
}
