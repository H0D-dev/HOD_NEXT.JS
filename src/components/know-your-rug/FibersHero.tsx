"use client";

import { motion } from "framer-motion";

export default function FibersHero() {
  return (
    <section className="w-full pt-20 pb-12 md:pt-48 md:pb-24 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
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
          <h1 className="font-serif text-[clamp(48px,8vw,80px)] leading-[1.05] tracking-tight text-[var(--text-primary)] mb-12">
            Fibers & Material
          </h1>
          <div className="flex flex-col gap-8 text-center max-w-2xl mx-auto">
            <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed font-light">
              Explore our curated selection of premium fibers, chosen for their timeless beauty and enduring performance.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
