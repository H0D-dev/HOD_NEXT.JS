import TradeHero from "../../components/trade-program/TradeHero";
import TradeBenefits from "../../components/trade-program/TradeBenefits";
import TradeExpertService from "../../components/trade-program/TradeExpertService";
import TradeExpertise from "../../components/trade-program/TradeExpertise";
import TradeCTA from "../../components/trade-program/TradeCTA";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Designer Trade Program — B2B Interior Design Partnership",
  description:
    "Exclusive trade benefits for interior architects and design professionals. Tiered trade pricing, complimentary swatch samples, 3D CAD assets, and custom weaving support.",
  alternates: { canonical: "/designer-trade-program" },
  openGraph: {
    title: "Designer Trade Program | House of Decór B2B Partnership",
    description:
      "Exclusive trade benefits for interior architects and design professionals. Tiered trade pricing, complimentary swatch samples, 3D CAD assets, and custom weaving support.",
    url: "https://houseofdecor.ae/designer-trade-program",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "House of Decór Designer Trade Program",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Designer Trade Program | House of Decór B2B Partnership",
    description:
      "Exclusive trade benefits for interior architects and design professionals. Tiered trade pricing, complimentary swatch samples, 3D CAD assets, and custom weaving support.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
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
