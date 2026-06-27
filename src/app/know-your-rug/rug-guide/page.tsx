import GuideHero from "../../../components/know-your-rug/GuideHero";
import GuideContent from "../../../components/know-your-rug/GuideContent";
import GuideFacts from "../../../components/know-your-rug/GuideFacts";

export const metadata = {
  title: "Rug Guide — House of Décor",
  description: "Discover the art of rug selection. Learn about handmade vs machine-made rugs, lighting conditions, common mistakes, and quick facts to help you find your ideal piece.",
};

export default function RugGuidePage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <GuideHero />
      <GuideContent />
      <GuideFacts />
    </main>
  );
}
