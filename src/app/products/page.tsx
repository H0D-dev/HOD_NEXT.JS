import type { Metadata } from "next";
import ProductsClient from "@/src/components/products/ProductsClient";

export const metadata: Metadata = {
  title: "Luxury Handwoven Rugs Collection",
  description:
    "Explore curated collections of luxury handwoven rugs designed for architectural interiors.",
  alternates: {
    canonical: "/products",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Luxury Handwoven Rugs Collection | House of Decór",
    description:
      "Explore curated collections of luxury handwoven rugs designed for architectural interiors.",
    url: "https://houseofdecor.ae/products",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "House of Decór Collections",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Handwoven Rugs Collection | House of Decór",
    description:
      "Explore curated collections of luxury handwoven rugs designed for architectural interiors.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
};

export default function ProductsPage() {
  return <ProductsClient />;
}
