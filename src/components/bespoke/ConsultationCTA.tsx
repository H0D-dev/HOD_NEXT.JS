"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ConsultationCTA() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".cta-content",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-[#111111] text-white">
      <div className="container mx-auto px-6">
        <div className="w-full flex justify-center text-center">
          <h2 className="cta-content font-serif text-[clamp(32px,5vw,64px)] leading-[1.1] text-center">
            Your Space. Your Scale.<br />
            <span className="text-[#F7F77E] italic">Your Signature.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
