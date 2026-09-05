import MiniSearch from "minisearch";

interface MiniSearchProduct {
  id: number;
  name: string;
  slug: string;
  categories: string;
  construction: string;
  materials: string;
  colors: string;
  description: string;
  url: string;
  image: string;
  subtitle: string;
  categorySlug: string;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "of", "in", "on", "for", "to", "is",
  "it", "by", "at", "from", "with", "as", "this", "that", "are", "was",
]);

function createIndex(): MiniSearch<MiniSearchProduct> {
  return new MiniSearch<MiniSearchProduct>({
    fields: ["name", "categories", "construction", "materials", "colors", "description"],
    storeFields: ["name", "slug", "url", "image", "subtitle", "categorySlug"],
    searchOptions: {
      boost: {
        name: 3,
        construction: 2,
        materials: 2,
        colors: 1.5,
        categories: 1.5,
        description: 0.5,
      },
      prefix: true,
      fuzzy: (term: string) => (term.length > 4 ? 2 : 1),
      combineWith: "AND",
    },
    tokenize: (text: string) => {
      return text
        .toLowerCase()
        .split(/[\s\-_&/,;:()]+/)
        .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
    },
  });
}

function extractSearchableFields(product: any): MiniSearchProduct {
  const name = product.name || "";
  const slug = product.slug || "";
  const categories = Array.isArray(product.categories)
    ? product.categories.map((c: any) => c.name || "").join(" ")
    : "";
  const categorySlug = Array.isArray(product.categories) && product.categories.length > 0
    ? (product.categories[0]?.slug || "rugs")
    : "rugs";

  const construction = product.acf?.construction || "";
  const productColor = product.acf?.productColor || "";
  const colors = Array.isArray(product.colors)
    ? product.colors.map((c: any) => c.name || "").join(" ")
    : productColor;

  const attrs = Array.isArray(product.attributes)
    ? product.attributes
        .map((a: any) => `${a.name || ""} ${Array.isArray(a.options) ? a.options.join(" ") : ""}`)
        .join(" ")
    : "";
  const materials = [construction, attrs].filter(Boolean).join(" ");
  const description = (product.description || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);

  const image = product.mainImage?.src || "";
  // Subtitle — construction only (per user requirement)
  const subtitle = construction || (categories ? categories.split(" ")[0] : "Luxury Handmade");
  const url = `/products/${categorySlug}/${slug}`;

  return {
    id: product.id,
    name,
    slug,
    categories,
    construction,
    materials,
    colors,
    description,
    url,
    image,
    subtitle,
    categorySlug,
  };
}

const mockProducts = [
  {
    id: 101,
    name: "Terra III Hand-Tufted Wool and Silk Rug",
    slug: "terra-iii-hand-tufted",
    categories: [{ name: "Rugs", slug: "rugs" }],
    acf: { construction: "Hand Tufted", countryOfOrigin: "India", productColor: "Ivory / Slate" },
    colors: [{ name: "Ivory" }, { name: "Slate" }],
    attributes: [{ name: "Material", options: ["Wool", "Silk"] }],
    description: "An architectural masterpiece hand tufted in premium New Zealand wool and pure Chinese silk.",
    price: "4500",
  },
  {
    id: 102,
    name: "Nomad Hand Knotted Wool Rug",
    slug: "nomad-hand-knotted",
    categories: [{ name: "Rugs", slug: "rugs" }],
    acf: { construction: "Hand Knotted", countryOfOrigin: "Persia", productColor: "Ochre / Rust" },
    colors: [{ name: "Ochre" }, { name: "Rust" }],
    attributes: [{ name: "Material", options: ["Highland Wool"] }],
    description: "Traditional tribal motifs with rich mineral dyes hand knotted by master artisans.",
    price: "7200",
  },
  {
    id: 103,
    name: "Aura Flatweave Silk Blend Rug",
    slug: "aura-flatweave-silk",
    categories: [{ name: "Rugs", slug: "rugs" }],
    acf: { construction: "Flatweave", countryOfOrigin: "India", productColor: "Champagne / Gold" },
    colors: [{ name: "Champagne" }, { name: "Gold" }],
    attributes: [{ name: "Material", options: ["Bespoke Silk"] }],
    description: "Minimalist luster with a reversible flatweave structure.",
    price: "3100",
  },
];

async function runTests() {
  console.log("=== RUNNING MINISEARCH TEST SUITE ===\n");
  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, detail?: string) {
    if (condition) {
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] ${name} ${detail ? "- " + detail : ""}`);
      failed++;
    }
  }

  // Test 1: Subtitle contains ONLY construction, NO origin and NO price
  const doc1 = extractSearchableFields(mockProducts[0]);
  assert(
    "Subtitle displays ONLY construction",
    doc1.subtitle === "Hand Tufted",
    `Expected 'Hand Tufted', got '${doc1.subtitle}'`
  );
  assert(
    "Subtitle does NOT contain country of origin",
    !doc1.subtitle.includes("India"),
    `Origin leaked into subtitle: '${doc1.subtitle}'`
  );
  assert(
    "Subtitle does NOT contain price",
    !doc1.subtitle.includes("4500") && !doc1.subtitle.includes("AED"),
    `Price leaked into subtitle: '${doc1.subtitle}'`
  );

  // Test 2: Build MiniSearch Index
  const index = createIndex();
  const docs = mockProducts.map(extractSearchableFields);
  index.addAll(docs);
  assert("Index created and products added", index.documentCount === 3);

  // Test 3: Exact Name Search
  const r1 = index.search("Terra");
  assert("Exact match for 'Terra' finds Terra III", r1.length > 0 && r1[0].id === 101);

  // Test 4: Typo Tolerance ('tufetd' -> 'Hand Tufted')
  const r2 = index.search("tufetd");
  assert("Typo tolerance: 'tufetd' matches Hand-Tufted product", r2.some((r) => r.id === 101));

  // Test 5: Material search ('silk')
  const r3 = index.search("silk");
  assert(
    "Material search 'silk' matches both silk products",
    r3.some((r) => r.id === 101) && r3.some((r) => r.id === 103) && !r3.some((r) => r.id === 102)
  );

  // Test 6: Prefix matching ('kno' -> 'Knotted')
  const r4 = index.search("kno");
  assert("Prefix search 'kno' matches 'Nomad Hand Knotted'", r4.some((r) => r.id === 102));

  // Test 7: Construction filtering ('knotted' vs 'tufted')
  const r5 = index.search("knotted");
  assert("Construction search 'knotted' returns only Hand Knotted", r5.length === 1 && r5[0].id === 102);

  // Test 8: Color search ('champagne')
  const r6 = index.search("champagne");
  assert("Color search 'champagne' returns Aura rug", r6.length === 1 && r6[0].id === 103);

  // Test 9: No results for random gibberish
  const r7 = index.search("xyznonexistent123");
  assert("Non-existent query returns 0 results", r7.length === 0);

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
