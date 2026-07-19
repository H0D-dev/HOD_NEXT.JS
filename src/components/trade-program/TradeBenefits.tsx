"use client";

import React, { useRef } from "react";
import { Truck, Tag, Palette, BookOpen } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const benefits = [
  {
    id: 1,
    title: "Fast Shipping",
    description: "Expedited processing and shipping globally.",
    icon: Truck,
  },
  {
    id: 2,
    title: "Trade Pricing",
    description: "Exclusive tiered discounts on all collections.",
    icon: Tag,
  },
  {
    id: 3,
    title: "Access To Samples",
    description: "Complimentary swatches and strike-offs.",
    icon: Palette,
  },
  {
    id: 4,
    title: "Design Library Subscription",
    description: "Full access to 3D models and digital library.",
    icon: BookOpen,
  },
];

export default function TradeBenefits() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Heading animation
    gsap.fromTo(
      ".benefit-header",
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

    // Cards staggered arrival
    gsap.fromTo(
      ".benefit-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".benefit-grid",
          start: "top 80%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full py-8 md:py-12 lg:py-16 px-4 md:px-16 lg:px-24 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto">
        <div className="benefit-header text-center mb-10 md:mb-12">
          <h2 className="font-sans text-xl lg:text-2xl font-light text-[var(--text-primary)] tracking-tight">
            Exclusive Benefits
          </h2>
        </div>

        <div className="benefit-grid grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.id}
                className="benefit-card bg-[var(--surface-primary)] border border-[var(--border-secondary)] p-3 md:p-6 lg:p-8 transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:border-[var(--border-primary)] flex flex-col items-center md:items-start text-center md:text-left group"
              >
                <div className="mb-3 md:mb-6 p-3 md:p-4 bg-[var(--bg-secondary)] rounded-full text-[var(--text-primary)] group-hover:bg-[var(--accent-secondary)] transition-colors duration-[0.6s]">
                  <Icon size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />
                </div>
                <h3 className="font-sans text-[13px] md:text-base font-medium md:font-light text-[var(--text-primary)] mb-1 md:mb-2 leading-tight">
                  {benefit.title}
                </h3>
                <p className="hidden md:block font-sans text-[var(--text-secondary)] text-sm font-light leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
