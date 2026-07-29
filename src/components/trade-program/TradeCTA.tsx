"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ROLE_OPTIONS = [
  "Interior Designer",
  "Architect",
  "Developer",
  "Procurement / Purchasing",
  "Other",
];

const PROJECT_TYPE_OPTIONS = [
  "Residential",
  "Commercial / Hospitality",
  "Both",
];

export default function TradeCTA() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    professionalRole: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    projectType: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMessage("");

    // ── Build structured message body ──
    const lines: string[] = [
      "═══ DESIGNER TRADE PROGRAM APPLICATION ═══",
      "",
      "── Applicant Details ──",
      `Full Name: ${formData.fullName}`,
      `Company / Studio: ${formData.companyName}`,
      `Professional Role: ${formData.professionalRole}`,
      "",
      "── Contact Information ──",
      `Email: ${formData.email}`,
      `Phone / WhatsApp: ${formData.phone}`,
      formData.website ? `Website / Portfolio: ${formData.website}` : "",
      `Location: ${formData.location}`,
      "",
      "── Project Preferences ──",
      formData.projectType ? `Typical Project Type: ${formData.projectType}` : "Typical Project Type: Not specified",
      "",
    ];

    if (formData.message.trim()) {
      lines.push("── Additional Information ──");
      lines.push(formData.message.trim());
      lines.push("");
    }

    lines.push("═══════════════════════════════════════════");

    const structuredMessage = lines.filter((l) => l !== undefined).join("\n");

    // ── Map to existing contact API fields ──
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      projectType: formData.projectType || "trade-application",
      subject: "Designer Trade Program Application",
      message: structuredMessage,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setResponseMessage("Thank you for your application. Our team will review your details and get in touch within 48 hours.");
        setFormData({
          fullName: "",
          companyName: "",
          professionalRole: "",
          email: "",
          phone: "",
          website: "",
          location: "",
          projectType: "",
          message: "",
        });
        setTimeout(() => {
          setStatus("idle");
          setResponseMessage("");
        }, 6000);
      } else {
        setStatus("error");
        setResponseMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setResponseMessage("Unable to connect. Please try again later.");
    }
  };

  const inputClasses =
    "w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-4 py-3 text-xs font-sans outline-none focus:border-[var(--accent-primary)] transition-colors text-[var(--text-primary)] placeholder:text-[var(--text-muted)]";

  const selectClasses =
    "w-full appearance-none bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-4 py-3 text-xs font-sans outline-none focus:border-[var(--accent-primary)] transition-colors text-[var(--text-secondary)]";

  return (
    <section
      id="trade-application"
      className="w-full py-12 lg:py-20 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)]"
    >
      <div className="max-w-[var(--container-md)] mx-auto">
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as any }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="block text-[var(--text-secondary)] font-sans text-xs uppercase tracking-widest mb-6">
            Join The Program
          </span>
          <h2 className="font-sans text-xl md:text-2xl lg:text-3xl font-light leading-[1.2] tracking-tight text-[var(--text-primary)] mb-4">
            Apply for the Trade Program
          </h2>
          <p className="font-sans text-[var(--text-secondary)] text-sm md:text-base font-light leading-relaxed max-w-xl mx-auto">
            Complete the form below and our team will review your application within 48 hours.
          </p>
        </motion.div>

        {/* ── Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* ── Left: Info + Chat ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            <div>
              <h3 className="font-sans text-lg md:text-xl font-light text-[var(--text-primary)] mb-4">
                What happens next?
              </h3>
              <ul className="flex flex-col gap-4">
                {[
                  { step: "01", text: "We review your professional credentials and project portfolio." },
                  { step: "02", text: "A dedicated account manager will reach out to discuss your needs." },
                  { step: "03", text: "Once approved, you'll receive exclusive trade pricing and priority service." },
                ].map((item) => (
                  <li key={item.step} className="flex gap-4 items-start">
                    <span className="font-sans text-xs text-[var(--accent-primary)] tracking-widest font-medium mt-0.5 flex-shrink-0">
                      {item.step}
                    </span>
                    <p className="font-sans text-sm text-[var(--text-secondary)] font-light leading-relaxed">
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[var(--border-secondary)] pt-6">
              <p className="font-sans text-xs text-[var(--text-secondary)] mb-4">
                Prefer to discuss directly?
              </p>
              <a
                href="https://wa.me/971521236888?text=I%20would%20like%20to%20chat%20about%20the%20Designer%20Trade%20Program."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-[var(--accent-primary)] text-[#111] border border-[var(--accent-primary)] font-sans font-medium text-xs tracking-widest uppercase hover:bg-[var(--accent-secondary)] hover:border-[var(--accent-secondary)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] text-center"
              >
                Chat Now
              </a>
            </div>
          </motion.div>

          {/* ── Right: Application Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-3 bg-[var(--bg-primary)] border border-[var(--border-secondary)] p-6 md:p-8"
          >
            <div className="mb-6">
              <h3 className="font-sans text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)] mb-1.5">
                Trade Application
              </h3>
              <p className="font-sans text-[11px] md:text-xs text-[var(--text-secondary)]">
                Fields marked with * are required.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {/* Row 1: Name + Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name *"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company / Studio Name *"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* Row 2: Role */}
              <div className="relative">
                <select
                  name="professionalRole"
                  required
                  value={formData.professionalRole}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="" disabled>Professional Role *</option>
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role} className="bg-[var(--bg-secondary)]">
                      {role}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--text-secondary)]">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              {/* Row 3: Email + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClasses}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone / WhatsApp *"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* Row 4: Website + Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="url"
                  name="website"
                  placeholder="Website / Portfolio (Optional)"
                  value={formData.website}
                  onChange={handleChange}
                  className={inputClasses}
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location (City, Country) *"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className={inputClasses}
                />
              </div>

              {/* Row 5: Project Type */}
              <div className="relative">
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className={selectClasses}
                >
                  <option value="" disabled>Typical Project Type (Optional)</option>
                  {PROJECT_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type} className="bg-[var(--bg-secondary)]">
                      {type}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--text-secondary)]">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              {/* Row 6: Message */}
              <textarea
                name="message"
                placeholder="Tell us about your projects and how we can collaborate (Optional)"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className={`${inputClasses} resize-none`}
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full mt-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans text-[10px] md:text-xs uppercase tracking-widest py-4 transition-colors duration-300"
              >
                {status === "loading" ? "Submitting Application..." : "Submit Application"}
              </button>

              {/* Status Messages */}
              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-sans text-green-700 text-center mt-1"
                >
                  {responseMessage}
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-sans text-red-700 text-center mt-1"
                >
                  {responseMessage}
                </motion.p>
              )}

              <p className="text-center font-sans text-[10px] text-[var(--text-secondary)] mt-1">
                Applications are typically reviewed within 48 hours.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
