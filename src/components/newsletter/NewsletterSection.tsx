"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="min-h-[100dvh] flex flex-col justify-center py-16 bg-[#111111] text-white overflow-hidden">
      <div className="max-w-[var(--container-lg)] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
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
              className="uppercase text-xs tracking-[0.2em] text-[#D0D0D0] mb-6 block font-sans"
            >
              Stay Inspired
            </motion.span>
            
            <motion.h2 
              variants={itemVariants}
              className="font-serif text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.1]"
            >
              Bring Luxury Home
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-[#D0D0D0] text-lg leading-relaxed mb-12 font-sans font-light"
            >
              Get exclusive access to new collections, design inspiration, and bespoke interior insights curated for refined living.
            </motion.p>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="p-8 border border-[#333333] bg-[#161616] text-center"
              >
                <h3 className="font-serif text-2xl mb-2 text-[#F7F77E]">Welcome to the Community</h3>
                <p className="text-[#D0D0D0] font-light">Thank you for joining. We will be in touch soon.</p>
              </motion.div>
            ) : (
              <motion.form 
                variants={itemVariants}
                onSubmit={handleSubmit} 
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="firstName" className="sr-only">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      placeholder="First Name" 
                      className="w-full px-6 py-4 bg-[#181818] text-white border border-[#333333] focus:outline-none focus:border-[#F7F77E] transition-colors font-sans placeholder-[#8C8C8C] rounded-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="lastName" className="sr-only">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      placeholder="Last Name" 
                      className="w-full px-6 py-4 bg-[#181818] text-white border border-[#333333] focus:outline-none focus:border-[#F7F77E] transition-colors font-sans placeholder-[#8C8C8C] rounded-none"
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
                    className="w-full px-6 py-4 bg-[#181818] text-white border border-[#333333] focus:outline-none focus:border-[#F7F77E] transition-colors font-sans placeholder-[#8C8C8C] rounded-none"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="mt-4 px-10 py-5 bg-[#F7F77E] text-[#111111] border border-[#F7F77E] uppercase text-xs tracking-[0.2em] font-medium hover:bg-[#E0E065] hover:border-[#E0E065] transition-all duration-300 w-full rounded-none disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Joining..." : "Join Our Community \u2192"}
                </button>

                <p className="text-xs text-[#8C8C8C] mt-2 text-center tracking-wide">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </motion.form>
            )}
          </motion.div>
        </div>

        {/* RIGHT SIDE: Image */}
        <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[75vh] max-h-[700px] overflow-hidden group">
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
