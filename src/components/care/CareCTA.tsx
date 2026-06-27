"use client";

import { motion } from "framer-motion";

export default function CareCTA() {
  return (
    <section className="w-full py-32 md:py-40 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)] border-t border-[var(--border-secondary)] text-center flex flex-col items-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as any }}
          className="flex flex-col items-center"
        >
          <span className="block text-[var(--text-muted)] font-sans text-xs uppercase tracking-widest mb-6">
            Restoration & Maintenance
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight mb-8">
            Need Professional Assistance?
          </h2>
          <p className="font-sans text-[var(--text-secondary)] text-lg mb-16 max-w-lg">
            If your piece requires deep cleaning, stain removal, or professional restoration, our team can recommend certified specialists.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <a 
              href="/contact"
              className="px-10 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] border border-[var(--text-primary)] font-sans font-medium text-sm tracking-widest uppercase hover:bg-transparent hover:text-[var(--text-primary)] transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] w-full sm:w-auto text-center"
            >
              Contact Support
            </a>
            <a 
              href="https://wa.me/971521236888?text=I%20would%20like%20to%20visit%20the%20showroom."
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-transparent text-[var(--text-primary)] border border-[var(--border-primary)] font-sans font-medium text-sm tracking-widest uppercase hover:bg-[var(--surface-secondary)] transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] w-full sm:w-auto text-center"
            >
              Visit Showroom
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
