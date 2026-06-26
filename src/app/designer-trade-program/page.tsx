import TradeHero from "../../components/trade-program/TradeHero";
import TradeBenefits from "../../components/trade-program/TradeBenefits";
import TradeExpertService from "../../components/trade-program/TradeExpertService";
import TradeExpertise from "../../components/trade-program/TradeExpertise";
import TradeCTA from "../../components/trade-program/TradeCTA";

export const metadata = {
  title: "Designer Trade Program — House of Décor",
  description: "Exclusive trade benefits for interior design professionals. Partner with House of Décor for premium handmade rugs and bespoke curtains.",
};

export default function DesignerTradeProgramPage() {
  return (
    <main className="w-full flex flex-col bg-[var(--bg-primary)]">
      <TradeHero />
      <TradeBenefits />
      <TradeExpertService />
      <TradeExpertise />
      <TradeCTA />
    </main>
  );
}
