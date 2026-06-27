import TechniqueHero from "../../../components/know-your-rug/TechniqueHero";
import TechniqueList from "../../../components/know-your-rug/TechniqueList";

export const metadata = {
  title: "Weaving Techniques — House of Décor",
  description: "Explore the artistry behind our rugs with a deep dive into traditional and modern weaving techniques including hand-knotted, hand-tufted, handloom, and flat weaves.",
};

export default function WeavingTechniquesPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <TechniqueHero />
      <TechniqueList />
    </main>
  );
}
