"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wind, ShieldCheck, RefreshCw, Scissors } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const generalCareTopics = [
  {
    id: 1,
    title: "Vacuuming",
    description: "Vacuum regularly without a beater bar or on the highest setting. Vacuum in the direction of the pile to maintain the rug's natural sheen and prevent fiber damage.",
    icon: Wind,
  },
  {
    id: 2,
    title: "Professional Cleaning",
    description: "We recommend professional hand-washing every 1 to 3 years depending on traffic. Never dry clean or steam clean handmade rugs, as harsh chemicals will strip the natural oils.",
    icon: ShieldCheck,
  },
  {
    id: 3,
    title: "Fluff & Shedding",
    description: "Shedding is entirely normal for new rugs made from natural fibers. It will subside after a few months of regular vacuuming. This does not affect the rug's lifespan.",
    icon: RefreshCw,
  },
  {
    id: 4,
    title: "Loose Threads",
    description: "If a thread comes loose or sprouts above the pile, never pull it. Simply snip it cleanly at the surface level with sharp scissors to maintain the smooth finish.",
    icon: Scissors,
  },
];

export default function GeneralCare() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".gen-care-header",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );

    gsap.fromTo(
      ".gen-care-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".gen-care-grid",
          start: "top 85%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full py-16 md:py-32 px-4 md:px-8 bg-[var(--bg-secondary)]">
      <div className="max-w-[1440px] mx-auto">
        <div className="gen-care-header text-center mb-16 md:mb-24">
          <h2 className="font-serif text-[clamp(32px,5vw,64px)] text-[var(--text-primary)] tracking-tight">
            General Maintenance
          </h2>
        </div>

        <div className="gen-care-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-secondary)] border border-[var(--border-secondary)]">
          {generalCareTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <div
                key={topic.id}
                className="gen-care-card bg-[var(--surface-primary)] p-8 md:p-10 hover:bg-[var(--bg-tertiary)] transition-colors duration-500 flex flex-col group h-full"
              >
                <div className="mb-8 p-4 bg-transparent border border-[var(--border-primary)] rounded-none text-[var(--text-primary)] group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-primary)] transition-colors duration-500 self-start">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-2xl text-[var(--text-primary)] mb-4">
                  {topic.title}
                </h3>
                <p className="font-sans text-[var(--text-secondary)] text-sm leading-relaxed mt-auto">
                  {topic.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
