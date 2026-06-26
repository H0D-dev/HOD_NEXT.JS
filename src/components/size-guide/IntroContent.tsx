"use client";

import { motion } from "framer-motion";

const introCards = [
  {
    id: 1,
    title: "Positioning & Balance",
    description: "A rug anchors the room. Ensure all key furniture pieces rest at least partially on the rug to unify the space and create a cohesive layout.",
  },
  {
    id: 2,
    title: "Size & Comfort",
    description: "Bigger is generally better. A rug that is too small can make the room feel disjointed, whereas a generous size expands the perceived space.",
  },
  {
    id: 3,
    title: "Borders & Patterns",
    description: "Consider how furniture placement affects the rug's pattern. Central medallions need breathing room, while repeating patterns are more flexible.",
  },
  {
    id: 4,
    title: "Custom Rug Sizes",
    description: "Every room is unique. If standard sizes don't quite fit, our bespoke service allows you to tailor dimensions down to the centimeter.",
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
    <section className="w-full pb-24 md:pb-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
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
              <h3 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-6">
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
