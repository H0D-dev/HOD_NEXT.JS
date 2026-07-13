"use client";

import { motion } from "framer-motion";

export default function TradeCTA() {
  return (
    <section className="w-full py-16 md:py-32 px-6 md:px-16 lg:px-24 bg-[#0D0D0D] text-white">
      <div className="max-w-[var(--container-md)] mx-auto text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
          className="max-w-3xl flex flex-col items-center"
        >
          <span className="block text-[#8C8C8C] font-sans text-xs uppercase tracking-widest mb-8">
            Join The Program
          </span>
          <h2 className="font-serif text-[clamp(32px,5vw,64px)] leading-[1.1] tracking-tight mb-8">
            Ready to begin your design journey?
          </h2>
          <p className="font-sans text-[#D0D0D0] text-lg md:text-xl leading-relaxed mb-16 max-w-xl">
            Gain exclusive access to premium handmade rugs, bespoke carpets, and unparalleled trade benefits.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
            <a 
              href="https://wa.me/971521236888?text=I%20would%20like%20to%20chat%20about%20the%20Designer%20Trade%20Program."
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-white text-[#0D0D0D] border border-white font-sans font-medium text-sm tracking-widest uppercase hover:bg-transparent hover:text-[var(--bg-primary)] transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] w-full sm:w-auto text-center"
            >
              Chat Now
            </a>
            <a 
              href="https://wa.me/971521236888?text=I%20would%20like%20to%20apply%20for%20the%20Designer%20Trade%20Program."
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-transparent text-white border border-[#333333] font-sans font-medium text-sm tracking-widest uppercase hover:border-white transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] w-full sm:w-auto text-center"
            >
              Apply for Trade Program
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
