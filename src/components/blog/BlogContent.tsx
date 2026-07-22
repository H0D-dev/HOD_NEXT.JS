"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ArrowRight } from "lucide-react";
import { Blog } from "../../lib/data/blogs";

export default function BlogContent({ blog, nextBlog }: { blog: Blog, nextBlog?: Blog | null }) {
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

      {/* Blog Header */}
      <section className="w-full pt-20 lg:pt-32 pb-12 md:pb-16 lg:pb-20 px-4 md:px-6 lg:px-10 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <Link href="/blog" className="group flex items-center gap-2 font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors font-medium mb-10">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
            className="flex flex-col items-center gap-6"
          >
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)]">
              {blog.date}
            </span>
            <h1 className="font-sans font-light text-xl md:text-2xl lg:text-3xl leading-tight tracking-wide text-[var(--text-primary)] max-w-3xl">
              {blog.title}
            </h1>
            <p className="font-sans text-sm md:text-base font-light leading-relaxed text-[var(--text-secondary)] max-w-2xl mt-2">
              {blog.excerpt}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Content with Sticky Sidebar */}
      <section className="w-full py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-10 bg-[var(--bg-secondary)]">
        <div className="max-w-[var(--container-lg)] mx-auto flex flex-col md:flex-row gap-12 lg:gap-24 relative">

          {blog.sections && blog.sections.length > 0 ? (
            <>
              {/* Mobile Accordion Navigation */}
              <div className="md:hidden w-full flex flex-col border-t border-[var(--border-secondary)]">
                <h2 className="font-sans font-light text-xl lg:text-2xl text-[var(--text-primary)] mb-8 pt-8">Article Contents</h2>
                {blog.sections.map((section) => (
                  <div key={`mobile-${section.id}`} className="border-b border-[var(--border-secondary)]">
                    <button
                      onClick={() => handleAccordionClick(section.id)}
                      className="w-full py-6 flex items-center justify-between font-sans font-light text-lg md:text-xl text-[var(--text-primary)]"
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
                              <p key={i} className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
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
                  <h3 className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-muted)] mb-8 px-6">
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
                          className={`block w-full text-left px-6 py-4 font-sans text-sm md:text-base transition-all duration-300 border-l-2 -ml-[1px] ${activeSection === section.id
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
              <div className="hidden md:block flex-1">
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
                      <h2 className="font-sans font-light text-4xl lg:text-5xl text-[var(--text-primary)] border-b border-[var(--border-secondary)] pb-6 mb-2">
                        {section.title}
                      </h2>
                      <div className="flex flex-col gap-6">
                        {section.content.map((paragraph, i) => (
                          <p key={i} className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
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
            <div 
              className="blog-content w-full max-w-[800px] mx-auto" 
              dangerouslySetInnerHTML={{ __html: blog.content || '' }} 
            />
          )}

        </div>
      </section>

      {/* Next Article Section */}
      {nextBlog && (
        <section className="w-full py-6 md:py-8 lg:py-10 bg-[var(--bg-primary)] px-4 md:px-6 lg:px-10">
          <div className={`mx-auto ${blog.sections && blog.sections.length > 0 ? 'max-w-[var(--container-lg)]' : 'max-w-[800px]'}`}>
            <span className="block font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-muted)] mb-4 md:mb-6 text-left">
              Read Next
            </span>
            <Link href={`/blog/${nextBlog.slug}`} className="group flex flex-col md:flex-row gap-6 md:gap-8 justify-between items-start md:items-center">
              <div className="flex flex-col gap-2 md:gap-3 flex-1 pr-4 lg:pr-8">
                <h2 className="font-sans font-medium text-xl md:text-2xl text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent-primary)] transition-colors duration-500 line-clamp-2">
                  {nextBlog.title}
                </h2>
                <p className="font-sans text-sm text-[var(--text-secondary)] line-clamp-2">
                  {nextBlog.excerpt}
                </p>
              </div>
              <div className="shrink-0">
                <div className="flex items-center gap-2 font-sans text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium text-[var(--text-primary)] pb-1 border-b border-[var(--border-primary)] group-hover:gap-4 transition-all duration-300">
                  Read Article
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

    </article>
  );
}
