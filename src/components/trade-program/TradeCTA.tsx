"use client";

import { motion } from "framer-motion";

export default function TradeCTA() {
  return (
    <section className="w-full pt-4 pb-12 md:pt-8 md:pb-20 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      <div className="max-w-[var(--container-md)] mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
          className="max-w-3xl flex flex-col items-center"
        >
          <span className="block text-[var(--text-secondary)] font-sans text-xs uppercase tracking-widest mb-8">
            Join The Program
          </span>
          <h2 className="font-serif text-xl md:text-3xl lg:text-4xl leading-[1.2] tracking-tight mb-4 md:mb-6">
            Ready to begin your design journey?
          </h2>
          <p className="font-sans text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-10 max-w-xl">
            Gain exclusive access to premium handmade rugs, bespoke carpets, and unparalleled trade benefits.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <a
              href="https://wa.me/971521236888?text=I%20would%20like%20to%20chat%20about%20the%20Designer%20Trade%20Program."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 md:px-10 md:py-5 bg-[var(--accent-primary)] text-[#111] border border-[var(--accent-primary)] font-sans font-medium text-xs md:text-sm tracking-widest uppercase hover:bg-[var(--accent-secondary)] hover:border-[var(--accent-secondary)] transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] w-full sm:w-auto text-center"
            >
              Chat Now
            </a>
            <a
              href="https://wa.me/971521236888?text=I%20would%20like%20to%20apply%20for%20the%20Designer%20Trade%20Program."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 md:px-10 md:py-5 bg-transparent text-[var(--text-primary)] border border-[var(--accent-primary)] font-sans font-medium text-xs md:text-sm tracking-widest uppercase hover:bg-[var(--accent-primary)] hover:text-[#111] transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] w-full sm:w-auto text-center"
            >
              Apply for Trade Program
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
