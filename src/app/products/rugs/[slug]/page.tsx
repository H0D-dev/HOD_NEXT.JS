import { Metadata } from "next";
import ProductPresentation from "../../../../components/product-presentation/ProductPresentation";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/src/lib/product/getProductBySlug";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return { title: "Product Not Found | House of Decór" };
  }

  const ogImage = product.colors?.[0]?.lifestyleUrl || product.colors?.[0]?.textureUrl || (product as any).mainImage?.src || "https://houseofdecor.ae/about_hero_desktop.png";
  const canonicalUrl = `/products/rugs/${slug}`;

  const titleKeyword = /rug/i.test(product.name) ? product.name : `${product.name} Luxury Handmade Rug`;
  const metaTitle = `${titleKeyword} | House of Decór`;

  const rawDesc = product.shortDescription || product.description || "";
  const cleanedDesc = rawDesc
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '—')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

  const metaDescription = cleanedDesc && cleanedDesc.length > 20
    ? (cleanedDesc.length > 155 ? `${cleanedDesc.slice(0, 152)}...` : cleanedDesc)
    : `Discover ${product.name} — a bespoke handcrafted luxury rug tailored for architectural interiors. Complimentary delivery & custom sizing available.`;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `https://houseofdecor.ae${canonicalUrl}`,
      siteName: "House of Decór",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [ogImage],
    },
  };
}

import { generateProductSchema, generateBreadcrumbSchema, BASE_URL } from "@/src/lib/seo/schema";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Inject categorySlug so color navigation knows the route prefix
  product.categorySlug = "rugs";

  let relatedProducts: any[] = [];
  if (product.relatedIds && product.relatedIds.length > 0) {
    relatedProducts = await getRelatedProducts(product.relatedIds);
  }

  const productSchema = generateProductSchema(product, "rugs");
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: `${BASE_URL}/` },
    { name: "Products", url: `${BASE_URL}/products` },
    { name: "Handmade Rugs", url: `${BASE_URL}/products/rugs` },
    { name: product.name, url: `${BASE_URL}/products/rugs/${product.slug}` },
  ]);

  return (
    <main className="w-full">
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductPresentation product={product} relatedProducts={relatedProducts} />
    </main>
  );
}
