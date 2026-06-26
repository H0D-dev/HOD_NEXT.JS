"use client";

import { motion } from "framer-motion";
import { Truck, Tag, Palette, BookOpen } from "lucide-react";

const benefits = [
  {
    id: 1,
    title: "Fast Shipping",
    description: "Expedited processing and shipping for all our trade partners globally.",
    icon: Truck,
  },
  {
    id: 2,
    title: "Trade Pricing",
    description: "Exclusive tiered discounts on our entire collection of rugs and curtains.",
    icon: Tag,
  },
  {
    id: 3,
    title: "Access To Samples",
    description: "Complimentary material swatches and strike-offs for your design presentations.",
    icon: Palette,
  },
  {
    id: 4,
    title: "Design Library Subscription",
    description: "Full access to our 3D models, textures, and comprehensive digital library.",
    icon: BookOpen,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function TradeBenefits() {
  return (
    <section className="w-full py-20 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight">
            Exclusive Benefits
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.id}
                variants={itemVariants}
                className="bg-[var(--surface-primary)] border border-[var(--border-secondary)] p-8 md:p-10 transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:border-[var(--border-primary)] flex flex-col items-start group"
              >
                <div className="mb-8 p-4 bg-[var(--bg-secondary)] rounded-full text-[var(--text-primary)] group-hover:bg-[var(--accent-primary)] transition-colors duration-[0.6s]">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="font-sans text-lg font-medium text-[var(--text-primary)] mb-4">
                  {benefit.title}
                </h3>
                <p className="font-sans text-[var(--text-secondary)] text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
