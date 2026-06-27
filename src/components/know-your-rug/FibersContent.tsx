"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, AlertCircle } from "lucide-react";

const fiberData = [
  {
    id: "wool",
    title: "Wool",
    subtitle: "A Timeless Choice for Rugs",
    description: [
      "Durable, sustainable, and versatile, wool is a globally cherished rug material. Renowned for its longevity, wool is sourced from shearing sheep and occasionally from other animals like alpacas, goats, and llamas. The fibers undergo a meticulous process of cleaning, sorting, carding, and spinning into yarn.",
      "Wool is graded based on the length and origin of the fibers, with the finest wool typically coming from the neck, belly, and underbelly of the sheep, where the fibers are softer and longer. Factors like climate and habitat significantly influence wool quality, and most of Jaipur Rugs’ collection is sourced from India, New Zealand, and 18 other countries.",
      "The carding and spinning processes can be done by hand or machine. Machine-spun fibers are uniform but may lack durability, while hand-spun yarn offers unique character and enhanced strength."
    ],
    benefits: [
      { name: "Moisture Absorption", desc: "Wool effectively absorbs moisture and dust, helping to create a healthier indoor environment." },
      { name: "Soil Resistance", desc: "Its natural properties repel dirt and stains, making maintenance easier." },
      { name: "Fire Resistance", desc: "Wool is naturally fire-resistant, adding safety to your space." },
      { name: "Texture Variety", desc: "With a classic matte finish, the texture of wool varies by source, allowing for unique blends that enhance durability and aesthetics." }
    ],
    whyChoose: [
      "Soft Yet Strong: High-quality wool is not only resilient but also soft to the touch.",
      "Easy to Maintain: Its resistance to water, dirt, and stains makes wool rugs a practical choice.",
      "Mold and Mildew Resistant: Wool absorbs moisture without developing mold, making it ideal for humid climates.",
      "Vibrant Colors: Easily dyed, wool holds color beautifully over time.",
      "Elasticity: Foot traffic marks can be easily brushed out, maintaining the rug’s appearance.",
      "Eco-Friendly: As a natural fiber, wool is more sustainable than synthetic alternatives.",
      "Long-Lasting Cleanliness: Wool naturally hides dirt, keeping your rugs looking cleaner for longer."
    ],
    summary: "Choose wool for your next rug and enjoy the perfect blend of beauty, functionality, and environmental responsibility."
  },
  {
    id: "silk",
    title: "Silk",
    subtitle: "The Ultimate Luxurious Choice",
    description: [
      "A source of pride for owners and a coveted treasure for others, silk is regarded as one of the finest materials for rugs, historically linked to royalty. This exquisite natural protein fiber is harvested from the cocoons of cultivated or wild silkworms.",
      "Silk’s delicate and even fibers lend themselves to intricate detailing, requiring exceptional craftsmanship to weave. Its legendary softness and stunning aesthetic make it a truly desirable choice."
    ],
    benefits: [
      { name: "Lustre & Shine", desc: "Silk rugs boast a natural glow that enhances any space." },
      { name: "Soft to the Touch", desc: "Known for their luxurious feel, silk rugs are among the softest available." },
      { name: "Valuable Collectibles", desc: "Due to their high value, silk rugs are often treated as collectibles and are best suited for decorative purposes, such as wall art, to protect them from wear in high-traffic areas." }
    ],
    whyChoose: [
      "Unmatched Softness: Silk rugs provide an elegant and plush finish.",
      "Longevity with Care: With proper maintenance, silk rugs can last a lifetime.",
      "Natural Beauty: Their inherent luster and shine add sophistication to any room.",
      "Vibrant Colors: Silk takes dye exceptionally well, offering stunning color variations."
    ],
    summary: "Indulge in the luxury of silk for your next rug and elevate your home with timeless elegance."
  },
  {
    id: "bamboo-silk",
    title: "Bamboo Silk",
    subtitle: "The Affordable Luxury",
    description: [
      "Looks and feels like silk, but without the high price tag! Bamboo Silk is a blend of wood pulp and natural fibers derived from the bamboo plant, offering a cost-effective alternative that beautifully mimics the elegance of silk.",
      "The viscose fibers create a stunning visual effect, with shiny tips that add depth to your carpets. Additionally, bamboo silk boasts antimicrobial properties, promoting a healthier home environment with every step."
    ],
    benefits: [
      { name: "Lustre & Shine", desc: "Adds a radiant shimmer to your designs." },
      { name: "Soft to the Touch", desc: "Enjoy the luxurious feel of silk at a fraction of the cost." },
      { name: "Antimicrobial Properties", desc: "Helps maintain a cleaner, healthier living space." }
    ],
    whyChoose: [
      "Elegant Appearance: Enhances any decor with its lustrous finish.",
      "Soft and Comfortable: Perfect for creating cozy atmospheres.",
      "Easily Dyed: Offers vibrant color options to suit your style."
    ],
    summary: "Experience the beauty of Bamboo Silk and elevate your space with this stylish, budget-friendly option!"
  },
  {
    id: "jute-hemp",
    title: "Jute & Hemp",
    subtitle: "Rugged Yet Refined",
    description: [
      "Tough yet stylish, jute and hemp fibers are gaining popularity as eco-friendly choices for your flooring needs. With their earthy colors and rich texture, these materials are ideal for high-traffic areas, making them perfect for indoor-outdoor transitions."
    ],
    benefits: [
      { name: "Sustainable", desc: "Made from natural plant fibers, these rugs are a responsible choice for the environment." },
      { name: "Coarse Texture", desc: "The unique texture adds character to any space." },
      { name: "High Traffic Durability", desc: "Designed to withstand heavy foot traffic with ease." },
      { name: "Minimal Shedding", desc: "Enjoy a clean look with less maintenance." }
    ],
    whyChoose: [
      "Eco-Friendly: A great choice for environmentally conscious consumers.",
      "Natural Aesthetics: Their earthy tones and textures enhance any decor.",
      "Ideal for Outdoor Use: Perfect for patios or transition areas where durability is essential.",
      "Easy to Clean: Simple maintenance makes them practical for busy homes."
    ],
    considerations: [
      "Coarse Texture: While unique, the rough texture may not be for everyone.",
      "Color Retention: These fibers may not hold dye as well as others, leading to potential fading.",
      "Moisture Sensitivity: Not recommended for damp environments as they can absorb moisture.",
      "Stain Resistance: May not be very stain-resistant and can darken or fade with prolonged sun exposure."
    ],
    summary: "Choose jute and hemp for a rugged, eco-friendly flooring option that adds natural beauty to your space!"
  },
  {
    id: "cotton",
    title: "Cotton",
    subtitle: "The Versatile Classic",
    description: [
      "Cotton is one of the most trusted and widely used fabrics, derived from the soft fibers that grow around the seeds of the cotton plant.",
      "Often found in flatweave designs like dhurries and kilims, cotton offers a versatile décor option that is easy to use and store. Its breathable quality and washability make it suitable for both indoor and outdoor spaces."
    ],
    benefits: [
      { name: "Easy to Clean", desc: "Washable by hand or machine for effortless maintenance." },
      { name: "Lightweight", desc: "Makes for easy handling and storage." },
      { name: "Breathable", desc: "Allows for air circulation, enhancing comfort." },
      { name: "Affordable", desc: "A cost-effective choice for quality rugs." }
    ],
    whyChoose: [
      "Simple Care: Cotton rugs can be easily cleaned, making them practical for everyday use.",
      "Vibrant Colors: Cotton takes dye beautifully, allowing for bold and bright designs."
    ],
    considerations: [
      "Lightweight Fiber: While comfortable, cotton doesn’t produce the plushness of heavier natural fibers.",
      "Less Durable: Cotton rugs may not be as long-lasting as those made from sturdier materials.",
      "Stain Sensitivity: Unlike wool, cotton is not as resistant to stains.",
      "Insulation: Cotton offers less insulation compared to other natural fibers."
    ],
    summary: "Choose cotton for a versatile, easy-care option that adds charm to any space!"
  },
  {
    id: "polyester",
    title: "Polyester",
    subtitle: "The Practical Choice",
    description: [
      "Polyester is a man-made fiber known for its exceptional stain and fade resistance, while still being soft and budget-friendly. Although it may not be as durable as other synthetics like nylon, well-constructed polyester rugs can still hold up well over time.",
      "With their lower cost and high stain resistance, polyester rugs are an ideal option for children’s bedrooms and areas where a more expensive investment may not be desired."
    ],
    benefits: [
      { name: "Soil Repellent", desc: "Resists dirt and stains for easier maintenance." },
      { name: "Soft to the Touch", desc: "Offers a comfortable feel underfoot." },
      { name: "Affordable", desc: "A cost-effective choice for quality rugs." },
      { name: "Fade Resistant", desc: "Maintains color vibrancy even in sunlight." }
    ],
    whyChoose: [
      "Soft Finish: Enjoy a plush texture with excellent stain resistance.",
      "Durable Performance: Designed for long-term wear and use.",
      "Sustainable Options: Some polyester can be made from recycled materials for a more eco-friendly choice.",
      "Great Value: Provides quality at an accessible price point."
    ],
    considerations: [
      "Matting Potential: Polyester rugs may mat over time, so proper care is essential.",
      "Less Resilient: These fibers are not as resilient as wool and may flatten more easily under furniture and foot traffic."
    ],
    summary: "Opt for polyester for a practical, stylish, and budget-friendly rug option!"
  }
];

