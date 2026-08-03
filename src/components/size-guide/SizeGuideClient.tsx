"use client";

import React from "react";
import SizeGuideHero from "./SizeGuideHero";
import GuideOverview from "./GuideOverview";
import LivingRoomGuide from "./LivingRoomGuide";
import BedroomGuide from "./BedroomGuide";
import DiningGuide from "./DiningGuide";
import FinalCTA from "./FinalCTA";

export default function SizeGuideClient() {
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
