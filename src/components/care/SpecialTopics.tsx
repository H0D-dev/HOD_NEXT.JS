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
    description: "Abrash refers to the natural and subtle color variations found in handmade rugs. This occurs when differently dyed batches of yarn are used. It is a hallmark of authenticity and hand-craftsmanship, not a flaw. Embrace it as the unique signature of your piece.",
  },
  {
    id: 2,
    title: "Preventing Fading",
    description: "Prolonged exposure to direct, harsh sunlight will eventually fade natural dyes. We highly recommend using window treatments or UV-filtering glass. Rotating your rug every six months ensures that any natural fading occurs evenly across the entire surface.",
  },
  {
    id: 3,
    title: "Moth Protection",
    description: "Moths are attracted to natural fibers like wool and silk, particularly in dark, undisturbed areas under heavy furniture. Regular vacuuming and moving furniture slightly when cleaning will disturb them. If storing a rug, always have it professionally cleaned and sealed first.",
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
    <section ref={containerRef} className="w-full py-24 md:py-32 px-4 md:px-8 bg-[var(--bg-secondary)] border-t border-[var(--border-secondary)]">
      <div className="max-w-[1440px] mx-auto">
        <div className="special-header mb-16 md:mb-24 max-w-2xl">
          <span className="block text-[var(--text-muted)] font-sans text-xs uppercase tracking-widest mb-6">
            Expert Knowledge
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-tight">
            Special Topics
          </h2>
        </div>

        <div className="special-grid grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {specialTopics.map((topic) => (
            <div
              key={topic.id}
              className="special-card flex flex-col pt-8 border-t border-[var(--border-secondary)]"
            >
              <h3 className="font-serif text-2xl text-[var(--text-primary)] mb-6">
                {topic.title}
              </h3>
              <p className="font-sans text-[var(--text-secondary)] text-base leading-relaxed">
                {topic.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
