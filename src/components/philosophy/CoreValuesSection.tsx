"use client";

import { useRef } from "react";
import { Hand, Leaf, Gem, Globe } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    icon: Hand,
    title: "HANDMADE\nWITH CARE",
    description: "Each rug is meticulously\nhandcrafted by skilled\nartisans."
  },
  {
    icon: Leaf,
    title: "NATURAL &\nSUSTAINABLE",
    description: "We use natural materials\nand sustainable practices\nfor a better tomorrow."
  },
  {
    icon: Gem,
    title: "TIMELESS\nDESIGN",
    description: "Elegant, enduring designs\nthat elevate every\nspace."
  },
  {
    icon: Globe,
    title: "WORLDWIDE\nSHIPPING",
    description: "Complimentary shipping\non all orders, delivered\nto your door."
  }
];

export default function CoreValuesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".feature-item", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 85%",
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-[#F5F2ED] py-8 md:py-12 border-b border-[#2C251F]/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-4 gap-2 md:gap-0">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-item flex flex-col items-center justify-start text-center px-1 md:px-4 ${
                index !== features.length - 1 ? 'border-r border-[#2C251F]/10' : ''
              }`}
            >
              <div className="mb-3 md:mb-6 text-[#2C251F]/80 flex items-center justify-center">
                <feature.icon strokeWidth={1} className="w-7 h-7 md:w-9 md:h-9" />
              </div>
              <h3 className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-[var(--text-primary)] mb-0 md:mb-4 whitespace-pre-line leading-relaxed">
                {feature.title}
              </h3>
              <p className="hidden md:block font-sans text-[var(--text-secondary)] font-light text-sm lg:text-base leading-relaxed whitespace-pre-line max-w-[240px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
