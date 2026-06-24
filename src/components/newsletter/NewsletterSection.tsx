"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";

export default function NewsletterSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="min-h-[100dvh] flex flex-col justify-center pt-28 pb-16 md:py-24 bg-[var(--bg-primary)] text-[var(--text-primary)] border-t border-[var(--border-secondary)] overflow-hidden">
      <div className="max-w-[var(--container-lg)] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
          
          {/* LEFT SIDE: Content + Form */}
          <div className="flex flex-col">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-md w-full"
            >
            <motion.span 
              variants={itemVariants}
              className="uppercase text-[10px] md:text-xs tracking-[0.2em] text-[var(--text-muted)] mb-4 md:mb-6 block font-sans"
            >
              Stay Inspired
            </motion.span>
            
            <motion.h2 
              variants={itemVariants}
              className="font-serif text-[38px] md:text-5xl lg:text-6xl mb-5 md:mb-8 leading-[1.1] md:leading-[0.9] text-[var(--text-primary)] relative inline-flex items-start"
            >
              <span className="inline-block max-w-[220px] md:max-w-none">
                Bring Luxury Home
              </span>
              <sup className="text-xl md:text-2xl font-light ml-2 mt-1 md:mt-0 tracking-normal text-[var(--text-secondary)]">(06)</sup>
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-[var(--text-secondary)] text-base md:text-lg leading-relaxed mb-8 md:mb-12 font-sans font-light"
            >
              Get exclusive access to new collections, design inspiration, and bespoke interior insights curated for refined living.
            </motion.p>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="p-8 border border-[var(--border-secondary)] bg-[var(--bg-secondary)] text-center"
              >
                <h3 className="font-sans text-2xl mb-2 text-[var(--accent-primary)] font-medium">Welcome to the Community</h3>
                <p className="text-[var(--text-secondary)] font-light">Thank you for joining. We will be in touch soon.</p>
              </motion.div>
            ) : (
              <motion.form 
                variants={itemVariants}
                onSubmit={handleSubmit} 
                className="flex flex-col gap-4 md:gap-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="firstName" className="sr-only">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      placeholder="First Name" 
                      className="w-full h-[54px] px-6 bg-white text-black border border-[#d1d1d1] focus:outline-none focus:border-black transition-colors font-sans placeholder-[#888] rounded-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="lastName" className="sr-only">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      placeholder="Last Name" 
                      className="w-full h-[54px] px-6 bg-white text-black border border-[#d1d1d1] focus:outline-none focus:border-black transition-colors font-sans placeholder-[#888] rounded-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="email" className="sr-only">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Email Address" 
                    className="w-full h-[54px] px-6 bg-white text-black border border-[#d1d1d1] focus:outline-none focus:border-black transition-colors font-sans placeholder-[#888] rounded-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="mt-2 h-[54px] px-10 bg-[var(--accent-primary)] text-black border border-[var(--accent-primary)] uppercase text-xs tracking-[0.2em] font-medium hover:bg-black hover:border-black hover:text-white transition-all duration-500 w-full rounded-none disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Joining..." : "Join Our Community \u2192"}
                </button>

                <p className="text-[10px] md:text-xs text-[var(--text-muted)] mt-1 md:mt-2 text-center tracking-wide uppercase">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </motion.form>
            )}
          </motion.div>
        </div>

        {/* RIGHT SIDE: Image */}
        <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[75vh] max-h-[700px] overflow-hidden group">
          <motion.div
            variants={imageVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200"
              alt="Luxury Interior Design Inspiration"
              fill
              className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>

      </div>
      </div>
    </section>
  );
}
