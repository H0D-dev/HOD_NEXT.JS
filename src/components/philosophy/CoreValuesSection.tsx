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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-y-0">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-item flex flex-col items-center text-center px-4 ${
                index !== features.length - 1 ? 'lg:border-r lg:border-[#2C251F]/10' : ''
              }`}
            >
              <div className="mb-6 text-[#2C251F]/80">
                <feature.icon strokeWidth={1} size={36} />
              </div>
              <h3 className="font-sans text-[11px] md:text-xs uppercase tracking-[0.15em] text-[#2C251F] mb-4 whitespace-pre-line leading-relaxed">
                {feature.title}
              </h3>
              <p className="font-sans text-[#2C251F]/70 text-sm md:text-[15px] leading-[1.6] whitespace-pre-line max-w-[240px]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
