"use client";

import { motion } from "framer-motion";

export default function TechniqueHero() {
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
            Know Your Rug
          </span>
          <h1 className="font-serif text-[clamp(48px,8vw,80px)] leading-[1.05] tracking-tight text-[var(--text-primary)] mb-12">
            Weaving Techniques
          </h1>
          <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed text-left md:text-center">
            Explore the artistry behind our rugs with a deep dive into various weaving techniques. Each method, from traditional hand-knotting to innovative flat weaves, contributes to the unique texture, design, and durability of our pieces. Discover how skilled artisans use their craftsmanship to create stunning rugs that not only enhance your space but also tell a story of cultural heritage and craftsmanship. Whether you’re interested in intricate patterns or versatile styles, our rug weaving techniques offer something for every aesthetic.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
