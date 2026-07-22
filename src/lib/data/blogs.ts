export interface BlogSection {
  id: string;
  title: string;
  content: string[];
}

export interface Blog {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  sections?: BlogSection[];
  content?: string;
}

export const blogs: Blog[] = [
  {
    slug: "the-art-of-layering-rugs",
    title: "The Art of Layering Rugs: A Guide to Texture and Color",
    date: "March 15, 2026",
    excerpt: "Discover how to elevate your interior design by mastering the art of layering rugs, combining textures and colors for a luxurious feel.",
    image: "/products_hero.png",
    sections: [
      {
        id: "introduction",
        title: "Introduction to Layering",
        content: [
          "Layering rugs is a design technique that instantly adds warmth, texture, and dimension to any room. By combining different materials, patterns, and colors, you can create a highly customized and luxurious aesthetic.",
          "This approach is especially effective in large, open-concept spaces where rugs can help define specific zones, such as a seating area or a dining space, without the need for physical barriers."
        ]
      },
      {
        id: "choosing-the-base",
        title: "Choosing the Base Rug",
        content: [
          "The foundation of a layered look starts with the base rug. Typically, this rug should be large enough to anchor your furniture and neutral enough to support the top layer without overwhelming the space.",
          "Natural fibers like jute, sisal, or a low-pile wool are excellent choices for a base layer. Their earthy tones and robust textures provide the perfect canvas for a more decorative or vibrant top rug."
        ]
      },
      {
        id: "the-top-layer",
        title: "Selecting the Top Layer",
        content: [
          "The top rug is your opportunity to introduce color, pattern, and plushness. This is where you can let your personality shine. Antique hand-knotted Persian rugs, vibrant flatweaves, or incredibly soft silk blends are perfect candidates.",
          "Ensure that the top rug is noticeably smaller than the base rug to allow the beautiful texture of the bottom layer to frame it. A good rule of thumb is to leave at least 12 to 18 inches of the base rug visible on all sides."
        ]
      },
      {
        id: "mixing-patterns",
        title: "Mixing Patterns and Colors",
        content: [
          "When mixing patterns, consider the scale. If your base rug features a subtle, small-scale geometric pattern, opt for a top rug with a larger, bolder motif. Alternatively, if the top rug is highly detailed, a solid or gently striated base rug will prevent visual clutter.",
          "Color coordination is key. Draw a secondary color from your top rug and subtly reflect it in the base rug, or use contrasting colors to make a dramatic statement that anchors the entire room."
        ]
      }
    ]
  },
  {
    slug: "sustainable-materials-in-modern-decor",
    title: "Embracing Sustainable Materials in Modern Décor",
    date: "April 02, 2026",
    excerpt: "Explore how eco-friendly practices and sustainable materials are reshaping the luxury home décor industry.",
    image: "/rugs/set2-room.png",
    sections: [
      {
        id: "the-shift-to-sustainability",
        title: "The Shift to Sustainability",
        content: [
          "In recent years, the luxury home décor industry has experienced a profound shift towards sustainability. Designers and homeowners alike are increasingly aware of the environmental impact of their choices, seeking out materials that are both beautiful and ecologically responsible.",
          "This movement is not just a trend; it is a fundamental evolution in how we view luxury. True luxury now encompasses the ethical sourcing of materials, the fair treatment of artisans, and the long-term environmental footprint of the products we bring into our homes."
        ]
      },
      {
        id: "natural-fibers",
        title: "The Beauty of Natural Fibers",
        content: [
          "Natural fibers such as organic wool, jute, hemp, and bamboo silk are at the forefront of sustainable design. Unlike synthetic alternatives, these materials are biodegradable and renewable.",
          "Organic wool, in particular, is highly prized. Sourced from sheep raised without synthetic chemicals or hormones, it offers unparalleled durability and softness while maintaining a low ecological footprint."
        ]
      },
      {
        id: "eco-friendly-dyes",
        title: "Eco-Friendly Dyes",
        content: [
          "The dyeing process has historically been one of the most environmentally taxing aspects of textile production. Today, sustainable luxury relies on GOTS-certified, eco-friendly dyes or natural plant-based dyes.",
          "These innovative dyeing methods ensure vibrant, long-lasting colors without releasing harmful chemicals into the water supply, protecting both the environment and the health of the artisans who craft the rugs."
        ]
      },
      {
        id: "supporting-artisans",
        title: "Supporting Artisan Communities",
        content: [
          "Sustainability extends beyond materials; it is deeply rooted in the preservation of heritage crafts and the empowerment of artisan communities.",
          "By investing in handcrafted products, we support fair trade practices, provide sustainable livelihoods for weavers in rural areas, and help ensure that centuries-old weaving traditions are passed down to future generations."
        ]
      }
    ]
  },
  {
    slug: "caring-for-your-hand-knotted-rug",
    title: "Essential Care for Your Hand-Knotted Rug",
    date: "April 20, 2026",
    excerpt: "Learn the crucial steps to maintaining the beauty, luster, and longevity of your investment piece.",
    image: "/rugs/set3-room.png",
    sections: [
      {
        id: "routine-maintenance",
        title: "Routine Maintenance",
        content: [
          "A hand-knotted rug is an investment that, with the right care, can last for generations. Routine maintenance is the first line of defense against premature wear. Vacuuming your rug regularly prevents dirt and grit from settling into the base of the knots, where they can act like sandpaper and abrade the fibers.",
          "When vacuuming, always turn off the beater bar to avoid pulling or tearing the delicate fibers. Vacuum in the direction of the pile to maintain the rug's natural sheen."
        ]
      },
      {
        id: "handling-spills",
        title: "Handling Spills Promptly",
        content: [
          "Accidents happen, but quick action can prevent permanent damage. If a spill occurs, immediately blot the area with a clean, undyed cloth. Never rub the stain, as this can force the liquid deeper into the fibers and distort the pile.",
          "For liquid spills, work from the outer edge of the spill toward the center to prevent it from spreading. If plain water doesn't remove the stain, consult a professional rather than using harsh chemical cleaners that could strip the natural oils from the wool."
        ]
      },
      {
        id: "rotation-and-sunlight",
        title: "Rotation and Sunlight",
        content: [
          "Constant exposure to direct sunlight can cause the vibrant natural dyes in your rug to fade over time. If your rug is placed in a sunny room, consider using window treatments to filter the UV rays during peak daylight hours.",
          "Additionally, rotate your rug 180 degrees every six months. This ensures that any inevitable fading, as well as wear from foot traffic, is distributed evenly across the entire surface of the rug."
        ]
      },
      {
        id: "professional-cleaning",
        title: "Professional Cleaning",
        content: [
          "Even with diligent home care, your hand-knotted rug should be professionally cleaned every 3 to 5 years. Professional rug cleaners have the expertise and specialized equipment needed to safely extract deep-seated dirt and rejuvenate the fibers.",
          "Never send your hand-knotted rug to a standard wall-to-wall carpet cleaner. The aggressive chemicals and high-heat steam cleaning methods they use can cause irreversible damage to the natural fibers and dyes of your artisanal rug."
        ]
      }
    ]
  }
];

export function getBlogBySlug(slug: string): Blog | undefined {
  return blogs.find((blog) => blog.slug.toLowerCase() === slug?.toLowerCase());
}
