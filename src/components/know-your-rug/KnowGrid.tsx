"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const topics = [
  {
    id: "weaving-techniques",
    title: "Weaving Techniques",
    description: "Explore our exquisite weaving techniques that blend tradition with modern artistry to create stunning, high-quality rugs.",
    image: "/rugs/set1-room.png", // Placeholder for: Woman weaving on a loom
  },
  {
    id: "fibers-material",
    title: "Fibers & Material",
    description: "Discover our premium fibers and materials, chosen for their durability and beauty, ensuring every rug is a masterpiece.",
    image: "/rugs/set1-texture.png", // Placeholder for: Spools of colorful thread
  },
  {
    id: "rug-making-process",
    title: "Rug Making Process",
    description: "Experience the meticulous rug-making process, where skilled artisans transform your design into a handcrafted work of art.",
    image: "/rugs/set2-texture.png", // Placeholder for: Partially finished woven rug
  },
  {
    id: "rug-guide",
    title: "Rug Guide",
    description: "Navigate your perfect rug choice with our comprehensive rug guide, featuring tips on style, size, and care for lasting beauty.",
    image: "/rugs/set2-room.png", // Placeholder for: Woman looking at folded rugs
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

export default function KnowGrid() {
  return (
    <section className="w-full pb-24 md:pb-40 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24"
        >
          {topics.map((topic) => (
            <motion.div key={topic.id} variants={itemVariants} className="flex flex-col group">
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-[var(--surface-primary)] border border-[var(--border-secondary)] mb-8">
                <Image
                  src={topic.image}
                  alt={topic.title}
                  fill
                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-105 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-4">
                {topic.title}
              </h3>
              <p className="font-sans text-[var(--text-secondary)] text-base md:text-lg leading-relaxed mb-8">
                {topic.description}
              </p>
              <Link 
                href={`/know-your-rug/${topic.id}`} 
                className="inline-block mt-auto font-sans font-medium text-xs tracking-[0.2em] uppercase text-[var(--text-primary)] border-b border-[var(--text-primary)] pb-1 w-max hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] transition-colors duration-300"
              >
                Learn More
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
