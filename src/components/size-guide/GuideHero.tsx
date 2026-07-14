"use client";

import { motion } from "framer-motion";

export default function GuideHero() {
  return (
    <section className="w-full pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-md)] mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="max-w-3xl"
        >
          <span className="block text-[var(--accent-primary)] font-sans text-xs md:text-sm uppercase tracking-widest mb-6 md:mb-8 font-medium">
            Guidance
          </span>
          <h1 className="font-serif text-[2.75rem] md:text-[4rem] lg:text-[4.75rem] leading-[1.1] tracking-tight text-[var(--text-primary)] mb-8">
            Size & Fitting Guide
          </h1>
          <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Selecting the right rug can be a challenge. We have created this comprehensive guide to help you find the perfect balance, ensuring your new piece enhances the scale and flow of your space.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
