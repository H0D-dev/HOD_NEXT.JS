"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import SizeGuideHero from "../../components/size-guide/SizeGuideHero";
import GuideNavigation from "../../components/size-guide/GuideNavigation";
import GuideOverview from "../../components/size-guide/GuideOverview";
import QuoteBlock from "../../components/size-guide/QuoteBlock";
import LivingRoomGuide from "../../components/size-guide/LivingRoomGuide";
import BedroomGuide from "../../components/size-guide/BedroomGuide";
import DiningGuide from "../../components/size-guide/DiningGuide";
import CurtainGuide from "../../components/size-guide/CurtainGuide";
import FinalCTA from "../../components/size-guide/FinalCTA";

export default function SizeFittingGuidePage() {
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard easing
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Clean up
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)] selection:bg-[var(--text-primary)] selection:text-[var(--bg-primary)]">
      <SizeGuideHero />
      <GuideNavigation />
      <GuideOverview />
      <QuoteBlock />
      <LivingRoomGuide />
      <BedroomGuide />
      <DiningGuide />
      <CurtainGuide />
      <FinalCTA />
    </main>
  );
}
