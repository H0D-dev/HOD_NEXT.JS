"use client";

import React, { useEffect, useRef } from "react";
import SizeGuideHero from "./SizeGuideHero";
import GuideOverview from "./GuideOverview";
import LivingRoomGuide from "./LivingRoomGuide";
import BedroomGuide from "./BedroomGuide";
import DiningGuide from "./DiningGuide";
import FinalCTA from "./FinalCTA";
import { useAnalytics } from "@/src/lib/analytics/useAnalytics";

export default function SizeGuideClient() {
  const { trackSizeGuideOpen } = useAnalytics();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (!hasTrackedRef.current) {
      hasTrackedRef.current = true;
      trackSizeGuideOpen();
    }
  }, [trackSizeGuideOpen]);

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
