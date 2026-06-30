"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Palette, CheckCircle, FileText, PiggyBank, PenTool, Focus } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Submit Your Design",
    icon: <PenTool size={28} strokeWidth={1.5} />,
    desc: "Share your inspiration, sketches, or mood boards. We'll review your vision to understand exactly what you want."
  },
  {
    num: "02",
    title: "Receive Quote",
    icon: <PiggyBank size={28} strokeWidth={1.5} />,
    desc: "Based on the complexity, size, and materials chosen, we will provide you with a transparent and detailed quotation."
  },
  {
    num: "03",
    title: "Artwork Creation",
    icon: <FileText size={28} strokeWidth={1.5} />,
    desc: "Our design team translates your concept into a digital artwork format (CAD), mapping out every knot and detail."
  },
  {
    num: "04",
    title: "Color Selection",
    icon: <Palette size={28} strokeWidth={1.5} />,
    desc: "Choose from our library of over 3,000 custom hues to perfectly match the artwork to your existing interior palette."
  },
  {
    num: "05",
    title: "Sample Making",
    icon: <Focus size={28} strokeWidth={1.5} />,
    desc: "We weave a small physical sample (strike-off) so you can touch, feel, and review the exact colors and texture."
  },
  {
    num: "06",
    title: "Final Approval",
    icon: <CheckCircle size={28} strokeWidth={1.5} />,
    desc: "Once the sample is approved, our artisans begin crafting your bespoke masterpiece on the loom."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function CreateSteps() {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col items-center">
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24 w-full"
        >
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={itemVariants}
              className="bg-[var(--surface-primary)] p-8 lg:p-10 border border-[var(--border-secondary)] hover:border-[var(--accent-secondary)] transition-colors duration-500 flex flex-col gap-6 group"
            >
              <div className="flex justify-between items-start">
                <div className="text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors duration-500">
                  {step.icon}
                </div>
                <span className="font-serif text-3xl text-[var(--border-primary)] group-hover:text-[var(--text-primary)] transition-colors duration-500">
                  {step.num}
                </span>
              </div>
              <div>
                <h3 className="font-sans font-medium text-xl text-[var(--text-primary)] mb-3">
                  {step.title}
                </h3>
                <p className="font-sans text-[var(--text-secondary)] leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="text-center flex flex-col items-center gap-8 bg-[var(--surface-primary)] border border-[var(--border-primary)] p-12 lg:p-16 w-full max-w-4xl"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-[var(--text-primary)]">
            Design Your Dream Rug: Let’s Get Started!
          </h2>
          <p className="font-sans text-[var(--text-secondary)] text-lg max-w-xl">
            Ready to bring your unique vision to life? Connect with our design specialists today to begin crafting your bespoke masterpiece.
          </p>
          <Link
            href="/contact"
            className="group flex items-center gap-4 bg-[var(--text-primary)] text-[var(--bg-primary)] px-8 py-4 rounded-full font-sans text-sm tracking-widest uppercase transition-transform hover:scale-105 duration-300 mt-4"
          >
            Start Your Project
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
