"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const phases = [
  {
    id: "sourcing",
    title: "Sourcing Raw Materials",
    subtitle: "The Foundation of Handcrafting",
    image: "/images/materials.png",
    paragraphs: [
      "True craftsmanship begins with the finest raw materials, sourced globally and meticulously hand-sorted to uphold the artistry of the final product."
    ]
  },
  {
    id: "carding-spinning",
    title: "Carding & Spinning",
    subtitle: "A Heritage of Craft",
    image: "/images/know-yout-rug/rug-making-process/KYR-Carding%20Spinning.png",
    paragraphs: [
      "Once washed, wool is hand-carded to remove impurities, then spun into durable yarn on a traditional charka, preserving centuries of Indian heritage."
    ]
  },
  {
    id: "dyeing",
    title: "Dyeing",
    subtitle: "Art in Color",
    image: "/images/know-yout-rug/rug-making-process/KYR-Dyeing.png",
    paragraphs: [
      "Yarn is immersed in boiling vats of eco-friendly dye and sun-dried, creating subtle, beautiful color variations known as Abrash that give each rug its unique character."
    ]
  },
  {
    id: "weaving",
    title: "Weaving",
    subtitle: "The Craft of Precision",
    image: "/images/know-yout-rug/rug-making-process/KYR-Weaving.png",
    paragraphs: [
      "The heart of rug-making. Skilled artisans meticulously transform yarn into intricate patterns, working knot by knot with breathtaking precision and centuries-old expertise."
    ]
  }
];

export default function ProcessPhases() {
  const sectionRef = useRef<HTMLElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);

  useGSAP(() => {
    imagesRef.current.forEach((img, i) => {
      if (img) {
        gsap.to(img, {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: img.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full pt-0 pb-12 lg:pb-16 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[1600px] mx-auto bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)] px-4 md:px-6 lg:px-8 pb-12 lg:pb-16 pt-6 lg:pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-4">
          {phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
              className="flex flex-col items-start group cursor-pointer"
            >
              <div className="w-full aspect-square md:aspect-[2/3] relative overflow-hidden mb-4">
                <Image
                  ref={el => { imagesRef.current[index] = el; }}
                  src={phase.image}
                  alt={phase.title}
                  fill
                  className="absolute -top-[7.5%] h-[115%] object-cover transition-transform duration-[1.5s] group-hover:scale-105 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </div>

              {/* Text */}
              <span className="font-sans text-[10px] lg:text-xs text-[var(--text-muted)] tracking-widest mb-1 uppercase">
                0{index + 1}
              </span>
              <h2 className="font-sans text-sm font-medium text-[var(--text-primary)] mb-1 transition-colors duration-300">
                {phase.title}
              </h2>
              {/* Note: In small cards, subtitles are removed or kept very minimal, but we'll include it slightly smaller if it exists */}
              <h3 className="font-sans text-[10px] lg:text-xs font-light text-[var(--text-secondary)] mb-1 italic">
                {phase.subtitle}
              </h3>
              {phase.paragraphs.map((p, i) => (
                <p key={i} className="font-sans text-sm font-light text-[var(--text-secondary)] leading-relaxed mb-4 max-w-[400px]">
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
