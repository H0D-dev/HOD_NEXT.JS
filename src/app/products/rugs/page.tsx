import { Suspense } from "react";
import ProductCatalogLayout from "../../../components/catalog/ProductCatalogLayout";
import CatalogLoadingSkeleton from "../../../components/catalog/CatalogLoadingSkeleton";
import { fetchCatalogProducts } from "@/src/lib/product/getCatalogProducts";

import { generateCollectionSchema, generateBreadcrumbSchema, BASE_URL } from "@/src/lib/seo/schema";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Handmade Luxury Rugs Collection",
  description: "Explore curated collections of luxury handwoven rugs crafted with timeless artisan tradition.",
  alternates: {
    canonical: "/products/rugs",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Handmade Luxury Rugs Collection | House of Decór",
    description: "Explore curated collections of luxury handwoven rugs crafted with timeless artisan tradition.",
    url: "https://houseofdecor.ae/products/rugs",
    siteName: "House of Decór",
    images: [
      {
        url: "https://houseofdecor.ae/about_hero_desktop.png",
        width: 1200,
        height: 630,
        alt: "Handmade Luxury Rugs Collection",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Handmade Luxury Rugs Collection | House of Decór",
    description: "Explore curated collections of luxury handwoven rugs crafted with timeless artisan tradition.",
    images: ["https://houseofdecor.ae/about_hero_desktop.png"],
  },
};

export const revalidate = 300;

export default async function RugsPage() {
  const initialProducts = await fetchCatalogProducts("rugs");

  const collectionSchema = generateCollectionSchema(
    "Handmade Luxury Rugs",
    "Tailoring luxury, one thread at a time. Discover premium handmade rugs crafted with timeless artistry.",
    "rugs",
    initialProducts
  );
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${BASE_URL}/` },
    { name: "Products", url: `${BASE_URL}/products` },
    { name: "Handmade Rugs", url: `${BASE_URL}/products/rugs` },
  ]);

  return (
    <Suspense fallback={<CatalogLoadingSkeleton title="HANDMADE RUGS" category="rugs" />}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductCatalogLayout category="rugs" initialProducts={initialProducts} />
    </Suspense>
  );
}

