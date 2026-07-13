"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MessageSquare, Layers, PenTool, Hammer, CheckCircle, Truck } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  { id: "01", title: "Consultation", icon: MessageSquare },
  { id: "02", title: "Material Selection", icon: Layers },
  { id: "03", title: "Design & Prototyping", icon: PenTool },
  { id: "04", title: "Artisan Crafting", icon: Hammer },
  { id: "05", title: "Quality Assurance", icon: CheckCircle },
  { id: "06", title: "Installation", icon: Truck },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(gsap.utils.toArray(wrapperRef.current?.children || []), {
      y: 30,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-brand-light pt-8 md:pt-12 pb-24 md:pb-32" id="process-section">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">

        {/* Header */}
        <div className="mb-16 md:mb-24 flex flex-col items-start max-w-3xl">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-neutral-500 mb-4 block">
            THE BESPOKE JOURNEY
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-[42px] text-brand-dark leading-[1.15]">
            From concept to creation, a truly personalized experience.
          </h2>
        </div>

        {/* Timeline Wrapper */}
        <div className="relative flex flex-wrap md:flex-nowrap justify-between items-stretch gap-4 md:gap-6" ref={wrapperRef}>

          {/* Steps */}
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center justify-center w-[calc(50%-8px)] md:flex-1 bg-brand-light border border-brand-mid/20 rounded-lg p-5 md:p-6 min-h-[140px] md:min-h-[160px] group cursor-pointer hover:border-brand-mid/40 transition-colors duration-500">

                {/* Icon Slot */}
                <div className="w-12 h-12 flex items-center justify-center text-neutral-400 mb-4 transition-all duration-500 group-hover:-translate-y-2 group-hover:text-[#C9A87C] group-hover:scale-110">
                  <Icon strokeWidth={1.5} size={24} />
                </div>

                {/* Step Number */}
                <span className="font-sans text-neutral-400 text-[10px] uppercase tracking-widest mb-1 transition-colors duration-500 group-hover:text-neutral-900">
                  {step.id}
                </span>

                {/* Step Title */}
                <h3 className="text-xs text-neutral-800 uppercase tracking-widest text-center transition-colors duration-500 group-hover:text-[#C9A87C]">
                  {step.title}
                </h3>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
