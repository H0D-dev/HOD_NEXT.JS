"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const phases = [
  {
    id: "sourcing",
    title: "Sourcing Raw Materials",
    subtitle: "The Foundation of Handcrafting",
    image: "/rugs/set1-texture.png",
    content: [
      {
        heading: "",
        body: "True craftsmanship begins with the finest raw materials, sourced globally and meticulously hand-sorted to uphold the artistry of the final product."
      }
    ]
  },
  {
    id: "carding-spinning",
    title: "Carding & Spinning",
    subtitle: "A Heritage of Craft",
    image: "/rugs/set2-texture.png",
    content: [
      {
        heading: "",
        body: "Once washed, wool is hand-carded to remove impurities, then spun into durable yarn on a traditional charka, preserving centuries of Indian heritage."
      }
    ]
  },
  {
    id: "dyeing",
    title: "Dyeing",
    subtitle: "Art in Color",
    image: "/rugs/set3-texture.png",
    content: [
      {
        heading: "",
        body: "Yarn is immersed in boiling vats of eco-friendly dye and sun-dried, creating subtle, beautiful color variations known as Abrash that give each rug its unique character."
      }
    ]
  },
  {
    id: "weaving",
    title: "Weaving",
    subtitle: "The Craft of Precision",
    image: "/rugs/set1-room.png",
    content: [
      {
        heading: "",
        body: "The heart of rug-making. Skilled artisans meticulously transform yarn into intricate patterns, working knot by knot with breathtaking precision and centuries-old expertise."
      }
    ]
  }
];

export default function ProcessPhases() {
  return (
    <section className="w-full py-16 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col gap-24 md:gap-40">
        {phases.map((phase, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <div
              key={phase.id}
              className={`flex flex-col ${
                isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center gap-12 lg:gap-24`}
            >
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
                className="flex-1 w-full aspect-square relative overflow-hidden bg-[var(--surface-primary)] border border-[var(--border-secondary)]"
              >
                <Image
                  src={phase.image}
                  alt={phase.title}
                  fill
                  className="object-cover transition-transform duration-[1.5s] hover:scale-105 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </motion.div>

              {/* Text Side */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
                className="flex-1 w-full flex flex-col justify-center"
              >
                <span className="font-sans text-xs text-[var(--text-muted)] tracking-widest mb-6 uppercase">
                  Phase 0{index + 1}
                </span>
                <h2 className="font-serif text-[clamp(32px,5vw,64px)] text-[var(--text-primary)] mb-4">
                  {phase.title}
                </h2>
                <h3 className="font-sans text-lg text-[var(--text-secondary)] italic mb-10">
                  {phase.subtitle}
                </h3>
                
                <div className="flex flex-col gap-8">
                  {phase.content.map((block, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      {block.heading && (
                        <h4 className="font-sans font-medium text-[var(--text-primary)] text-lg">
                          {block.heading}
                        </h4>
                      )}
                      {block.body && (
                        <p className="font-sans text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                          {block.body}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
