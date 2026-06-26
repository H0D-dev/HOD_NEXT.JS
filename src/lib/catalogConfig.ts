export type FilterOption = { label: string; value: string };
export type FilterCategory = { id: string; label: string; options: FilterOption[] };

export type ProductStub = {
  id: string;
  slug: string;
  title: string;
  collectionName: string;
  category: string; // e.g. "Wall-to-wall" or "Hand-knotted"
  color: string;
  image: string;
  price?: string;
};

export type CatalogConfig = {
  title: string;
  subtitle: string;
  filters: FilterCategory[];
  products: ProductStub[];
};

export const RUGS_CONFIG: CatalogConfig = {
  title: "Explore Rugs",
  subtitle: "Handcrafted pieces for timeless interiors",
  filters: [
    {
      id: "collection",
      label: "Collection",
      options: [
        { label: "Signature", value: "signature" },
        { label: "Essentials", value: "essentials" },
        { label: "Geometric", value: "geometric" }
      ]
    },
    {
      id: "size",
      label: "Size",
      options: [
        { label: "Small (up to 5x8)", value: "small" },
        { label: "Medium (8x10 to 9x12)", value: "medium" },
        { label: "Large (10x14+)", value: "large" }
      ]
    },
    {
      id: "shape",
      label: "Shape",
      options: [
        { label: "Rectangular", value: "rectangular" },
        { label: "Round", value: "round" },
        { label: "Runner", value: "runner" }
      ]
    },
    {
      id: "material",
      label: "Material",
      options: [
        { label: "Wool", value: "wool" },
        { label: "Silk Blend", value: "silk-blend" },
        { label: "Cotton", value: "cotton" }
      ]
    },
    {
      id: "weave",
      label: "Weave Type",
      options: [
        { label: "Hand-knotted", value: "hand-knotted" },
        { label: "Flat weave", value: "flat-weave" },
        { label: "Tufted", value: "tufted" }
      ]
    }
  ],
  products: [
    {
      id: "rug-1",
      slug: "grace-geometric",
      title: "Grace Geometric",
      collectionName: "SIGNATURE",
      category: "Hand-knotted",
      color: "Pewter Grey",
      image: "/carpets/set1-full.png"
    },
    {
      id: "rug-2",
      slug: "lumina",
      title: "Lumina Grid",
      collectionName: "GEOMETRIC",
      category: "Flat weave",
      color: "Ivory",
      image: "/carpets/set2-full.png"
    },
    {
      id: "rug-3",
      slug: "velvet-dune",
      title: "Velvet Dune",
      collectionName: "ESSENTIALS",
      category: "Hand-tufted",
      color: "Ochre",
      image: "/carpets/set3-full.png"
    },
    {
      id: "rug-4",
      slug: "onyx-shadow",
      title: "Onyx Shadow",
      collectionName: "SIGNATURE",
      category: "Hand-knotted",
      color: "Charcoal",
      image: "/carpets/set1-texture.png"
    },
    {
      id: "rug-5",
      slug: "abstract-flow",
      title: "Abstract Flow II",
      collectionName: "GEOMETRIC",
      category: "Hand-knotted",
      color: "Cream",
      image: "/carpets/set2-texture.png"
    },
    {
      id: "rug-6",
      slug: "alpine",
      title: "Alpine Vista",
      collectionName: "ESSENTIALS",
      category: "Flat weave",
      color: "Sage Green",
      image: "/carpets/set3-texture.png"
    }
  ]
};

export const CARPETS_CONFIG: CatalogConfig = {
  title: "Explore Carpets",
  subtitle: "Luxury flooring solutions for refined spaces",
  filters: [
    {
      id: "type",
      label: "Product Type",
      options: [
        { label: "Wall-to-wall", value: "wall-to-wall" },
        { label: "Broadloom", value: "broadloom" },
        { label: "Tiles", value: "tiles" }
      ]
    },
    {
      id: "material",
      label: "Material",
      options: [
        { label: "Wool", value: "wool" },
        { label: "Nylon", value: "nylon" },
        { label: "Blend", value: "blend" }
      ]
    },
    {
      id: "segment",
      label: "Segment",
      options: [
        { label: "Commercial", value: "commercial" },
        { label: "Hospitality", value: "hospitality" },
        { label: "Residential", value: "residential" }
      ]
    },
    {
      id: "acoustic",
      label: "Acoustic Rating",
      options: [
        { label: "High (Class A/B)", value: "high" },
        { label: "Standard (Class C/D)", value: "standard" }
      ]
    },
    {
      id: "fire",
      label: "Fire Classification",
      options: [
        { label: "Bfl-s1", value: "bfl-s1" },
        { label: "Cfl-s1", value: "cfl-s1" }
      ]
    }
  ],
  products: [
    {
      id: "cpt-1",
      slug: "highline-abstract",
      title: "Abstract Flow",
      collectionName: "HIGHLINE",
      category: "Wall-to-wall",
      color: "Green",
      image: "/carpets/set3-room.png"
    },
    {
      id: "cpt-2",
      slug: "eco-trust",
      title: "Eco Trust Loop",
      collectionName: "SUSTAINABLE",
      category: "Broadloom",
      color: "Charcoal",
      image: "/carpets/set1-room.png"
    },
    {
      id: "cpt-3",
      slug: "velvet-plush",
      title: "Velvet Plush",
      collectionName: "HOSPITALITY",
      category: "Wall-to-wall",
      color: "Deep Blue",
      image: "/carpets/set2-room.png"
    },
    {
      id: "cpt-4",
      slug: "classic-weave",
      title: "Classic Weave",
      collectionName: "RESIDENTIAL",
      category: "Broadloom",
      color: "Beige",
      image: "/carpets/set3-texture.png"
    }
  ]
};
