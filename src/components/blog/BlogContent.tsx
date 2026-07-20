"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Blog } from "../../lib/data/blogs";

export default function BlogContent({ blog }: { blog: Blog }) {
  const [activeSection, setActiveSection] = useState<string | undefined>(blog?.sections?.[0]?.id);
  const [openAccordion, setOpenAccordion] = useState<string | null>(blog?.sections?.[0]?.id || null);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.9]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

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
      <section className="w-full pt-12 md:pt-20 lg:pt-28 px-5 md:px-10 lg:px-16">
        <div className="max-w-[var(--container-lg)] mx-auto pb-8 md:pb-12 lg:pb-16 border-b border-[var(--border-secondary)]">
          <div className="max-w-[var(--container-md)] mx-auto flex flex-col gap-6">
            <Link href="/blog" className="group flex items-center gap-2 font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] w-fit transition-colors font-medium">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Journal
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
              className="flex flex-col gap-6"
            >
              <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-secondary)]">
                {blog.date}
              </span>
              <h1 className="font-sans font-light text-[2.25rem] sm:text-[2.75rem] md:text-[4rem] lg:text-[4rem] leading-[1.1] tracking-wide text-[var(--text-primary)] mb-4">
                {blog.title}
              </h1>
              <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
                {blog.excerpt}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div ref={imageContainerRef} className="w-full pt-4 md:pt-6 lg:pt-8 pb-8 md:pb-12 lg:pb-16 bg-[var(--bg-primary)] border-b border-[var(--border-secondary)] overflow-hidden flex justify-center">
        <motion.div 
          style={{ scale: imageScale, y: imageY }}
          className="w-full aspect-[4/3] lg:aspect-[16/9] min-h-[50vh] lg:min-h-[60vh] max-h-[85vh] relative bg-[var(--surface-primary)]"
        >
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            priority
            className="object-cover origin-bottom"
          />
        </motion.div>
      </div>

      {/* Blog Content with Sticky Sidebar */}
      <section className="w-full py-8 md:py-12 lg:py-16 px-5 md:px-10 lg:px-16 bg-[var(--bg-secondary)]">
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
                      <h2 className="font-sans font-light text-xl lg:text-2xl text-[var(--text-primary)] border-b border-[var(--border-secondary)] pb-6 mb-2">
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
              className="blog-content w-full max-w-[800px] mx-auto pb-32" 
              dangerouslySetInnerHTML={{ __html: blog.content || '' }} 
            />
          )}

        </div>
      </section>
    </article>
  );
}
