"use client";

import { motion } from "framer-motion";

export default function GuideCTA() {
  return (
    <section className="w-full py-32 md:py-40 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)] text-center flex flex-col items-center">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight mb-8">
            Need help choosing the perfect rug?
          </h2>
          <p className="font-sans text-[var(--text-secondary)] text-lg mb-16 max-w-lg">
            Our design experts are available to provide complimentary advice, ensuring your selection flawlessly complements your space.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <a 
              href="/contact"
              className="px-10 py-5 border border-[var(--border-primary)] bg-transparent text-[var(--text-primary)] font-sans font-medium text-sm tracking-widest uppercase hover:bg-[var(--accent-primary)] transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] w-full sm:w-auto text-center"
            >
              Contact Us
            </a>
            <a 
              href="https://wa.me/971521236888?text=I%20need%20help%20choosing%20a%20rug%20size."
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 border border-[var(--border-secondary)] bg-[var(--surface-primary)] text-[var(--text-primary)] font-sans font-medium text-sm tracking-widest uppercase hover:border-[var(--border-primary)] transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] w-full sm:w-auto text-center"
            >
              Talk to Expert
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
