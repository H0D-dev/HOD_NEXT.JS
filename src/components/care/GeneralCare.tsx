"use client";

import { motion } from "framer-motion";
import { Wind, ShieldCheck, RefreshCw, Scissors } from "lucide-react";

const generalCareTopics = [
  {
    id: 1,
    title: "Vacuuming",
    description: "Vacuum regularly without a beater bar or on the highest setting. Vacuum in the direction of the pile to maintain the rug's natural sheen and prevent fiber damage.",
    icon: Wind,
  },
  {
    id: 2,
    title: "Professional Cleaning",
    description: "We recommend professional hand-washing every 1 to 3 years depending on traffic. Never dry clean or steam clean handmade rugs, as harsh chemicals will strip the natural oils.",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Fluff & Shedding",
    description: "Shedding is entirely normal for new rugs made from natural fibers. It will subside after a few months of regular vacuuming. This does not affect the rug's lifespan.",
    icon: RefreshCw,
  },
  {
    id: 4,
    title: "Loose Threads",
    description: "If a thread comes loose or sprouts above the pile, never pull it. Simply snip it cleanly at the surface level with sharp scissors to maintain the smooth finish.",
    icon: Scissors,
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
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function GeneralCare() {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight">
            General Maintenance
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-secondary)] border border-[var(--border-secondary)]"
        >
          {generalCareTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <motion.div
                key={topic.id}
                variants={itemVariants}
                className="bg-[var(--surface-primary)] p-8 md:p-10 hover:bg-[var(--bg-tertiary)] transition-colors duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col group h-full"
              >
                <div className="mb-8 p-4 bg-[var(--bg-secondary)] rounded-full text-[var(--text-primary)] group-hover:bg-[var(--accent-primary)] group-hover:text-[var(--bg-primary)] transition-colors duration-[0.6s] self-start">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl text-[var(--text-primary)] mb-4">
                  {topic.title}
                </h3>
                <p className="font-sans text-[var(--text-secondary)] text-sm leading-relaxed mt-auto">
                  {topic.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
