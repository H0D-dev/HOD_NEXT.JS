"use client";

import { motion } from "framer-motion";

export default function ProcessHero() {
  return (
    <section className="w-full pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-md)] mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="max-w-4xl"
        >
          <span className="block text-[var(--accent-primary)] font-sans text-xs md:text-sm uppercase tracking-widest mb-6 md:mb-8 font-medium">
            Know Your Rug
          </span>
          <h1 className="font-serif text-[clamp(48px,8vw,80px)] leading-[1.05] tracking-tight text-[var(--text-primary)] mb-8">
            Rug Making Process
          </h1>
          <h2 className="font-sans text-[var(--text-primary)] text-xl md:text-2xl font-light tracking-wide mb-12">
            Transforming Designs into Masterpieces
          </h2>
          <div className="flex flex-col gap-6 text-left md:text-center">
            <h3 className="font-sans text-sm font-medium tracking-widest uppercase text-[var(--text-primary)]">
              Before Weaving: A Journey of Craftsmanship
            </h3>
            <p className="font-sans text-[var(--text-secondary)] text-lg leading-relaxed">
              Each hand-crafted rug is a testament to artisanal skill, passing through the hands of 180 skilled artisans from start to finish. Every one of the 90 people involved possesses a unique, irreplaceable expertise, honed over years of dedication.
            </p>
            <p className="font-sans text-[var(--text-secondary)] text-lg leading-relaxed">
              To bring together these diverse talents, we rely on a decentralized model, connecting step by step with specialists whose craftsmanship creates a level of quality that cannot be matched. This collaboration is made possible by bridges built on compassion, empathy, and love.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