export default function FibersContent() {
  const [activeTab, setActiveTab] = useState(fiberData[0].id);
  const [openAccordion, setOpenAccordion] = useState<string | null>(fiberData[0].id);

  // Intersection Observer to highlight sidebar as user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
    );

    fiberData.forEach((fiber) => {
      const element = document.getElementById(fiber.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleAccordionClick = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <section className="w-full py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col md:flex-row gap-12 lg:gap-24 relative">
        
        {/* Mobile Accordion */}
        <div className="md:hidden w-full flex flex-col border-t border-[var(--border-secondary)]">
          <h2 className="font-serif text-3xl text-[var(--text-primary)] mb-8 pt-8">Material Guide</h2>
          {fiberData.map((fiber) => (
            <div key={`mobile-${fiber.id}`} className="border-b border-[var(--border-secondary)]">
              <button
                onClick={() => handleAccordionClick(fiber.id)}
                className="w-full py-6 flex items-center justify-between font-serif text-2xl text-[var(--text-primary)]"
              >
                {fiber.title}
                <ChevronDown 
                  className={`transition-transform duration-300 ${openAccordion === fiber.id ? 'rotate-180' : ''}`} 
                  size={24} 
                  strokeWidth={1}
                />
              </button>
              <AnimatePresence>
                {openAccordion === fiber.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 flex flex-col gap-8">
                      <div>
                        <h3 className="font-sans text-[var(--text-secondary)] text-lg mb-4">{fiber.subtitle}</h3>
                        {fiber.description.map((desc, i) => (
                          <p key={i} className="font-sans text-[var(--text-secondary)] text-base leading-relaxed mb-4">
                            {desc}
                          </p>
                        ))}
                      </div>

                      <div className="bg-[var(--surface-primary)] p-6 border border-[var(--border-secondary)]">
                        <h4 className="font-sans text-xs uppercase tracking-widest text-[var(--text-primary)] mb-4">Key Features</h4>
                        <ul className="flex flex-col gap-4">
                          {fiber.benefits.map((benefit, idx) => (
                            <li key={idx} className="font-sans text-sm flex flex-col gap-1">
                              <span className="font-medium text-[var(--text-primary)]">{benefit.name}</span>
                              <span className="text-[var(--text-secondary)]">{benefit.desc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-sans text-sm font-medium uppercase tracking-widest text-[var(--text-primary)] mb-4 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-[var(--accent-primary)]" />
                          Why Choose {fiber.title}?
                        </h4>
                        <ul className="flex flex-col gap-3">
                          {fiber.whyChoose.map((reason, idx) => {
                            const [boldPart, restPart] = reason.split(": ");
                            return (
                              <li key={idx} className="font-sans text-sm text-[var(--text-secondary)] flex items-start gap-2">
                                <span className="text-[var(--text-muted)] block mt-1">•</span>
                                <span><strong className="text-[var(--text-primary)] font-medium">{boldPart}:</strong> {restPart}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {fiber.considerations && (
                        <div>
                          <h4 className="font-sans text-sm font-medium uppercase tracking-widest text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <AlertCircle size={16} className="text-[var(--text-muted)]" />
                            Other Considerations
                          </h4>
                          <ul className="flex flex-col gap-3">
                            {fiber.considerations.map((cons, idx) => {
                              const [boldPart, restPart] = cons.split(": ");
                              return (
                                <li key={idx} className="font-sans text-sm text-[var(--text-secondary)] flex items-start gap-2">
                                  <span className="text-[var(--text-muted)] block mt-1">•</span>
                                  <span><strong className="text-[var(--text-primary)] font-medium">{boldPart}:</strong> {restPart}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      <div className="bg-[var(--surface-secondary)] p-6 border-l-2 border-[var(--accent-primary)]">
                        <p className="font-serif text-lg text-[var(--text-primary)] italic">
                          "{fiber.summary}"
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 lg:w-80 shrink-0 h-max sticky top-32">
          <div className="flex flex-col gap-1 border-l border-[var(--border-secondary)]">
            <h3 className="font-sans text-xs uppercase tracking-widest text-[var(--text-muted)] mb-8 px-6">
              Material Library
            </h3>
            <ul className="flex flex-col">
              {fiberData.map((fiber) => (
                <li key={`desktop-nav-${fiber.id}`}>
                  <a
                    href={`#${fiber.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(fiber.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`block w-full text-left px-6 py-4 font-sans text-base transition-all duration-300 border-l-2 -ml-[1px] ${
                      activeTab === fiber.id
                        ? "text-[var(--text-primary)] border-[var(--border-primary)] bg-[var(--surface-primary)]"
                        : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]"
                    }`}
                  >
                    {fiber.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Desktop Content Area (Continuous Scroll) */}
        <div className="hidden md:block flex-1 pb-32">
          <div className="flex flex-col gap-32">
            {fiberData.map((fiber) => (
              <motion.div
                id={fiber.id}
                key={`content-${fiber.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
                className="flex flex-col gap-12 scroll-mt-32"
              >
                <div className="border-b border-[var(--border-secondary)] pb-8">
                  <h2 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
                    {fiber.title}
                  </h2>
                  <h3 className="font-sans text-[var(--text-secondary)] text-xl font-light mb-8">
                    {fiber.subtitle}
                  </h3>
                  <div className="flex flex-col gap-4 max-w-3xl">
                    {fiber.description.map((desc, i) => (
                      <p key={i} className="font-sans text-[var(--text-secondary)] text-lg leading-relaxed">
                        {desc}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Benefits Grid */}
                  <div className="flex flex-col gap-6 bg-[var(--surface-primary)] p-8 border border-[var(--border-secondary)] h-fit">
                    <h4 className="font-sans text-sm font-medium tracking-widest uppercase text-[var(--text-primary)]">
                      Key Features
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
                      {fiber.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex flex-col gap-2">
                          <span className="font-sans font-medium text-[var(--text-primary)]">{benefit.name}</span>
                          <span className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed">{benefit.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-6">
                      <h4 className="font-sans text-sm font-medium tracking-widest uppercase text-[var(--text-primary)] flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-[var(--accent-primary)]" />
                        Why Choose {fiber.title}?
                      </h4>
                      <ul className="flex flex-col gap-4">
                        {fiber.whyChoose.map((reason, idx) => {
                          const [boldPart, restPart] = reason.split(": ");
                          return (
                            <li key={idx} className="font-sans text-base text-[var(--text-secondary)] flex items-start gap-3">
                              <span className="text-[var(--text-muted)] mt-1">•</span>
                              <span><strong className="text-[var(--text-primary)] font-medium">{boldPart}:</strong> {restPart}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {fiber.considerations && (
                      <div className="flex flex-col gap-6 pt-8 border-t border-[var(--border-secondary)]">
                        <h4 className="font-sans text-sm font-medium tracking-widest uppercase text-[var(--text-primary)] flex items-center gap-3">
                          <AlertCircle size={18} className="text-[var(--text-muted)]" />
                          Other Considerations
                        </h4>
                        <ul className="flex flex-col gap-4">
                          {fiber.considerations.map((cons, idx) => {
                            const [boldPart, restPart] = cons.split(": ");
                            return (
                              <li key={idx} className="font-sans text-base text-[var(--text-secondary)] flex items-start gap-3">
                                <span className="text-[var(--text-muted)] mt-1">•</span>
                                <span><strong className="text-[var(--text-primary)] font-medium">{boldPart}:</strong> {restPart}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-[var(--surface-primary)] p-8 lg:p-12 border-l-4 border-[var(--accent-primary)] mt-4">
                  <p className="font-serif text-2xl lg:text-3xl text-[var(--text-primary)] italic leading-relaxed">
                    "{fiber.summary}"
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
