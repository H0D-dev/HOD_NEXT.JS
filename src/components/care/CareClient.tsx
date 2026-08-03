"use client";

import React from "react";
import CareHero from "./CareHero";
import GeneralCare from "./GeneralCare";
import MaterialCare from "./MaterialCare";
import SpecialTopics from "./SpecialTopics";
import CareCTA from "./CareCTA";

export default function CareClient() {
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
