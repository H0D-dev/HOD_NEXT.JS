"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
      // Reset status after some time
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <section className="w-full py-16 md:py-20 px-6 md:px-16 lg:px-24 bg-[var(--bg-primary)]">
      <div className="max-w-[var(--container-md)] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-12 lg:gap-16">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
          >
            <span className="block text-[var(--text-muted)] font-sans text-xs uppercase tracking-widest mb-6 md:mb-8">
              Get in Touch
            </span>
            <h2 className="font-serif text-[clamp(40px,5vw,64px)] leading-[1.1] tracking-tight text-[var(--text-primary)] mb-8">
              Start Your Design Journey
            </h2>
            <p className="font-sans text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
              Whether you&apos;re looking for handcrafted rugs, premium curtains, or custom interior solutions, our team is ready to assist.
            </p>
            <p className="font-sans text-[var(--text-muted)] text-sm">
              Expected response within 24 hours.
            </p>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
            className="bg-[var(--surface-primary)] border border-[var(--border-secondary)] p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="font-sans text-xs uppercase tracking-wider text-[var(--text-secondary)]">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-[var(--bg-secondary)] border border-transparent focus:border-[var(--border-primary)] outline-none px-4 py-3 text-base font-sans text-[var(--text-primary)] transition-colors duration-300 placeholder:text-[var(--text-muted)]"
                    placeholder="Jane"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="font-sans text-xs uppercase tracking-wider text-[var(--text-secondary)]">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-[var(--bg-secondary)] border border-transparent focus:border-[var(--border-primary)] outline-none px-4 py-3 text-base font-sans text-[var(--text-primary)] transition-colors duration-300 placeholder:text-[var(--text-muted)]"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-sans text-xs uppercase tracking-wider text-[var(--text-secondary)]">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[var(--bg-secondary)] border border-transparent focus:border-[var(--border-primary)] outline-none px-4 py-3 text-base font-sans text-[var(--text-primary)] transition-colors duration-300 placeholder:text-[var(--text-muted)]"
                  placeholder="jane@example.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="subject" className="font-sans text-xs uppercase tracking-wider text-[var(--text-secondary)]">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-[var(--bg-secondary)] border border-transparent focus:border-[var(--border-primary)] outline-none px-4 py-3 text-base font-sans text-[var(--text-primary)] transition-colors duration-300 placeholder:text-[var(--text-muted)]"
                  placeholder="Inquiry about custom rugs"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-sans text-xs uppercase tracking-wider text-[var(--text-secondary)]">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-[var(--bg-secondary)] border border-transparent focus:border-[var(--border-primary)] outline-none px-4 py-3 text-base font-sans text-[var(--text-primary)] transition-colors duration-300 placeholder:text-[var(--text-muted)] resize-none"
                  placeholder="Tell us about your project..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full mt-2 px-8 py-4 border border-[var(--border-primary)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--accent-primary)] font-sans font-medium text-sm tracking-wider uppercase transition-all duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                {status === "loading" ? "Sending..." : "Send Message →"}
              </button>

              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-sans text-green-700 text-center mt-2"
                >
                  Thank you. Your message has been sent successfully. We will get back to you within 24 hours.
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-sans text-red-700 text-center mt-2"
                >
                  Something went wrong. Please try again.
                </motion.p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
