"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { UploadCloud, Video, MapPin, Building2, MessageCircle, Mail, FileText, X } from "lucide-react";

export default function ContactInfoSection() {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    projectType: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const subjectParam = searchParams?.get('subject');
    if (subjectParam) {
      setFormData(prev => ({ ...prev, subject: subjectParam }));
    }
  }, [searchParams]);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [responseMessage, setResponseMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesAdded = (newFiles: FileList | File[] | null) => {
    if (!newFiles) return;
    setFileError("");
    const fileArray = Array.from(newFiles);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSizeBytes = 25 * 1024 * 1024; // 25MB

    const acceptedFiles: File[] = [];
    for (const file of fileArray) {
      const ext = file.name.split('.').pop()?.toLowerCase() || "";
      if (!['pdf', 'jpg', 'jpeg', 'png'].includes(ext) || (!validTypes.includes(file.type) && file.type !== "")) {
        setFileError(`Invalid format: ${file.name}. Only PDF, JPG, and PNG files are allowed.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        setFileError(`File too large: ${file.name}. Maximum size is 25MB.`);
        return;
      }
      acceptedFiles.push(file);
    }

    if (files.length + acceptedFiles.length > 5) {
      setFileError("You can upload a maximum of 5 files.");
      return;
    }

    setFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setResponseMessage("");
    setFileError("");

    const submitData = new FormData();
    submitData.append('fullName', formData.fullName);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    submitData.append('location', formData.location);
    submitData.append('projectType', formData.projectType);
    submitData.append('subject', formData.subject);
    submitData.append('message', formData.message);

    files.forEach((file) => {
      submitData.append('files', file);
    });
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: submitData, // Browser sets multipart/form-data boundaries automatically
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setResponseMessage(data.message || "Thank you. Your request has been sent successfully. We will get back to you within 24 hours.");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          location: "",
          projectType: "",
          subject: "",
          message: "",
        });
        setFiles([]);
        
        // Reset status after some time
        setTimeout(() => {
          setStatus("idle");
          setResponseMessage("");
        }, 5000);
      } else {
        setStatus("error");
        setResponseMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error: any) {
      setStatus("error");
      setResponseMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <section className="w-full pt-4 md:pt-6 lg:pt-8 pb-8 md:pb-12 lg:pb-16 px-4 md:px-8 lg:px-16 bg-[var(--bg-primary)]">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* ── Left Column: CONTACT INFORMATION & QUOTE ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center gap-10 py-4"
          >
            <div>
              <h2 className="font-sans italic text-[clamp(24px,5vw,56px)] text-[var(--accent-primary)] font-light leading-tight mb-6">
                &quot;Every exceptional space begins with a conversation.&quot;
              </h2>
              <p className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed max-w-[90%]">
                Whether you are looking to redesign a single room, seeking bespoke handmade rugs, or planning a full-scale commercial project, our team is here to bring your vision to life. Reach out directly or submit a studio request.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-sans text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)] border-b border-[var(--border-secondary)] pb-2">
                Direct Studio Contact
              </h4>
              <div className="flex flex-col gap-4">
                <a href="https://wa.me/971521236888" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors group">
                  <div className="w-10 h-10 rounded-full border border-[var(--border-secondary)] bg-white flex items-center justify-center group-hover:border-[var(--accent-primary)] transition-colors shadow-sm">
                    <MessageCircle size={18} strokeWidth={1.5} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
                  </div>
                  <span className="font-sans text-xs md:text-sm">WhatsApp Studio Line (+971 52 123 6888)</span>
                </a>
                <a href="mailto:connect@houseofdecor.ae" className="flex items-center gap-4 text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors group">
                  <div className="w-10 h-10 rounded-full border border-[var(--border-secondary)] bg-white flex items-center justify-center group-hover:border-[var(--accent-primary)] transition-colors shadow-sm">
                    <Mail size={18} strokeWidth={1.5} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
                  </div>
                  <span className="font-sans text-xs md:text-sm">connect@houseofdecor.ae</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* ── Right Column: STUDIO REQUEST FORM ── */}
          <motion.div
            id="studio-request"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-[var(--bg-secondary)] p-6 md:p-8 border border-[var(--border-secondary)] shadow-sm flex flex-col h-full"
          >
            <div className="text-center mb-6">
              <h3 className="font-sans text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-primary)] mb-1.5">
                Studio Request
              </h3>
              <p className="font-sans text-[11px] md:text-xs text-[var(--text-secondary)]">
                Please share the details of your project.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-3 py-2.5 text-xs font-sans outline-none focus:border-[var(--border-primary)] transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-3 py-2.5 text-xs font-sans outline-none focus:border-[var(--border-primary)] transition-colors"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone / WhatsApp"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-3 py-2.5 text-xs font-sans outline-none focus:border-[var(--border-primary)] transition-colors"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location (City, Country)"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-3 py-2.5 text-xs font-sans outline-none focus:border-[var(--border-primary)] transition-colors"
                />
              </div>

              <div className="relative">
                <select
                  name="projectType"
                  required
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full appearance-none bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-3 py-2.5 text-xs font-sans outline-none focus:border-[var(--border-primary)] transition-colors text-[var(--text-secondary)]"
                >
                  <option value="" disabled className="bg-[var(--bg-secondary)]">Project Type</option>
                  <option value="residential" className="bg-[var(--bg-secondary)]">Residential</option>
                  <option value="commercial" className="bg-[var(--bg-secondary)]">Commercial / Hospitality</option>
                  <option value="other" className="bg-[var(--bg-secondary)]">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--text-secondary)]">
                  <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>

              <input
                type="text"
                name="subject"
                placeholder="Subject / Enquiry Type"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-3 py-2.5 text-xs font-sans outline-none focus:border-[var(--border-primary)] transition-colors"
              />

              <textarea
                name="message"
                placeholder="Tell us about your project"
                rows={3}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-3 py-2.5 text-xs font-sans outline-none focus:border-[var(--border-primary)] transition-colors resize-none"
              ></textarea>

              <div className="mt-1">
                <p className="font-sans text-[10px] text-[var(--text-secondary)] mb-1.5">
                  Upload Floor Plans, Moodboards or Reference Images (Optional)
                </p>
                <input
                  type="file"
                  id="studio-file-upload"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                  className="hidden"
                  onChange={(e) => handleFilesAdded(e.target.files)}
                />
                <label
                  htmlFor="studio-file-upload"
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDragging(false);
                    if (e.dataTransfer.files) {
                      handleFilesAdded(e.dataTransfer.files);
                    }
                  }}
                  className={`w-full border-2 border-dashed transition-colors py-4 flex flex-col items-center justify-center cursor-pointer ${
                    isDragging
                      ? "border-[var(--accent-primary)] bg-[var(--bg-tertiary)]"
                      : "border-[var(--border-secondary)] bg-[var(--bg-primary)] hover:bg-[var(--bg-tertiary)]"
                  }`}
                >
                  <UploadCloud className="text-[var(--text-muted)] mb-1.5" size={20} />
                  <p className="font-sans text-[11px] text-[var(--text-primary)] font-medium">Drag & drop files here or browse</p>
                  <p className="font-sans text-[9px] text-[var(--text-muted)] mt-0.5">PDF, JPG, PNG up to 25MB (Max 5 files)</p>
                </label>

                {fileError && (
                  <p className="text-[11px] font-sans text-red-600 mt-1.5">{fileError}</p>
                )}

                {files.length > 0 && (
                  <ul className="mt-2 flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {files.map((file, idx) => (
                      <li key={`${file.name}-${idx}`} className="flex items-center justify-between bg-[var(--bg-primary)] border border-[var(--border-secondary)] px-2.5 py-1.5 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileText size={14} className="text-[var(--accent-primary)] flex-shrink-0" />
                          <span className="font-sans text-[11px] text-[var(--text-primary)] truncate max-w-[180px] md:max-w-[220px]">{file.name}</span>
                          <span className="font-sans text-[10px] text-[var(--text-muted)] flex-shrink-0">
                            ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="text-[var(--text-muted)] hover:text-red-600 transition-colors p-0.5 ml-2"
                          aria-label="Remove file"
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full mt-auto bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] disabled:opacity-50 text-white font-sans text-[10px] md:text-xs uppercase tracking-widest py-3.5 transition-colors duration-300"
              >
                {status === "loading" ? "Submitting..." : "Submit Request"}
              </button>
              
              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-sans text-green-700 text-center mt-1"
                >
                  {responseMessage || "Thank you. Your request has been sent successfully."}
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-sans text-red-700 text-center mt-1"
                >
                  {responseMessage || "Something went wrong. Please try again."}
                </motion.p>
              )}
              
              <p className="text-center font-sans text-[10px] text-[var(--text-secondary)] mt-1">
                Our design team typically responds within 24-48 hours.
              </p>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
