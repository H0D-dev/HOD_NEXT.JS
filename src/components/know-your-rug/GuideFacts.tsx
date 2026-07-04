"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Info } from "lucide-react";

const mistakes = [
  {
    title: "Choosing a Rug That’s Too Small",
    desc: "A rug that’s too small can make the room appear smaller. It should be large enough to anchor the furniture."
  },
  {
    title: "Leaving Wall-to-Wall Carpeting Bare",
    desc: "Layering an area rug over carpeting is a great way to pull the room together."
  },
  {
    title: "Choosing the Rug Last",
    desc: "Rugs are art for your floor. Choose the rug first to establish the room’s theme, and then coordinate furnishings accordingly."
  },
  {
    title: "Skipping the Rug Pad",
    desc: "A rug pad not only adds comfort but also prevents slipping, ensuring safety."
  }
];

const facts = [
  "One rug passes through 186 hands and 86 processes before it becomes the finished piece of art that beautifies your home.",
  "Depending on the size, a 6x9-foot rug can take 6-9 months to complete, with weavers spending hours on the loom each day.",
  "A single automated machine can replace 300 yarn spinners, but choosing a hand-knotted rug supports rural artisans and their communities.",
  "A skilled weaver can tie up to 196 knots in just one square inch. The rug in your living room likely contains close to a million knots!",
  "Handmade rugs are not mass-produced; each one is a one-of-a-kind piece crafted with care, culture, and history woven into every thread.",
  "When properly cared for, handmade rugs don’t wear out with age; they improve over time, much like any fine piece of art."
];

export default function GuideFacts() {
  return (
    <section className="w-full py-16 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col gap-24 lg:gap-32">
        
        {/* Common Mistakes */}
        <div className="flex flex-col lg:flex-row gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            className="lg:w-1/3 flex flex-col gap-6"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--surface-primary)] border border-[var(--border-secondary)] flex items-center justify-center">
              <AlertTriangle size={20} className="text-[var(--text-primary)]" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-[clamp(24px,5vw,40px)] text-[var(--text-primary)]">
              Common Mistakes When Choosing a Rug
            </h3>
          </motion.div>

          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {mistakes.map((mistake, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
                className="bg-[var(--surface-primary)] p-8 border border-[var(--border-secondary)] flex flex-col gap-4"
              >
                <h4 className="font-sans font-medium text-[var(--text-primary)] text-lg">
                  {mistake.title}
                </h4>
                <p className="font-sans text-[var(--text-secondary)] text-base leading-relaxed">
                  {mistake.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Facts */}
        <div className="flex flex-col lg:flex-row gap-16 border-t border-[var(--border-secondary)] pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
            className="lg:w-1/3 flex flex-col gap-6"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--surface-primary)] border border-[var(--border-secondary)] flex items-center justify-center">
              <Info size={20} className="text-[var(--text-primary)]" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-[clamp(24px,5vw,40px)] text-[var(--text-primary)]">
              Quick Facts About Handcrafted Rugs
            </h3>
          </motion.div>

          <div className="lg:w-2/3 flex flex-col gap-6">
            {facts.map((fact, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
                className="flex items-start gap-4 p-6 bg-[var(--surface-primary)] border-l-2 border-[var(--accent-primary)]"
              >
                <span className="font-serif text-[var(--text-muted)] text-xl mt-1">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <p className="font-sans text-[var(--text-primary)] text-lg leading-relaxed">
                  {fact}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
