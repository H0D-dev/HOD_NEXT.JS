import type { Metadata } from "next";
import BespokeClient from "@/src/components/bespoke/BespokeClient";

export const metadata: Metadata = {
  title: "Bespoke Custom Rugs & Tailored Drapery",
  description:
    "Commission custom handmade rugs and bespoke curtains tailored to your exact architectural dimensions, materials, and color specifications.",
  alternates: {
    canonical: "/bespoke",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Bespoke Custom Rugs & Tailored Drapery | House of Decór",
    description:
      "Commission custom handmade rugs and bespoke curtains tailored to your exact architectural dimensions, materials, and color specifications.",
    url: "https://houseofdecor.ae/bespoke",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "Bespoke Custom Rugs & Drapery",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bespoke Custom Rugs & Tailored Drapery | House of Decór",
    description:
      "Commission custom handmade rugs and bespoke curtains tailored to your exact architectural dimensions, materials, and color specifications.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
};

export default function BespokePage() {
  return <BespokeClient />;
}
