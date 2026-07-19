"use client";

import { motion } from "framer-motion";

export default function ProcessHero() {
  return (
    <section className="relative w-full flex flex-col justify-center items-center pt-24 lg:pt-32 pb-16 lg:pb-24 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-md)] mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="max-w-4xl"
        >
          <span className="block text-[var(--accent-primary)] font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] mb-6 md:mb-8 font-medium">
            Know Your Rug
          </span>
          <h1 className="font-sans text-[clamp(36px,6vw,72px)] font-light leading-none tracking-wide text-[var(--text-primary)] mb-4">
            Rug Making Process
          </h1>
          <h2 className="font-sans text-[var(--text-primary)] text-sm md:text-base font-light tracking-wide mb-8">
            Transforming Designs into Masterpieces
          </h2>
          <div className="flex flex-col gap-6 text-center max-w-2xl mx-auto">
            <p className="font-sans text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed font-light max-w-lg mx-auto">
              Each hand-crafted rug is a testament to artisanal skill, passing through the hands of dedicated specialists whose expertise creates unparalleled quality.
            </p>
          </div>
        </motion.div>
      </div>
      {/* Premium connecting line spanning the gap */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-16 lg:h-24 bg-[var(--accent-primary)] opacity-50 hidden sm:block"></div>
    </section>
  );
}
