"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const phases = [
  {
    id: "sourcing",
    title: "Sourcing Raw Materials",
    subtitle: "The Foundation of Handcrafting",
    image: "/rugs/set1-texture.png",
    paragraphs: [
      "True craftsmanship begins with the finest raw materials, sourced globally and meticulously hand-sorted to uphold the artistry of the final product."
    ]
  },
  {
    id: "carding-spinning",
    title: "Carding & Spinning",
    subtitle: "A Heritage of Craft",
    image: "/rugs/set2-texture.png",
    paragraphs: [
      "Once washed, wool is hand-carded to remove impurities, then spun into durable yarn on a traditional charka, preserving centuries of Indian heritage."
    ]
  },
  {
    id: "dyeing",
    title: "Dyeing",
    subtitle: "Art in Color",
    image: "/rugs/set3-texture.png",
    paragraphs: [
      "Yarn is immersed in boiling vats of eco-friendly dye and sun-dried, creating subtle, beautiful color variations known as Abrash that give each rug its unique character."
    ]
  },
  {
    id: "weaving",
    title: "Weaving",
    subtitle: "The Craft of Precision",
    image: "/rugs/set1-room.png",
    paragraphs: [
      "The heart of rug-making. Skilled artisans meticulously transform yarn into intricate patterns, working knot by knot with breathtaking precision and centuries-old expertise."
    ]
  }
];

export default function ProcessPhases() {
  return (
    <section className="w-full pb-16 md:pb-40 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)] pt-12 md:pt-20 border-b border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
              className="flex flex-col group cursor-pointer"
            >
              {/* Image */}
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-[var(--surface-primary)] border border-[var(--border-secondary)] mb-8">
                <Image
                  src={phase.image}
                  alt={phase.title}
                  fill
                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-105 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </div>

              {/* Text */}
              <span className="font-sans text-[10px] md:text-xs text-[var(--text-muted)] tracking-widest mb-4 uppercase">
                Phase 0{index + 1}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--text-primary)] mb-2 transition-colors duration-300">
                {phase.title}
              </h2>
              <h3 className="font-sans text-lg md:text-xl font-light text-[var(--text-secondary)] mb-4 italic">
                {phase.subtitle}
              </h3>
              {phase.paragraphs.map((p, i) => (
                <p key={i} className="font-sans text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                  {p}
                </p>
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
