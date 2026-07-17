"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const specialTopics = [
  {
    id: 1,
    title: "Understanding Abrash",
    description: "Abrash refers to the natural color variations found in handmade rugs. A hallmark of authenticity—not a flaw—embrace it as your piece's unique signature.",
  },
  {
    id: 2,
    title: "Preventing Fading",
    description: "Direct sunlight eventually fades natural dyes. Use window treatments or rotate your rug every six months to ensure even wear.",
  },
  {
    id: 3,
    title: "Moth Protection",
    description: "Moths target natural fibers in dark, undisturbed areas. Vacuum regularly and have your rug professionally cleaned and sealed before storage.",
  },
];

export default function SpecialTopics() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".special-header",
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      ".special-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".special-grid",
          start: "top 85%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full py-8 md:py-12 px-6 md:px-8 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[1440px] mx-auto">
        <div className="special-header mb-6 md:mb-10 max-w-2xl">
          <span className="block text-[var(--text-muted)] font-sans text-xs uppercase tracking-widest mb-3 md:mb-4">
            Expert Knowledge
          </span>
          <h2 className="font-serif text-xl md:text-2xl lg:text-3xl leading-[1.2] text-[var(--text-primary)] tracking-tight">
            Special Topics
          </h2>
        </div>

        <div className="special-grid grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {specialTopics.map((topic) => (
            <div
              key={topic.id}
              className="special-card flex flex-col pt-4 md:pt-6 border-t border-[var(--border-secondary)]"
            >
              <h3 className="font-sans text-base md:text-lg font-medium text-[var(--text-primary)] mb-4">
                {topic.title}
              </h3>
              <p className="font-sans text-[var(--text-secondary)] text-sm leading-relaxed">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
