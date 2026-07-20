"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const processSteps = [
  {
    num: "01",
    title: "CONSULTATION",
    desc: "Understanding vision, drawings and design intent.",
  },
  {
    num: "02",
    title: "MATERIAL SELECTION",
    desc: "Curated fibres, colours and construction techniques.",
  },
  {
    num: "03",
    title: "SAMPLING",
    desc: "Handcrafted strike-offs and prototypes.",
  },
  {
    num: "04",
    title: "PRODUCTION",
    desc: "Traditional craftsmanship with modern precision.",
  },
  {
    num: "05",
    title: "INSTALLATION",
    desc: "Professional delivery, installation and finishing.",
  },
];

export default function ProjectsProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate the timeline connecting line width
    gsap.from(".timeline-line", {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: trackRef.current,
        start: "top 80%",
      }
    });

    // Animate the steps fading in
    gsap.from(".process-step", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: trackRef.current,
        start: "top 80%",
      }
    });

    // Animate the circle backgrounds sequentially
    gsap.to(".process-circle", {
      backgroundColor: "#EAE3D8", // var(--bg-secondary)
      duration: 0.5,
      stagger: 0.3,
      ease: "power2.out",
      scrollTrigger: {
        trigger: trackRef.current,
        start: "top 80%",
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full pt-4 pb-12 md:pt-8 md:pb-16 px-5 md:px-10 lg:px-16 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col">
        
        <div className="flex items-center gap-4 mb-8 md:mb-12">
          <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)] font-medium">
            Our Design Process
          </span>
          <div className="flex-1 h-[1px] bg-[var(--border-secondary)] hidden md:block"></div>
        </div>

        <div className="w-full relative" ref={trackRef}>
          {/* Background Track Line (Desktop) */}
          <div className="hidden lg:block absolute top-[15px] left-8 right-8 h-[1px] bg-[var(--border-secondary)] z-0"></div>
          {/* Animated Highlight Line (Desktop) */}
          <div className="timeline-line hidden lg:block absolute top-[15px] left-8 right-8 h-[1px] bg-[var(--border-primary)] z-0"></div>

          <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-4 relative z-10">
            {processSteps.map((step, idx) => (
              <div key={idx} className="process-step flex flex-row lg:flex-col items-start gap-6 lg:gap-4 lg:w-1/5">
                
                {/* Circle Number */}
                <div className="process-circle w-8 h-8 rounded-full border border-[var(--border-primary)] bg-[var(--bg-primary)] flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-medium tracking-wider">{step.num}</span>
                </div>

                {/* Text Content */}
                <div className="flex flex-col pt-1 lg:pt-2">
                  <h4 className="font-sans text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)] mb-2">
                    {step.title}
                  </h4>
                  <p className="text-sm font-light text-[var(--text-secondary)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
