"use client";

import { motion } from "framer-motion";

export default function KnowHero() {
  return (
    <section className="w-full pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-md)] mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="max-w-4xl"
        >
          <span className="block text-[var(--accent-primary)] font-sans text-xs md:text-sm uppercase tracking-widest mb-6 md:mb-8 font-medium">
            Education
          </span>
          <h1 className="font-serif text-[clamp(48px,8vw,80px)] leading-[1.05] tracking-tight text-[var(--text-primary)] mb-12">
            Know Your Rug
          </h1>
          <div className="flex flex-col gap-8 text-left md:text-center">
            <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed">
              A rug is an essential element that brings character and warmth to your home. To choose the perfect one, it's important to understand the craftsmanship behind it. A quality rug should be both visually striking and durable while offering comfort.
            </p>
            <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed">
              At House of Décor, we honor the art of rug-making with a diverse collection created by talented artisans from India. Each rug is infused with rich traditions and unique stories, making every piece a one-of-a-kind addition to your space. Discover our weaving techniques, materials, and processes to find a rug that not only complements your home but also narrates its own story.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
