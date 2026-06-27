"use client";

import { motion } from "framer-motion";

export default function CareHero() {
  return (
    <section className="w-full pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-md)] mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="max-w-3xl"
        >
          <span className="block text-[var(--text-muted)] font-sans text-xs md:text-sm uppercase tracking-widest mb-6 md:mb-8 font-medium">
            Guidance
          </span>
          <h1 className="font-serif text-[clamp(48px,8vw,80px)] leading-[1.05] tracking-tight text-[var(--text-primary)] mb-8">
            Care & Cleaning
          </h1>
          <h2 className="font-sans text-[var(--text-primary)] text-xl md:text-2xl font-light tracking-wide mb-8">
            Designed for Real Life
          </h2>
          <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Our pieces are handcrafted to last generations. With proper care and understanding of the natural materials, your House of Décor products will age gracefully, becoming even more beautiful over time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
