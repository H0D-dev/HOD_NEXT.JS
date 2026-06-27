import KnowHero from "../../components/know-your-rug/KnowHero";
import KnowGrid from "../../components/know-your-rug/KnowGrid";

export const metadata = {
  title: "Know Your Rug — House of Décor",
  description: "Discover the craftsmanship behind House of Décor. Learn about weaving techniques, premium fibers, and the meticulous rug-making process.",
};

export default function KnowYourRugPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <KnowHero />
      <KnowGrid />
    </main>
  );
}
