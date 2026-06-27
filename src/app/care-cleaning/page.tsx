import CareHero from "../../components/care/CareHero";
import GeneralCare from "../../components/care/GeneralCare";
import MaterialCare from "../../components/care/MaterialCare";
import SpecialTopics from "../../components/care/SpecialTopics";
import CareCTA from "../../components/care/CareCTA";

export const metadata = {
  title: "Care & Cleaning — House of Décor",
  description: "Learn how to care for your premium handmade rugs and curtains. Guidelines for wool, silk, cashmere, and general maintenance.",
};

export default function CareCleaningPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <CareHero />
      <GeneralCare />
      <MaterialCare />
      <SpecialTopics />
      <CareCTA />
    </main>
  );
}
