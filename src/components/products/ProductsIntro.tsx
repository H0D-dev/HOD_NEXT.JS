"use client";

import { motion } from "framer-motion";

export default function ProductsIntro() {
  return (
    <section className="w-full pt-12 md:pt-16 pb-8 md:pb-12 px-5 md:px-10 lg:px-16 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-md)] mx-auto flex flex-col items-center text-center">
        
        <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4 font-medium">
          The Collections
        </span>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="font-sans font-light text-base md:text-lg lg:text-xl text-[var(--text-primary)] leading-relaxed max-w-2xl mx-auto">
            A curated selection of luxury rugs, handcrafted from pure silk and highland wool to define spaces and endure generations.
          </h2>
        </motion.div>
        
      </div>
    </section>
  );
}
