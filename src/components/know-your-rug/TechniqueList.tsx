"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const techniques = [
  {
    id: "hand-knotted",
    title: "Hand Knotted",
    image: "/rugs/set1-texture.png",
    paragraphs: [
      "A meticulous, time-honored process taking up to a year, where each knot is individually tied to build incredibly dense and intricate patterns."
    ]
  },
  {
    id: "hand-tufted",
    title: "Hand Tufted",
    image: "/rugs/set2-texture.png",
    paragraphs: [
      "Artisans use a tufting tool to punch yarn through a canvas backing, creating plush, beautifully textured designs with remarkable efficiency."
    ]
  },
  {
    id: "handloom",
    title: "Handloom",
    image: "/rugs/set3-texture.png",
    paragraphs: [
      "Woven on a traditional loom by interlocking warp and weft threads, offering a refined, printed finish that perfectly highlights natural fibers."
    ]
  },
  {
    id: "flat-weave",
    title: "Flat Weave",
    image: "/rugs/set1-room.png",
    paragraphs: [
      "Highly versatile and durable, these rugs are created without a pile, making them lightweight and perfect for displaying striking geometric patterns."
    ]
  }
];

export default function TechniqueList() {
  return (
    <section className="w-full pb-16 md:pb-40 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col gap-24 md:gap-32">
        {techniques.map((technique, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <div
              key={technique.id}
              className={`flex flex-col ${
                isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center gap-12 lg:gap-24`}
            >
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
                className="flex-1 w-full aspect-square relative overflow-hidden bg-[var(--surface-primary)] border border-[var(--border-secondary)]"
              >
                <Image
                  src={technique.image}
                  alt={technique.title}
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
                  Technique 0{index + 1}
                </span>
                <h2 className="font-serif text-[clamp(32px,5vw,64px)] text-[var(--text-primary)] mb-8">
                  {technique.title}
                </h2>
                <div className="flex flex-col gap-6">
                  {technique.paragraphs.map((p, i) => (
                    <p key={i} className="font-sans text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                      {p}
                    </p>
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
