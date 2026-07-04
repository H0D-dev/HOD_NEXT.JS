"use client";

import { motion } from "framer-motion";

const introCards = [
  {
    id: 1,
    title: "Positioning & Balance",
    description: "Ensure key furniture rests on the rug to unify the space and create a cohesive layout.",
  },
  {
    id: 2,
    title: "Size & Comfort",
    description: "A generous size expands the perceived space, while a rug that is too small can feel disjointed.",
  },
  {
    id: 3,
    title: "Borders & Patterns",
    description: "Consider how furniture placement affects the rug's pattern and design visibility.",
  },
  {
    id: 4,
    title: "Custom Rug Sizes",
    description: "If standard sizes don't quite fit, our bespoke service allows you to tailor dimensions.",
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

export default function IntroContent() {
  return (
    <section className="w-full pb-16 md:pb-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-secondary)] border border-[var(--border-secondary)]"
        >
          {introCards.map((card) => (
            <motion.div
              key={card.id}
              variants={itemVariants}
              className="bg-[var(--bg-primary)] p-10 md:p-16 hover:bg-[var(--bg-secondary)] transition-colors duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group flex flex-col justify-center h-full min-h-[300px]"
            >
              <h3 className="font-serif text-[clamp(24px,5vw,40px)] text-[var(--text-primary)] mb-6">
                {card.title}
              </h3>
              <p className="font-sans text-[var(--text-secondary)] text-base md:text-lg leading-relaxed max-w-md">
                {card.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
