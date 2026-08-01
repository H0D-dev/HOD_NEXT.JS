"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

import BespokeHero from "./BespokeHero";
import PhilosophySection from "./PhilosophySection";
import BespokeProcess from "./BespokeProcess";
import MaterialsSection from "./MaterialsSection";
import ConsultationCTA from "./ConsultationCTA";
import TestimonialsSection from "./TestimonialsSection";

export default function BespokeClient() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <BespokeHero />
      <PhilosophySection />
      <BespokeProcess />
      <MaterialsSection />
      <ConsultationCTA />
      <TestimonialsSection />
    </main>
  );
}
