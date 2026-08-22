import ProcessHero from "../../../components/know-your-rug/ProcessHero";
import ProcessPhases from "../../../components/know-your-rug/ProcessPhases";
import ProcessFinishing from "../../../components/know-your-rug/ProcessFinishing";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artisanal Rug Making Process — 18 Steps of Handcrafted Luxury",
  description:
    "Explore the artisanal journey: wool sourcing, carding, pot-dyeing, master hand-knotting, and the 18 precise steps of rug washing and finishing.",
  alternates: { canonical: "/know-your-rug/rug-making-process" },
  openGraph: {
    title: "Artisanal Rug Making Process — 18 Steps | House of Decór",
    description:
      "Explore the artisanal journey: wool sourcing, carding, pot-dyeing, master hand-knotting, and the 18 precise steps of rug washing and finishing.",
    url: "https://houseofdecor.ae/know-your-rug/rug-making-process",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "Handcrafted Rug Making Process",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artisanal Rug Making Process — 18 Steps | House of Decór",
    description:
      "Explore the artisanal journey: wool sourcing, carding, pot-dyeing, master hand-knotting, and the 18 precise steps of rug washing and finishing.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
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
