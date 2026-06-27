import AboutHero from "../../components/about/AboutHero";
import AboutMission from "../../components/about/AboutMission";

export const metadata = {
  title: "About Us — House of Décor",
  description: "Learn about House of Décor, our mission to support artisans, and our luxury custom-made rugs, curtains, and wallcoverings.",
};

export default function AboutPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <AboutHero />
      <AboutMission />
    </main>
  );
}
