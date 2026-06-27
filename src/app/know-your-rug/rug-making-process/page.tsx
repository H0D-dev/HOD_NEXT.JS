import ProcessHero from "../../../components/know-your-rug/ProcessHero";
import ProcessPhases from "../../../components/know-your-rug/ProcessPhases";
import ProcessFinishing from "../../../components/know-your-rug/ProcessFinishing";

export const metadata = {
  title: "Rug Making Process — House of Décor",
  description: "Transforming designs into masterpieces. Explore the artisanal journey of sourcing, carding, dyeing, weaving, and the 18 steps of finishing a handcrafted rug.",
};

export default function RugMakingProcessPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <ProcessHero />
      <ProcessPhases />
      <ProcessFinishing />
    </main>
  );
}
