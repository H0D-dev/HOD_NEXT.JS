"use client";

import React from "react";

import BespokeHero from "./BespokeHero";
import PhilosophySection from "./PhilosophySection";
import BespokeProcess from "./BespokeProcess";
import MaterialsSection from "./MaterialsSection";
import ConsultationCTA from "./ConsultationCTA";
import TestimonialsSection from "./TestimonialsSection";

export default function BespokeClient() {
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
