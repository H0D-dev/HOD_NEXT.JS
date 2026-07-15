"use client";

import { motion } from "framer-motion";
import { Truck, HeadphonesIcon, Ruler, CreditCard } from "lucide-react";

const supportServices = [
  {
    icon: Truck,
    title: "Fast Shipping",
    desc: "Enjoy fast shipping on all of our in-stock rugs. Receive your rug in 5-16 days."
  },
  {
    icon: HeadphonesIcon,
    title: "Virtual Assistance",
    desc: "Receive personalized online support from our professional consultants. A dedicated specialist will assist you with design advice and collections."
  },
  {
    icon: Ruler,
    title: "Measurement & Installation",
    desc: "Ensure the perfect fit for your space with our professional measurement and installation services."
  },
  {
    icon: CreditCard,
    title: "Pay Over Time, No Fees",
    desc: "You can purchase your favorite styles with flexible monthly payments, offering 0% interest and no hidden fees."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function SupportServices() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-lg)] mx-auto flex flex-col gap-24 lg:gap-32">
        
        {/* Mission Statement block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          className="max-w-4xl mx-auto text-center flex flex-col gap-8"
        >
          <p className="font-sans text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
            Through our exclusive network of international suppliers, we provide architects, designers, and private clients with the highest quality materials to create stunning commercial and residential environments.
          </p>
          <p className="font-sans text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
            Our mission extends beyond aesthetics; we are committed to promoting sustainable practices within the home décor industry. By sourcing eco-friendly materials and supporting artisan communities, we strive to create a sustainable business ecosystem that celebrates craftsmanship and creativity.
          </p>
          <p className="font-sans text-base md:text-lg text-[var(--text-primary)] font-light italic leading-relaxed mt-4 border-l-4 border-[var(--accent-primary)] pl-4 md:pl-6 text-left">
            "Whether you’re looking to design a single statement piece or complete a comprehensive interior overhaul, our dedicated team is here to guide you every step of the way. Let us help you bring your vision to life with elegance and sustainability at the forefront of our service."
          </p>
        </motion.div>

        {/* Support Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8 border-t border-[var(--border-secondary)] pt-16 lg:pt-24"
        >
          {supportServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-[var(--surface-primary)] p-8 border border-[var(--border-secondary)] flex flex-col gap-6 hover:-translate-y-2 transition-transform duration-500 hover:border-[var(--border-primary)]"
              >
                <div className="text-[var(--text-muted)]">
                  <Icon size={32} strokeWidth={1} />
                </div>
                <div>
                  <h4 className="font-serif text-xl md:text-2xl text-[var(--text-primary)] mb-3">
                    {service.title}
                  </h4>
                  <p className="font-sans text-[var(--text-secondary)] text-sm leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
