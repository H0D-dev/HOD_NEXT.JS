import GuideHero from "../../../components/know-your-rug/GuideHero";
import GuideContent from "../../../components/know-your-rug/GuideContent";
import GuideFacts from "../../../components/know-your-rug/GuideFacts";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handmade vs Machine Rugs Buying Guide — House of Decór",
  description:
    "Expert guide on selecting luxury rugs. Understand handmade vs machine-made differences, ambient lighting adjustments, placement rules, and common buyer mistakes.",
  alternates: { canonical: "/know-your-rug/rug-guide" },
  openGraph: {
    title: "Handmade vs Machine Rugs Buying Guide | House of Decór",
    description:
      "Expert guide on selecting luxury rugs. Understand handmade vs machine-made differences, ambient lighting adjustments, placement rules, and common buyer mistakes.",
    url: "https://houseofdecor.ae/know-your-rug/rug-guide",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "Luxury Rug Selection Guide",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Handmade vs Machine Rugs Buying Guide | House of Decór",
    description:
      "Expert guide on selecting luxury rugs. Understand handmade vs machine-made differences, ambient lighting adjustments, placement rules, and common buyer mistakes.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
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
