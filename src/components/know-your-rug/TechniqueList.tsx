"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const techniques = [
  {
    id: "hand-knotted",
    title: "Hand Knotted",
    image: "/rugs/set1-texture.png",
    paragraphs: [
      "Hand-knotting found its way into Indian heritage from Persia, giving it its name, Persian Hand-knotting. It’s uniqueness in art is through its style of printing; knot by knot and line by line, paying attention to each intricate detail. It’s a process taking a minimum of 2 months, ranging up to almost a year depending on the quality and size of carpet being woven.",
      "Differentiating each knot was originally done by memory, where weavers would sing out the colors of the line of knots called Boli weaving. This later evolved to the use of design maps, which helped accommodate a rapidly changing design palate. Artisans place the design map at the base of the loom and use each pixel in a chart as a reference to a knot."
    ]
  },
  {
    id: "hand-tufted",
    title: "Hand Tufted",
    image: "/rugs/set2-texture.png",
    paragraphs: [
      "An artisan first places a backing fabric on an iron frame and the desired pattern is traced on it. The artisan then uses a little wooden contraption, to push the intended yarn into the fabric, a process called tufting. The tufting gun hooks and pulls yarn through the backing to form loops or piles into the outlined areas.",
      "Once the carpet is completed and up to grade, a canvas backing is bonded to the rug. This protects the tufted yarn from shedding and gives a distinctly different look to the rug. These cost effective rugs take 2 months to craft and last for 5-7 years."
    ]
  },
  {
    id: "handloom",
    title: "Handloom",
    image: "/rugs/set3-texture.png",
    paragraphs: [
      "Very similar to handloom textile, a carpet is woven on a loom. The loom holds the warp (the vertical threads) in place and allows the interweaving of the weft (horizontal threads). A shuttle is moved across with a pedal to interlock each line.",
      "This method is easiest for monotone rugs and gives a printed finish to the carpet. If the carpet has to be designed with multiple colors, the color of yarn needs to be changed at the right place to help create the final design. Handloom rugs are crafted with a loop pile and is then cut to make a cut pile. Intermixing loop and cut pile gives a unique color effect to the rugs, especially for bamboo silk, as the shine of the color is different along the length of the yarn as compared to the tip. These rugs are crafted in 2 months and can last for 10-12 years."
    ]
  },
  {
    id: "flat-weave",
    title: "Flat Weave",
    image: "/rugs/set1-room.png",
    paragraphs: [
      "In essence, a flatweave is a thick cloth made of cotton or wool. A Dhurrie is a flatweave from India, while a Kilim is from Persia. These rugs are woven by interlocking warp and weft threads, similar to making textile. They are mobile, versatile, durable and cost-friendly which gave way to a large range of weaving patterns, designs and colors.",
      "Once the carpet is completed and up to grade, a canvas backing is bonded to the rug. This protects the tufted yarn from shedding and gives a distinctly different look to the rug. These cost effective rugs take 2 months to craft and last for 5-7 years."
    ]
  }
];

export default function TechniqueList() {
  return (
    <section className="w-full pb-24 md:pb-40 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col gap-24 md:gap-32">
        {techniques.map((technique, index) => {
          const isReversed = index % 2 !== 0;

          return (
            <div
              key={technique.id}
              className={`flex flex-col ${
                isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
              } items-center gap-12 lg:gap-24`}
            >
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, x: isReversed ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
                className="flex-1 w-full aspect-square relative overflow-hidden bg-[var(--surface-primary)] border border-[var(--border-secondary)]"
              >
                <Image
                  src={technique.image}
                  alt={technique.title}
                  fill
                  className="object-cover transition-transform duration-[1.5s] hover:scale-105 ease-[cubic-bezier(0.22,1,0.36,1)]"
                />
              </motion.div>

              {/* Text Side */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
                className="flex-1 w-full flex flex-col justify-center"
              >
                <span className="font-sans text-xs text-[var(--text-muted)] tracking-widest mb-6 uppercase">
                  Technique 0{index + 1}
                </span>
                <h2 className="font-serif text-4xl md:text-5xl text-[var(--text-primary)] mb-8">
                  {technique.title}
                </h2>
                <div className="flex flex-col gap-6">
                  {technique.paragraphs.map((p, i) => (
                    <p key={i} className="font-sans text-base md:text-lg text-[var(--text-secondary)] leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
