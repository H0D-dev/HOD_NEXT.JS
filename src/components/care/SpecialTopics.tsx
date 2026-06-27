"use client";

import { motion } from "framer-motion";

const specialTopics = [
  {
    id: 1,
    title: "Understanding Abrash",
    description: "Abrash refers to the natural and subtle color variations found in handmade rugs. This occurs when differently dyed batches of yarn are used. It is a hallmark of authenticity and hand-craftsmanship, not a flaw. Embrace it as the unique signature of your piece.",
  },
  {
    id: 2,
    title: "Preventing Fading",
    description: "Prolonged exposure to direct, harsh sunlight will eventually fade natural dyes. We highly recommend using window treatments or UV-filtering glass. Rotating your rug every six months ensures that any natural fading occurs evenly across the entire surface.",
  },
  {
    id: 3,
    title: "Moth Protection",
    description: "Moths are attracted to natural fibers like wool and silk, particularly in dark, undisturbed areas under heavy furniture. Regular vacuuming and moving furniture slightly when cleaning will disturb them. If storing a rug, always have it professionally cleaned and sealed first.",
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

export default function SpecialTopics() {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="mb-16 md:mb-24 max-w-2xl"
        >
          <span className="block text-[var(--text-muted)] font-sans text-xs uppercase tracking-widest mb-6">
            Expert Knowledge
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight">
            Special Topics
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
        >
          {specialTopics.map((topic) => (
            <motion.div
              key={topic.id}
              variants={itemVariants}
              className="flex flex-col pt-8 border-t border-[var(--border-secondary)]"
            >
              <h3 className="font-serif text-2xl text-[var(--text-primary)] mb-6">
                {topic.title}
              </h3>
              <p className="font-sans text-[var(--text-secondary)] text-base leading-relaxed">
                {topic.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
