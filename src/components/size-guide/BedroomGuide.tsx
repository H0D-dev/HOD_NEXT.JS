"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const bedroomGuides = [
  {
    id: "A",
    title: "All On",
    description: "The bed and all nightstands are placed entirely on the rug. This luxurious layout requires the largest rug size and grounds the entire sleeping area.",
    image: "/rugs/set1-room.png",
  },
  {
    id: "B",
    title: "Partially On",
    description: "The lower two-thirds of the bed rests on the rug, leaving the nightstands off. A classic, balanced approach that adds softness where you step out.",
    image: "/rugs/set2-room.png",
  },
  {
    id: "C",
    title: "Runners",
    description: "Using runners on either side of the bed (and optionally at the foot). An excellent solution for spaces where a large rug isn't feasible.",
    image: "/rugs/set3-room.png",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function BedroomGuide() {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="mb-16 md:mb-24 text-center"
        >
          <span className="block text-[var(--text-muted)] font-sans text-xs uppercase tracking-widest mb-6">
            Room Guide
          </span>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[var(--text-primary)] tracking-tight">
            Bedrooms
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
        >
          {bedroomGuides.map((guide) => (
            <motion.div key={guide.id} variants={itemVariants} className="flex flex-col group">
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-[var(--surface-primary)] border border-[var(--border-secondary)] mb-8">
                <Image
                  src={guide.image}
                  alt={`Bedroom layout ${guide.id}`}
                  fill
                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-105 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </div>
              <h3 className="font-serif text-2xl md:text-3xl text-[var(--text-primary)] mb-4">
                {guide.title}
              </h3>
              <p className="font-sans text-[var(--text-secondary)] text-base leading-relaxed">
                {guide.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
