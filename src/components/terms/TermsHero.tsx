"use client";

import { motion } from "framer-motion";

export default function TermsHero() {
  return (
    <section className="w-full pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-md)] mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="block text-[var(--text-muted)] font-sans text-xs md:text-sm uppercase tracking-widest mb-6 md:mb-8 font-medium">
            Legal
          </span>
          <h1 className="font-serif text-[clamp(48px,8vw,80px)] leading-[1.05] tracking-tight text-[var(--text-primary)] mb-8">
            Terms & Conditions
          </h1>
          <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-8">
            Please review our policies carefully. These terms govern your use of our services and the purchase of goods from House of Décor.
          </p>
          <p className="font-sans text-[var(--text-muted)] text-sm tracking-wider uppercase">
            Last Updated: August 2026
          </p>
        </motion.div>
      </div>
    </section>
  );
}
