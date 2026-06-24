"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="py-24 lg:py-32 bg-[var(--bg-secondary)] text-[var(--text-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">

          {/* LEFT SIDE: Heading & Staggered Image Grid */}
          <div className="flex flex-col lg:col-span-5">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-12 leading-none tracking-wide">
              About Us
            </h2>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {/* Column 1 - No offset */}
              <div className="flex flex-col gap-4 md:gap-6">
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800"
                    alt="House of Decor Living Room"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800"
                    alt="House of Decor Interior Style"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Column 2 - Offset downwards */}
              <div className="flex flex-col gap-4 md:gap-6 mt-12 md:mt-20">
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800"
                    alt="Handmade Rug Details"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800"
                    alt="Rolled Premium Rug"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Text Content & CTA */}
          <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7 lg:pl-8 mt-8 md:mt-0">
            <p className="text-[var(--text-secondary)] text-[15px] md:text-xl leading-[1.8] md:leading-loose mb-6 md:mb-8 font-sans font-light">
              Welcome to House Of Decor, where premium craftsmanship meets timeless design. Our handmade rugs and carpets are expertly crafted by skilled artisans using the finest materials, bringing warmth, elegance, and lasting quality to every space.
            </p>

            <p className="text-[var(--text-secondary)] text-[15px] md:text-xl leading-[1.8] md:leading-loose mb-10 md:mb-12 font-sans font-light">
              From classic to contemporary styles, each piece is thoughtfully designed to elevate your home or office with beauty, comfort, and enduring craftsmanship.
            </p>

            <button className="px-8 py-4 md:px-10 md:py-5 border border-[var(--accent-primary)] bg-[var(--accent-primary)] text-black uppercase text-[10px] md:text-xs tracking-[0.2em] font-medium hover:bg-black hover:border-black hover:text-white transition-all duration-500 w-full md:w-max">
              Book Appointment
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
