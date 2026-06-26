import GuideHero from "../../components/size-guide/GuideHero";
import IntroContent from "../../components/size-guide/IntroContent";
import BedroomGuide from "../../components/size-guide/BedroomGuide";
import LivingRoomGuide from "../../components/size-guide/LivingRoomGuide";
import GuideCTA from "../../components/size-guide/GuideCTA";

export const metadata = {
  title: "Size & Fitting Guide — House of Décor",
  description: "Learn how to select the perfect rug size for your bedroom, living room, and more with our comprehensive fitting guide.",
};

export default function SizeFittingGuidePage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <GuideHero />
      <IntroContent />
      <BedroomGuide />
      <LivingRoomGuide />
      <GuideCTA />
    </main>
  );
}
