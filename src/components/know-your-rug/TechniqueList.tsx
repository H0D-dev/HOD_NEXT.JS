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

const techniques = [
  {
    id: "hand-knotted",
    title: "Hand Knotted",
    image: "/images/know-yout-rug/weaving_tech/KYR-Hand-Knotted-Production.png",
    paragraphs: [
      "A meticulous, time-honored process taking up to a year, where each knot is individually tied to build incredibly dense and intricate patterns."
    ]
  },
  {
    id: "hand-tufted",
    title: "Hand Tufted",
    image: "/images/know-yout-rug/weaving_tech/KYR-handTufted.png",
    paragraphs: [
      "Artisans use a tufting tool to punch yarn through a canvas backing, creating plush, beautifully textured designs with remarkable efficiency."
    ]
  },
  {
    id: "handloom",
    title: "Handloom",
    image: "/images/know-yout-rug/weaving_tech/KYR-Handloom-Production.png",
    paragraphs: [
      "Woven on a traditional loom by interlocking warp and weft threads, offering a refined, printed finish that perfectly highlights natural fibers."
    ]
  },
  {
    id: "flat-weave",
    title: "Flat Weave",
    image: "/images/know-yout-rug/weaving_tech/KYR-Flat-Weave-Production.png",
    paragraphs: [
      "Highly versatile and durable, these rugs are created without a pile, making them lightweight and perfect for displaying striking geometric patterns."
    ]
  }
];

export default function TechniqueList() {
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
          {techniques.map((technique, index) => (
            <motion.div
              key={technique.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as any }}
              className="flex flex-col items-start group cursor-pointer"
            >
              {/* Image with GSAP Parallax */}
              <div className="w-full aspect-square md:aspect-[2/3] relative overflow-hidden mb-4">
                <Image
                  ref={el => { imagesRef.current[index] = el; }}
                  src={technique.image}
                  alt={technique.title}
                  fill
                  className="absolute -top-[7.5%] h-[115%] object-cover transition-transform duration-[1.5s] group-hover:scale-105 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </div>

              {/* Text */}
              <span className="font-sans text-[10px] lg:text-xs text-[var(--text-muted)] tracking-widest mb-1 uppercase">
                0{index + 1}
              </span>
              <h2 className="font-sans text-sm font-medium text-[var(--text-primary)] mb-1 transition-colors duration-300">
                {technique.title}
              </h2>
              {technique.paragraphs.map((p, i) => (
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
