"use client";

import React from "react";
import { motion } from "framer-motion";
import "./ProcessSection.css";

const DUMMY_IMAGES = {
  tall: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800",
  topCenter: "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=600",
  bottomCenter: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600"
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } 
  }
};

export default function ProcessSection() {
  return (
    <section className="process">
      <div className="process__container">
        
        {/* Top Header */}
        <div className="process__top">
          <motion.div 
            className="process__top-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <span className="process__eyebrow font-sans">Process</span>
            <h2 className="process__heading font-sans">
              <span>From vision,</span>
              <span>to</span>
              <span><em>your perfect rug</em></span>
            </h2>
          </motion.div>

          <motion.div 
            className="process__top-right"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <p className="process__description font-sans">
              Creating a bespoke rug should feel effortless. From the first conversation to the final installation, we handle every detail with precision and care.
            </p>
            <button className="process__cta font-sans">
              Start your Journey &rarr;
            </button>
          </motion.div>
        </div>

        {/* Steps Grid */}
        <motion.div 
          className="process__steps"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: {
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          <motion.div className="process__step process__step--active" variants={fadeInUp}>
            <span className="process__step-number font-serif">01</span>
            <h3 className="process__step-title font-sans">Discover & Consult</h3>
            <p className="process__step-desc font-sans">
              Browse our curated collection or book a free 30-minute consultation with one of our design experts. Tell us your vision and we listen.
            </p>
            <div className="process__step-mobile-image">
              <img src={DUMMY_IMAGES.tall} alt="Discover & Consult" />
            </div>
          </motion.div>

          <motion.div className="process__step" variants={fadeInUp}>
            <span className="process__step-number font-serif">02</span>
            <h3 className="process__step-title font-sans">Design & Customise</h3>
            <p className="process__step-desc font-sans">
              We take precise measurements, recommend materials and weaves, craft a bespoke piece tailored exactly to your space and taste.
            </p>
            <div className="process__step-mobile-image">
              <img src={DUMMY_IMAGES.topCenter} alt="Design & Customise" />
            </div>
          </motion.div>

          <motion.div className="process__step" variants={fadeInUp}>
            <span className="process__step-number font-serif">03</span>
            <h3 className="process__step-title font-sans">Delivered & Installed</h3>
            <p className="process__step-desc font-sans">
              Your handcrafted rug is delivered and installed by our team. We don't leave until you're completely delighted with the result.
            </p>
            <div className="process__step-mobile-image">
              <img src={DUMMY_IMAGES.bottomCenter} alt="Delivered & Installed" />
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile Testimonial (Hidden on Desktop) */}
        <motion.div 
          className="process__mobile-testimonial"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="process__testimonial">
            <div className="process__quote-icon">“</div>
            <p className="process__quote-text">
              The <em>Quality</em>, the feel, the entire experience was exceptional
            </p>
            <span className="process__quote-author font-sans">Manish Suthar</span>
          </div>
        </motion.div>

        {/* Media & Testimonial Grid */}
        <motion.div 
          className="process__media"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
        >
          {/* Left Large Image */}
          <motion.div className="process__media-left" variants={fadeInUp}>
            <div className="process__image-wrapper process__image-wrapper--left">
              <img src={DUMMY_IMAGES.tall} alt="Living room with beautiful rug" className="process__image" />
            </div>
          </motion.div>

          {/* Center Top Image */}
          <motion.div className="process__media-center-top" variants={fadeInUp}>
            <div className="process__image-wrapper process__image-wrapper--center-top">
              <img src={DUMMY_IMAGES.topCenter} alt="Rug detail" className="process__image" />
            </div>
          </motion.div>

          {/* Center Bottom Image */}
          <motion.div className="process__media-center-bottom" variants={fadeInUp}>
            <div className="process__image-wrapper process__image-wrapper--center-bottom">
              <img src={DUMMY_IMAGES.bottomCenter} alt="Rug craftsmanship" className="process__image" />
            </div>
          </motion.div>

          {/* Right Testimonial */}
          <motion.div className="process__media-right" variants={fadeInUp}>
            <div className="process__testimonial">
              <div className="process__quote-icon">“</div>
              <p className="process__quote-text">
                The <em>Quality</em>, the feel, the entire experience was exceptional
              </p>
              <span className="process__quote-author font-sans">Manish Suthar</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
