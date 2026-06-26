"use client";

import { motion } from "framer-motion";

const expertiseAreas = [
  {
    id: "01",
    title: "Product Development",
    description: "Collaborate directly with our master artisans to develop custom rug designs, specific fiber blends, and unique curtain structures tailored to your project.",
  },
  {
    id: "02",
    title: "Inspiration & Design Support",
    description: "Access our private showrooms virtually or in person, and work alongside our senior designers to conceptualize spaces and refine palettes.",
  },
  {
    id: "03",
    title: "Delivery & Installation",
    description: "White-glove delivery and meticulous installation handled by our trained professionals to ensure flawless execution in the final space.",
  },
  {
    id: "04",
    title: "Manufacturing",
    description: "Unparalleled quality control. We oversee every step from ethical sourcing of raw materials to the final hand-stitching in our own facilities.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
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

export default function TradeExpertise() {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight mb-6">
              World-Class Expertise
            </h2>
            <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed">
              We provide end-to-end solutions, giving designers absolute control over quality, timeline, and aesthetic execution.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-[var(--border-secondary)]"
        >
          {expertiseAreas.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="p-8 md:p-12 border-r border-b border-[var(--border-secondary)] bg-[var(--surface-primary)] hover:bg-[var(--bg-tertiary)] transition-colors duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group flex flex-col h-full"
            >
              <span className="font-sans text-xs text-[var(--text-muted)] tracking-widest mb-12 block group-hover:text-[var(--text-primary)] transition-colors duration-500">
                {item.id}
              </span>
              <h3 className="font-serif text-2xl text-[var(--text-primary)] mb-6">
                {item.title}
              </h3>
              <p className="font-sans text-[var(--text-secondary)] text-sm leading-relaxed mt-auto">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
