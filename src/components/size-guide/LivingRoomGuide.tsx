"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const livingRoomGuides = [
  {
    id: "A",
    title: "All Legs On",
    description: "The rug is large enough to accommodate all legs of the main furniture pieces. This creates a highly unified, defined seating area.",
    image: "/curtains/set1-room.png",
  },
  {
    id: "B",
    title: "Front Legs On",
    description: "Only the front legs of sofas and chairs rest on the rug. This is the most popular layout, tying the room together while being cost-effective.",
    image: "/curtains/set2-room.png",
  },
  {
    id: "C",
    title: "Floating Layout",
    description: "The rug sits in the center of the seating arrangement with no furniture legs touching it (except a coffee table). Best for small, narrow spaces.",
    image: "/curtains/set3-room.png",
  },
  {
    id: "D",
    title: "Layered",
    description: "A smaller, textured rug layered over a larger, neutral foundational rug. Adds depth, texture, and visual interest to the living space.",
    image: "/rugs/set1-room.png",
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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function LivingRoomGuide() {
  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
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
            Living Rooms
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-24"
        >
          {livingRoomGuides.map((guide) => (
            <motion.div key={guide.id} variants={itemVariants} className="flex flex-col group">
              <div className="w-full aspect-video relative overflow-hidden bg-[var(--surface-primary)] border border-[var(--border-secondary)] mb-8">
                <Image
                  src={guide.image}
                  alt={`Living Room layout ${guide.id}`}
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
