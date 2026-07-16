"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

import BespokeHero from "../../components/bespoke/BespokeHero";
import PhilosophySection from "../../components/bespoke/PhilosophySection";
import BespokeProcess from "../../components/bespoke/BespokeProcess";
import MaterialsSection from "../../components/bespoke/MaterialsSection";

import ConsultationCTA from "../../components/bespoke/ConsultationCTA";
import TestimonialsSection from "../../components/bespoke/TestimonialsSection";

export default function BespokePage() {
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
