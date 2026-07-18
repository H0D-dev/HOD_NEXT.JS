import AboutHero from "../../components/about/AboutHero";
import AboutMission from "../../components/about/AboutMission";
import AboutHandmade from "../../components/about/AboutHandmade";
import AboutConclusion from "../../components/about/AboutConclusion";

export const metadata = {
  title: "About Us — House of Décor",
  description: "Learn about House of Décor, our mission to support artisans, and our luxury custom-made rugs, curtains, and wallcoverings.",
};

export default function AboutPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <AboutHero />
      <AboutMission />
      <AboutHandmade />
      <AboutConclusion />
    </main>
  );
}
