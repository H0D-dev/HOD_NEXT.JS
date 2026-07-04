"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Blog } from "../../lib/data/blogs";

export default function BlogContent({ blog }: { blog: Blog }) {
  const [activeSection, setActiveSection] = useState<string | undefined>(blog?.sections?.[0]?.id);
  const [openAccordion, setOpenAccordion] = useState<string | null>(blog?.sections?.[0]?.id || null);

  // Intersection Observer for Desktop Sidebar
  useEffect(() => {
    if (!blog?.sections?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
    );

    blog.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [blog]);

  const handleAccordionClick = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <article className="w-full bg-[var(--bg-primary)]">

      {/* Blog Hero */}
      <section className="w-full pt-32 pb-16 md:pt-48 md:pb-24 px-6 md:px-16 lg:px-24 border-b border-[var(--border-secondary)]">
        <div className="max-w-[var(--container-md)] mx-auto flex flex-col gap-8">
          <Link href="/blog" className="group flex items-center gap-2 font-sans text-sm tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] w-fit transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
            className="flex flex-col gap-6"
          >
            <span className="font-sans text-sm uppercase tracking-widest text-[var(--accent-primary)] font-medium">
              {blog.date}
            </span>
            <h1 className="font-serif text-[clamp(40px,6vw,64px)] leading-[1.05] tracking-tight text-[var(--text-primary)]">
              {blog.title}
            </h1>
            <p className="font-sans text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed">
              {blog.excerpt}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] min-h-[40vh] max-h-[70vh] relative bg-[var(--surface-primary)]">
        <Image
          src={blog.image}
          alt={blog.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Blog Content with Sticky Sidebar */}
      <section className="w-full py-16 md:py-32 px-6 md:px-16 lg:px-24 bg-[var(--bg-secondary)]">
        <div className="max-w-[var(--container-lg)] mx-auto flex flex-col md:flex-row gap-12 lg:gap-24 relative">

          {blog.sections && blog.sections.length > 0 ? (
            <>
              {/* Mobile Accordion Navigation */}
              <div className="md:hidden w-full flex flex-col border-t border-[var(--border-secondary)]">
                <h2 className="font-serif text-3xl text-[var(--text-primary)] mb-8 pt-8">Article Contents</h2>
                {blog.sections.map((section) => (
                  <div key={`mobile-${section.id}`} className="border-b border-[var(--border-secondary)]">
                    <button
                      onClick={() => handleAccordionClick(section.id)}
                      className="w-full py-6 flex items-center justify-between font-serif text-2xl text-[var(--text-primary)]"
                    >
                      {section.title}
                      <ChevronDown
                        className={`transition-transform duration-300 ${openAccordion === section.id ? 'rotate-180' : ''}`}
                        size={24}
                        strokeWidth={1}
                      />
                    </button>
                    <AnimatePresence>
                      {openAccordion === section.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as any }}
                          className="overflow-hidden"
                        >
                          <div className="pb-8 flex flex-col gap-6">
                            {section.content.map((paragraph, i) => (
                              <p key={i} className="font-sans text-[var(--text-secondary)] text-lg leading-relaxed">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Desktop Sticky Sidebar */}
              <aside className="hidden md:block w-64 lg:w-80 shrink-0 h-max sticky top-32">
                <div className="flex flex-col gap-1 border-l border-[var(--border-secondary)]">
                  <h3 className="font-sans text-xs uppercase tracking-widest text-[var(--text-muted)] mb-8 px-6">
                    In this article
                  </h3>
                  <ul className="flex flex-col">
                    {blog.sections.map((section) => (
                      <li key={`desktop-nav-${section.id}`}>
                        <a
                          href={`#${section.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`block w-full text-left px-6 py-4 font-sans text-base transition-all duration-300 border-l-2 -ml-[1px] ${activeSection === section.id
                              ? "text-[var(--text-primary)] border-[var(--border-primary)] bg-[var(--surface-primary)]"
                              : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-primary)] hover:border-[var(--border-secondary)]"
                            }`}
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>

              {/* Desktop Content Area (Continuous Scroll) */}
              <div className="hidden md:block flex-1 pb-32">
                <div className="flex flex-col gap-24">
                  {blog.sections.map((section) => (
                    <motion.div
                      id={section.id}
                      key={`content-${section.id}`}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
                      className="flex flex-col gap-8 scroll-mt-32"
                    >
                      <h2 className="font-serif text-3xl lg:text-4xl text-[var(--text-primary)] border-b border-[var(--border-secondary)] pb-6 mb-2">
                        {section.title}
                      </h2>
                      <div className="flex flex-col gap-6">
                        {section.content.map((paragraph, i) => (
                          <p key={i} className="font-sans text-[var(--text-secondary)] text-lg leading-relaxed">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="w-full max-w-[800px] mx-auto prose prose-lg prose-headings:font-serif prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-a:text-[var(--accent-primary)] pb-32" dangerouslySetInnerHTML={{ __html: blog.content || '' }} />
          )}

        </div>
      </section>
    </article>
  );
}
