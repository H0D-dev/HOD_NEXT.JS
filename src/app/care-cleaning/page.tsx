"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import CareHero from "../../components/care/CareHero";
import GeneralCare from "../../components/care/GeneralCare";
import MaterialCare from "../../components/care/MaterialCare";
import SpecialTopics from "../../components/care/SpecialTopics";
import CareCTA from "../../components/care/CareCTA";

export default function CareCleaningPage() {
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
    <main className="w-full flex flex-col bg-[var(--bg-primary)] selection:bg-[var(--text-primary)] selection:text-[var(--bg-primary)]">
      <CareHero />
      <GeneralCare />
      <MaterialCare />
      <SpecialTopics />
      <CareCTA />
    </main>
  );
}
