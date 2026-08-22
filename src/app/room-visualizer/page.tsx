import type { Metadata } from "next";
import { Suspense } from "react";
import StandaloneVisualizerClient from "@/src/components/room-visualizer/StandaloneVisualizerClient";
import { generateWebApplicationSchema, generateBreadcrumbSchema, BASE_URL } from "@/src/lib/seo/schema";
import { fetchCatalogProducts } from "@/src/lib/product/getCatalogProducts";
import { Product } from "@/src/components/product-presentation/ProductPresentation";

export const metadata: Metadata = {
  title: "Virtual Room Visualizer — 3D Rug & Flooring Simulator",
  description:
    "Preview luxury handmade rugs in your own room or curated interior spaces in real-time. Interactive 2D/3D visualizer with custom room upload, ambient lighting, and precision scale.",
  alternates: {
    canonical: "/room-visualizer",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Virtual Room Visualizer | House of Decór 3D Floor Simulator",
    description:
      "Preview luxury handmade rugs in your own room or curated interior spaces in real-time. Interactive 2D/3D visualizer with custom room upload, ambient lighting, and precision scale.",
    url: "https://houseofdecor.ae/room-visualizer",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "House of Decór Virtual Room Visualizer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Room Visualizer | House of Decór 3D Floor Simulator",
    description:
      "Preview luxury handmade rugs in your own room or curated interior spaces in real-time. Interactive 2D/3D visualizer with custom room upload, ambient lighting, and precision scale.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
};

export const revalidate = 300;

export default async function RoomVisualizerPage() {
  let catalogProducts: Product[] = [];
  try {
    const rawRugs = await fetchCatalogProducts("rugs");
    if (Array.isArray(rawRugs) && rawRugs.length > 0) {
      catalogProducts = rawRugs
        .filter((p: any) => p && p.slug)
        .map((p: any) => {
          const rawImages = p.galleryImages || (p.mainImage ? [p.mainImage] : []);
          // Choose texture URL (second image or primary image)
          const textureUrl =
            rawImages[1]?.src ||
            rawImages[0]?.src ||
            p.mainImage?.src ||
            "";
          const lifestyleUrl =
            rawImages[0]?.src ||
            p.mainImage?.src ||
            "";

          const colorName = p.acf?.productColor || "Original";
          const parsedPrice = typeof p.price === "number" ? p.price : parseFloat(p.price) || 6450;
          const parsedRegPrice = typeof p.regularPrice === "number" ? p.regularPrice : parseFloat(p.regularPrice) || 7200;

          return {
            id: String(p.id),
            name: p.name,
            slug: p.slug,
            description: p.description ? p.description.replace(/<[^>]+>/g, "").slice(0, 160).trim() : `${p.name} luxury handmade rug.`,
            collection: p.categories?.[0]?.name || "Bespoke Rugs",
            design: p.acf?.designId || "Artisanal Hand-Knotted",
            price: parsedPrice,
            regularPrice: parsedRegPrice,
            stockStatus: p.stockStatus || "instock",
            productType: "simple" as const,
            colors: [
              {
                id: `c-${p.id}`,
                name: colorName,
                code: p.sku || `HOD-${p.id}`,
                textureUrl: textureUrl,
                lifestyleUrl: lifestyleUrl,
                hex: "#8C8D8E",
                slug: p.slug,
              },
            ],
            details: {
              material: p.acf?.construction || "New Zealand Wool & Silk",
              construction: p.acf?.construction || "Hand-Knotted",
              origin: p.acf?.countryOfOrigin || "Jaipur Atelier",
              weaveType: p.acf?.pileThickness || "Cut Pile",
              dimensions: p.dimensions ? `${p.dimensions.length || 240} x ${p.dimensions.width || 300} cm` : "240 x 300 cm",
            },
            currencyPrices: {
              AED: parsedPrice,
              USD: Math.round(parsedPrice / 3.67),
              EUR: Math.round(parsedPrice / 3.98),
            },
          };
        })
        .filter((p: Product) => p.colors?.[0]?.textureUrl);
    }
  } catch (err) {
    console.warn("Failed to fetch catalog products for visualizer:", err);
  }

  const webAppSchema = generateWebApplicationSchema();
  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${BASE_URL}/` },
    { name: "Room Visualizer", url: `${BASE_URL}/room-visualizer` },
  ]);

  return (
    <div className="w-full bg-[#0d0d0d] overflow-hidden select-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <Suspense fallback={<div className="h-screen bg-[#0d0d0d]" />}>
        <StandaloneVisualizerClient initialProducts={catalogProducts} />
      </Suspense>
    </div>
  );
}
