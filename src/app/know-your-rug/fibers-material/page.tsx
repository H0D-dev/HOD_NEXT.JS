import FibersHero from "../../../components/know-your-rug/FibersHero";
import FibersContent from "../../../components/know-your-rug/FibersContent";

export const metadata = {
  title: "Fibers & Material — House of Décor",
  description: "Explore our curated selection of premium rug materials and fibers including wool, silk, bamboo silk, cotton, and more.",
};

export default function FibersMaterialPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <FibersHero />
      <FibersContent />
    </main>
  );
}
