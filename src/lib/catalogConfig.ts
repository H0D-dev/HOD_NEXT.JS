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
  isFallbackPrice?: boolean;
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
      image: "/rugs/set1-full.png"
    },
    {
      id: "rug-2",
      slug: "lumina",
      title: "Lumina Grid",
      collectionName: "GEOMETRIC",
      category: "Flat weave",
      color: "Ivory",
      image: "/rugs/set2-full.png"
    },
    {
      id: "rug-3",
      slug: "velvet-dune",
      title: "Velvet Dune",
      collectionName: "ESSENTIALS",
      category: "Hand-tufted",
      color: "Ochre",
      image: "/rugs/set3-full.png"
    },
    {
      id: "rug-4",
      slug: "onyx-shadow",
      title: "Onyx Shadow",
      collectionName: "SIGNATURE",
      category: "Hand-knotted",
      color: "Charcoal",
      image: "/rugs/set1-texture.png"
    },
    {
      id: "rug-5",
      slug: "abstract-flow",
      title: "Abstract Flow II",
      collectionName: "GEOMETRIC",
      category: "Hand-knotted",
      color: "Cream",
      image: "/rugs/set2-texture.png"
    },
    {
      id: "rug-6",
      slug: "alpine",
      title: "Alpine Vista",
      collectionName: "ESSENTIALS",
      category: "Flat weave",
      color: "Sage Green",
      image: "/rugs/set3-texture.png"
    }
  ]
};

export const CURTAINS_CONFIG: CatalogConfig = {
  title: "Explore Curtains",
  subtitle: "Luxury window solutions for refined spaces",
  filters: [
    {
      id: "type",
      label: "Product Type",
      options: [
        { label: "Drapes", value: "drapes" },
        { label: "Sheers", value: "sheers" },
        { label: "Blackout", value: "blackout" }
      ]
    },
    {
      id: "material",
      label: "Material",
      options: [
        { label: "Silk", value: "silk" },
        { label: "Linen", value: "linen" },
        { label: "Velvet", value: "velvet" }
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
      id: "light",
      label: "Light Filtering",
      options: [
        { label: "Sheer", value: "sheer" },
        { label: "Room Darkening", value: "room-darkening" }
      ]
    },
    {
      id: "installation",
      label: "Installation Type",
      options: [
        { label: "Rod Pocket", value: "rod-pocket" },
        { label: "Grommet", value: "grommet" }
      ]
    }
  ],
  products: [
    {
      id: "cur-1",
      slug: "highline-abstract",
      title: "Abstract Flow",
      collectionName: "HIGHLINE",
      category: "Drapes",
      color: "Green",
      image: "/curtains/set3-room.png"
    },
    {
      id: "cur-2",
      slug: "eco-trust",
      title: "Eco Trust Loop",
      collectionName: "SUSTAINABLE",
      category: "Sheers",
      color: "Charcoal",
      image: "/curtains/set1-room.png"
    },
    {
      id: "cur-3",
      slug: "velvet-plush",
      title: "Velvet Plush",
      collectionName: "HOSPITALITY",
      category: "Blackout",
      color: "Deep Blue",
      image: "/curtains/set2-room.png"
    },
    {
      id: "cur-4",
      slug: "classic-weave",
      title: "Classic Weave",
      collectionName: "RESIDENTIAL",
      category: "Drapes",
      color: "Beige",
      image: "/curtains/set3-texture.png"
    }
  ]
};
