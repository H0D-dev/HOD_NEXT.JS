"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import SizeGuideHero from "./SizeGuideHero";
import GuideOverview from "./GuideOverview";
import LivingRoomGuide from "./LivingRoomGuide";
import BedroomGuide from "./BedroomGuide";
import DiningGuide from "./DiningGuide";
import FinalCTA from "./FinalCTA";

export default function SizeGuideClient() {
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
      <SizeGuideHero />
      <GuideOverview />
      <LivingRoomGuide />
      <BedroomGuide />
      <DiningGuide />
      <FinalCTA />
    </main>
  );
}
