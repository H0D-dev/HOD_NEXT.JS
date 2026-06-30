"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";

export default function ServicesCTA() {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="bg-[var(--surface-primary)] p-10 md:p-16 border border-[var(--border-secondary)] flex flex-col items-start gap-8"
        >
          <div>
            <h3 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-4">
              Looking for Professional Services?
            </h3>
            <p className="font-sans text-[var(--text-secondary)] text-lg leading-relaxed">
              Explore our Designer Trade Program tailored for architects, interior designers, and trade professionals.
            </p>
          </div>
          <Link
            href="/designer-trade-program"
            className="group flex items-center gap-4 bg-[var(--surface-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] px-8 py-4 rounded-full font-sans text-sm tracking-widest uppercase transition-all duration-300 hover:bg-[var(--accent-secondary)] hover:text-[var(--bg-primary)] mt-auto"
          >
            Find Out More
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
          className="bg-[var(--surface-primary)] p-10 md:p-16 border border-[var(--border-secondary)] flex flex-col items-start gap-8"
        >
          <div>
            <h3 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-4">
              Need Some Expert Guidance?
            </h3>
            <p className="font-sans text-[var(--text-secondary)] text-lg leading-relaxed">
              Whether you need styling advice, you’re looking for a custom size, or you have a bespoke project - our expert advisors are here to answer all of your questions.
            </p>
          </div>
          <a
            href="tel:+971521236888"
            className="group flex items-center gap-4 bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 py-4 rounded-full font-sans text-sm tracking-widest uppercase transition-transform hover:scale-105 duration-300 mt-auto"
          >
            Call Now
            <PhoneCall size={18} />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
