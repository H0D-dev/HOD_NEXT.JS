"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  { question: "What is your lead time for bespoke rugs?", answer: "Our standard lead time for bespoke handmade rugs is typically 8 to 12 weeks, depending on the complexity of the design, size, and chosen materials." },
  { question: "Do you ship internationally?", answer: "Yes, we handle worldwide installation and shipping. Our global logistics team ensures your bespoke pieces arrive safely anywhere in the world." },
  { question: "Do you work with architects and interior designers?", answer: "Absolutely. We regularly collaborate with architects and interior designers to create custom solutions that perfectly integrate into their overall vision." },
  { question: "Can I request custom sizes and colours?", answer: "Yes, all our pieces can be fully customized. We offer an extensive palette of colors and can accommodate virtually any size or shape requirement." },
  { question: "Can you handle yacht and hospitality projects?", answer: "We have extensive experience in high-end commercial, yacht, and aviation projects, ensuring all materials meet strict international safety and durability standards." },
  { question: "What materials do you use in your rugs?", answer: "We source only the finest materials globally, including New Zealand wool, pure silk, bamboo silk, and natural viscose, hand-spun and dyed to perfection." }
];

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="w-full py-8 md:py-12 lg:py-16 bg-[var(--bg-primary)]">
      <div className="max-w-[1000px] mx-auto px-4 md:px-8">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h3 className="font-sans font-light text-xl lg:text-2xl text-[var(--text-primary)] relative inline-block">
            Frequently Asked Questions
          </h3>
        </div>

        {/* Grid of FAQs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-start">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-[var(--border-secondary)] bg-white shadow-sm overflow-hidden h-fit">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left focus:outline-none transition-colors hover:bg-[var(--bg-secondary)]"
              >
                <span className="font-sans text-[11px] md:text-xs text-[var(--text-primary)] font-medium pr-4">
                  {faq.question}
                </span>
                <span className="text-[var(--text-muted)] flex-shrink-0">
                  {openIndex === idx ? <Minus size={16} strokeWidth={1.5} /> : <Plus size={16} strokeWidth={1.5} />}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-[var(--border-secondary)] bg-[var(--bg-secondary)]"
                  >
                    <div className="p-4 md:p-5">
                      <p className="font-sans text-[11px] md:text-xs font-light text-[var(--text-secondary)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
