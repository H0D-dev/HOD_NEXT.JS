"use client";

import { motion } from "framer-motion";

export default function CreateHero() {
  return (
    <section className="w-full pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-md)] mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="max-w-3xl"
        >
          <span className="block text-[var(--accent-primary)] font-sans text-xs md:text-sm uppercase tracking-widest mb-6 md:mb-8 font-medium">
            Bespoke Service
          </span>
          <h1 className="font-serif text-[clamp(48px,8vw,80px)] leading-[1.05] tracking-tight text-[var(--text-primary)] mb-8">
            Design Your Dream Rug Today!
          </h1>
          <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed">
            Unleash your creativity with our 'Create Your Own Rug' service at House of Décor! Design a bespoke masterpiece that reflects your unique style. Simply submit your design, and our expert team will guide you through each step: from quoting and creating an artwork to selecting colors and crafting a sample. Once you approve, we’ll bring your vision to life with a stunning, handmade rug. Transform your space with a personal touch!
          </p>
        </motion.div>
      </div>
    </section>
  );
}
